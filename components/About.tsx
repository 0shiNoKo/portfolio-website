export default function About() {
  return (
    <section id="about" className="py-24 px-8 max-w-5xl mx-auto" style={{ position: 'relative', zIndex: 10 }}>
      <div className="grid grid-cols-2 gap-16 items-center">
        <div>
          <p className="font-inter text-xs font-bold tracking-widest uppercase text-berry-crush mb-4">
            About
          </p>
          <h2 className="font-great-vibes text-dark-amaranth text-6xl leading-tight mb-6">
            Oshinoko
          </h2>
          <p className="font-inter text-base leading-relaxed" style={{ color: '#3a0010' }}>
            Hi, I&apos;m Oshinoko. I love improving in Minecraft as well as design. I love playing
            Minecraft PvP and just getting better in general.
          </p>
        </div>
        <div className="flex items-center justify-center">
          <div
            className="w-64 h-64 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #ffb9cf, #bd3c6d, #7b0027)',
              filter: 'blur(40px)',
              opacity: 0.35,
            }}
          />
        </div>
      </div>
    </section>
  )
}
