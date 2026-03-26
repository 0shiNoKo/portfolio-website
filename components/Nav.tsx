export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4" style={{ background: 'rgba(255,249,235,0.7)', backdropFilter: 'blur(8px)' }}>
      <a href="#" className="font-great-vibes text-3xl text-dark-amaranth leading-none">
        Oshinoko
      </a>
      <div className="flex gap-8 text-sm font-medium tracking-widest uppercase text-berry-crush">
        <a href="#work" className="hover:text-dark-amaranth transition-colors">Work</a>
        <a href="#about" className="hover:text-dark-amaranth transition-colors">About</a>
        <a href="#services" className="hover:text-dark-amaranth transition-colors">Services</a>
        <a href="#contact" className="hover:text-dark-amaranth transition-colors">Contact</a>
      </div>
    </nav>
  )
}
