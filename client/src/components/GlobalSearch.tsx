import { useState, useEffect } from 'react';
import { Search, X, Filter, Music, Video, Users, Palette, Mic, BarChart3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'studio' | 'project' | 'artist' | 'collaboration' | 'tutorial';
  category: string;
  route?: string;
  tags: string[];
  relevanceScore: number;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  const searchCategories = [
    { id: 'all', label: 'All', icon: Search },
    { id: 'studios', label: 'Studios', icon: Music },
    { id: 'projects', label: 'Projects', icon: Video },
    { id: 'artists', label: 'Artists', icon: Users },
    { id: 'tutorials', label: 'Tutorials', icon: BarChart3 }
  ];

  // Mock search data - replace with real API
  const searchData: SearchResult[] = [
    {
      id: '1',
      title: 'Music Studio Pro',
      description: 'Professional DAW with AI composition, unlimited tracks, VST support',
      type: 'studio',
      category: 'creation',
      route: '/music-studio',
      tags: ['music', 'daw', 'professional', 'ai', 'composition'],
      relevanceScore: 0.95
    },
    {
      id: '2',
      title: 'Ultimate DJ Studio',
      description: 'Real-time stem separation, harmonic mixing, crowd analytics',
      type: 'studio',
      category: 'performance',
      route: '/dj-studio',
      tags: ['dj', 'mixing', 'live', 'performance', 'harmonic'],
      relevanceScore: 0.90
    },
    {
      id: '3',
      title: 'Video Creator Pro',
      description: '8K editing, AI effects, cinematic tools surpassing Premiere Pro',
      type: 'studio',
      category: 'video',
      route: '/video-studio',
      tags: ['video', 'editing', '8k', 'cinematic', 'ai'],
      relevanceScore: 0.88
    },
    {
      id: '4',
      title: 'Visual Arts Studio',
      description: 'AI background removal, neural style transfer, 16K upscaling',
      type: 'studio',
      category: 'visual',
      route: '/visual-studio',
      tags: ['art', 'visual', 'ai', 'design', 'upscaling'],
      relevanceScore: 0.85
    },
    {
      id: '5',
      title: 'Collaborative Studio',
      description: 'Real-time multi-user editing, voice chat, version control',
      type: 'studio',
      category: 'collaboration',
      route: '/collaborative-studio',
      tags: ['collaboration', 'realtime', 'team', 'version-control'],
      relevanceScore: 0.83
    },
    {
      id: '6',
      title: 'AI Career Manager',
      description: 'Analytics automation, marketing AI, revenue optimization',
      type: 'studio',
      category: 'business',
      route: '/ai-career-manager',
      tags: ['ai', 'career', 'analytics', 'marketing', 'revenue'],
      relevanceScore: 0.80
    }
  ];

  useEffect(() => {
    if (query.length > 2) {
      setIsLoading(true);
      
      // Simulate search delay
      const searchTimeout = setTimeout(() => {
        const filteredResults = searchData.filter(item => {
          const matchesQuery = 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()) ||
            item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
          
          const matchesFilter = selectedFilter === 'all' || 
            (selectedFilter === 'studios' && item.type === 'studio') ||
            item.category === selectedFilter;
          
          return matchesQuery && matchesFilter;
        }).sort((a, b) => b.relevanceScore - a.relevanceScore);
        
        setResults(filteredResults);
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(searchTimeout);
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [query, selectedFilter]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'studio': return Music;
      case 'project': return Video;
      case 'artist': return Users;
      case 'tutorial': return BarChart3;
      default: return Search;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <Card className="w-full max-w-3xl mx-4 bg-gray-900 border-gray-700 max-h-[80vh] overflow-hidden">
        <CardContent className="p-0">
          {/* Search Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search studios, projects, artists, tutorials..."
                  className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  autoFocus
                />
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Filter Categories */}
            <div className="flex flex-wrap gap-2">
              {searchCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedFilter === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(category.id)}
                  className={`text-xs ${
                    selectedFilter === category.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <category.icon className="h-3 w-3 mr-1" />
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-gray-400">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                Searching...
              </div>
            ) : results.length > 0 ? (
              <div className="p-4 space-y-2">
                {results.map((result) => {
                  const Icon = getTypeIcon(result.type);
                  return (
                    <Link key={result.id} href={result.route || '#'}>
                      <div className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors group">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                              {result.title}
                            </h3>
                            <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                              {result.description}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                                {result.type}
                              </Badge>
                              {result.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs border-gray-600 text-gray-400">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : query.length > 2 ? (
              <div className="p-8 text-center text-gray-400">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                <p className="text-lg font-medium mb-2">No results found</p>
                <p className="text-sm">Try different keywords or browse our studios directly</p>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                <p className="text-lg font-medium mb-2">Search Artist Tech</p>
                <p className="text-sm">Find studios, projects, artists, and tutorials</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}