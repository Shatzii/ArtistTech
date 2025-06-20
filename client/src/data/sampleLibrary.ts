// Comprehensive Open Source Sample Library for Music Education

export interface Sample {
  id: string;
  name: string;
  category: 'drums' | 'bass' | 'melody' | 'fx' | 'vocal' | 'loops';
  subcategory: string;
  bpm?: number;
  key?: string;
  duration: number; // in seconds
  size: number; // in bytes
  tags: string[];
  favorite: boolean;
  audioUrl: string;
  license: 'CC0' | 'CC-BY' | 'CC-BY-SA' | 'Royalty-Free';
  artist?: string;
  description?: string;
}

export interface SamplePack {
  id: string;
  name: string;
  description: string;
  samples: Sample[];
  genre: string;
  producer: string;
  license: string;
  website?: string;
  downloadUrl?: string;
}

// Open source drum samples from Freesound.org and similar platforms
export const drumSamples: Sample[] = [
  // Kick Drums
  {
    id: 'kick_808_1',
    name: '808 Kick Deep',
    category: 'drums',
    subcategory: 'kick',
    bpm: 85,
    duration: 2.1,
    size: 125000,
    tags: ['808', 'deep', 'sub', 'trap', 'hip-hop'],
    favorite: false,
    audioUrl: '/samples/drums/kicks/808_kick_deep.wav',
    license: 'CC0',
    description: 'Deep 808-style kick drum perfect for trap and hip-hop'
  },
  {
    id: 'kick_acoustic_1',
    name: 'Acoustic Kick Punchy',
    category: 'drums',
    subcategory: 'kick',
    duration: 1.2,
    size: 89000,
    tags: ['acoustic', 'punchy', 'rock', 'live'],
    favorite: true,
    audioUrl: '/samples/drums/kicks/acoustic_kick_punchy.wav',
    license: 'CC0',
    description: 'Natural acoustic kick drum with punch'
  },
  {
    id: 'kick_electronic_1',
    name: 'Electronic Kick Hard',
    category: 'drums',
    subcategory: 'kick',
    bpm: 128,
    duration: 0.8,
    size: 67000,
    tags: ['electronic', 'hard', 'techno', 'house'],
    favorite: false,
    audioUrl: '/samples/drums/kicks/electronic_kick_hard.wav',
    license: 'CC0',
    description: 'Hard electronic kick for techno and house music'
  },

  // Snare Drums
  {
    id: 'snare_vintage_1',
    name: 'Vintage Snare Crack',
    category: 'drums',
    subcategory: 'snare',
    duration: 0.8,
    size: 89000,
    tags: ['vintage', 'crack', 'punchy', 'classic'],
    favorite: true,
    audioUrl: '/samples/drums/snares/vintage_snare_crack.wav',
    license: 'CC0',
    description: 'Classic vintage snare with crisp crack'
  },
  {
    id: 'snare_trap_1',
    name: 'Trap Snare Clap',
    category: 'drums',
    subcategory: 'snare',
    bpm: 140,
    duration: 0.6,
    size: 72000,
    tags: ['trap', 'clap', 'modern', 'layered'],
    favorite: false,
    audioUrl: '/samples/drums/snares/trap_snare_clap.wav',
    license: 'CC0',
    description: 'Modern trap-style snare with clap layer'
  },
  {
    id: 'snare_rim_1',
    name: 'Rim Shot Crisp',
    category: 'drums',
    subcategory: 'snare',
    duration: 0.3,
    size: 45000,
    tags: ['rim', 'crisp', 'accent', 'sharp'],
    favorite: false,
    audioUrl: '/samples/drums/snares/rim_shot_crisp.wav',
    license: 'CC0',
    description: 'Sharp rim shot for accents'
  },

  // Hi-Hats
  {
    id: 'hihat_closed_1',
    name: 'Hi-Hat Closed Tight',
    category: 'drums',
    subcategory: 'hihat',
    duration: 0.2,
    size: 32000,
    tags: ['closed', 'tight', 'crisp', 'classic'],
    favorite: false,
    audioUrl: '/samples/drums/hihats/hihat_closed_tight.wav',
    license: 'CC0',
    description: 'Tight closed hi-hat'
  },
  {
    id: 'hihat_open_1',
    name: 'Hi-Hat Open Sizzle',
    category: 'drums',
    subcategory: 'hihat',
    duration: 1.2,
    size: 78000,
    tags: ['open', 'sizzle', 'sustained', 'bright'],
    favorite: true,
    audioUrl: '/samples/drums/hihats/hihat_open_sizzle.wav',
    license: 'CC0',
    description: 'Sizzling open hi-hat with sustain'
  },
  {
    id: 'hihat_roll_1',
    name: 'Hi-Hat Roll Fast',
    category: 'drums',
    subcategory: 'hihat',
    bpm: 140,
    duration: 2.0,
    size: 110000,
    tags: ['roll', 'fast', 'trap', 'fill'],
    favorite: false,
    audioUrl: '/samples/drums/hihats/hihat_roll_fast.wav',
    license: 'CC0',
    description: 'Fast hi-hat roll for trap fills'
  }
];

// Bass samples
export const bassSamples: Sample[] = [
  {
    id: 'bass_sub_1',
    name: 'Sub Bass Wobble',
    category: 'bass',
    subcategory: 'sub',
    bpm: 85,
    key: 'C',
    duration: 4.0,
    size: 180000,
    tags: ['sub', 'wobble', 'deep', 'dubstep'],
    favorite: false,
    audioUrl: '/samples/bass/sub_bass_wobble.wav',
    license: 'CC0',
    description: 'Deep sub bass with wobble effect'
  },
  {
    id: 'bass_funk_1',
    name: 'Funk Bass Slap',
    category: 'bass',
    subcategory: 'electric',
    bpm: 100,
    key: 'E',
    duration: 2.5,
    size: 145000,
    tags: ['funk', 'slap', 'groove', 'electric'],
    favorite: true,
    audioUrl: '/samples/bass/funk_bass_slap.wav',
    license: 'CC-BY',
    artist: 'FunkMaster',
    description: 'Groovy slap bass line'
  },
  {
    id: 'bass_synth_1',
    name: 'Synth Bass Lead',
    category: 'bass',
    subcategory: 'synth',
    bpm: 128,
    key: 'A',
    duration: 3.2,
    size: 167000,
    tags: ['synth', 'lead', 'electronic', 'dance'],
    favorite: false,
    audioUrl: '/samples/bass/synth_bass_lead.wav',
    license: 'CC0',
    description: 'Electronic synth bass lead'
  }
];

// Melodic samples
export const melodySamples: Sample[] = [
  {
    id: 'piano_chord_1',
    name: 'Piano Chord Progression',
    category: 'melody',
    subcategory: 'piano',
    bpm: 120,
    key: 'Cmaj',
    duration: 8.0,
    size: 320000,
    tags: ['piano', 'chord', 'progression', 'emotional'],
    favorite: true,
    audioUrl: '/samples/melody/piano_chord_progression.wav',
    license: 'CC0',
    description: 'Beautiful piano chord progression in C major'
  },
  {
    id: 'guitar_riff_1',
    name: 'Electric Guitar Riff',
    category: 'melody',
    subcategory: 'guitar',
    bpm: 110,
    key: 'Em',
    duration: 4.5,
    size: 210000,
    tags: ['guitar', 'riff', 'electric', 'rock'],
    favorite: false,
    audioUrl: '/samples/melody/electric_guitar_riff.wav',
    license: 'CC-BY',
    artist: 'RockGuitarist',
    description: 'Catchy electric guitar riff'
  },
  {
    id: 'synth_lead_1',
    name: 'Synth Lead Melody',
    category: 'melody',
    subcategory: 'synth',
    bpm: 128,
    key: 'F#m',
    duration: 6.0,
    size: 256000,
    tags: ['synth', 'lead', 'melody', 'trance'],
    favorite: true,
    audioUrl: '/samples/melody/synth_lead_melody.wav',
    license: 'CC0',
    description: 'Uplifting synth lead melody'
  }
];

// FX and ambient samples
export const fxSamples: Sample[] = [
  {
    id: 'sweep_up_1',
    name: 'Sweep Up Riser',
    category: 'fx',
    subcategory: 'riser',
    duration: 4.0,
    size: 195000,
    tags: ['sweep', 'riser', 'buildup', 'tension'],
    favorite: false,
    audioUrl: '/samples/fx/sweep_up_riser.wav',
    license: 'CC0',
    description: 'Upward sweep for building tension'
  },
  {
    id: 'vinyl_stop_1',
    name: 'Vinyl Stop Effect',
    category: 'fx',
    subcategory: 'stop',
    duration: 2.5,
    size: 120000,
    tags: ['vinyl', 'stop', 'retro', 'transition'],
    favorite: true,
    audioUrl: '/samples/fx/vinyl_stop_effect.wav',
    license: 'CC0',
    description: 'Classic vinyl stop effect'
  },
  {
    id: 'impact_1',
    name: 'Impact Hit Heavy',
    category: 'fx',
    subcategory: 'impact',
    duration: 1.5,
    size: 89000,
    tags: ['impact', 'hit', 'heavy', 'dramatic'],
    favorite: false,
    audioUrl: '/samples/fx/impact_hit_heavy.wav',
    license: 'CC0',
    description: 'Heavy impact for dramatic moments'
  }
];

// Loop samples
export const loopSamples: Sample[] = [
  {
    id: 'drum_loop_1',
    name: 'Hip-Hop Drum Loop',
    category: 'loops',
    subcategory: 'drums',
    bpm: 85,
    duration: 8.0,
    size: 340000,
    tags: ['drums', 'loop', 'hip-hop', 'groove'],
    favorite: true,
    audioUrl: '/samples/loops/hiphop_drum_loop.wav',
    license: 'CC0',
    description: 'Classic hip-hop drum pattern loop'
  },
  {
    id: 'trap_loop_1',
    name: 'Trap Beat Loop',
    category: 'loops',
    subcategory: 'full',
    bpm: 140,
    duration: 16.0,
    size: 680000,
    tags: ['trap', 'beat', 'full', 'modern'],
    favorite: true,
    audioUrl: '/samples/loops/trap_beat_loop.wav',
    license: 'CC0',
    description: 'Complete trap beat loop'
  },
  {
    id: 'house_loop_1',
    name: 'House Bass Loop',
    category: 'loops',
    subcategory: 'bass',
    bpm: 128,
    duration: 8.0,
    size: 290000,
    tags: ['house', 'bass', 'four-on-floor', 'dance'],
    favorite: false,
    audioUrl: '/samples/loops/house_bass_loop.wav',
    license: 'CC-BY',
    artist: 'HouseProducer',
    description: 'Pumping house bass loop'
  }
];

// Sample packs organized by genre
export const samplePacks: SamplePack[] = [
  {
    id: 'hip-hop-essentials',
    name: 'Hip-Hop Essentials',
    description: 'Classic boom-bap drums and bass samples for traditional hip-hop production',
    genre: 'Hip-Hop',
    producer: 'OpenBeats Collective',
    license: 'Creative Commons Zero (CC0)',
    website: 'https://freesound.org',
    samples: [
      ...drumSamples.filter(s => s.tags.includes('hip-hop')),
      ...bassSamples.filter(s => s.tags.includes('funk')),
      ...loopSamples.filter(s => s.tags.includes('hip-hop'))
    ]
  },
  {
    id: 'trap-heat',
    name: 'Trap Heat',
    description: 'Modern trap drums, 808s, and melodic elements for contemporary production',
    genre: 'Trap',
    producer: 'TrapLords',
    license: 'Creative Commons Zero (CC0)',
    samples: [
      ...drumSamples.filter(s => s.tags.includes('trap')),
      ...bassSamples.filter(s => s.tags.includes('sub')),
      ...loopSamples.filter(s => s.tags.includes('trap'))
    ]
  },
  {
    id: 'electronic-vibes',
    name: 'Electronic Vibes',
    description: 'Synthesized sounds and electronic elements for EDM and dance music',
    genre: 'Electronic',
    producer: 'SynthWave Studios',
    license: 'Creative Commons Attribution (CC-BY)',
    samples: [
      ...drumSamples.filter(s => s.tags.includes('electronic')),
      ...bassSamples.filter(s => s.tags.includes('synth')),
      ...melodySamples.filter(s => s.tags.includes('synth'))
    ]
  },
  {
    id: 'acoustic-elements',
    name: 'Acoustic Elements',
    description: 'Natural acoustic instruments for organic music production',
    genre: 'Acoustic',
    producer: 'Natural Sounds',
    license: 'Creative Commons Zero (CC0)',
    samples: [
      ...drumSamples.filter(s => s.tags.includes('acoustic')),
      ...melodySamples.filter(s => s.tags.includes('piano') || s.tags.includes('guitar'))
    ]
  },
  {
    id: 'cinematic-fx',
    name: 'Cinematic FX',
    description: 'Atmospheric sounds and effects for film scoring and ambient music',
    genre: 'Cinematic',
    producer: 'Film Score Collective',
    license: 'Creative Commons Zero (CC0)',
    samples: fxSamples
  }
];

// Free and open source sample resources
export const sampleResources = [
  {
    name: 'Freesound.org',
    url: 'https://freesound.org',
    description: 'Collaborative database of Creative Commons licensed sounds',
    license: 'Various CC licenses',
    categories: ['All genres', 'Field recordings', 'Instruments', 'Effects']
  },
  {
    name: 'Zapsplat',
    url: 'https://zapsplat.com',
    description: 'Free sound effects and music for content creators',
    license: 'Royalty-free',
    categories: ['Music loops', 'Sound effects', 'Ambient sounds']
  },
  {
    name: 'BBC Sound Effects',
    url: 'https://sound-effects.bbcrewind.co.uk',
    description: 'BBC\'s archive of sound effects available for download',
    license: 'RemArc licence',
    categories: ['Atmosphere', 'Nature', 'Mechanical', 'Human']
  },
  {
    name: 'Free Music Archive',
    url: 'https://freemusicarchive.org',
    description: 'Curated collection of free and legal audio downloads',
    license: 'Various CC licenses',
    categories: ['Instrumental', 'Electronic', 'Hip-Hop', 'Experimental']
  },
  {
    name: 'Looperman',
    url: 'https://looperman.com',
    description: 'Free loops and samples created by the community',
    license: 'Royalty-free',
    categories: ['Beats', 'Bass', 'Melodies', 'Vocals']
  }
];

export const allSamples = [
  ...drumSamples,
  ...bassSamples,
  ...melodySamples,
  ...fxSamples,
  ...loopSamples
];