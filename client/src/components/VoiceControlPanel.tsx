import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Mic, MicOff, Volume2, Settings, Play, Pause, 
  Brain, Zap, MessageSquare, Command, CircleDot,
  Radio, Waves, Activity, CheckCircle, AlertCircle
} from "lucide-react";

interface VoiceCommand {
  id: string;
  example: string;
  category: string;
  response: string;
}

interface VoiceSession {
  isListening: boolean;
  isConnected: boolean;
  confidence: number;
  lastCommand?: string;
  commandHistory: Array<{
    command: string;
    timestamp: Date;
    success: boolean;
    response: string;
  }>;
}

export default function VoiceControlPanel({ 
  onVoiceCommand, 
  isEnabled = true 
}: { 
  onVoiceCommand?: (command: string) => void;
  isEnabled?: boolean;
}) {
  const [session, setSession] = useState<VoiceSession>({
    isListening: false,
    isConnected: false,
    confidence: 0,
    commandHistory: []
  });
  const [availableCommands, setAvailableCommands] = useState<{[key: string]: VoiceCommand[]}>({});
  const [recognition, setRecognition] = useState<any>(null);
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);
  const [activeTab, setActiveTab] = useState("controls");
  const [listeningIndicator, setListeningIndicator] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Initialize speech recognition and WebSocket connection
  useEffect(() => {
    if (!isEnabled) return;

    // Initialize Speech Recognition API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        console.log('Voice recognition started');
        setListeningIndicator(true);
      };

      recognition.onend = () => {
        console.log('Voice recognition ended');
        setListeningIndicator(false);
        if (session.isListening) {
          // Restart recognition if we're supposed to be listening
          setTimeout(() => recognition.start(), 100);
        }
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        const confidence = event.results[event.results.length - 1][0].confidence;
        
        if (event.results[event.results.length - 1].isFinal) {
          handleVoiceInput(transcript, confidence);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Voice recognition error:', event.error);
        setListeningIndicator(false);
      };

      recognitionRef.current = recognition;
      setRecognition(recognition);
    }

    // Initialize WebSocket connection
    const ws = new WebSocket(`ws://${window.location.host}/voice`);
    
    ws.onopen = () => {
      console.log('Voice control WebSocket connected');
      setSession(prev => ({ ...prev, isConnected: true }));
      
      // Request available commands
      ws.send(JSON.stringify({ type: 'get_commands' }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      handleWebSocketMessage(message);
    };

    ws.onclose = () => {
      console.log('Voice control WebSocket disconnected');
      setSession(prev => ({ ...prev, isConnected: false }));
    };

    ws.onerror = (error) => {
      console.error('Voice control WebSocket error:', error);
    };

    wsRef.current = ws;
    setWsConnection(ws);

    return () => {
      if (recognition) {
        recognition.stop();
      }
      if (ws) {
        ws.close();
      }
    };
  }, [isEnabled]);

  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case 'voice_commands':
      case 'commands_list':
        setAvailableCommands(message.commands);
        break;
      case 'command_executed':
        addToHistory(message.transcript, true, message.response);
        setSession(prev => ({ ...prev, confidence: message.confidence }));
        if (onVoiceCommand) {
          onVoiceCommand(message.command);
        }
        break;
      case 'command_not_recognized':
        addToHistory(message.transcript, false, "Command not recognized");
        setSession(prev => ({ ...prev, confidence: message.confidence }));
        break;
    }
  };

  const handleVoiceInput = (transcript: string, confidence: number) => {
    if (!wsConnection || !session.isConnected) return;

    setSession(prev => ({ ...prev, confidence }));

    // Send voice command to backend for processing
    wsConnection.send(JSON.stringify({
      type: 'voice_command',
      data: {
        transcript: transcript.trim(),
        confidence
      }
    }));
  };

  const addToHistory = (command: string, success: boolean, response: string) => {
    const historyItem = {
      command,
      timestamp: new Date(),
      success,
      response
    };

    setSession(prev => ({
      ...prev,
      lastCommand: command,
      commandHistory: [historyItem, ...prev.commandHistory.slice(0, 9)] // Keep last 10 commands
    }));
  };

  const toggleListening = () => {
    if (!recognition || !wsConnection) return;

    if (session.isListening) {
      recognition.stop();
      wsConnection.send(JSON.stringify({ type: 'stop_listening' }));
      setSession(prev => ({ ...prev, isListening: false }));
    } else {
      recognition.start();
      wsConnection.send(JSON.stringify({ 
        type: 'start_listening',
        data: { userId: 'current_user' }
      }));
      setSession(prev => ({ ...prev, isListening: true }));
    }
  };

  const testVoiceCommand = (command: string) => {
    if (wsConnection && session.isConnected) {
      wsConnection.send(JSON.stringify({
        type: 'voice_command',
        data: {
          transcript: command,
          confidence: 1.0
        }
      }));
    }
  };

  const getConnectionStatus = () => {
    if (!session.isConnected) return { color: "red", text: "Disconnected" };
    if (session.isListening) return { color: "green", text: "Listening" };
    return { color: "yellow", text: "Connected" };
  };

  const connectionStatus = getConnectionStatus();

  return (
    <Card className="bg-gray-800 border-gray-700 text-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Mic className="w-6 h-6 text-blue-400" />
              {listeningIndicator && (
                <div className="absolute -top-1 -right-1">
                  <CircleDot className="w-3 h-3 text-green-400 animate-pulse" />
                </div>
              )}
            </div>
            <div>
              <CardTitle>Voice Control</CardTitle>
              <CardDescription>Natural language studio control</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant="outline" 
              className={`border-${connectionStatus.color}-400 text-${connectionStatus.color}-400`}
            >
              <Radio className="w-3 h-3 mr-1" />
              {connectionStatus.text}
            </Badge>
            <Button
              onClick={toggleListening}
              disabled={!session.isConnected || !recognition}
              className={`w-12 h-12 rounded-full ${
                session.isListening 
                  ? "bg-red-600 hover:bg-red-700" 
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {session.isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-700">
            <TabsTrigger value="controls">Controls</TabsTrigger>
            <TabsTrigger value="commands">Commands</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="controls" className="space-y-4">
            {/* Voice Status */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Voice Recognition</span>
                <Badge variant={session.isListening ? "default" : "secondary"}>
                  {session.isListening ? "Active" : "Inactive"}
                </Badge>
              </div>
              
              {session.confidence > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Confidence</span>
                    <span className="text-sm text-white">{Math.round(session.confidence * 100)}%</span>
                  </div>
                  <Progress value={session.confidence * 100} className="h-2" />
                </div>
              )}

              {session.lastCommand && (
                <div className="p-3 bg-gray-700 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">Last Command</div>
                  <div className="text-sm text-white">{session.lastCommand}</div>
                </div>
              )}
            </div>

            <Separator className="bg-gray-600" />

            {/* Quick Test Commands */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-300">Quick Test Commands</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Play",
                  "Pause", 
                  "Volume Up",
                  "Select Piano",
                  "Add Reverb",
                  "Save Project"
                ].map((command) => (
                  <Button
                    key={command}
                    variant="outline"
                    size="sm"
                    onClick={() => testVoiceCommand(command)}
                    disabled={!session.isConnected}
                    className="justify-start text-xs"
                  >
                    <MessageSquare className="w-3 h-3 mr-1" />
                    {command}
                  </Button>
                ))}
              </div>
            </div>

            {/* Live Audio Visualization */}
            {session.isListening && (
              <div className="space-y-2">
                <div className="text-sm text-gray-400">Audio Input</div>
                <div className="flex items-center justify-center space-x-1 h-12 bg-gray-900 rounded-lg">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 bg-blue-400 rounded-full transition-all duration-150 ${
                        Math.random() > 0.5 ? 'opacity-100' : 'opacity-30'
                      }`}
                      style={{ 
                        height: `${Math.random() * 80 + 20}%`,
                        animationDelay: `${i * 50}ms`
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="commands" className="space-y-4">
            <ScrollArea className="h-80">
              <div className="space-y-4">
                {Object.entries(availableCommands).map(([category, commands]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-300 capitalize flex items-center">
                      {category === 'transport' && <Play className="w-4 h-4 mr-2" />}
                      {category === 'mixer' && <Volume2 className="w-4 h-4 mr-2" />}
                      {category === 'effects' && <Zap className="w-4 h-4 mr-2" />}
                      {category === 'ai' && <Brain className="w-4 h-4 mr-2" />}
                      {category === 'navigation' && <Command className="w-4 h-4 mr-2" />}
                      {category}
                    </h4>
                    <div className="space-y-1">
                      {commands.map((cmd) => (
                        <div 
                          key={cmd.id}
                          className="p-2 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                          onClick={() => testVoiceCommand(cmd.example)}
                        >
                          <div className="text-sm text-blue-400">"{cmd.example}"</div>
                          <div className="text-xs text-gray-400 mt-1">{cmd.response}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-300">Command History</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSession(prev => ({ ...prev, commandHistory: [] }))}
                className="text-xs"
              >
                Clear History
              </Button>
            </div>
            
            <ScrollArea className="h-80">
              <div className="space-y-2">
                {session.commandHistory.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <div className="text-sm">No commands yet</div>
                  </div>
                ) : (
                  session.commandHistory.map((item, index) => (
                    <div key={index} className="p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            {item.success ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-400" />
                            )}
                            <span className="text-sm text-white">{item.command}</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">{item.response}</div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-white">Continuous Listening</div>
                  <div className="text-xs text-gray-400">Keep voice recognition active</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleListening}
                  disabled={!session.isConnected}
                >
                  {session.isListening ? "Disable" : "Enable"}
                </Button>
              </div>

              <Separator className="bg-gray-600" />

              <div className="space-y-3">
                <div className="text-sm font-medium text-white">Voice Recognition Status</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Browser Support</span>
                    <Badge variant={recognition ? "default" : "destructive"}>
                      {recognition ? "Supported" : "Not Supported"}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">WebSocket Connection</span>
                    <Badge variant={session.isConnected ? "default" : "destructive"}>
                      {session.isConnected ? "Connected" : "Disconnected"}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Available Commands</span>
                    <Badge variant="secondary">
                      {Object.values(availableCommands).flat().length}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-600" />

              <div className="space-y-2">
                <div className="text-sm font-medium text-white">Usage Tips</div>
                <div className="text-xs text-gray-400 space-y-1">
                  <div>• Speak clearly and naturally</div>
                  <div>• Wait for the response before giving next command</div>
                  <div>• Use "Hey Studio" to get attention first</div>
                  <div>• Try variations if a command isn't recognized</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}