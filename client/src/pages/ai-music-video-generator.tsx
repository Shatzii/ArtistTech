import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Video, Upload, Wand2, Play, Pause, Download, 
  Camera, Music, Sparkles, Clock, Eye, Share,
  Zap, Crown, Star, Settings, FileVideo
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function AIMusicVideoGenerator() {
  const [songFile, setSongFile] = useState<File | null>(null);
  const [videoStyle, setVideoStyle] = useState("cinematic");
  const [mood, setMood] = useState("energetic");
  const [concept, setConcept] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("music-video");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const videoStyles = [
    { id: "cinematic", name: "Cinematic", description: "Hollywood-style music video with dramatic lighting" },
    { id: "abstract", name: "Abstract", description: "Artistic visuals synchronized to audio frequencies" },
    { id: "performance", name: "Performance", description: "Virtual performance with AI-generated band" },
    { id: "narrative", name: "Narrative", description: "Story-driven music video with AI actors" },
    { id: "lyric-video", name: "Lyric Video", description: "Animated typography with visual effects" },
    { id: "concert", name: "Live Concert", description: "Stadium concert atmosphere with crowd" }
  ];

  const moods = [
    { id: "energetic", name: "Energetic", color: "bg-red-500" },
    { id: "chill", name: "Chill", color: "bg-blue-500" },
    { id: "dark", name: "Dark", color: "bg-gray-800" },
    { id: "happy", name: "Happy", color: "bg-yellow-500" },
    { id: "emotional", name: "Emotional", color: "bg-purple-500" },
    { id: "epic", name: "Epic", color: "bg-orange-500" }
  ];

  const templates = [
    { id: "music-video", name: "Music Video", duration: "3-4 min", quality: "4K" },
    { id: "tiktok-short", name: "TikTok Short", duration: "15-60 sec", quality: "Vertical HD" },
    { id: "instagram-reel", name: "Instagram Reel", duration: "15-90 sec", quality: "Square/Vertical" },
    { id: "youtube-short", name: "YouTube Short", duration: "60 sec", quality: "Vertical 4K" },
    { id: "lyric-visualization", name: "Lyric Video", duration: "Full song", quality: "HD" },
    { id: "album-teaser", name: "Album Teaser", duration: "30 sec", quality: "Cinematic 4K" }
  ];

  // API mutation for video generation
  const generateVideoMutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      formData.append('audioFile', data.songFile);
      formData.append('style', data.videoStyle);
      formData.append('mood', data.mood);
      formData.append('concept', data.concept);
      formData.append('template', data.template);

      const response = await fetch('/api/ai/generate-music-video', {
        method: 'POST',
        body: formData
      });
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedVideo(data.videoUrl);
      setIsGenerating(false);
      setProgress(100);
    }
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setSongFile(file);
    }
  };

  const handleGenerate = async () => {
    if (!songFile) return;

    setIsGenerating(true);
    setProgress(0);
    setGeneratedVideo(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 2000);

    try {
      await generateVideoMutation.mutateAsync({
        songFile,
        videoStyle,
        mood,
        concept,
        template: selectedTemplate
      });
    } catch (error) {
      console.error('Video generation failed:', error);
      setIsGenerating(false);
      clearInterval(progressInterval);
    }
  };

  const handleDownload = () => {
    if (generatedVideo) {
      const link = document.createElement('a');
      link.href = generatedVideo;
      link.download = `ai-music-video-${Date.now()}.mp4`;
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Video className="w-8 h-8 text-purple-400" />
              <h1 className="text-3xl font-bold text-white">AI Music Video Generator</h1>
              <Badge className="bg-gradient-to-r from-purple-400 to-pink-500 text-white">
                REVOLUTIONARY
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="text-white border-white/30">
              <Sparkles className="w-4 h-4 mr-1" />
              10K+ Videos Generated
            </Badge>
            <Badge variant="outline" className="text-white border-white/30">
              <Crown className="w-4 h-4 mr-1" />
              Hollywood Quality
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upload Section */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-blue-400" />
                  Upload Music
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Upload your song to generate an AI music video
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    songFile ? 'border-green-500 bg-green-500/10' : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  {songFile ? (
                    <div>
                      <p className="text-green-400 font-medium">{songFile.name}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {(songFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-white mb-2">Click to upload music file</p>
                      <p className="text-xs text-gray-400">MP3, WAV, M4A supported</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Style Selection */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Video Style</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {videoStyles.map((style) => (
                  <div
                    key={style.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      videoStyle === style.id
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => setVideoStyle(style.id)}
                  >
                    <div className="font-medium text-white">{style.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{style.description}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Mood Selection */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Mood & Feel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {moods.map((moodOption) => (
                    <Button
                      key={moodOption.id}
                      variant={mood === moodOption.id ? "default" : "outline"}
                      className={`${
                        mood === moodOption.id ? moodOption.color : 'border-gray-600'
                      } text-white`}
                      onClick={() => setMood(moodOption.id)}
                    >
                      {moodOption.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Generation Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Template Selection */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Video Template</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedTemplate === template.id
                          ? 'border-blue-500 bg-blue-500/20'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <FileVideo className="w-4 h-4 text-blue-400" />
                        <span className="font-medium text-white text-sm">{template.name}</span>
                      </div>
                      <div className="text-xs text-gray-400 space-y-1">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {template.duration}
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {template.quality}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Concept Input */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Video Concept (Optional)</CardTitle>
                <CardDescription className="text-gray-400">
                  Describe the visual story or theme for your music video
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="e.g., A futuristic cityscape at night with neon lights, or a romantic beach sunset scene..."
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                />
              </CardContent>
            </Card>

            {/* Generation Section */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Wand2 className="w-5 h-5 mr-2 text-yellow-400" />
                  Generate Music Video
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isGenerating && !generatedVideo && (
                  <Button
                    onClick={handleGenerate}
                    disabled={!songFile || generateVideoMutation.isPending}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-lg"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Generate AI Music Video
                  </Button>
                )}

                {isGenerating && (
                  <div className="space-y-4">
                    <div className="text-white text-center">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Sparkles className="w-5 h-5 animate-spin text-yellow-400" />
                        <span>Generating your music video...</span>
                      </div>
                      <p className="text-gray-400 text-sm">
                        This may take 3-5 minutes for best quality
                      </p>
                    </div>
                    <Progress value={progress} className="w-full" />
                    <div className="text-center text-sm text-gray-400">
                      {progress < 30 && "Analyzing audio patterns..."}
                      {progress >= 30 && progress < 60 && "Generating visual scenes..."}
                      {progress >= 60 && progress < 90 && "Synchronizing audio and video..."}
                      {progress >= 90 && "Finalizing and rendering..."}
                    </div>
                  </div>
                )}

                {generatedVideo && (
                  <div className="space-y-4">
                    <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                      <video
                        src={generatedVideo}
                        controls
                        className="w-full h-full object-cover"
                        poster="/api/placeholder/800/450"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    <div className="flex space-x-3">
                      <Button onClick={handleDownload} className="flex-1 bg-green-600 hover:bg-green-700">
                        <Download className="w-4 h-4 mr-2" />
                        Download Video
                      </Button>
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      <Button 
                        onClick={() => {
                          setGeneratedVideo(null);
                          setProgress(0);
                        }}
                        variant="outline"
                        className="border-gray-600 text-white hover:bg-gray-700"
                      >
                        Generate Another
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}