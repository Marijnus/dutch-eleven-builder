export type FootballPosition =
  | "GK"
  | "LB"
  | "CB"
  | "RB"
  | "CDM"
  | "CM"
  | "CAM"
  | "LW"
  | "RW"
  | "ST";

export interface Player {
  id: string;
  name: string;
  positions: FootballPosition[]; // exactly 3
  rating: number;
}

export interface TeamSeason {
  club: string;
  season: string;
  players: Player[];
}

export const clubColors: Record<string, { primary: string; secondary: string }> = {
  Ajax: { primary: "#D2122E", secondary: "#FFFFFF" },
  PSV: { primary: "#FF0000", secondary: "#FFFFFF" },
  Feyenoord: { primary: "#D71920", secondary: "#FFFFFF" },
  AZ: { primary: "#D71920", secondary: "#000000" },
  "FC Twente": { primary: "#E30613", secondary: "#FFFFFF" },
  "FC Utrecht": { primary: "#D71920", secondary: "#FFFFFF" },
  "SC Heerenveen": { primary: "#005BAB", secondary: "#FFFFFF" },
  "FC Groningen": { primary: "#00843D", secondary: "#FFFFFF" },
  Vitesse: { primary: "#F7D117", secondary: "#000000" },
  "Sparta Rotterdam": { primary: "#D71920", secondary: "#FFFFFF" },
};

export const fallbackClubColor = { primary: "#475569", secondary: "#FFFFFF" };

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function mkId(club: string, season: string, name: string) {
  return `${slug(club)}-${season.replace("/", "-")}-${slug(name)}`;
}

type Raw = { name: string; positions: FootballPosition[]; rating: number };

function team(club: string, season: string, players: Raw[]): TeamSeason {
  return {
    club,
    season,
    players: players.map((p) => ({ ...p, id: mkId(club, season, p.name) })),
  };
}

export const teamSeasons: TeamSeason[] = [
  team("Ajax", "2018/19", [
    { name: "André Onana", positions: ["GK", "GK", "GK"], rating: 84 },
    { name: "Kostas Lamprou", positions: ["GK", "GK", "GK"], rating: 70 },
    { name: "Matthijs de Ligt", positions: ["CB", "CB", "CDM"], rating: 88 },
    { name: "Daley Blind", positions: ["CB", "LB", "CDM"], rating: 84 },
    { name: "Nicolás Tagliafico", positions: ["LB", "CB", "LW"], rating: 83 },
    { name: "Noussair Mazraoui", positions: ["RB", "LB", "CM"], rating: 78 },
    { name: "Joël Veltman", positions: ["CB", "RB", "CDM"], rating: 78 },
    { name: "Frenkie de Jong", positions: ["CM", "CDM", "CAM"], rating: 88 },
    { name: "Lasse Schöne", positions: ["CM", "CDM", "CAM"], rating: 81 },
    { name: "Donny van de Beek", positions: ["CAM", "CM", "ST"], rating: 83 },
    { name: "Hakim Ziyech", positions: ["CAM", "RW", "LW"], rating: 85 },
    { name: "Dušan Tadić", positions: ["ST", "LW", "CAM"], rating: 86 },
    { name: "David Neres", positions: ["RW", "LW", "ST"], rating: 82 },
    { name: "Kasper Dolberg", positions: ["ST", "ST", "CAM"], rating: 78 },
    { name: "Klaas-Jan Huntelaar", positions: ["ST", "ST", "ST"], rating: 78 },
  ]),
  team("PSV", "2014/15", [
    { name: "Jeroen Zoet", positions: ["GK", "GK", "GK"], rating: 82 },
    { name: "Remko Pasveer", positions: ["GK", "GK", "GK"], rating: 72 },
    { name: "Jeffrey Bruma", positions: ["CB", "CB", "CDM"], rating: 79 },
    { name: "Karim Rekik", positions: ["CB", "LB", "CDM"], rating: 76 },
    { name: "Santiago Arias", positions: ["RB", "CM", "RW"], rating: 79 },
    { name: "Jetro Willems", positions: ["LB", "LW", "CB"], rating: 77 },
    { name: "Héctor Moreno", positions: ["CB", "CB", "LB"], rating: 80 },
    { name: "Andrés Guardado", positions: ["CM", "CDM", "LB"], rating: 82 },
    { name: "Georginio Wijnaldum", positions: ["CM", "CAM", "CDM"], rating: 84 },
    { name: "Davy Pröpper", positions: ["CM", "CDM", "CAM"], rating: 80 },
    { name: "Adam Maher", positions: ["CAM", "CM", "RW"], rating: 76 },
    { name: "Memphis Depay", positions: ["ST", "LW", "RW"], rating: 85 },
    { name: "Luuk de Jong", positions: ["ST", "ST", "CAM"], rating: 80 },
    { name: "Florian Jozefzoon", positions: ["RW", "LW", "ST"], rating: 73 },
    { name: "Jürgen Locadia", positions: ["ST", "LW", "RW"], rating: 75 },
  ]),
  team("Feyenoord", "2016/17", [
    { name: "Brad Jones", positions: ["GK", "GK", "GK"], rating: 78 },
    { name: "Kenneth Vermeer", positions: ["GK", "GK", "GK"], rating: 75 },
    { name: "Eric Botteghin", positions: ["CB", "CB", "CDM"], rating: 77 },
    { name: "Terence Kongolo", positions: ["CB", "LB", "CDM"], rating: 77 },
    { name: "Rick Karsdorp", positions: ["RB", "CM", "RW"], rating: 78 },
    { name: "Miquel Nelom", positions: ["LB", "CB", "LW"], rating: 73 },
    { name: "Jan-Arie van der Heijden", positions: ["CB", "CB", "LB"], rating: 75 },
    { name: "Karim El Ahmadi", positions: ["CDM", "CM", "CAM"], rating: 78 },
    { name: "Tonny Vilhena", positions: ["CM", "CAM", "CDM"], rating: 77 },
    { name: "Jens Toornstra", positions: ["CM", "CAM", "RW"], rating: 78 },
    { name: "Steven Berghuis", positions: ["RW", "CAM", "LW"], rating: 80 },
    { name: "Dirk Kuyt", positions: ["ST", "RW", "CAM"], rating: 79 },
    { name: "Nicolai Jørgensen", positions: ["ST", "ST", "CAM"], rating: 80 },
    { name: "Eljero Elia", positions: ["LW", "RW", "ST"], rating: 76 },
    { name: "Michiel Kramer", positions: ["ST", "ST", "ST"], rating: 73 },
  ]),
  team("AZ", "2008/09", [
    { name: "Sergio Romero", positions: ["GK", "GK", "GK"], rating: 80 },
    { name: "Joey Didulica", positions: ["GK", "GK", "GK"], rating: 72 },
    { name: "Niklas Moisander", positions: ["CB", "LB", "CDM"], rating: 78 },
    { name: "Kew Jaliens", positions: ["RB", "CB", "CDM"], rating: 76 },
    { name: "Héctor Moreno", positions: ["CB", "CB", "LB"], rating: 77 },
    { name: "Gill Swerts", positions: ["RB", "LB", "CM"], rating: 74 },
    { name: "Sébastien Pocognoli", positions: ["LB", "LW", "CB"], rating: 75 },
    { name: "Stijn Schaars", positions: ["CDM", "CM", "CAM"], rating: 79 },
    { name: "Demy de Zeeuw", positions: ["CM", "CDM", "CAM"], rating: 79 },
    { name: "David Mendes da Silva", positions: ["CM", "CAM", "CDM"], rating: 77 },
    { name: "Maarten Martens", positions: ["CAM", "CM", "LW"], rating: 77 },
    { name: "Mounir El Hamdaoui", positions: ["ST", "CAM", "LW"], rating: 82 },
    { name: "Moussa Dembélé", positions: ["CM", "CAM", "ST"], rating: 81 },
    { name: "Ari", positions: ["ST", "RW", "LW"], rating: 76 },
    { name: "Graziano Pellè", positions: ["ST", "ST", "ST"], rating: 75 },
  ]),
  team("Ajax", "2010/11", [
    { name: "Maarten Stekelenburg", positions: ["GK", "GK", "GK"], rating: 83 },
    { name: "Kenneth Vermeer", positions: ["GK", "GK", "GK"], rating: 73 },
    { name: "Jan Vertonghen", positions: ["CB", "LB", "CDM"], rating: 84 },
    { name: "Toby Alderweireld", positions: ["CB", "RB", "CDM"], rating: 82 },
    { name: "Gregory van der Wiel", positions: ["RB", "CB", "RW"], rating: 81 },
    { name: "Vurnon Anita", positions: ["LB", "CDM", "CM"], rating: 77 },
    { name: "Daley Blind", positions: ["LB", "CB", "CDM"], rating: 75 },
    { name: "Christian Eriksen", positions: ["CAM", "CM", "LW"], rating: 80 },
    { name: "Eyong Enoh", positions: ["CDM", "CM", "CB"], rating: 76 },
    { name: "Demy de Zeeuw", positions: ["CM", "CDM", "CAM"], rating: 78 },
    { name: "Siem de Jong", positions: ["CAM", "CM", "ST"], rating: 78 },
    { name: "Luis Suárez", positions: ["ST", "LW", "CAM"], rating: 86 },
    { name: "Mounir El Hamdaoui", positions: ["ST", "CAM", "LW"], rating: 80 },
    { name: "Dmitri Bulykin", positions: ["ST", "ST", "ST"], rating: 75 },
    { name: "Miralem Sulejmani", positions: ["LW", "RW", "ST"], rating: 76 },
  ]),
  team("PSV", "2017/18", [
    { name: "Jeroen Zoet", positions: ["GK", "GK", "GK"], rating: 82 },
    { name: "Hidde Jurjus", positions: ["GK", "GK", "GK"], rating: 70 },
    { name: "Nicolas Isimat-Mirin", positions: ["CB", "CB", "CDM"], rating: 77 },
    { name: "Daniel Schwaab", positions: ["CB", "RB", "CDM"], rating: 78 },
    { name: "Santiago Arias", positions: ["RB", "CM", "RW"], rating: 80 },
    { name: "Joshua Brenet", positions: ["RB", "LB", "RW"], rating: 76 },
    { name: "Derrick Luckassen", positions: ["CB", "CDM", "LB"], rating: 75 },
    { name: "Marco van Ginkel", positions: ["CM", "CDM", "CAM"], rating: 79 },
    { name: "Jorrit Hendrix", positions: ["CDM", "CM", "CB"], rating: 76 },
    { name: "Bart Ramselaar", positions: ["CAM", "CM", "RW"], rating: 74 },
    { name: "Gastón Pereiro", positions: ["CAM", "LW", "CM"], rating: 77 },
    { name: "Hirving Lozano", positions: ["LW", "RW", "ST"], rating: 82 },
    { name: "Steven Bergwijn", positions: ["LW", "RW", "ST"], rating: 79 },
    { name: "Luuk de Jong", positions: ["ST", "ST", "CAM"], rating: 80 },
    { name: "Jürgen Locadia", positions: ["ST", "LW", "RW"], rating: 76 },
  ]),
];
