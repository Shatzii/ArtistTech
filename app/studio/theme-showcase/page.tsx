'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Palette, Layout, Eye, Sparkles, Monitor,
  Music, Video, Image, Zap, Settings
} from 'lucide-react';

export default function StudioThemeShowcase() {
  const [selectedTheme, setSelectedTheme] = useState('dark');
  const [selectedLayout, setSelectedLayout] = useState('expanded');
  const [showEffects, setShowEffects] = useState(true);

  const themes = [
    { id: 'dark', name: 'Dark Pro', icon: '🌙', description: 'Professional dark theme' },
    { id: 'light', name: 'Light Pro', icon: '☀️', description: 'Clean light theme' },
    { id: 'neon', name: 'Neon Glow', icon: '✨', description: 'Vibrant neon effects' },
    { id: 'cyberpunk', name: 'Cyberpunk', icon: '🤖', description: 'Futuristic digital' },
    { id: 'minimal', name: 'Minimal', icon: '🎯', description: 'Distraction-free' },
    { id: 'studio', name: 'Studio Blue', icon: '🎵', description: 'Classic studio' },
    { id: 'vintage', name: 'Vintage', icon: '📻', description: 'Retro aesthetics' },
    { id: 'nature', name: 'Nature', icon: '🌿', description: 'Organic and calm' },
    { id: 'sunset', name: 'Sunset', icon: '🌅', description: 'Warm evening' },
    { id: 'ocean', name: 'Ocean', icon: '🌊', description: 'Flowing blues' },
    { id: 'midnight', name: 'Midnight', icon: '🌌', description: 'Deep space' }
  ];

  const layouts = [
    { id: 'compact', name: 'Compact', icon: '📦', description: 'Space efficient' },
    { id: 'expanded', name: 'Expanded', icon: '📺', description: 'Comfortable spacing' },
    { id: 'minimal', name: 'Minimal', icon: '🎯', description: 'Ultra clean' },
    { id: 'grid', name: 'Grid View', icon: '🔲', description: 'Card-based' },
    { id: 'waveform', name: 'Waveform', icon: '📊', description: 'Audio focused' },
    { id: 'classic', name: 'Classic DAW', icon: '🎼', description: 'Traditional' },
    { id: 'modern', name: 'Modern', icon: '🚀', description: 'Contemporary' },
    { id: 'theater', name: 'Theater', icon: '🎭', description: 'Presentation' }
  ];

  const getThemeClasses = (theme: string) => {
    const themeMap: Record<string, string> = {
      dark: 'studio-theme-dark',
      light: 'studio-theme-light',
      neon: 'studio-theme-neon',
      cyberpunk: 'studio-theme-cyberpunk',
      minimal: 'studio-theme-minimal',
      studio: 'studio-theme-studio',
      vintage: 'studio-theme-vintage',
      nature: 'studio-theme-nature',
      sunset: 'bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 text-white',
      ocean: 'bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-600 text-white',
      midnight: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-purple-100'
    };
    return themeMap[theme] || 'studio-theme-dark';
  };

  const getLayoutClasses = (layout: string) => {
    const layoutMap: Record<string, string> = {
      compact: 'layout-compact',
      expanded: 'layout-expanded',
      minimal: 'layout-minimal',
      grid: 'layout-grid',
      waveform: 'layout-waveform',
      classic: 'layout-classic',
      modern: 'layout-modern',
      theater: 'layout-theater'
    };
    return layoutMap[layout] || 'layout-expanded';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            🎨 Studio Theme Showcase
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Explore 10 Professional Themes & 8 Layout Options
          </p>

          {/* Quick Controls */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Select value={selectedTheme} onValueChange={setSelectedTheme}>
              <SelectTrigger className="w-48">
                <Palette className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {themes.map(theme => (
                  <SelectItem key={theme.id} value={theme.id}>
                    {theme.icon} {theme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLayout} onValueChange={setSelectedLayout}>
              <SelectTrigger className="w-48">
                <Layout className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {layouts.map(layout => (
                  <SelectItem key={layout.id} value={layout.id}>
                    {layout.icon} {layout.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={showEffects ? "default" : "outline"}
              onClick={() => setShowEffects(!showEffects)}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {showEffects ? 'Effects On' : 'Effects Off'}
            </Button>
          </div>
        </div>

        {/* Live Preview */}
        <div className={`${getThemeClasses(selectedTheme)} ${getLayoutClasses(selectedLayout)} rounded-xl p-6 mb-8 min-h-96 transition-all duration-500`}>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">
              {themes.find(t => t.id === selectedTheme)?.icon} Live Preview
            </h2>
            <p className="opacity-80">
              {themes.find(t => t.id === selectedTheme)?.description}
            </p>
          </div>

          {/* Sample Studio Interface */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className={`studio-card ${showEffects ? 'studio-glow' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  Music Studio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tracks:</span>
                    <Badge variant="outline">8 Active</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>BPM:</span>
                    <span>120</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    <Badge className="bg-green-500">Recording</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`studio-card ${showEffects ? 'studio-glow' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Video Studio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Projects:</span>
                    <Badge variant="outline">3 Active</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Resolution:</span>
                    <span>4K</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    <Badge className="bg-blue-500">Rendering</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`studio-card ${showEffects ? 'studio-glow' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Visual Studio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Projects:</span>
                    <Badge variant="outline">12 Created</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>AI Enhanced:</span>
                    <span>8</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    <Badge className="bg-purple-500">Processing</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sample Controls */}
          <div className="flex flex-wrap justify-center gap-3">
            <Button className={`${showEffects ? 'studio-glow-hover' : ''}`}>
              <Zap className="w-4 h-4 mr-2" />
              Quick Action
            </Button>
            <Button variant="outline" className={`${showEffects ? 'studio-glow-hover' : ''}`}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" className={`${showEffects ? 'studio-glow-hover' : ''}`}>
              <Monitor className="w-4 h-4 mr-2" />
              Fullscreen
            </Button>
          </div>
        </div>

        {/* Theme Gallery */}
        <Tabs defaultValue="themes" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="themes">🎨 All Themes</TabsTrigger>
            <TabsTrigger value="layouts">📐 All Layouts</TabsTrigger>
          </TabsList>

          <TabsContent value="themes" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {themes.map(theme => (
                <Card
                  key={theme.id}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                    selectedTheme === theme.id ? 'ring-2 ring-cyan-400' : ''
                  }`}
                  onClick={() => setSelectedTheme(theme.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{theme.icon}</div>
                    <h3 className="font-semibold mb-1">{theme.name}</h3>
                    <p className="text-sm text-gray-400">{theme.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="layouts" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {layouts.map(layout => (
                <Card
                  key={layout.id}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                    selectedLayout === layout.id ? 'ring-2 ring-cyan-400' : ''
                  }`}
                  onClick={() => setSelectedLayout(layout.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{layout.icon}</div>
                    <h3 className="font-semibold mb-1">{layout.name}</h3>
                    <p className="text-sm text-gray-400">{layout.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Usage Guide */}
        <Card className="mt-8 bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              How to Use
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">🎨 Theme Selection</h4>
              <p className="text-gray-300 text-sm">
                Choose themes based on your creative workflow. Dark themes are great for music production,
                while light themes work better for collaborative work.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">📐 Layout Options</h4>
              <p className="text-gray-300 text-sm">
                Layouts optimize space and workflow. Compact for power users, expanded for detailed work,
                minimal for focused sessions.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">✨ Visual Effects</h4>
              <p className="text-gray-300 text-sm">
                Toggle glow effects and animations. Great for creative inspiration but can be disabled
                for distraction-free work.
              </p>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
              <h4 className="font-semibold text-cyan-400 mb-2">💡 Pro Tip</h4>
              <p className="text-gray-300 text-sm">
                Combine <strong>Dark Professional + Classic DAW</strong> for traditional music production,
                or <strong>Neon Glow + Modern</strong> for contemporary creative work.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
