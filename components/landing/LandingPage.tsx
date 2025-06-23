'use client'

import React from 'react'
import Link from 'next/link'
import { Music, Video, Cpu, Brain, Shield, Check, Star, Users, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function LandingPage() {
  const plans = [
    {
      id: 'basic',
      name: 'Basic School',
      price: 2500,
      studentPrice: 15,
      maxStudents: 50,
      popular: false,
      features: [
        'Up to 50 students',
        'Basic AI music generation',
        'Standard video tools',
        'Email support',
        'Basic analytics',
        'Core curriculum library'
      ]
    },
    {
      id: 'professional',
      name: 'Professional School',
      price: 8500,
      studentPrice: 12,
      maxStudents: 200,
      popular: true,
      features: [
        'Up to 200 students',
        'Advanced AI engines',
        'Motion capture technology',
        'Priority support',
        'Advanced analytics',
        'Custom curriculum builder',
        'White-label options'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise School',
      price: 25000,
      studentPrice: 8,
      maxStudents: 999999,
      popular: false,
      features: [
        'Unlimited students',
        'All 15 AI engines',
        'Full white-label platform',
        'Dedicated support',
        'Custom integrations',
        'Advanced business analytics',
        'Revenue sharing program'
      ]
    }
  ]

  const aiEngines = [
    {
      icon: Music,
      title: 'Neural Audio Synthesis',
      description: 'AI-powered music generation with voice cloning and stem separation'
    },
    {
      icon: Video,
      title: 'Cinematic Video AI',
      description: 'Professional video creation with real-time style transfer'
    },
    {
      icon: Cpu,
      title: 'Motion Capture',
      description: 'Real-time performance tracking and visual effects'
    },
    {
      icon: Brain,
      title: 'Adaptive Learning',
      description: 'Biometric analysis with personalized curriculum generation'
    }
  ]

  const stats = [
    { label: 'Schools Served', value: '50+', icon: Users },
    { label: 'Students Educated', value: '10K+', icon: TrendingUp },
    { label: 'AI Engines', value: '15', icon: Cpu },
    { label: 'Success Rate', value: '98%', icon: Star }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <div className="relative px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl text-center">
          <div className="flex items-center justify-center mb-8">
            <Music className="text-orange-400 mr-4" size={64} />
            <h1 className="text-5xl lg:text-7xl font-bold text-white">ProStudio</h1>
          </div>
          
          <h2 className="text-2xl lg:text-4xl text-gray-300 mb-6 max-w-4xl mx-auto">
            Revolutionary AI-Powered Multimedia Creation Platform
          </h2>
          
          <p className="text-lg lg:text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
            15 cutting-edge self-hosted AI engines delivering professional-grade music production, 
            video creation, and immersive media capabilities that surpass industry standards.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/auth/signin">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3">
                Start Free Trial
              </Button>
            </Link>
            <Link href="#pricing">
              <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3">
                View Pricing
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="text-orange-400 mx-auto mb-2" size={32} />
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Engines Section */}
      <div className="px-6 py-16 bg-gray-800/30">
        <div className="mx-auto max-w-7xl">
          <h3 className="text-3xl lg:text-4xl font-bold text-white text-center mb-12">
            Cutting-Edge AI Technology Stack
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aiEngines.map((engine, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-700 hover:border-orange-500/50 transition-colors">
                <CardHeader className="text-center">
                  <engine.icon className="text-orange-400 mx-auto mb-4" size={48} />
                  <CardTitle className="text-white text-lg">{engine.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400 text-center">
                    {engine.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <h3 className="text-3xl lg:text-4xl font-bold text-white text-center mb-4">
            Enterprise Licensing Plans
          </h3>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Scalable solutions for music schools, from startup institutions to global franchises
          </p>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative bg-gray-900/70 border-gray-700 ${
                  plan.popular ? 'ring-2 ring-orange-400 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-orange-500 text-white px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-orange-400 mb-2">
                    ${plan.price.toLocaleString()}
                    <span className="text-lg text-gray-400">/year</span>
                  </div>
                  <div className="text-gray-400">
                    + ${plan.studentPrice}/student/month
                  </div>
                  <CardDescription className="text-gray-300">
                    {plan.maxStudents === 999999 ? 'Unlimited students' : `Up to ${plan.maxStudents} students`}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-300">
                        <Check className="text-green-400 mr-3 flex-shrink-0" size={16} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Link href="/auth/signin">
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-orange-600 hover:bg-orange-700' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      } text-white`}
                    >
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Enterprise Features */}
      <div className="px-6 py-16 bg-gray-800/30">
        <div className="mx-auto max-w-7xl">
          <h3 className="text-3xl lg:text-4xl font-bold text-white text-center mb-12">
            Enterprise-Grade Platform
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <Shield className="text-orange-400 mb-4" size={32} />
                <CardTitle className="text-white">Self-Hosted Security</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  Complete data ownership with enterprise-grade security. No external dependencies 
                  means your creative content stays protected within your infrastructure.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <TrendingUp className="text-orange-400 mb-4" size={32} />
                <CardTitle className="text-white">Business Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  Advanced analytics and reporting for school administrators. Track student progress, 
                  engagement metrics, and ROI with comprehensive business intelligence.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <Users className="text-orange-400 mb-4" size={32} />
                <CardTitle className="text-white">White-Label Solutions</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  Complete rebranding capabilities for franchise operations. Custom domain, 
                  branding, and configuration to match your school's identity perfectly.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Transform Music Education?
          </h3>
          <p className="text-lg text-gray-400 mb-8">
            Join 50+ schools already using ProStudio to deliver cutting-edge music education 
            with AI-powered tools that engage and inspire students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signin">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4">
                Start Your Free Trial
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4">
                Request Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}