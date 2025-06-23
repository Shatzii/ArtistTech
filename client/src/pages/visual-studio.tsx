import { useState } from 'react';
import { Link } from 'wouter';
import { Palette, Brush, Layers, Eye, Download, Upload, RotateCcw, ZoomIn, ZoomOut, Move } from 'lucide-react';

export default function VisualStudio() {
  const [activeLayer, setActiveLayer] = useState(0);
  const [brushSize, setBrushSize] = useState(10);
  const [selectedTool, setSelectedTool] = useState('brush');

  const tools = [
    { name: 'Brush', id: 'brush', icon: Brush },
    { name: 'Move', id: 'move', icon: Move },
    { name: 'Zoom In', id: 'zoom-in', icon: ZoomIn },
    { name: 'Zoom Out', id: 'zoom-out', icon: ZoomOut },
  ];

  const layers = [
    { name: 'Background', opacity: 100, visible: true },
    { name: 'Main Design', opacity: 85, visible: true },
    { name: 'Effects', opacity: 70, visible: false },
    { name: 'Text', opacity: 100, visible: true },
  ];

  const recentArtworks = [
    { name: 'Album Cover', size: '3000x3000', status: 'Complete' },
    { name: 'Concert Poster', size: '1920x1080', status: 'In Progress' },
    { name: 'Logo Design', size: '512x512', status: 'Draft' },
  ];

  const colorPalette = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-pink-900/40 to-purple-900 text-white">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <img 
              src="/assets/artist-tech-logo.jpeg" 
              alt="Artist Tech" 
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold">Visual Arts Studio</h1>
              <p className="text-white/60">Professional image creation and editing</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <button className="bg-white/10 border border-white/20 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Tools Sidebar */}
          <div className="space-y-6">
            {/* Drawing Tools */}
            <div className="bg-black/30 rounded-lg p-4 border border-pink-500/20">
              <h3 className="text-sm font-bold mb-4">Tools</h3>
              <div className="grid grid-cols-2 gap-2">
                {tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                    className={`p-3 rounded-lg border transition-colors ${
                      selectedTool === tool.id
                        ? 'bg-pink-500/30 border-pink-400/50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <tool.icon className="w-5 h-5 mx-auto" />
                    <p className="text-xs mt-1">{tool.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Palette */}
            <div className="bg-black/30 rounded-lg p-4 border border-pink-500/20">
              <h3 className="text-sm font-bold mb-4">Colors</h3>
              <div className="grid grid-cols-5 gap-2">
                {colorPalette.map((color, index) => (
                  <button
                    key={index}
                    className="w-8 h-8 rounded border-2 border-white/20 hover:border-white/40 transition-colors"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="mt-4">
                <label className="text-xs text-white/60">Brush Size</label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-full mt-1"
                />
                <div className="text-xs text-white/60 mt-1">{brushSize}px</div>
              </div>
            </div>

            {/* Layers */}
            <div className="bg-black/30 rounded-lg p-4 border border-pink-500/20">
              <h3 className="text-sm font-bold mb-4">Layers</h3>
              <div className="space-y-2">
                {layers.map((layer, index) => (
                  <div
                    key={index}
                    onClick={() => setActiveLayer(index)}
                    className={`p-2 rounded border cursor-pointer transition-colors ${
                      activeLayer === index
                        ? 'bg-pink-500/20 border-pink-400/30'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{layer.name}</span>
                      <button onClick={(e) => { e.stopPropagation(); }}>
                        <Eye className={`w-3 h-3 ${layer.visible ? 'text-white' : 'text-white/30'}`} />
                      </button>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex-1 h-1 bg-white/20 rounded">
                        <div 
                          className="h-full bg-pink-500 rounded"
                          style={{ width: `${layer.opacity}%` }}
                        />
                      </div>
                      <span className="text-xs text-white/60">{layer.opacity}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Canvas */}
          <div className="xl:col-span-3 space-y-6">
            {/* Canvas Area */}
            <div className="bg-black/30 rounded-lg p-6 border border-pink-500/20">
              <div className="aspect-square bg-white rounded-lg mb-4 flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <Palette className="w-16 h-16 mx-auto mb-4" />
                  <p className="mb-4">Create new artwork or upload existing image</p>
                  <div className="space-x-4">
                    <button className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors">
                      New Canvas
                    </button>
                    <button className="border border-pink-500 text-pink-500 px-4 py-2 rounded-lg hover:bg-pink-500/10 transition-colors">
                      <Upload className="w-4 h-4 mr-2 inline" />
                      Upload Image
                    </button>
                  </div>
                </div>
              </div>

              {/* Canvas Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button className="p-2 bg-pink-500/20 rounded-lg hover:bg-pink-500/30 transition-colors">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-white/60">Undo</span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-white/60">
                  <span>1000x1000px</span>
                  <span>•</span>
                  <span>100% zoom</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="bg-pink-500/20 border border-pink-500/30 px-4 py-2 rounded-lg hover:bg-pink-500/30 transition-colors">
                    <Download className="w-4 h-4 mr-2 inline" />
                    Export
                  </button>
                </div>
              </div>
            </div>

            {/* AI Tools */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="bg-black/30 rounded-lg p-4 border border-pink-500/20 hover:border-pink-400/40 transition-colors text-center">
                <div className="w-8 h-8 bg-pink-500/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <Palette className="w-4 h-4 text-pink-400" />
                </div>
                <h4 className="font-bold text-sm mb-1">AI Enhance</h4>
                <p className="text-white/60 text-xs">Auto enhance colors</p>
              </button>
              
              <button className="bg-black/30 rounded-lg p-4 border border-purple-500/20 hover:border-purple-400/40 transition-colors text-center">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <Brush className="w-4 h-4 text-purple-400" />
                </div>
                <h4 className="font-bold text-sm mb-1">Style Transfer</h4>
                <p className="text-white/60 text-xs">Apply art styles</p>
              </button>
              
              <button className="bg-black/30 rounded-lg p-4 border border-blue-500/20 hover:border-blue-400/40 transition-colors text-center">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-blue-400" />
                </div>
                <h4 className="font-bold text-sm mb-1">Auto Background</h4>
                <p className="text-white/60 text-xs">Remove/replace BG</p>
              </button>
              
              <button className="bg-black/30 rounded-lg p-4 border border-green-500/20 hover:border-green-400/40 transition-colors text-center">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <ZoomIn className="w-4 h-4 text-green-400" />
                </div>
                <h4 className="font-bold text-sm mb-1">Upscale</h4>
                <p className="text-white/60 text-xs">AI super resolution</p>
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Recent Artworks */}
            <div className="bg-black/30 rounded-lg p-4 border border-pink-500/20">
              <h3 className="text-sm font-bold mb-4">Recent Works</h3>
              <div className="space-y-3">
                {recentArtworks.map((artwork, index) => (
                  <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-xs">{artwork.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        artwork.status === 'Complete' ? 'bg-green-500/20 text-green-400' :
                        artwork.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {artwork.status}
                      </span>
                    </div>
                    <p className="text-white/60 text-xs">{artwork.size}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Templates */}
            <div className="bg-black/30 rounded-lg p-4 border border-pink-500/20">
              <h3 className="text-sm font-bold mb-4">Templates</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-2 bg-white/5 rounded border border-white/10 hover:bg-white/10 transition-colors">
                  <p className="text-xs font-medium">Album Cover</p>
                  <p className="text-xs text-white/60">3000x3000px</p>
                </button>
                <button className="w-full text-left p-2 bg-white/5 rounded border border-white/10 hover:bg-white/10 transition-colors">
                  <p className="text-xs font-medium">Social Media Post</p>
                  <p className="text-xs text-white/60">1080x1080px</p>
                </button>
                <button className="w-full text-left p-2 bg-white/5 rounded border border-white/10 hover:bg-white/10 transition-colors">
                  <p className="text-xs font-medium">Concert Poster</p>
                  <p className="text-xs text-white/60">1920x1080px</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}