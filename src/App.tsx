import { useState, useEffect } from 'react';
import { Gamepad2, Search, Maximize2, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';
import { Game } from './types';

export default function App() {
  console.log('App component rendering');
  const [games, setGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  useEffect(() => {
    console.log('App mounted, loading games data:', gamesData);
    const data = Array.isArray(gamesData) ? gamesData : (gamesData as any).default || [];
    setGames(data as Game[]);
  }, []);

  const filteredGames = games.filter((game: Game) =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">Unblocked Games Hub</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
        {filteredGames.map((game) => (
          <div 
            key={game.id} 
            className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 hover:border-emerald-500 cursor-pointer transition-all"
            onClick={() => setSelectedGame(game)}
          >
            <img src={game.thumbnail} alt={game.title} className="w-full aspect-video object-cover rounded-lg mb-2" referrerPolicy="no-referrer" />
            <h2 className="font-semibold">{game.title}</h2>
          </div>
        ))}
      </div>
      
      {selectedGame && (
        <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center p-4 z-50">
          <button onClick={() => setSelectedGame(null)} className="absolute top-4 left-4 text-white">Back</button>
          <h2 className="text-2xl font-bold mb-4">{selectedGame.title}</h2>
          <iframe src={selectedGame.iframeUrl} className="w-full max-w-4xl aspect-video bg-white rounded-xl" />
        </div>
      )}
    </div>
  );
}
