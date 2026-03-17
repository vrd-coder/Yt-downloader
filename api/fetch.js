export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { url, type } = req.query;
  if (!url) { res.status(400).json({ error: 'url required' }); return; }

  // Multiple Cobalt instances - try each one
  const instances = [
    'https://api.cobalt.tools/api/json',
    'https://cobalt.api.nadeko.bot/api/json',
    'https://cobalt.urdtv.ru/api/json',
  ];

  const body = JSON.stringify({
    url: url,
    vCodec: 'h264',
    vQuality: type === 'audio' ? '128' : '1080',
    aFormat: 'mp3',
    isAudioOnly: type === 'audio',
    isNoTTWatermark: true,
  });

  for (const instance of instances) {
    try {
      const response = await fetch(instance, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: body
      });

      if (response.status === 429) continue; // rate limited, try next

      const data = await response.json();
      if (data?.status === 'error') continue; // error, try next

      res.status(200).json(data);
      return;
    } catch (err) {
      continue; // try next instance
    }
  }

  res.status(429).json({ error: 'All servers busy. Please try again in a moment.' });
}
