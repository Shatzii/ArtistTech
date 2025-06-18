import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface Pattern {
  id: string;
  name: string;
  length: number;
  tempo: number;
  swing: number;
  steps: { [padId: string]: boolean[] };
  velocity: { [padId: string]: number[] };
}

interface MPCSequencerProps {
  pattern: Pattern;
  currentStep: number;
  selectedPad: string;
  onStepToggle: (padId: string, stepIndex: number) => void;
}

export default function MPCSequencer({ pattern, currentStep, selectedPad, onStepToggle }: MPCSequencerProps) {
  const [velocityMode, setVelocityMode] = useState(false);
  const [selectedSteps, setSelectedSteps] = useState<Set<number>>(new Set());

  const padLabels: { [key: string]: string } = {
    'pad1': 'Kick 1', 'pad2': 'Kick 2', 'pad3': 'Snare 1', 'pad4': 'Snare 2',
    'pad5': 'HH Closed', 'pad6': 'HH Open', 'pad7': 'Crash', 'pad8': 'Ride',
    'pad9': 'Tom Hi', 'pad10': 'Tom Mid', 'pad11': 'Tom Low', 'pad12': 'Shaker',
    'pad13': 'Clap', 'pad14': 'Cowbell', 'pad15': 'FX Sweep', 'pad16': 'Vinyl Stop'
  };

  const getStepColor = (padId: string, stepIndex: number) => {
    const isActive = pattern.steps[padId]?.[stepIndex] || false;
    const isCurrent = stepIndex === currentStep;
    const velocity = pattern.velocity[padId]?.[stepIndex] || 0.8;
    
    if (isCurrent && isActive) {
      return 'bg-orange-500 border-orange-400 shadow-lg shadow-orange-500/50';
    } else if (isCurrent) {
      return 'bg-blue-500 border-blue-400 shadow-lg shadow-blue-500/50';
    } else if (isActive) {
      const intensity = Math.round(velocity * 255);
      return `bg-green-500 border-green-400 opacity-${Math.max(50, Math.round(velocity * 100))}`;
    }
    return 'bg-gray-700 border-gray-600 hover:bg-gray-600';
  };

  const handleStepClick = (stepIndex: number) => {
    onStepToggle(selectedPad, stepIndex);
  };

  const handleStepSelection = (stepIndex: number, isShiftClick: boolean) => {
    if (isShiftClick) {
      setSelectedSteps(prev => {
        const newSet = new Set(prev);
        if (newSet.has(stepIndex)) {
          newSet.delete(stepIndex);
        } else {
          newSet.add(stepIndex);
        }
        return newSet;
      });
    } else {
      setSelectedSteps(new Set([stepIndex]));
    }
  };

  const clearSelectedSteps = () => {
    selectedSteps.forEach(stepIndex => {
      onStepToggle(selectedPad, stepIndex);
    });
    setSelectedSteps(new Set());
  };

  const getBeatLabel = (stepIndex: number) => {
    const beat = Math.floor(stepIndex / 4) + 1;
    const sixteenth = (stepIndex % 4) + 1;
    return `${beat}.${sixteenth}`;
  };

  return (
    <div className="bg-gray-900 border-t border-gray-700 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-sm font-semibold">Step Sequencer</h3>
          <div className="text-xs text-gray-400">
            Editing: {padLabels[selectedPad] || selectedPad}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setVelocityMode(!velocityMode)}
            variant={velocityMode ? "default" : "outline"}
            size="sm"
            className="text-xs"
          >
            Velocity
          </Button>
          
          {selectedSteps.size > 0 && (
            <Button
              onClick={clearSelectedSteps}
              variant="destructive"
              size="sm"
              className="text-xs"
            >
              Clear Selected
            </Button>
          )}
        </div>
      </div>

      {/* Beat Numbers */}
      <div className="mb-2 flex">
        <div className="w-24"></div>
        <div className="flex-1 grid grid-cols-16 gap-1">
          {Array.from({ length: pattern.length }, (_, i) => (
            <div key={i} className="text-xs text-center text-gray-400 py-1">
              {getBeatLabel(i)}
            </div>
          ))}
        </div>
      </div>

      {/* Main Sequencer Grid */}
      <div className="space-y-1 max-h-64 overflow-y-auto">
        {Object.keys(pattern.steps).slice(0, 8).map((padId) => (
          <div key={padId} className="flex items-center">
            {/* Pad Label */}
            <div className={cn(
              "w-24 text-xs p-2 border border-gray-600 rounded text-center cursor-pointer transition-colors",
              selectedPad === padId ? "bg-blue-600 border-blue-500" : "bg-gray-700 hover:bg-gray-600"
            )}>
              {padLabels[padId] || padId}
            </div>
            
            {/* Step Buttons */}
            <div className="flex-1 grid grid-cols-16 gap-1 ml-2">
              {Array.from({ length: pattern.length }, (_, stepIndex) => {
                const isActive = pattern.steps[padId]?.[stepIndex] || false;
                const velocity = pattern.velocity[padId]?.[stepIndex] || 0.8;
                const isSelected = selectedSteps.has(stepIndex);
                
                return (
                  <div key={stepIndex} className="relative">
                    <Button
                      className={cn(
                        "w-full h-8 p-0 border-2 transition-all duration-100",
                        getStepColor(padId, stepIndex),
                        isSelected && "ring-2 ring-white ring-opacity-50",
                        stepIndex % 4 === 0 && "border-l-4 border-l-yellow-500"
                      )}
                      onClick={(e) => {
                        handleStepClick(stepIndex);
                        handleStepSelection(stepIndex, e.shiftKey);
                      }}
                    >
                      {velocityMode && isActive && (
                        <div className="text-xs font-bold">
                          {Math.round(velocity * 127)}
                        </div>
                      )}
                    </Button>
                    
                    {/* Velocity Indicator */}
                    {!velocityMode && isActive && (
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-white opacity-60"
                        style={{ height: `${velocity * 8}px` }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Velocity Control for Selected Steps */}
      {velocityMode && selectedSteps.size > 0 && (
        <div className="mt-4 p-3 bg-gray-800 rounded border border-gray-600">
          <div className="flex items-center space-x-4">
            <span className="text-xs text-gray-400">
              Velocity for {selectedSteps.size} step(s):
            </span>
            <div className="flex-1">
              <Slider
                value={[pattern.velocity[selectedPad]?.[Array.from(selectedSteps)[0]] * 127 || 100]}
                onValueChange={([value]) => {
                  // Apply velocity to all selected steps
                  selectedSteps.forEach(stepIndex => {
                    if (pattern.velocity[selectedPad]) {
                      pattern.velocity[selectedPad][stepIndex] = value / 127;
                    }
                  });
                }}
                min={1}
                max={127}
                step={1}
                className="w-full"
              />
            </div>
            <span className="text-xs text-gray-400 w-8">
              {Math.round((pattern.velocity[selectedPad]?.[Array.from(selectedSteps)[0]] || 0.8) * 127)}
            </span>
          </div>
        </div>
      )}

      {/* Pattern Controls */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          <div>Length: {pattern.length} steps</div>
          <div>Current: Step {currentStep + 1}</div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span>Playing</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Current</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}