import { useState } from 'react';
import { Link } from 'wouter';
import { User, Lock, Mail, Eye, EyeOff, Shield, Crown, Settings, BarChart3 } from 'lucide-react';

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    // Admin authentication check
    if (email === 'admin@artisttech.com' && password === 'admin2024!') {
      // Successful admin login - redirect to admin dashboard
      window.location.href = '/admin';
    } else {
      setLoginError('Invalid admin credentials. Please check your email and password.');
    }
  };

  const adminFeatures = [
    { icon: BarChart3, title: 'Revenue Analytics', description: 'Real-time platform revenue tracking' },
    { icon: Settings, title: 'System Control', description: 'Manage all 15 AI engines' },
    { icon: User, title: 'User Management', description: 'Control user access and permissions' },
    { icon: Shield, title: 'Security Center', description: 'Monitor platform security' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900/40 to-blue-900 text-white">
      <div className="flex min-h-screen">
        {/* Left Side - Admin Features */}
        <div className="hidden lg:flex lg:w-1/2 bg-black/20 backdrop-blur-lg p-12 flex-col justify-center">
          <div className="max-w-md">
            <div className="flex items-center space-x-3 mb-8">
              <img 
                src="/assets/artist-tech-logo.jpeg" 
                alt="Artist Tech" 
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold">Artist Tech Admin</h1>
                <p className="text-white/60">Platform Control Center</p>
              </div>
            </div>

            <div className="bg-red-500/20 rounded-lg p-6 border border-red-500/30 mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Crown className="w-8 h-8 text-yellow-400" />
                <div>
                  <h2 className="text-xl font-bold text-red-400">ADMIN ACCESS ONLY</h2>
                  <p className="text-white/60">Full platform control and monitoring</p>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-6">Complete Platform Control</h2>
            <p className="text-white/70 mb-8">
              Access real-time analytics, manage all users, control AI engines, 
              and monitor revenue across the entire Artist Tech platform.
            </p>

            <div className="space-y-4">
              {adminFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
                  <feature.icon className="w-8 h-8 text-red-400" />
                  <div>
                    <h3 className="font-bold">{feature.title}</h3>
                    <p className="text-white/60 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
              <p className="text-yellow-400 font-bold text-sm">🔑 Admin Credentials</p>
              <p className="text-white/70 text-xs">Email: admin@artisttech.com</p>
              <p className="text-white/70 text-xs">Password: admin2024!</p>
            </div>
          </div>
        </div>

        {/* Right Side - Admin Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
              <img 
                src="/assets/artist-tech-logo.jpeg" 
                alt="Artist Tech" 
                className="w-10 h-10 rounded-lg object-cover"
              />
              <span className="text-xl font-bold">Artist Tech Admin</span>
            </div>

            <div className="bg-black/30 rounded-lg p-8 border border-red-500/30">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Shield className="w-8 h-8 text-red-400" />
                  <Crown className="w-8 h-8 text-yellow-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-red-400">Admin Portal</h2>
                <p className="text-white/60">
                  Secure access to platform administration
                </p>
              </div>

              {loginError && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{loginError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Admin Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-red-500 focus:outline-none transition-colors"
                      placeholder="admin@artisttech.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Admin Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-red-500 focus:outline-none transition-colors"
                      placeholder="Enter admin password"
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

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105"
                >
                  Access Admin Dashboard
                </button>

                <div className="text-center">
                  <p className="text-white/60 text-sm mb-4">
                    This portal is restricted to authorized administrators only
                  </p>
                  
                  <div className="flex space-x-4">
                    <Link href="/login">
                      <button
                        type="button"
                        className="flex-1 bg-white/10 border border-white/20 text-white py-2 px-4 rounded-lg hover:bg-white/20 transition-colors"
                      >
                        User Login
                      </button>
                    </Link>
                    <Link href="/">
                      <button
                        type="button"
                        className="flex-1 bg-white/10 border border-white/20 text-white py-2 px-4 rounded-lg hover:bg-white/20 transition-colors"
                      >
                        Back to Home
                      </button>
                    </Link>
                  </div>
                </div>
              </form>
            </div>

            <div className="mt-6 text-center text-xs text-white/50">
              All admin access is logged and monitored for security
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}