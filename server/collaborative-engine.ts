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
  
  constructor(server: Server) {
    this.wss = new WebSocketServer({ 
      server, 
      path: '/ws/collaboration'
    });
    
    this.wss.on('connection', this.handleConnection.bind(this));
    console.log('🤝 Collaborative Engine initialized - Real-time editing ready');
    
    // Cleanup inactive sessions every 5 minutes
    setInterval(() => {
      this.cleanupInactiveSessions();
    }, 5 * 60 * 1000);
    
    // Heartbeat for connection health
    setInterval(() => {
      // Simple heartbeat - could be enhanced
      for (const session of this.sessions.values()) {
        for (const user of session.users.values()) {
          if (user.ws.readyState === WebSocket.OPEN) {
            user.ws.send(JSON.stringify({ type: 'ping' }));
          }
        }
      }
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

  private hasOverlappingChanges(edit1: CollaborativeEdit, edit2: CollaborativeEdit): boolean {
    // Simple overlap detection - can be enhanced based on edit types
    if (edit1.type === edit2.type) {
      return true;
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