import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  teamSeasons,
  clubColors,
  fallbackClubColor,
  type Player,
  type TeamSeason,
  type FootballPosition,
} from "@/lib/eredivisie-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Eredivisie XI — Build Your Dream Squad" },
      {
        name: "description",
        content:
          "Roll the dice, pick from random Eredivisie club-seasons, and build your ultimate 4-3-3.",
      },
    ],
  }),
  component: Game,
});

// 4-3-3 formation slot definitions
type SlotKey =
  | "GK"
  | "LB"
  | "CB1"
  | "CB2"
  | "RB"
  | "CM1"
  | "CM2"
  | "CAM"
  | "LW"
  | "ST"
  | "RW";

interface SlotDef {
  key: SlotKey;
  label: string; // shown on pitch
  accepts: FootballPosition; // which position fills this slot
  top: string;
  left: string;
}

const FORMATION_SLOTS: SlotDef[] = [
  { key: "GK", label: "GK", accepts: "GK", top: "90%", left: "50%" },
  { key: "LB", label: "LB", accepts: "LB", top: "72%", left: "12%" },
  { key: "CB1", label: "CB", accepts: "CB", top: "74%", left: "37%" },
  { key: "CB2", label: "CB", accepts: "CB", top: "74%", left: "63%" },
  { key: "RB", label: "RB", accepts: "RB", top: "72%", left: "88%" },
  { key: "CM1", label: "CM", accepts: "CM", top: "50%", left: "28%" },
  { key: "CM2", label: "CM", accepts: "CM", top: "50%", left: "72%" },
  { key: "CAM", label: "CAM", accepts: "CAM", top: "38%", left: "50%" },
  { key: "LW", label: "LW", accepts: "LW", top: "16%", left: "18%" },
  { key: "ST", label: "ST", accepts: "ST", top: "12%", left: "50%" },
  { key: "RW", label: "RW", accepts: "RW", top: "16%", left: "82%" },
];

interface PlacedPlayer {
  player: Player;
  club: string;
  season: string;
  slot: SlotKey;
  positionPlayed: FootballPosition;
}

function Game() {
  const [occupiedSlots, setOccupiedSlots] = useState<
    Partial<Record<SlotKey, PlacedPlayer>>
  >({});
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<Set<string>>(
    new Set(),
  );
  const [current, setCurrent] = useState<TeamSeason | null>(null);
  const [rolling, setRolling] = useState(false);
  const [pickFor, setPickFor] = useState<Player | null>(null);

  const placedCount = Object.keys(occupiedSlots).length;
  const isFull = placedCount === 11;

  const slotsByAccept = useMemo(() => {
    const m: Partial<Record<FootballPosition, SlotDef[]>> = {};
    for (const s of FORMATION_SLOTS) {
      (m[s.accepts] ||= []).push(s);
    }
    return m;
  }, []);

  const findFreeSlotFor = (pos: FootballPosition): SlotKey | null => {
    const slots = slotsByAccept[pos] || [];
    for (const s of slots) if (!occupiedSlots[s.key]) return s.key;
    return null;
  };

  const availablePositionsFor = (player: Player) => {
    const uniq = Array.from(new Set(player.positions ?? []));
    return uniq.map((pos) => ({
      pos,
      slot: findFreeSlotFor(pos),
    }));
  };

  const teamHasAnyPlayable = (ts: TeamSeason) =>
    ts.players.some(
      (p) =>
        !selectedPlayerIds.has(p.id) &&
        (p.positions ?? []).some((pos) => findFreeSlotFor(pos) !== null),
    );

  const roll = () => {
    if (isFull) return;
    setRolling(true);
    setCurrent(null);
    setPickFor(null);
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

  const openPicker = (player: Player) => {
    if (selectedPlayerIds.has(player.id)) return;
    const opts = availablePositionsFor(player);
    if (!opts.some((o) => o.slot)) return; // no available positions
    setPickFor(player);
  };

  const confirmPick = (player: Player, pos: FootballPosition) => {
    const slot = findFreeSlotFor(pos);
    if (!slot || !current) return;
    setOccupiedSlots((prev) => ({
      ...prev,
      [slot]: {
        player,
        club: current.club,
        season: current.season,
        slot,
        positionPlayed: pos,
      },
    }));
    setSelectedPlayerIds((prev) => {
      const n = new Set(prev);
      n.add(player.id);
      return n;
    });
    setPickFor(null);
    setCurrent(null);
  };

  const reset = () => {
    setOccupiedSlots({});
    setSelectedPlayerIds(new Set());
    setCurrent(null);
    setPickFor(null);
  };

  const placed = Object.values(occupiedSlots) as PlacedPlayer[];
  const avg =
    placed.length > 0
      ? placed.reduce((a, b) => a + b.player.rating, 0) / placed.length
      : 0;

  const currentHasPlayable = current ? teamHasAnyPlayable(current) : false;

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
              <p className="text-xs text-muted-foreground">
                Roll. Pick. Build your 4-3-3.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-muted-foreground">
              Squad <span className="font-bold text-foreground">{placedCount}/11</span>
            </div>
            {placedCount > 0 && (
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
        <section>
          <Pitch occupied={occupiedSlots} />
          {isFull && <FinalCard avg={avg} placed={placed} onReset={reset} />}
        </section>

        <aside className="space-y-4">
          {!isFull && (
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Next pick
                </h2>
                <SlotProgress occupied={occupiedSlots} />
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
                    className={`rounded-lg border p-4 mb-4 text-center ${
                      rolling ? "animate-pulse" : ""
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${
                        (clubColors[current.club] ?? fallbackClubColor).primary
                      }33, transparent)`,
                      borderColor: `${
                        (clubColors[current.club] ?? fallbackClubColor).primary
                      }80`,
                    }}
                  >
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      {rolling ? "Rolling..." : "Selected"}
                    </div>
                    <div className="text-2xl font-black mt-1">{current.club}</div>
                    <div className="text-sm font-semibold">{current.season}</div>
                  </div>

                  {!rolling && (
                    <>
                      {!currentHasPlayable ? (
                        <div className="text-center py-4">
                          <p className="text-sm text-muted-foreground mb-3">
                            No valid players available from this team. Roll again.
                          </p>
                          <Button onClick={roll} className="w-full font-bold">
                            Roll Again
                          </Button>
                        </div>
                      ) : (
                        <>
                          <p className="text-xs text-muted-foreground mb-2">
                            Pick a player. You'll choose a position next.
                          </p>
                          <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
                            {current.players.map((p) => {
                              const taken = selectedPlayerIds.has(p.id);
                              const opts = availablePositionsFor(p);
                              const anyAvailable = opts.some((o) => o.slot);
                              const disabled = taken || !anyAvailable;
                              return (
                                <button
                                  key={p.id}
                                  onClick={() => openPicker(p)}
                                  disabled={disabled}
                                  className="w-full flex items-center justify-between gap-3 rounded-md border border-border bg-secondary/40 px-3 py-2 text-left hover:bg-primary/15 hover:border-primary/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-secondary/40 disabled:hover:border-border"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div className="flex gap-0.5">
                                      {p.positions.map((pos, i) => (
                                        <PositionPill key={i} pos={pos} />
                                      ))}
                                    </div>
                                    <span className="font-medium truncate ml-1">
                                      {p.name}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {taken && (
                                      <span className="text-[10px] uppercase font-bold text-muted-foreground">
                                        Picked
                                      </span>
                                    )}
                                    {!taken && !anyAvailable && (
                                      <span className="text-[10px] uppercase font-bold text-muted-foreground">
                                        No slot
                                      </span>
                                    )}
                                    <span className="text-sm font-bold tabular-nums text-accent">
                                      {p.rating}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}
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
            {placed.length === 0 ? (
              <p className="text-sm text-muted-foreground">No players yet.</p>
            ) : (
              <ul className="space-y-1.5">
                {placed.map((s) => (
                  <li
                    key={s.slot}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <PositionPill pos={s.positionPlayed} />
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



function SlotProgress({
  occupied,
}: {
  occupied: Partial<Record<SlotKey, PlacedPlayer>>;
}) {
  const groups: { label: string; keys: SlotKey[] }[] = [
    { label: "GK", keys: ["GK"] },
    { label: "DEF", keys: ["LB", "CB1", "CB2", "RB"] },
    { label: "MID", keys: ["CM1", "CM2", "CAM"] },
    { label: "ATT", keys: ["LW", "ST", "RW"] },
  ];
  return (
    <div className="flex gap-1 text-[10px] font-bold">
      {groups.map((g) => {
        const filled = g.keys.filter((k) => occupied[k]).length;
        const full = filled === g.keys.length;
        return (
          <span
            key={g.label}
            className={`px-1.5 py-0.5 rounded ${
              full
                ? "bg-primary/20 text-primary"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            {g.label} {filled}/{g.keys.length}
          </span>
        );
      })}
    </div>
  );
}

function PositionPill({ pos }: { pos: FootballPosition }) {
  const colors: Record<string, string> = {
    GK: "bg-accent/80 text-accent-foreground",
    LB: "bg-blue-500/80 text-white",
    CB: "bg-blue-500/80 text-white",
    RB: "bg-blue-500/80 text-white",
    CDM: "bg-primary/80 text-primary-foreground",
    CM: "bg-primary/80 text-primary-foreground",
    CAM: "bg-primary/80 text-primary-foreground",
    LW: "bg-destructive/80 text-destructive-foreground",
    RW: "bg-destructive/80 text-destructive-foreground",
    ST: "bg-destructive/80 text-destructive-foreground",
  };
  return (
    <span
      className={`inline-flex items-center justify-center min-w-9 text-[10px] font-black rounded px-1 py-0.5 ${
        colors[pos] ?? "bg-secondary"
      }`}
    >
      {pos}
    </span>
  );
}

function Pitch({
  occupied,
}: {
  occupied: Partial<Record<SlotKey, PlacedPlayer>>;
}) {
  return (
    <div className="relative aspect-[3/4] w-full max-w-2xl mx-auto rounded-2xl overflow-hidden pitch-bg shadow-2xl ring-1 ring-border">
      <div
        className="absolute inset-3 border-2 rounded-md pointer-events-none"
        style={{ borderColor: "var(--pitch-line)" }}
      />
      <div
        className="absolute left-1/2 top-1/2 w-24 h-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 pointer-events-none"
        style={{ borderColor: "var(--pitch-line)" }}
      />
      <div
        className="absolute left-1/2 top-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ backgroundColor: "var(--pitch-line)" }}
      />
      <div
        className="absolute left-1/2 top-3 w-px h-[calc(100%-1.5rem)] -translate-x-1/2 pointer-events-none"
        style={{ backgroundColor: "var(--pitch-line)" }}
      />
      <div
        className="absolute left-1/2 top-3 w-1/2 h-20 -translate-x-1/2 border-2 border-t-0 pointer-events-none"
        style={{ borderColor: "var(--pitch-line)" }}
      />
      <div
        className="absolute left-1/2 bottom-3 w-1/2 h-20 -translate-x-1/2 border-2 border-b-0 pointer-events-none"
        style={{ borderColor: "var(--pitch-line)" }}
      />

      {FORMATION_SLOTS.map((slot) => {
        const placed = occupied[slot.key];
        const colors = placed
          ? clubColors[placed.club] ?? fallbackClubColor
          : null;
        return (
          <div
            key={slot.key}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
            style={{ left: slot.left, top: slot.top }}
          >
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-sm font-black shadow-lg ring-2"
              style={
                placed && colors
                  ? {
                      backgroundColor: colors.primary,
                      color: colors.secondary,
                      borderColor: colors.secondary,
                      boxShadow: `0 0 0 2px ${colors.secondary}`,
                    }
                  : {
                      backgroundColor: "rgba(0,0,0,0.35)",
                      color: "rgba(255,255,255,0.55)",
                      boxShadow: "0 0 0 2px rgba(255,255,255,0.3)",
                    }
              }
            >
              {placed ? placed.player.rating : slot.label}
            </div>
            {placed ? (
              <div className="text-center">
                <div className="text-[11px] font-bold leading-tight bg-background/80 px-1.5 py-0.5 rounded text-foreground whitespace-nowrap">
                  {placed.player.name.split(" ").slice(-1)[0]}
                </div>
                <div className="text-[9px] text-white/80 mt-0.5">
                  {placed.club}
                </div>
              </div>
            ) : (
              <div className="text-[10px] font-bold text-white/70 bg-black/40 px-1.5 py-0.5 rounded">
                {slot.label}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function FinalCard({
  avg,
  placed,
  onReset,
}: {
  avg: number;
  placed: PlacedPlayer[];
  onReset: () => void;
}) {
  const tier =
    avg >= 83
      ? "World Class"
      : avg >= 80
        ? "Elite"
        : avg >= 77
          ? "Strong"
          : avg >= 74
            ? "Solid"
            : "Underdogs";
  const clubs = new Set(placed.map((s) => s.club)).size;
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
