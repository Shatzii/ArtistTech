import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { nanoid } from "nanoid";

interface ConnectedUser {
  id: string;
  ws: WebSocket;
  userId: string;
  userType: 'teacher' | 'student';
  userName: string;
  classroomId?: string;
  audioEnabled: boolean;
  videoEnabled: boolean;
  handRaised: boolean;
  joinedAt: Date;
}

interface ClassroomState {
  id: string;
  teacherId: string;
  isLive: boolean;
  topic: string;
  participants: ConnectedUser[];
  chatMessages: ChatMessage[];
  sharedContent: SharedContent[];
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'teacher' | 'student';
  message: string;
  timestamp: Date;
  type: 'text' | 'audio' | 'share';
}

interface SharedContent {
  id: string;
  title: string;
  type: 'project' | 'audio' | 'lesson';
  sharedBy: string;
  sharedByName: string;
  timestamp: Date;
  url?: string;
  data?: any;
}

export class LiveStreamingService {
  private wss: WebSocketServer;
  private connectedUsers: Map<string, ConnectedUser> = new Map();
  private classrooms: Map<string, ClassroomState> = new Map();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ 
      server, 
      path: '/ws',
      clientTracking: true 
    });

    this.wss.on('connection', this.handleConnection.bind(this));
    console.log('WebSocket server initialized on /ws');
  }

  private handleConnection(ws: WebSocket, request: any) {
    const connectionId = nanoid();
    console.log(`New WebSocket connection: ${connectionId}`);

    ws.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        this.handleMessage(connectionId, ws, message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
        this.sendToClient(ws, { type: 'error', message: 'Invalid message format' });
      }
    });

    ws.on('close', () => {
      this.handleDisconnection(connectionId);
    });

    ws.on('error', (error) => {
      console.error(`WebSocket error for ${connectionId}:`, error);
      this.handleDisconnection(connectionId);
    });

    // Send connection acknowledgment
    this.sendToClient(ws, { 
      type: 'connected', 
      connectionId,
      timestamp: new Date() 
    });
  }

  private handleMessage(connectionId: string, ws: WebSocket, message: any) {
    const { type, payload } = message;

    switch (type) {
      case 'auth':
        this.handleAuth(connectionId, ws, payload);
        break;
      case 'join_classroom':
        this.handleJoinClassroom(connectionId, payload);
        break;
      case 'leave_classroom':
        this.handleLeaveClassroom(connectionId);
        break;
      case 'start_live_class':
        this.handleStartLiveClass(connectionId, payload);
        break;
      case 'end_live_class':
        this.handleEndLiveClass(connectionId);
        break;
      case 'chat_message':
        this.handleChatMessage(connectionId, payload);
        break;
      case 'share_content':
        this.handleShareContent(connectionId, payload);
        break;
      case 'update_media_state':
        this.handleUpdateMediaState(connectionId, payload);
        break;
      case 'raise_hand':
        this.handleRaiseHand(connectionId, payload);
        break;
      case 'mute_student':
        this.handleMuteStudent(connectionId, payload);
        break;
      case 'request_student_video':
        this.handleRequestStudentVideo(connectionId, payload);
        break;
      default:
        console.log(`Unknown message type: ${type}`);
    }
  }

  private handleAuth(connectionId: string, ws: WebSocket, payload: any) {
    const { userId, userType, userName, token } = payload;

    // In production, validate the token here
    const user: ConnectedUser = {
      id: connectionId,
      ws,
      userId,
      userType,
      userName,
      audioEnabled: false,
      videoEnabled: false,
      handRaised: false,
      joinedAt: new Date()
    };

    this.connectedUsers.set(connectionId, user);

    this.sendToClient(ws, {
      type: 'auth_success',
      user: {
        id: connectionId,
        userId,
        userType,
        userName
      }
    });

    console.log(`User authenticated: ${userName} (${userType})`);
  }

  private handleJoinClassroom(connectionId: string, payload: any) {
    const user = this.connectedUsers.get(connectionId);
    if (!user) return;

    const { classroomId } = payload;
    user.classroomId = classroomId;

    // Initialize classroom if it doesn't exist
    if (!this.classrooms.has(classroomId)) {
      this.classrooms.set(classroomId, {
        id: classroomId,
        teacherId: user.userType === 'teacher' ? user.userId : '',
        isLive: false,
        topic: '',
        participants: [],
        chatMessages: [],
        sharedContent: []
      });
    }

    const classroom = this.classrooms.get(classroomId)!;
    classroom.participants.push(user);

    // Notify all participants about new user
    this.broadcastToClassroom(classroomId, {
      type: 'user_joined',
      user: {
        id: user.id,
        userId: user.userId,
        userName: user.userName,
        userType: user.userType,
        audioEnabled: user.audioEnabled,
        videoEnabled: user.videoEnabled,
        handRaised: user.handRaised
      },
      participantCount: classroom.participants.length
    });

    // Send classroom state to new user
    this.sendToClient(user.ws, {
      type: 'classroom_state',
      classroom: {
        id: classroom.id,
        isLive: classroom.isLive,
        topic: classroom.topic,
        participantCount: classroom.participants.length,
        participants: classroom.participants.map(p => ({
          id: p.id,
          userId: p.userId,
          userName: p.userName,
          userType: p.userType,
          audioEnabled: p.audioEnabled,
          videoEnabled: p.videoEnabled,
          handRaised: p.handRaised
        })),
        chatMessages: classroom.chatMessages,
        sharedContent: classroom.sharedContent
      }
    });

    console.log(`${user.userName} joined classroom: ${classroomId}`);
  }

  private handleLeaveClassroom(connectionId: string) {
    const user = this.connectedUsers.get(connectionId);
    if (!user || !user.classroomId) return;

    const classroom = this.classrooms.get(user.classroomId);
    if (classroom) {
      classroom.participants = classroom.participants.filter(p => p.id !== connectionId);
      
      this.broadcastToClassroom(user.classroomId, {
        type: 'user_left',
        userId: user.userId,
        userName: user.userName,
        participantCount: classroom.participants.length
      });
    }

    user.classroomId = undefined;
    console.log(`${user.userName} left classroom`);
  }

  private handleStartLiveClass(connectionId: string, payload: any) {
    const user = this.connectedUsers.get(connectionId);
    if (!user || user.userType !== 'teacher' || !user.classroomId) return;

    const classroom = this.classrooms.get(user.classroomId);
    if (classroom) {
      classroom.isLive = true;
      classroom.topic = payload.topic || '';

      this.broadcastToClassroom(user.classroomId, {
        type: 'class_started',
        teacher: user.userName,
        topic: classroom.topic,
        timestamp: new Date()
      });

      console.log(`Live class started by ${user.userName}: ${classroom.topic}`);
    }
  }

  private handleEndLiveClass(connectionId: string) {
    const user = this.connectedUsers.get(connectionId);
    if (!user || user.userType !== 'teacher' || !user.classroomId) return;

    const classroom = this.classrooms.get(user.classroomId);
    if (classroom) {
      classroom.isLive = false;

      this.broadcastToClassroom(user.classroomId, {
        type: 'class_ended',
        teacher: user.userName,
        timestamp: new Date()
      });

      console.log(`Live class ended by ${user.userName}`);
    }
  }

  private handleChatMessage(connectionId: string, payload: any) {
    const user = this.connectedUsers.get(connectionId);
    if (!user || !user.classroomId) return;

    const { message, type = 'text' } = payload;
    const chatMessage: ChatMessage = {
      id: nanoid(),
      senderId: user.userId,
      senderName: user.userName,
      senderType: user.userType,
      message,
      timestamp: new Date(),
      type
    };

    const classroom = this.classrooms.get(user.classroomId);
    if (classroom) {
      classroom.chatMessages.push(chatMessage);

      this.broadcastToClassroom(user.classroomId, {
        type: 'new_chat_message',
        message: chatMessage
      });
    }
  }

  private handleShareContent(connectionId: string, payload: any) {
    const user = this.connectedUsers.get(connectionId);
    if (!user || !user.classroomId) return;

    const { title, contentType, url, data } = payload;
    const sharedContent: SharedContent = {
      id: nanoid(),
      title,
      type: contentType,
      sharedBy: user.userId,
      sharedByName: user.userName,
      timestamp: new Date(),
      url,
      data
    };

    const classroom = this.classrooms.get(user.classroomId);
    if (classroom) {
      classroom.sharedContent.push(sharedContent);

      this.broadcastToClassroom(user.classroomId, {
        type: 'content_shared',
        content: sharedContent
      });
    }
  }

  private handleUpdateMediaState(connectionId: string, payload: any) {
    const user = this.connectedUsers.get(connectionId);
    if (!user || !user.classroomId) return;

    const { audioEnabled, videoEnabled } = payload;
    user.audioEnabled = audioEnabled ?? user.audioEnabled;
    user.videoEnabled = videoEnabled ?? user.videoEnabled;

    this.broadcastToClassroom(user.classroomId, {
      type: 'user_media_updated',
      userId: user.userId,
      audioEnabled: user.audioEnabled,
      videoEnabled: user.videoEnabled
    });
  }

  private handleRaiseHand(connectionId: string, payload: any) {
    const user = this.connectedUsers.get(connectionId);
    if (!user || !user.classroomId) return;

    user.handRaised = payload.raised ?? !user.handRaised;

    this.broadcastToClassroom(user.classroomId, {
      type: 'hand_raised',
      userId: user.userId,
      userName: user.userName,
      raised: user.handRaised
    });
  }

  private handleMuteStudent(connectionId: string, payload: any) {
    const teacher = this.connectedUsers.get(connectionId);
    if (!teacher || teacher.userType !== 'teacher' || !teacher.classroomId) return;

    const { studentId } = payload;
    const classroom = this.classrooms.get(teacher.classroomId);
    if (classroom) {
      const student = classroom.participants.find(p => p.userId === studentId);
      if (student) {
        student.audioEnabled = false;
        
        this.sendToClient(student.ws, {
          type: 'muted_by_teacher',
          teacherName: teacher.userName
        });

        this.broadcastToClassroom(teacher.classroomId, {
          type: 'user_media_updated',
          userId: student.userId,
          audioEnabled: false,
          videoEnabled: student.videoEnabled
        });
      }
    }
  }

  private handleRequestStudentVideo(connectionId: string, payload: any) {
    const teacher = this.connectedUsers.get(connectionId);
    if (!teacher || teacher.userType !== 'teacher' || !teacher.classroomId) return;

    const { studentId } = payload;
    const classroom = this.classrooms.get(teacher.classroomId);
    if (classroom) {
      const student = classroom.participants.find(p => p.userId === studentId);
      if (student) {
        this.sendToClient(student.ws, {
          type: 'video_request',
          teacherName: teacher.userName,
          message: `${teacher.userName} is requesting you to turn on your video.`
        });
      }
    }
  }

  private handleDisconnection(connectionId: string) {
    const user = this.connectedUsers.get(connectionId);
    if (user) {
      if (user.classroomId) {
        this.handleLeaveClassroom(connectionId);
      }
      this.connectedUsers.delete(connectionId);
      console.log(`User disconnected: ${user.userName}`);
    }
  }

  private broadcastToClassroom(classroomId: string, message: any, excludeUserId?: string) {
    const classroom = this.classrooms.get(classroomId);
    if (!classroom) return;

    classroom.participants.forEach(user => {
      if (excludeUserId && user.userId === excludeUserId) return;
      if (user.ws.readyState === WebSocket.OPEN) {
        this.sendToClient(user.ws, message);
      }
    });
  }

  private sendToClient(ws: WebSocket, message: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        ...message,
        timestamp: message.timestamp || new Date()
      }));
    }
  }

  public getClassroomStats(classroomId: string) {
    const classroom = this.classrooms.get(classroomId);
    if (!classroom) return null;

    return {
      id: classroom.id,
      isLive: classroom.isLive,
      topic: classroom.topic,
      participantCount: classroom.participants.length,
      participants: classroom.participants.map(p => ({
        userId: p.userId,
        userName: p.userName,
        userType: p.userType,
        audioEnabled: p.audioEnabled,
        videoEnabled: p.videoEnabled,
        handRaised: p.handRaised,
        joinedAt: p.joinedAt
      }))
    };
  }

  public getAllClassrooms() {
    return Array.from(this.classrooms.values()).map(classroom => ({
      id: classroom.id,
      isLive: classroom.isLive,
      topic: classroom.topic,
      participantCount: classroom.participants.length
    }));
  }
}