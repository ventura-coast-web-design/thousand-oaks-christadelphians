const EleventyFetch = require("@11ty/eleventy-fetch");

// Load environment variables from .env file
require('dotenv').config();

module.exports = async function() {
  // YouTube API key - set this in your environment variables
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  
  // Bible Unlocked channel ID
  // To find the channel ID:
  // 1. Go to https://www.youtube.com/@bibleunlocked
  // 2. Click on any video
  // 3. View page source (Ctrl+U or Cmd+Option+U)
  // 4. Search for "channelId" - it will be like "UC..."
  // Or use a tool like: https://www.streamweasels.com/tools/youtube-channel-id-and-user-id-convertor/
  const CHANNEL_ID = "UCNhfznzhfLYfHUtsxivtciQ"; // Replace with actual Bible Unlocked channel ID
  
  // If no API key is set, return placeholder data
  if (!YOUTUBE_API_KEY) {
    console.warn("⚠️  YOUTUBE_API_KEY not set. Using placeholder data for Bible Unlocked videos.");
    console.warn("   Set YOUTUBE_API_KEY environment variable to fetch real data.");
    return [
      {
        id: "dQw4w9WgXcQ",
        title: "Biblically Accurate Angels, Explained",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        duration: "5:45",
        url: "https://www.youtube.com/shorts/dQw4w9WgXcQ"
      },
      {
        id: "dQw4w9WgXcQ",
        title: "A Beginner's Guide to Bible Prophecy",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        duration: "6:41",
        url: "https://www.youtube.com/shorts/dQw4w9WgXcQ"
      },
      {
        id: "dQw4w9WgXcQ",
        title: "What is Faith?",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        duration: "4:35",
        url: "https://www.youtube.com/shorts/dQw4w9WgXcQ"
      },
      {
        id: "dQw4w9WgXcQ",
        title: "God's Involvement in Suffering | Part 3",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        duration: "4:13",
        url: "https://www.youtube.com/shorts/dQw4w9WgXcQ"
      },
      {
        id: "dQw4w9WgXcQ",
        title: "God's Purpose in Suffering | Part 2",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        duration: "5:22",
        url: "https://www.youtube.com/shorts/dQw4w9WgXcQ"
      }
    ];
  }

  try {
    // Fetch the latest uploads from the channel
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=10&type=video&videoDuration=short`;
    
    const searchData = await EleventyFetch(searchUrl, {
      duration: "1h", // Cache for 1 hour
      type: "json"
    });

    if (!searchData.items || searchData.items.length === 0) {
      console.warn("⚠️  No videos found from Bible Unlocked channel");
      return [];
    }

    // Get video IDs
    const videoIds = searchData.items.map(item => item.id.videoId).join(',');

    // Fetch detailed video information including duration
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=snippet,contentDetails`;
    
    const videosData = await EleventyFetch(videosUrl, {
      duration: "1h",
      type: "json"
    });

    // Format the videos data
    const videos = videosData.items.map(video => {
      const duration = parseDuration(video.contentDetails.duration);
      
      return {
        id: video.id,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.high?.url || 
                   video.snippet.thumbnails.medium?.url || 
                   video.snippet.thumbnails.default?.url,
        duration: duration,
        url: `https://www.youtube.com/shorts/${video.id}`
      };
    });

    console.log(`✅ Fetched ${videos.length} videos from Bible Unlocked`);
    return videos;

  } catch (error) {
    console.error("❌ Error fetching Bible Unlocked videos:", error.message);
    return [];
  }
};

// Helper function to parse ISO 8601 duration to MM:SS format
function parseDuration(isoDuration) {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  
  if (!match) return "0:00";
  
  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  const seconds = parseInt(match[3] || 0);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

