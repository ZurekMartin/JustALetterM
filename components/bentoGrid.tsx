import { Project } from './types';
import type { Placement, Owner } from './types';

export function computeBentoLayout(projects: Project[]): Placement[] {
  const COLS = 4;
  let bestPlacements: Array<Placement> = [];
  let minEmpty = Infinity;

  for (let attempt = 0; attempt < 20; attempt++) {
    let grid: Owner[][] = [];

    const ensureRow = (r: number) => {
      while (grid.length <= r) grid.push(new Array(COLS).fill(null));
    };

    const fits = (r: number, c: number, w: number, h: number) => {
      if (c < 0 || c + w > COLS) return false;
      for (let rr = r; rr < r + h; rr++) {
        ensureRow(rr);
        for (let cc = c; cc < c + w; cc++) if (grid[rr][cc] !== null) return false;
      }
      return true;
    };

    const place = (r: number, c: number, w: number, h: number, owner: Owner) => {
      for (let rr = r; rr < r + h; rr++) {
        ensureRow(rr);
        for (let cc = c; cc < c + w; cc++) grid[rr][cc] = owner;
      }
    };

    const placements: Array<Placement> = [];

    const findAllSpots = (w: number, h: number, maxRows = 20) => {
      const spots: { r: number; c: number }[] = [];
      for (let r = 0; r < maxRows; r++) {
        ensureRow(r);
        for (let c = 0; c < COLS; c++) {
          if (fits(r, c, w, h)) spots.push({ r, c });
        }
      }
      return spots;
    };

    function hashString(str: string) {
      let h = 2166136261 >>> 0;
      for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
        h >>>= 0;
      }
      return h >>> 0;
    }

    function mulberry32(a: number) {
      return function () {
        a |= 0;
        a = (a + 0x6D2B79F5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    const seed = hashString(projects.map(p => p.name).join('|'));
    const rng = mulberry32(seed);

    function shuffle(array: any[]) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    const order = shuffle(projects.map((p, i) => ({ ...p, index: i })));
    const Ls = order.filter(p => p.size === 'L');
    const Ms = order.filter(p => p.size === 'M');
    const Ss = order.filter(p => p.size === 'S');

    for (const p of Ls) {
      const spots = findAllSpots(2, 2);
      let found = false;
      for (const s of spots) {
        let conflict = false;
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            if (Math.abs(dr) + Math.abs(dc) === 0) continue;
            for (let rr = 0; rr < 2; rr++) {
              for (let cc = 0; cc < 2; cc++) {
                const nr = s.r + rr + dr;
                const nc = s.c + cc + dc;
                if (nr >= 0 && nc >= 0 && nc < COLS && grid[nr] && grid[nr][nc] && grid[nr][nc]?.type === 'L') {
                  if (Math.abs(dr) <= 1 && Math.abs(dc) <= 1) conflict = true;
                  if ((dr === 2 || dr === -2) && cc === 0) conflict = true;
                  if ((dc === 2 || dc === -2) && rr === 0) conflict = true;
                }
              }
            }
          }
        }
        if (!conflict) {
          place(s.r, s.c, 2, 2, { type: 'L', index: p.index, start: { r: s.r, c: s.c } });
          placements.push({ index: p.index, r: s.r, c: s.c, w: 2, h: 2 });
          found = true;
          break;
        }
      }
      if (!found) {
        const s = findAllSpots(2, 1)[0] || findAllSpots(1, 1)[0];
        if (s) {
          const w = fits(s.r, s.c, 2, 1) ? 2 : 1;
          const h = fits(s.r, s.c, 1, 1) && !fits(s.r, s.c, 2, 1) ? 1 : (w === 2 ? 1 : 1);
          place(s.r, s.c, w, h, { type: w === 2 ? 'M_h' : 'S', index: p.index, start: { r: s.r, c: s.c } });
          placements.push({ index: p.index, r: s.r, c: s.c, w, h });
        }
      }
    }

    for (const p of Ms) {
      let placed = false;
      const tryVertFirst = rng() < 0.5;
      const tryOrders = tryVertFirst ? [[1,2],[2,1]] : [[2,1],[1,2]];
      for (const [w, h] of tryOrders) {
        const spots = findAllSpots(w, h, 30);
        for (const s of spots) {
          let conflict = false;
          if (w === 2 && h === 1) { 
            for (let dr = -1; dr <= 1; dr++) {
              for (let dc = -2; dc <= 2; dc++) {
                if (Math.abs(dr) + Math.abs(dc) === 0) continue;
                if (dr === 0 && (dc === -2 || dc === 2)) {
                  if (grid[s.r][s.c + dc] && grid[s.r][s.c + dc]?.type === 'M_h') conflict = true;
                }
                if ((dr === -1 || dr === 1) && (dc === 0 || dc === 1)) {
                  if (grid[s.r + dr] && grid[s.r + dr][s.c + dc] && grid[s.r + dr][s.c + dc]?.type === 'M_h') conflict = true;
                }
              }
            }
          } else if (w === 1 && h === 2) {
            for (let dr = -2; dr <= 2; dr++) {
              for (let dc = -1; dc <= 1; dc++) {
                if (Math.abs(dr) + Math.abs(dc) === 0) continue;
                if (dc === 0 && (dr === -2 || dr === 2)) {
                  if (grid[s.r + dr] && grid[s.r + dr][s.c] && grid[s.r + dr][s.c]?.type === 'M_v') conflict = true;
                }
                if ((dc === -1 || dc === 1) && (dr === 0 || dr === 1)) {
                  if (grid[s.r + dr][s.c + dc] && grid[s.r + dr][s.c + dc]?.type === 'M_v') conflict = true;
                }
              }
            }
          }
          if (!conflict) {
            place(s.r, s.c, w, h, { type: w === 2 ? 'M_h' : 'M_v', index: p.index, start: { r: s.r, c: s.c } });
            placements.push({ index: p.index, r: s.r, c: s.c, w, h });
            placed = true;
            break;
          }
        }
        if (placed) break;
      }
      if (!placed) {
        const s = findAllSpots(1, 1, 30)[0];
        if (s) {
          place(s.r, s.c, 1, 1, { type: 'S', index: p.index, start: { r: s.r, c: s.c } });
          placements.push({ index: p.index, r: s.r, c: s.c, w: 1, h: 1 });
        }
      }
    }

    for (const p of Ss) {
      const spot = findAllSpots(1, 1, 50)[0];
      if (spot) {
        place(spot.r, spot.c, 1, 1, { type: 'S', index: p.index, start: { r: spot.r, c: spot.c } });
        placements.push({ index: p.index, r: spot.r, c: spot.c, w: 1, h: 1 });
      }
    }

    placements.sort((a, b) => a.r - b.r || a.c - b.c || a.index - b.index);

    const maxRow = placements.length ? Math.max(...placements.map(p => p.r + p.h - 1)) : 0;
    const emptySpots: { r: number; c: number }[] = [];
    for (let r = 0; r <= maxRow; r++) {
      for (let c = 0; c < COLS; c++) {
        if (grid[r] && grid[r][c] === null) {
          emptySpots.push({ r, c });
        }
      }
    }

    if (emptySpots.length < minEmpty) {
      minEmpty = emptySpots.length;
      bestPlacements = placements.slice();
    }
  }

  const placements = bestPlacements;
  const maxRow = placements.length ? Math.max(...placements.map(p => p.r + p.h - 1)) : 0;
  const searchMaxRow = maxRow + 1;
  const emptySpots: { r: number; c: number }[] = [];
  for (let r = 0; r <= searchMaxRow; r++) {
    for (let c = 0; c < COLS; c++) {
      const occupied = placements.some(p => p.r <= r && r < p.r + p.h && p.c <= c && c < p.c + p.w);
      if (!occupied) {
        emptySpots.push({ r, c });
      }
    }
  }

  const emptyMain = emptySpots.filter(e => e.r <= maxRow);
  if (emptyMain.length === 0) return placements;

  const key = (r: number, c: number) => `${r},${c}`;
  const emptyMainMap = new Map(emptyMain.map(e => [key(e.r, e.c), true]));

  const neighbors = (r: number, c: number) => [
    { r: r - 1, c },
    { r: r + 1, c },
    { r, c: c - 1 },
    { r, c: c + 1 },
  ];

  const isOccupied = (r: number, c: number) => placements.some(p => p.r <= r && r < p.r + p.h && p.c <= c && c < p.c + p.w);

  const rectangleIsIsolated = (minR: number, minC: number, w: number, h: number) => {
    for (let rr = minR; rr < minR + h; rr++) {
      for (let cc = minC; cc < minC + w; cc++) {
        for (const n of neighbors(rr, cc)) {
          const nk = key(n.r, n.c);
          if (n.r < 0 || n.c < 0 || n.c >= COLS) continue;
          if (n.r >= 0 && n.r <= maxRow && emptyMainMap.has(nk)) {
            if (!(n.r >= minR && n.r < minR + h && n.c >= minC && n.c < minC + w)) return false;
          }
        }
      }
    }
    return true;
  };

  const MAX_PLACEHOLDERS = 1;
  let placeholdersAdded = 0;

  const shapes = [
    { w: 2, h: 2 },
    { w: 2, h: 1 },
    { w: 1, h: 2 },
    { w: 1, h: 1 },
  ];

  const tried = new Set<string>();
  for (const s of emptyMain) {
    for (const { w, h } of shapes) {
      const minR = s.r;
      const minC = s.c;
      if (minC + w - 1 >= COLS) continue;
      if (minR + h - 1 > maxRow + 1) continue;

      let allEmpty = true;
      for (let rr = minR; rr < minR + h; rr++) {
        for (let cc = minC; cc < minC + w; cc++) {
          if (rr <= maxRow) {
            if (!emptyMainMap.has(key(rr, cc))) allEmpty = false;
          } else {
            if (isOccupied(rr, cc)) allEmpty = false;
          }
        }
      }
      if (!allEmpty) continue;

      if (!rectangleIsIsolated(minR, minC, w, h)) continue;
      
      if (w === 2 && h === 2) {
        if (minR + 1 > maxRow) {
          continue;
        }
      }

      const tkey = key(minR, minC) + `-${w}x${h}`;
      if (tried.has(tkey)) continue;
      tried.add(tkey);

      if (placeholdersAdded >= MAX_PLACEHOLDERS) continue;
      placements.push({ index: -1, r: minR, c: minC, w, h });
      placeholdersAdded += 1;
      s.r = Infinity;
      break;
    }
  }

  return placements;
}
