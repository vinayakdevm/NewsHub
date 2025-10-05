import { motion } from 'framer-motion';
import { Bookmark, Clock, User } from 'lucide-react';
import { NewsArticle } from '../types/news';

interface FeaturedArticleProps {
  article: NewsArticle;
  onClick: () => void;
  isBookmarked?: boolean;
  onBookmarkToggle?: () => void;
}

export default function FeaturedArticle({ article, onClick, isBookmarked, onBookmarkToggle }: FeaturedArticleProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const calculateReadTime = (content: string | null) => {
    if (!content) return '5 min read';
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      onClick={onClick}
      className="relative w-full h-[500px] rounded-2xl overflow-hidden cursor-pointer group mb-12"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />

      {article.urlToImage ? (
        <img
          src={article.urlToImage}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200';
          }}
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-700 to-gray-900" />
      )}

      <div className="relative z-20 h-full flex flex-col justify-end p-8 md:p-12 text-white">
        <div className="flex gap-2 mb-4">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium uppercase">
            Tech
          </span>
          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium uppercase">
            Featured
          </span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-5xl font-bold mb-4 line-clamp-3"
        >
          {article.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-200 mb-6 line-clamp-2 max-w-3xl"
        >
          {article.description || 'Click to read more about this featured story'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center gap-4 text-sm"
        >
          {article.author && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{article.author.split(',')[0]}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{calculateReadTime(article.content)}</span>
          </div>
          <span>{formatDate(article.publishedAt)}</span>
        </motion.div>
      </div>

      {onBookmarkToggle && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBookmarkToggle();
          }}
          className={`absolute top-6 right-6 z-30 p-3 rounded-full transition-colors ${
            isBookmarked
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
          title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      )}
    </motion.div>
  );
}
