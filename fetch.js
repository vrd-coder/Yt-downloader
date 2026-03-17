export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { videoId, type } = req.query;
  if (!videoId) { res.status(400).json({ error: 'videoId required' }); return; }

  const API_KEY  = '996f569aa4mshe1c7e4ea4b3b58bp1e7e50jsn82bcd7268998';
  const API_HOST = 'youtube-video-fast-downloader2.p.rapidapi.com';

  const endpoints = {
    details: `https://${API_HOST}/get-video-details-and-quality?videoId=${videoId}`,
    video:   `https://${API_HOST}/get-video-download-url?videoId=${videoId}`,
    audio:   `https://${API_HOST}/get-audio-download-url?videoId=${videoId}`,
  };

  const url = endpoints[type || 'details'];
  if (!url) { res.status(400).json({ error: 'Invalid type' }); return; }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key':  API_KEY,
        'x-rapidapi-host': API_HOST,
      }
    });

    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json({ error: data?.message || 'API error' });
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
}
  
