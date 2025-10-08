

export default async function handler(req: any, res: any) {
  const API_KEY = process.env.VITE_NEWS_API_KEY; // from Vercel Env Variables
  const { type, query, category, language } = req.query;
  const lang = language || 'en';

  let url = '';

  if (type === 'search') {
    url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      query as string
    )}&language=${lang}&sortBy=publishedAt&pageSize=20&apiKey=${API_KEY}`;
  } else {
    const categoryQuery =
      category && category !== 'all' ? `&category=${category}` : '';
    url = `https://newsapi.org/v2/top-headlines?language=${lang}${categoryQuery}&pageSize=20&apiKey=${API_KEY}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
}
