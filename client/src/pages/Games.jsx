import { Link, useParams, Navigate } from 'react-router-dom';
import { Gamepad2, ArrowLeft, Hand, Grid3x3, Brain, Hash, Type, Lock } from 'lucide-react';
import RockPaperScissors from '../components/games/RockPaperScissors';
import TicTacToe from '../components/games/TicTacToe';

const GAMES = [
  {
    id: 'rock-paper-scissors',
    title: 'Rock Paper Scissors',
    description: 'Beat the computer and build the longest winning streak.',
    icon: Hand,
    accent: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    players: '1 player',
    component: RockPaperScissors,
  },
  {
    id: 'tic-tac-toe',
    title: 'Tic-Tac-Toe',
    description: 'Play a friend, or take on the computer on easy or hard.',
    icon: Grid3x3,
    accent: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
    players: '1–2 players',
    component: TicTacToe,
  },
];

const COMING_SOON = [
  { title: 'Memory Match', description: 'Flip cards and match the pairs.', icon: Brain },
  { title: '2048', description: 'Slide and merge tiles to reach 2048.', icon: Hash },
  { title: 'Word Guess', description: 'Guess the CS term before you run out of tries.', icon: Type },
];

export default function Games() {
  const { gameId } = useParams();

  // Single game view
  if (gameId) {
    const game = GAMES.find((g) => g.id === gameId);
    if (!game) return <Navigate to="/games" replace />;
    const GameComponent = game.component;
    const Icon = game.icon;

    return (
      <div className="max-w-3xl mx-auto">
        <Link
          to="/games"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-700 mb-4"
        >
          <ArrowLeft size={16} aria-hidden="true" /> All games
        </Link>
        <div className="flex items-center gap-3 mb-6">
          <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${game.accent}`}>
            <Icon size={22} aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{game.title}</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">{game.description}</p>
          </div>
        </div>
        <GameComponent />
      </div>
    );
  }

  // Hub
  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Gamepad2 size={22} aria-hidden="true" />
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Game Zone</h1>
        </div>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Take a study break. Pick a game, play, and beat your own high score.
        </p>
      </header>

      <section aria-labelledby="play-now">
        <h2 id="play-now" className="text-lg font-bold text-slate-900 dark:text-white mb-3">Play now</h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {GAMES.map((game) => {
            const Icon = game.icon;
            return (
              <li key={game.id}>
                <Link
                  to={`/games/${game.id}`}
                  className="group flex h-full flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 transition hover:border-indigo-300 hover:shadow-md"
                >
                  <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${game.accent}`}>
                    <Icon size={24} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{game.title}</h3>
                  <p className="mt-1 flex-1 text-sm text-slate-600 dark:text-slate-300">{game.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{game.players}</span>
                    <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 group-hover:underline">Play →</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="coming-soon" className="mt-10">
        <h2 id="coming-soon" className="text-lg font-bold text-slate-900 dark:text-white mb-3">Coming soon</h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {COMING_SOON.map((game) => {
            const Icon = game.icon;
            return (
              <li
                key={game.title}
                className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <Lock size={12} aria-hidden="true" /> Soon
                  </span>
                </div>
                <h3 className="mt-3 font-bold text-slate-800 dark:text-slate-100">{game.title}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{game.description}</p>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
