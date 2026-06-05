import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { teamSeasons, type Player, type TeamSeason } from "@/lib/eredivisie-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Eredivisie XI — Build Your Dream Squad" },
      { name: "description", content: "Roll the dice, pick from random Eredivisie club-seasons, and build your ultimate 11." },
    ],
  }),
  component: Game,
});

type Slot = { player: Player; club: string; season: string };

const FORMATION = { GK: 1, DEF: 4, MID: 4, FWD: 2 } as const;

function Game() {
  const [squad, setSquad] = useState<Slot[]>([]);
  const [current, setCurrent] = useState<TeamSeason | null>(null);
  const [rolling, setRolling] = useState(false);

  const need = useMemo(() => {
    const counts = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
    squad.forEach((s) => counts[s.player.position]++);
    return counts;
  }, [squad]);

  const isFull = squad.length === 11;

  const roll = () => {
    setRolling(true);
    setCurrent(null);
    let ticks = 0;
    const interval = setInterval(() => {
      setCurrent(teamSeasons[Math.floor(Math.random() * teamSeasons.length)]);
      ticks++;
      if (ticks > 10) {
        clearInterval(interval);
        setRolling(false);
      }
    }, 80);
  };

  const pickPlayer = (p: Player) => {
    if (!current || isFull) return;
    if (need[p.position] >= FORMATION[p.position]) return;
    setSquad((s) => [...s, { player: p, club: current.club, season: current.season }]);
    setCurrent(null);
  };

  const reset = () => {
    setSquad([]);
    setCurrent(null);
  };

  const avg =
    squad.length > 0
      ? squad.reduce((a, b) => a + b.player.rating, 0) / squad.length
      : 0;

  const slotAvailable = (pos: Player["position"]) =>
    need[pos] < FORMATION[pos];

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-black">
              XI
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">Eredivisie XI</h1>
              <p className="text-xs text-muted-foreground">Roll. Pick. Build your dream squad.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-muted-foreground">
              Squad <span className="font-bold text-foreground">{squad.length}/11</span>
            </div>
            {squad.length > 0 && (
              <button
                onClick={reset}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[1fr_420px]">
        {/* Pitch */}
        <section>
          <Pitch squad={squad} />
          {isFull && <FinalCard avg={avg} squad={squad} onReset={reset} />}
        </section>

        {/* Side panel */}
        <aside className="space-y-4">
          {!isFull && (
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Next pick
                </h2>
                <NeedBadge need={need} />
              </div>

              {!current && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎲</div>
                  <p className="text-sm text-muted-foreground mb-5">
                    Roll the dice to get a random Eredivisie club-season.
                  </p>
                  <Button onClick={roll} size="lg" className="w-full font-bold">
                    Roll the Dice
                  </Button>
                </div>
              )}

              {current && (
                <div>
                  <div
                    className={`rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30 p-4 mb-4 text-center ${
                      rolling ? "animate-pulse" : ""
                    }`}
                  >
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      {rolling ? "Rolling..." : "Selected"}
                    </div>
                    <div className="text-2xl font-black mt-1">{current.club}</div>
                    <div className="text-sm text-primary font-semibold">{current.season}</div>
                  </div>

                  {!rolling && (
                    <>
                      <p className="text-xs text-muted-foreground mb-2">
                        Pick one player for your{" "}
                        <span className="text-foreground font-semibold">
                          {nextNeededPositions(need).join(" / ") || "squad"}
                        </span>
                        :
                      </p>
                      <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
                        {current.players.map((p) => {
                          const disabled = !slotAvailable(p.position);
                          return (
                            <button
                              key={p.name}
                              onClick={() => pickPlayer(p)}
                              disabled={disabled}
                              className="w-full flex items-center justify-between gap-3 rounded-md border border-border bg-secondary/40 px-3 py-2 text-left hover:bg-primary/15 hover:border-primary/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-secondary/40 disabled:hover:border-border"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <PositionPill pos={p.position} />
                                <span className="font-medium truncate">{p.name}</span>
                              </div>
                              <span className="text-sm font-bold tabular-nums text-accent">
                                {p.rating}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}
            </Card>
          )}

          <Card className="p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Your squad
            </h2>
            {squad.length === 0 ? (
              <p className="text-sm text-muted-foreground">No players yet.</p>
            ) : (
              <ul className="space-y-1.5">
                {squad.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <PositionPill pos={s.player.position} />
                      <span className="font-medium truncate">{s.player.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground truncate">
                      {s.club} {s.season.split("/")[0]}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </aside>
      </main>
    </div>
  );
}

function nextNeededPositions(need: Record<Player["position"], number>) {
  const list: string[] = [];
  (Object.keys(FORMATION) as Player["position"][]).forEach((p) => {
    if (need[p] < FORMATION[p]) list.push(p);
  });
  return list;
}

function NeedBadge({ need }: { need: Record<Player["position"], number> }) {
  return (
    <div className="flex gap-1 text-[10px] font-bold">
      {(Object.keys(FORMATION) as Player["position"][]).map((p) => (
        <span
          key={p}
          className={`px-1.5 py-0.5 rounded ${
            need[p] >= FORMATION[p]
              ? "bg-primary/20 text-primary"
              : "bg-secondary text-muted-foreground"
          }`}
        >
          {p} {need[p]}/{FORMATION[p]}
        </span>
      ))}
    </div>
  );
}

function PositionPill({ pos }: { pos: Player["position"] }) {
  const colors: Record<Player["position"], string> = {
    GK: "bg-accent/80 text-accent-foreground",
    DEF: "bg-blue-500/80 text-white",
    MID: "bg-primary/80 text-primary-foreground",
    FWD: "bg-destructive/80 text-destructive-foreground",
  };
  return (
    <span
      className={`inline-flex items-center justify-center w-9 text-[10px] font-black rounded px-1 py-0.5 ${colors[pos]}`}
    >
      {pos}
    </span>
  );
}

function Pitch({ squad }: { squad: Slot[] }) {
  const byPos = {
    GK: squad.filter((s) => s.player.position === "GK"),
    DEF: squad.filter((s) => s.player.position === "DEF"),
    MID: squad.filter((s) => s.player.position === "MID"),
    FWD: squad.filter((s) => s.player.position === "FWD"),
  };

  const rows: { pos: Player["position"]; slots: number; top: string }[] = [
    { pos: "GK", slots: 1, top: "88%" },
    { pos: "DEF", slots: 4, top: "68%" },
    { pos: "MID", slots: 4, top: "42%" },
    { pos: "FWD", slots: 2, top: "16%" },
  ];

  return (
    <div className="relative aspect-[3/4] w-full max-w-2xl mx-auto rounded-2xl overflow-hidden pitch-bg shadow-2xl ring-1 ring-border">
      {/* pitch markings */}
      <div className="absolute inset-3 border-2 rounded-md pointer-events-none" style={{ borderColor: "var(--pitch-line)" }} />
      <div
        className="absolute left-1/2 top-1/2 w-24 h-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 pointer-events-none"
        style={{ borderColor: "var(--pitch-line)" }}
      />
      <div className="absolute left-1/2 top-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ backgroundColor: "var(--pitch-line)" }} />
      <div
        className="absolute left-1/2 top-3 w-px h-[calc(100%-1.5rem)] -translate-x-1/2 pointer-events-none"
        style={{ backgroundColor: "var(--pitch-line)" }}
      />
      {/* penalty boxes */}
      <div className="absolute left-1/2 top-3 w-1/2 h-20 -translate-x-1/2 border-2 border-t-0 pointer-events-none" style={{ borderColor: "var(--pitch-line)" }} />
      <div className="absolute left-1/2 bottom-3 w-1/2 h-20 -translate-x-1/2 border-2 border-b-0 pointer-events-none" style={{ borderColor: "var(--pitch-line)" }} />

      {rows.map((row) =>
        Array.from({ length: row.slots }).map((_, i) => {
          const left = ((i + 1) / (row.slots + 1)) * 100;
          const slot = byPos[row.pos][i];
          return (
            <div
              key={`${row.pos}-${i}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
              style={{ left: `${left}%`, top: row.top }}
            >
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-sm font-black shadow-lg ring-2 ${
                  slot
                    ? "bg-card ring-primary text-foreground"
                    : "bg-background/40 ring-white/30 text-white/40 border-dashed"
                }`}
              >
                {slot ? slot.player.rating : row.pos}
              </div>
              {slot && (
                <div className="text-center">
                  <div className="text-[11px] font-bold leading-tight bg-background/80 px-1.5 py-0.5 rounded text-foreground whitespace-nowrap">
                    {slot.player.name.split(" ").slice(-1)[0]}
                  </div>
                  <div className="text-[9px] text-white/80 mt-0.5">
                    {slot.club}
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

function FinalCard({
  avg,
  squad,
  onReset,
}: {
  avg: number;
  squad: Slot[];
  onReset: () => void;
}) {
  const tier =
    avg >= 83 ? "World Class" : avg >= 80 ? "Elite" : avg >= 77 ? "Strong" : avg >= 74 ? "Solid" : "Underdogs";
  const clubs = new Set(squad.map((s) => s.club)).size;
  return (
    <Card className="mt-6 p-6 bg-gradient-to-br from-primary/15 via-card to-accent/10 border-primary/40">
      <div className="text-center">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          Final Squad Rating
        </div>
        <div className="text-6xl font-black text-primary mt-1 tabular-nums">
          {avg.toFixed(1)}
        </div>
        <div className="text-lg font-bold text-accent mt-1">{tier}</div>
        <div className="text-xs text-muted-foreground mt-2">
          Players drawn from {clubs} different club-season{clubs > 1 ? "s" : ""}.
        </div>
        <Button onClick={onReset} size="lg" className="mt-5 font-bold">
          Play Again
        </Button>
      </div>
    </Card>
  );
}
