'use client';

import React, { useState, useMemo } from 'react';
import { Player } from '@/lib/validations/tournament';
import { generateAmericanoRounds, RoundData } from '@/lib/algorithm/generateAmericanoFixture';
import { MatchCard } from './MatchCard';
import { Leaderboard, LeaderboardEntry } from './Leaderboard';
import { Play, Settings2, Users, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase';

interface SetupFormProps {
  onStart: (players: Player[], courts: number, rounds: number) => void;
  isLoading: boolean;
}

function SetupForm({ onStart, isLoading }: SetupFormProps) {
  const [numPlayers, setNumPlayers] = useState(8);
  const [numCourts, setNumCourts] = useState(2);
  const [players, setPlayers] = useState<Player[]>(
    Array.from({ length: 8 }, (_, i) => ({ id: `p${i + 1}`, name: `Jugador ${i + 1}` }))
  );

  const numRounds = Math.ceil((numPlayers * (numPlayers - 1)) / (4 * numCourts));

  const handleNumPlayersChange = (val: number) => {
    setNumPlayers(val);
    const maxCourts = Math.floor(val / 4);
    if (numCourts > maxCourts) setNumCourts(maxCourts);

    if (val > players.length) {
      setPlayers([
        ...players,
        ...Array.from({ length: val - players.length }, (_, i) => ({
          id: `p${players.length + i + 1}`,
          name: `Jugador ${players.length + i + 1}`
        }))
      ]);
    } else {
      setPlayers(players.slice(0, val));
    }
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index].name = name;
    setPlayers(newPlayers);
  };

  return (
    <div className="mx-auto max-w-3xl rounded-[2rem] bg-white/60 p-8 backdrop-blur-2xl shadow-2xl border border-white/50 dark:bg-slate-900/60 dark:border-slate-700/50">
      <div className="mb-10 text-center">
        <h1 className="bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 bg-clip-text text-6xl font-black text-transparent drop-shadow-sm tracking-tight">
          Liga Beach
        </h1>
        <p className="mt-3 text-lg font-bold text-teal-800 dark:text-teal-200">Configuración del Torneo Americano</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Jugadores</label>
          <select
            value={numPlayers}
            onChange={(e) => handleNumPlayersChange(parseInt(e.target.value) || 8)}
            className="w-full rounded-2xl border-2 border-transparent bg-white/60 p-4 text-center font-bold text-gray-800 shadow-inner outline-none transition focus:border-indigo-500 focus:bg-white dark:bg-gray-800/60 dark:text-white dark:focus:bg-gray-800 appearance-none"
          >
            <option value={8}>8 Jugadores</option>
            <option value={12}>12 Jugadores</option>
            <option value={16}>16 Jugadores</option>
            <option value={20}>20 Jugadores</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Pistas Disp.</label>
          <input
            type="number"
            min="1"
            max={Math.floor(numPlayers / 4)}
            value={numCourts}
            onChange={(e) => setNumCourts(parseInt(e.target.value) || 1)}
            className="w-full rounded-2xl border-2 border-transparent bg-white/60 p-4 text-center font-bold text-gray-800 shadow-inner outline-none transition focus:border-indigo-500 focus:bg-white dark:bg-gray-800/60 dark:text-white dark:focus:bg-gray-800"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Rondas Automáticas</label>
          <div className="w-full rounded-2xl border-2 border-transparent bg-white/40 p-4 text-center font-bold text-gray-500 shadow-inner dark:bg-gray-800/40 dark:text-gray-400">
            {numRounds}
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        <h3 className="flex items-center text-xl font-black text-gray-800 dark:text-gray-100">
          <Users className="mr-2 h-6 w-6 text-indigo-500" /> Participantes
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {players.map((p, i) => (
            <input
              key={p.id}
              type="text"
              value={p.name}
              onChange={(e) => handlePlayerNameChange(i, e.target.value)}
              className="w-full rounded-xl border border-white/50 bg-white/40 p-3 text-sm font-semibold shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800/40"
            />
          ))}
        </div>
      </div>

      <button
        disabled={isLoading}
        onClick={() => onStart(players, numCourts, numRounds)}
        className="mt-10 flex w-full items-center justify-center space-x-3 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 p-6 text-2xl font-black text-white shadow-xl shadow-orange-500/30 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/40 active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
      >
        {isLoading ? (
          <Loader2 className="h-8 w-8 animate-spin" />
        ) : (
          <Play className="h-8 w-8" fill="currentColor" />
        )}
        <span>{isLoading ? 'Conectando...' : '¡A Jugar!'}</span>
      </button>
    </div>
  );
}

export function TournamentDashboard() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [rounds, setRounds] = useState<RoundData[]>([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, { team1: number, team2: number }>>({}); 
  const [tournamentId, setTournamentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleStart = async (setupPlayers: Player[], courts: number, numRounds: number) => {
    setIsLoading(true);
    try {
      // 1. Crear torneo
      const { data: tData, error: tErr } = await supabase
        .from('tournaments')
        .insert({ name: 'Liga Beach Americano', total_courts: courts, status: 'in_progress' })
        .select()
        .single();
      
      if (tErr) throw tErr;
      const tId = tData.id;

      // 2. Insertar jugadores
      const playersToInsert = setupPlayers.map(p => ({ tournament_id: tId, name: p.name }));
      const { data: pData, error: pErr } = await supabase
        .from('players')
        .insert(playersToInsert)
        .select();
        
      if (pErr) throw pErr;

      // 3. Generar fixture con los IDs reales de Supabase
      const dbPlayers = pData.map(p => ({ id: p.id, name: p.name }));
      const generated = generateAmericanoRounds(dbPlayers, courts, numRounds);
      
      // 4. Guardar partidos en DB
      const matchesToInsert: any[] = [];
      generated.forEach(r => {
        r.matches.forEach(m => {
          matchesToInsert.push({
            tournament_id: tId,
            round_number: r.roundNumber,
            court_number: m.courtNumber,
            team_1_p1_id: m.team1[0].id,
            team_1_p2_id: m.team1[1].id,
            team_2_p1_id: m.team2[0].id,
            team_2_p2_id: m.team2[1].id,
            status: 'pending'
          });
        });
      });

      const { error: mErr } = await supabase.from('matches').insert(matchesToInsert);
      if (mErr) throw mErr;

      setTournamentId(tId);
      setPlayers(dbPlayers);
      setRounds(generated);
      setCurrentRoundIndex(0);
      setScores({});
    } catch (e: any) {
      alert(e.message || "Error al conectar con la base de datos de Supabase. Revisa la consola.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScoreSubmit = async (matchIdLocal: string, roundNumber: number, courtNumber: number, s1: number, s2: number) => {
    if (!tournamentId) return;

    try {
      const { error } = await supabase
        .from('matches')
        .update({ score_team_1: s1, score_team_2: s2, status: 'completed' })
        .eq('tournament_id', tournamentId)
        .eq('round_number', roundNumber)
        .eq('court_number', courtNumber);

      if (error) throw error;

      setScores(prev => ({ ...prev, [matchIdLocal]: { team1: s1, team2: s2 } }));
    } catch (e: any) {
      alert("Error guardando el resultado en Supabase: " + e.message);
    }
  };

  const currentRound = rounds[currentRoundIndex];

  const leaderboard = useMemo(() => {
    const entries: Record<string, LeaderboardEntry> = {};
    players.forEach(p => {
      entries[p.id] = { playerId: p.id, playerName: p.name, pointsFor: 0, pointsAgainst: 0, matchesPlayed: 0 };
    });

    rounds.forEach(r => {
      r.matches.forEach(m => {
        const matchId = `${r.roundNumber}-${m.courtNumber}`;
        const sc = scores[matchId];
        if (sc) {
          m.team1.forEach(p => {
            entries[p.id].matchesPlayed += 1;
            entries[p.id].pointsFor += sc.team1;
            entries[p.id].pointsAgainst += sc.team2;
          });
          m.team2.forEach(p => {
            entries[p.id].matchesPlayed += 1;
            entries[p.id].pointsFor += sc.team2;
            entries[p.id].pointsAgainst += sc.team1;
          });
        }
      });
    });
    return Object.values(entries);
  }, [players, rounds, scores]);

  if (rounds.length === 0) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-300 via-sky-100 to-amber-50 p-6 pt-20 md:p-12 dark:from-sky-900 dark:via-blue-950 dark:to-slate-950">
        <SetupForm onStart={handleStart} isLoading={isLoading} />
      </div>
    );
  }

  const isRoundComplete = currentRound.matches.every(
    m => scores[`${currentRound.roundNumber}-${m.courtNumber}`] !== undefined
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-200 via-teal-50 to-amber-50 p-4 text-gray-900 md:p-8 dark:from-sky-900 dark:via-blue-950 dark:to-slate-950 dark:text-gray-100">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div>
            <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-orange-500 drop-shadow-sm tracking-tight">
              Liga Beach Torneo
            </h1>
            <div className="mt-2 inline-block rounded-full bg-orange-100 px-5 py-1.5 text-sm font-black text-orange-600 shadow-sm border border-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-800/50">
              Ronda {currentRound.roundNumber} de {rounds.length}
            </div>
          </div>
          <button 
            onClick={() => {
              setRounds([]);
              setTournamentId(null);
            }}
            className="flex items-center rounded-2xl bg-white px-6 py-3 font-bold text-gray-700 shadow-md border border-gray-100 transition-all hover:bg-gray-50 hover:shadow-lg dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
          >
            <Settings2 className="mr-2 h-5 w-5" /> Terminar / Configurar
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          {/* Matches & Control */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Descansos */}
            {currentRound.restingPlayers.length > 0 && (
              <div className="rounded-3xl bg-gradient-to-r from-orange-50 to-amber-50 p-6 border border-orange-100 shadow-sm dark:from-orange-900/20 dark:to-amber-900/20 dark:border-orange-800/30">
                <h3 className="font-bold text-orange-800 dark:text-orange-400">Jugadores en Descanso:</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {currentRound.restingPlayers.map(p => (
                    <span key={p.id} className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-orange-600 shadow-sm border border-orange-200 dark:bg-gray-800 dark:text-orange-400 dark:border-orange-800/50">
                      {p.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Matches List */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {currentRound.matches.map(m => {
                const matchId = `${currentRound.roundNumber}-${m.courtNumber}`;
                return (
                  <MatchCard
                    key={matchId}
                    courtNumber={m.courtNumber}
                    team1={m.team1}
                    team2={m.team2}
                    status={scores[matchId] ? 'completed' : 'pending'}
                    initialScore={scores[matchId]}
                    onScoreSubmit={(s1, s2) => handleScoreSubmit(matchId, currentRound.roundNumber, m.courtNumber, s1, s2)}
                  />
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8">
              <button
                disabled={currentRoundIndex === 0}
                onClick={() => setCurrentRoundIndex(c => c - 1)}
                className="rounded-2xl bg-white px-8 py-4 font-bold text-gray-700 shadow-md border border-gray-100 transition-all hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
              >
                Anterior
              </button>
              
              {isRoundComplete && currentRoundIndex < rounds.length - 1 && (
                <button
                  onClick={() => setCurrentRoundIndex(c => c + 1)}
                  className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-10 py-4 font-black text-white shadow-xl shadow-orange-500/30 transition-all hover:scale-105 hover:shadow-orange-500/50 active:scale-95"
                >
                  Siguiente Ronda
                </button>
              )}

              <button
                disabled={currentRoundIndex === rounds.length - 1}
                onClick={() => setCurrentRoundIndex(c => c + 1)}
                className="rounded-2xl bg-white px-8 py-4 font-bold text-gray-700 shadow-md border border-gray-100 transition-all hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
              >
                Adelantar
              </button>
            </div>

          </div>

          {/* Leaderboard */}
          <div className="xl:col-span-1">
            <div className="sticky top-8">
              <Leaderboard entries={leaderboard} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
