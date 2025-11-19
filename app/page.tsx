"use client";

import Header from '../components/Header';
import Footer from '../components/Footer';
import { useMemo, useEffect, useState, useRef } from 'react';

export default function Home() {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setOpacity(Math.max(0, 1 - scrollY / 300));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const projects = [
    { name: 'AP1VS', size: 'S', language: 'Python', link: 'https://github.com/ZurekMartin/AP1VS' },
    { name: 'AP2ZC', size: 'S', language: 'C', link: 'https://github.com/ZurekMartin/AP2ZC' },
    { name: 'AP3KR', size: 'L', language: 'Python', link: 'https://github.com/ZurekMartin/AP3KR' },
    { name: 'AP3TI', size: 'M', language: 'Python', link: 'https://github.com/ZurekMartin/AP3TI' },
    { name: 'AP4AL', size: 'M', language: 'C', link: 'https://github.com/ZurekMartin/AP4AL' },
    { name: 'AP4TW', size: 'S', language: 'HTML', link: 'https://github.com/ZurekMartin/AP4TW' },
    { name: 'AP5PM', size: 'M', language: 'TypeScript', link: 'https://github.com/ZurekMartin/AP5PM' },
    { name: 'AP5PW', size: 'M', language: 'C#', link: 'https://github.com/ZurekMartin/AP5PW' },
    { name: 'AP6BS', size: 'L', language: 'TypeScript', link: 'https://github.com/ZurekMartin/AP6BS' },
    { name: 'AP6UI', size: 'M', language: 'Python', link: 'https://github.com/ZurekMartin/AP6UI' },
    { name: 'AP7AK', size: 'S', language: 'Python', link: 'https://github.com/ZurekMartin/AP7AK' },
    { name: 'AP7MT', size: 'M', language: 'Kotlin', link: 'https://github.com/ZurekMartin/AP7MT' },
    { name: 'AP7SU', size: 'M', language: 'Jupyter Notebook', link: 'https://github.com/ZurekMartin/AP7SU' },
    { name: 'JustALetterM', size: 'M', language: 'TypeScript', link: 'https://github.com/ZurekMartin/JustALetterM' },
    { name: 'SimpleChat', size: 'S', language: 'Python', link: 'https://github.com/ZurekMartin/SimpleChat' },
    { name: 'SimpleRecipes', size: 'S', language: 'JavaScript', link: 'https://github.com/ZurekMartin/SimpleRecipes' },
  ];

    const layout = useMemo(() => {
    const COLS = 4;
    type Owner = null | { type: 'L' | 'M_h' | 'M_v' | 'S'; index: number; start: { r: number; c: number } };
    
    let bestPlacements: Array<{ index: number; r: number; c: number; w: number; h: number }> = [];
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

      const placements: Array<{ index: number; r: number; c: number; w: number; h: number }> = [];

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

    const shapes = [
      { w: 2, h: 1 },
      { w: 1, h: 2 },
      { w: 2, h: 2 },
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
            if (process.env.NODE_ENV === 'development') console.log('Skip 2x2 expansion when bottom row not part of main empty area:', { minR, minC });
            continue;
          }
        }

        const tkey = key(minR, minC) + `-${w}x${h}`;
        if (tried.has(tkey)) continue;
        tried.add(tkey);

        if (process.env.NODE_ENV === 'development') console.log('Adding placeholder by shape:', { minR, minC, w, h });
        placements.push({ index: -1, r: minR, c: minC, w, h });
        s.r = Infinity;
        break;
      }
    }

    return placements;
  }, [projects]);

  const [cols, setCols] = useState<number>(4);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [tileSize, setTileSize] = useState('0px');
  useEffect(() => {
    const updateCols = () => {
      const w = window.innerWidth;
      if (w <= 640) setCols(2);
      else if (w <= 1024) setCols(3);
      else setCols(4);
    };
    updateCols();
    window.addEventListener('resize', updateCols);
    return () => window.removeEventListener('resize', updateCols);
  }, []);

  useEffect(() => {
    const updateTileSize = () => {
      const el = gridRef.current;
      if (!el) return;
      const gap = 16 * (cols - 1);
      const w = el.clientWidth - gap;
      if (w <= 0) return;
      const size = Math.floor(w / cols);
      setTileSize(`${size}px`);
    };
    updateTileSize();
    window.addEventListener('resize', updateTileSize);
    return () => window.removeEventListener('resize', updateTileSize);
  }, [cols]);

  return (
    <div className="min-h-screen bg-[#071018] text-zinc-200" style={{
      ['--tech-icon-size' as any]: '64px',
      ['--tech-padding' as any]: '12px',
      ['--tech-tile-size' as any]: 'calc(var(--tech-icon-size) + 2 * var(--tech-padding))',
      ['--grid-unit' as any]: 'calc(var(--tech-tile-size) * 2.25)',
      ['--grid-gap' as any]: '16px'
    }}>
      <Header />
      <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden text-white hero-bg">
        <div className="text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Jsem Martin Žůrek</h1>
          <p className="text-xl md:text-2xl text-zinc-200 mb-8">
            Vývojář, který přemění Vaši vizi ve skutečnost.
          </p>
        </div>
        <div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center text-zinc-300 transition-opacity duration-100"
          style={{ opacity }}
        >
          <p>Momentálně nepřibírám další zakázky<span className="text-red-500 text-2xl ml-2">●</span></p>
        </div>
      </section>
      
      <main className="px-4 py-8 max-w-5xl mx-auto">
        {/* About Section */}
        <section id="about" className="py-16 scroll-mt-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">O mně</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-zinc-400">
                Jsem vášnivý vývojář, který miluje řešení problémů. Mám zkušenosti s různými technologiemi a stále prozkoumávám nové.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Výběr technologií se kterými pracuji</h3>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { name: 'Firebase', icon: 'https://cdn.simpleicons.org/firebase' },
                  { name: 'Node.js', icon: 'https://cdn.simpleicons.org/nodedotjs' },
                  { name: 'PostgreSQL', icon: 'https://cdn.simpleicons.org/postgresql' },
                  { name: 'Vercel', icon: 'https://cdn.simpleicons.org/vercel' },
                  { name: 'Git', icon: 'https://cdn.simpleicons.org/git' },
                  { name: 'Vue.js', icon: 'https://cdn.simpleicons.org/vuedotjs' },
                  { name: 'TypeScript', icon: 'https://cdn.simpleicons.org/typescript' },
                  { name: 'Next.js', icon: 'https://cdn.simpleicons.org/nextdotjs' },
                  { name: 'HTML', icon: 'https://cdn.simpleicons.org/html5' },
                  { name: 'Python', icon: 'https://cdn.simpleicons.org/python' },
                  { name: 'Yarn', icon: 'https://cdn.simpleicons.org/yarn' },
                  { name: 'GitHub', icon: 'https://cdn.simpleicons.org/github' },
                  { name: 'GitLab', icon: 'https://cdn.simpleicons.org/gitlab' },
                  { name: 'React', icon: 'https://cdn.simpleicons.org/react' },
                  { name: 'Tailwind CSS', icon: 'https://cdn.simpleicons.org/tailwindcss' },
                  { name: 'C', icon: 'https://cdn.simpleicons.org/c' },
                ].map((tech, index) => (
                  <div
                    key={index}
                    className="bg-slate-700 rounded-lg aspect-square flex items-center justify-center hover:scale-110 hover:bg-slate-600 transition-all duration-300"
                    style={{ padding: 'var(--tech-padding)' }}
                  >
                    <img src={tech.icon} alt={tech.name} style={{ width: 'var(--tech-icon-size)', height: 'var(--tech-icon-size)' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="py-16 scroll-mt-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Vzdělání</h2>
          <div>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-700 h-full"></div>
              {/* Timeline items */}
              <div className="space-y-8">
                <div className="flex items-center">
                  <div className="w-1/2 pr-8 text-right">
                    <div className="bg-slate-800 p-4 rounded-lg shadow-lg border border-gray-600">
                      <h3 className="font-bold text-white">Gymnázium Ladislava Jaroše Holešov</h3>
                      <p className="text-sm text-zinc-400">2013 - 2021</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-gray-700"></div>
                  <div className="w-1/2"></div>
                </div>
                <div className="flex items-center">
                  <div className="w-1/2"></div>
                  <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-gray-700"></div>
                  <div className="w-1/2 pl-8">
                    <div className="bg-slate-800 p-4 rounded-lg shadow-lg border border-gray-600">
                      <h3 className="font-bold text-white">Univerzita Tomáše Bati – Fakulta Aplikované informatiky<br />Softwarové inženýrství – Bc.</h3>
                      <p className="text-sm text-zinc-400">2022 - 2025</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-1/2 pr-8 text-right">
                    <div className="bg-slate-800 p-4 rounded-lg shadow-lg border border-gray-600">
                      <h3 className="font-bold text-white">Univerzita Tomáše Bati – Fakulta Aplikované informatiky<br />Informační technologie – Kybernetická bezpečnost – Ing.</h3>
                      <p className="text-sm text-zinc-400">2025 - současnost</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-gray-700"></div>
                  <div className="w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
            <section id="projects" className="py-16 scroll-mt-8 mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Projekty</h2>
            <div className="flex justify-center items-start" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                <div
                  className="bg-transparent max-w-5xl w-full"
                  style={{
                      display: 'grid',
                      gap: '16px',
                      gridTemplateColumns: `repeat(${cols}, var(--tile-size))`,
                      gridAutoRows: `var(--tile-size)`,
                      ['--tile-size' as any]: tileSize,
                    }}
                    ref={gridRef}
                >
              {layout.map((pl, idx) => {
                if (pl.index === -1) {
                  return (
                    <a
                      key={`placeholder-${idx}`}
                      href="https://github.com/ZurekMartin"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-slate-900/80 p-4 rounded-lg shadow-lg border-2 border-dashed border-gray-600 flex flex-col justify-center items-center transform hover:scale-105 hover:bg-slate-800 hover:shadow-2xl transition-all duration-300"
                      style={{ gridColumn: `${pl.c + 1} / span ${pl.w}`, gridRow: `${pl.r + 1} / span ${pl.h}` }}
                    >
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-white">Mnohé další</h3>
                        <p className="text-sm text-zinc-400">Otevřít GitHub</p>
                      </div>
                    </a>
                  );
                }

                const p = projects[pl.index];
                return (
                  <a
                    key={`proj-${pl.index}-${idx}`}
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-slate-900 p-4 rounded-lg shadow-lg border border-gray-700 flex flex-col justify-between transform hover:scale-105 hover:bg-slate-800 hover:shadow-2xl transition-all duration-300"
                    style={{ gridColumn: `${pl.c + 1} / span ${pl.w}`, gridRow: `${pl.r + 1} / span ${pl.h}` }}
                  >
                    <div>
                      <h3 className="text-lg font-bold text-white">{p.name}</h3>
                      <p className="text-sm text-zinc-400">{p.language}</p>
                    </div>
                    <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs text-zinc-300 bg-white/5 px-2 py-1 rounded self-start">
                      Otevřít na GitHubu
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 scroll-mt-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Kontakt</h2>
            <p className="text-zinc-400 mb-8 text-center">Máte otázky nebo zájem o spolupráci? Napište mi!</p>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">Jméno</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Vaše jméno"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">E-mail</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="vas@email.cz"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-2">Zpráva</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full px-4 py-3 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Vaše zpráva..."
                  required
                ></textarea>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  Odeslat zprávu
                </button>
              </div>
            </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}
