import { useState } from 'react';
import { Link } from 'wouter';
import { User, Lock, Mail, Eye, EyeOff, Music, Video, Palette, Headphones } from 'lucide-react';

export default function UserLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful login - redirect to DJ studio for users
    window.location.href = '/dj';
  };

  const features = [
    { icon: Music, title: 'DJ Studio', description: 'Professional mixing with voting system' },
    { icon: Video, title: 'Video Creation', description: 'AI-powered editing tools' },
    { icon: Palette, title: 'Visual Arts', description: 'Advanced image creation' },
    { icon: Headphones, title: 'Audio Production', description: 'Neural synthesis engines' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 text-white">
      <div className="flex min-h-screen">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex lg:w-1/2 bg-black/20 backdrop-blur-lg p-12 flex-col justify-center">
          <div className="max-w-md">
            <div className="flex items-center space-x-3 mb-8">
              <img 
                src="/assets/artist-tech-logo.jpeg" 
                alt="Artist Tech" 
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold">Artist Tech</h1>
                <p className="text-white/60">Creative Studio Platform</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-6">Welcome to the Future of Creativity</h2>
            <p className="text-white/70 mb-8">
              Join thousands of creators using our 15 AI-powered engines for music production, 
              video editing, and visual arts creation.
            </p>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
                  <feature.icon className="w-8 h-8 text-purple-400" />
                  <div>
                    <h3 className="font-bold">{feature.title}</h3>
                    <p className="text-white/60 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-green-500/20 rounded-lg border border-green-500/30">
              <p className="text-green-400 font-bold text-sm">🎯 Demo Credentials</p>
              <p className="text-white/70 text-xs">Email: user@artisttech.com</p>
              <p className="text-white/70 text-xs">Password: demo123</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
              <img 
                src="/assets/artist-tech-logo.jpeg" 
                alt="Artist Tech" 
                className="w-10 h-10 rounded-lg object-cover"
              />
              <span className="text-xl font-bold">Artist Tech</span>
            </div>

            <div className="bg-black/30 rounded-lg p-8 border border-white/20">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">
                  {isLogin ? 'Welcome Back' : 'Join Artist Tech'}
                </h2>
                <p className="text-white/60">
                  {isLogin ? 'Sign in to access your creative studio' : 'Create your account to get started'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none transition-colors"
                        placeholder="Enter your full name"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500" />
                      <span className="ml-2 text-sm text-white/70">Remember me</span>
                    </label>
                    <button type="button" className="text-sm text-purple-400 hover:text-purple-300">
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
                >
                  {isLogin ? 'Sign In' : 'Create Account'}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-black/30 text-white/60">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="bg-white/10 border border-white/20 text-white py-3 px-4 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Google
                  </button>
                  <button
                    type="button"
                    className="bg-white/10 border border-white/20 text-white py-3 px-4 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Discord
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-white/60">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-1 text-purple-400 hover:text-purple-300 font-medium"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-white/20">
                <Link href="/">
                  <button className="w-full bg-white/10 text-white py-2 px-4 rounded-lg hover:bg-white/20 transition-colors">
                    Back to Home
                  </button>
                </Link>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-white/50">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}