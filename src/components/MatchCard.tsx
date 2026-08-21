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
    <div className="rounded-lg bg-white border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Pista {courtNumber}
        </span>
        {status === 'completed' && (
          <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
            <Trophy className="mr-1 h-3 w-3" /> Completado
          </span>
        )}
      </div>

      <div className="flex items-center justify-between space-x-2">
        {/* Team 1 */}
        <div className="flex-1 text-center">
          <div className="flex flex-col items-center">
            <span className="font-semibold text-gray-900 text-sm">{team1[0].name}</span>
            <span className="text-xs text-gray-400 my-0.5">&amp;</span>
            <span className="font-semibold text-gray-900 text-sm">{team1[1].name}</span>
          </div>
        </div>

        {/* VS */}
        <div className="flex flex-col items-center justify-center px-2">
          <Swords className="h-4 w-4 text-gray-300" />
          <span className="mt-1 text-[10px] font-bold text-gray-400">VS</span>
        </div>

        {/* Team 2 */}
        <div className="flex-1 text-center">
          <div className="flex flex-col items-center">
            <span className="font-semibold text-gray-900 text-sm">{team2[0].name}</span>
            <span className="text-xs text-gray-400 my-0.5">&amp;</span>
            <span className="font-semibold text-gray-900 text-sm">{team2[1].name}</span>
          </div>
        </div>
      </div>

      {status === 'pending' ? (
        <form onSubmit={handleSubmit} className="mt-5">
          <div className="flex items-center justify-center space-x-4">
            <input
              type="number"
              min="0"
              max="7"
              value={s1}
              onChange={(e) => setS1(e.target.value)}
              className="w-16 h-16 rounded-md border border-gray-300 bg-gray-50 p-2 text-center text-2xl font-bold focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="0"
            />
            <span className="text-lg font-bold text-gray-300">-</span>
            <input
              type="number"
              min="0"
              max="7"
              value={s2}
              onChange={(e) => setS2(e.target.value)}
              className="w-16 h-16 rounded-md border border-gray-300 bg-gray-50 p-2 text-center text-2xl font-bold focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
          {error && <p className="mt-2 text-center text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            className="mt-4 w-full rounded-md bg-gray-900 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-gray-800 active:bg-gray-700"
          >
            Guardar
          </button>
        </form>
      ) : (
        <div className="mt-5 flex flex-col items-center justify-center">
          <div className="flex items-center space-x-4 text-3xl font-bold">
            <span className={initialScore?.team1! > initialScore?.team2! ? "text-gray-900" : "text-gray-400"}>
              {initialScore?.team1}
            </span>
            <span className="text-gray-300 text-xl">-</span>
            <span className={initialScore?.team2! > initialScore?.team1! ? "text-gray-900" : "text-gray-400"}>
              {initialScore?.team2}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
