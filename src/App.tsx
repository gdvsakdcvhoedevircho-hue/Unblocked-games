import { useState, useEffect } from 'react';
import { Gamepad2, Search, X, Maximize2, ChevronLeft, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import gamesData from './games.json';
import { Game } from './types';

export default function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Handle potential default export from JSON import
    const data = Array.isArray(gamesData) ? gamesData : (gamesData as any).default || [];
    setGames(data as Game[]);
    setIsLoaded(true);
  }, []);

  const categories = ['All', ...new Set(games.map(game => game.category))];

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-lg">
              <Gamepad2 className="w-6 h-6 text-zinc-950" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">UNBLOCKED<span className="text-emerald-500">HUB</span></h1>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="max-w-7xl mx-auto mt-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-emerald-500 text-zinc-950'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="px-6 py-12 md:py-20 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
            Play Anywhere, <span className="text-emerald-500">Anytime.</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Access your favorite games without restrictions. Fast, free, and always unblocked.
          </p>
        </motion.div>
      </header>

      {/* Games Grid */}
      <main className="px-6 pb-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredGames.map((game, index) => (
              <motion.div
                layout
                key={game.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-emerald-500/50 transition-all cursor-pointer shadow-lg hover:shadow-emerald-500/10"
                onClick={() => setSelectedGame(game)}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-lg group-hover:text-emerald-400 transition-colors">{game.title}</h3>
                    {game.isFeatured && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-500 text-zinc-950 rounded uppercase tracking-wider">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-1 bg-zinc-800 rounded-md text-zinc-400">{game.category}</span>
                    <span className="text-xs font-medium px-2 py-1 bg-zinc-800 rounded-md text-zinc-400">Web</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors pointer-events-none" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredGames.length === 0 && isLoaded && (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg">No games found matching "{searchQuery}"</p>
          </div>
        )}
      </main>

      {/* Game Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-6xl h-full max-h-[90vh] bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedGame(null)}
                    className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-xl font-bold">{selectedGame.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={selectedGame.iframeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <button
                    onClick={() => setSelectedGame(null)}
                    className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Game Frame */}
              <div className="flex-1 bg-black relative">
                <iframe
                  src={selectedGame.iframeUrl}
                  className="w-full h-full border-none"
                  allow="fullscreen; autoplay; encrypted-media"
                  title={selectedGame.title}
                />
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-zinc-900/50 flex items-center justify-between">
                <p className="text-sm text-zinc-500 italic">
                  Note: Some games may require a keyboard to play.
                </p>
                <button 
                  className="flex items-center gap-2 text-sm font-bold text-emerald-500 hover:text-emerald-400 transition-colors"
                  onClick={() => {
                    const iframe = document.querySelector('iframe');
                    if (iframe?.requestFullscreen) iframe.requestFullscreen();
                  }}
                >
                  <Maximize2 className="w-4 h-4" />
                  FULLSCREEN
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 opacity-50">
            <Gamepad2 className="w-5 h-5" />
            <span className="font-bold tracking-tight">UNBLOCKEDHUB</span>
          </div>
          <p className="text-zinc-500 text-sm">
            © 2026 Unblocked Games Hub. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-zinc-400">
            <a href="#" className="hover:text-emerald-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
