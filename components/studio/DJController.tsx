'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, Headphones,
  RotateCw, RotateCcw, Crosshair, Settings, Zap, Music,
  Square, Circle, Triangle, Star, Diamond, Hexagon,
  Gauge, Activity, Radio, Wifi, Bluetooth, MousePointer
} from 'lucide-react'

interface DJControllerProps {
  deckA: any
  deckB: any
  onDeckChange: (deckId: 'A' | 'B', property: string, value: any) => void
  onCrossfaderChange: (value: number) => void
  onMasterVolume: (value: number) => void
}

export function DJController({ 
  deckA, 
  deckB, 
  onDeckChange, 
  onCrossfaderChange, 
  onMasterVolume 
}: DJControllerProps) {
  const [crossfaderValue, setCrossfaderValue] = useState(50)
  const [masterVolume, setMasterVolume] = useState(75)
  const [headphoneVolume, setHeadphoneVolume] = useState(60)
  const [headphoneMix, setHeadphoneMix] = useState(50)
  const [selectedEffect, setSelectedEffect] = useState<string>('reverb')
  const [beatSync, setBeatSync] = useState(false)
  const [quantize, setQuantize] = useState(true)

  // Professional DJ controller layout
  const DeckControls = ({ deck, deckId }: { deck: any, deckId: 'A' | 'B' }) => (
    <div className="space-y-4">
      {/* Jog Wheel */}
      <div className="relative">
        <div className={`w-32 h-32 mx-auto rounded-full border-4 ${
          deckId === 'A' ? 'border-blue-500 bg-gradient-to-br from-blue-900/20 to-blue-700/20' 
                          : 'border-orange-500 bg-gradient-to-br from-orange-900/20 to-orange-700/20'
        } flex items-center justify-center cursor-pointer hover:brightness-110 transition-all`}>
          <div className={`w-24 h-24 rounded-full border-2 ${
            deckId === 'A' ? 'border-blue-400' : 'border-orange-400'
          } flex items-center justify-center relative`}>
            {/* Rotation indicator */}
            <div className={`absolute w-1 h-8 ${
              deckId === 'A' ? 'bg-blue-500' : 'bg-orange-500'
            } rounded-full top-2`} />
            <Music className={`${deckId === 'A' ? 'text-blue-400' : 'text-orange-400'}`} size={20} />
          </div>
        </div>
        <div className="text-center mt-2">
          <Badge className={`${deckId === 'A' ? 'bg-blue-600' : 'bg-orange-600'} text-white`}>
            {deck?.track?.bpm || 120} BPM
          </Badge>
        </div>
      </div>

      {/* Transport Controls */}
      <div className="grid grid-cols-4 gap-2">
        <Button 
          size="sm" 
          variant={deck?.cuePlaying ? "default" : "outline"}
          className="h-8"
          onClick={() => onDeckChange(deckId, 'cuePlaying', !deck?.cuePlaying)}
        >
          <Headphones size={14} />
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="h-8"
          onClick={() => onDeckChange(deckId, 'position', 0)}
        >
          <SkipBack size={14} />
        </Button>
        <Button 
          size="sm" 
          variant={deck?.isPlaying ? "default" : "outline"}
          className="h-8"
          onClick={() => onDeckChange(deckId, 'isPlaying', !deck?.isPlaying)}
        >
          {deck?.isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="h-8"
        >
          <SkipForward size={14} />
        </Button>
      </div>

      {/* Hot Cue Pads */}
      <div className="grid grid-cols-4 gap-1">
        {[1, 2, 3, 4].map((cue) => (
          <Button
            key={cue}
            size="sm"
            variant="outline"
            className={`h-8 text-xs ${
              deck?.cuePoints?.includes(cue) 
                ? (deckId === 'A' ? 'bg-blue-600 text-white' : 'bg-orange-600 text-white')
                : 'hover:bg-gray-700'
            }`}
            onClick={() => {
              const cuePoints = deck?.cuePoints || []
              const newCuePoints = cuePoints.includes(cue) 
                ? cuePoints.filter((c: number) => c !== cue)
                : [...cuePoints, cue]
              onDeckChange(deckId, 'cuePoints', newCuePoints)
            }}
          >
            {cue}
          </Button>
        ))}
      </div>

      {/* Loop Controls */}
      <div className="grid grid-cols-3 gap-1">
        <Button size="sm" variant="outline" className="h-7 text-xs">1/4</Button>
        <Button size="sm" variant="outline" className="h-7 text-xs">1/2</Button>
        <Button size="sm" variant="outline" className="h-7 text-xs">1</Button>
      </div>
      <div className="grid grid-cols-3 gap-1">
        <Button size="sm" variant="outline" className="h-7 text-xs">2</Button>
        <Button size="sm" variant="outline" className="h-7 text-xs">4</Button>
        <Button size="sm" variant="outline" className="h-7 text-xs">8</Button>
      </div>

      {/* Performance Pads */}
      <div className="grid grid-cols-4 gap-1">
        {[
          { icon: Square, color: 'red', name: 'Roll' },
          { icon: Circle, color: 'green', name: 'Filter' },
          { icon: Triangle, color: 'blue', name: 'Gate' },
          { icon: Diamond, color: 'purple', name: 'Slip' }
        ].map((pad, idx) => (
          <Button
            key={idx}
            size="sm"
            variant="outline"
            className={`h-8 hover:bg-${pad.color}-600/20`}
          >
            <pad.icon size={12} />
          </Button>
        ))}
      </div>

      {/* EQ Section */}
      <div className="space-y-2">
        <div className="text-xs text-gray-400 text-center">EQ</div>
        {['high', 'mid', 'low'].map((freq) => (
          <div key={freq} className="flex items-center space-x-2">
            <span className="text-xs w-8 text-gray-400">{freq.toUpperCase()}</span>
            <Slider
              value={[deck?.eq?.[freq] || 0]}
              onValueChange={(value) => onDeckChange(deckId, 'eq', { ...deck?.eq, [freq]: value[0] })}
              min={-100}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-xs w-8 text-gray-400">{deck?.eq?.[freq] || 0}</span>
          </div>
        ))}
      </div>

      {/* Volume and Gain */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs w-12 text-gray-400">GAIN</span>
          <Slider
            value={[deck?.gain || 0]}
            onValueChange={(value) => onDeckChange(deckId, 'gain', value[0])}
            min={-20}
            max={20}
            step={0.1}
            className="flex-1"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Volume2 size={16} className="text-gray-400" />
          <Slider
            value={[deck?.volume || 100]}
            onValueChange={(value) => onDeckChange(deckId, 'volume', value[0])}
            min={0}
            max={100}
            step={1}
            className="flex-1"
          />
        </div>
      </div>

      {/* Filter */}
      <div className="space-y-2">
        <div className="text-xs text-gray-400 text-center">FILTER</div>
        <Slider
          value={[deck?.effects?.filter || 0]}
          onValueChange={(value) => onDeckChange(deckId, 'effects', { 
            ...deck?.effects, 
            filter: value[0] 
          })}
          min={-100}
          max={100}
          step={1}
          className="w-full"
        />
      </div>
    </div>
  )

  return (
    <div className="w-full bg-black text-white">
      {/* Top Control Bar */}
      <div className="bg-gray-900 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {/* Master Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Volume2 className="text-gray-400" size={16} />
              <span className="text-xs text-gray-400">MASTER</span>
              <Slider
                value={[masterVolume]}
                onValueChange={(value) => {
                  setMasterVolume(value[0])
                  onMasterVolume(value[0])
                }}
                min={0}
                max={100}
                step={1}
                className="w-24"
              />
              <span className="text-xs text-gray-400 w-8">{masterVolume}</span>
            </div>
            
            {/* Booth/Monitor */}
            <div className="flex items-center space-x-2">
              <Headphones className="text-gray-400" size={16} />
              <span className="text-xs text-gray-400">BOOTH</span>
              <Slider
                value={[headphoneVolume]}
                onValueChange={(value) => setHeadphoneVolume(value[0])}
                min={0}
                max={100}
                step={1}
                className="w-20"
              />
            </div>
          </div>

          {/* Software Integration */}
          <div className="flex items-center space-x-4">
            <Badge className="bg-blue-600 text-white">Serato</Badge>
            <Badge className="bg-green-600 text-white">Traktor</Badge>
            <Badge className="bg-orange-600 text-white">MPC Beats</Badge>
            <Badge className="bg-purple-600 text-white">Virtual DJ</Badge>
          </div>

          {/* Global Controls */}
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant={beatSync ? "default" : "outline"}
              onClick={() => setBeatSync(!beatSync)}
              className="h-8"
            >
              <Activity size={14} />
              <span className="ml-1 text-xs">SYNC</span>
            </Button>
            <Button
              size="sm"
              variant={quantize ? "default" : "outline"}
              onClick={() => setQuantize(!quantize)}
              className="h-8"
            >
              <Crosshair size={14} />
              <span className="ml-1 text-xs">QUANT</span>
            </Button>
            <Button size="sm" variant="outline" className="h-8">
              <Settings size={14} />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Controller Layout */}
      <div className="grid grid-cols-3 gap-4 p-6">
        {/* Deck A */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="text-blue-400">DECK A</span>
              <Badge className="bg-blue-600 text-white">
                {deckA?.track?.title || 'No Track'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DeckControls deck={deckA} deckId="A" />
          </CardContent>
        </Card>

        {/* Center Mixer Section */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-center text-gray-300">MIXER</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Crossfader */}
            <div className="space-y-2">
              <div className="text-xs text-gray-400 text-center">CROSSFADER</div>
              <div className="relative">
                <Slider
                  value={[crossfaderValue]}
                  onValueChange={(value) => {
                    setCrossfaderValue(value[0])
                    onCrossfaderChange(value[0])
                  }}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>A</span>
                  <span>B</span>
                </div>
              </div>
            </div>

            {/* Channel Faders */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-xs text-gray-400 text-center">CH A</div>
                <div className="h-32 flex justify-center">
                  <Slider
                    orientation="vertical"
                    value={[deckA?.volume || 100]}
                    onValueChange={(value) => onDeckChange('A', 'volume', value[0])}
                    min={0}
                    max={100}
                    step={1}
                    className="h-full"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-gray-400 text-center">CH B</div>
                <div className="h-32 flex justify-center">
                  <Slider
                    orientation="vertical"
                    value={[deckB?.volume || 100]}
                    onValueChange={(value) => onDeckChange('B', 'volume', value[0])}
                    min={0}
                    max={100}
                    step={1}
                    className="h-full"
                  />
                </div>
              </div>
            </div>

            {/* Effects Section */}
            <div className="space-y-3">
              <div className="text-xs text-gray-400 text-center">EFFECTS</div>
              <div className="grid grid-cols-2 gap-2">
                {['reverb', 'delay', 'filter', 'crush'].map((effect) => (
                  <Button
                    key={effect}
                    size="sm"
                    variant={selectedEffect === effect ? "default" : "outline"}
                    className="h-8 text-xs"
                    onClick={() => setSelectedEffect(effect)}
                  >
                    {effect.toUpperCase()}
                  </Button>
                ))}
              </div>
              <Slider
                value={[0]}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Headphone Controls */}
            <div className="space-y-2">
              <div className="text-xs text-gray-400 text-center">HEADPHONES</div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">MIX</span>
                <Slider
                  value={[headphoneMix]}
                  onValueChange={(value) => setHeadphoneMix(value[0])}
                  min={0}
                  max={100}
                  step={1}
                  className="flex-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  CUE A
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  CUE B
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deck B */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="text-orange-400">DECK B</span>
              <Badge className="bg-orange-600 text-white">
                {deckB?.track?.title || 'No Track'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DeckControls deck={deckB} deckId="B" />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Effects and Sampler */}
      <div className="bg-gray-900 p-4 border-t border-gray-700">
        <div className="grid grid-cols-4 gap-4">
          {/* Sampler Pads */}
          <div className="col-span-2">
            <div className="text-xs text-gray-400 mb-2 text-center">SAMPLER / MPC INTEGRATION</div>
            <div className="grid grid-cols-8 gap-1">
              {Array.from({ length: 16 }).map((_, idx) => (
                <Button
                  key={idx}
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0 text-xs hover:bg-orange-600/20"
                >
                  {idx + 1}
                </Button>
              ))}
            </div>
          </div>

          {/* Advanced Effects */}
          <div>
            <div className="text-xs text-gray-400 mb-2 text-center">FX RACK</div>
            <div className="grid grid-cols-2 gap-1">
              {['Echo', 'Flanger', 'Phaser', 'BitCrush'].map((fx) => (
                <Button
                  key={fx}
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                >
                  {fx}
                </Button>
              ))}
            </div>
          </div>

          {/* Recording Controls */}
          <div>
            <div className="text-xs text-gray-400 mb-2 text-center">RECORDING</div>
            <div className="space-y-1">
              <Button size="sm" variant="outline" className="w-full h-7 text-xs">
                <Circle className="mr-1" size={10} />
                REC
              </Button>
              <Button size="sm" variant="outline" className="w-full h-7 text-xs">
                <Square className="mr-1" size={10} />
                STOP
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DJController