import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Video, 
  Eye, 
  Camera, 
  Record, 
  StopCircle,
  Download,
  AlertTriangle,
  CheckCircle,
  Activity
} from "lucide-react";

interface VideoAnalytics {
  handPosition: 'correct' | 'incorrect' | 'unknown';
  posture: 'good' | 'poor' | 'unknown';
  fingerPlacement: 'accurate' | 'needs_adjustment' | 'unknown';
  tempo: 'on_beat' | 'too_fast' | 'too_slow' | 'unknown';
  confidence: number;
}

interface VideoMonitoringPanelProps {
  lessonId: number;
}

export default function VideoMonitoringPanel({ lessonId }: VideoMonitoringPanelProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analytics, setAnalytics] = useState<VideoAnalytics>({
    handPosition: 'unknown',
    posture: 'unknown',
    fingerPlacement: 'unknown',
    tempo: 'unknown',
    confidence: 0
  });
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordings, setRecordings] = useState<string[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording]);

  // Simulate real-time video analysis
  useEffect(() => {
    if (isAnalyzing) {
      const analysisInterval = setInterval(() => {
        // Simulate AI analysis results
        setAnalytics({
          handPosition: Math.random() > 0.3 ? 'correct' : 'incorrect',
          posture: Math.random() > 0.2 ? 'good' : 'poor',
          fingerPlacement: Math.random() > 0.4 ? 'accurate' : 'needs_adjustment',
          tempo: ['on_beat', 'too_fast', 'too_slow'][Math.floor(Math.random() * 3)] as any,
          confidence: Math.floor(Math.random() * 40) + 60 // 60-100%
        });
      }, 2000);

      return () => clearInterval(analysisInterval);
    }
  }, [isAnalyzing]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setIsRecording(true);
      setIsAnalyzing(true);
      setRecordingDuration(0);
      
      // In a real implementation, you would start MediaRecorder here
      console.log('Started recording lesson for analysis');
      
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsAnalyzing(false);
    
    // Save recording reference
    const recordingId = `lesson-${lessonId}-${Date.now()}`;
    setRecordings(prev => [...prev, recordingId]);
    
    console.log('Stopped recording and saved for teacher review');
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'correct':
      case 'good':
      case 'accurate':
      case 'on_beat':
        return 'text-green-400';
      case 'incorrect':
      case 'poor':
      case 'needs_adjustment':
      case 'too_fast':
      case 'too_slow':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'correct':
      case 'good':
      case 'accurate':
      case 'on_beat':
        return <CheckCircle size={12} className="text-green-400" />;
      case 'incorrect':
      case 'poor':
      case 'needs_adjustment':
      case 'too_fast':
      case 'too_slow':
        return <AlertTriangle size={12} className="text-red-400" />;
      default:
        return <Activity size={12} className="text-gray-400" />;
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-700 mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center">
            <Eye className="mr-2 text-purple-400" size={16} />
            Video Analysis
          </div>
          <Badge variant={isAnalyzing ? "default" : "secondary"} className="text-xs">
            {isAnalyzing ? "Analyzing" : "Inactive"}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Recording Controls */}
        <div className="flex items-center justify-between">
          {!isRecording ? (
            <Button
              onClick={startRecording}
              className="flex-1 bg-red-600 hover:bg-red-700"
              size="sm"
            >
              <Record size={16} className="mr-2" />
              Start Analysis
            </Button>
          ) : (
            <Button
              onClick={stopRecording}
              variant="destructive"
              className="flex-1"
              size="sm"
            >
              <StopCircle size={16} className="mr-2" />
              Stop ({formatDuration(recordingDuration)})
            </Button>
          )}
        </div>

        {/* Real-time Analysis */}
        {isAnalyzing && (
          <div className="space-y-3">
            <div className="text-xs text-gray-400 font-medium">Real-time Feedback:</div>
            
            {/* Hand Position */}
            <div className="flex items-center justify-between p-2 bg-gray-800 rounded">
              <div className="flex items-center">
                {getStatusIcon(analytics.handPosition)}
                <span className="ml-2 text-xs">Hand Position</span>
              </div>
              <span className={`text-xs font-medium ${getStatusColor(analytics.handPosition)}`}>
                {analytics.handPosition.replace('_', ' ')}
              </span>
            </div>

            {/* Posture */}
            <div className="flex items-center justify-between p-2 bg-gray-800 rounded">
              <div className="flex items-center">
                {getStatusIcon(analytics.posture)}
                <span className="ml-2 text-xs">Posture</span>
              </div>
              <span className={`text-xs font-medium ${getStatusColor(analytics.posture)}`}>
                {analytics.posture}
              </span>
            </div>

            {/* Finger Placement */}
            <div className="flex items-center justify-between p-2 bg-gray-800 rounded">
              <div className="flex items-center">
                {getStatusIcon(analytics.fingerPlacement)}
                <span className="ml-2 text-xs">Finger Placement</span>
              </div>
              <span className={`text-xs font-medium ${getStatusColor(analytics.fingerPlacement)}`}>
                {analytics.fingerPlacement.replace('_', ' ')}
              </span>
            </div>

            {/* Tempo */}
            <div className="flex items-center justify-between p-2 bg-gray-800 rounded">
              <div className="flex items-center">
                {getStatusIcon(analytics.tempo)}
                <span className="ml-2 text-xs">Tempo</span>
              </div>
              <span className={`text-xs font-medium ${getStatusColor(analytics.tempo)}`}>
                {analytics.tempo.replace('_', ' ')}
              </span>
            </div>

            {/* Confidence Score */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Analysis Confidence</span>
                <span>{analytics.confidence}%</span>
              </div>
              <Progress value={analytics.confidence} className="h-2" />
            </div>
          </div>
        )}

        {/* Visual Analysis Area */}
        <div className="bg-gray-800 rounded p-2">
          <canvas
            ref={canvasRef}
            className="w-full h-24 bg-gray-900 rounded"
            style={{ imageRendering: 'pixelated' }}
          />
          <div className="text-xs text-gray-400 text-center mt-1">
            {isAnalyzing ? 'AI monitoring student technique...' : 'Start recording to begin analysis'}
          </div>
        </div>

        {/* Recording History */}
        {recordings.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-gray-400 font-medium">Recorded Sessions:</div>
            <div className="space-y-1">
              {recordings.slice(-3).map((recording, index) => (
                <div key={recording} className="flex items-center justify-between p-2 bg-gray-800 rounded text-xs">
                  <div className="flex items-center">
                    <Video size={12} className="mr-2 text-blue-400" />
                    <span>Session {recordings.length - index}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 px-2">
                    <Download size={10} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-blue-600 bg-opacity-20 border border-blue-500 rounded p-2 text-xs text-blue-400">
          <div className="font-medium mb-1">💡 Pro Tips:</div>
          <div>• Ensure good lighting for accurate analysis</div>
          <div>• Position camera to show full upper body</div>
          <div>• Recordings help teachers review your progress</div>
        </div>
      </CardContent>
    </Card>
  );
}