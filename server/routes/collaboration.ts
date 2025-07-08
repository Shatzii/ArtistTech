import { Router } from 'express';
import { z } from 'zod';

const router = Router();

// Get available artists for collaboration
router.get('/artists', async (req, res) => {
  try {
    const artists = [
      {
        id: 1,
        name: 'Luna Rodriguez',
        genre: 'Electronic Pop',
        location: 'Los Angeles, CA',
        compatibility: 94,
        followers: 25600,
        avatar: '🎵',
        specialties: ['Vocals', 'Songwriting', 'Production'],
        recentWork: 'Midnight Vibes EP',
        status: 'Available',
        matchReason: 'Similar electronic influences and vocal style',
        portfolio: [
          { title: 'Neon Dreams', plays: 45200, platform: 'Spotify' },
          { title: 'Electric Pulse', plays: 32100, platform: 'YouTube' }
        ]
      },
      {
        id: 2,
        name: 'Marcus Thompson',
        genre: 'Hip-Hop',
        location: 'Atlanta, GA',
        compatibility: 87,
        followers: 34200,
        avatar: '🎤',
        specialties: ['Rap', 'Mixing', 'Beat Making'],
        recentWork: 'Urban Stories Album',
        status: 'Busy',
        matchReason: 'Complementary skills in rhythm and flow',
        portfolio: [
          { title: 'Street Chronicles', plays: 89300, platform: 'SoundCloud' },
          { title: 'City Lights', plays: 56700, platform: 'Apple Music' }
        ]
      },
      {
        id: 3,
        name: 'Aria Chen',
        genre: 'Indie Folk',
        location: 'Portland, OR',
        compatibility: 91,
        followers: 18900,
        avatar: '🎸',
        specialties: ['Guitar', 'Harmonies', 'Storytelling'],
        recentWork: 'Whispering Pines',
        status: 'Available',
        matchReason: 'Exceptional harmonic sensibilities',
        portfolio: [
          { title: 'Forest Echoes', plays: 23400, platform: 'Bandcamp' },
          { title: 'Mountain Song', plays: 18200, platform: 'Spotify' }
        ]
      },
      {
        id: 4,
        name: 'DJ Neon',
        genre: 'Electronic Dance',
        location: 'Miami, FL',
        compatibility: 89,
        followers: 42800,
        avatar: '🎧',
        specialties: ['DJ Sets', 'Remixing', 'Live Performance'],
        recentWork: 'Festival Circuit 2024',
        status: 'Available',
        matchReason: 'Perfect for electronic crossover projects',
        portfolio: [
          { title: 'Miami Nights Mix', plays: 126500, platform: 'Mixcloud' },
          { title: 'EDM Anthem', plays: 78900, platform: 'Beatport' }
        ]
      }
    ];

    res.json(artists);
  } catch (error) {
    console.error('Error fetching artists:', error);
    res.status(500).json({ error: 'Failed to fetch artists' });
  }
});

// Send collaboration request
const requestSchema = z.object({
  artistId: z.number(),
  message: z.string()
});

router.post('/request', async (req, res) => {
  try {
    const { artistId, message } = requestSchema.parse(req.body);
    
    // Simulate sending collaboration request
    const request = {
      id: Date.now(),
      artistId,
      message,
      status: 'sent',
      timestamp: new Date().toISOString(),
      expectedResponse: '2-3 days'
    };

    res.json({
      success: true,
      request,
      message: 'Collaboration request sent successfully'
    });
  } catch (error) {
    console.error('Error sending collaboration request:', error);
    res.status(500).json({ error: 'Failed to send collaboration request' });
  }
});

// Accept collaboration request
const acceptSchema = z.object({
  requestId: z.number()
});

router.post('/accept', async (req, res) => {
  try {
    const { requestId } = acceptSchema.parse(req.body);
    
    // Simulate accepting collaboration request
    res.json({
      success: true,
      requestId,
      status: 'accepted',
      message: 'Collaboration request accepted',
      nextSteps: [
        'Set up project workspace',
        'Schedule initial meeting',
        'Define project scope and timeline',
        'Exchange contact information'
      ]
    });
  } catch (error) {
    console.error('Error accepting collaboration request:', error);
    res.status(500).json({ error: 'Failed to accept collaboration request' });
  }
});

// Get collaboration projects
router.get('/projects', async (req, res) => {
  try {
    const projects = [
      {
        id: 1,
        name: 'Neon Dreams',
        collaborators: ['Luna Rodriguez', 'DJ Neon'],
        progress: 75,
        deadline: '2024-03-15',
        status: 'In Progress',
        type: 'Single',
        genre: 'Electronic Pop',
        tasks: [
          { id: 1, title: 'Vocal Recording', status: 'completed', assignee: 'Luna Rodriguez' },
          { id: 2, title: 'Beat Production', status: 'completed', assignee: 'DJ Neon' },
          { id: 3, title: 'Mixing', status: 'in-progress', assignee: 'Luna Rodriguez' },
          { id: 4, title: 'Mastering', status: 'pending', assignee: 'DJ Neon' }
        ]
      },
      {
        id: 2,
        name: 'Urban Stories Remix',
        collaborators: ['Marcus Thompson'],
        progress: 45,
        deadline: '2024-03-22',
        status: 'In Progress',
        type: 'Remix',
        genre: 'Hip-Hop',
        tasks: [
          { id: 1, title: 'Original Track Analysis', status: 'completed', assignee: 'Marcus Thompson' },
          { id: 2, title: 'Remix Concept', status: 'in-progress', assignee: 'Marcus Thompson' },
          { id: 3, title: 'New Verses', status: 'pending', assignee: 'Marcus Thompson' },
          { id: 4, title: 'Final Mix', status: 'pending', assignee: 'Marcus Thompson' }
        ]
      },
      {
        id: 3,
        name: 'Indie Folk Sessions',
        collaborators: ['Aria Chen', 'Mountain Echo'],
        progress: 90,
        deadline: '2024-03-10',
        status: 'Final Review',
        type: 'EP',
        genre: 'Indie Folk',
        tasks: [
          { id: 1, title: 'Songwriting', status: 'completed', assignee: 'Aria Chen' },
          { id: 2, title: 'Recording', status: 'completed', assignee: 'Mountain Echo' },
          { id: 3, title: 'Mixing', status: 'completed', assignee: 'Aria Chen' },
          { id: 4, title: 'Final Review', status: 'in-progress', assignee: 'Mountain Echo' }
        ]
      }
    ];

    res.json(projects);
  } catch (error) {
    console.error('Error fetching collaboration projects:', error);
    res.status(500).json({ error: 'Failed to fetch collaboration projects' });
  }
});

// Get collaboration statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      totalConnections: 156,
      activeCollaborations: 8,
      completedProjects: 23,
      avgCompatibility: 87.5,
      genreReach: 12,
      monthlyGrowth: 15.2,
      topGenres: [
        { genre: 'Electronic', count: 45, percentage: 28.8 },
        { genre: 'Hip-Hop', count: 38, percentage: 24.4 },
        { genre: 'Pop', count: 32, percentage: 20.5 },
        { genre: 'Indie', count: 24, percentage: 15.4 },
        { genre: 'Rock', count: 17, percentage: 10.9 }
      ],
      collaborationSuccess: {
        rate: 78.5,
        avgProjectDuration: 45, // days
        avgRating: 4.6,
        repeatCollaborations: 34.2 // percentage
      }
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching collaboration stats:', error);
    res.status(500).json({ error: 'Failed to fetch collaboration stats' });
  }
});

export default router;