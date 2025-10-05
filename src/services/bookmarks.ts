import { NewsArticle } from '../types/news';

const BOOKMARKS_KEY = 'news_bookmarks';

export function getBookmarks(): NewsArticle[] {
  try {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveBookmark(article: NewsArticle): void {
  try {
    const bookmarks = getBookmarks();
    if (!bookmarks.some(b => b.url === article.url)) {
      bookmarks.unshift(article);
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    }
  } catch (error) {
    console.error('Failed to save bookmark:', error);
  }
}

export function removeBookmark(url: string): void {
  try {
    const bookmarks = getBookmarks();
    const filtered = bookmarks.filter(b => b.url !== url);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove bookmark:', error);
  }
}

export function isBookmarked(url: string): boolean {
  const bookmarks = getBookmarks();
  return bookmarks.some(b => b.url === url);
}
