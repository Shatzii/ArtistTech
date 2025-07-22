import { Link } from "wouter";
import { CircuitBoard, ArrowLeft, Home, Music } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="text-center max-w-md mx-4">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <img 
              src="/artist-tech-logo-new.jpeg" 
              alt="Artist Tech" 
              className="h-20 w-20 object-contain rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                if (nextElement) {
                  nextElement.style.display = 'flex';
                }
              }}
            />
            <div className="hidden h-20 w-20 rounded-lg real-gold-button items-center justify-center">
              <CircuitBoard className="w-10 h-10 text-slate-900" />
            </div>
          </div>
        </div>

        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4 metallic-text">
          Page Not Found
        </h2>
        <p className="text-slate-400 mb-8">
          This page doesn't exist in our AI-powered creative ecosystem.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <button className="real-gold-button px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity">
              <Home className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
          </Link>
          <Link href="/music-studio">
            <button className="bg-slate-800 border border-slate-700 px-6 py-3 rounded-lg font-semibold text-white hover:bg-slate-700 transition-colors flex items-center justify-center space-x-2">
              <Music className="w-5 h-5" />
              <span>Music Studio</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
