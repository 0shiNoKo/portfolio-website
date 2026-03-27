export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4" style={{ background: 'var(--nav-bg)', backdropFilter: 'blur(8px)', transition: 'background 0.4s ease' }}>
      <a href="#" className="font-great-vibes text-3xl text-dark-amaranth leading-none">
        Oshinoko
      </a>
      <div className="flex gap-8 items-center text-sm font-medium tracking-widest uppercase text-berry-crush">
        <a href="#work" className="hover:text-dark-amaranth transition-colors">Work</a>
        <a href="#about" className="hover:text-dark-amaranth transition-colors">About</a>
        <a href="#services" className="hover:text-dark-amaranth transition-colors">Services</a>
        <a href="#contact" className="hover:text-dark-amaranth transition-colors">Contact</a>
      </div>
    </nav>
  )
}
