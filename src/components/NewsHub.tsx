import { useState, useEffect } from 'react';
import { Search, Moon, Sun, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { NewsArticle, Category } from '../types/news';
import { fetchTopHeadlines, searchNews } from '../services/newsApi';
import { getBookmarks, saveBookmark, removeBookmark, isBookmarked } from '../services/bookmarks';
import FeaturedArticle from './FeaturedArticle';
import NewsCard from './NewsCard';
import ArticleModal from './ArticleModal';
import SkeletonCard from './SkeletonCard';
import SkeletonHero from './SkeletonHero';
import BookmarksModal from './BookmarksModal';

const categories: { id: Category; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'technology', label: 'Technology' },
  { id: 'sports', label: 'Sports' },
  { id: 'business', label: 'Finance' },
  { id: 'health', label: 'Health' },
  { id: 'science', label: 'World' },
  { id: 'entertainment', label: 'Politics' },
];

interface NewsHubProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export default function NewsHub({ darkMode, setDarkMode }: NewsHubProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [bookmarks, setBookmarks] = useState<NewsArticle[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [bookmarkStates, setBookmarkStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    loadBookmarks();
  }, []);

  useEffect(() => {
    updateBookmarkStates();
  }, [articles, bookmarks]);

  const loadBookmarks = () => {
    setBookmarks(getBookmarks());
  };

  const updateBookmarkStates = () => {
    const states: Record<string, boolean> = {};
    articles.forEach(article => {
      states[article.url] = isBookmarked(article.url);
    });
    setBookmarkStates(states);
  };

  const handleBookmarkToggle = (article: NewsArticle) => {
    if (isBookmarked(article.url)) {
      removeBookmark(article.url);
    } else {
      saveBookmark(article);
    }
    loadBookmarks();
    updateBookmarkStates();
  };

  useEffect(() => {
    loadNews();
  }, [selectedCategory]);

  const loadNews = async () => {
    setLoading(true);
    try {
      const response = await fetchTopHeadlines(selectedCategory);
      setArticles(response.articles.filter(article => article.title !== '[Removed]'));
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadNews();
      return;
    }

    setLoading(true);
    try {
      const response = await searchNews(searchQuery);
      setArticles(response.articles.filter(article => article.title !== '[Removed]'));
    } catch (error) {
      console.error('Error searching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const featuredArticle = articles[0];
  const otherArticles = articles.slice(1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">NewsHub</h1>

            <form onSubmit={handleSearch} className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search news..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                />
              </div>
            </form>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowBookmarks(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors relative"
                title="View bookmarks"
              >
                <Bookmark className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                {bookmarks.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {bookmarks.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-gray-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="sticky top-[73px] z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setSearchQuery('');
                }}
                className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <>
            <SkeletonHero />
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Top Headlines</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {featuredArticle && (
              <FeaturedArticle
                article={featuredArticle}
                onClick={() => setSelectedArticle(featuredArticle)}
                isBookmarked={bookmarkStates[featuredArticle.url]}
                onBookmarkToggle={() => handleBookmarkToggle(featuredArticle)}
              />
            )}

            {otherArticles.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Top Headlines</h2>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                      <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </button>
                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                      <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherArticles.map((article, index) => (
                    <NewsCard
                      key={article.url}
                      article={article}
                      onClick={() => setSelectedArticle(article)}
                      index={index}
                      isBookmarked={bookmarkStates[article.url]}
                      onBookmarkToggle={() => handleBookmarkToggle(article)}
                    />
                  ))}
                </div>
              </div>
            )}

            {articles.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">No articles found</p>
              </div>
            )}
          </>
        )}
      </main>

      <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      <BookmarksModal
        isOpen={showBookmarks}
        onClose={() => setShowBookmarks(false)}
        bookmarks={bookmarks}
        onArticleClick={setSelectedArticle}
        onRemoveBookmark={(url) => {
          removeBookmark(url);
          loadBookmarks();
          updateBookmarkStates();
        }}
      />

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">NewsHub</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Your trusted source for the latest news from around the world. Stay informed with real-time updates across technology, sports, business, health, and more.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Categories</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Technology</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Sports</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Business</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Health</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              &copy; {new Date().getFullYear()} NewsHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
