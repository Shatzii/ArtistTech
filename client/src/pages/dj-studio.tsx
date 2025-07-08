import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DJController from '@/components/DJController';
import AIAssistant from '@/components/AIAssistant';
import RealTimeMetrics from '@/components/RealTimeMetrics';
import AdvancedAudioProcessor from '@/components/AdvancedAudioProcessor';

export default function DJStudio() {
  const { user } = useAuth();
  const [showAIAssistant, setShowAIAssistant] = useState(true);
  const [showMetrics, setShowMetrics] = useState(true);
  const [showAdvancedProcessor, setShowAdvancedProcessor] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/40 to-pink-900 text-white">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <img 
              src="/artist-tech-logo-new.jpeg" 
              alt="Artist Tech" 
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold">DJ Studio Pro</h1>
              <p className="text-white/60">Professional mixing with real-time crowd analytics</p>
              {user && (
                <p className="text-purple-400 text-sm">Welcome, {user.email}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/social-media-hub">
              <button className="bg-white/10 border border-white/20 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Hub
              </button>
            </Link>
          </div>
        </div>

        {/* Professional DJ Controller Interface */}
        <DJController 
          realTimeAnalytics={true}
          onMixChange={(mixData) => {
            console.log('Mix change:', mixData);
          }}
        />

        {/* AI Enhancement Suite */}
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">AI Enhancement Suite</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowAIAssistant(!showAIAssistant)}
                className={`px-3 py-1 rounded text-sm ${showAIAssistant ? 'bg-purple-600' : 'bg-gray-600'}`}
              >
                🤖 AI Assistant
              </button>
              <button 
                onClick={() => setShowMetrics(!showMetrics)}
                className={`px-3 py-1 rounded text-sm ${showMetrics ? 'bg-blue-600' : 'bg-gray-600'}`}
              >
                📊 Metrics
              </button>
              <button 
                onClick={() => setShowAdvancedProcessor(!showAdvancedProcessor)}
                className={`px-3 py-1 rounded text-sm ${showAdvancedProcessor ? 'bg-orange-600' : 'bg-gray-600'}`}
              >
                🎛️ Advanced
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Assistant */}
            {showAIAssistant && (
              <div className="lg:col-span-1">
                <AIAssistant 
                  context="dj"
                  onSuggestion={(suggestion) => {
                    console.log('DJ AI Suggestion:', suggestion);
                  }}
                />
              </div>
            )}

            {/* Real-time Metrics */}
            {showMetrics && (
              <div className="lg:col-span-2">
                <RealTimeMetrics context="live" />
              </div>
            )}
          </div>

          {/* Advanced Audio Processor */}
          {showAdvancedProcessor && (
            <div className="mt-6">
              <AdvancedAudioProcessor
                onEffectChange={(effects) => {
                  effects.forEach(effect => {
                    if (effect.enabled) {
                      console.log('Apply effect:', effect.name, effect.parameters);
                    }
                  });
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}