import fetch from 'node-fetch';
import { URL } from 'url';
import { createLogger } from 'winston';

const logger = createLogger({});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { url: videoUrl } = req.query;

  if (!videoUrl) {
    return res.status(400).json({ error: 'No URL provided' });
  }

  try {
    new URL(videoUrl);
    if (!videoUrl.startsWith('http')) {
      throw new Error('Invalid protocol');
    }
  } catch (error) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  try {
    const response = await fetch(`https://allsocial.onrender.com/?url=${encodeURIComponent(videoUrl)}`, {
      timeout: 500000
    });
    
    if (!response.ok) {
      logger.error(`API fetch failed with status ${response.status}`);
      return res.status(502).json({ error: 'Failed to fetch from external API' });
    }
    
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(data);

  } catch (error) {
    logger.error('Server error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}