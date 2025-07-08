
import { Link } from 'wouter';
import { 
  Brain, TrendingUp, DollarSign, Users, BarChart3, Briefcase, 
  Target, Zap, Crown, Building, Headphones, Music, Star
} from 'lucide-react';

export default function CareerHub() {
  const careerTools = [
    {
      id: "ai-career-manager",
      name: "AI Career Manager",
      description: "Complete AI career automation with 4 specialized agents",
      features: ["Marketing AI Agent", "Revenue AI Agent", "Booking AI Agent", "Legal AI Agent"],
      icon: Brain,
      color: "from-green-600 to-blue-600",
      route: "/ai-career-manager",
      badge: "MAIN SUITE",
      status: "active"
    },
    {
      id: "business-dashboard",
      name: "Business Intelligence",
      description: "Advanced analytics, ROI tracking, market insights",
      features: ["Revenue Analytics", "Campaign Performance", "Audience Insights", "AI Recommendations"],
      icon: BarChart3,
      color: "from-purple-600 to-pink-600",
      route: "/business-dashboard",
      badge: "ANALYTICS",
      status: "active"
    },
    {
      id: "producer-revenue",
      name: "Producer Revenue Center",
      description: "Job opportunities, rate optimization, marketplace connections",
      features: ["Job Board", "Rate AI", "Revenue Streams", "Business Plan Generator"],
      icon: Briefcase,
      color: "from-orange-600 to-red-600",
      route: "/producer-revenue-dashboard",
      badge: "PRODUCERS",
      status: "active"
    },
    {
      id: "ai-career-dashboard",
      name: "Career Analytics",
      description: "Quick overview dashboard with key metrics",
      features: ["Career Score", "Growth Tracking", "Goal Progress", "Quick Actions"],
      icon: TrendingUp,
      color: "from-blue-600 to-cyan-600",
      route: "/ai-career-dashboard",
      badge: "OVERVIEW",
      status: "active"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-black via-gray-900 to-black border-b-2 border-green-500/30 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/admin" className="hover:scale-110 transition-transform">
                <img 
                  src="/assets/artist-tech-logo.jpeg" 
                  alt="Artist Tech" 
                  className="w-12 h-12 rounded-lg object-cover border border-green-500/50"
                />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-green-500">AI CAREER MANAGEMENT HUB</h1>
                <p className="text-gray-400">Complete suite of AI-powered career advancement tools</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-green-500/20 border border-green-500/30 px-4 py-2 rounded flex items-center space-x-2">
                <Brain className="w-5 h-5 text-green-400 animate-pulse" />
                <span className="text-green-400 font-bold">4 AI SYSTEMS ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Main Career Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {careerTools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <Link key={tool.id} href={tool.route} className="group">
                <div className={`bg-gradient-to-br ${tool.color}/20 border-2 border-transparent hover:border-white/30 rounded-2xl p-8 transition-all transform hover:scale-105 cursor-pointer relative overflow-hidden`}>
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      tool.badge === 'MAIN SUITE' ? 'bg-green-500 text-black' :
                      tool.badge === 'ANALYTICS' ? 'bg-purple-500 text-white' :
                      tool.badge === 'PRODUCERS' ? 'bg-orange-500 text-black' :
                      'bg-blue-500 text-white'
                    }`}>
                      {tool.badge}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {tool.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2 mb-6">
                    {tool.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Launch Button */}
                  <div className={`w-full bg-gradient-to-r ${tool.color} rounded-lg py-3 text-center font-bold text-white group-hover:shadow-lg transition-all`}>
                    Launch {tool.name}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
            <Brain className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">4</div>
            <div className="text-gray-400 text-sm">AI Agents</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
            <Target className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">12</div>
            <div className="text-gray-400 text-sm">Career Tools</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
            <DollarSign className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">8</div>
            <div className="text-gray-400 text-sm">Revenue Streams</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
            <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">24/7</div>
            <div className="text-gray-400 text-sm">AI Monitoring</div>
          </div>
        </div>

        {/* AI Agent Overview */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Zap className="w-6 h-6 text-yellow-400 mr-3" />
            AI Agent Overview
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="font-bold text-white mb-2">Marketing Agent</h4>
              <p className="text-gray-400 text-sm">Social media automation, content creation, trend analysis</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="font-bold text-white mb-2">Revenue Agent</h4>
              <p className="text-gray-400 text-sm">Income optimization, stream analysis, pricing strategies</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="font-bold text-white mb-2">Booking Agent</h4>
              <p className="text-gray-400 text-sm">Venue matching, tour planning, contract negotiations</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Building className="w-6 h-6 text-orange-400" />
              </div>
              <h4 className="font-bold text-white mb-2">Legal Agent</h4>
              <p className="text-gray-400 text-sm">Contract review, rights management, compliance monitoring</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
