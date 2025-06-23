import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  Layers, 
  Square, 
  Circle, 
  Type, 
  Brush, 
  Eraser,
  Download,
  Upload,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Move,
  RotateCcw
} from "lucide-react";

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  blendMode: string;
  locked: boolean;
}

interface Tool {
  id: string;
  name: string;
  icon: any;
  cursor: string;
}

export default function VisualStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState("brush");
  const [brushSize, setBrushSize] = useState([10]);
  const [opacity, setOpacity] = useState([100]);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [layers, setLayers] = useState<Layer[]>([
    {
      id: "layer1",
      name: "Background",
      visible: true,
      opacity: 100,
      blendMode: "normal",
      locked: false
    },
    {
      id: "layer2", 
      name: "Layer 1",
      visible: true,
      opacity: 100,
      blendMode: "normal",
      locked: false
    }
  ]);

  const tools: Tool[] = [
    { id: "brush", name: "Brush", icon: Brush, cursor: "crosshair" },
    { id: "eraser", name: "Eraser", icon: Eraser, cursor: "crosshair" },
    { id: "move", name: "Move", icon: Move, cursor: "move" },
    { id: "rectangle", name: "Rectangle", icon: Square, cursor: "crosshair" },
    { id: "circle", name: "Circle", icon: Circle, cursor: "crosshair" },
    { id: "text", name: "Text", icon: Type, cursor: "text" }
  ];

  const blendModes = [
    "normal", "multiply", "screen", "overlay", "soft-light", 
    "hard-light", "color-dodge", "color-burn", "difference", "exclusion"
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize canvas
    canvas.width = 1200;
    canvas.height = 800;
    
    // Set white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Drawing state
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const startDrawing = (e: MouseEvent) => {
      if (selectedTool !== "brush" && selectedTool !== "eraser") return;
      
      isDrawing = true;
      const rect = canvas.getBoundingClientRect();
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;
    };

    const draw = (e: MouseEvent) => {
      if (!isDrawing) return;
      if (selectedTool !== "brush" && selectedTool !== "eraser") return;

      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(currentX, currentY);
      
      if (selectedTool === "brush") {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = currentColor;
      } else if (selectedTool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
      }
      
      ctx.lineWidth = brushSize[0];
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = opacity[0] / 100;
      ctx.stroke();

      lastX = currentX;
      lastY = currentY;
    };

    const stopDrawing = () => {
      isDrawing = false;
      ctx.globalAlpha = 1;
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseout", stopDrawing);
    };
  }, [selectedTool, brushSize, opacity, currentColor]);

  const addLayer = () => {
    const newLayer: Layer = {
      id: `layer${layers.length + 1}`,
      name: `Layer ${layers.length}`,
      visible: true,
      opacity: 100,
      blendMode: "normal",
      locked: false
    };
    setLayers([...layers, newLayer]);
  };

  const toggleLayerVisibility = (layerId: string) => {
    setLayers(layers.map(layer => 
      layer.id === layerId 
        ? { ...layer, visible: !layer.visible }
        : layer
    ));
  };

  const updateLayerOpacity = (layerId: string, newOpacity: number) => {
    setLayers(layers.map(layer => 
      layer.id === layerId 
        ? { ...layer, opacity: newOpacity }
        : layer
    ));
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement("a");
    link.download = "artwork.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Tools Panel */}
      <div className="w-16 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 space-y-2">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            variant={selectedTool === tool.id ? "default" : "ghost"}
            size="sm"
            className="w-10 h-10 p-0"
            onClick={() => setSelectedTool(tool.id)}
            title={tool.name}
          >
            <tool.icon className="w-4 h-4" />
          </Button>
        ))}
        
        <div className="border-t border-gray-600 pt-2 mt-4">
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0" title="Undo">
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0" title="Redo">
            <Redo className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4 space-x-4">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Upload className="w-4 h-4 mr-1" />
              Import
            </Button>
            <Button variant="ghost" size="sm" onClick={saveCanvas}>
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-300">100%</span>
            <Button variant="ghost" size="sm">
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="secondary">1200×800</Badge>
            <Badge variant="outline">RGB</Badge>
          </div>
        </div>

        {/* Canvas Container */}
        <div className="flex-1 bg-gray-700 p-4 overflow-auto">
          <div className="bg-white inline-block shadow-lg">
            <canvas
              ref={canvasRef}
              className="block cursor-crosshair"
              style={{ cursor: tools.find(t => t.id === selectedTool)?.cursor }}
            />
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
        <Tabs defaultValue="properties" className="flex-1">
          <TabsList className="grid w-full grid-cols-3 bg-gray-700">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="layers">Layers</TabsTrigger>
            <TabsTrigger value="ai">AI Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="p-4 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Brush Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">
                    Size: {brushSize[0]}px
                  </label>
                  <Slider
                    value={brushSize}
                    onValueChange={setBrushSize}
                    min={1}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">
                    Opacity: {opacity[0]}%
                  </label>
                  <Slider
                    value={opacity}
                    onValueChange={setOpacity}
                    min={1}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={currentColor}
                      onChange={(e) => setCurrentColor(e.target.value)}
                      className="w-12 h-8 rounded border border-gray-600"
                    />
                    <span className="text-sm text-gray-300">{currentColor}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layers" className="p-4">
            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm">Layers</CardTitle>
                <Button size="sm" variant="outline" onClick={addLayer}>
                  Add Layer
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {layers.slice().reverse().map((layer) => (
                  <div
                    key={layer.id}
                    className="p-2 bg-gray-700 rounded border border-gray-600"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{layer.name}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleLayerVisibility(layer.id)}
                        className="w-6 h-6 p-0"
                      >
                        👁️
                      </Button>
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-400">
                        Opacity: {layer.opacity}%
                      </label>
                      <Slider
                        value={[layer.opacity]}
                        onValueChange={(value) => updateLayerOpacity(layer.id, value[0])}
                        min={0}
                        max={100}
                        step={1}
                        className="mt-1"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="p-4 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">AI Generation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Palette className="w-4 h-4 mr-2" />
                  Generate Background
                </Button>
                <Button className="w-full" variant="outline">
                  🎨 Style Transfer
                </Button>
                <Button className="w-full" variant="outline">
                  ✨ Enhance Details
                </Button>
                <Button className="w-full" variant="outline">
                  🖼️ Remove Background
                </Button>
                <Button className="w-full" variant="outline">
                  🎭 Apply Filters
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Smart Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  🎯 Auto Select
                </Button>
                <Button className="w-full" variant="outline">
                  🔧 Smart Fill
                </Button>
                <Button className="w-full" variant="outline">
                  📐 Perfect Shapes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}