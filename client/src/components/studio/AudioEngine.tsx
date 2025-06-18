import { useEffect } from "react";
import { useAudioEngine } from "@/hooks/useAudioEngine";

export default function AudioEngine() {
  const audioEngine = useAudioEngine();

  useEffect(() => {
    // Initialize Web Audio API when component mounts
    audioEngine.initialize();

    return () => {
      // Cleanup on unmount
      audioEngine.cleanup();
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}
