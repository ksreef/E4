export type EnemyKind = "drone" | "dart" | "turret" | "lancer";
export type Formation = "line" | "vee" | "column" | "pincer";

interface EnemyStats {
  hp: number;
  score: number;
  radius: number;
  dropChance: number;
  canShoot: boolean;
}

export const ENEMY_STATS: Record<EnemyKind, EnemyStats> = {
  drone: { hp: 2, score: 100, radius: 13, dropChance: 0.015, canShoot: true },
  dart: { hp: 1, score: 150, radius: 12, dropChance: 0.015, canShoot: false },
  turret: { hp: 12, score: 400, radius: 19, dropChance: 0.3, canShoot: true },
  lancer: { hp: 4, score: 250, radius: 15, dropChance: 0.06, canShoot: true },
};

export interface Wave {
  at: number;
  kind: EnemyKind;
  count: number;
  formation: Formation;
  x?: number;
}

export interface Sector {
  name: string;
  subtitle: string;
  length: number;
  waves: Wave[];
}

export const SECTOR_GRACE_TICKS = 240;

export const SECTORS: Sector[] = [
  {
    name: "Outer Drift",
    subtitle: "Scouts ahead",
    length: 1560,
    waves: [
      { at: 60, kind: "drone", count: 4, formation: "line" },
      { at: 360, kind: "drone", count: 5, formation: "vee", x: 168 },
      { at: 660, kind: "drone", count: 5, formation: "vee", x: 312 },
      { at: 960, kind: "drone", count: 6, formation: "line" },
      { at: 1200, kind: "drone", count: 4, formation: "column", x: 120 },
      { at: 1260, kind: "drone", count: 4, formation: "column", x: 360 },
    ],
  },
  {
    name: "Shatter Belt",
    subtitle: "Divers incoming",
    length: 1800,
    waves: [
      { at: 60, kind: "drone", count: 6, formation: "vee" },
      { at: 300, kind: "dart", count: 4, formation: "line" },
      { at: 600, kind: "dart", count: 5, formation: "column", x: 144 },
      { at: 720, kind: "dart", count: 5, formation: "column", x: 336 },
      { at: 1020, kind: "drone", count: 7, formation: "line" },
      { at: 1140, kind: "dart", count: 5, formation: "vee" },
      { at: 1440, kind: "dart", count: 6, formation: "line" },
    ],
  },
  {
    name: "Gun Lanes",
    subtitle: "Turrets online",
    length: 1920,
    waves: [
      { at: 60, kind: "turret", count: 1, formation: "line" },
      { at: 240, kind: "drone", count: 6, formation: "vee" },
      { at: 540, kind: "turret", count: 2, formation: "line" },
      { at: 840, kind: "dart", count: 6, formation: "column", x: 240 },
      { at: 1080, kind: "turret", count: 2, formation: "line" },
      { at: 1140, kind: "drone", count: 6, formation: "line" },
      { at: 1500, kind: "turret", count: 3, formation: "line" },
    ],
  },
  {
    name: "Lancer Gate",
    subtitle: "Crossfire",
    length: 1920,
    waves: [
      { at: 60, kind: "lancer", count: 4, formation: "pincer" },
      { at: 360, kind: "dart", count: 6, formation: "vee" },
      { at: 600, kind: "lancer", count: 6, formation: "pincer" },
      { at: 780, kind: "turret", count: 2, formation: "line" },
      { at: 1140, kind: "lancer", count: 6, formation: "pincer" },
      { at: 1260, kind: "drone", count: 8, formation: "vee" },
      { at: 1560, kind: "dart", count: 8, formation: "line" },
    ],
  },
  {
    name: "Last Approach",
    subtitle: "Everything they have",
    length: 2040,
    waves: [
      { at: 60, kind: "turret", count: 3, formation: "line" },
      { at: 180, kind: "lancer", count: 6, formation: "pincer" },
      { at: 540, kind: "dart", count: 6, formation: "column", x: 120 },
      { at: 540, kind: "dart", count: 6, formation: "column", x: 360 },
      { at: 900, kind: "drone", count: 9, formation: "vee" },
      { at: 1020, kind: "turret", count: 2, formation: "line" },
      { at: 1320, kind: "lancer", count: 8, formation: "pincer" },
      { at: 1560, kind: "dart", count: 8, formation: "vee" },
    ],
  },
];

export function slotFor(
  wave: Wave,
  i: number,
): { delay: number; x: number; y: number } {
  const middle = (wave.count - 1) / 2;
  switch (wave.formation) {
    case "line":
      return { delay: 0, x: 240 + (i - middle) * 64, y: -30 };
    case "vee":
      return {
        delay: Math.abs(i - middle) * 10,
        x: (wave.x ?? 240) + (i - middle) * 44,
        y: -30,
      };
    case "column":
      return { delay: i * 24, x: wave.x ?? 240, y: -30 };
    case "pincer":
      return {
        delay: Math.floor(i / 2) * 30,
        x: i % 2 === 0 ? -30 : 510,
        y: 70 + Math.floor(i / 2) * 50,
      };
  }
}
