import { WebSocketServer, WebSocket } from 'ws';
import fs from 'fs/promises';
import path from 'path';

interface SongRequest {
  id: string;
  trackId: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  requestedBy: string;
  requestType: 'paid' | 'voted';
  amount?: number; // For paid requests
  votes: number;
  voters: string[]; // User IDs who voted
  priority: number; // Calculated priority score
  timestamp: Date;
  status: 'pending' | 'playing' | 'played' | 'rejected';
  djNotes?: string;
}

interface VotingSession {
  id: string;
  eventName: string;
  djId: string;
  djName: string;
  venue: string;
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
  settings: VotingSettings;
  playlist: SongRequest[];
  revenue: number;
  totalVotes: number;
  activeListeners: string[];
}

interface VotingSettings {
  enablePaidRequests: boolean;
  minRequestPrice: number;
  maxRequestPrice: number;
  voteWeight: number; // How much votes affect priority vs payment
  maxVotesPerUser: number;
  maxRequestsPerUser: number;
  genreRestrictions: string[];
  explicitContentAllowed: boolean;
  autoAcceptThreshold: number; // Auto-accept if enough votes/payment
}

interface Listener {
  id: string;
  sessionId: string;
  name: string;
  walletBalance: number;
  votesUsed: number;
  requestsSubmitted: number;
  totalSpent: number;
  preferences: {
    genres: string[];
    artists: string[];
    explicitContent: boolean;
  };
  connectionTime: Date;
  lastActivity: Date;
}

interface PaymentTransaction {
  id: string;
  listenerId: string;
  songRequestId: string;
  amount: number;
  timestamp: Date;
  status: 'pending' | 'completed' | 'refunded';
  paymentMethod: 'wallet' | 'card' | 'crypto';
}

interface DJInterface {
  sessionId: string;
  currentTrack?: SongRequest;
  upcomingTracks: SongRequest[];
  autoPlayEnabled: boolean;
  notifications: DJNotification[];
  revenue: {
    session: number;
    hourly: number;
    average: number;
  };
}

interface DJNotification {
  id: string;
  type: 'new_request' | 'high_payment' | 'popular_vote' | 'milestone';
  message: string;
  amount?: number;
  timestamp: Date;
  read: boolean;
}

export class InteractiveDJVotingEngine {
  private votingWSS?: WebSocketServer;
  private sessions: Map<string, VotingSession> = new Map();
  private listeners: Map<string, Listener> = new Map();
  private djInterfaces: Map<string, DJInterface> = new Map();
  private payments: Map<string, PaymentTransaction> = new Map();
  private musicDatabase: Map<string, any> = new Map();

  constructor() {
    this.initializeVotingEngine();
  }

  private async initializeVotingEngine() {
    await this.setupVotingDirectories();
    await this.loadMusicDatabase();
    this.setupVotingServer();
    this.startBackgroundProcesses();
    console.log('Interactive DJ Voting Engine initialized - Club Interaction Ready');
  }

  private async setupVotingDirectories() {
    const dirs = [
      './uploads/voting-sessions',
      './uploads/payment-receipts', 
      './data/music-catalog',
      './logs/voting-activity',
      './analytics/dj-performance'
    ];

    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (error) {
        console.log(`Voting directory exists: ${dir}`);
      }
    }
  }

  private async loadMusicDatabase() {
    console.log('Loading music catalog for voting...');
    
    // Simulate comprehensive music database
    const genres = ['House', 'Techno', 'Hip-Hop', 'R&B', 'Pop', 'Rock', 'EDM', 'Reggaeton', 'Afrobeats', 'Latin'];
    const sampleTracks = [
      { id: 'track_001', title: 'One More Time', artist: 'Daft Punk', album: 'Discovery', duration: 320, genre: 'House', bpm: 123 },
      { id: 'track_002', title: 'Strobe', artist: 'Deadmau5', album: 'For Lack of a Better Name', duration: 645, genre: 'Techno', bpm: 128 },
      { id: 'track_003', title: 'HUMBLE.', artist: 'Kendrick Lamar', album: 'DAMN.', duration: 177, genre: 'Hip-Hop', bpm: 150 },
      { id: 'track_004', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: 200, genre: 'Pop', bpm: 171 },
      { id: 'track_005', title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', duration: 203, genre: 'Pop', bpm: 103 }
    ];

    // Generate more tracks
    for (let i = 6; i <= 1000; i++) {
      const genre = genres[Math.floor(Math.random() * genres.length)];
      const track = {
        id: `track_${i.toString().padStart(3, '0')}`,
        title: `Generated Track ${i}`,
        artist: `Artist ${Math.floor(i / 10)}`,
        album: `Album ${Math.floor(i / 20)}`,
        duration: 180 + Math.floor(Math.random() * 300),
        genre,
        bpm: 90 + Math.floor(Math.random() * 80)
      };
      sampleTracks.push(track);
    }

    sampleTracks.forEach(track => {
      this.musicDatabase.set(track.id, track);
    });

    console.log(`Loaded ${sampleTracks.length} tracks into music database`);
  }

  private setupVotingServer() {
    this.votingWSS = new WebSocketServer({ port: 8110, path: '/voting' });
    
    this.votingWSS.on('connection', (ws: WebSocket, req) => {
      const url = new URL(req.url!, `http://${req.headers.host}`);
      const userType = url.searchParams.get('type') || 'listener';
      const sessionId = url.searchParams.get('session') || 'default';

      ws.send(JSON.stringify({
        type: 'connection_established',
        userType,
        sessionId,
        availableSessions: Array.from(this.sessions.keys())
      }));

      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleVotingMessage(ws, message, userType, sessionId);
        } catch (error) {
          console.error('Error processing voting message:', error);
        }
      });
    });

    console.log('Interactive DJ voting server started on port 8110');
  }

  private startBackgroundProcesses() {
    // Update priorities every 30 seconds
    setInterval(() => {
      this.updatePlaylistPriorities();
    }, 30000);

    // Process payments every 10 seconds
    setInterval(() => {
      this.processPayments();
    }, 10000);

    // Generate analytics every minute
    setInterval(() => {
      this.generateAnalytics();
    }, 60000);
  }

  async createVotingSession(config: {
    eventName: string;
    djId: string;
    djName: string;
    venue: string;
    duration: number;
    settings: Partial<VotingSettings>;
  }): Promise<string> {
    const sessionId = `session_${Date.now()}`;
    
    const session: VotingSession = {
      id: sessionId,
      eventName: config.eventName,
      djId: config.djId,
      djName: config.djName,
      venue: config.venue,
      startTime: new Date(),
      endTime: new Date(Date.now() + config.duration * 60 * 1000),
      isActive: true,
      settings: {
        enablePaidRequests: config.settings.enablePaidRequests ?? true,
        minRequestPrice: config.settings.minRequestPrice ?? 5,
        maxRequestPrice: config.settings.maxRequestPrice ?? 100,
        voteWeight: config.settings.voteWeight ?? 0.3,
        maxVotesPerUser: config.settings.maxVotesPerUser ?? 5,
        maxRequestsPerUser: config.settings.maxRequestsPerUser ?? 3,
        genreRestrictions: config.settings.genreRestrictions ?? [],
        explicitContentAllowed: config.settings.explicitContentAllowed ?? true,
        autoAcceptThreshold: config.settings.autoAcceptThreshold ?? 20
      },
      playlist: [],
      revenue: 0,
      totalVotes: 0,
      activeListeners: []
    };

    this.sessions.set(sessionId, session);

    // Create DJ interface
    this.djInterfaces.set(sessionId, {
      sessionId,
      upcomingTracks: [],
      autoPlayEnabled: false,
      notifications: [],
      revenue: { session: 0, hourly: 0, average: 0 }
    });

    console.log(`Created voting session: ${config.eventName} at ${config.venue}`);
    return sessionId;
  }

  async submitSongRequest(request: {
    sessionId: string;
    listenerId: string;
    trackId: string;
    requestType: 'paid' | 'voted';
    amount?: number;
  }): Promise<string> {
    const session = this.sessions.get(request.sessionId);
    if (!session || !session.isActive) {
      throw new Error('Session not found or inactive');
    }

    const listener = this.listeners.get(request.listenerId);
    if (!listener) {
      throw new Error('Listener not found');
    }

    const track = this.musicDatabase.get(request.trackId);
    if (!track) {
      throw new Error('Track not found');
    }

    // Validate request limits
    const userRequests = session.playlist.filter(r => r.requestedBy === request.listenerId);
    if (userRequests.length >= session.settings.maxRequestsPerUser) {
      throw new Error('Maximum requests per user reached');
    }

    // Validate payment for paid requests
    if (request.requestType === 'paid') {
      const amount = request.amount || session.settings.minRequestPrice;
      if (amount < session.settings.minRequestPrice || amount > session.settings.maxRequestPrice) {
        throw new Error('Invalid payment amount');
      }
      if (listener.walletBalance < amount) {
        throw new Error('Insufficient funds');
      }
    }

    const requestId = `request_${Date.now()}`;
    const songRequest: SongRequest = {
      id: requestId,
      trackId: request.trackId,
      title: track.title,
      artist: track.artist,
      album: track.album,
      duration: track.duration,
      requestedBy: request.listenerId,
      requestType: request.requestType,
      amount: request.amount,
      votes: request.requestType === 'voted' ? 1 : 0,
      voters: request.requestType === 'voted' ? [request.listenerId] : [],
      priority: this.calculatePriority(request.requestType, request.amount || 0, 1),
      timestamp: new Date(),
      status: 'pending'
    };

    session.playlist.push(songRequest);
    
    // Process payment if paid request
    if (request.requestType === 'paid' && request.amount) {
      await this.processPayment(request.listenerId, requestId, request.amount);
    }

    // Update listener stats
    listener.requestsSubmitted++;
    if (request.requestType === 'voted') {
      listener.votesUsed++;
    }
    listener.lastActivity = new Date();

    // Notify DJ
    this.notifyDJ(request.sessionId, {
      type: request.requestType === 'paid' ? 'new_request' : 'popular_vote',
      message: `New ${request.requestType} request: ${track.title} by ${track.artist}`,
      amount: request.amount,
      timestamp: new Date(),
      read: false
    });

    console.log(`Song request submitted: ${track.title} (${request.requestType})`);
    return requestId;
  }

  async voteForSong(sessionId: string, listenerId: string, requestId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session || !session.isActive) {
      throw new Error('Session not found or inactive');
    }

    const listener = this.listeners.get(listenerId);
    if (!listener) {
      throw new Error('Listener not found');
    }

    if (listener.votesUsed >= session.settings.maxVotesPerUser) {
      throw new Error('Maximum votes per user reached');
    }

    const request = session.playlist.find(r => r.id === requestId);
    if (!request) {
      throw new Error('Song request not found');
    }

    if (request.voters.includes(listenerId)) {
      throw new Error('Already voted for this song');
    }

    // Add vote
    request.votes++;
    request.voters.push(listenerId);
    request.priority = this.calculatePriority(request.requestType, request.amount || 0, request.votes);

    // Update listener and session stats
    listener.votesUsed++;
    listener.lastActivity = new Date();
    session.totalVotes++;

    // Check if request should be auto-accepted
    if (request.votes >= session.settings.autoAcceptThreshold) {
      this.notifyDJ(sessionId, {
        type: 'popular_vote',
        message: `${request.title} reached ${request.votes} votes - Auto-accepting!`,
        timestamp: new Date(),
        read: false
      });
    }

    console.log(`Vote added for: ${request.title} (${request.votes} votes)`);
  }

  private calculatePriority(type: 'paid' | 'voted', amount: number, votes: number): number {
    if (type === 'paid') {
      // Paid requests get higher base priority
      return (amount * 10) + (votes * 2);
    } else {
      // Voted requests rely more on vote count
      return votes * 5;
    }
  }

  private async processPayment(listenerId: string, requestId: string, amount: number): Promise<void> {
    const listener = this.listeners.get(listenerId);
    if (!listener) throw new Error('Listener not found');

    const paymentId = `payment_${Date.now()}`;
    const transaction: PaymentTransaction = {
      id: paymentId,
      listenerId,
      songRequestId: requestId,
      amount,
      timestamp: new Date(),
      status: 'completed',
      paymentMethod: 'wallet'
    };

    // Deduct from wallet
    listener.walletBalance -= amount;
    listener.totalSpent += amount;

    // Add to session revenue
    const request = this.findRequestInAllSessions(requestId);
    if (request) {
      const session = this.sessions.get(request.sessionId);
      if (session) {
        session.revenue += amount;
      }
    }

    this.payments.set(paymentId, transaction);
    console.log(`Payment processed: $${amount} for request ${requestId}`);
  }

  private findRequestInAllSessions(requestId: string): { sessionId: string; request: SongRequest } | null {
    for (const [sessionId, session] of this.sessions) {
      const request = session.playlist.find(r => r.id === requestId);
      if (request) {
        return { sessionId, request };
      }
    }
    return null;
  }

  async joinAsListener(sessionId: string, listenerData: {
    name: string;
    initialBalance?: number;
    preferences?: any;
  }): Promise<string> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const listenerId = `listener_${Date.now()}`;
    const listener: Listener = {
      id: listenerId,
      sessionId,
      name: listenerData.name,
      walletBalance: listenerData.initialBalance || 50,
      votesUsed: 0,
      requestsSubmitted: 0,
      totalSpent: 0,
      preferences: listenerData.preferences || {
        genres: [],
        artists: [],
        explicitContent: true
      },
      connectionTime: new Date(),
      lastActivity: new Date()
    };

    this.listeners.set(listenerId, listener);
    session.activeListeners.push(listenerId);

    console.log(`Listener joined: ${listenerData.name} (Session: ${sessionId})`);
    return listenerId;
  }

  private updatePlaylistPriorities(): void {
    for (const session of this.sessions.values()) {
      if (!session.isActive) continue;

      // Sort playlist by priority
      session.playlist.sort((a, b) => b.priority - a.priority);

      // Update DJ interface with top tracks
      const djInterface = this.djInterfaces.get(session.id);
      if (djInterface) {
        djInterface.upcomingTracks = session.playlist
          .filter(r => r.status === 'pending')
          .slice(0, 10);
      }
    }
  }

  private processPayments(): void {
    // Process any pending payments
    for (const payment of this.payments.values()) {
      if (payment.status === 'pending') {
        payment.status = 'completed';
        console.log(`Payment processed: ${payment.id}`);
      }
    }
  }

  private generateAnalytics(): void {
    for (const [sessionId, session] of this.sessions) {
      const djInterface = this.djInterfaces.get(sessionId);
      if (!djInterface) continue;

      const sessionDuration = Date.now() - session.startTime.getTime();
      const hoursElapsed = sessionDuration / (1000 * 60 * 60);

      djInterface.revenue = {
        session: session.revenue,
        hourly: hoursElapsed > 0 ? session.revenue / hoursElapsed : 0,
        average: session.activeListeners.length > 0 ? session.revenue / session.activeListeners.length : 0
      };
    }
  }

  private notifyDJ(sessionId: string, notification: Omit<DJNotification, 'id' | 'read'>): void {
    const djInterface = this.djInterfaces.get(sessionId);
    if (!djInterface) return;

    const djNotification: DJNotification = {
      id: `notif_${Date.now()}`,
      ...notification,
      read: false
    };

    djInterface.notifications.push(djNotification);

    // Keep only last 50 notifications
    if (djInterface.notifications.length > 50) {
      djInterface.notifications = djInterface.notifications.slice(-50);
    }
  }

  private handleVotingMessage(ws: WebSocket, message: any, userType: string, sessionId: string) {
    switch (message.type) {
      case 'create_session':
        this.handleCreateSession(ws, message);
        break;
      case 'join_listener':
        this.handleJoinListener(ws, message);
        break;
      case 'submit_request':
        this.handleSubmitRequest(ws, message);
        break;
      case 'vote_song':
        this.handleVoteSong(ws, message);
        break;
      case 'get_playlist':
        this.handleGetPlaylist(ws, message);
        break;
      case 'dj_action':
        this.handleDJAction(ws, message);
        break;
      case 'search_music':
        this.handleSearchMusic(ws, message);
        break;
      case 'add_funds':
        this.handleAddFunds(ws, message);
        break;
    }
  }

  private async handleCreateSession(ws: WebSocket, message: any) {
    try {
      const sessionId = await this.createVotingSession(message.config);
      ws.send(JSON.stringify({
        type: 'session_created',
        sessionId,
        config: message.config
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: `Failed to create session: ${error}`
      }));
    }
  }

  private async handleJoinListener(ws: WebSocket, message: any) {
    try {
      const listenerId = await this.joinAsListener(message.sessionId, message.listenerData);
      const session = this.sessions.get(message.sessionId);
      
      ws.send(JSON.stringify({
        type: 'listener_joined',
        listenerId,
        session: {
          id: session?.id,
          eventName: session?.eventName,
          djName: session?.djName,
          venue: session?.venue,
          settings: session?.settings
        }
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: `Failed to join as listener: ${error}`
      }));
    }
  }

  private async handleSubmitRequest(ws: WebSocket, message: any) {
    try {
      const requestId = await this.submitSongRequest(message.request);
      ws.send(JSON.stringify({
        type: 'request_submitted',
        requestId
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: `Failed to submit request: ${error}`
      }));
    }
  }

  private async handleVoteSong(ws: WebSocket, message: any) {
    try {
      await this.voteForSong(message.sessionId, message.listenerId, message.requestId);
      ws.send(JSON.stringify({
        type: 'vote_recorded',
        requestId: message.requestId
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: `Failed to vote: ${error}`
      }));
    }
  }

  private handleGetPlaylist(ws: WebSocket, message: any) {
    const session = this.sessions.get(message.sessionId);
    if (!session) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Session not found'
      }));
      return;
    }

    ws.send(JSON.stringify({
      type: 'playlist_data',
      playlist: session.playlist.slice(0, 20), // Top 20 requests
      stats: {
        totalRequests: session.playlist.length,
        totalVotes: session.totalVotes,
        revenue: session.revenue,
        activeListeners: session.activeListeners.length
      }
    }));
  }

  private handleDJAction(ws: WebSocket, message: any) {
    const { sessionId, action, requestId } = message;
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Session not found'
      }));
      return;
    }

    const request = session.playlist.find(r => r.id === requestId);
    if (!request) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Request not found'
      }));
      return;
    }

    switch (action) {
      case 'play':
        request.status = 'playing';
        const djInterface = this.djInterfaces.get(sessionId);
        if (djInterface) {
          djInterface.currentTrack = request;
        }
        break;
      case 'accept':
        request.status = 'pending';
        break;
      case 'reject':
        request.status = 'rejected';
        break;
      case 'complete':
        request.status = 'played';
        break;
    }

    ws.send(JSON.stringify({
      type: 'dj_action_completed',
      action,
      requestId
    }));
  }

  private handleSearchMusic(ws: WebSocket, message: any) {
    const { query, genre, limit = 20 } = message;
    const results = Array.from(this.musicDatabase.values())
      .filter(track => {
        const matchesQuery = !query || 
          track.title.toLowerCase().includes(query.toLowerCase()) ||
          track.artist.toLowerCase().includes(query.toLowerCase());
        const matchesGenre = !genre || track.genre === genre;
        return matchesQuery && matchesGenre;
      })
      .slice(0, limit);

    ws.send(JSON.stringify({
      type: 'search_results',
      results,
      query
    }));
  }

  private handleAddFunds(ws: WebSocket, message: any) {
    const { listenerId, amount } = message;
    const listener = this.listeners.get(listenerId);
    
    if (!listener) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Listener not found'
      }));
      return;
    }

    listener.walletBalance += amount;
    
    ws.send(JSON.stringify({
      type: 'funds_added',
      newBalance: listener.walletBalance,
      amount
    }));
  }

  getEngineStatus() {
    return {
      engine: 'Interactive DJ Voting Engine',
      version: '1.0.0',
      activeSessions: this.sessions.size,
      activeListeners: this.listeners.size,
      totalPayments: this.payments.size,
      musicCatalog: this.musicDatabase.size,
      capabilities: [
        'Real-Time Song Voting System',
        'Paid Song Request Processing',
        'Dynamic Playlist Priority Calculation',
        'DJ Interface with Live Notifications',
        'Listener Wallet Management',
        'Club Revenue Tracking',
        'Music Catalog Search & Discovery',
        'Vote-to-Play Integration',
        'Interactive Event Management',
        'Real-Time Analytics Dashboard'
      ]
    };
  }
}

export const interactiveDJVotingEngine = new InteractiveDJVotingEngine();