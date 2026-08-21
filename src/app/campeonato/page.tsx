'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Leaderboard, LeaderboardEntry } from '@/components/Leaderboard';
import { Loader2 } from 'lucide-react';

export default function CampeonatoPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from('championship_standings')
          .select('*');

        if (fetchError) throw fetchError;

        if (data) {
          const mappedEntries: LeaderboardEntry[] = data.map((d: any) => ({
            playerId: d.player_name, 
            playerName: d.player_name,
            pointsFor: d.total_points_for || 0,
            pointsAgainst: d.total_points_against || 0,
            matchesPlayed: d.total_matches_played || 0
          }));
          setEntries(mappedEntries);
        }
      } catch (err: any) {
        console.error(err);
        setError("Error al cargar el historial del campeonato. ¿Está conectada la base de datos?");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStandings();
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Historial de Campeonato</h1>
        <p className="mt-2 text-gray-500">Acumulado de puntos de todos los torneos realizados en la liga.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : error ? (
        <div className="rounded-md bg-red-50 p-4 border border-red-200 text-red-700">
          {error}
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-md bg-gray-50 p-8 text-center text-gray-500 border border-gray-200">
          Aún no hay datos de torneos completados para mostrar en el campeonato.
        </div>
      ) : (
        <Leaderboard entries={entries} />
      )}
    </div>
  );
}
