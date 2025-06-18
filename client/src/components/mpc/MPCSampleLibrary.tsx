import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FolderOpen, 
  Search, 
  Play, 
  Download,
  Star,
  Clock,
  Music
} from "lucide-react";

interface Sample {
  id: string;
  name: string;
  category: 'drums' | 'bass' | 'melody' | 'fx' | 'vocal';
  subcategory: string;
  bpm?: number;
  key?: string;
  duration: number; // in seconds
  size: number; // in bytes
  tags: string[];
  favorite: boolean;
  audioUrl: string;
}

interface SamplePack {
  id: string;
  name: string;
  description: string;
  samples: Sample[];
  genre: string;
  producer: string;
}

interface MPCSampleLibraryProps {
  onSampleSelect: (sample: Sample) => void;
}

export default function MPCSampleLibrary({ onSampleSelect }: MPCSampleLibraryProps) {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [samplePacks, setSamplePacks] = useState<SamplePack[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSampleLibrary();
  }, []);

  const loadSampleLibrary = () => {
    // Sample packs with different genres and styles
    const defaultPacks: SamplePack[] = [
      {
        id: 'hip-hop-essentials',
        name: 'Hip-Hop Essentials',
        description: 'Classic boom-bap drums and bass samples',
        genre: 'Hip-Hop',
        producer: 'BeatMaker Pro',
        samples: [
          {
            id: 'kick-808-1', name: '808 Kick Deep', category: 'drums', subcategory: 'kick',
            bpm: 85, duration: 2.1, size: 125000, tags: ['808', 'deep', 'sub'], favorite: false,
            audioUrl: '/samples/hip-hop/kick-808-1.wav'
          },
          {
            id: 'snare-vintage-1', name: 'Vintage Snare Crack', category: 'drums', subcategory: 'snare',
            duration: 0.8, size: 89000, tags: ['vintage', 'crack', 'punchy'], favorite: true,
            audioUrl: '/samples/hip-hop/snare-vintage-1.wav'
          },
          {
            id: 'bass-sub-1', name: 'Sub Bass Wobble', category: 'bass', subcategory: 'sub',
            bpm: 85, key: 'C', duration: 4.0, size: 180000, tags: ['sub', 'wobble', 'deep'], favorite: false,
            audioUrl: '/samples/hip-hop/bass-sub-1.wav'
          }
        ]
      },
      {
        id: 'trap-heat',
        name: 'Trap Heat',
        description: 'Modern trap drums and melodic elements',
        genre: 'Trap',
        producer: 'TrapLord',
        samples: [
          {
            id: 'kick-trap-1', name: 'Trap Kick Punch', category: 'drums', subcategory: 'kick',
            bpm: 140, duration: 1.5, size: 95000, tags: ['trap', 'punch', 'modern'], favorite: true,
            audioUrl: '/samples/trap/kick-trap-1.wav'
          },
          {
            id: 'hihat-roll-1', name: 'Hi-Hat Roll Fast', category: 'drums', subcategory: 'hihat',
            bpm: 140, duration: 2.0, size: 110000, tags: ['roll', 'fast', 'trap'], favorite: false,
            audioUrl: '/samples/trap/hihat-roll-1.wav'
          },
          {
            id: 'melody-bell-1', name: 'Trap Bell Lead', category: 'melody', subcategory: 'lead',
            bpm: 140, key: 'F#m', duration: 8.0, size: 320000, tags: ['bell', 'lead', 'melodic'], favorite: false,
            audioUrl: '/samples/trap/melody-bell-1.wav'
          }
        ]
      },
      {
        id: 'techno-underground',
        name: 'Techno Underground',
        description: 'Dark and driving techno elements',
        genre: 'Techno',
        producer: 'DarkBeat',
        samples: [
          {
            id: 'kick-techno-1', name: 'Techno Kick Hard', category: 'drums', subcategory: 'kick',
            bpm: 128, duration: 1.0, size: 75000, tags: ['techno', 'hard', 'punchy'], favorite: false,
            audioUrl: '/samples/techno/kick-techno-1.wav'
          },
          {
            id: 'perc-metallic-1', name: 'Metallic Perc Hit', category: 'drums', subcategory: 'perc',
            duration: 0.5, size: 45000, tags: ['metallic', 'industrial', 'hit'], favorite: true,
            audioUrl: '/samples/techno/perc-metallic-1.wav'
          }
        ]
      }
    ];

    setSamplePacks(defaultPacks);
    
    // Flatten all samples for browsing
    const allSamples = defaultPacks.flatMap(pack => pack.samples);
    setSamples(allSamples);
  };

  const filteredSamples = samples.filter(sample => {
    const matchesSearch = sample.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sample.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || sample.category === selectedCategory;
    const matchesPack = !selectedPack || samplePacks.find(pack => 
      pack.id === selectedPack && pack.samples.some(s => s.id === sample.id)
    );
    
    return matchesSearch && matchesCategory && matchesPack;
  });

  const toggleFavorite = (sampleId: string) => {
    setSamples(prev => prev.map(sample => 
      sample.id === sampleId ? { ...sample, favorite: !sample.favorite } : sample
    ));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return Math.round(bytes / (1024 * 1024)) + ' MB';
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${seconds.toFixed(1)}s`;
  };

  const categories = [
    { id: 'all', label: 'All Samples', count: samples.length },
    { id: 'drums', label: 'Drums', count: samples.filter(s => s.category === 'drums').length },
    { id: 'bass', label: 'Bass', count: samples.filter(s => s.category === 'bass').length },
    { id: 'melody', label: 'Melody', count: samples.filter(s => s.category === 'melody').length },
    { id: 'fx', label: 'FX', count: samples.filter(s => s.category === 'fx').length },
    { id: 'vocal', label: 'Vocal', count: samples.filter(s => s.category === 'vocal').length }
  ];

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center">
          <FolderOpen className="mr-2" size={16} />
          Sample Library
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search samples..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-gray-800 border-gray-600 text-white text-sm"
          />
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <div className="text-xs text-gray-400 font-medium">Categories</div>
          <div className="grid grid-cols-2 gap-1">
            {categories.map(category => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                className="text-xs justify-between"
              >
                <span>{category.label}</span>
                <Badge variant="secondary" className="text-xs ml-1">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Sample Packs */}
        <div className="space-y-2">
          <div className="text-xs text-gray-400 font-medium">Sample Packs</div>
          <div className="space-y-1">
            <Button
              onClick={() => setSelectedPack(null)}
              variant={!selectedPack ? "default" : "outline"}
              size="sm"
              className="w-full text-xs justify-start"
            >
              All Packs
            </Button>
            {samplePacks.map(pack => (
              <Button
                key={pack.id}
                onClick={() => setSelectedPack(pack.id)}
                variant={selectedPack === pack.id ? "default" : "outline"}
                size="sm"
                className="w-full text-xs justify-start"
              >
                <div className="text-left">
                  <div className="font-medium">{pack.name}</div>
                  <div className="text-xs text-gray-400">{pack.genre} • {pack.samples.length} samples</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Sample List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-400 font-medium">
              Samples ({filteredSamples.length})
            </div>
            {filteredSamples.length > 10 && (
              <Button variant="ghost" size="sm" className="text-xs">
                Load More
              </Button>
            )}
          </div>
          
          <ScrollArea className="h-48">
            <div className="space-y-2">
              {filteredSamples.slice(0, 20).map(sample => (
                <div
                  key={sample.id}
                  className="bg-gray-800 rounded p-2 cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => onSampleSelect(sample)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium truncate flex-1">
                      {sample.name}
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(sample.id);
                      }}
                      variant="ghost"
                      size="sm"
                      className="p-1 h-6 w-6"
                    >
                      <Star 
                        size={12} 
                        className={sample.favorite ? 'text-yellow-400 fill-current' : 'text-gray-400'} 
                      />
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <Badge variant="outline" className="text-xs">
                      {sample.category}
                    </Badge>
                    
                    {sample.bpm && (
                      <div className="flex items-center">
                        <Music size={10} className="mr-1" />
                        {sample.bpm} BPM
                      </div>
                    )}
                    
                    {sample.key && (
                      <div className="font-mono">{sample.key}</div>
                    )}
                    
                    <div className="flex items-center">
                      <Clock size={10} className="mr-1" />
                      {formatDuration(sample.duration)}
                    </div>
                    
                    <div>{formatFileSize(sample.size)}</div>
                  </div>
                  
                  {sample.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {sample.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1 text-xs">
            <Download size={12} className="mr-1" />
            Import
          </Button>
          <Button variant="outline" size="sm" className="flex-1 text-xs">
            <Star size={12} className="mr-1" />
            Favorites
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}