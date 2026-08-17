import { z } from 'zod';

export const PlayerSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'El nombre es requerido'),
});
export type Player = z.infer<typeof PlayerSchema>;

export const MatchScoreSchema = z.object({
  scoreTeam1: z.number().int().min(0),
  scoreTeam2: z.number().int().min(0),
}).refine(data => {
  const { scoreTeam1, scoreTeam2 } = data;
  const max = Math.max(scoreTeam1, scoreTeam2);
  const min = Math.min(scoreTeam1, scoreTeam2);
  const diff = max - min;
  
  // Rule: First to 6 with diff of 2. (6-0, 6-1, 6-2, 6-3, 6-4)
  if (max === 6 && diff >= 2) return true;
  // Rule: Tie at 5-5 extends to 7. (7-5)
  if (max === 7 && diff === 2) return true;
  // Rule: Tie-break at 6-6 ends at 7-6. (7-6)
  if (max === 7 && diff === 1 && min === 6) return true;

  return false;
}, {
  message: "Marcador inválido. Debe ser a 6 con diferencia de 2, 7-5, o 7-6."
});
