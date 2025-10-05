import { NewsResponse, Category } from '../types/news';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY || 'demo';
const BASE_URL = 'https://newsapi.org/v2';
const CACHE_DURATION = 15 * 60 * 1000;

interface CachedData {
  data: NewsResponse;
  timestamp: number;
}

function getCacheKey(type: 'headlines' | 'search', param: string): string {
  return `news_cache_${type}_${param}`;
}

function getFromCache(key: string): NewsResponse | null {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp }: CachedData = JSON.parse(cached);
    const now = Date.now();

    if (now - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

function saveToCache(key: string, data: NewsResponse): void {
  try {
    const cacheData: CachedData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Failed to cache data:', error);
  }
}

export async function fetchTopHeadlines(category?: Category): Promise<NewsResponse> {
  const categoryParam = category && category !== 'all' ? category : 'all';
  const cacheKey = getCacheKey('headlines', categoryParam);

  const cached = getFromCache(cacheKey);
  if (cached) {
    console.log('Using cached data for:', categoryParam);
    return cached;
  }

  const categoryQuery = category && category !== 'all' ? `&category=${category}` : '';
  const url = `${BASE_URL}/top-headlines?country=us${categoryQuery}&pageSize=20&apiKey=${API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }

  const data = await response.json();
  saveToCache(cacheKey, data);
  return data;
}

export async function searchNews(query: string): Promise<NewsResponse> {
  const cacheKey = getCacheKey('search', query.toLowerCase());

  const cached = getFromCache(cacheKey);
  if (cached) {
    console.log('Using cached data for search:', query);
    return cached;
  }

  const url = `${BASE_URL}/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=20&apiKey=${API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to search news');
  }

  const data = await response.json();
  saveToCache(cacheKey, data);
  return data;
}
