import { NewsResponse, Category } from '../types/news';

const BASE_URL = '/api/news'; // serverless proxy, no direct API key in frontend
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

interface CachedData {
  data: NewsResponse;
  timestamp: number;
}

function getCacheKey(type: 'headlines' | 'search', param: string, language?: string): string {
  return `news_cache_${type}_${param}_${language || 'en'}`;
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

export async function fetchTopHeadlines(category?: Category, language?: string): Promise<NewsResponse> {
  const categoryParam = category && category !== 'all' ? category : 'all';
  const languageParam = language || 'en';
  const cacheKey = getCacheKey('headlines', categoryParam, languageParam);

  const cached = getFromCache(cacheKey);
  if (cached) {
    console.log('Using cached data for:', categoryParam, languageParam);
    return cached;
  }

  const url = `${BASE_URL}?type=headlines&category=${categoryParam}&language=${languageParam}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }

  const data = await response.json();
  saveToCache(cacheKey, data);
  return data;
}

export async function searchNews(query: string, language?: string): Promise<NewsResponse> {
  const languageParam = language || 'en';
  const cacheKey = getCacheKey('search', query.toLowerCase(), languageParam);

  const cached = getFromCache(cacheKey);
  if (cached) {
    console.log('Using cached data for search:', query, languageParam);
    return cached;
  }

  const url = `${BASE_URL}?type=search&query=${encodeURIComponent(query)}&language=${languageParam}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to search news');
  }

  const data = await response.json();
  saveToCache(cacheKey, data);
  return data;
}
