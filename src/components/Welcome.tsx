import { motion } from 'framer-motion';
import { Newspaper, Sparkles, TrendingUp, Globe } from 'lucide-react';

interface WelcomeProps {
  onEnter: () => void;
}

export default function Welcome({ onEnter }: WelcomeProps) {
  const features = [
    { icon: Globe, text: 'Global Coverage' },
    { icon: TrendingUp, text: 'Real-Time Updates' },
    { icon: Sparkles, text: 'Curated Stories' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center relative z-10 max-w-4xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
          className="mb-8 inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-white to-gray-100 rounded-3xl shadow-2xl"
        >
          <Newspaper className="w-16 h-16 text-slate-900" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-7xl md:text-8xl font-bold text-white mb-6 tracking-tight"
        >
          NewsHub
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-2xl text-gray-300 mb-4 max-w-2xl mx-auto font-light"
        >
          Your gateway to the world's most important stories
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-400 mb-12 max-w-xl mx-auto"
        >
          Stay informed with real-time news from trusted sources around the globe
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap justify-center gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10"
            >
              <feature.icon className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300 text-sm font-medium">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255,255,255,0.1)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnter}
          className="px-16 py-5 bg-white text-slate-900 rounded-full text-lg font-bold hover:bg-gray-100 transition-all shadow-2xl"
        >
          Enter NewsHub
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-12 text-gray-500 text-sm"
        >
          Powered by NewsAPI
        </motion.div>
      </motion.div>
    </div>
  );
}
