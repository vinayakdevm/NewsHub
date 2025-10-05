import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NewsArticle } from '../types/news';
import NewsCard from './NewsCard';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: NewsArticle[];
  onArticleClick: (article: NewsArticle) => void;
  onRemoveBookmark: (url: string) => void;
}

export default function BookmarksModal({
  isOpen,
  onClose,
  bookmarks,
  onArticleClick,
  onRemoveBookmark
}: BookmarksModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl my-8"
        >
          <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-2xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Bookmarked Articles ({bookmarks.length})
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          <div className="p-6">
            {bookmarks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No bookmarks yet. Start saving articles you want to read later!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarks.map((article, index) => (
                  <div key={article.url} className="relative group">
                    <NewsCard
                      article={article}
                      onClick={() => {
                        onArticleClick(article);
                        onClose();
                      }}
                      index={index}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveBookmark(article.url);
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                      title="Remove bookmark"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
