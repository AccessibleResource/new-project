// index.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).json({ error: 'No URL provided' });
  }

  try {
    const response = await fetch(`https://allsocial.onrender.com/?url=${encodeURIComponent(videoUrl)}`);
    
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch from allsocial API' });
    }
    
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}