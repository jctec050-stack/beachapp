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
    <div className="rounded-lg bg-white p-5 border border-gray-200 shadow-sm">
      <div className="mb-5 flex items-center space-x-2">
        <Trophy className="h-5 w-5 text-gray-700" />
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">
          Clasificación
        </h2>
      </div>

      <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-200">
            <tr>
              <th className="px-3 py-3 text-center font-semibold">#</th>
              <th className="px-3 py-3 font-semibold">Jugador</th>
              <th className="px-2 py-3 text-center font-semibold">PJ</th>
              <th className="px-2 py-3 text-center font-semibold">PTS</th>
              <th className="px-2 py-3 text-center font-semibold">DIF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((entry, index) => {
              const diff = entry.pointsFor - entry.pointsAgainst;
              return (
                <tr
                  key={entry.playerId}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-3 py-3 text-center font-medium">
                    {index === 0 && <Medal className="mx-auto h-5 w-5 text-yellow-500" />}
                    {index === 1 && <Medal className="mx-auto h-5 w-5 text-gray-400" />}
                    {index === 2 && <Medal className="mx-auto h-5 w-5 text-amber-700" />}
                    {index > 2 && <span className="text-gray-500">{index + 1}</span>}
                  </td>
                  <td className="px-3 py-3 font-medium text-gray-900">{entry.playerName}</td>
                  <td className="px-2 py-3 text-center text-gray-600">{entry.matchesPlayed}</td>
                  <td className="px-2 py-3 text-center text-sm font-bold text-gray-900">
                    {entry.pointsFor}
                  </td>
                  <td className={`px-2 py-3 text-center font-medium text-xs ${diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-400'}`}>
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
