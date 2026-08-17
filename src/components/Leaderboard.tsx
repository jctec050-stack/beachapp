import React from 'react';
import { Trophy, Medal } from 'lucide-react';

export interface LeaderboardEntry {
  playerId: string;
  playerName: string;
  pointsFor: number;
  pointsAgainst: number;
  matchesPlayed: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export function Leaderboard({ entries }: LeaderboardProps) {
  // Sort by Points For DESC, Matches Played DESC, Diff DESC
  const sorted = [...entries].sort((a, b) => {
    if (b.pointsFor !== a.pointsFor) return b.pointsFor - a.pointsFor;
    if (b.matchesPlayed !== a.matchesPlayed) return b.matchesPlayed - a.matchesPlayed;
    const diffA = a.pointsFor - a.pointsAgainst;
    const diffB = b.pointsFor - b.pointsAgainst;
    return diffB - diffA;
  });

  return (
    <div className="rounded-3xl bg-white/60 p-6 backdrop-blur-xl border border-white/60 shadow-2xl dark:bg-slate-800/60 dark:border-slate-700/50">
      <div className="mb-6 flex items-center space-x-3">
        <Trophy className="h-8 w-8 text-yellow-500 drop-shadow-md" />
        <h2 className="bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-2xl font-black text-transparent tracking-tight">
          Clasificación
        </h2>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/50 bg-white/50 shadow-inner dark:border-slate-700/50 dark:bg-slate-900/50">
        <table className="w-full text-left text-sm text-slate-800 dark:text-slate-200">
          <thead className="bg-slate-100/80 text-xs uppercase text-slate-800 dark:bg-slate-950/80 dark:text-slate-400">
            <tr>
              <th className="px-4 py-4 text-center font-bold">#</th>
              <th className="px-4 py-4 font-bold">Jugador</th>
              <th className="px-3 py-4 text-center font-bold">PJ</th>
              <th className="px-3 py-4 text-center font-bold">PTS</th>
              <th className="px-3 py-4 text-center font-bold">DIF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
            {sorted.map((entry, index) => {
              const diff = entry.pointsFor - entry.pointsAgainst;
              return (
                <tr
                  key={entry.playerId}
                  className="transition-colors hover:bg-white/80 dark:hover:bg-slate-800/80"
                >
                  <td className="px-4 py-4 text-center font-bold">
                    {index === 0 && <Medal className="mx-auto h-6 w-6 text-yellow-400 drop-shadow-md" />}
                    {index === 1 && <Medal className="mx-auto h-6 w-6 text-slate-400 drop-shadow-md" />}
                    {index === 2 && <Medal className="mx-auto h-6 w-6 text-amber-600 drop-shadow-md" />}
                    {index > 2 && <span className="text-slate-500">{index + 1}</span>}
                  </td>
                  <td className="px-4 py-4 font-bold">{entry.playerName}</td>
                  <td className="px-3 py-4 text-center font-semibold">{entry.matchesPlayed}</td>
                  <td className="px-3 py-4 text-center text-base font-black text-teal-600 dark:text-teal-400">
                    {entry.pointsFor}
                  </td>
                  <td className={`px-3 py-4 text-center font-bold ${diff > 0 ? 'text-emerald-500' : diff < 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                    {diff > 0 ? '+' : ''}{diff}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
