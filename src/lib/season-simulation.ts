import type { Player, FootballPosition } from "./eredivisie-data";

export const USER_TEAM_NAME = "Your Eredivisie XI";

export interface PlacedPlayerInfo {
  player: Player;
  club: string;
  season: string;
  positionPlayed: FootballPosition;
}

export function calculateAverageRating(placed: PlacedPlayerInfo[]): number {
  return placed.reduce((sum, p) => sum + p.player.rating, 0) / placed.length;
}

export function calculateChemistry(placed: PlacedPlayerInfo[]): number {
  let chemistry = 0;
  for (let i = 0; i < placed.length; i++) {
    for (let j = i + 1; j < placed.length; j++) {
      if (placed[i].club === placed[j].club) chemistry += 2;
      if (placed[i].season === placed[j].season) chemistry += 1;
      if (
        placed[i].player.nationality &&
        placed[j].player.nationality &&
        placed[i].player.nationality === placed[j].player.nationality
      )
        chemistry += 1;
    }
  }
  return chemistry;
}

export function calculatePositionBonus(placed: PlacedPlayerInfo[]): number {
  let bonus = 0;
  for (const p of placed) {
    if (p.player.positions.includes(p.positionPlayed)) bonus += 1;
  }
  return bonus;
}

export function calculateTeamStrength(placed: PlacedPlayerInfo[]): {
  averageRating: number;
  chemistry: number;
  chemistryBonus: number;
  positionBonus: number;
  teamStrength: number;
} {
  const averageRating = calculateAverageRating(placed);
  const chemistry = calculateChemistry(placed);
  const chemistryBonus = Math.min(10, Math.round(chemistry / 5));
  const positionBonus = calculatePositionBonus(placed);
  const raw = averageRating + chemistryBonus + Math.min(5, positionBonus);
  const teamStrength = Math.max(60, Math.min(99, raw));
  return { averageRating, chemistry, chemistryBonus, positionBonus, teamStrength };
}

type MatchResult = "W" | "D" | "L";

export interface MatchScore {
  match: number;
  result: MatchResult;
  goalsFor: number;
  goalsAgainst: number;
}

export interface SeasonResult {
  wins: number;
  draws: number;
  losses: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  matches: MatchScore[];
}

function getProbabilities(teamStrength: number): { win: number; draw: number; loss: number } {
  if (teamStrength >= 95) return { win: 0.88, draw: 0.10, loss: 0.02 };
  if (teamStrength >= 90) return { win: 0.78, draw: 0.16, loss: 0.06 };
  if (teamStrength >= 85) return { win: 0.68, draw: 0.20, loss: 0.12 };
  if (teamStrength >= 80) return { win: 0.55, draw: 0.25, loss: 0.20 };
  if (teamStrength >= 75) return { win: 0.42, draw: 0.28, loss: 0.30 };
  return { win: 0.30, draw: 0.25, loss: 0.45 };
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateMatchScore(result: MatchResult): { goalsFor: number; goalsAgainst: number } {
  if (result === "W") {
    const goalsFor = randInt(2, 5);
    const goalsAgainst = Math.min(randInt(0, 2), goalsFor - 1);
    return { goalsFor, goalsAgainst };
  }
  if (result === "D") {
    const drawScores = [
      [0, 0],
      [1, 1],
      [1, 1],
      [2, 2],
      [2, 2],
      [0, 0],
      [1, 1],
      [3, 3],
    ];
    const [gf, ga] = drawScores[Math.floor(Math.random() * drawScores.length)];
    return { goalsFor: gf, goalsAgainst: ga };
  }
  // Loss
  const goalsAgainst = randInt(1, 4);
  const goalsFor = Math.min(randInt(0, 2), goalsAgainst - 1);
  return { goalsFor, goalsAgainst };
}

export function simulateSeason(teamStrength: number): SeasonResult {
  const { win, draw, loss } = getProbabilities(teamStrength);
  const matches: MatchScore[] = [];

  for (let i = 1; i <= 34; i++) {
    const r = Math.random();
    let result: MatchResult;
    if (r < win) result = "W";
    else if (r < win + draw) result = "D";
    else result = "L";

    const { goalsFor, goalsAgainst } = generateMatchScore(result);
    matches.push({ match: i, result, goalsFor, goalsAgainst });
  }

  const wins = matches.filter((m) => m.result === "W").length;
  const draws = matches.filter((m) => m.result === "D").length;
  const losses = matches.filter((m) => m.result === "L").length;
  const goalsFor = matches.reduce((s, m) => s + m.goalsFor, 0);
  const goalsAgainst = matches.reduce((s, m) => s + m.goalsAgainst, 0);

  return {
    wins,
    draws,
    losses,
    points: wins * 3 + draws,
    goalsFor,
    goalsAgainst,
    goalDifference: goalsFor - goalsAgainst,
    matches,
  };
}

export function getSeasonVerdict(result: SeasonResult): string {
  if (result.wins === 34 && result.draws === 0 && result.losses === 0)
    return "34-0. Perfect season.";
  if (result.points >= 90) return "Legendary champions";
  if (result.points >= 80) return "Eredivisie champions";
  if (result.points >= 70) return "Champions League-level season";
  if (result.points >= 60) return "European football secured";
  if (result.points >= 45) return "Mid-table season";
  return "Disappointing season";
}

export function isUnbeaten(result: SeasonResult): boolean {
  return result.losses === 0;
}

export function isPerfect(result: SeasonResult): boolean {
  return result.wins === 34 && result.losses === 0 && result.draws === 0;
}
