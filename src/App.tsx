import { useState, useEffect } from 'react';
import { Gamepad2, Search, Maximize2, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';
import { Game } from './types';

export default function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  useEffect(() => {
    setGames(gamesData as Game[]);
  }, []);

  const filteredGames = games.filter((game: Game) =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedGame(null)}>
            <div className="p-2 bg-emerald-500 rounded-lg">
              <Gamepad2 className="w-6 h-6 text-zinc-950" />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">
              UNBLOCKED<span className="text-emerald-500">GAMES</span>
            </h1>
          </div>

          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
            />
          </div>

          <div className="flex items-center gap-4 text-sm font-medium text-zinc-400">
            <span className="hidden md:block">v1.0.0</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!selectedGame ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            >
              {filteredGames.map((game: Game) => (
                <motion.div
                  key={game.id}
                  layoutId={game.id}
                  onClick={() => setSelectedGame(game)}
                  className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-emerald-500/50 transition-all cursor-pointer"
                  whileHover={{ y: -4 }}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={game.thumbnail}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm truncate group-hover:text-emerald-400 transition-colors">
                      {game.title}
                    </h3>
                  </div>
                  <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
              {filteredGames.length === 0 && (
                <div className="col-span-full py-20 text-center text-zinc-500">
                  <p>No games found matching "{searchQuery}"</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedGame(null)}
                  className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  Back to Hub
                </button>
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold">{selectedGame.title}</h2>
                  <button 
                    onClick={() => {
                      const iframe = document.getElementById('game-iframe') as HTMLIFrameElement | null;
                      if (iframe && iframe.requestFullscreen) iframe.requestFullscreen();
                    }}
                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
                <iframe
                  id="game-iframe"
                  src={selectedGame.iframeUrl}
                  className="w-full h-full border-none"
                  allow="fullscreen; autoplay; encrypted-media"
                  title={selectedGame.title}
                />
              </div>

              <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
                <h3 className="text-lg font-semibold mb-2">About {selectedGame.title}</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Enjoy playing {selectedGame.title} directly in your browser. This game is hosted via an iframe for easy access. 
                  If the game doesn't load, it might be blocked by your network or the source might be down.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-auto py-12 border-t border-zinc-900 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-4 text-center text-zinc-500 text-sm">
          <p>© 2026 Unblocked Games Hub. All games are property of their respective owners.</p>
          <p className="mt-2">Built for fun and accessibility.</p>
        </div>
      </footer>
    </div>
  );
}
