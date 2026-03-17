export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { url } = req.query;
  if (!url) { res.status(400).json({ error: 'url required' }); return; }

  const API_KEY  = '996f569aa4mshe1c7e4ea4b3b58bp1e7e50jsn82bcd7268998';
  const API_HOST = 'y2mate-youtube-video-and-mp3-downloader.p.rapidapi.com';

  try {
    const response = await fetch(
      `https://${API_HOST}/rapidapi-y2mate/?url=${encodeURIComponent(url)}&proxy=0`,
      {
        method: 'GET',
        headers: {
          'Content-Type':    'application/json',
          'x-rapidapi-host': API_HOST,
          'x-rapidapi-key':  API_KEY,
        }
      }
    );

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
