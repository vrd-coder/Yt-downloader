export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { url, type } = req.query;
  if (!url) { res.status(400).json({ error: 'url required' }); return; }

  // Extract video ID
  const videoId = url.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([a-zA-Z0-9_-]{11})/)?.[1];
  if (!videoId) { res.status(400).json({ error: 'Invalid YouTube URL' }); return; }

  const API_KEY  = '996f569aa4mshe1c7e4ea4b3b58bp1e7e50jsn82bcd7268998';
  const API_HOST = 'youtube-mp3-audio-video-downloader.p.rapidapi.com';

  try {
    if (type === 'audio') {
      // Get MP3 download link
      const response = await fetch(
        `https://${API_HOST}/get_mp3_download_link/${videoId}?quality=high&wait_until_the_file_is_ready=false`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-host': API_HOST,
            'x-rapidapi-key': API_KEY,
          }
        }
      );
      const data = await response.json();
      res.status(200).json(data);
      return;
    }

    // For video info - use thumbnail + title from oEmbed (free, no API needed)
    const oembedRes = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    const oembedData = await oembedRes.json();

    // Also get mp4 link
    const videoRes = await fetch(
      `https://${API_HOST}/get_mp4_download_link/${videoId}?quality=auto&wait_until_the_file_is_ready=false`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': API_HOST,
          'x-rapidapi-key': API_KEY,
        }
      }
    );
    const videoData = await videoRes.json();

    res.status(200).json({
      title: oembedData.title || 'YouTube Video',
      thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      author: oembedData.author_name || '',
      videoData: videoData,
      videoId: videoId
    });

  } catch (err) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
}
