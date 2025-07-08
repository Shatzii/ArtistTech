import { Router } from 'express';
import { z } from 'zod';

const router = Router();

// ArtistCoin balance endpoint
router.get('/balance', async (req, res) => {
  try {
    // Simulate dynamic ArtistCoin balance
    const balance = {
      currentBalance: 2847 + Math.floor(Math.random() * 100),
      totalEarned: 15420 + Math.floor(Math.random() * 50),
      rank: 342 + Math.floor(Math.random() * 10),
      streak: 12,
      recentActivity: [
        { action: 'Watched music video', amount: 5, time: '2 min ago', type: 'view' },
        { action: 'Shared track on social', amount: 10, time: '8 min ago', type: 'share' },
        { action: 'Liked artist post', amount: 2, time: '15 min ago', type: 'like' },
        { action: 'Commented on release', amount: 8, time: '23 min ago', type: 'comment' }
      ],
      challenges: [
        {
          id: 1,
          title: 'Daily Listener',
          description: 'Listen to 5 songs today',
          progress: 3,
          target: 5,
          reward: 25,
          completed: false
        },
        {
          id: 2,
          title: 'Social Butterfly',
          description: 'Share 3 tracks on social media',
          progress: 1,
          target: 3,
          reward: 40,
          completed: false
        }
      ]
    };

    res.json(balance);
  } catch (error) {
    console.error('Error fetching ArtistCoin balance:', error);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

// Claim reward endpoint
const claimSchema = z.object({
  rewardId: z.string(),
  cost: z.number()
});

router.post('/claim', async (req, res) => {
  try {
    const { rewardId, cost } = claimSchema.parse(req.body);
    
    // Simulate claiming reward
    const newBalance = Math.max(0, 2847 - cost);
    
    res.json({
      success: true,
      rewardId,
      newBalance,
      message: `Successfully claimed ${rewardId}`
    });
  } catch (error) {
    console.error('Error claiming reward:', error);
    res.status(500).json({ error: 'Failed to claim reward' });
  }
});

// Complete challenge endpoint
const challengeSchema = z.object({
  challengeId: z.number()
});

router.post('/challenge', async (req, res) => {
  try {
    const { challengeId } = challengeSchema.parse(req.body);
    
    // Simulate completing challenge
    const rewards = {
      1: 25,
      2: 40,
      3: 20
    };
    
    const reward = rewards[challengeId as keyof typeof rewards] || 10;
    
    res.json({
      success: true,
      challengeId,
      reward,
      message: `Challenge completed! Earned ${reward} ArtistCoins`
    });
  } catch (error) {
    console.error('Error completing challenge:', error);
    res.status(500).json({ error: 'Failed to complete challenge' });
  }
});

// Viral features endpoint
router.get('/viral', async (req, res) => {
  try {
    const viralData = {
      totalParticipants: 15420,
      activeChallengers: 892,
      weeklyWinners: [
        { name: 'MusicLover92', coins: 2840, trend: '+15%' },
        { name: 'BeatMaster', coins: 2150, trend: '+22%' },
        { name: 'VibeSeeker', coins: 1930, trend: '+18%' }
      ],
      trendingHashtags: [
        { tag: '#ArtistCoinChallenge', uses: 45200, growth: '+89%' },
        { tag: '#EarnWhileListening', uses: 23100, growth: '+156%' },
        { tag: '#MusicRewards', uses: 18900, growth: '+67%' }
      ],
      powerUps: [
        { name: '2x Multiplier', duration: '1 hour', cost: 100 },
        { name: 'Streak Shield', duration: '24 hours', cost: 50 },
        { name: 'Bonus Boost', duration: '30 minutes', cost: 75 }
      ]
    };

    res.json(viralData);
  } catch (error) {
    console.error('Error fetching viral data:', error);
    res.status(500).json({ error: 'Failed to fetch viral data' });
  }
});

export default router;