'use client'

import React, { useState } from 'react'
import { 
  Music, Video, Cpu, Brain, Settings, LogOut, Plus, 
  Play, Pause, BarChart3, Users, Zap, Mic, Headphones,
  Sliders, Gamepad2, Camera, Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'

export function ProStudioDashboard() {
  const [activeStudio, setActiveStudio] = useState<string | null>(null)
  
  // Demo session - no authentication required
  const session = {
    user: {
      name: 'Demo User',
      email: 'demo@prostudio.com',
      userType: 'student',
      image: null
    }
  }

  const studioTools = [
    {
      id: 'mpc',
      title: 'MPC Beats Studio',
      description: 'Professional beat making with 16-pad drum machine',
      icon: Gamepad2,
      color: 'bg-red-600',
      href: '/studio/mpc'
    },
    {
      id: 'dj',
      title: 'Virtual DJ Suite',
      description: 'Professional DJ mixing with dual decks',
      icon: Headphones,
      color: 'bg-blue-600',
      href: '/studio/dj'
    },
    {
      id: 'video',
      title: 'AI Video Studio',
      description: 'Cinematic video creation with AI enhancement',
      icon: Video,
      color: 'bg-purple-600',
      href: '/studio/video'
    },
    {
      id: 'midi',
      title: 'MIDI Controller',
      description: 'Hardware integration with 8+ controller brands',
      icon: Sliders,
      color: 'bg-green-600',
      href: '/studio/midi'
    },
    {
      id: 'neural',
      title: 'Neural Audio',
      description: 'AI music generation and voice synthesis',
      icon: Brain,
      color: 'bg-orange-600',
      href: '/studio/neural'
    },
    {
      id: 'motion',
      title: 'Motion Capture',
      description: 'Real-time performance tracking',
      icon: Camera,
      color: 'bg-pink-600',
      href: '/studio/motion'
    }
  ]

  const aiEngines = [
    { name: 'Neural Audio Synthesis', status: 'active', usage: 85 },
    { name: 'Motion Capture AI', status: 'active', usage: 72 },
    { name: 'Video Generation AI', status: 'active', usage: 91 },
    { name: 'Adaptive Learning', status: 'active', usage: 67 },
    { name: 'Real-time Processing', status: 'active', usage: 78 }
  ]

  const recentProjects = [
    { name: 'Hip Hop Beat Pack', type: 'MPC', modified: '2 hours ago' },
    { name: 'Summer Mix 2025', type: 'DJ', modified: '1 day ago' },
    { name: 'AI Music Video', type: 'Video', modified: '3 days ago' },
    { name: 'Live Performance', type: 'Motion', modified: '1 week ago' }
  ]

  const userTypeDisplays = {
    admin: { title: 'Admin Dashboard', badge: 'Administrator', color: 'bg-red-600' },
    teacher: { title: 'Teacher Portal', badge: 'Educator', color: 'bg-blue-600' },
    student: { title: 'Student Studio', badge: 'Creator', color: 'bg-green-600' }
  }

  const currentDisplay = userTypeDisplays[session?.user?.userType as keyof typeof userTypeDisplays] || userTypeDisplays.student

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Music className="text-orange-400" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-white">ProStudio - DIRECT ACCESS</h1>
                <p className="text-gray-400 text-sm">{currentDisplay.title} - NO SUBSCRIPTION REQUIRED</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge className={`${currentDisplay.color} text-white`}>
                {currentDisplay.badge}
              </Badge>
              <span className="text-gray-300">{session?.user?.name}</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.reload()}
                className="text-gray-400 hover:text-white"
              >
                <LogOut size={16} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="studio" className="space-y-8">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="studio" className="data-[state=active]:bg-orange-600">
              <Sparkles className="mr-2" size={16} />
              Studio
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-orange-600">
              <Music className="mr-2" size={16} />
              Projects
            </TabsTrigger>
            <TabsTrigger value="ai-engines" className="data-[state=active]:bg-orange-600">
              <Brain className="mr-2" size={16} />
              AI Engines
            </TabsTrigger>
            {session?.user?.userType === 'admin' && (
              <TabsTrigger value="analytics" className="data-[state=active]:bg-orange-600">
                <BarChart3 className="mr-2" size={16} />
                Analytics
              </TabsTrigger>
            )}
          </TabsList>

          {/* Studio Tab */}
          <TabsContent value="studio" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Create & Produce</h2>
              <p className="text-gray-400 mb-8">Access professional-grade tools powered by 15 AI engines</p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studioTools.map((tool) => (
                  <Link key={tool.id} href={tool.href}>
                    <Card className="bg-gray-900/50 border-gray-700 hover:border-orange-500/50 transition-all duration-300 hover:scale-105 cursor-pointer">
                      <CardHeader>
                        <div className={`${tool.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                          <tool.icon className="text-white" size={24} />
                        </div>
                        <CardTitle className="text-white">{tool.title}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {tool.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Your Projects</h2>
                <p className="text-gray-400">Manage and collaborate on your creative works</p>
              </div>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus className="mr-2" size={16} />
                New Project
              </Button>
            </div>
            
            <div className="grid gap-4">
              {recentProjects.map((project, index) => (
                <Card key={index} className="bg-gray-900/50 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-semibold">{project.name}</h3>
                        <p className="text-gray-400 text-sm">Modified {project.modified}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="border-gray-600 text-gray-300">
                          {project.type}
                        </Badge>
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                          <Play size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* AI Engines Tab */}
          <TabsContent value="ai-engines" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">AI Engine Status</h2>
              <p className="text-gray-400 mb-8">Monitor your self-hosted AI capabilities</p>
              
              <div className="grid gap-4">
                {aiEngines.map((engine, index) => (
                  <Card key={index} className="bg-gray-900/50 border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <div>
                            <h3 className="text-white font-semibold">{engine.name}</h3>
                            <p className="text-gray-400 text-sm">Status: {engine.status}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-semibold">{engine.usage}%</div>
                          <div className="text-gray-400 text-sm">CPU Usage</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab (Admin Only) */}
          {session?.user?.userType === 'admin' && (
            <TabsContent value="analytics" className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Business Analytics</h2>
                <p className="text-gray-400 mb-8">Enterprise insights and performance metrics</p>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-gray-900/50 border-gray-700">
                    <CardContent className="p-6 text-center">
                      <Users className="text-orange-400 mx-auto mb-2" size={32} />
                      <div className="text-2xl font-bold text-white">1,247</div>
                      <div className="text-gray-400">Active Students</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-900/50 border-gray-700">
                    <CardContent className="p-6 text-center">
                      <Zap className="text-green-400 mx-auto mb-2" size={32} />
                      <div className="text-2xl font-bold text-white">98.5%</div>
                      <div className="text-gray-400">System Uptime</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-900/50 border-gray-700">
                    <CardContent className="p-6 text-center">
                      <BarChart3 className="text-blue-400 mx-auto mb-2" size={32} />
                      <div className="text-2xl font-bold text-white">$47.2K</div>
                      <div className="text-gray-400">Monthly Revenue</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-900/50 border-gray-700">
                    <CardContent className="p-6 text-center">
                      <Brain className="text-purple-400 mx-auto mb-2" size={32} />
                      <div className="text-2xl font-bold text-white">15</div>
                      <div className="text-gray-400">AI Engines Active</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}