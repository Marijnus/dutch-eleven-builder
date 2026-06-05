import type { Player, FootballPosition } from "./eredivisie-data";

export interface ClubStrength {
  name: string;
  strength: number;
}

export const eredivisieClubs: ClubStrength[] = [
  { name: "PSV", strength: 88 },
  { name: "Feyenoord", strength: 86 },
  { name: "Ajax", strength: 84 },
  { name: "AZ", strength: 82 },
  { name: "FC Twente", strength: 81 },
  { name: "FC Utrecht", strength: 78 },
  { name: "SC Heerenveen", strength: 75 },
  { name: "Sparta Rotterdam", strength: 74 },
  { name: "NEC", strength: 74 },
  { name: "Go Ahead Eagles", strength: 73 },
  { name: "FC Groningen", strength: 72 },
  { name: "Heracles Almelo", strength: 71 },
  { name: "PEC Zwolle", strength: 70 },
  { name: "Fortuna Sittard", strength: 70 },
  { name: "Willem II", strength: 69 },
  { name: "RKC Waalwijk", strength: 68 },
  { name: "Excelsior", strength: 68 },
  { name: "Almere City FC", strength: 67 },
];

export const USER_TEAM_NAME = "Your Eredivisie XI";

export interface PlacedPlayerInfo {
  player: Player;
  club: string;
  season: string;
  positionPlayed: FootballPosition;
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
  positionBonus: number;
  teamStrength: number;
} {
  const averageRating =
    placed.reduce((sum, p) => sum + p.player.rating, 0) / placed.length;
  const chemistry = calculateChemistry(placed);
  const positionBonus = calculatePositionBonus(placed);
  const teamStrength =
    averageRating +
    Math.min(10, Math.round(chemistry / 5)) +
    Math.min(5, positionBonus);
  return { averageRating, chemistry, positionBonus, teamStrength };
}

export interface TeamRecord {
  name: string;
  strength: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  isUserTeam: boolean;
}

function simulateMatch(teamA: TeamRecord, teamB: TeamRecord): { goalsA: number; goalsB: number } {
  const strengthDifference = teamA.strength - teamB.strength;
  const randomFactor = Math.random() * 20 - 10;
  const performanceDifference = strengthDifference + randomFactor;

  let goalsA: number;
  let goalsB: number;

  if (performanceDifference > 10) {
    goalsA = Math.floor(Math.random() * 3) + 2;
    goalsB = Math.floor(Math.random() * 2);
  } else if (performanceDifference > 3) {
    goalsA = Math.floor(Math.random() * 3) + 1;
    goalsB = Math.floor(Math.random() * 2);
  } else if (performanceDifference > -3) {
    goalsA = Math.floor(Math.random() * 3);
    goalsB = Math.floor(Math.random() * 3);
  } else if (performanceDifference > -10) {
    goalsA = Math.floor(Math.random() * 2);
    goalsB = Math.floor(Math.random() * 3) + 1;
  } else {
    goalsA = Math.floor(Math.random() * 2);
    goalsB = Math.floor(Math.random() * 3) + 2;
  }

  return { goalsA, goalsB };
}

function applyResult(team: TeamRecord, goalsFor: number, goalsAgainst: number) {
  team.played += 1;
  team.goalsFor += goalsFor;
  team.goalsAgainst += goalsAgainst;
  team.goalDifference += goalsFor - goalsAgainst;
  if (goalsFor > goalsAgainst) {
    team.wins += 1;
    team.points += 3;
  } else if (goalsFor === goalsAgainst) {
    team.draws += 1;
    team.points += 1;
  } else {
    team.losses += 1;
  }
}

export function simulateSeason(
  userStrength: number,
): TeamRecord[] {
  const teams: TeamRecord[] = [
    ...eredivisieClubs.map((c) => ({
      name: c.name,
      strength: c.strength,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      isUserTeam: false,
    })),
  ];

  // Replace the weakest club (Almere City FC) with user team
  const replaceIdx = teams.findIndex((t) => t.name === "Almere City FC");
  teams[replaceIdx] = {
    name: USER_TEAM_NAME,
    strength: userStrength,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
    isUserTeam: true,
  };

  // Round-robin: each team plays every other team twice (home & away) = 34 matches
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      // Home match for i
      const home = simulateMatch(teams[i], teams[j]);
      applyResult(teams[i], home.goalsA, home.goalsB);
      applyResult(teams[j], home.goalsB, home.goalsA);

      // Home match for j (return fixture)
      const away = simulateMatch(teams[j], teams[i]);
      applyResult(teams[j], away.goalsA, away.goalsB);
      applyResult(teams[i], away.goalsB, away.goalsA);
    }
  }

  // Sort by points, then goal difference, then goals for
  teams.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });

  return teams;
}

export function getVerdict(position: number): string {
  if (position === 1) return "Champions of the Eredivisie";
  if (position <= 3) return "Champions League-level season";
  if (position <= 6) return "European football secured";
  if (position <= 10) return "Solid mid-table season";
  if (position <= 15) return "Disappointing season";
  return "Relegation battle disaster";
}
