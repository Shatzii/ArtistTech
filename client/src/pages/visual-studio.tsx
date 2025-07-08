import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Palette, Brush, Layers, Image, Wand2, Sparkles, 
  Upload, Download, Save, Undo, Redo, Move, 
  Circle, Square, Triangle, Type, Pipette, 
  Zap, Crown, Star, Share, Settings, Eye
} from "lucide-react";

export default function VisualStudio() {
  const [activeTab, setActiveTab] = useState("canvas");
  const [selectedTool, setSelectedTool] = useState("brush");
  const [brushSize, setBrushSize] = useState([15]);
  const [opacity, setOpacity] = useState([100]);
  const [selectedColor, setSelectedColor] = useState("#3b82f6");
  const [projectTitle, setProjectTitle] = useState("Untitled Artwork");
  const [isDrawing, setIsDrawing] = useState(false);
  const [layers, setLayers] = useState([
    { id: 1, name: "Background", visible: true, opacity: 100 },
    { id: 2, name: "Sketch", visible: true, opacity: 80 },
    { id: 3, name: "Color", visible: true, opacity: 100 },
    { id: 4, name: "Details", visible: true, opacity: 100 }
  ]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const tools = [
    { id: "brush", name: "Brush", icon: Brush, color: "bg-blue-600" },
    { id: "pencil", name: "Pencil", icon: Brush, color: "bg-gray-600" },
    { id: "eraser", name: "Eraser", icon: Square, color: "bg-red-600" },
    { id: "fill", name: "Fill", icon: Pipette, color: "bg-green-600" },
    { id: "text", name: "Text", icon: Type, color: "bg-purple-600" },
    { id: "shapes", name: "Shapes", icon: Circle, color: "bg-yellow-600" },
    { id: "move", name: "Move", icon: Move, color: "bg-pink-600" },
    { id: "eyedropper", name: "Eyedropper", icon: Pipette, color: "bg-orange-600" }
  ];

  const colorPalette = [
    "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF",
    "#800000", "#008000", "#000080", "#808000", "#800080", "#008080", "#808080", "#C0C0C0",
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FECA57", "#FF9FF3", "#54A0FF", "#5F27CD"
  ];

  const aiFeatures = [
    { id: "background-removal", name: "Background Removal", icon: Layers, confidence: 96 },
    { id: "style-transfer", name: "Style Transfer", icon: Palette, confidence: 89 },
    { id: "upscale", name: "16K Upscaling", icon: Zap, confidence: 94 },
    { id: "auto-color", name: "Auto-Coloring", icon: Sparkles, confidence: 87 },
    { id: "sketch-to-art", name: "Sketch to Art", icon: Wand2, confidence: 92 },
    { id: "object-removal", name: "Object Removal", icon: Eye, confidence: 85 }
  ];

  const filters = [
    { id: "brightness", name: "Brightness", value: 0, min: -100, max: 100 },
    { id: "contrast", name: "Contrast", value: 0, min: -100, max: 100 },
    { id: "saturation", name: "Saturation", value: 0, min: -100, max: 100 },
    { id: "hue", name: "Hue", value: 0, min: -180, max: 180 },
    { id: "blur", name: "Blur", value: 0, min: 0, max: 20 },
    { id: "sharpen", name: "Sharpen", value: 0, min: 0, max: 100 }
  ];

  const templates = [
    { id: "album-cover", name: "Album Cover", size: "3000x3000", category: "music" },
    { id: "poster", name: "Concert Poster", size: "1080x1920", category: "event" },
    { id: "social-post", name: "Social Media Post", size: "1080x1080", category: "social" },
    { id: "youtube-thumb", name: "YouTube Thumbnail", size: "1920x1080", category: "video" },
    { id: "logo", name: "Logo Design", size: "1000x1000", category: "branding" },
    { id: "business-card", name: "Business Card", size: "3.5x2 inches", category: "print" }
  ];

  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  const handleLayerToggle = (layerId: number) => {
    setLayers(layers.map(layer => 
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  const handleSave = () => {
    if (canvasRef.current) {
      const dataURL = canvasRef.current.toDataURL();
      const link = document.createElement('a');
      link.download = `${projectTitle}.png`;
      link.href = dataURL;
      link.click();
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      // Restore canvas state
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      // Restore canvas state
    }
  };

  const handleAIProcess = (featureId: string) => {
    console.log("Processing AI feature:", featureId);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ctx.globalAlpha = opacity[0] / 100;
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = brushSize[0];
      ctx.lineCap = 'round';
      
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.beginPath();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Palette className="w-8 h-8 text-pink-400" />
              <h1 className="text-2xl font-bold text-white">Visual Arts Studio</h1>
              <Badge className="bg-gradient-to-r from-pink-400 to-purple-500 text-white">
                AI POWERED
              </Badge>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <span>Project:</span>
              <Input
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white w-48"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button onClick={handleUndo} className="bg-gray-600 hover:bg-gray-700">
              <Undo className="w-4 h-4" />
            </Button>
            <Button onClick={handleRedo} className="bg-gray-600 hover:bg-gray-700">
              <Redo className="w-4 h-4" />
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Main Studio Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Tools Panel */}
          <div className="col-span-2 space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tools.map((tool) => (
                  <Button
                    key={tool.id}
                    onClick={() => handleToolSelect(tool.id)}
                    className={`w-full justify-start ${
                      selectedTool === tool.id 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <tool.icon className="w-4 h-4 mr-2" />
                    <span className="text-sm">{tool.name}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Tool Properties */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Brush Size</label>
                  <Slider
                    value={brushSize}
                    onValueChange={setBrushSize}
                    min={1}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-400 mt-1">{brushSize[0]}px</div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Opacity</label>
                  <Slider
                    value={opacity}
                    onValueChange={setOpacity}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-400 mt-1">{opacity[0]}%</div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Color</label>
                  <div className="grid grid-cols-4 gap-2">
                    {colorPalette.map((color) => (
                      <div
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        className={`w-8 h-8 rounded cursor-pointer border-2 ${
                          selectedColor === color ? 'border-white' : 'border-gray-600'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <Input
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="mt-2 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Canvas Area */}
          <div className="col-span-8 space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="relative bg-white rounded-lg" style={{ aspectRatio: '16/10' }}>
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={500}
                    className="w-full h-full cursor-crosshair"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    {brushSize[0]}px • {opacity[0]}%
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bottom Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                <TabsTrigger value="canvas">Canvas</TabsTrigger>
                <TabsTrigger value="filters">Filters</TabsTrigger>
                <TabsTrigger value="ai">AI Tools</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>

              <TabsContent value="filters" className="space-y-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Image Filters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {filters.map((filter) => (
                        <div key={filter.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-sm text-white">{filter.name}</label>
                            <span className="text-xs text-gray-400">{filter.value}</span>
                          </div>
                          <Slider
                            value={[filter.value]}
                            min={filter.min}
                            max={filter.max}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ai" className="space-y-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
                      AI-Powered Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {aiFeatures.map((feature) => (
                        <div key={feature.id} className="p-4 bg-gray-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <feature.icon className="w-5 h-5 text-purple-400" />
                              <h4 className="text-white font-medium">{feature.name}</h4>
                            </div>
                            <Badge className="bg-purple-600">
                              {feature.confidence}%
                            </Badge>
                          </div>
                          <Button
                            onClick={() => handleAIProcess(feature.id)}
                            className="w-full bg-purple-600 hover:bg-purple-700"
                          >
                            <Wand2 className="w-4 h-4 mr-2" />
                            Process
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="templates" className="space-y-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Design Templates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      {templates.map((template) => (
                        <div key={template.id} className="p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
                          <div className="aspect-square bg-gray-600 rounded mb-3 flex items-center justify-center">
                            <Image className="w-8 h-8 text-gray-400" />
                          </div>
                          <h4 className="text-white font-medium text-sm">{template.name}</h4>
                          <p className="text-xs text-gray-400">{template.size}</p>
                          <Badge className="mt-2 bg-blue-600 text-xs">
                            {template.category}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Layers Panel */}
          <div className="col-span-2 space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">Layers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {layers.map((layer) => (
                    <div key={layer.id} className="flex items-center space-x-2 p-2 bg-gray-700 rounded">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleLayerToggle(layer.id)}
                        className="w-6 h-6 p-0"
                      >
                        {layer.visible ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4 opacity-50" />}
                      </Button>
                      <div className="flex-1">
                        <div className="text-white text-sm">{layer.name}</div>
                        <div className="text-xs text-gray-400">{layer.opacity}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm">
                  <Layers className="w-4 h-4 mr-2" />
                  New Layer
                </Button>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export PNG
                </Button>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-sm">
                  <Crown className="w-4 h-4 mr-2" />
                  Create NFT
                </Button>
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-sm">
                  <Star className="w-4 h-4 mr-2" />
                  AI Enhance
                </Button>
              </CardContent>
            </Card>

            {/* Recent Projects */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">Recent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {["Album Cover", "Logo Design", "Poster Art", "Social Post"].map((project) => (
                    <div key={project} className="p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600">
                      <div className="text-white text-sm">{project}</div>
                      <div className="text-xs text-gray-400">2 hours ago</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}