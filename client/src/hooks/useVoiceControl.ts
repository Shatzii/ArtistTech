import { useState, useEffect, useCallback, useRef } from 'react';

interface VoiceControlState {
  isListening: boolean;
  isConnected: boolean;
  isSupported: boolean;
  confidence: number;
  lastCommand?: string;
  error?: string;
}

interface VoiceCommandEvent {
  command: string;
  transcript: string;
  confidence: number;
  success: boolean;
  response: string;
}

export function useVoiceControl(onCommand?: (event: VoiceCommandEvent) => void) {
  const [state, setState] = useState<VoiceControlState>({
    isListening: false,
    isConnected: false,
    isSupported: false,
    confidence: 0
  });

  const recognitionRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Initialize voice control
  useEffect(() => {
    // Check browser support for Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const isSupported = !!SpeechRecognition;

    setState(prev => ({ ...prev, isSupported }));

    if (!isSupported) {
      setState(prev => ({ ...prev, error: 'Speech Recognition not supported in this browser' }));
      return;
    }

    // Initialize Speech Recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('Voice recognition started');
      setState(prev => ({ ...prev, error: undefined }));
    };

    recognition.onend = () => {
      console.log('Voice recognition ended');
      if (state.isListening) {
        // Auto-restart if we should be listening
        setTimeout(() => {
          try {
            recognition.start();
          } catch (error) {
            console.error('Failed to restart recognition:', error);
          }
        }, 100);
      }
    };

    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      if (result.isFinal) {
        const transcript = result[0].transcript.trim();
        const confidence = result[0].confidence;
        
        setState(prev => ({ 
          ...prev, 
          confidence,
          lastCommand: transcript 
        }));

        // Send to backend for processing
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'voice_command',
            data: { transcript, confidence }
          }));
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setState(prev => ({ 
        ...prev, 
        error: `Recognition error: ${event.error}`,
        isListening: false 
      }));
    };

    recognitionRef.current = recognition;

    // Initialize WebSocket connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/voice`);

    ws.onopen = () => {
      console.log('Voice control WebSocket connected');
      setState(prev => ({ ...prev, isConnected: true, error: undefined }));
      
      // Request initial command list
      ws.send(JSON.stringify({ type: 'get_commands' }));
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        handleWebSocketMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('Voice control WebSocket disconnected');
      setState(prev => ({ 
        ...prev, 
        isConnected: false,
        isListening: false,
        error: 'Connection lost' 
      }));
    };

    ws.onerror = (error) => {
      console.error('Voice control WebSocket error:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'WebSocket connection error' 
      }));
    };

    wsRef.current = ws;

    // Cleanup on unmount
    return () => {
      if (recognition) {
        recognition.stop();
      }
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const handleWebSocketMessage = useCallback((message: any) => {
    switch (message.type) {
      case 'command_executed':
        if (onCommand) {
          onCommand({
            command: message.command,
            transcript: message.transcript,
            confidence: message.confidence,
            success: true,
            response: message.response
          });
        }
        setState(prev => ({ ...prev, confidence: message.confidence }));
        break;

      case 'command_not_recognized':
        if (onCommand) {
          onCommand({
            command: 'unknown',
            transcript: message.transcript,
            confidence: message.confidence,
            success: false,
            response: 'Command not recognized'
          });
        }
        setState(prev => ({ ...prev, confidence: message.confidence }));
        break;

      case 'voice_commands':
      case 'commands_list':
        // Commands list received - could be used to update UI
        console.log('Available commands:', message.commands);
        break;
    }
  }, [onCommand]);

  // Start listening
  const startListening = useCallback(() => {
    if (!state.isSupported || !recognitionRef.current) {
      setState(prev => ({ ...prev, error: 'Speech recognition not available' }));
      return false;
    }

    if (!state.isConnected) {
      setState(prev => ({ ...prev, error: 'WebSocket not connected' }));
      return false;
    }

    try {
      recognitionRef.current.start();
      setState(prev => ({ ...prev, isListening: true, error: undefined }));
      
      // Notify backend
      wsRef.current?.send(JSON.stringify({ 
        type: 'start_listening',
        data: { userId: 'current_user' }
      }));
      
      return true;
    } catch (error) {
      console.error('Failed to start listening:', error);
      setState(prev => ({ ...prev, error: 'Failed to start voice recognition' }));
      return false;
    }
  }, [state.isSupported, state.isConnected]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    setState(prev => ({ ...prev, isListening: false }));
    
    // Notify backend
    wsRef.current?.send(JSON.stringify({ type: 'stop_listening' }));
  }, []);

  // Toggle listening state
  const toggleListening = useCallback(() => {
    if (state.isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [state.isListening, startListening, stopListening]);

  // Send a test command
  const sendTestCommand = useCallback((command: string) => {
    if (!state.isConnected) {
      return false;
    }

    wsRef.current?.send(JSON.stringify({
      type: 'voice_command',
      data: {
        transcript: command,
        confidence: 1.0
      }
    }));

    setState(prev => ({ ...prev, lastCommand: command }));
    return true;
  }, [state.isConnected]);

  return {
    ...state,
    startListening,
    stopListening,
    toggleListening,
    sendTestCommand
  };
}