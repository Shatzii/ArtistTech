import type { Express } from "express";

export function registerSocialHeatmapRoutes(app: Express) {
  // Get heatmap analytics data
  app.get('/api/social/heatmap', async (req, res) => {
    try {
      const { platform = 'all', timeframe = '7d', metric = 'engagement' } = req.query;
      
      // Generate realistic heatmap data based on parameters
      const heatmapData = generateHeatmapData(platform as string, timeframe as string, metric as string);
      
      res.json({
        success: true,
        data: heatmapData,
        metadata: {
          platform,
          timeframe,
          metric,
          generated_at: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error("Error fetching heatmap data:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch heatmap data" 
      });
    }
  });

  // Get platform-specific metrics
  app.get('/api/social/platform-metrics', async (req, res) => {
    try {
      const platformMetrics = [
        {
          platform: "instagram",
          total_posts: 342,
          avg_engagement: 7.8,
          best_time: "8:00 PM",
          peak_hours: [19, 20, 21],
          top_content_type: "Reels",
          growth_rate: 12.4,
          weekly_data: generateWeeklyData('instagram')
        },
        {
          platform: "tiktok",
          total_posts: 289,
          avg_engagement: 11.2,
          best_time: "7:30 PM",
          peak_hours: [18, 19, 20],
          top_content_type: "Videos",
          growth_rate: 18.7,
          weekly_data: generateWeeklyData('tiktok')
        },
        {
          platform: "youtube",
          total_posts: 156,
          avg_engagement: 6.3,
          best_time: "9:00 PM",
          peak_hours: [20, 21, 22],
          top_content_type: "Shorts",
          growth_rate: 8.9,
          weekly_data: generateWeeklyData('youtube')
        },
        {
          platform: "twitter",
          total_posts: 567,
          avg_engagement: 4.2,
          best_time: "12:00 PM",
          peak_hours: [11, 12, 13],
          top_content_type: "Threads",
          growth_rate: 5.6,
          weekly_data: generateWeeklyData('twitter')
        },
        {
          platform: "facebook",
          total_posts: 234,
          avg_engagement: 3.8,
          best_time: "6:00 PM",
          peak_hours: [17, 18, 19],
          top_content_type: "Posts",
          growth_rate: -2.1,
          weekly_data: generateWeeklyData('facebook')
        }
      ];

      res.json({
        success: true,
        platforms: platformMetrics,
        summary: {
          total_platforms: platformMetrics.length,
          avg_growth_rate: platformMetrics.reduce((sum, p) => sum + p.growth_rate, 0) / platformMetrics.length,
          best_performing: platformMetrics.sort((a, b) => b.growth_rate - a.growth_rate)[0],
          peak_engagement_time: "7:30 PM - 9:00 PM"
        }
      });
    } catch (error) {
      console.error("Error fetching platform metrics:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch platform metrics" 
      });
    }
  });

  // Get content performance recommendations
  app.get('/api/social/heatmap/recommendations', async (req, res) => {
    try {
      const recommendations = [
        {
          type: "timing",
          priority: "high",
          title: "Optimize Posting Schedule",
          description: "Post TikTok content at 7:30 PM for 35% higher engagement",
          impact: "35% engagement increase",
          platforms: ["tiktok"],
          action: "Schedule posts for weekday evenings"
        },
        {
          type: "content",
          priority: "medium",
          title: "Focus on Video Content",
          description: "Instagram Reels outperforming static posts by 180%",
          impact: "180% performance boost",
          platforms: ["instagram"],
          action: "Increase Reels production frequency"
        },
        {
          type: "platform",
          priority: "high",
          title: "Expand YouTube Shorts",
          description: "YouTube Shorts showing 3x engagement vs regular videos",
          impact: "300% engagement increase",
          platforms: ["youtube"],
          action: "Create daily YouTube Shorts content"
        },
        {
          type: "audience",
          priority: "medium",
          title: "Weekend Content Strategy",
          description: "Weekend posts getting 40% more shares across all platforms",
          impact: "40% share increase",
          platforms: ["all"],
          action: "Increase weekend posting frequency"
        }
      ];

      res.json({
        success: true,
        recommendations,
        insights: {
          peak_engagement_window: "7:00 PM - 9:00 PM",
          best_day: "Friday",
          content_type_performance: {
            "video": 85,
            "image": 62,
            "carousel": 71,
            "story": 58
          }
        }
      });
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch recommendations" 
      });
    }
  });

  // Export heatmap data
  app.post('/api/social/heatmap/export', async (req, res) => {
    try {
      const { platform, timeframe, metric, format = 'json' } = req.body;
      
      const exportData = {
        metadata: {
          platform,
          timeframe,
          metric,
          exported_at: new Date().toISOString(),
          format
        },
        heatmap_data: generateHeatmapData(platform, timeframe, metric),
        summary: {
          peak_hours: [19, 20, 21],
          best_days: ["Friday", "Saturday"],
          avg_engagement: 7.8,
          total_posts_analyzed: 1247
        }
      };

      if (format === 'csv') {
        // Convert to CSV format
        const csvData = convertToCSV(exportData.heatmap_data);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=heatmap-export.csv');
        res.send(csvData);
      } else {
        res.json({
          success: true,
          export_data: exportData
        });
      }
    } catch (error) {
      console.error("Error exporting heatmap data:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to export heatmap data" 
      });
    }
  });
}

function generateHeatmapData(platform: string, timeframe: string, metric: string) {
  const data = [];
  const platforms = platform === 'all' 
    ? ["instagram", "tiktok", "youtube", "twitter", "facebook"]
    : [platform];

  const timeframeDays = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
  const daysToShow = Math.min(7, timeframeDays); // Show last 7 days for heatmap

  for (let day = 0; day < daysToShow; day++) {
    for (let hour = 0; hour < 24; hour++) {
      platforms.forEach(platformName => {
        const baseValue = Math.random() * 100;
        
        // Platform-specific patterns
        let platformMultiplier = 1;
        if (platformName === 'tiktok') platformMultiplier = 1.2;
        if (platformName === 'instagram') platformMultiplier = 1.1;
        if (platformName === 'youtube') platformMultiplier = 0.9;
        if (platformName === 'twitter') platformMultiplier = 0.8;
        if (platformName === 'facebook') platformMultiplier = 0.7;

        // Time-based patterns
        const peakMultiplier = (hour >= 19 && hour <= 21) ? 1.8 : 
                              (hour >= 12 && hour <= 14) ? 1.3 : 1;
        
        // Weekend patterns
        const weekendMultiplier = (day === 0 || day === 6) ? 1.3 : 1;
        
        // Metric-specific adjustments
        let metricMultiplier = 1;
        if (metric === 'views') metricMultiplier = 1.5;
        if (metric === 'likes') metricMultiplier = 0.8;
        if (metric === 'shares') metricMultiplier = 0.6;
        if (metric === 'comments') metricMultiplier = 0.4;

        const value = Math.min(100, baseValue * platformMultiplier * peakMultiplier * weekendMultiplier * metricMultiplier);
        
        data.push({
          hour,
          day,
          platform: platformName,
          value: Math.round(value),
          engagement: Math.round(value * 0.8 + Math.random() * 20),
          content_type: ["post", "story", "reel", "video"][Math.floor(Math.random() * 4)],
          metric_value: Math.round(value * metricMultiplier)
        });
      });
    }
  }

  return data;
}

function generateWeeklyData(platform: string) {
  const data = [];
  for (let day = 0; day < 7; day++) {
    const baseEngagement = Math.random() * 10 + 2;
    const weekendBoost = (day === 0 || day === 6) ? 1.2 : 1;
    
    data.push({
      day,
      engagement: Math.round(baseEngagement * weekendBoost * 10) / 10,
      posts: Math.floor(Math.random() * 5) + 1,
      reach: Math.floor(Math.random() * 10000) + 5000
    });
  }
  return data;
}

function convertToCSV(data: any[]): string {
  if (!data.length) return '';
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => row[header]).join(','))
  ].join('\n');
  
  return csvContent;
}