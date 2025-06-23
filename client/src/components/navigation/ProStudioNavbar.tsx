'use client'

import React, { useState } from 'react'
import { Link, useLocation } from 'wouter'
import { 
  Music, Disc3, Video, Palette, ShoppingBag, Users, 
  Settings, Brain, Mic, Headphones, Radio, MonitorSpeaker,
  Zap, Activity, Eye, TrendingUp, Menu, X, Home,
  Wand2, Sparkles, Layers, Grid3x3, PlayCircle,
  Sliders, Gamepad2, Cpu, Cloud, Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  category: string
  description: string
  badge?: string
}

export function ProStudioNavbar() {
  const [location] = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigationItems: NavItem[] = [
    // Core Studios
    {
      label: 'Home Studio',
      href: '/',
      icon: <Home className="w-4 h-4" />,
      category: 'Core',
      description: 'Main dashboard and overview'
    },
    {
      label: 'Music Studio',
      href: '/studio',
      icon: <Music className="w-4 h-4" />,
      category: 'Core',
      description: 'Professional music production'
    },
    
    // DJ & Performance
    {
      label: 'DJ Studio',
      href: '/studio/dj',
      icon: <Disc3 className="w-4 h-4" />,
      category: 'DJ & Performance',
      description: 'Professional DJ controller with streaming',
      badge: 'PRO'
    },
    {
      label: 'MPC Studio',
      href: '/mpc',
      icon: <Grid3x3 className="w-4 h-4" />,
      category: 'DJ & Performance',
      description: 'Beat production and sampling'
    },
    {
      label: 'MIDI Controller',
      href: '/midi',
      icon: <Gamepad2 className="w-4 h-4" />,
      category: 'DJ & Performance',
      description: 'Hardware controller integration'
    },
    
    // Video & Visual
    {
      label: 'Video Studio',
      href: '/video',
      icon: <Video className="w-4 h-4" />,
      category: 'Video & Visual',
      description: 'AI-powered video editing',
      badge: 'AI'
    },
    {
      label: 'Visual Arts',
      href: '/visual',
      icon: <Palette className="w-4 h-4" />,
      category: 'Video & Visual',
      description: 'Digital art creation suite'
    },
    {
      label: 'Motion Capture',
      href: '/motion',
      icon: <Activity className="w-4 h-4" />,
      category: 'Video & Visual',
      description: 'Real-time performance capture',
      badge: 'AI'
    },
    
    // Collaboration & Business
    {
      label: 'Collaborative Studio',
      href: '/collaborate',
      icon: <Users className="w-4 h-4" />,
      category: 'Collaboration',
      description: 'Real-time multi-user editing'
    },
    {
      label: 'NFT Marketplace',
      href: '/nft',
      icon: <ShoppingBag className="w-4 h-4" />,
      category: 'Collaboration',
      description: 'Blockchain art marketplace'
    },
    {
      label: 'Business Dashboard',
      href: '/business',
      icon: <TrendingUp className="w-4 h-4" />,
      category: 'Business',
      description: 'Analytics and marketing AI',
      badge: 'AI'
    },
    
    // Education & Learning
    {
      label: 'Curriculum',
      href: '/curriculum',
      icon: <Brain className="w-4 h-4" />,
      category: 'Education',
      description: 'Adaptive learning system'
    },
    {
      label: 'Lesson Studio',
      href: '/lesson',
      icon: <PlayCircle className="w-4 h-4" />,
      category: 'Education',
      description: 'Interactive music lessons'
    },
    {
      label: 'Teacher Portal',
      href: '/teacher',
      icon: <Mic className="w-4 h-4" />,
      category: 'Education',
      description: 'Live streaming education'
    },
    {
      label: 'Student Dashboard',
      href: '/student',
      icon: <Headphones className="w-4 h-4" />,
      category: 'Education',
      description: 'Student progress tracking'
    }
  ]

  const categories = ['Core', 'DJ & Performance', 'Video & Visual', 'Collaboration', 'Business', 'Education']

  const isActiveRoute = (href: string) => {
    if (href === '/' && location === '/') return true
    if (href !== '/' && location.startsWith(href)) return true
    return false
  }

  const getItemsByCategory = (category: string) => {
    return navigationItems.filter(item => item.category === category)
  }

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 border-b border-purple-500/20 sticky top-0 z-50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent">
                  ProStudio
                </h1>
                <p className="text-xs text-gray-400">AI-Powered Creation Suite</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {categories.map(category => (
              <div key={category} className="relative group">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-purple-800/50">
                  {category}
                  <Layers className="w-3 h-3 ml-1" />
                </Button>
                
                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 mt-1 w-64 bg-gray-900/95 border border-purple-500/20 rounded-lg backdrop-blur-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2">
                    <div className="text-purple-400 text-sm font-medium mb-2 px-2">{category}</div>
                    {getItemsByCategory(category).map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center space-x-3 p-2 rounded hover:bg-purple-800/50 transition-colors ${
                          isActiveRoute(item.href) ? 'bg-purple-600/50' : ''
                        }`}
                      >
                        <div className={`p-1 rounded ${isActiveRoute(item.href) 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-700 text-gray-300'}`}>
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-200">{item.label}</span>
                            {item.badge && (
                              <Badge variant="secondary" className="text-xs bg-purple-600 text-white">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">{item.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="outline" size="sm" className="border-purple-500/50 text-purple-300 hover:bg-purple-800/50">
              <Eye className="w-4 h-4 mr-1" />
              Live
            </Button>
            <Button variant="outline" size="sm" className="border-orange-500/50 text-orange-300 hover:bg-orange-800/50">
              <Wand2 className="w-4 h-4 mr-1" />
              AI
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700">
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-purple-500/20">
            <div className="grid grid-cols-2 gap-2">
              {navigationItems.slice(0, 8).map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
                    isActiveRoute(item.href)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-purple-800/50'
                  }`}
                >
                  {item.icon}
                  <div>
                    <div className="text-sm font-medium">{item.label}</div>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            
            {navigationItems.length > 8 && (
              <div className="mt-4">
                <p className="text-xs text-gray-400 mb-2">More Studios</p>
                <div className="space-y-1">
                  {navigationItems.slice(8).map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-2 p-2 rounded transition-colors ${
                        isActiveRoute(item.href)
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-300 hover:bg-purple-800/50'
                      }`}
                    >
                      {item.icon}
                      <span className="text-sm">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}