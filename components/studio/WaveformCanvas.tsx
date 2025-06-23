'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Activity, Zap, Music } from 'lucide-react'

interface WaveformData {
  peaks: Float32Array
  length: number
  sampleRate: number
  duration: number
}

interface BeatData {
  beats: number[]
  tempo: number
  confidence: number
  timeSignature: { numerator: number; denominator: number }
}

interface WaveformCanvasProps {
  audioUrl?: string
  isPlaying: boolean
  currentTime: number
  duration: number
  onSeek?: (time: number) => void
  className?: string
}

export function WaveformCanvas({ 
  audioUrl, 
  isPlaying, 
  currentTime, 
  duration, 
  onSeek,
  className = ""
}: WaveformCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)

  const [waveformData, setWaveformData] = useState<WaveformData | null>(null)
  const [beatData, setBeatData] = useState<BeatData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [frequencyData, setFrequencyData] = useState<Uint8Array | null>(null)
  const [detectedTempo, setDetectedTempo] = useState<number>(120)

  // Initialize audio context and analyzer
  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 2048
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (sourceRef.current) {
        sourceRef.current.stop()
      }
    }
  }, [])

  // Load and analyze audio file
  useEffect(() => {
    if (audioUrl) {
      loadAudioFile(audioUrl)
    }
  }, [audioUrl])

  // Real-time frequency analysis and rendering
  useEffect(() => {
    if (isPlaying && analyserRef.current) {
      const updateVisualization = () => {
        if (analyserRef.current) {
          const bufferLength = analyserRef.current.frequencyBinCount
          const dataArray = new Uint8Array(bufferLength)
          analyserRef.current.getByteFrequencyData(dataArray)
          setFrequencyData(dataArray)
          
          // Render waveform
          renderWaveform()
        }
        
        if (isPlaying) {
          animationFrameRef.current = requestAnimationFrame(updateVisualization)
        }
      }
      
      updateVisualization()
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      // Still render static waveform when not playing
      renderWaveform()
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isPlaying, currentTime, waveformData])

  const loadAudioFile = async (url: string) => {
    if (!audioContextRef.current) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(url)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer)

      // Extract waveform data from audio buffer
      const channelData = audioBuffer.getChannelData(0)
      const sampleRate = audioBuffer.sampleRate
      const duration = audioBuffer.duration
      
      // Create downsampled peaks for visualization
      const samplesPerPixel = Math.floor(channelData.length / 800) // Target ~800 pixels width
      const peaks = new Float32Array(Math.floor(channelData.length / samplesPerPixel))
      
      for (let i = 0; i < peaks.length; i++) {
        const start = i * samplesPerPixel
        const end = Math.min(start + samplesPerPixel, channelData.length)
        let max = 0
        
        for (let j = start; j < end; j++) {
          max = Math.max(max, Math.abs(channelData[j]))
        }
        peaks[i] = max
      }

      const waveformData: WaveformData = {
        peaks,
        length: channelData.length,
        sampleRate,
        duration
      }

      // Simple beat detection based on energy analysis
      const beatData = detectBeats(audioBuffer)

      setWaveformData(waveformData)
      setBeatData(beatData)
      setDetectedTempo(beatData.tempo)

    } catch (err) {
      console.error('Error loading audio:', err)
      setError('Failed to load audio file')
    } finally {
      setIsLoading(false)
    }
  }

  const detectBeats = (audioBuffer: AudioBuffer): BeatData => {
    const channelData = audioBuffer.getChannelData(0)
    const sampleRate = audioBuffer.sampleRate
    const windowSize = 1024
    const hopSize = 512
    const beats: number[] = []
    
    // Simple energy-based beat detection
    let previousEnergy = 0
    let beatThreshold = 0.3
    
    for (let i = 0; i < channelData.length - windowSize; i += hopSize) {
      let energy = 0
      for (let j = 0; j < windowSize; j++) {
        energy += channelData[i + j] * channelData[i + j]
      }
      energy = Math.sqrt(energy / windowSize)
      
      if (energy > previousEnergy * (1 + beatThreshold) && beats.length === 0 || 
          (beats.length > 0 && (i / sampleRate) - beats[beats.length - 1] > 0.3)) {
        beats.push(i / sampleRate)
      }
      
      previousEnergy = energy
    }
    
    // Estimate tempo from beat intervals
    let tempo = 120 // Default
    if (beats.length > 1) {
      const intervals = beats.slice(1).map((beat, i) => beat - beats[i])
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
      tempo = Math.round(60 / avgInterval)
    }
    
    return {
      beats,
      tempo,
      confidence: Math.min(beats.length / 10, 1),
      timeSignature: { numerator: 4, denominator: 4 }
    }
  }

  const renderWaveform = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !waveformData) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvas.getBoundingClientRect()
    canvas.width = width * window.devicePixelRatio
    canvas.height = height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas
    ctx.fillStyle = '#111827'
    ctx.fillRect(0, 0, width, height)

    // Draw waveform
    const peaks = waveformData.peaks
    const barWidth = width / peaks.length
    const centerY = height / 2

    for (let i = 0; i < peaks.length; i++) {
      const barHeight = peaks[i] * centerY * 0.8
      const x = i * barWidth
      
      // Color based on playback position
      const progress = currentTime / duration
      const isPlayed = i / peaks.length < progress
      
      ctx.fillStyle = isPlayed ? '#f97316' : '#374151'
      ctx.fillRect(x, centerY - barHeight, barWidth - 1, barHeight * 2)
    }

    // Draw beat markers
    if (beatData) {
      ctx.strokeStyle = '#10b981'
      ctx.lineWidth = 2
      
      beatData.beats.forEach(beatTime => {
        const x = (beatTime / duration) * width
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      })
    }

    // Draw playhead
    const playheadX = (currentTime / duration) * width
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(playheadX, 0)
    ctx.lineTo(playheadX, height)
    ctx.stroke()

    // Draw frequency bars if playing
    if (isPlaying && frequencyData) {
      const barCount = 32
      const barWidth = width / barCount
      
      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * frequencyData.length)
        const barHeight = (frequencyData[dataIndex] / 255) * height * 0.3
        
        ctx.fillStyle = `rgba(249, 115, 22, ${frequencyData[dataIndex] / 255})`
        ctx.fillRect(i * barWidth, height - barHeight, barWidth - 2, barHeight)
      }
    }
  }, [waveformData, beatData, currentTime, duration, isPlaying, frequencyData])

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !waveformData || !onSeek) return

    const rect = canvasRef.current.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const clickRatio = clickX / rect.width
    const seekTime = clickRatio * duration

    onSeek(seekTime)
  }, [waveformData, duration, onSeek])

  const handleResize = useCallback(() => {
    if (canvasRef.current && rendererRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      canvasRef.current.width = rect.width * window.devicePixelRatio
      canvasRef.current.height = rect.height * window.devicePixelRatio
      
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      }
      
      rendererRef.current.resize(rect.width, rect.height)
    }
  }, [])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getEnergyLevel = () => {
    if (!frequencyData) return 0
    const sum = Array.from(frequencyData).reduce((a, b) => a + b, 0)
    return Math.round((sum / (frequencyData.length * 255)) * 100)
  }

  const getCurrentBeat = () => {
    if (!beatData || beatData.beats.length === 0) return null
    
    const closestBeat = beatData.beats.reduce((prev, curr) => {
      return Math.abs(curr - currentTime) < Math.abs(prev - currentTime) ? curr : prev
    })
    
    const beatIndex = beatData.beats.indexOf(closestBeat) + 1
    return beatIndex
  }

  return (
    <Card className={`bg-black border-gray-700 overflow-hidden ${className}`}>
      <div className="p-4">
        {/* Header with audio info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Music className="text-orange-400" size={20} />
            <div>
              <div className="text-white font-medium">Waveform Analysis</div>
              <div className="text-gray-400 text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {beatData && (
              <Badge className="bg-green-600 text-white">
                <Activity className="mr-1" size={12} />
                {beatData.tempo.toFixed(0)} BPM
              </Badge>
            )}
            {frequencyData && (
              <Badge className="bg-blue-600 text-white">
                <Zap className="mr-1" size={12} />
                Energy: {getEnergyLevel()}%
              </Badge>
            )}
            {getCurrentBeat() && (
              <Badge className="bg-purple-600 text-white">
                Beat: {getCurrentBeat()}
              </Badge>
            )}
          </div>
        </div>

        {/* Canvas container */}
        <div className="relative bg-gray-900 rounded-lg overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
              <div className="text-white">Analyzing audio...</div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
              <div className="text-red-400">{error}</div>
            </div>
          )}

          <canvas
            ref={canvasRef}
            className="w-full h-32 cursor-pointer"
            onClick={handleCanvasClick}
            style={{ 
              width: '100%', 
              height: '128px',
              imageRendering: 'pixelated'
            }}
          />
          
          {/* Overlay information */}
          {waveformData && (
            <div className="absolute bottom-2 left-2 right-2 flex justify-between text-xs text-gray-400">
              <span>Samples: {waveformData.length.toLocaleString()}</span>
              <span>Sample Rate: {waveformData.sampleRate.toLocaleString()}Hz</span>
              {beatData && (
                <span>Confidence: {(beatData.confidence * 100).toFixed(1)}%</span>
              )}
            </div>
          )}
        </div>

        {/* Beat detection info */}
        {beatData && (
          <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
            <div className="bg-gray-800 p-2 rounded text-center">
              <div className="text-gray-400">Tempo</div>
              <div className="text-white font-semibold">{beatData.tempo.toFixed(1)} BPM</div>
            </div>
            <div className="bg-gray-800 p-2 rounded text-center">
              <div className="text-gray-400">Beats</div>
              <div className="text-white font-semibold">{beatData.beats.length}</div>
            </div>
            <div className="bg-gray-800 p-2 rounded text-center">
              <div className="text-gray-400">Time Sig</div>
              <div className="text-white font-semibold">
                {beatData.timeSignature.numerator}/{beatData.timeSignature.denominator}
              </div>
            </div>
            <div className="bg-gray-800 p-2 rounded text-center">
              <div className="text-gray-400">Confidence</div>
              <div className="text-white font-semibold">
                {(beatData.confidence * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

export default WaveformCanvas