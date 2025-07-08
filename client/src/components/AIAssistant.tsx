import { useState, useEffect } from 'react';
import { Brain, Mic, Music, Sparkles, Wand2, MessageSquare, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { apiRequest } from '@/lib/queryClient';

interface AIAssistantProps {
  onSuggestion?: (suggestion: any) => void;
  context?: 'music' | 'dj' | 'video' | 'collaboration';
}

interface AISuggestion {
  type: 'chord_progression' | 'melody' | 'effects' | 'arrangement' | 'mixing';
  title: string;
  description: string;
  confidence: number;
  parameters: any;
}

export default function AIAssistant({ onSuggestion, context = 'music' }: AIAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [voiceInput, setVoiceInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatMode, setChatMode] = useState(false);

  // AI-powered creative suggestions
  const generateSuggestions = async () => {
    setIsProcessing(true);
    try {
      const response = await apiRequest('POST', '/api/ai/creative-suggestions', {
        context,
        currentProject: 'active',
        style: 'adaptive'
      });
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Failed to generate AI suggestions:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Voice command processing
  const handleVoiceCommand = async (command: string) => {
    setIsProcessing(true);
    try {
      const response = await apiRequest('POST', '/api/ai/voice-command', {
        command,
        context
      });
      const data = await response.json();
      
      if (data.action) {
        onSuggestion?.(data.action);
      }
    } catch (error) {
      console.error('Voice command failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Start voice recognition
  const startVoiceRecognition = () => {
    setIsListening(true);
    // Simulate voice recognition with Web Speech API
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceInput(transcript);
        handleVoiceCommand(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.start();
    }
  };

  useEffect(() => {
    generateSuggestions();
  }, [context]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-500" />
            AI Creative Assistant
          </div>
          <div className="flex gap-2">
            <Button
              variant={chatMode ? "default" : "outline"}
              size="sm"
              onClick={() => setChatMode(!chatMode)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
              variant={isListening ? "destructive" : "outline"}
              size="sm"
              onClick={startVoiceRecognition}
              disabled={isProcessing}
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Voice Input Display */}
        {voiceInput && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border-l-4 border-blue-500">
            <p className="text-sm font-medium">Voice Command:</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">"{voiceInput}"</p>
          </div>
        )}

        {/* Chat Mode */}
        {chatMode && (
          <div className="space-y-3">
            <Textarea
              placeholder="Ask the AI assistant for creative help..."
              className="min-h-[80px]"
            />
            <Button className="w-full">
              <Sparkles className="h-4 w-4 mr-2" />
              Get AI Suggestions
            </Button>
          </div>
        )}

        {/* AI Suggestions */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center">
            <Lightbulb className="h-4 w-4 mr-2" />
            Smart Suggestions
          </h4>
          
          {isProcessing ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full"></div>
              <span className="ml-2 text-sm">AI thinking...</span>
            </div>
          ) : (
            suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-3 rounded border cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onSuggestion?.(suggestion)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{suggestion.title}</span>
                  <Badge variant="secondary" className="text-xs">
                    {suggestion.confidence}% match
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                  {suggestion.description}
                </p>
                <div className="flex items-center">
                  <Music className="h-3 w-3 mr-1 text-purple-500" />
                  <span className="text-xs capitalize">{suggestion.type.replace('_', ' ')}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" onClick={generateSuggestions}>
            <Wand2 className="h-4 w-4 mr-1" />
            New Ideas
          </Button>
          <Button variant="outline" size="sm">
            <Sparkles className="h-4 w-4 mr-1" />
            Auto-Enhance
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}