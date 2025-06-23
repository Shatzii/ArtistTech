import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Play } from "lucide-react";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  
  // Auto-redirect to studio - no authentication required
  useEffect(() => {
    setLocation('/studio');
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-gray-900/80 border-gray-700">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Music className="text-orange-400 text-3xl" />
            <CardTitle className="text-2xl text-white">ProStudio</CardTitle>
          </div>
          <p className="text-gray-400">Redirecting to studio...</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => setLocation('/studio')}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Play className="mr-2" size={20} />
            Enter ProStudio (No Login Required)
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setLocation('/mpc')}
              className="text-gray-300 border-gray-600 hover:bg-gray-800"
            >
              MPC Studio
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setLocation('/dj')}
              className="text-gray-300 border-gray-600 hover:bg-gray-800"
            >
              DJ Studio
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setLocation('/video')}
              className="text-gray-300 border-gray-600 hover:bg-gray-800"
            >
              Video Studio
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setLocation('/business')}
              className="text-gray-300 border-gray-600 hover:bg-gray-800"
            >
              AI Business
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}