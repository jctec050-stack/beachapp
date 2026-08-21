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
    <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-sm border border-gray-200">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Configuración del Torneo
        </h1>
        <p className="mt-2 text-sm text-gray-500">Formato Americano</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">Jugadores</label>
          <input
            type="number"
            min="4"
            step="4"
            value={numPlayers}
            onChange={(e) => handleNumPlayersChange(parseInt(e.target.value) || 8)}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-center text-gray-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">Pistas Disp.</label>
          <input
            type="number"
            min="1"
            max={Math.floor(numPlayers / 4)}
            value={numCourts}
            onChange={(e) => setNumCourts(parseInt(e.target.value) || 1)}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-center text-gray-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">Rondas Automáticas</label>
          <div className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-center text-gray-500 shadow-sm">
            {numRounds}
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <h3 className="flex items-center text-lg font-bold text-gray-800">
          <Users className="mr-2 h-5 w-5 text-gray-500" /> Participantes
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {players.map((p, i) => (
            <input
              key={p.id}
              type="text"
              value={p.name}
              onChange={(e) => handlePlayerNameChange(i, e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white p-2.5 text-sm font-medium shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          ))}
        </div>
      </div>

      <button
        disabled={isLoading}
        onClick={() => onStart(players, numCourts, numRounds)}
        className="mt-10 flex w-full items-center justify-center space-x-2 rounded-lg bg-blue-600 p-4 text-lg font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:bg-blue-800 disabled:opacity-70 disabled:hover:bg-blue-600"
      >
        {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Play className="h-6 w-6" fill="currentColor" />}
        <span>{isLoading ? 'Conectando...' : 'Comenzar Torneo'}</span>
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
      // 1. Create tournament
      const { data: tData, error: tErr } = await supabase
        .from('tournaments')
        .insert({ name: 'Liga Beach Torneo', total_courts: courts, status: 'in_progress' })
        .select()
        .single();
      
      if (tErr) throw tErr;
      const tId = tData.id;

      // 2. Insert players
      const playersToInsert = setupPlayers.map(p => ({ tournament_id: tId, name: p.name }));
      const { data: pData, error: pErr } = await supabase
        .from('players')
        .insert(playersToInsert)
        .select();
        
      if (pErr) throw pErr;

      // 3. Generate fixture with Supabase real IDs
      const dbPlayers = pData.map(p => ({ id: p.id, name: p.name }));
      const generated = generateAmericanoRounds(dbPlayers, courts, numRounds);
      
      // 4. Save matches in DB
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
      alert("Error al conectar con Supabase. Asegúrate de tener .env.local configurado o la base de datos corriendo.\n\n" + e.message);
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
      <div className="w-full flex items-start justify-center pt-10">
        <SetupForm onStart={handleStart} isLoading={isLoading} />
      </div>
    );
  }

  const isRoundComplete = currentRound.matches.every(
    m => scores[`${currentRound.roundNumber}-${m.courtNumber}`] !== undefined
  );

  return (
    <div className="w-full text-gray-900">
      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Panel del Torneo
          </h1>
          <div className="mt-1 inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-700 border border-blue-100">
            Ronda {currentRound.roundNumber} de {rounds.length}
          </div>
        </div>
        <button 
          onClick={() => {
            if(confirm('¿Seguro que deseas terminar o reconfigurar el torneo? Se perderá el progreso.')) {
              setRounds([]);
              setTournamentId(null);
            }
          }}
          className="flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-300 transition-all hover:bg-gray-50"
        >
          <Settings2 className="mr-2 h-4 w-4" /> Configurar Nuevo Torneo
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        {/* Matches & Control */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Descansos */}
          {currentRound.restingPlayers.length > 0 && (
            <div className="rounded-lg bg-yellow-50 p-4 border border-yellow-200">
              <h3 className="font-semibold text-yellow-800 text-sm">Jugadores en Descanso:</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {currentRound.restingPlayers.map(p => (
                  <span key={p.id} className="rounded-md bg-white px-3 py-1 text-xs font-medium text-yellow-700 shadow-sm border border-yellow-200">
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Matches List */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              disabled={currentRoundIndex === 0}
              onClick={() => setCurrentRoundIndex(c => c - 1)}
              className="rounded-md bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm border border-gray-300 transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            {isRoundComplete && currentRoundIndex < rounds.length - 1 && (
              <button
                onClick={() => setCurrentRoundIndex(c => c + 1)}
                className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700"
              >
                Siguiente Ronda
              </button>
            )}

            <button
              disabled={currentRoundIndex === rounds.length - 1}
              onClick={() => setCurrentRoundIndex(c => c + 1)}
              className="rounded-md bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm border border-gray-300 transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Adelantar
            </button>
          </div>

        </div>

        {/* Leaderboard */}
        <div className="xl:col-span-1">
          <div className="sticky top-24">
            <Leaderboard entries={leaderboard} />
          </div>
        </div>
      </div>
    </div>
  );
}
