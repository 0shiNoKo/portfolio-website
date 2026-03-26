const DISCORD = 'https://discord.gg/rzuNFKn2'

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-center px-8" style={{ position: 'relative', zIndex: 1 }}>
      <h1
        className="font-great-vibes text-dark-amaranth leading-none mb-3"
        style={{ fontSize: '15rem', textShadow: '0 2px 24px rgba(255,185,207,0.53)' }}
      >
        Oshinoko
      </h1>
      <p
        className="font-inter text-berry-crush font-medium uppercase mb-7"
        style={{ fontSize: '0.85rem', letterSpacing: '5px' }}
      >
        Improvement is Key
      </p>
      <a
        href={DISCORD}
        target="_blank"
        rel="noopener noreferrer"
        className="font-inter font-semibold tracking-widest"
        style={{
          fontSize: '0.9rem',
          background: 'linear-gradient(90deg, #9c1e4a, #bd3c6d)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Let's talk
      </a>
    </section>
  )
}
