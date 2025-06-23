'use client'

import React, { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Music, Shield, AlertCircle, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export default function SignInPage() {
  const [email, setEmail] = useState('admin@prostudio.ai')
  const [password, setPassword] = useState('ProStudio2025!')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const demoAccounts = [
    { email: 'admin@prostudio.ai', password: 'ProStudio2025!', type: 'Admin', color: 'bg-red-600' },
    { email: 'teacher@prostudio.ai', password: 'Teacher2025!', type: 'Teacher', color: 'bg-blue-600' },
    { email: 'student@prostudio.ai', password: 'Student2025!', type: 'Student', color: 'bg-green-600' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid credentials. Please try again.')
      } else {
        router.push('/')
      }
    } catch (err) {
      setError('Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Music className="text-orange-400 mr-3" size={48} />
            <h1 className="text-3xl font-bold text-white">ProStudio</h1>
          </div>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        {/* Demo Accounts */}
        <Card className="bg-blue-950/20 border-blue-500/50 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-400 text-sm flex items-center">
              <Shield size={16} className="mr-2" />
              Demo Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoAccounts.map((account, index) => (
              <div key={index} className="bg-gray-900/50 p-3 rounded">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={`${account.color} text-white text-xs`}>
                    {account.type}
                  </Badge>
                  <Button 
                    onClick={() => handleDemoLogin(account.email, account.password)}
                    variant="outline" 
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 text-xs"
                  >
                    Use Account
                  </Button>
                </div>
                <div className="text-xs text-gray-400 font-mono">
                  {account.email}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Sign In Form */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Sign In</CardTitle>
            <CardDescription>
              Access your ProStudio workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="bg-red-950/50 border border-red-500/50 rounded p-3">
                  <div className="text-red-400 text-sm flex items-center">
                    <AlertCircle size={16} className="mr-2" />
                    {error}
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="text-orange-400 hover:text-orange-300">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}