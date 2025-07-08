import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { 
  Shuffle, Music, Zap, Play, Pause, Volume2, Download,
  Settings, TrendingUp, Star, Target, Layers, Waveform,
  BarChart3, Sliders, Clock, Award, ArrowRight, Sparkles
} from 'lucide-react';

export default function GenreRemixer() {
  const queryClient = useQueryClient();
  
  // Remix state
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [remixParameters, setRemixParameters] = useState({
    crossfadeIntensity: 50,
    bpmSync: true,
    keyHarmony: true,
    rhythmBlend: 70,
    melodicFusion: 60,
    basslineIntegration: 80,
    vocalProcessing: 40
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRemix, setGeneratedRemix] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const genres = [
    { id: 'electronic', name: 'Electronic', color: 'from-cyan-500 to-blue-500', popularity: 92 },
    { id: 'hip-hop', name: 'Hip-Hop', color: 'from-red-500 to-orange-500', popularity: 88 },
    { id: 'pop', name: 'Pop', color: 'from-pink-500 to-purple-500', popularity: 85 },
    { id: 'rock', name: 'Rock', color: 'from-gray-500 to-gray-700', popularity: 79 },
    { id: 'jazz', name: 'Jazz', color: 'from-yellow-500 to-orange-500', popularity: 76 },
    { id: 'r&b', name: 'R&B', color: 'from-purple-500 to-pink-500', popularity: 81 },
    { id: 'indie', name: 'Indie', color: 'from-green-500 to-teal-500', popularity: 74 },
    { id: 'classical', name: 'Classical', color: 'from-indigo-500 to-purple-500', popularity: 68 },
    { id: 'reggae', name: 'Reggae', color: 'from-green-600 to-yellow-500', popularity: 72 },
    { id: 'ambient', name: 'Ambient', color: 'from-blue-400 to-cyan-400', popularity: 69 }
  ];

  // Fetch genre analysis
  const { data: analysisData } = useQuery({
    queryKey: ['/api/genre-remixer/analysis', selectedGenres.join(',')],
    enabled: selectedGenres.length >= 2
  });

  // Fetch remix history
  const { data: historyData } = useQuery({
    queryKey: ['/api/genre-remixer/history']
  });

  // Fetch trending combinations
  const { data: trendingData } = useQuery({
    queryKey: ['/api/genre-remixer/trending']
  });

  // Generate remix mutation
  const generateMutation = useMutation({
    mutationFn: async () => {
      setIsGenerating(true);
      const response = await apiRequest('POST', '/api/genre-remixer/generate', {
        genres: selectedGenres,
        parameters: remixParameters,
        timestamp: Date.now()
      });
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedRemix(data);
      setIsGenerating(false);
      queryClient.invalidateQueries({ queryKey: ['/api/genre-remixer/history'] });
    },
    onError: () => {
      setIsGenerating(false);
    }
  });

  const handleGenreToggle = (genreId: string) => {
    setSelectedGenres(prev => {
      if (prev.includes(genreId)) {
        return prev.filter(id => id !== genreId);
      } else if (prev.length < 3) {
        return [...prev, genreId];
      }
      return prev;
    });
  };

  const getGenreColor = (genreId: string) => {
    const genre = genres.find(g => g.id === genreId);
    return genre?.color || 'from-gray-500 to-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-lg border-b border-purple-500/30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="text-purple-400 hover:text-purple-300">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Shuffle className="w-6 h-6" />
              AI Genre Remixer
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-purple-500/20 px-3 py-1 rounded-full text-purple-300 text-sm">
              {selectedGenres.length}/3 Genres
            </div>
            <div className="bg-blue-500/20 px-3 py-1 rounded-full text-blue-300 text-sm">
              AI-Powered
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Genre Selection */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Music className="w-5 h-5" />
            Select Genres to Mix (Choose 2-3)
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => handleGenreToggle(genre.id)}
                disabled={!selectedGenres.includes(genre.id) && selectedGenres.length >= 3}
                className={`relative overflow-hidden rounded-lg p-4 border-2 transition-all duration-200 ${
                  selectedGenres.includes(genre.id)
                    ? 'border-purple-500 ring-2 ring-purple-500/50'
                    : 'border-gray-600 hover:border-gray-500'
                } ${
                  !selectedGenres.includes(genre.id) && selectedGenres.length >= 3
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:scale-105'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${genre.color} opacity-20`} />
                <div className="relative">
                  <h3 className="font-bold text-white mb-1">{genre.name}</h3>
                  <div className="text-gray-300 text-sm">{genre.popularity}% popularity</div>
                  {selectedGenres.includes(genre.id) && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-purple-500 rounded-full p-1">
                        <Zap className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Analysis Results */}
        {analysisData && selectedGenres.length >= 2 && (
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              AI Genre Analysis
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">{analysisData.compatibility}%</div>
                <div className="text-gray-300">Overall Compatibility</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">{analysisData.suggestedBPM}</div>
                <div className="text-gray-300">Suggested BPM</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">{analysisData.suggestedKey}</div>
                <div className="text-gray-300">Optimal Key</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-white mb-3">Fusion Techniques</h3>
                <ul className="space-y-2">
                  {analysisData.fusionTechniques && analysisData.fusionTechniques.map((technique: string, index: number) => (
                    <li key={index} className="text-gray-300 text-sm flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-purple-400" />
                      {technique}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-white mb-3">Technical Recommendations</h3>
                <ul className="space-y-2">
                  {analysisData.technicalRecommendations && analysisData.technicalRecommendations.map((rec: string, index: number) => (
                    <li key={index} className="text-gray-300 text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Remix Parameters */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Sliders className="w-5 h-5" />
            Remix Parameters
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-white font-medium mb-2">
                Crossfade Intensity: {remixParameters.crossfadeIntensity}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={remixParameters.crossfadeIntensity}
                onChange={(e) => setRemixParameters(prev => ({
                  ...prev,
                  crossfadeIntensity: parseInt(e.target.value)
                }))}
                className="w-full accent-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">
                Rhythm Blend: {remixParameters.rhythmBlend}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={remixParameters.rhythmBlend}
                onChange={(e) => setRemixParameters(prev => ({
                  ...prev,
                  rhythmBlend: parseInt(e.target.value)
                }))}
                className="w-full accent-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">
                Melodic Fusion: {remixParameters.melodicFusion}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={remixParameters.melodicFusion}
                onChange={(e) => setRemixParameters(prev => ({
                  ...prev,
                  melodicFusion: parseInt(e.target.value)
                }))}
                className="w-full accent-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">
                Bassline Integration: {remixParameters.basslineIntegration}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={remixParameters.basslineIntegration}
                onChange={(e) => setRemixParameters(prev => ({
                  ...prev,
                  basslineIntegration: parseInt(e.target.value)
                }))}
                className="w-full accent-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">
                Vocal Processing: {remixParameters.vocalProcessing}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={remixParameters.vocalProcessing}
                onChange={(e) => setRemixParameters(prev => ({
                  ...prev,
                  vocalProcessing: parseInt(e.target.value)
                }))}
                className="w-full accent-purple-500"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={remixParameters.bpmSync}
                  onChange={(e) => setRemixParameters(prev => ({
                    ...prev,
                    bpmSync: e.target.checked
                  }))}
                  className="accent-purple-500"
                />
                <span className="text-white">BPM Synchronization</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={remixParameters.keyHarmony}
                  onChange={(e) => setRemixParameters(prev => ({
                    ...prev,
                    keyHarmony: e.target.checked
                  }))}
                  className="accent-purple-500"
                />
                <span className="text-white">Key Harmony Matching</span>
              </label>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => generateMutation.mutate()}
            disabled={selectedGenres.length < 2 || isGenerating}
            className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
              selectedGenres.length >= 2 && !isGenerating
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white hover:scale-105'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                Generating AI Remix...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Generate AI Remix
              </div>
            )}
          </button>
        </div>

        {/* Generated Remix */}
        {generatedRemix && (
          <div className="bg-gradient-to-r from-purple-800/30 to-pink-800/30 rounded-lg p-6 border border-purple-500/50 mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Generated Remix
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-bold text-white mb-3">Analysis Results</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Compatibility:</span>
                    <span className="text-purple-400 font-bold">{generatedRemix.analysisResults?.compatibility}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">BPM:</span>
                    <span className="text-blue-400 font-bold">{generatedRemix.analysisResults?.suggestedBPM}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Key:</span>
                    <span className="text-green-400 font-bold">{generatedRemix.analysisResults?.suggestedKey}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-white mb-3">Quality Metrics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Harmony Score:</span>
                    <span className="text-purple-400 font-bold">{generatedRemix.qualityMetrics?.harmonyScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Rhythm Score:</span>
                    <span className="text-blue-400 font-bold">{generatedRemix.qualityMetrics?.rhythmScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Overall Score:</span>
                    <span className="text-green-400 font-bold">{generatedRemix.qualityMetrics?.overallScore}/100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Audio Player */}
            <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-purple-500 hover:bg-purple-600 p-3 rounded-full text-white transition-all"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  <div>
                    <div className="text-white font-bold">AI Generated Remix</div>
                    <div className="text-gray-400 text-sm">
                      {selectedGenres.join(' × ')} • {Math.floor(generatedRemix.generatedElements?.duration / 60)}:{String(generatedRemix.generatedElements?.duration % 60).padStart(2, '0')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white">
                    <Star className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Waveform visualization */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-1 h-16">
                  {generatedRemix.generatedElements?.waveformData?.slice(0, 100).map((amplitude: number, index: number) => (
                    <div
                      key={index}
                      className="bg-purple-500 w-1"
                      style={{ height: `${amplitude * 60 + 4}px` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {generatedRemix.recommendations && (
              <div>
                <h3 className="font-bold text-white mb-3">AI Recommendations</h3>
                <ul className="space-y-2">
                  {generatedRemix.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="text-gray-300 text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Trending Combinations & History */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trending Combinations */}
          {trendingData && (
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Trending Combinations
              </h2>
              <div className="space-y-3">
                {trendingData.map((combo: any, index: number) => (
                  <div key={index} className="bg-gray-700/50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-bold text-white">{combo.genres.join(' × ')}</div>
                      <div className="text-yellow-400 font-bold">{combo.popularity}%</div>
                    </div>
                    <div className="text-gray-400 text-sm">
                      Avg Rating: {combo.avgRating}/5 ⭐
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Remix History */}
          {historyData && (
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Your Remix History
              </h2>
              <div className="space-y-3">
                {historyData.map((remix: any, index: number) => (
                  <div key={index} className="bg-gray-700/50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-bold text-white">{remix.genres.join(' × ')}</div>
                      <div className="text-purple-400 font-bold">{remix.rating}/5 ⭐</div>
                    </div>
                    <div className="text-gray-400 text-sm">
                      {remix.plays} plays • {remix.created}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}