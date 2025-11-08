// Quick script to find a YouTube channel ID from a channel handle
// Usage: node find-channel-id.js

require('dotenv').config();
const https = require('https');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_HANDLE = "@bibleunlocked"; // The channel handle

if (!YOUTUBE_API_KEY) {
  console.error("❌ YOUTUBE_API_KEY not set in .env file");
  process.exit(1);
}

console.log(`🔍 Searching for channel: ${CHANNEL_HANDLE}\n`);

// Search for the channel by handle
const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(CHANNEL_HANDLE)}&type=channel&key=${YOUTUBE_API_KEY}`;

https.get(searchUrl, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      
      if (result.error) {
        console.error('❌ API Error:', result.error.message);
        return;
      }
      
      if (result.items && result.items.length > 0) {
        const channel = result.items[0];
        console.log('✅ Channel found!');
        console.log('   Name:', channel.snippet.title);
        console.log('   Channel ID:', channel.id.channelId);
        console.log('   Description:', channel.snippet.description.substring(0, 100) + '...');
        console.log('\n📝 Copy this channel ID and paste it into:');
        console.log('   src/_data/bibleUnlockedVideos.js (line 14)');
        console.log('\n   Replace: const CHANNEL_ID = "YOUR_CHANNEL_ID_HERE";');
        console.log(`   With:    const CHANNEL_ID = "${channel.id.channelId}";`);
      } else {
        console.log('❌ No channel found. Try searching manually on YouTube.');
        console.log('   Alternative method:');
        console.log('   1. Go to https://www.youtube.com/@bibleunlocked');
        console.log('   2. Click on any video');
        console.log('   3. View page source (Ctrl+U or Cmd+Option+U)');
        console.log('   4. Search for "channelId" in the source');
      }
    } catch (error) {
      console.error('❌ Error parsing response:', error.message);
    }
  });
}).on('error', (error) => {
  console.error('❌ Request error:', error.message);
});

