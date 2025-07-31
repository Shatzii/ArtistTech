import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

// Comprehensive Studio API Hooks for Full Frontend-Backend Integration

// =============================================================================
// MUSIC STUDIO HOOKS
// =============================================================================

export function useMusicStudioTransport() {
  const queryClient = useQueryClient();

  const playMutation = useMutation({
    mutationFn: async ({ projectId, position }: { projectId?: string; position?: number }) => {
      return apiRequest('/api/studio/music/transport/play', {
        method: 'POST',
        body: JSON.stringify({ projectId, position })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/studios/status'] });
    }
  });

  const pauseMutation = useMutation({
    mutationFn: async ({ projectId }: { projectId?: string }) => {
      return apiRequest('/api/studio/music/transport/pause', {
        method: 'POST',
        body: JSON.stringify({ projectId })
      });
    }
  });

  const recordMutation = useMutation({
    mutationFn: async ({ projectId, trackId }: { projectId?: string; trackId?: string }) => {
      return apiRequest('/api/studio/music/transport/record', {
        method: 'POST',
        body: JSON.stringify({ projectId, trackId })
      });
    }
  });

  return {
    play: playMutation,
    pause: pauseMutation,
    record: recordMutation
  };
}

export function useMusicStudioMixer() {
  const mixerMutation = useMutation({
    mutationFn: async ({ channelId, property, value }: { channelId: string; property: string; value: any }) => {
      return apiRequest('/api/studio/music/mixer/channel', {
        method: 'POST',
        body: JSON.stringify({ channelId, property, value })
      });
    }
  });

  return {
    updateChannel: mixerMutation
  };
}

export function useMusicStudioInstruments() {
  const loadInstrumentMutation = useMutation({
    mutationFn: async ({ instrumentType, preset }: { instrumentType: string; preset: string }) => {
      return apiRequest('/api/studio/music/instruments/load', {
        method: 'POST',
        body: JSON.stringify({ instrumentType, preset })
      });
    }
  });

  return {
    loadInstrument: loadInstrumentMutation
  };
}

export function useMusicStudioProject() {
  const saveProjectMutation = useMutation({
    mutationFn: async ({ projectName, tracks, settings }: { projectName: string; tracks: any[]; settings: any }) => {
      return apiRequest('/api/studio/music/project/save', {
        method: 'POST',
        body: JSON.stringify({ projectName, tracks, settings })
      });
    }
  });

  return {
    saveProject: saveProjectMutation
  };
}

// =============================================================================
// DJ STUDIO HOOKS
// =============================================================================

export function useDJStudio() {
  const loadTrackMutation = useMutation({
    mutationFn: async ({ deckId, trackId }: { deckId: string; trackId: string }) => {
      return apiRequest('/api/studio/dj/deck/load', {
        method: 'POST',
        body: JSON.stringify({ deckId, trackId })
      });
    }
  });

  const crossfaderMutation = useMutation({
    mutationFn: async ({ position }: { position: number }) => {
      return apiRequest('/api/studio/dj/crossfader', {
        method: 'POST',
        body: JSON.stringify({ position })
      });
    }
  });

  const effectsMutation = useMutation({
    mutationFn: async ({ deckId, effect, value }: { deckId: string; effect: string; value: number }) => {
      return apiRequest('/api/studio/dj/effects', {
        method: 'POST',
        body: JSON.stringify({ deckId, effect, value })
      });
    }
  });

  return {
    loadTrack: loadTrackMutation,
    moveCrossfader: crossfaderMutation,
    applyEffect: effectsMutation
  };
}

// =============================================================================
// VIDEO STUDIO HOOKS
// =============================================================================

export function useVideoStudio() {
  const renderMutation = useMutation({
    mutationFn: async ({ projectId, format, quality }: { projectId: string; format: string; quality: string }) => {
      return apiRequest('/api/studio/video/render', {
        method: 'POST',
        body: JSON.stringify({ projectId, format, quality })
      });
    }
  });

  const applyEffectMutation = useMutation({
    mutationFn: async ({ clipId, effectType, parameters }: { clipId: string; effectType: string; parameters: any }) => {
      return apiRequest('/api/studio/video/effects/apply', {
        method: 'POST',
        body: JSON.stringify({ clipId, effectType, parameters })
      });
    }
  });

  return {
    render: renderMutation,
    applyEffect: applyEffectMutation
  };
}

// =============================================================================
// SOCIAL MEDIA STUDIO HOOKS
// =============================================================================

export function useSocialMediaStudio() {
  const generateContentMutation = useMutation({
    mutationFn: async ({ platform, contentType, topic }: { platform: string; contentType: string; topic: string }) => {
      return apiRequest('/api/studio/social/generate-content', {
        method: 'POST',
        body: JSON.stringify({ platform, contentType, topic })
      });
    }
  });

  const postContentMutation = useMutation({
    mutationFn: async ({ platform, content, scheduleTime }: { platform: string; content: string; scheduleTime?: string }) => {
      return apiRequest('/api/studio/social/post', {
        method: 'POST',
        body: JSON.stringify({ platform, content, scheduleTime })
      });
    }
  });

  return {
    generateContent: generateContentMutation,
    postContent: postContentMutation
  };
}

// =============================================================================
// COLLABORATIVE STUDIO HOOKS
// =============================================================================

export function useCollaborativeStudio() {
  const joinSessionMutation = useMutation({
    mutationFn: async ({ sessionId, userId, studioType }: { sessionId: string; userId: string; studioType: string }) => {
      return apiRequest('/api/studio/collaborate/join', {
        method: 'POST',
        body: JSON.stringify({ sessionId, userId, studioType })
      });
    }
  });

  return {
    joinSession: joinSessionMutation
  };
}

// =============================================================================
// AI CAREER MANAGER HOOKS
// =============================================================================

export function useAICareerManager() {
  const analyzeCareerMutation = useMutation({
    mutationFn: async ({ artistId, analysisType }: { artistId: string; analysisType: string }) => {
      return apiRequest('/api/studio/career/analyze', {
        method: 'POST',
        body: JSON.stringify({ artistId, analysisType })
      });
    }
  });

  return {
    analyzeCareer: analyzeCareerMutation
  };
}

// =============================================================================
// UNIVERSAL STUDIO STATUS HOOK
// =============================================================================

export function useStudioStatus() {
  return useQuery({
    queryKey: ['/api/studios/status'],
    refetchInterval: 5000, // Update every 5 seconds
    staleTime: 2000 // Consider data stale after 2 seconds
  });
}

// =============================================================================
// ENHANCED STUDIO ACTIONS - Comprehensive Integration
// =============================================================================

export function useEnhancedStudioActions() {
  const queryClient = useQueryClient();
  
  // Music Studio Actions
  const musicActions = useMusicStudioTransport();
  const mixerActions = useMusicStudioMixer();
  const instrumentActions = useMusicStudioInstruments();
  const projectActions = useMusicStudioProject();
  
  // DJ Studio Actions
  const djActions = useDJStudio();
  
  // Video Studio Actions
  const videoActions = useVideoStudio();
  
  // Social Media Actions
  const socialActions = useSocialMediaStudio();
  
  // Collaborative Actions
  const collabActions = useCollaborativeStudio();
  
  // Career Management Actions
  const careerActions = useAICareerManager();
  
  // Studio Status
  const studioStatus = useStudioStatus();

  return {
    // Music Studio
    music: {
      transport: musicActions,
      mixer: mixerActions,
      instruments: instrumentActions,
      project: projectActions
    },
    
    // DJ Studio
    dj: djActions,
    
    // Video Studio
    video: videoActions,
    
    // Social Media Studio
    social: socialActions,
    
    // Collaborative Studio
    collaboration: collabActions,
    
    // AI Career Manager
    career: careerActions,
    
    // Studio Status
    status: studioStatus,
    
    // Universal refresh function
    refreshAll: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/studios/status'] });
    }
  };
}