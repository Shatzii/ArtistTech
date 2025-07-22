import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { nanoid } from 'nanoid';

export interface CollaborativeUser {
  id: string;
  name: string;
  email: string;
  cursor?: { x: number; y: number };
  selectedTrack?: number;
  isActive: boolean;
  color: string;
  ws: WebSocket;
}

export interface CollaborativeEdit {
  id: string;
  userId: string;
  type: 'track_edit' | 'volume_change' | 'effect_change' | 'timeline_edit';
  trackId?: number;
  data: any;
  timestamp: number;
}

export interface CollaborativeSession {
  sessionId: string;
  projectId: string;
  users: Map<string, CollaborativeUser>;
  edits: CollaborativeEdit[];
  createdAt: number;
  lastActivity: number;
}

export class CollaborativeEngine {
  private wss: WebSocketServer;
  private sessions: Map<string, CollaborativeSession> = new Map();
  private userSessions: Map<string, string> = new Map(); // userId -> sessionId
  private conflictResolver: ConflictResolver;
  
  constructor(server: Server) {
    this.wss = new WebSocketServer({ 
      server, 
      path: '/ws/collaboration'
    });
    
    this.conflictResolver = new ConflictResolver();
    this.wss.on('connection', this.handleConnection.bind(this));
    console.log('🤝 Collaborative Engine initialized - Real-time editing ready');
    
    // Cleanup inactive sessions every 5 minutes
    setInterval(() => {
      this.cleanupInactiveSessions();
    }, 5 * 60 * 1000);
    
    // Heartbeat for connection health
    setInterval(() => {
      this.sendHeartbeat();
    }, 30000);
  }

  private handleConnection(ws: WebSocket) {
    console.log('New collaborative connection established');
    
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        this.handleMessage(ws, message);
      } catch (error) {
        console.error('Error parsing collaborative message:', error);
      }
    });

    ws.on('close', () => {
      this.handleDisconnection(ws);
    });

    ws.on('error', (error) => {
      console.error('Collaborative WebSocket error:', error);
    });
  }

  private handleMessage(ws: WebSocket, message: any) {
    switch (message.type) {
      case 'join_session':
        this.handleJoinSession(ws, message);
        break;
      
      case 'cursor_update':
        this.handleCursorUpdate(ws, message);
        break;
      
      case 'track_selection':
        this.handleTrackSelection(ws, message);
        break;
      
      case 'apply_edit':
        this.handleApplyEdit(ws, message);
        break;
      
      default:
        console.log('Unknown collaborative message type:', message.type);
    }
  }

  private handleJoinSession(ws: WebSocket, message: any) {
    const { projectId, user } = message;
    
    // Find existing session or create new one
    let session = Array.from(this.sessions.values()).find(s => s.projectId === projectId);
    
    if (!session) {
      const sessionId = nanoid();
      session = {
        sessionId,
        projectId,
        users: new Map(),
        edits: [],
        createdAt: Date.now(),
        lastActivity: Date.now()
      };
      this.sessions.set(sessionId, session);
    }

    // Create collaborative user
    const collaborativeUser: CollaborativeUser = {
      ...user,
      id: user.id || nanoid(),
      isActive: true,
      ws
    };

    // Add user to session
    session.users.set(collaborativeUser.id, collaborativeUser);
    this.userSessions.set(collaborativeUser.id, session.sessionId);
    session.lastActivity = Date.now();

    // Send session joined confirmation
    ws.send(JSON.stringify({
      type: 'session_joined',
      session: this.serializeSession(session),
      isHost: session.users.size === 1
    }));

    // Notify other users
    this.broadcastToSession(session.sessionId, {
      type: 'user_joined',
      user: this.serializeUser(collaborativeUser)
    }, collaborativeUser.id);

    console.log(`User ${collaborativeUser.name} joined session ${session.sessionId} for project ${projectId}`);
  }

  private handleCursorUpdate(ws: WebSocket, message: any) {
    const userId = this.getUserIdByWebSocket(ws);
    if (!userId) return;

    const sessionId = this.userSessions.get(userId);
    if (!sessionId) return;

    const session = this.sessions.get(sessionId);
    if (!session) return;

    const user = session.users.get(userId);
    if (!user) return;

    // Update user cursor
    user.cursor = message.cursor;
    session.lastActivity = Date.now();

    // Broadcast cursor update
    this.broadcastToSession(sessionId, {
      type: 'cursor_update',
      userId,
      cursor: message.cursor
    }, userId);
  }

  private handleTrackSelection(ws: WebSocket, message: any) {
    const userId = this.getUserIdByWebSocket(ws);
    if (!userId) return;

    const sessionId = this.userSessions.get(userId);
    if (!sessionId) return;

    const session = this.sessions.get(sessionId);
    if (!session) return;

    const user = session.users.get(userId);
    if (!user) return;

    // Update user's selected track
    user.selectedTrack = message.trackId;
    session.lastActivity = Date.now();

    // Broadcast track selection
    this.broadcastToSession(sessionId, {
      type: 'track_selection',
      userId,
      trackId: message.trackId
    }, userId);
  }

  private handleApplyEdit(ws: WebSocket, message: any) {
    const userId = this.getUserIdByWebSocket(ws);
    if (!userId) return;

    const sessionId = this.userSessions.get(userId);
    if (!sessionId) return;

    const session = this.sessions.get(sessionId);
    if (!session) return;

    const edit: CollaborativeEdit = message.edit;
    
    // Add edit to session history
    session.edits.push(edit);
    session.lastActivity = Date.now();

    // Keep only last 100 edits
    if (session.edits.length > 100) {
      session.edits = session.edits.slice(-100);
    }

    // Broadcast edit to all users
    this.broadcastToSession(sessionId, {
      type: 'edit_applied',
      edit
    });

    console.log(`Edit applied in session ${sessionId}: ${edit.type} by ${userId}`);
  }

  private handleDisconnection(ws: WebSocket) {
    const userId = this.getUserIdByWebSocket(ws);
    if (!userId) return;

    const sessionId = this.userSessions.get(userId);
    if (!sessionId) return;

    const session = this.sessions.get(sessionId);
    if (!session) return;

    // Remove user from session
    session.users.delete(userId);
    this.userSessions.delete(userId);

    // Notify other users
    this.broadcastToSession(sessionId, {
      type: 'user_left',
      userId
    });

    // Remove empty sessions
    if (session.users.size === 0) {
      this.sessions.delete(sessionId);
      console.log(`Session ${sessionId} removed (no users)`);
    }

    console.log(`User ${userId} left session ${sessionId}`);
  }

  private getUserIdByWebSocket(ws: WebSocket): string | null {
    for (const [sessionId, session] of this.sessions) {
      for (const [userId, user] of session.users) {
        if (user.ws === ws) {
          return userId;
        }
      }
    }
    return null;
  }

  private broadcastToSession(sessionId: string, message: any, excludeUserId?: string) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const messageStr = JSON.stringify(message);

    for (const [userId, user] of session.users) {
      if (excludeUserId && userId === excludeUserId) continue;
      
      if (user.ws.readyState === WebSocket.OPEN) {
        user.ws.send(messageStr);
      }
    }
  }

  private serializeSession(session: CollaborativeSession) {
    return {
      sessionId: session.sessionId,
      projectId: session.projectId,
      users: Array.from(session.users.values()).map(this.serializeUser),
      edits: session.edits,
      isHost: false // Will be set correctly when sending
    };
  }

  private serializeUser(user: CollaborativeUser) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      cursor: user.cursor,
      selectedTrack: user.selectedTrack,
      isActive: user.isActive,
      color: user.color
    };
  }

  private cleanupInactiveSessions() {
    const now = Date.now();
    const maxInactivity = 30 * 60 * 1000; // 30 minutes

    for (const [sessionId, session] of this.sessions) {
      if (now - session.lastActivity > maxInactivity) {
        // Close all connections in inactive session
        for (const user of session.users.values()) {
          user.ws.close();
        }
        this.sessions.delete(sessionId);
        console.log(`Cleaned up inactive session ${sessionId}`);
      }
    }
  }

  // Get session statistics
  getSessionStats() {
    return {
      totalSessions: this.sessions.size,
      totalUsers: Array.from(this.sessions.values()).reduce((sum, session) => sum + session.users.size, 0),
      sessions: Array.from(this.sessions.values()).map(session => ({
        sessionId: session.sessionId,
        projectId: session.projectId,
        userCount: session.users.size,
        editCount: session.edits.length,
        lastActivity: session.lastActivity
      }))
    };
  }

  private handleConnectionV2(ws: WebSocket, req: any) {
    console.log('New collaborative connection established');
    
    ws.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        this.handleMessage(ws, message);
      } catch (error) {
        console.error('Error parsing collaborative message:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });

    ws.on('close', () => {
      this.handleDisconnection(ws);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  private async handleMessageV2(ws: WebSocket, message: any) {
    const { type, sessionId, userId } = message;

    try {
      switch (type) {
        case 'join_session':
          await this.handleJoinSession(ws, message);
          break;
        
        case 'leave_session':
          await this.handleLeaveSession(ws, message);
          break;
        
        case 'apply_edit':
          await this.handleApplyEdit(ws, message);
          break;
        
        case 'cursor_update':
          await this.handleCursorUpdate(ws, message);
          break;
        
        case 'chat_message':
          await this.handleChatMessage(ws, message);
          break;
        
        case 'resolve_conflict':
          await this.handleResolveConflict(ws, message);
          break;
        
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong' }));
          break;
        
        default:
          console.warn('Unknown message type:', type);
      }
    } catch (error) {
      console.error('Error handling message:', error);
      ws.send(JSON.stringify({ 
        type: 'error', 
        message: 'Failed to process message' 
      }));
    }
  }

  private async handleJoinSession(ws: WebSocket, message: any) {
    const { sessionId, projectType, user } = message;
    
    // Get or create session
    let session = this.sessions.get(sessionId);
    if (!session) {
      session = {
        sessionId,
        projectId: `project_${sessionId}`,
        users: new Map(),
        edits: [],
        createdAt: Date.now(),
        lastActivity: Date.now()
      };
      this.sessions.set(sessionId, session);
    }

    // Add user to session
    const collaborativeUser: CollaborativeUser = {
      id: user.id,
      name: user.name,
      email: user.email || '',
      cursor: { x: 0, y: 0 },
      isActive: true,
      color: this.generateUserColor(user.id),
      ws
    };

    session.users.set(user.id, collaborativeUser);
    this.userSessions.set(user.id, sessionId);
    session.lastActivity = Date.now();

    // Send current users list to new user
    const usersList = Array.from(session.users.values())
      .filter(u => u.id !== user.id)
      .map(u => ({
        id: u.id,
        name: u.name,
        cursor: u.cursor,
        color: u.color,
        isActive: u.isActive
      }));

    ws.send(JSON.stringify({
      type: 'users_list',
      users: usersList
    }));

    // Notify other users about new join
    this.broadcastToSession(sessionId, {
      type: 'user_joined',
      user: {
        id: collaborativeUser.id,
        name: collaborativeUser.name,
        cursor: collaborativeUser.cursor,
        color: collaborativeUser.color,
        isActive: collaborativeUser.isActive
      }
    }, user.id);

    console.log(`User ${user.name} joined session ${sessionId}`);
  }

  private async handleLeaveSession(ws: WebSocket, message: any) {
    const { sessionId, userId } = message;
    
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.users.delete(userId);
    this.userSessions.delete(userId);

    // Notify other users
    this.broadcastToSession(sessionId, {
      type: 'user_left',
      userId
    });

    // Remove session if empty
    if (session.users.size === 0) {
      this.sessions.delete(sessionId);
    }

    console.log(`User ${userId} left session ${sessionId}`);
  }

  private async handleApplyEdit(ws: WebSocket, message: any) {
    const { sessionId, edit } = message;
    
    const session = this.sessions.get(sessionId);
    if (!session) return;

    // Check for conflicts
    const conflict = await this.conflictResolver.detectConflict(edit, session.edits);
    
    if (conflict) {
      // Notify about conflict
      this.broadcastToSession(sessionId, {
        type: 'conflict_detected',
        conflict: {
          id: `conflict_${Date.now()}`,
          edit,
          conflictingEdit: conflict,
          description: `Edit conflict on ${edit.target || 'unknown target'}`
        }
      });
      return;
    }

    // Apply edit
    edit.status = 'applied';
    session.edits.push(edit);
    session.lastActivity = Date.now();

    // Broadcast to other users
    this.broadcastToSession(sessionId, {
      type: 'edit_applied',
      edit
    }, edit.userId);
  }

  private async handleCursorUpdate(ws: WebSocket, message: any) {
    const { sessionId, cursor } = message;
    
    const session = this.sessions.get(sessionId);
    if (!session) return;

    // Find user and update cursor
    for (const [userId, user] of session.users) {
      if (user.ws === ws) {
        user.cursor = cursor;
        
        // Broadcast cursor update
        this.broadcastToSession(sessionId, {
          type: 'cursor_update',
          userId,
          cursor
        }, userId);
        break;
      }
    }
  }

  private async handleChatMessage(ws: WebSocket, message: any) {
    const { sessionId, message: chatMessage } = message;
    
    // Broadcast chat message to all users in session
    this.broadcastToSession(sessionId, {
      type: 'chat_message',
      message: chatMessage
    });
  }

  private async handleResolveConflict(ws: WebSocket, message: any) {
    const { sessionId, conflictId, resolution, userId } = message;
    
    // Notify all users about conflict resolution
    this.broadcastToSession(sessionId, {
      type: 'conflict_resolved',
      conflictId,
      resolution,
      resolvedBy: userId
    });
  }

  private handleDisconnection(ws: WebSocket) {
    // Find and remove user from sessions
    for (const [sessionId, session] of this.sessions) {
      for (const [userId, user] of session.users) {
        if (user.ws === ws) {
          session.users.delete(userId);
          this.userSessions.delete(userId);
          
          // Notify other users
          this.broadcastToSession(sessionId, {
            type: 'user_left',
            userId
          });
          
          // Remove empty sessions
          if (session.users.size === 0) {
            this.sessions.delete(sessionId);
          }
          
          console.log(`User ${userId} disconnected from session ${sessionId}`);
          return;
        }
      }
    }
  }

  private broadcastToSession(sessionId: string, message: any, excludeUserId?: string) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const messageStr = JSON.stringify(message);
    
    for (const [userId, user] of session.users) {
      if (excludeUserId && userId === excludeUserId) continue;
      
      if (user.ws.readyState === WebSocket.OPEN) {
        user.ws.send(messageStr);
      }
    }
  }

  private generateUserColor(userId: string): string {
    const colors = [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
      '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
    ];
    
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }

  private cleanupInactiveSessions() {
    const now = Date.now();
    const timeout = 30 * 60 * 1000; // 30 minutes
    
    for (const [sessionId, session] of this.sessions) {
      if (now - session.lastActivity > timeout) {
        console.log(`Cleaning up inactive session: ${sessionId}`);
        this.sessions.delete(sessionId);
        
        // Remove user mappings
        for (const userId of session.users.keys()) {
          this.userSessions.delete(userId);
        }
      }
    }
  }

  private sendHeartbeat() {
    for (const session of this.sessions.values()) {
      for (const user of session.users.values()) {
        if (user.ws.readyState === WebSocket.OPEN) {
          user.ws.send(JSON.stringify({ type: 'ping' }));
        }
      }
    }
  }

  // Public API methods
  async createSession(projectId: string, userId: string): Promise<string> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session: CollaborativeSession = {
      sessionId,
      projectId,
      users: new Map(),
      edits: [],
      createdAt: Date.now(),
      lastActivity: Date.now()
    };
    
    this.sessions.set(sessionId, session);
    return sessionId;
  }

  getSessionStatus(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    return {
      sessionId: session.sessionId,
      projectId: session.projectId,
      userCount: session.users.size,
      editsCount: session.edits.length,
      createdAt: new Date(session.createdAt),
      lastActivity: new Date(session.lastActivity),
      users: Array.from(session.users.values()).map(u => ({
        id: u.id,
        name: u.name,
        isActive: u.isActive,
        color: u.color
      }))
    };
  }

  getAllSessions() {
    return Array.from(this.sessions.keys()).map(sessionId => 
      this.getSessionStatus(sessionId)
    );
  }
}

// Conflict resolution system
class ConflictResolver {
  async detectConflict(newEdit: CollaborativeEdit, existingEdits: CollaborativeEdit[]): Promise<CollaborativeEdit | null> {
    // Check for temporal conflicts (edits on same target within time window)
    const timeWindow = 5000; // 5 seconds
    const now = newEdit.timestamp.getTime();
    
    for (const edit of existingEdits.slice(-10)) { // Check last 10 edits
      const timeDiff = now - edit.timestamp.getTime();
      
      if (timeDiff < timeWindow && 
          edit.target === newEdit.target && 
          edit.userId !== newEdit.userId &&
          this.hasOverlappingChanges(newEdit, edit)) {
        return edit;
      }
    }
    
    return null;
  }

  private hasOverlappingChanges(edit1: CollaborativeEdit, edit2: CollaborativeEdit): boolean {
    // Simple overlap detection - can be enhanced based on edit types
    if (edit1.type === edit2.type && edit1.target === edit2.target) {
      return true;
    }
    
    // Check for property-level conflicts
    if (edit1.changes && edit2.changes) {
      const keys1 = Object.keys(edit1.changes);
      const keys2 = Object.keys(edit2.changes);
      
      return keys1.some(key => keys2.includes(key));
    }
    
    return false;
  }
}

// Export singleton instance
let collaborativeEngine: CollaborativeEngine | null = null;

export function initializeCollaborativeEngine(server: Server): CollaborativeEngine {
  if (!collaborativeEngine) {
    collaborativeEngine = new CollaborativeEngine(server);
  }
  return collaborativeEngine;
}

export function getCollaborativeEngine(): CollaborativeEngine | null {
  return collaborativeEngine;
}