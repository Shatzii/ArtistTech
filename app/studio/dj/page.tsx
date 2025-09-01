'use client'

import React, { useState, useEffect, useRef } from 'react'
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, Settings,
  Crosshair, Zap, Music, Headphones, Radio, Mic, Search,
  RotateCw, RotateCcw, Square, Circle, Triangle, Shuffle,
  Sliders, Gauge, Activity, Waves, Eye, Brain, Wifi,
  Cloud, Apple, MonitorSpeaker, Users, Star, Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import WaveformCanvas from '@/components/studio/WaveformCanvas'
import DJController from '@/components/studio/DJController'

interface StreamingTrack {
  id: string
  service: 'spotify' | 'soundcloud' | 'apple'
  title: string
  artist: string
  album: string
  duration: number
  bpm: number
  key: string
  energy: number
  streamUrl: string
  previewUrl: string
  waveformUrl?: string
  artwork: string
  externalUrl: string
  matchScore?: number
}

interface DJDeck {
  id: 'A' | 'B' | 'C' | 'D'
  track: StreamingTrack | null
  isPlaying: boolean
  position: number
  pitch: number
  volume: number
  gain: number
  eq: { low: number; mid: number; high: number }
  effects: { 
    reverb: number
    delay: number 
    filter: number
    bitcrusher: number
  }
  cuePoints: number[]
  loop: { start: number; end: number; active: boolean }
  sync: boolean
  quantize: boolean
  streaming: boolean
}

interface StreamingServices {
  spotify: { connected: boolean; premium: boolean }
  soundcloud: { connected: boolean; pro: boolean }
  apple: { connected: boolean; subscription: boolean }
}

export default function AdvancedStreamingDJ() {
  const [decks, setDecks] = useState({
    A: {
      id: 'A' as const, track: null, isPlaying: false, position: 0, pitch: 0, volume: 75, gain: 50,
      eq: { low: 50, mid: 50, high: 50 }, effects: { reverb: 0, delay: 0, filter: 50, bitcrusher: 0 },
      cuePoints: [], loop: { start: 0, end: 0, active: false }, sync: false, quantize: true, streaming: false
    },
    B: {
      id: 'B' as const, track: null, isPlaying: false, position: 0, pitch: 0, volume: 75, gain: 50,
      eq: { low: 50, mid: 50, high: 50 }, effects: { reverb: 0, delay: 0, filter: 50, bitcrusher: 0 },
      cuePoints: [], loop: { start: 0, end: 0, active: false }, sync: false, quantize: true, streaming: false
    },
    C: {
      id: 'C' as const, track: null, isPlaying: false, position: 0, pitch: 0, volume: 75, gain: 50,
      eq: { low: 50, mid: 50, high: 50 }, effects: { reverb: 0, delay: 0, filter: 50, bitcrusher: 0 },
      cuePoints: [], loop: { start: 0, end: 0, active: false }, sync: false, quantize: true, streaming: false
    },
    D: {
      id: 'D' as const, track: null, isPlaying: false, position: 0, pitch: 0, volume: 75, gain: 50,
      eq: { low: 50, mid: 50, high: 50 }, effects: { reverb: 0, delay: 0, filter: 50, bitcrusher: 0 },
      cuePoints: [], loop: { start: 0, end: 0, active: false }, sync: false, quantize: true, streaming: false
    }
  })

  const [services, setServices] = useState<StreamingServices>({
    spotify: { connected: false, premium: false },
    soundcloud: { connected: false, pro: false },
    apple: { connected: false, subscription: false }
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<{
    spotify: StreamingTrack[]
    soundcloud: StreamingTrack[]
    apple: StreamingTrack[]
  }>({
    spotify: [],
    soundcloud: [],
    apple: []
  })

  const [currentSearchService, setCurrentSearchService] = useState<'all' | 'spotify' | 'soundcloud' | 'apple'>('all')
  const [isSearching, setIsSearching] = useState(false)
  const [ws, setWs] = useState<WebSocket | null>(null)

  // AI-powered features
  const [aiFeatures, setAiFeatures] = useState({
    autoMix: false,
    beatMatching: true,
    keyDetection: true,
    crowdAnalysis: true,
    nextTrackSuggestion: true,
    energyFlow: true,
    crossfadeAssist: true
  })

  const [crowdEnergy, setCrowdEnergy] = useState(72)
  const [nextTrackSuggestions, setNextTrackSuggestions] = useState<StreamingTrack[]>([])

  // WebSocket connection for streaming integration
  useEffect(() => {
    // Connect to backend server on port 5000
    const websocket = new WebSocket('ws://localhost:5000/streaming')
    
    websocket.onopen = () => {
      console.log('Connected to streaming integration')
      setWs(websocket)
      // Request service status
      websocket.send(JSON.stringify({ type: 'get_service_status' }))
    }

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      handleWebSocketMessage(data)
    }

    websocket.onclose = () => {
      console.log('Disconnected from streaming integration')
      setWs(null)
    }

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    return () => websocket.close()
  }, [])

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'service_status':
        updateServiceStatus(data.services)
        break
      case 'search_results':
        setSearchResults(data.results)
        setIsSearching(false)
        break
      case 'track_loaded':
        loadTrackToDeck(data.track, data.deckId)
        break
      case 'auth_url':
        window.open(data.authUrl, '_blank')
        break
      case 'error':
        console.error('Streaming error:', data.message)
        break
    }
  }

  const updateServiceStatus = (serviceList: any[]) => {
    const updatedServices = { ...services }
    serviceList.forEach(service => {
      if (service.name in updatedServices) {
        updatedServices[service.name as keyof StreamingServices].connected = service.connected
      }
    })
    setServices(updatedServices)
  }

  const connectService = (service: 'spotify' | 'soundcloud' | 'apple') => {
    if (ws) {
      ws.send(JSON.stringify({
        type: 'connect_service',
        service
      }))
    }
  }

  const searchTracks = () => {
    if (!searchQuery.trim() || !ws) return
    
    setIsSearching(true)
    ws.send(JSON.stringify({
      type: 'search_all_platforms',
      query: searchQuery,
      limit: 50
    }))
  }

  const loadTrackToDeck = (track: StreamingTrack, deckId: string) => {
    setDecks(prevDecks => ({
      ...prevDecks,
      [deckId]: { ...prevDecks[deckId as keyof typeof prevDecks], track, streaming: true, position: 0 }
    }))
  }

  const loadTrack = (track: StreamingTrack, deckId: 'A' | 'B' | 'C' | 'D') => {
    if (ws) {
      ws.send(JSON.stringify({
        type: 'load_track',
        trackId: track.id,
        service: track.service,
        deckId
      }))
    }
  }

  const togglePlay = (deckId: 'A' | 'B' | 'C' | 'D') => {
    setDecks(prevDecks => ({
      ...prevDecks,
      [deckId]: { ...prevDecks[deckId], isPlaying: !prevDecks[deckId].isPlaying }
    }))
  }

  const updateDeckValue = (deckId: 'A' | 'B' | 'C' | 'D', property: string, value: any) => {
    setDecks(prevDecks => ({
      ...prevDecks,
      [deckId]: { ...prevDecks[deckId], [property]: value }
    }))
  }

  const updateEQ = (deckId: 'A' | 'B' | 'C' | 'D', band: 'low' | 'mid' | 'high', value: number) => {
    setDecks(prevDecks => ({
      ...prevDecks,
      [deckId]: { 
        ...prevDecks[deckId], 
        eq: { ...prevDecks[deckId].eq, [band]: value } 
      }
    }))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'spotify': return <MonitorSpeaker className="text-green-500" size={16} />
      case 'soundcloud': return <Cloud className="text-orange-500" size={16} />
      case 'apple': return <Apple className="text-gray-300" size={16} />
      default: return <Music size={16} />
    }
  }

  const DeckComponent = ({ deck }: { deck: DJDeck }) => (
    <Card className="bg-gray-900/90 border-gray-700">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge className="bg-orange-600 text-white text-lg px-3 py-1">
              DECK {deck.id}
            </Badge>
            {deck.streaming && (
              <Badge className="bg-blue-600 text-white">
                <Wifi size={12} className="mr-1" />
                LIVE
              </Badge>
            )}
            <Badge 
              variant={deck.sync ? "default" : "outline"}
              className={deck.sync ? "bg-green-600" : ""}
            >
              SYNC
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            {deck.track && (
              <>
                {getServiceIcon(deck.track.service)}
                <Badge variant="outline" className="text-xs">
                  {deck.track.bpm} BPM
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {deck.track.key}
                </Badge>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Track Info */}
        {deck.track ? (
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <img 
                src={deck.track.artwork} 
                alt={deck.track.title}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold truncate">{deck.track.title}</h3>
                <p className="text-gray-400 text-sm truncate">{deck.track.artist}</p>
                <p className="text-gray-500 text-xs truncate">{deck.track.album}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>{formatTime(deck.position)}</span>
              <Badge className="bg-purple-600 text-white">
                Energy: {deck.track.energy}%
              </Badge>
              <span>-{formatTime(deck.track.duration - deck.position)}</span>
            </div>
          </div>
        ) : (
          <div 
            className="bg-gray-800 p-8 rounded-lg border-2 border-dashed border-gray-600 text-center cursor-pointer hover:border-orange-500 transition-colors"
            onClick={() => {/* Open track browser */}}
          >
            <Music className="mx-auto mb-2 text-gray-500" size={32} />
            <p className="text-gray-500">Drop Track Here</p>
            <p className="text-gray-600 text-xs mt-1">or click to browse</p>
          </div>
        )}

        {/* Interactive Waveform with Beat Detection */}
        {deck.track && (
          <WaveformCanvas
            audioUrl={deck.track.previewUrl || deck.track.streamUrl}
            isPlaying={deck.isPlaying}
            currentTime={deck.position}
            duration={deck.track.duration}
            onSeek={(time) => updateDeckValue(deck.id, 'position', time)}
            className="mb-2"
          />
        )}

        {/* Transport Controls */}
        <div className="flex items-center justify-center space-x-2">
          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
            <SkipBack size={16} />
          </Button>
          <Button 
            size="lg"
            onClick={() => togglePlay(deck.id)}
            className={deck.isPlaying ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
            disabled={!deck.track}
          >
            {deck.isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </Button>
          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
            <SkipForward size={16} />
          </Button>
        </div>

        {/* Pitch & Tempo */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">PITCH</span>
            <span className="text-sm text-white">{deck.pitch > 0 ? '+' : ''}{deck.pitch.toFixed(1)}%</span>
          </div>
          <Slider
            value={[deck.pitch]}
            onValueChange={([value]) => updateDeckValue(deck.id, 'pitch', value)}
            min={-20}
            max={20}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Volume Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">VOL</span>
              <span className="text-sm text-white">{deck.volume}</span>
            </div>
            <Slider
              value={[deck.volume]}
              onValueChange={([value]) => updateDeckValue(deck.id, 'volume', value)}
              max={100}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">GAIN</span>
              <span className="text-sm text-white">{deck.gain}</span>
            </div>
            <Slider
              value={[deck.gain]}
              onValueChange={([value]) => updateDeckValue(deck.id, 'gain', value)}
              max={100}
              className="w-full"
            />
          </div>
        </div>

        {/* 3-Band EQ */}
        <div className="grid grid-cols-3 gap-2">
          {(['high', 'mid', 'low'] as const).map((band) => (
            <div key={band} className="space-y-2">
              <div className="text-center">
                <span className="text-xs text-gray-400 uppercase">{band}</span>
                <div className="text-xs text-white">{deck.eq[band]}</div>
              </div>
              <div className="h-20 flex items-end justify-center">
                <Slider
                  value={[deck.eq[band]]}
                  onValueChange={([value]) => updateEQ(deck.id, band, value)}
                  max={100}
                  orientation="vertical"
                  className="h-full"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Hot Cues */}
        <div className="grid grid-cols-4 gap-1">
          {[1, 2, 3, 4].map((cue) => (
            <Button
              key={cue}
              size="sm"
              variant={deck.cuePoints.includes(cue * 30) ? "default" : "outline"}
              className={deck.cuePoints.includes(cue * 30) 
                ? "bg-orange-600 hover:bg-orange-700" 
                : "border-gray-600 hover:border-orange-500"
              }
            >
              {cue}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Radio className="text-orange-400" size={32} />
            <div>
              <h1 className="text-2xl font-bold text-white">ProStudio DJ</h1>
              <p className="text-gray-400 text-sm">Professional Streaming DJ System</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge className="bg-green-600 text-white">
              <Activity className="mr-1" size={12} />
              13 AI Engines Active
            </Badge>
            <Badge className="bg-purple-600 text-white">
              <Brain className="mr-1" size={12} />
              Crowd Energy: {crowdEnergy}%
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Track Library & Search */}
        <div className="w-80 bg-gray-900/50 border-r border-gray-700 p-4">
          <div className="space-y-4">
            {/* Streaming Services */}
            <Card className="bg-gray-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white">Streaming Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(services).map(([service, status]) => (
                  <div key={service} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getServiceIcon(service)}
                      <span className="text-sm text-white capitalize">{service}</span>
                    </div>
                    <Button
                      size="sm"
                      variant={status.connected ? "default" : "outline"}
                      className={status.connected ? "bg-green-600 hover:bg-green-700" : ""}
                      onClick={() => !status.connected && connectService(service as any)}
                    >
                      {status.connected ? 'Connected' : 'Connect'}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Search */}
            <Card className="bg-gray-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white">Track Search</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Search tracks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchTracks()}
                    className="bg-gray-700 border-gray-600"
                  />
                  <Button 
                    size="sm" 
                    onClick={searchTracks}
                    disabled={isSearching || !searchQuery.trim()}
                  >
                    <Search size={16} />
                  </Button>
                </div>

                <Tabs value={currentSearchService} onValueChange={setCurrentSearchService as any}>
                  <TabsList className="grid w-full grid-cols-4 bg-gray-700">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="spotify">Spotify</TabsTrigger>
                    <TabsTrigger value="soundcloud">SC</TabsTrigger>
                    <TabsTrigger value="apple">Apple</TabsTrigger>
                  </TabsList>
                  
                  <div className="mt-3 max-h-96 overflow-y-auto space-y-1">
                    {currentSearchService === 'all' ? (
                      // Show all results
                      [...searchResults.spotify, ...searchResults.soundcloud, ...searchResults.apple]
                        .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
                        .slice(0, 20)
                        .map((track, index) => (
                          <TrackCard key={`${track.service}-${track.id}`} track={track} onLoad={loadTrack} />
                        ))
                    ) : (
                      // Show service-specific results
                      searchResults[currentSearchService as keyof typeof searchResults]?.map((track, index) => (
                        <TrackCard key={`${track.service}-${track.id}`} track={track} onLoad={loadTrack} />
                      ))
                    )}
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Professional DJ Interface */}
        <div className="flex-1 p-6">
          {/* Professional DJ Controller */}
          <div className="mb-6">
            <DJController
              deckA={decks.A}
              deckB={decks.B}
              onDeckChange={updateDeckValue}
              onCrossfaderChange={(value) => {
                // Professional crossfader logic: 0-50 favors A, 50-100 favors B
                const aVolume = Math.max(0, (50 - value) * 2)
                const bVolume = Math.max(0, (value - 50) * 2)
                updateDeckValue('A', 'crossfaderVolume', aVolume)
                updateDeckValue('B', 'crossfaderVolume', bVolume)
              }}
              onMasterVolume={(value) => {
                // Update master volume for all decks
                updateDeckValue('A', 'masterVolume', value)
                updateDeckValue('B', 'masterVolume', value)
                updateDeckValue('C', 'masterVolume', value)
                updateDeckValue('D', 'masterVolume', value)
              }}
            />
          </div>

          {/* 4-Deck Extended Layout */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <DeckComponent deck={decks.A} />
            <DeckComponent deck={decks.B} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <DeckComponent deck={decks.C} />
            <DeckComponent deck={decks.D} />
          </div>

          {/* AI & Live Streaming Controls */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <Card className="bg-gray-900/90 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-center text-purple-400">
                  <Brain className="inline mr-2" size={16} />
                  AI FEATURES
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(aiFeatures).slice(0, 4).map(([feature, enabled]) => (
                  <div key={feature} className="flex items-center justify-between">
                    <span className="text-xs text-gray-300 capitalize">
                      {feature.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <Button
                      size="sm"
                      variant={enabled ? "default" : "outline"}
                      className={enabled ? "bg-purple-600 hover:bg-purple-700 h-6 px-2 text-xs" : "h-6 px-2 text-xs"}
                      onClick={() => setAiFeatures(prev => ({ ...prev, [feature]: !enabled }))}
                    >
                      {enabled ? 'ON' : 'OFF'}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gray-900/90 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-center text-red-400">
                  <Circle className="inline mr-2" size={16} />
                  LIVE STREAMING
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-xs">
                  Start Live Stream
                </Button>
                <div className="text-xs text-gray-400 text-center">
                  Crowd Energy: {crowdEnergy}%
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/90 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-center text-green-400">
                  <Activity className="inline mr-2" size={16} />
                  SYSTEM STATUS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-xs text-gray-300">13 AI Engines Active</div>
                <div className="text-xs text-gray-300">MIDI: Akai MPK Mini MK3</div>
                <div className="text-xs text-gray-300">Audio: 48kHz/24-bit</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

const TrackCard = ({ track, onLoad }: { 
  track: StreamingTrack
  onLoad: (track: StreamingTrack, deckId: 'A' | 'B' | 'C' | 'D') => void
}) => (
  <div className="bg-gray-700/50 p-2 rounded hover:bg-gray-600/50 transition-colors">
    <div className="flex items-center space-x-2">
      <img 
        src={track.artwork} 
        alt={track.title}
        className="w-8 h-8 rounded object-cover"
      />
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-white truncate">{track.title}</div>
        <div className="text-xs text-gray-400 truncate">{track.artist}</div>
      </div>
      <div className="flex items-center space-x-1">
        <Badge variant="outline" className="text-xs px-1 py-0">
          {track.bpm}
        </Badge>
        <div className="flex space-x-1">
          {['A', 'B', 'C', 'D'].map((deck) => (
            <Button
              key={deck}
              size="sm"
              variant="outline"
              className="h-6 w-6 p-0 text-xs"
              onClick={() => onLoad(track, deck as any)}
            >
              {deck}
            </Button>
          ))}
        </div>
      </div>
    </div>
  </div>
)