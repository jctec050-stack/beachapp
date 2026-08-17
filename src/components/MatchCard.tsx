import React, { useState } from 'react';
import { Player, MatchScoreSchema } from '@/lib/validations/tournament';
import { Trophy, Swords } from 'lucide-react';

interface MatchCardProps {
  courtNumber: number;
  team1: [Player, Player];
  team2: [Player, Player];
  onScoreSubmit: (score1: number, score2: number) => void;
  status: 'pending' | 'completed';
  initialScore?: { team1: number; team2: number };
}

export function MatchCard({ courtNumber, team1, team2, onScoreSubmit, status, initialScore }: MatchCardProps) {
  const [s1, setS1] = useState(initialScore?.team1?.toString() || '');
  const [s2, setS2] = useState(initialScore?.team2?.toString() || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const num1 = parseInt(s1, 10);
    const num2 = parseInt(s2, 10);

    if (isNaN(num1) || isNaN(num2)) {
      setError("Ingresa ambos marcadores");
      return;
    }

    const result = MatchScoreSchema.safeParse({ scoreTeam1: num1, scoreTeam2: num2 });
    if (!result.success) {
      setError(result.error.issues[0]?.message || "Error de validación");
      return;
    }

    onScoreSubmit(num1, num2);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white/60 backdrop-blur-xl border border-white/60 p-6 shadow-xl transition-all hover:shadow-2xl dark:bg-slate-800/60 dark:border-slate-700/50">
      <div className="absolute top-0 right-0 rounded-bl-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-1.5 text-xs font-black text-white shadow-md">
        Pista {courtNumber}
      </div>

      <div className="mt-2 flex items-center justify-between space-x-4">
        {/* Team 1 */}
        <div className="flex-1 text-center">
          <div className="flex flex-col items-center space-y-1">
            <span className="font-bold text-gray-800 dark:text-gray-100">{team1[0].name}</span>
            <span className="text-xs text-orange-500 dark:text-orange-400 font-black">&amp;</span>
            <span className="font-bold text-gray-800 dark:text-gray-100">{team1[1].name}</span>
          </div>
        </div>

        {/* VS */}
        <div className="flex flex-col items-center justify-center">
          <Swords className="h-6 w-6 text-gray-400" />
          <span className="mt-1 text-xs font-bold uppercase text-gray-500">VS</span>
        </div>

        {/* Team 2 */}
        <div className="flex-1 text-center">
          <div className="flex flex-col items-center space-y-1">
            <span className="font-bold text-gray-800 dark:text-gray-100">{team2[0].name}</span>
            <span className="text-xs text-orange-500 dark:text-orange-400 font-black">&amp;</span>
            <span className="font-bold text-gray-800 dark:text-gray-100">{team2[1].name}</span>
          </div>
        </div>
      </div>

      {status === 'pending' ? (
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="flex items-center justify-center space-x-6">
            <input
              type="number"
              min="0"
              max="7"
              value={s1}
              onChange={(e) => setS1(e.target.value)}
              className="w-24 h-24 rounded-3xl border-4 border-transparent bg-white/80 p-2 text-center text-5xl font-black shadow-inner focus:border-emerald-500 focus:bg-white focus:outline-none dark:bg-slate-700/80 dark:text-white dark:focus:bg-slate-600 transition-all"
              placeholder="0"
            />
            <span className="text-2xl font-black text-gray-300">-</span>
            <input
              type="number"
              min="0"
              max="7"
              value={s2}
              onChange={(e) => setS2(e.target.value)}
              className="w-24 h-24 rounded-3xl border-4 border-transparent bg-white/80 p-2 text-center text-5xl font-black shadow-inner focus:border-emerald-500 focus:bg-white focus:outline-none dark:bg-slate-700/80 dark:text-white dark:focus:bg-slate-600 transition-all"
              placeholder="0"
            />
          </div>
          {error && <p className="mt-3 text-center text-sm font-bold text-red-500">{error}</p>}
          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 py-4 text-lg font-black text-white shadow-xl shadow-emerald-500/30 transition-all hover:scale-105 hover:shadow-emerald-500/50 active:scale-95"
          >
            Guardar Resultado
          </button>
        </form>
      ) : (
        <div className="mt-6 flex flex-col items-center justify-center">
          <div className="flex items-center space-x-6 text-6xl font-black tracking-tighter">
            <span className={initialScore?.team1! > initialScore?.team2! ? "text-emerald-500 drop-shadow-md" : "text-gray-400"}>
              {initialScore?.team1}
            </span>
            <span className="text-gray-300 text-4xl">-</span>
            <span className={initialScore?.team2! > initialScore?.team1! ? "text-emerald-500 drop-shadow-md" : "text-gray-400"}>
              {initialScore?.team2}
            </span>
          </div>
          <div className="mt-3 flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <Trophy className="mr-1 h-3 w-3" /> Completado
          </div>
        </div>
      )}
    </div>
  );
}
