export default function Footer() {
  return (
    <footer className="backdrop-blur-xs border-t border-white/10 ring-1 ring-white/5 shadow-lg bg-black/20 text-zinc-200 py-4 mt-16">
      <div className="container mx-auto text-center px-4">
        <p>© {new Date().getFullYear()} <a href="https://github.com/ZurekMartin" className="hover:text-white/80 transition-colors duration-200" target="_blank" rel="noopener noreferrer">Martin Žůrek</a></p>
      </div>
    </footer>
  );
}
