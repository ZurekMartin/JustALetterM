"use client";

import Header from '../components/Header';
import Footer from '../components/Footer';
import { useMemo, useEffect, useState, useRef } from 'react';
import { projects, logos } from '../components/data';
import { computeBentoLayout } from '../components/bentoGrid';

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


    const layout = useMemo(() => computeBentoLayout(projects), [projects]);

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
                {logos.map((tech, index) => (
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
