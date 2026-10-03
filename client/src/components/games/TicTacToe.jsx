import { useState, useEffect, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import useStoredState from './useStoredState';

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

const MODES = [
  { id: 'easy', label: 'vs Computer (Easy)' },
  { id: 'hard', label: 'vs Computer (Hard)' },
  { id: 'two', label: '2 Players' },
];

const INITIAL_SCORES = { X: 0, O: 0, draws: 0 };

function getWinner(board) {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], line: [a, b, c] };
    }
  }
  return null;
}

const emptyCells = (board) => board.map((v, i) => (v ? null : i)).filter((i) => i !== null);

// Minimax: computer plays "O", human plays "X". Unbeatable.
function minimax(board, isComputerTurn) {
  const result = getWinner(board);
  if (result) return result.player === 'O' ? 1 : -1;
  const moves = emptyCells(board);
  if (moves.length === 0) return 0;

  const scores = moves.map((m) => {
    const next = board.slice();
    next[m] = isComputerTurn ? 'O' : 'X';
    return minimax(next, !isComputerTurn);
  });
  return isComputerTurn ? Math.max(...scores) : Math.min(...scores);
}

function bestMove(board) {
  let best = -Infinity;
  let move = emptyCells(board)[0];
  for (const m of emptyCells(board)) {
    const next = board.slice();
    next[m] = 'O';
    const score = minimax(next, false);
    if (score > best) {
      best = score;
      move = m;
    }
  }
  return move;
}

function randomMove(board) {
  const moves = emptyCells(board);
  return moves[Math.floor(Math.random() * moves.length)];
}

export default function TicTacToe() {
  const [mode, setMode] = useState('hard');
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useStoredState('notesx:games:ttt', INITIAL_SCORES);

  const result = getWinner(board);
  const isDraw = !result && board.every(Boolean);
  const gameOver = Boolean(result) || isDraw;
  const vsComputer = mode !== 'two';
  const computerThinking = vsComputer && !xIsNext && !gameOver;

  const recordResult = useCallback((nextBoard) => {
    const r = getWinner(nextBoard);
    if (r) setScores((s) => ({ ...s, [r.player]: s[r.player] + 1 }));
    else if (nextBoard.every(Boolean)) setScores((s) => ({ ...s, draws: s.draws + 1 }));
  }, [setScores]);

  const place = useCallback((index, player) => {
    if (board[index]) return;
    const next = board.slice();
    next[index] = player;
    setBoard(next);
    setXIsNext(player === 'O');
    recordResult(next);
  }, [board, recordResult]);

  const handleClick = (index) => {
    if (board[index] || gameOver || computerThinking) return;
    place(index, xIsNext ? 'X' : 'O');
  };

  // Computer's turn
  useEffect(() => {
    if (!computerThinking) return undefined;
    const timer = setTimeout(() => {
      const move = mode === 'hard' ? bestMove(board) : randomMove(board);
      place(move, 'O');
    }, 450);
    return () => clearTimeout(timer);
  }, [computerThinking, board, mode, place]);

  const newGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  const changeMode = (id) => {
    setMode(id);
    newGame();
  };

  const names = vsComputer ? { X: 'You', O: 'Computer' } : { X: 'Player X', O: 'Player O' };

  const status = result
    ? `${names[result.player]} ${vsComputer && result.player === 'X' ? 'win' : 'wins'}!`
    : isDraw
      ? "It's a draw!"
      : computerThinking
        ? 'Computer is thinking…'
        : `${names[xIsNext ? 'X' : 'O']}${vsComputer ? ' — your turn' : "'s turn"}`;

  const winningLine = result?.line ?? [];

  return (
    <div className="space-y-6">
      {/* Mode selector */}
      <div role="group" aria-label="Game mode" className="flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={mode === m.id}
            onClick={() => changeMode(m.id)}
            className={`h-10 px-4 rounded-xl border text-sm font-semibold transition cursor-pointer ${
              mode === m.id
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Scoreboard */}
      <dl className="grid grid-cols-3 gap-3">
        {[
          { label: names.X + ' (X)', value: scores.X },
          { label: 'Draws', value: scores.draws },
          { label: names.O + ' (O)', value: scores.O },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-center">
            <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400">{s.label}</dt>
            <dd className="mt-0.5 text-2xl font-extrabold text-slate-900 dark:text-white">{s.value}</dd>
          </div>
        ))}
      </dl>

      {/* Board */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 sm:p-8">
        <p role="status" aria-live="polite" className="mb-5 text-center text-base font-bold text-slate-800 dark:text-slate-100">
          {status}
        </p>

        <div className="mx-auto grid max-w-[330px] grid-cols-3 gap-2 sm:gap-3" role="grid" aria-label="Tic-tac-toe board">
          {board.map((cell, i) => {
            const isWinning = winningLine.includes(i);
            return (
              <button
                key={i}
                type="button"
                role="gridcell"
                onClick={() => handleClick(i)}
                disabled={Boolean(cell) || gameOver || computerThinking}
                aria-label={`Row ${Math.floor(i / 3) + 1}, column ${(i % 3) + 1}: ${cell ?? 'empty'}`}
                className={`aspect-square rounded-2xl border text-4xl sm:text-5xl font-extrabold transition flex items-center justify-center ${
                  isWinning
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-400'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                } ${!cell && !gameOver && !computerThinking ? 'hover:bg-indigo-50 dark:hover:bg-slate-700 cursor-pointer' : 'cursor-default'} ${
                  cell === 'X' ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {cell}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => setScores(INITIAL_SCORES)}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold transition cursor-pointer"
        >
          Reset score
        </button>
        <button
          type="button"
          onClick={newGame}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition cursor-pointer"
        >
          <RotateCcw size={15} aria-hidden="true" /> New game
        </button>
      </div>
    </div>
  );
}
