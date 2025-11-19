import { Bars3Icon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const sections = ['hero', 'about', 'education', 'projects', 'contact'];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const getLinkClasses = (section: string) => {
    const baseClasses = 'hover:text-white/80 transition-all duration-200';
    const activeClasses = activeSection === section ? 'text-white font-bold text-lg' : '';
    return `${baseClasses} ${activeClasses}`;
  };

  return (
    <header className="fixed top-4 z-50 left-1/2 w-full max-w-4xl transform -translate-x-1/2">
      <div className="flex items-center justify-center gap-4 relative">
        <div className="backdrop-blur-xs border border-white/10 ring-1 ring-white/5 shadow-lg rounded-full px-6 py-3 bg-black/20">
          <div className="flex items-center justify-between md:justify-center">
            <nav aria-label="Hlavní navigace" className="hidden md:block">
              <ul className="flex items-center gap-6 text-gray-200 text-sm sm:text-base">
                <li>
                  <a href="#hero" className={getLinkClasses('hero')}>Úvod</a>
                </li>
                <li>
                  <a href="#about" className={getLinkClasses('about')}>O mně</a>
                </li>
                <li>
                  <a href="#education" className={getLinkClasses('education')}>Vzdělání</a>
                </li>
                <li>
                  <a href="#projects" className={getLinkClasses('projects')}>Projekty</a>
                </li>
                <li>
                  <a href="#contact" className={getLinkClasses('contact')}>Kontakt</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="relative md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="backdrop-blur-xs border border-white/10 ring-1 ring-white/5 shadow-lg rounded-full p-3 bg-black/20">
            <Bars3Icon className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className={`absolute top-full mt-4 backdrop-blur-xs border border-white/10 ring-1 ring-white/5 shadow-lg rounded-lg py-3 bg-black/20 md:hidden min-w-64 transition-all duration-300 ease-out ${isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
          <ul className="flex flex-col gap-2 text-gray-200 text-sm px-6">
            <li>
              <a href="#about" className={`${getLinkClasses('about')} text-center block`} onClick={() => setIsMenuOpen(false)}>O mně</a>
            </li>
            <li>
              <a href="#education" className={`${getLinkClasses('education')} text-center block`} onClick={() => setIsMenuOpen(false)}>Vzdělání</a>
            </li>
            <li>
              <a href="#projects" className={`${getLinkClasses('projects')} text-center block`} onClick={() => setIsMenuOpen(false)}>Projekty</a>
            </li>
            <li>
              <a href="#contact" className={`${getLinkClasses('contact')} text-center block`} onClick={() => setIsMenuOpen(false)}>Kontakt</a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
