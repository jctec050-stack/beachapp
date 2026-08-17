import { Player } from '@/lib/validations/tournament';

export type MatchData = {
  team1: [Player, Player];
  team2: [Player, Player];
  courtNumber: number;
};

export type RoundData = {
  roundNumber: number;
  matches: MatchData[];
  restingPlayers: Player[];
};

export function generateAmericanoRounds(players: Player[], totalCourts: number, totalRounds: number): RoundData[] {
  const N = players.length;
  if (N % 4 !== 0) {
    throw new Error("El algoritmo rotacional estricto requiere que el número de jugadores sea múltiplo de 4.");
  }

  // 1. Generar todas las parejas sin repetir usando el Método del Polígono (Circle Method)
  // Garantiza exactamente N-1 rondas teóricas donde todos juegan con todos.
  const totalTheoreticalRounds = N - 1;
  const allMatches: MatchData[] = [];

  for (let r = 0; r < totalTheoreticalRounds; r++) {
    const pairs: [Player, Player][] = [];
    pairs.push([players[0], players[r + 1]]);
    
    for (let i = 1; i < N / 2; i++) {
      const p1Index = (r + i) % (N - 1) + 1;
      const p2Index = (r - i + (N - 1)) % (N - 1) + 1;
      pairs.push([players[p1Index], players[p2Index]]);
    }
    
    // Convertir pares a partidos
    for (let i = 0; i < pairs.length; i += 2) {
      allMatches.push({
        team1: pairs[i],
        team2: pairs[i + 1],
        courtNumber: 0 // Se asignará luego
      });
    }
  }

  // 2. Empaquetar los partidos generados en "Rondas Físicas" (Time slots) según pistas disponibles
  const rounds: RoundData[] = [];
  
  for (const match of allMatches) {
    let placed = false;
    
    // Buscar la primera ronda física con pistas libres y sin solapamiento de jugadores
    for (const round of rounds) {
      if (round.matches.length < totalCourts) {
        const playersInRound = new Set<string>();
        round.matches.forEach(m => {
          playersInRound.add(m.team1[0].id); playersInRound.add(m.team1[1].id);
          playersInRound.add(m.team2[0].id); playersInRound.add(m.team2[1].id);
        });
        
        const matchPlayers = [match.team1[0].id, match.team1[1].id, match.team2[0].id, match.team2[1].id];
        const overlap = matchPlayers.some(id => playersInRound.has(id));
        
        if (!overlap) {
          match.courtNumber = round.matches.length + 1;
          round.matches.push(match);
          placed = true;
          break;
        }
      }
    }
    
    // Si no cabe en ninguna ronda física existente, creamos una nueva
    if (!placed) {
      match.courtNumber = 1;
      rounds.push({
        roundNumber: rounds.length + 1,
        matches: [match],
        restingPlayers: []
      });
    }
  }

  // 3. Calcular descansos para cada ronda física y asegurar el límite si pidieron menos
  const finalRounds = rounds.slice(0, totalRounds);
  
  for (const round of finalRounds) {
    const activeIds = new Set<string>();
    round.matches.forEach(m => {
      activeIds.add(m.team1[0].id); activeIds.add(m.team1[1].id);
      activeIds.add(m.team2[0].id); activeIds.add(m.team2[1].id);
    });
    round.restingPlayers = players.filter(p => !activeIds.has(p.id));
  }

  return finalRounds;
}
