import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Play, 
  Pause, 
  RotateCcw,
  Zap,
  CheckCircle,
  XCircle
} from "lucide-react";

interface VoiceCommand {
  id: number;
  command: string;
  recognized: string | null;
  confidence: number | null;
  executed: boolean;
  result: string | null;
  timestamp: Date;
}

interface VoiceCommandPanelProps {
  lessonId: number;
}

export default function VoiceCommandPanel({ lessonId }: VoiceCommandPanelProps) {
  const [isListening, setIsListening] = useState(false);
  const [commands, setCommands] = useState<VoiceCommand[]>([]);
  const [currentCommand, setCurrentCommand] = useState<string>("");
  const [confidence, setConfidence] = useState<number>(0);
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  // Available voice commands for music lessons
  const availableCommands = [
    "play the scale",
    "stop playing",
    "play slower",
    "play faster", 
    "repeat that",
    "next exercise",
    "show fingering",
    "play with metronome",
    "louder please",
    "softer please",
    "that's correct",
    "try again",
    "excellent work",
    "focus on timing"
  ];

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const confidence = event.results[i][0].confidence;

          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            processVoiceCommand(transcript, confidence);
          } else {
            interimTranscript += transcript;
            setCurrentCommand(interimTranscript);
          }
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setCurrentCommand("");
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const processVoiceCommand = async (transcript: string, confidence: number) => {
    const cleanTranscript = transcript.toLowerCase().trim();
    
    // Find matching command
    const matchedCommand = availableCommands.find(cmd => 
      cleanTranscript.includes(cmd.toLowerCase()) || 
      cmd.toLowerCase().includes(cleanTranscript)
    );

    const executed = matchedCommand ? await executeCommand(matchedCommand) : false;
    
    const newCommand: VoiceCommand = {
      id: Date.now(),
      command: cleanTranscript,
      recognized: matchedCommand || null,
      confidence: Math.round(confidence * 100),
      executed,
      result: executed ? `Executed: ${matchedCommand}` : "Command not recognized",
      timestamp: new Date()
    };

    setCommands(prev => [newCommand, ...prev].slice(0, 20)); // Keep last 20 commands
    setConfidence(Math.round(confidence * 100));
  };

  const executeCommand = async (command: string): Promise<boolean> => {
    // Simulate command execution
    console.log(`Executing voice command: ${command}`);
    
    // Send to backend for processing
    try {
      const response = await fetch('/api/voice-commands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId,
          command,
          timestamp: new Date(),
          executed: true,
          result: `Successfully executed: ${command}`
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to save voice command:', error);
      return false;
    }
  };

  const toggleListening = () => {
    if (!isSupported) {
      alert('Speech recognition is not supported in this browser');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const clearCommands = () => {
    setCommands([]);
  };

  return (
    <Card className="bg-gray-900 border-gray-700 mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center">
            <Zap className="mr-2 text-yellow-400" size={16} />
            Voice Commands
          </div>
          <Badge variant={isListening ? "default" : "secondary"} className="text-xs">
            {isListening ? "Listening" : "Inactive"}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Voice Control */}
        <div className="flex items-center justify-between">
          <Button
            onClick={toggleListening}
            variant={isListening ? "destructive" : "default"}
            size="sm"
            className="flex-1 mr-2"
            disabled={!isSupported}
          >
            {isListening ? <MicOff size={16} className="mr-2" /> : <Mic size={16} className="mr-2" />}
            {isListening ? "Stop" : "Listen"}
          </Button>
          
          <Button
            onClick={clearCommands}
            variant="outline"
            size="sm"
          >
            <RotateCcw size={16} />
          </Button>
        </div>

        {/* Current Command */}
        {currentCommand && (
          <div className="bg-blue-600 bg-opacity-20 border border-blue-500 rounded p-2">
            <div className="text-xs text-blue-400 mb-1">Listening...</div>
            <div className="text-sm text-white">{currentCommand}</div>
          </div>
        )}

        {/* Confidence Meter */}
        {confidence > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Confidence</span>
              <span>{confidence}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  confidence > 80 ? 'bg-green-500' : 
                  confidence > 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>
        )}

        {/* Available Commands */}
        <div className="space-y-2">
          <div className="text-xs text-gray-400 font-medium">Try saying:</div>
          <div className="grid grid-cols-2 gap-1">
            {availableCommands.slice(0, 8).map((cmd, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs px-2 py-1 justify-center cursor-pointer hover:bg-gray-700"
                onClick={() => processVoiceCommand(cmd, 1.0)}
              >
                {cmd}
              </Badge>
            ))}
          </div>
        </div>

        {/* Command History */}
        <div className="space-y-2">
          <div className="text-xs text-gray-400 font-medium">Recent Commands:</div>
          <ScrollArea className="h-32">
            <div className="space-y-2">
              {commands.map((cmd) => (
                <div
                  key={cmd.id}
                  className={`p-2 rounded text-xs border ${
                    cmd.executed 
                      ? 'bg-green-600 bg-opacity-20 border-green-500' 
                      : 'bg-red-600 bg-opacity-20 border-red-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{cmd.command}</span>
                    {cmd.executed ? (
                      <CheckCircle size={12} className="text-green-400" />
                    ) : (
                      <XCircle size={12} className="text-red-400" />
                    )}
                  </div>
                  {cmd.recognized && (
                    <div className="text-gray-400">→ {cmd.recognized}</div>
                  )}
                  <div className="text-gray-500">
                    {cmd.timestamp.toLocaleTimeString()} • {cmd.confidence}% confidence
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {!isSupported && (
          <div className="bg-yellow-600 bg-opacity-20 border border-yellow-500 rounded p-2 text-xs text-yellow-400">
            Voice recognition not supported in this browser. Try Chrome or Edge.
          </div>
        )}
      </CardContent>
    </Card>
  );
}