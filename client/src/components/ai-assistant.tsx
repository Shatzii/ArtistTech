import { useState } from 'react';
import { Brain, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { HolographicPanel, HolographicButton } from './holographic-ui';

export default function AIAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastCommand, setLastCommand] = useState('');

  const commands = [
    "Mix to the drop",
    "Increase the bass",
    "Match the tempo",
    "Apply reverb",
    "Start recording",
    "Load hip-hop preset",
    "Sync to beat",
    "Crossfade to B"
  ];

  const handleVoiceCommand = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        const randomCommand = commands[Math.floor(Math.random() * commands.length)];
        setLastCommand(randomCommand);
        setIsListening(false);
        setIsSpeaking(true);
        
        // Simulate AI response
        setTimeout(() => {
          setIsSpeaking(false);
        }, 2000);
      }, 3000);
    }
  };

  return (
    <HolographicPanel 
      title="AI VOICE ASSISTANT" 
      subtitle="Voice commands & real-time assistance"
      ai={true}
      glowColor="purple"
    >
      <div className="space-y-4">
        {/* Voice Control */}
        <div className="flex items-center justify-between">
          <HolographicButton
            variant={isListening ? "danger" : "ai"}
            onClick={handleVoiceCommand}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4 mr-2" />
                Listening...
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                Voice Command
              </>
            )}
          </HolographicButton>

          <div className="flex items-center space-x-2">
            {isSpeaking ? (
              <>
                <Volume2 className="w-4 h-4 text-green-400 animate-pulse" />
                <span className="text-xs text-green-400">AI Speaking</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400">Ready</span>
              </>
            )}
          </div>
        </div>

        {/* Last Command */}
        {lastCommand && (
          <div className="bg-purple-500/20 border border-purple-500/30 rounded p-3">
            <div className="text-xs text-purple-400 mb-1">Last Command:</div>
            <div className="text-white font-bold">"{lastCommand}"</div>
            <div className="text-xs text-green-400 mt-1">✓ Executed successfully</div>
          </div>
        )}

        {/* AI Suggestions */}
        <div className="space-y-2">
          <div className="text-xs text-gray-400 mb-2">AI SUGGESTIONS:</div>
          {commands.slice(0, 3).map((command, i) => (
            <button
              key={i}
              className="w-full text-left bg-gray-800/50 hover:bg-purple-500/20 border border-gray-700 hover:border-purple-500/30 rounded p-2 text-xs transition-colors"
              onClick={() => setLastCommand(command)}
            >
              <Brain className="w-3 h-3 inline mr-2 text-purple-400" />
              {command}
            </button>
          ))}
        </div>

        {/* Neural Activity */}
        <div className="bg-black/50 rounded p-2">
          <div className="text-xs text-gray-400 mb-2">NEURAL ACTIVITY:</div>
          <div className="flex space-x-1">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-purple-400 rounded transition-all duration-300"
                style={{
                  height: `${isListening || isSpeaking ? 4 + Math.random() * 16 : 4}px`,
                  opacity: isListening || isSpeaking ? 0.7 + Math.random() * 0.3 : 0.3
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </HolographicPanel>
  );
}