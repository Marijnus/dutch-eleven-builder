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
  club: string;
  season: string;
  positions: FootballPosition[]; // 1-3 unique positions
  rating: number;
  nationality?: string;
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
  "Heracles Almelo": { primary: "#000000", secondary: "#FFFFFF" },
  NEC: { primary: "#D71920", secondary: "#000000" },
  "Go Ahead Eagles": { primary: "#D71920", secondary: "#FFFFFF" },
};

export const fallbackClubColor = { primary: "#475569", secondary: "#FFFFFF" };

/** Remove duplicate positions and falsy values. */
export function cleanPositions(
  positions: FootballPosition[],
): FootballPosition[] {
  return [...new Set(positions)].filter(Boolean) as FootballPosition[];
}

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

type Raw = {
  name: string;
  positions: FootballPosition[];
  rating: number;
  nationality?: string;
};

function team(club: string, season: string, players: Raw[]): TeamSeason {
  return {
    club,
    season,
    players: players.map((p) => ({
      id: mkId(club, season, p.name),
      name: p.name,
      club,
      season,
      positions: cleanPositions(p.positions),
      rating: p.rating,
      nationality: p.nationality,
    })),
  };
}

export const teamSeasons: TeamSeason[] = [
  // ===================== AJAX =====================
  team("Ajax", "2018/19", [
    { name: "André Onana", positions: ["GK"], rating: 84, nationality: "Cameroon" },
    { name: "Matthijs de Ligt", positions: ["CB"], rating: 88, nationality: "Netherlands" },
    { name: "Daley Blind", positions: ["CB", "LB", "CDM"], rating: 84, nationality: "Netherlands" },
    { name: "Nicolás Tagliafico", positions: ["LB"], rating: 83, nationality: "Argentina" },
    { name: "Noussair Mazraoui", positions: ["RB", "CM"], rating: 78, nationality: "Morocco" },
    { name: "Joël Veltman", positions: ["CB", "RB"], rating: 78, nationality: "Netherlands" },
    { name: "Frenkie de Jong", positions: ["CM", "CDM"], rating: 88, nationality: "Netherlands" },
    { name: "Lasse Schöne", positions: ["CM", "CDM"], rating: 81, nationality: "Denmark" },
    { name: "Donny van de Beek", positions: ["CAM", "CM"], rating: 83, nationality: "Netherlands" },
    { name: "Hakim Ziyech", positions: ["CAM", "RW"], rating: 85, nationality: "Morocco" },
    { name: "Dušan Tadić", positions: ["ST", "LW", "CAM"], rating: 86, nationality: "Serbia" },
    { name: "David Neres", positions: ["RW", "LW"], rating: 82, nationality: "Brazil" },
    { name: "Kasper Dolberg", positions: ["ST"], rating: 78, nationality: "Denmark" },
    { name: "Klaas-Jan Huntelaar", positions: ["ST"], rating: 78, nationality: "Netherlands" },
  ]),
  team("Ajax", "2020/21", [
    { name: "Maarten Stekelenburg", positions: ["GK"], rating: 76, nationality: "Netherlands" },
    { name: "Lisandro Martínez", positions: ["CB", "CDM"], rating: 82, nationality: "Argentina" },
    { name: "Daley Blind", positions: ["CB", "LB"], rating: 82, nationality: "Netherlands" },
    { name: "Noussair Mazraoui", positions: ["RB"], rating: 80, nationality: "Morocco" },
    { name: "Nicolás Tagliafico", positions: ["LB"], rating: 82, nationality: "Argentina" },
    { name: "Perr Schuurs", positions: ["CB"], rating: 75, nationality: "Netherlands" },
    { name: "Ryan Gravenberch", positions: ["CM", "CDM"], rating: 77, nationality: "Netherlands" },
    { name: "Davy Klaassen", positions: ["CM", "CAM"], rating: 81, nationality: "Netherlands" },
    { name: "Edson Álvarez", positions: ["CDM", "CB"], rating: 80, nationality: "Mexico" },
    { name: "Antony", positions: ["RW"], rating: 81, nationality: "Brazil" },
    { name: "Dušan Tadić", positions: ["LW", "CAM", "ST"], rating: 85, nationality: "Serbia" },
    { name: "David Neres", positions: ["RW", "LW"], rating: 81, nationality: "Brazil" },
    { name: "Sébastien Haller", positions: ["ST"], rating: 82, nationality: "Ivory Coast" },
    { name: "Quincy Promes", positions: ["LW", "ST"], rating: 80, nationality: "Netherlands" },
  ]),
  team("Ajax", "2021/22", [
    { name: "Remko Pasveer", positions: ["GK"], rating: 77, nationality: "Netherlands" },
    { name: "Jurriën Timber", positions: ["CB", "RB"], rating: 81, nationality: "Netherlands" },
    { name: "Lisandro Martínez", positions: ["CB", "CDM"], rating: 84, nationality: "Argentina" },
    { name: "Noussair Mazraoui", positions: ["RB"], rating: 82, nationality: "Morocco" },
    { name: "Daley Blind", positions: ["LB", "CB"], rating: 82, nationality: "Netherlands" },
    { name: "Devyne Rensch", positions: ["RB", "CB"], rating: 74, nationality: "Netherlands" },
    { name: "Edson Álvarez", positions: ["CDM", "CB"], rating: 82, nationality: "Mexico" },
    { name: "Ryan Gravenberch", positions: ["CM", "CDM"], rating: 80, nationality: "Netherlands" },
    { name: "Davy Klaassen", positions: ["CM", "CAM"], rating: 82, nationality: "Netherlands" },
    { name: "Antony", positions: ["RW"], rating: 83, nationality: "Brazil" },
    { name: "Dušan Tadić", positions: ["LW", "CAM", "ST"], rating: 85, nationality: "Serbia" },
    { name: "Steven Berghuis", positions: ["CAM", "RW"], rating: 82, nationality: "Netherlands" },
    { name: "Sébastien Haller", positions: ["ST"], rating: 84, nationality: "Ivory Coast" },
    { name: "Mohammed Kudus", positions: ["CAM", "ST", "RW"], rating: 76, nationality: "Ghana" },
  ]),
  team("Ajax", "2022/23", [
    { name: "Gerónimo Rulli", positions: ["GK"], rating: 79, nationality: "Argentina" },
    { name: "Jurriën Timber", positions: ["CB", "RB"], rating: 82, nationality: "Netherlands" },
    { name: "Calvin Bassey", positions: ["CB", "LB"], rating: 76, nationality: "Nigeria" },
    { name: "Devyne Rensch", positions: ["RB"], rating: 75, nationality: "Netherlands" },
    { name: "Owen Wijndal", positions: ["LB"], rating: 75, nationality: "Netherlands" },
    { name: "Edson Álvarez", positions: ["CDM"], rating: 82, nationality: "Mexico" },
    { name: "Kenneth Taylor", positions: ["CM", "CAM"], rating: 74, nationality: "Netherlands" },
    { name: "Davy Klaassen", positions: ["CM", "CAM"], rating: 81, nationality: "Netherlands" },
    { name: "Steven Berghuis", positions: ["CAM", "RW"], rating: 81, nationality: "Netherlands" },
    { name: "Mohammed Kudus", positions: ["CAM", "ST", "RW"], rating: 79, nationality: "Ghana" },
    { name: "Dušan Tadić", positions: ["LW", "CAM"], rating: 83, nationality: "Serbia" },
    { name: "Steven Bergwijn", positions: ["LW", "ST"], rating: 81, nationality: "Netherlands" },
    { name: "Brian Brobbey", positions: ["ST"], rating: 76, nationality: "Netherlands" },
  ]),

  // ===================== PSV =====================
  team("PSV", "2014/15", [
    { name: "Jeroen Zoet", positions: ["GK"], rating: 82, nationality: "Netherlands" },
    { name: "Jeffrey Bruma", positions: ["CB"], rating: 79, nationality: "Netherlands" },
    { name: "Karim Rekik", positions: ["CB", "LB"], rating: 76, nationality: "Netherlands" },
    { name: "Santiago Arias", positions: ["RB"], rating: 79, nationality: "Colombia" },
    { name: "Jetro Willems", positions: ["LB"], rating: 77, nationality: "Netherlands" },
    { name: "Héctor Moreno", positions: ["CB"], rating: 80, nationality: "Mexico" },
    { name: "Andrés Guardado", positions: ["CM", "CDM", "LB"], rating: 82, nationality: "Mexico" },
    { name: "Georginio Wijnaldum", positions: ["CM", "CAM"], rating: 84, nationality: "Netherlands" },
    { name: "Davy Pröpper", positions: ["CM", "CDM"], rating: 80, nationality: "Netherlands" },
    { name: "Adam Maher", positions: ["CAM", "CM"], rating: 76, nationality: "Netherlands" },
    { name: "Memphis Depay", positions: ["LW", "ST", "RW"], rating: 85, nationality: "Netherlands" },
    { name: "Luuk de Jong", positions: ["ST"], rating: 80, nationality: "Netherlands" },
    { name: "Florian Jozefzoon", positions: ["RW", "LW"], rating: 73, nationality: "Netherlands" },
    { name: "Jürgen Locadia", positions: ["ST", "LW"], rating: 75, nationality: "Netherlands" },
  ]),
  team("PSV", "2015/16", [
    { name: "Jeroen Zoet", positions: ["GK"], rating: 83, nationality: "Netherlands" },
    { name: "Nicolas Isimat-Mirin", positions: ["CB"], rating: 77, nationality: "France" },
    { name: "Jeffrey Bruma", positions: ["CB"], rating: 80, nationality: "Netherlands" },
    { name: "Héctor Moreno", positions: ["CB"], rating: 80, nationality: "Mexico" },
    { name: "Santiago Arias", positions: ["RB"], rating: 80, nationality: "Colombia" },
    { name: "Joshua Brenet", positions: ["RB", "LB"], rating: 74, nationality: "Netherlands" },
    { name: "Andrés Guardado", positions: ["CDM", "CM"], rating: 82, nationality: "Mexico" },
    { name: "Davy Pröpper", positions: ["CM", "CDM"], rating: 81, nationality: "Netherlands" },
    { name: "Jorrit Hendrix", positions: ["CDM", "CM"], rating: 76, nationality: "Netherlands" },
    { name: "Gastón Pereiro", positions: ["CAM", "LW"], rating: 77, nationality: "Uruguay" },
    { name: "Luuk de Jong", positions: ["ST"], rating: 81, nationality: "Netherlands" },
    { name: "Jürgen Locadia", positions: ["ST", "LW"], rating: 76, nationality: "Netherlands" },
    { name: "Luciano Narsingh", positions: ["RW", "LW"], rating: 77, nationality: "Netherlands" },
  ]),
  team("PSV", "2021/22", [
    { name: "Joël Drommel", positions: ["GK"], rating: 76, nationality: "Netherlands" },
    { name: "Olivier Boscagli", positions: ["CB", "LB"], rating: 76, nationality: "France" },
    { name: "André Ramalho", positions: ["CB"], rating: 78, nationality: "Brazil" },
    { name: "Armando Obispo", positions: ["CB"], rating: 72, nationality: "Netherlands" },
    { name: "Phillipp Mwene", positions: ["RB", "LB"], rating: 75, nationality: "Austria" },
    { name: "Philipp Max", positions: ["LB"], rating: 78, nationality: "Germany" },
    { name: "Ibrahim Sangaré", positions: ["CDM"], rating: 81, nationality: "Ivory Coast" },
    { name: "Érick Gutiérrez", positions: ["CM", "CDM"], rating: 77, nationality: "Mexico" },
    { name: "Mario Götze", positions: ["CAM", "CM"], rating: 80, nationality: "Germany" },
    { name: "Cody Gakpo", positions: ["LW", "ST"], rating: 82, nationality: "Netherlands" },
    { name: "Noni Madueke", positions: ["RW", "LW"], rating: 76, nationality: "England" },
    { name: "Eran Zahavi", positions: ["ST"], rating: 79, nationality: "Israel" },
    { name: "Bruma", positions: ["LW", "RW"], rating: 75, nationality: "Portugal" },
  ]),
  team("PSV", "2023/24", [
    { name: "Walter Benítez", positions: ["GK"], rating: 82, nationality: "Argentina" },
    { name: "Olivier Boscagli", positions: ["CB", "LB"], rating: 79, nationality: "France" },
    { name: "André Ramalho", positions: ["CB"], rating: 79, nationality: "Brazil" },
    { name: "Jordan Teze", positions: ["RB", "CB"], rating: 77, nationality: "Netherlands" },
    { name: "Sergiño Dest", positions: ["RB", "LB"], rating: 79, nationality: "USA" },
    { name: "Patrick van Aanholt", positions: ["LB"], rating: 76, nationality: "Netherlands" },
    { name: "Jerdy Schouten", positions: ["CDM", "CM"], rating: 80, nationality: "Netherlands" },
    { name: "Joey Veerman", positions: ["CM", "CAM"], rating: 80, nationality: "Netherlands" },
    { name: "Malik Tillman", positions: ["CAM", "CM"], rating: 78, nationality: "USA" },
    { name: "Johan Bakayoko", positions: ["RW", "LW"], rating: 79, nationality: "Belgium" },
    { name: "Noa Lang", positions: ["LW", "RW"], rating: 80, nationality: "Netherlands" },
    { name: "Luuk de Jong", positions: ["ST"], rating: 79, nationality: "Netherlands" },
    { name: "Hirving Lozano", positions: ["RW", "LW"], rating: 81, nationality: "Mexico" },
    { name: "Ismael Saibari", positions: ["CAM", "CM"], rating: 77, nationality: "Morocco" },
  ]),

  // ===================== FEYENOORD =====================
  team("Feyenoord", "2016/17", [
    { name: "Brad Jones", positions: ["GK"], rating: 78, nationality: "Australia" },
    { name: "Eric Botteghin", positions: ["CB"], rating: 77, nationality: "Brazil" },
    { name: "Terence Kongolo", positions: ["CB", "LB"], rating: 77, nationality: "Netherlands" },
    { name: "Rick Karsdorp", positions: ["RB"], rating: 78, nationality: "Netherlands" },
    { name: "Miquel Nelom", positions: ["LB"], rating: 73, nationality: "Netherlands" },
    { name: "Jan-Arie van der Heijden", positions: ["CB"], rating: 75, nationality: "Netherlands" },
    { name: "Karim El Ahmadi", positions: ["CDM", "CM"], rating: 78, nationality: "Morocco" },
    { name: "Tonny Vilhena", positions: ["CM", "CAM"], rating: 77, nationality: "Netherlands" },
    { name: "Jens Toornstra", positions: ["CM", "CAM", "RW"], rating: 78, nationality: "Netherlands" },
    { name: "Steven Berghuis", positions: ["RW", "CAM"], rating: 80, nationality: "Netherlands" },
    { name: "Dirk Kuyt", positions: ["ST", "RW"], rating: 79, nationality: "Netherlands" },
    { name: "Nicolai Jørgensen", positions: ["ST"], rating: 80, nationality: "Denmark" },
    { name: "Eljero Elia", positions: ["LW", "RW"], rating: 76, nationality: "Netherlands" },
  ]),
  team("Feyenoord", "2022/23", [
    { name: "Justin Bijlow", positions: ["GK"], rating: 80, nationality: "Netherlands" },
    { name: "Lutsharel Geertruida", positions: ["CB", "RB"], rating: 79, nationality: "Netherlands" },
    { name: "Dávid Hancko", positions: ["CB", "LB"], rating: 81, nationality: "Slovakia" },
    { name: "Gernot Trauner", positions: ["CB"], rating: 79, nationality: "Austria" },
    { name: "Quilindschy Hartman", positions: ["LB"], rating: 74, nationality: "Netherlands" },
    { name: "Marcus Pedersen", positions: ["RB"], rating: 73, nationality: "Norway" },
    { name: "Orkun Kökçü", positions: ["CM", "CAM"], rating: 81, nationality: "Turkey" },
    { name: "Sebastian Szymański", positions: ["CAM", "CM"], rating: 80, nationality: "Poland" },
    { name: "Quinten Timber", positions: ["CM", "CDM"], rating: 76, nationality: "Netherlands" },
    { name: "Oussama Idrissi", positions: ["LW", "RW"], rating: 77, nationality: "Morocco" },
    { name: "Alireza Jahanbakhsh", positions: ["RW", "LW"], rating: 77, nationality: "Iran" },
    { name: "Santiago Giménez", positions: ["ST"], rating: 79, nationality: "Mexico" },
    { name: "Danilo", positions: ["ST"], rating: 74, nationality: "Brazil" },
  ]),
  team("Feyenoord", "2023/24", [
    { name: "Justin Bijlow", positions: ["GK"], rating: 81, nationality: "Netherlands" },
    { name: "Lutsharel Geertruida", positions: ["CB", "RB"], rating: 81, nationality: "Netherlands" },
    { name: "Dávid Hancko", positions: ["CB", "LB"], rating: 82, nationality: "Slovakia" },
    { name: "Gernot Trauner", positions: ["CB"], rating: 80, nationality: "Austria" },
    { name: "Quilindschy Hartman", positions: ["LB"], rating: 76, nationality: "Netherlands" },
    { name: "Bart Nieuwkoop", positions: ["RB"], rating: 73, nationality: "Netherlands" },
    { name: "Mats Wieffer", positions: ["CDM", "CM"], rating: 79, nationality: "Netherlands" },
    { name: "Quinten Timber", positions: ["CM", "CDM"], rating: 78, nationality: "Netherlands" },
    { name: "Calvin Stengs", positions: ["CAM", "RW"], rating: 78, nationality: "Netherlands" },
    { name: "Igor Paixão", positions: ["LW", "RW"], rating: 78, nationality: "Brazil" },
    { name: "Yankuba Minteh", positions: ["RW"], rating: 75, nationality: "Gambia" },
    { name: "Santiago Giménez", positions: ["ST"], rating: 83, nationality: "Mexico" },
    { name: "Ayase Ueda", positions: ["ST"], rating: 75, nationality: "Japan" },
  ]),

  // ===================== AZ =====================
  team("AZ", "2017/18", [
    { name: "Marco Bizot", positions: ["GK"], rating: 77, nationality: "Netherlands" },
    { name: "Stijn Wuytens", positions: ["CB", "CDM"], rating: 74, nationality: "Belgium" },
    { name: "Pantelis Hatzidiakos", positions: ["CB"], rating: 73, nationality: "Greece" },
    { name: "Ron Vlaar", positions: ["CB"], rating: 78, nationality: "Netherlands" },
    { name: "Ridgeciano Haps", positions: ["LB"], rating: 75, nationality: "Netherlands" },
    { name: "Mattias Johansson", positions: ["RB"], rating: 73, nationality: "Sweden" },
    { name: "Joris van Overeem", positions: ["CM", "CDM"], rating: 73, nationality: "Netherlands" },
    { name: "Iliass Bel Hassani", positions: ["CAM", "CM"], rating: 73, nationality: "Morocco" },
    { name: "Alireza Jahanbakhsh", positions: ["RW", "LW"], rating: 79, nationality: "Iran" },
    { name: "Mats Seuntjens", positions: ["CAM", "RW"], rating: 75, nationality: "Netherlands" },
    { name: "Wout Weghorst", positions: ["ST"], rating: 78, nationality: "Netherlands" },
    { name: "Fred Friday", positions: ["ST"], rating: 70, nationality: "Nigeria" },
  ]),
  team("AZ", "2019/20", [
    { name: "Marco Bizot", positions: ["GK"], rating: 78, nationality: "Netherlands" },
    { name: "Pantelis Hatzidiakos", positions: ["CB"], rating: 75, nationality: "Greece" },
    { name: "Ron Vlaar", positions: ["CB"], rating: 77, nationality: "Netherlands" },
    { name: "Owen Wijndal", positions: ["LB"], rating: 76, nationality: "Netherlands" },
    { name: "Jonas Svensson", positions: ["RB"], rating: 75, nationality: "Norway" },
    { name: "Teun Koopmeiners", positions: ["CDM", "CB", "CM"], rating: 80, nationality: "Netherlands" },
    { name: "Fredrik Midtsjø", positions: ["CM"], rating: 75, nationality: "Norway" },
    { name: "Calvin Stengs", positions: ["CAM", "RW"], rating: 78, nationality: "Netherlands" },
    { name: "Oussama Idrissi", positions: ["LW", "RW"], rating: 79, nationality: "Morocco" },
    { name: "Myron Boadu", positions: ["ST"], rating: 76, nationality: "Netherlands" },
    { name: "Albert Guðmundsson", positions: ["CAM", "ST"], rating: 73, nationality: "Iceland" },
  ]),
  team("AZ", "2020/21", [
    { name: "Marco Bizot", positions: ["GK"], rating: 78, nationality: "Netherlands" },
    { name: "Pantelis Hatzidiakos", positions: ["CB"], rating: 76, nationality: "Greece" },
    { name: "Bruno Martins Indi", positions: ["CB"], rating: 77, nationality: "Netherlands" },
    { name: "Owen Wijndal", positions: ["LB"], rating: 77, nationality: "Netherlands" },
    { name: "Jonas Svensson", positions: ["RB"], rating: 75, nationality: "Norway" },
    { name: "Teun Koopmeiners", positions: ["CM", "CDM"], rating: 82, nationality: "Netherlands" },
    { name: "Fredrik Midtsjø", positions: ["CM", "CDM"], rating: 76, nationality: "Norway" },
    { name: "Albert Guðmundsson", positions: ["CAM", "ST"], rating: 75, nationality: "Iceland" },
    { name: "Jesper Karlsson", positions: ["LW", "RW"], rating: 76, nationality: "Sweden" },
    { name: "Calvin Stengs", positions: ["RW", "CAM"], rating: 79, nationality: "Netherlands" },
    { name: "Myron Boadu", positions: ["ST"], rating: 77, nationality: "Netherlands" },
  ]),

  // ===================== FC TWENTE =====================
  team("FC Twente", "2010/11", [
    { name: "Sander Boschker", positions: ["GK"], rating: 77, nationality: "Netherlands" },
    { name: "Peter Wisgerhof", positions: ["CB"], rating: 76, nationality: "Netherlands" },
    { name: "Douglas", positions: ["CB"], rating: 78, nationality: "Brazil" },
    { name: "Roberto Rosales", positions: ["RB"], rating: 74, nationality: "Venezuela" },
    { name: "Dwight Tiendalli", positions: ["LB", "RB"], rating: 74, nationality: "Netherlands" },
    { name: "Theo Janssen", positions: ["CM", "CAM"], rating: 79, nationality: "Netherlands" },
    { name: "Wout Brama", positions: ["CDM", "CM"], rating: 75, nationality: "Netherlands" },
    { name: "Nacer Chadli", positions: ["LW", "CAM"], rating: 79, nationality: "Belgium" },
    { name: "Bryan Ruiz", positions: ["CAM", "LW"], rating: 82, nationality: "Costa Rica" },
    { name: "Miroslav Stoch", positions: ["LW", "RW"], rating: 78, nationality: "Slovakia" },
    { name: "Marc Janko", positions: ["ST"], rating: 77, nationality: "Austria" },
    { name: "Luuk de Jong", positions: ["ST"], rating: 74, nationality: "Netherlands" },
  ]),
  team("FC Twente", "2022/23", [
    { name: "Lars Unnerstall", positions: ["GK"], rating: 78, nationality: "Germany" },
    { name: "Robin Pröpper", positions: ["CB"], rating: 76, nationality: "Netherlands" },
    { name: "Mees Hilgers", positions: ["CB"], rating: 76, nationality: "Netherlands" },
    { name: "Joshua Brenet", positions: ["RB", "LB"], rating: 74, nationality: "Netherlands" },
    { name: "Gijs Smal", positions: ["LB"], rating: 74, nationality: "Netherlands" },
    { name: "Ramiz Zerrouki", positions: ["CDM", "CM"], rating: 77, nationality: "Algeria" },
    { name: "Sem Steijn", positions: ["CM", "CAM"], rating: 74, nationality: "Netherlands" },
    { name: "Michel Vlap", positions: ["CAM", "CM"], rating: 74, nationality: "Netherlands" },
    { name: "Vaclav Cerny", positions: ["RW", "LW"], rating: 76, nationality: "Czech Republic" },
    { name: "Manfred Ugalde", positions: ["ST"], rating: 73, nationality: "Costa Rica" },
    { name: "Ricky van Wolfswinkel", positions: ["ST"], rating: 75, nationality: "Netherlands" },
  ]),
  team("FC Twente", "2023/24", [
    { name: "Lars Unnerstall", positions: ["GK"], rating: 79, nationality: "Germany" },
    { name: "Robin Pröpper", positions: ["CB"], rating: 77, nationality: "Netherlands" },
    { name: "Mees Hilgers", positions: ["CB"], rating: 78, nationality: "Netherlands" },
    { name: "Anass Salah-Eddine", positions: ["LB"], rating: 73, nationality: "Netherlands" },
    { name: "Gijs Smal", positions: ["LB"], rating: 74, nationality: "Netherlands" },
    { name: "Alfons Sampsted", positions: ["RB"], rating: 73, nationality: "Iceland" },
    { name: "Ramiz Zerrouki", positions: ["CDM"], rating: 77, nationality: "Algeria" },
    { name: "Michel Vlap", positions: ["CAM", "CM"], rating: 75, nationality: "Netherlands" },
    { name: "Sem Steijn", positions: ["CAM", "CM"], rating: 77, nationality: "Netherlands" },
    { name: "Manfred Ugalde", positions: ["ST"], rating: 78, nationality: "Costa Rica" },
    { name: "Daan Rots", positions: ["RW", "LW"], rating: 73, nationality: "Netherlands" },
    { name: "Sayfallah Ltaief", positions: ["LW", "RW"], rating: 72, nationality: "Tunisia" },
  ]),

  // ===================== OTHER CLUBS =====================
  team("Vitesse", "2012/13", [
    { name: "Piet Velthuizen", positions: ["GK"], rating: 75, nationality: "Netherlands" },
    { name: "Guram Kashia", positions: ["CB"], rating: 76, nationality: "Georgia" },
    { name: "Jan-Arie van der Heijden", positions: ["CB"], rating: 73, nationality: "Netherlands" },
    { name: "Théo Bongonda", positions: ["LW", "RW"], rating: 73, nationality: "Belgium" },
    { name: "Kevin Diks", positions: ["RB", "CB"], rating: 70, nationality: "Netherlands" },
    { name: "Davy Pröpper", positions: ["CM", "CDM"], rating: 76, nationality: "Netherlands" },
    { name: "Marco van Ginkel", positions: ["CM", "CAM"], rating: 78, nationality: "Netherlands" },
    { name: "Bruno Martins Indi", positions: ["CB", "LB"], rating: 76, nationality: "Netherlands" },
    { name: "Jonathan Reis", positions: ["ST"], rating: 75, nationality: "Brazil" },
    { name: "Wilfried Bony", positions: ["ST"], rating: 82, nationality: "Ivory Coast" },
    { name: "Mike Havenaar", positions: ["ST"], rating: 73, nationality: "Japan" },
    { name: "Rob Wielaert", positions: ["CB"], rating: 72, nationality: "Netherlands" },
  ]),
  team("FC Utrecht", "2015/16", [
    { name: "Robbin Ruiter", positions: ["GK"], rating: 74, nationality: "Netherlands" },
    { name: "Christian Kum", positions: ["CB", "RB"], rating: 71, nationality: "Netherlands" },
    { name: "Mark van der Maarel", positions: ["CB", "RB"], rating: 73, nationality: "Netherlands" },
    { name: "Edson Braafheid", positions: ["LB"], rating: 73, nationality: "Netherlands" },
    { name: "Ramon Leeuwin", positions: ["CB"], rating: 71, nationality: "Curaçao" },
    { name: "Yassin Ayoub", positions: ["CM", "CDM"], rating: 75, nationality: "Morocco" },
    { name: "Rico Strieder", positions: ["CDM", "CM"], rating: 72, nationality: "Germany" },
    { name: "Anouar Kali", positions: ["CM"], rating: 72, nationality: "Morocco" },
    { name: "Sébastien Haller", positions: ["ST"], rating: 76, nationality: "Ivory Coast" },
    { name: "Ruud Boymans", positions: ["ST"], rating: 73, nationality: "Netherlands" },
    { name: "Sofyan Amrabat", positions: ["CDM", "CM"], rating: 73, nationality: "Morocco" },
    { name: "Bart Ramselaar", positions: ["CAM", "CM"], rating: 74, nationality: "Netherlands" },
  ]),
  team("FC Groningen", "2014/15", [
    { name: "Sergio Padt", positions: ["GK"], rating: 75, nationality: "Netherlands" },
    { name: "Hans Hateboer", positions: ["RB"], rating: 73, nationality: "Netherlands" },
    { name: "Kees Kwakman", positions: ["CB"], rating: 72, nationality: "Netherlands" },
    { name: "Eric Botteghin", positions: ["CB"], rating: 75, nationality: "Brazil" },
    { name: "Maikel Kieftenbeld", positions: ["CDM", "CM"], rating: 74, nationality: "Netherlands" },
    { name: "Tjaronn Chery", positions: ["CAM", "CM"], rating: 77, nationality: "Suriname" },
    { name: "Albert Rusnák", positions: ["CAM", "RW"], rating: 75, nationality: "Slovakia" },
    { name: "Lorenzo Burnet", positions: ["LB"], rating: 71, nationality: "Netherlands" },
    { name: "Michael de Leeuw", positions: ["ST", "CAM"], rating: 73, nationality: "Netherlands" },
    { name: "Danny Hoesen", positions: ["ST"], rating: 73, nationality: "Netherlands" },
    { name: "Jarchinio Antonia", positions: ["LW", "RW"], rating: 71, nationality: "Netherlands" },
  ]),
  team("SC Heerenveen", "2011/12", [
    { name: "Brian Vandenbussche", positions: ["GK"], rating: 73, nationality: "Belgium" },
    { name: "Joey van den Berg", positions: ["CB", "CDM"], rating: 72, nationality: "Netherlands" },
    { name: "Kenneth Otigba", positions: ["CB"], rating: 70, nationality: "Nigeria" },
    { name: "Filip Đuričić", positions: ["CAM", "LW"], rating: 76, nationality: "Serbia" },
    { name: "Hakim Ziyech", positions: ["CAM", "RW"], rating: 76, nationality: "Morocco" },
    { name: "Daley Sinkgraven", positions: ["LB", "CM"], rating: 72, nationality: "Netherlands" },
    { name: "Oussama Assaidi", positions: ["LW", "RW"], rating: 77, nationality: "Morocco" },
    { name: "Bas Dost", positions: ["ST"], rating: 78, nationality: "Netherlands" },
    { name: "Luciano Narsingh", positions: ["RW", "LW"], rating: 75, nationality: "Netherlands" },
    { name: "Rajko Rotman", positions: ["CDM", "CM"], rating: 71, nationality: "Slovenia" },
    { name: "Mitchell Te Vrede", positions: ["ST"], rating: 70, nationality: "Netherlands" },
  ]),
  team("Heracles Almelo", "2015/16", [
    { name: "Bram Castro", positions: ["GK"], rating: 71, nationality: "Belgium" },
    { name: "Wout Droste", positions: ["CB"], rating: 71, nationality: "Netherlands" },
    { name: "Tim Breukers", positions: ["RB", "CB"], rating: 72, nationality: "Netherlands" },
    { name: "Robin Pröpper", positions: ["CB"], rating: 70, nationality: "Netherlands" },
    { name: "Mike te Wierik", positions: ["CB"], rating: 71, nationality: "Netherlands" },
    { name: "Mark Uth", positions: ["ST", "CAM"], rating: 75, nationality: "Germany" },
    { name: "Thomas Bruns", positions: ["CM", "CAM"], rating: 71, nationality: "Netherlands" },
    { name: "Brandley Kuwas", positions: ["RW", "LW"], rating: 73, nationality: "Curaçao" },
    { name: "Wout Weghorst", positions: ["ST"], rating: 74, nationality: "Netherlands" },
    { name: "Samuel Armenteros", positions: ["ST"], rating: 72, nationality: "Sweden" },
    { name: "Joey Pelupessy", positions: ["CDM", "CM"], rating: 71, nationality: "Netherlands" },
  ]),
  team("Sparta Rotterdam", "2022/23", [
    { name: "Nick Olij", positions: ["GK"], rating: 76, nationality: "Netherlands" },
    { name: "Bart Vriends", positions: ["CB"], rating: 71, nationality: "Netherlands" },
    { name: "Aaron Meijers", positions: ["LB"], rating: 70, nationality: "Netherlands" },
    { name: "Tobias Lauritsen", positions: ["ST"], rating: 75, nationality: "Norway" },
    { name: "Jonathan de Guzmán", positions: ["CM", "CAM"], rating: 74, nationality: "Canada" },
    { name: "Adil Auassar", positions: ["CDM", "CB"], rating: 71, nationality: "Morocco" },
    { name: "Sven Mijnans", positions: ["CAM", "CM"], rating: 75, nationality: "Netherlands" },
    { name: "Younes Namli", positions: ["RW", "CAM"], rating: 72, nationality: "Denmark" },
    { name: "Vito van Crooij", positions: ["LW", "RW"], rating: 71, nationality: "Netherlands" },
    { name: "Mica Pinto", positions: ["LB"], rating: 70, nationality: "Luxembourg" },
    { name: "Arno Verschueren", positions: ["CM"], rating: 71, nationality: "Belgium" },
  ]),
  team("NEC", "2023/24", [
    { name: "Jasper Cillessen", positions: ["GK"], rating: 80, nationality: "Netherlands" },
    { name: "Calvin Verdonk", positions: ["LB"], rating: 75, nationality: "Netherlands" },
    { name: "Bram Nuytinck", positions: ["CB"], rating: 75, nationality: "Netherlands" },
    { name: "Philippe Sandler", positions: ["CB"], rating: 73, nationality: "Netherlands" },
    { name: "Iván Márquez", positions: ["CB"], rating: 72, nationality: "Spain" },
    { name: "Dirk Proper", positions: ["CM", "CDM"], rating: 73, nationality: "Netherlands" },
    { name: "Magnus Mattsson", positions: ["CAM", "CM"], rating: 73, nationality: "Denmark" },
    { name: "Sontje Hansen", positions: ["RW", "LW"], rating: 74, nationality: "Netherlands" },
    { name: "Kodai Sano", positions: ["CM"], rating: 72, nationality: "Japan" },
    { name: "Koki Ogawa", positions: ["ST"], rating: 75, nationality: "Japan" },
    { name: "Tjaronn Chery", positions: ["CAM", "CM"], rating: 75, nationality: "Suriname" },
  ]),
  team("Go Ahead Eagles", "2023/24", [
    { name: "Jeffrey de Lange", positions: ["GK"], rating: 72, nationality: "Netherlands" },
    { name: "Mats Deijl", positions: ["RB"], rating: 71, nationality: "Netherlands" },
    { name: "Jamal Amofa", positions: ["CB"], rating: 70, nationality: "Netherlands" },
    { name: "Bobby Adekanye", positions: ["LW", "RW"], rating: 72, nationality: "Nigeria" },
    { name: "Mathis Suray", positions: ["CB"], rating: 70, nationality: "Belgium" },
    { name: "Gerrit Nauber", positions: ["CB"], rating: 70, nationality: "Germany" },
    { name: "Mats Gilis", positions: ["LB"], rating: 70, nationality: "Belgium" },
    { name: "Evert Linthorst", positions: ["CDM", "CM"], rating: 70, nationality: "Netherlands" },
    { name: "Oliver Edvardsen", positions: ["RW", "LW"], rating: 73, nationality: "Norway" },
    { name: "Søren Tengstedt", positions: ["ST"], rating: 73, nationality: "Denmark" },
    { name: "Willum Willumsson", positions: ["CAM", "CM"], rating: 72, nationality: "Iceland" },
    { name: "Victor Edvardsen", positions: ["ST", "LW"], rating: 72, nationality: "Sweden" },
  ]),
];
