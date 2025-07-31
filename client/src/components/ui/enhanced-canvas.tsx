import { useEffect, useRef, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  ZoomIn, ZoomOut, Move, Square, Circle, Type, Brush, 
  Layers, Undo, Redo, Save, Grid, Maximize2 
} from "lucide-react";

interface CanvasLayer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  locked: boolean;
  type: 'audio' | 'video' | 'image' | 'text';
}

interface CanvasElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  data: any;
  layerId: string;
}

interface EnhancedCanvasProps {
  width?: number;
  height?: number;
  onElementsChange?: (elements: CanvasElement[]) => void;
  onLayersChange?: (layers: CanvasLayer[]) => void;
  readOnly?: boolean;
}

export default function EnhancedCanvas({ 
  width = 1200, 
  height = 600, 
  onElementsChange,
  onLayersChange,
  readOnly = false 
}: EnhancedCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('move');
  const [zoom, setZoom] = useState([100]);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  
  const [layers, setLayers] = useState<CanvasLayer[]>([
    { id: '1', name: 'Audio Track 1', visible: true, opacity: 100, locked: false, type: 'audio' },
    { id: '2', name: 'Video Layer', visible: true, opacity: 100, locked: false, type: 'video' },
    { id: '3', name: 'Effects', visible: true, opacity: 80, locked: false, type: 'audio' }
  ]);
  
  const [elements, setElements] = useState<CanvasElement[]>([
    {
      id: 'audio1',
      type: 'audio-clip',
      x: 50,
      y: 100,
      width: 200,
      height: 60,
      data: { name: 'Beat.wav', duration: 4.5, waveform: [] },
      layerId: '1'
    },
    {
      id: 'video1',
      type: 'video-clip',
      x: 300,
      y: 200,
      width: 300,
      height: 169,
      data: { name: 'Performance.mp4', duration: 12.3 },
      layerId: '2'
    }
  ]);

  const tools = [
    { id: 'move', icon: Move, label: 'Move' },
    { id: 'select', icon: Square, label: 'Select' },
    { id: 'brush', icon: Brush, label: 'Brush' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'shape', icon: Circle, label: 'Shape' }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set up canvas
    canvas.width = width;
    canvas.height = height;
    context.lineCap = 'round';
    context.strokeStyle = '#3b82f6';
    context.lineWidth = 2;
    contextRef.current = context;

    redrawCanvas();
  }, [width, height, zoom, panOffset, elements, layers, showGrid]);

  const redrawCanvas = useCallback(() => {
    const context = contextRef.current;
    if (!context) return;

    // Clear canvas
    context.clearRect(0, 0, width, height);
    
    const zoomLevel = zoom[0] / 100;
    context.save();
    context.scale(zoomLevel, zoomLevel);
    context.translate(panOffset.x, panOffset.y);

    // Draw grid
    if (showGrid) {
      drawGrid(context);
    }

    // Draw elements by layer
    layers.forEach(layer => {
      if (!layer.visible) return;
      
      const layerElements = elements.filter(el => el.layerId === layer.id);
      layerElements.forEach(element => {
        drawElement(context, element, layer.opacity / 100);
      });
    });

    context.restore();
  }, [elements, layers, zoom, panOffset, showGrid, width, height]);

  const drawGrid = (context: CanvasRenderingContext2D) => {
    const gridSize = 20;
    context.strokeStyle = 'rgba(156, 163, 175, 0.3)';
    context.lineWidth = 1;

    for (let x = 0; x <= width; x += gridSize) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }

    for (let y = 0; y <= height; y += gridSize) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }
  };

  const drawElement = (context: CanvasRenderingContext2D, element: CanvasElement, opacity: number) => {
    context.globalAlpha = opacity;
    
    switch (element.type) {
      case 'audio-clip':
        drawAudioClip(context, element);
        break;
      case 'video-clip':
        drawVideoClip(context, element);
        break;
      default:
        drawGenericElement(context, element);
    }
    
    context.globalAlpha = 1;
  };

  const drawAudioClip = (context: CanvasRenderingContext2D, element: CanvasElement) => {
    // Draw audio waveform
    context.fillStyle = 'rgba(59, 130, 246, 0.8)';
    context.fillRect(element.x, element.y, element.width, element.height);
    
    // Waveform visualization
    context.strokeStyle = '#1e40af';
    context.lineWidth = 1;
    context.beginPath();
    
    const samples = 50;
    for (let i = 0; i < samples; i++) {
      const x = element.x + (i / samples) * element.width;
      const amplitude = Math.sin(i * 0.5) * 20;
      const y = element.y + element.height / 2 + amplitude;
      
      if (i === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.stroke();

    // Label
    context.fillStyle = '#ffffff';
    context.font = '12px sans-serif';
    context.fillText(element.data.name, element.x + 8, element.y + 16);
  };

  const drawVideoClip = (context: CanvasRenderingContext2D, element: CanvasElement) => {
    // Draw video thumbnail
    context.fillStyle = 'rgba(239, 68, 68, 0.8)';
    context.fillRect(element.x, element.y, element.width, element.height);
    
    // Video play icon
    context.fillStyle = '#ffffff';
    const centerX = element.x + element.width / 2;
    const centerY = element.y + element.height / 2;
    
    context.beginPath();
    context.moveTo(centerX - 20, centerY - 15);
    context.lineTo(centerX + 15, centerY);
    context.lineTo(centerX - 20, centerY + 15);
    context.closePath();
    context.fill();

    // Label
    context.font = '12px sans-serif';
    context.fillText(element.data.name, element.x + 8, element.y + element.height - 8);
  };

  const drawGenericElement = (context: CanvasRenderingContext2D, element: CanvasElement) => {
    context.fillStyle = 'rgba(156, 163, 175, 0.8)';
    context.fillRect(element.x, element.y, element.width, element.height);
    context.strokeStyle = '#6b7280';
    context.strokeRect(element.x, element.y, element.width, element.height);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (readOnly) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    
    // Check if clicking on an element
    const clickedElement = elements.find(el => 
      x >= el.x && x <= el.x + el.width &&
      y >= el.y && y <= el.y + el.height
    );
    
    setSelectedElement(clickedElement?.id || null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || readOnly) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (tool === 'move' && selectedElement) {
      // Move selected element
      setElements(prev => prev.map(el => 
        el.id === selectedElement 
          ? { ...el, x: x - el.width / 2, y: y - el.height / 2 }
          : el
      ));
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleZoomChange = (newZoom: number[]) => {
    setZoom(newZoom);
  };

  const toggleLayer = (layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId 
        ? { ...layer, visible: !layer.visible }
        : layer
    ));
  };

  const updateLayerOpacity = (layerId: string, opacity: number) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId 
        ? { ...layer, opacity }
        : layer
    ));
  };

  return (
    <div className="flex h-full bg-gray-900 text-white">
      {/* Toolbar */}
      <div className="w-16 bg-gray-800 border-r border-gray-700 p-2 space-y-2">
        {tools.map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            variant={tool === id ? "default" : "ghost"}
            size="sm"
            className="w-12 h-12 p-0"
            onClick={() => setTool(id)}
            title={label}
          >
            <Icon className="w-5 h-5" />
          </Button>
        ))}
        
        <div className="border-t border-gray-700 pt-2 mt-4 space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-12 h-12 p-0"
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Grid"
          >
            <Grid className="w-5 h-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="w-12 h-12 p-0"
            title="Fullscreen"
          >
            <Maximize2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Canvas Controls */}
        <div className="bg-gray-800 border-b border-gray-700 p-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Undo className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Redo className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => handleZoomChange([zoom[0] - 10])}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <div className="w-24">
                <Slider
                  value={zoom}
                  onValueChange={handleZoomChange}
                  min={25}
                  max={400}
                  step={25}
                  className="w-full"
                />
              </div>
              <span className="text-sm font-mono w-12">{zoom[0]}%</span>
              <Button variant="ghost" size="sm" onClick={() => handleZoomChange([zoom[0] + 10])}>
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* Canvas Container */}
        <div className="flex-1 relative overflow-auto bg-gray-900">
          <canvas
            ref={canvasRef}
            className="border border-gray-700 bg-black cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>
      </div>

      {/* Layers Panel */}
      <div className="w-64 bg-gray-800 border-l border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center">
            <Layers className="w-4 h-4 mr-2" />
            Layers
          </h3>
        </div>
        
        <div className="space-y-2">
          {layers.map(layer => (
            <Card key={layer.id} className="bg-gray-700 border-gray-600">
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={layer.visible}
                      onChange={() => toggleLayer(layer.id)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">{layer.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">{layer.type}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-xs">Opacity:</span>
                  <Slider
                    value={[layer.opacity]}
                    onValueChange={(value) => updateLayerOpacity(layer.id, value[0])}
                    min={0}
                    max={100}
                    step={10}
                    className="flex-1"
                  />
                  <span className="text-xs w-8">{layer.opacity}%</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}