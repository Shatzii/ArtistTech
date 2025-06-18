import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Send, 
  Smile, 
  Mic, 
  Image,
  ThumbsUp,
  Heart,
  Star
} from "lucide-react";

interface ChatMessage {
  id: number;
  senderId: number;
  senderType: 'teacher' | 'student';
  senderName: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'emoji' | 'voice_note';
}

interface ChatPanelProps {
  lessonId: number;
}

export default function ChatPanel({ lessonId }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Sample chat messages
  useEffect(() => {
    setMessages([
      {
        id: 1,
        senderId: 1,
        senderType: 'teacher',
        senderName: 'Sarah Johnson',
        message: 'Welcome to your piano lesson! Today we\'ll work on the C major scale.',
        timestamp: new Date(Date.now() - 300000),
        type: 'text'
      },
      {
        id: 2,
        senderId: 2,
        senderType: 'student',
        senderName: 'Emma Wilson',
        message: 'Thank you! I\'ve been practicing since last week.',
        timestamp: new Date(Date.now() - 240000),
        type: 'text'
      },
      {
        id: 3,
        senderId: 1,
        senderType: 'teacher',
        senderName: 'Sarah Johnson',
        message: 'Great! Let\'s start with some finger warm-ups first.',
        timestamp: new Date(Date.now() - 180000),
        type: 'text'
      },
      {
        id: 4,
        senderId: 2,
        senderType: 'student',
        senderName: 'Emma Wilson',
        message: '👍',
        timestamp: new Date(Date.now() - 120000),
        type: 'emoji'
      }
    ]);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now(),
      senderId: 2, // Assuming current user is student
      senderType: 'student',
      senderName: 'Emma Wilson',
      message: newMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");

    // Send to backend
    try {
      await fetch('/api/chat-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId,
          senderId: 2,
          senderType: 'student',
          message: newMessage,
          type: 'text'
        }),
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const sendEmoji = async (emoji: string) => {
    const message: ChatMessage = {
      id: Date.now(),
      senderId: 2,
      senderType: 'student',
      senderName: 'Emma Wilson',
      message: emoji,
      timestamp: new Date(),
      type: 'emoji'
    };

    setMessages(prev => [...prev, message]);

    // Send to backend
    try {
      await fetch('/api/chat-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId,
          senderId: 2,
          senderType: 'student',
          message: emoji,
          type: 'emoji'
        }),
      });
    } catch (error) {
      console.error('Failed to send emoji:', error);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickEmojis = ['👍', '👏', '😊', '🎵', '⭐', '❤️'];

  return (
    <Card className="bg-gray-900 border-gray-700 flex-1 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="mr-2 text-blue-400" size={16} />
            Lesson Chat
          </div>
          <Badge variant="secondary" className="text-xs">
            {messages.length} messages
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4 p-3">
        {/* Messages */}
        <ScrollArea className="flex-1 pr-2" ref={scrollAreaRef}>
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderType === 'student' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-2 rounded-lg text-xs ${
                    message.senderType === 'student'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-200'
                  }`}
                >
                  <div className="font-medium mb-1 text-xs opacity-75">
                    {message.senderName}
                  </div>
                  <div className={message.type === 'emoji' ? 'text-lg' : ''}>
                    {message.message}
                  </div>
                  <div className="text-xs opacity-60 mt-1">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-gray-200 p-2 rounded-lg text-xs">
                  <div className="font-medium mb-1 text-xs opacity-75">
                    Sarah Johnson
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Emojis */}
        <div className="flex space-x-1 justify-center">
          {quickEmojis.map((emoji, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-lg hover:bg-gray-700"
              onClick={() => sendEmoji(emoji)}
            >
              {emoji}
            </Button>
          ))}
        </div>

        {/* Message Input */}
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 text-sm"
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            size="sm"
            className="px-3"
          >
            <Send size={14} />
          </Button>
        </div>

        {/* Chat Guidelines */}
        <div className="bg-gray-800 rounded p-2 text-xs text-gray-400">
          <div className="font-medium mb-1">Chat Guidelines:</div>
          <div>• Ask questions about the lesson</div>
          <div>• Share your progress and challenges</div>
          <div>• Use emojis to show appreciation</div>
        </div>
      </CardContent>
    </Card>
  );
}