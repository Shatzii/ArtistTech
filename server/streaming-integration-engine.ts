import { WebSocketServer, WebSocket } from 'ws';
import express from 'express';
import axios from 'axios';

// Streaming service interfaces
interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  duration_ms: number;
  preview_url: string | null;
  external_urls: { spotify: string };
  audio_features: {
    tempo: number;
    key: number;
    energy: number;
    danceability: number;
    valence: number;
  } | null;
}

interface SoundCloudTrack {
  id: number;
  title: string;
  user: { username: string };
  duration: number;
  stream_url: string;
  waveform_url: string;
  bpm: number | null;
  genre: string;
  artwork_url: string;
  permalink_url: string;
}

interface AppleMusicTrack {
  id: string;
  attributes: {
    name: string;
    artistName: string;
    albumName: string;
    durationInMillis: number;
    artwork: { url: string };
    url: string;
    previews: { url: string }[];
  };
}

interface StreamingService {
  name: 'spotify' | 'soundcloud' | 'apple';
  connected: boolean;
  token: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

interface DJTrack {
  id: string;
  service: 'spotify' | 'soundcloud' | 'apple';
  title: string;
  artist: string;
  album: string;
  duration: number;
  bpm: number;
  key: string;
  energy: number;
  streamUrl: string;
  previewUrl: string;
  waveformUrl?: string;
  artwork: string;
  externalUrl: string;
}

export class StreamingIntegrationEngine {
  private integrationWSS?: WebSocketServer;
  private services: Map<string, StreamingService> = new Map();
  private cache: Map<string, DJTrack[]> = new Map();
  private activeStreams: Map<string, any> = new Map();

  constructor(server?: any) {
    if (server) {
      this.setupIntegrationServer(server);
    } else {
      this.initializeEngine();
    }
  }

  private async initializeEngine() {
    this.setupIntegrationServer();
    this.initializeServices();
    console.log('Streaming Integration Engine initialized');
  }

  private setupIntegrationServer(server?: any) {
    if (server) {
      // Use the provided server instance
      this.integrationWSS = new WebSocketServer({ server, path: '/streaming' });
      this.setupWebSocketHandlers();
      console.log('Streaming integration WebSocket server attached to main server');
    } else {
      // Fallback: create our own server (for backward compatibility)
      const integrationServer = express();
      integrationServer.use(express.json());

      // OAuth callback routes for each service
      integrationServer.get('/auth/spotify/callback', this.handleSpotifyCallback.bind(this));
      integrationServer.get('/auth/soundcloud/callback', this.handleSoundCloudCallback.bind(this));
      integrationServer.get('/auth/apple/callback', this.handleAppleCallback.bind(this));

      // WebSocket server for real-time streaming
      const httpServer = integrationServer.listen(8095, () => {
        console.log('Streaming integration server started on port 8095');
      });

      this.integrationWSS = new WebSocketServer({ server: httpServer, path: '/streaming' });
      this.setupWebSocketHandlers();
    }
  }

  private setupWebSocketHandlers() {
    if (!this.integrationWSS) return;

    this.integrationWSS.on('connection', (ws: WebSocket) => {
      console.log('DJ streaming client connected');
      
      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleStreamingMessage(ws, message);
        } catch (error) {
          console.error('Error processing streaming message:', error);
        }
      });

      ws.on('close', () => {
        console.log('DJ streaming client disconnected');
      });
    });
  }

  private initializeServices() {
    // Initialize service configurations
    this.services.set('spotify', {
      name: 'spotify',
      connected: false,
      token: null,
      refreshToken: null,
      expiresAt: null
    });

    this.services.set('soundcloud', {
      name: 'soundcloud', 
      connected: false,
      token: null,
      refreshToken: null,
      expiresAt: null
    });

    this.services.set('apple', {
      name: 'apple',
      connected: false,
      token: null,
      refreshToken: null,
      expiresAt: null
    });
  }

  // Spotify Integration
  async connectSpotify(clientId: string, clientSecret: string, redirectUri: string) {
    const authUrl = `https://accounts.spotify.com/authorize?` +
      `response_type=code&` +
      `client_id=${clientId}&` +
      `scope=streaming user-read-playback-state user-modify-playback-state&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    return { authUrl };
  }

  private async handleSpotifyCallback(req: any, res: any) {
    const { code } = req.query;
    
    try {
      const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', 
        new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: process.env.SPOTIFY_REDIRECT_URI || '',
          client_id: process.env.SPOTIFY_CLIENT_ID || '',
          client_secret: process.env.SPOTIFY_CLIENT_SECRET || ''
        }), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
      );

      const { access_token, refresh_token, expires_in } = tokenResponse.data;
      
      this.services.set('spotify', {
        name: 'spotify',
        connected: true,
        token: access_token,
        refreshToken: refresh_token,
        expiresAt: Date.now() + (expires_in * 1000)
      });

      res.redirect('/studio/dj?connected=spotify');
    } catch (error) {
      console.error('Spotify auth error:', error);
      res.redirect('/studio/dj?error=spotify_auth');
    }
  }

  async searchSpotifyTracks(query: string, limit: number = 20): Promise<DJTrack[]> {
    const spotify = this.services.get('spotify');
    if (!spotify?.connected || !spotify.token) {
      throw new Error('Spotify not connected');
    }

    try {
      // Search for tracks
      const searchResponse = await axios.get('https://api.spotify.com/v1/search', {
        headers: { Authorization: `Bearer ${spotify.token}` },
        params: {
          q: query,
          type: 'track',
          limit,
          market: 'US'
        }
      });

      const tracks = searchResponse.data.tracks.items;
      
      // Get audio features for BPM and key analysis
      const trackIds = tracks.map((t: SpotifyTrack) => t.id).join(',');
      const featuresResponse = await axios.get(`https://api.spotify.com/v1/audio-features`, {
        headers: { Authorization: `Bearer ${spotify.token}` },
        params: { ids: trackIds }
      });

      const audioFeatures = featuresResponse.data.audio_features;

      return tracks.map((track: SpotifyTrack, index: number) => {
        const features = audioFeatures[index];
        return {
          id: track.id,
          service: 'spotify' as const,
          title: track.name,
          artist: track.artists.map(a => a.name).join(', '),
          album: track.album.name,
          duration: Math.floor(track.duration_ms / 1000),
          bpm: features ? Math.round(features.tempo) : 120,
          key: features ? this.convertSpotifyKey(features.key) : 'C',
          energy: features ? Math.round(features.energy * 100) : 50,
          streamUrl: '', // Will be handled by Spotify Web Playback SDK
          previewUrl: track.preview_url || '',
          artwork: track.album.images[0]?.url || '',
          externalUrl: track.external_urls.spotify
        };
      });
    } catch (error) {
      console.error('Spotify search error:', error);
      throw error;
    }
  }

  // SoundCloud Integration
  async connectSoundCloud(clientId: string, redirectUri: string) {
    const authUrl = `https://soundcloud.com/connect?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=non-expiring`;
    
    return { authUrl };
  }

  private async handleSoundCloudCallback(req: any, res: any) {
    const { code } = req.query;
    
    try {
      const tokenResponse = await axios.post('https://api.soundcloud.com/oauth2/token', {
        client_id: process.env.SOUNDCLOUD_CLIENT_ID,
        client_secret: process.env.SOUNDCLOUD_CLIENT_SECRET,
        redirect_uri: process.env.SOUNDCLOUD_REDIRECT_URI,
        grant_type: 'authorization_code',
        code
      });

      const { access_token } = tokenResponse.data;
      
      this.services.set('soundcloud', {
        name: 'soundcloud',
        connected: true,
        token: access_token,
        refreshToken: null,
        expiresAt: null // SoundCloud tokens don't expire
      });

      res.redirect('/studio/dj?connected=soundcloud');
    } catch (error) {
      console.error('SoundCloud auth error:', error);
      res.redirect('/studio/dj?error=soundcloud_auth');
    }
  }

  async searchSoundCloudTracks(query: string, limit: number = 20): Promise<DJTrack[]> {
    const soundcloud = this.services.get('soundcloud');
    if (!soundcloud?.connected || !soundcloud.token) {
      throw new Error('SoundCloud not connected');
    }

    try {
      const response = await axios.get('https://api.soundcloud.com/tracks', {
        params: {
          client_id: process.env.SOUNDCLOUD_CLIENT_ID,
          q: query,
          limit,
          streamable: true
        }
      });

      return response.data.map((track: SoundCloudTrack) => ({
        id: track.id.toString(),
        service: 'soundcloud' as const,
        title: track.title,
        artist: track.user.username,
        album: 'SoundCloud',
        duration: Math.floor(track.duration / 1000),
        bpm: track.bpm || 120,
        key: 'C', // SoundCloud doesn't provide key detection
        energy: 75, // Default energy level
        streamUrl: `${track.stream_url}?client_id=${process.env.SOUNDCLOUD_CLIENT_ID}`,
        previewUrl: `${track.stream_url}?client_id=${process.env.SOUNDCLOUD_CLIENT_ID}`,
        waveformUrl: track.waveform_url,
        artwork: track.artwork_url || '',
        externalUrl: track.permalink_url
      }));
    } catch (error) {
      console.error('SoundCloud search error:', error);
      throw error;
    }
  }

  // Apple Music Integration
  async connectAppleMusic(developerToken: string) {
    // Apple Music uses JWT tokens for developer authentication
    this.services.set('apple', {
      name: 'apple',
      connected: true,
      token: developerToken,
      refreshToken: null,
      expiresAt: null
    });

    return { success: true };
  }

  private async handleAppleCallback(req: any, res: any) {
    // Apple Music integration typically uses MusicKit JS on frontend
    res.redirect('/studio/dj?connected=apple');
  }

  async searchAppleMusicTracks(query: string, limit: number = 20): Promise<DJTrack[]> {
    const apple = this.services.get('apple');
    if (!apple?.connected || !apple.token) {
      throw new Error('Apple Music not connected');
    }

    try {
      const response = await axios.get('https://api.music.apple.com/v1/catalog/us/search', {
        headers: { Authorization: `Bearer ${apple.token}` },
        params: {
          term: query,
          types: 'songs',
          limit
        }
      });

      const tracks = response.data.results.songs?.data || [];

      return tracks.map((track: AppleMusicTrack) => ({
        id: track.id,
        service: 'apple' as const,
        title: track.attributes.name,
        artist: track.attributes.artistName,
        album: track.attributes.albumName,
        duration: Math.floor(track.attributes.durationInMillis / 1000),
        bpm: 120, // Apple Music doesn't provide BPM in search
        key: 'C', // Would need additional analysis
        energy: 75,
        streamUrl: '', // Handled by MusicKit JS
        previewUrl: track.attributes.previews[0]?.url || '',
        artwork: track.attributes.artwork.url.replace('{w}x{h}', '300x300'),
        externalUrl: track.attributes.url
      }));
    } catch (error) {
      console.error('Apple Music search error:', error);
      throw error;
    }
  }

  // Cross-platform search
  async searchAllPlatforms(query: string, limit: number = 20): Promise<{
    spotify: DJTrack[];
    soundcloud: DJTrack[];
    apple: DJTrack[];
  }> {
    const results = {
      spotify: [] as DJTrack[],
      soundcloud: [] as DJTrack[],
      apple: [] as DJTrack[]
    };

    // Search all connected platforms simultaneously
    const searchPromises = [];

    if (this.services.get('spotify')?.connected) {
      searchPromises.push(
        this.searchSpotifyTracks(query, limit)
          .then(tracks => { results.spotify = tracks; })
          .catch(error => console.error('Spotify search failed:', error))
      );
    }

    if (this.services.get('soundcloud')?.connected) {
      searchPromises.push(
        this.searchSoundCloudTracks(query, limit)
          .then(tracks => { results.soundcloud = tracks; })
          .catch(error => console.error('SoundCloud search failed:', error))
      );
    }

    if (this.services.get('apple')?.connected) {
      searchPromises.push(
        this.searchAppleMusicTracks(query, limit)
          .then(tracks => { results.apple = tracks; })
          .catch(error => console.error('Apple Music search failed:', error))
      );
    }

    await Promise.all(searchPromises);
    return results;
  }

  // Streaming and playback management
  async loadTrackForDJ(trackId: string, service: 'spotify' | 'soundcloud' | 'apple', deckId: string) {
    try {
      let track: DJTrack | null = null;

      switch (service) {
        case 'spotify':
          // Use Spotify Web Playback SDK for full track playback
          track = await this.getSpotifyTrackDetails(trackId);
          break;
        case 'soundcloud':
          track = await this.getSoundCloudTrackDetails(trackId);
          break;
        case 'apple':
          // Use Apple MusicKit JS for playback
          track = await this.getAppleMusicTrackDetails(trackId);
          break;
      }

      if (track) {
        this.activeStreams.set(`${deckId}-${service}`, {
          track,
          deckId,
          startTime: Date.now(),
          position: 0
        });

        return {
          success: true,
          track,
          deckId,
          playbackInfo: this.getPlaybackInstructions(service, track)
        };
      }

      throw new Error('Track not found');
    } catch (error) {
      console.error(`Error loading ${service} track:`, error);
      throw error;
    }
  }

  private getPlaybackInstructions(service: string, track: DJTrack) {
    switch (service) {
      case 'spotify':
        return {
          method: 'spotify_web_playback_sdk',
          instructions: 'Use Spotify Web Playback SDK to play full track',
          sdkRequired: true,
          previewOnly: false
        };
      case 'soundcloud':
        return {
          method: 'direct_stream',
          instructions: 'Stream directly from SoundCloud API',
          streamUrl: track.streamUrl,
          previewOnly: false
        };
      case 'apple':
        return {
          method: 'musickit_js',
          instructions: 'Use Apple MusicKit JS for playback',
          sdkRequired: true,
          previewOnly: false
        };
      default:
        return {
          method: 'preview_only',
          instructions: 'Preview clips only - 30 second limitation',
          previewOnly: true
        };
    }
  }

  // Utility methods
  private convertSpotifyKey(key: number): string {
    const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    return keys[key] || 'C';
  }

  private async getSpotifyTrackDetails(trackId: string): Promise<DJTrack | null> {
    // Implementation to get detailed Spotify track info
    return null; // Placeholder
  }

  private async getSoundCloudTrackDetails(trackId: string): Promise<DJTrack | null> {
    // Implementation to get detailed SoundCloud track info
    return null; // Placeholder
  }

  private async getAppleMusicTrackDetails(trackId: string): Promise<DJTrack | null> {
    // Implementation to get detailed Apple Music track info
    return null; // Placeholder
  }

  private handleStreamingMessage(ws: WebSocket, message: any) {
    switch (message.type) {
      case 'search_all_platforms':
        this.handleCrossplatformSearch(ws, message);
        break;
      case 'load_track':
        this.handleLoadTrack(ws, message);
        break;
      case 'connect_service':
        this.handleConnectService(ws, message);
        break;
      case 'get_service_status':
        this.handleGetServiceStatus(ws, message);
        break;
    }
  }

  private async handleCrossplatformSearch(ws: WebSocket, message: any) {
    try {
      const results = await this.searchAllPlatforms(message.query, message.limit || 20);
      ws.send(JSON.stringify({
        type: 'search_results',
        query: message.query,
        results
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Search failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  }

  private async handleLoadTrack(ws: WebSocket, message: any) {
    try {
      const result = await this.loadTrackForDJ(
        message.trackId,
        message.service,
        message.deckId
      );
      ws.send(JSON.stringify({
        type: 'track_loaded',
        ...result
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to load track',
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  }

  private handleConnectService(ws: WebSocket, message: any) {
    const { service } = message;
    let authUrl = '';

    switch (service) {
      case 'spotify':
        authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}&scope=streaming user-read-playback-state user-modify-playback-state&redirect_uri=${encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI || '')}`;
        break;
      case 'soundcloud':
        authUrl = `https://soundcloud.com/connect?client_id=${process.env.SOUNDCLOUD_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.SOUNDCLOUD_REDIRECT_URI || '')}&response_type=code&scope=non-expiring`;
        break;
      case 'apple':
        // Apple Music requires MusicKit JS initialization on frontend
        authUrl = 'musickit_js_required';
        break;
    }

    ws.send(JSON.stringify({
      type: 'auth_url',
      service,
      authUrl
    }));
  }

  private handleGetServiceStatus(ws: WebSocket, message: any) {
    const status = Array.from(this.services.entries()).map(([name, service]) => ({
      name,
      connected: service.connected,
      hasToken: !!service.token
    }));

    ws.send(JSON.stringify({
      type: 'service_status',
      services: status
    }));
  }

  getEngineStatus() {
    return {
      engine: 'Streaming Integration Engine',
      status: 'active',
      connectedServices: Array.from(this.services.entries())
        .filter(([_, service]) => service.connected)
        .map(([name, _]) => name),
      activeStreams: this.activeStreams.size,
      cacheSize: this.cache.size
    };
  }
}

export const streamingIntegrationEngine = new StreamingIntegrationEngine();