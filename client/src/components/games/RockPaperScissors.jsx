import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import useStoredState from './useStoredState';

const CHOICES = [
  { id: 'rock', label: 'Rock', emoji: '✊', beats: 'scissors' },
  { id: 'paper', label: 'Paper', emoji: '✋', beats: 'rock' },
  { id: 'scissors', label: 'Scissors', emoji: '✌️', beats: 'paper' },
];

const byId = (id) => CHOICES.find((c) => c.id === id);

const INITIAL_SCORE = { wins: 0, losses: 0, draws: 0, streak: 0, bestStreak: 0 };

function getOutcome(player, computer) {
  if (player === computer) return 'draw';
  return byId(player).beats === computer ? 'win' : 'lose';
}

export default function RockPaperScissors() {
  const [score, setScore] = useStoredState('notesx:games:rps', INITIAL_SCORE);
  const [round, setRound] = useState(null); // { player, computer, outcome }

  const play = (playerChoice) => {
    const computerChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)].id;
    const outcome = getOutcome(playerChoice, computerChoice);
    setRound({ player: playerChoice, computer: computerChoice, outcome });

    setScore((prev) => {
      const streak = outcome === 'win' ? prev.streak + 1 : outcome === 'lose' ? 0 : prev.streak;
      return {
        wins: prev.wins + (outcome === 'win' ? 1 : 0),
        losses: prev.losses + (outcome === 'lose' ? 1 : 0),
        draws: prev.draws + (outcome === 'draw' ? 1 : 0),
        streak,
        bestStreak: Math.max(prev.bestStreak, streak),
      };
    });
  };

  const resetAll = () => {
    setScore(INITIAL_SCORE);
    setRound(null);
  };

  const message = !round
    ? 'Pick your move to start the round.'
    : round.outcome === 'win'
      ? `You win! ${byId(round.player).label} beats ${byId(round.computer).label}.`
      : round.outcome === 'lose'
        ? `You lose. ${byId(round.computer).label} beats ${byId(round.player).label}.`
        : `It's a draw — you both chose ${byId(round.player).label}.`;

  const messageTone = !round
    ? 'text-slate-600 dark:text-slate-300'
    : round.outcome === 'win'
      ? 'text-emerald-700 dark:text-emerald-400'
      : round.outcome === 'lose'
        ? 'text-rose-700 dark:text-rose-400'
        : 'text-amber-700 dark:text-amber-400';

  const stats = [
    { label: 'Wins', value: score.wins },
    { label: 'Losses', value: score.losses },
    { label: 'Draws', value: score.draws },
    { label: 'Streak', value: score.streak },
    { label: 'Best streak', value: score.bestStreak },
  ];

  return (
    <div className="space-y-6">
      {/* Scoreboard */}
      <dl className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-center">
            <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400">{s.label}</dt>
            <dd className="mt-0.5 text-2xl font-extrabold text-slate-900 dark:text-white">{s.value}</dd>
          </div>
        ))}
      </dl>

      {/* Arena */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 sm:p-8">
        <div className="grid grid-cols-3 items-center gap-2 text-center">
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">You</p>
            <div className="mt-2 text-6xl sm:text-7xl" aria-hidden="true">{round ? byId(round.player).emoji : '❔'}</div>
          </div>
          <div className="text-xl font-extrabold text-slate-400">VS</div>
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Computer</p>
            <div className="mt-2 text-6xl sm:text-7xl" aria-hidden="true">{round ? byId(round.computer).emoji : '❔'}</div>
          </div>
        </div>

        <p role="status" aria-live="polite" className={`mt-6 text-center text-base font-bold ${messageTone}`}>
          {message}
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
          {CHOICES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => play(c.id)}
              className="flex flex-col items-center gap-1 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:border-indigo-300 py-4 transition cursor-pointer focus-visible:outline-2 focus-visible:outline-indigo-600"
            >
              <span className="text-4xl" aria-hidden="true">{c.emoji}</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={resetAll}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold transition cursor-pointer"
        >
          <RotateCcw size={15} aria-hidden="true" /> Reset score
        </button>
      </div>
    </div>
  );
}
