const DISCORD = 'https://discord.gg/DSE9rQy8Za'

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-center px-8" style={{ position: 'relative', zIndex: 1 }}>
      <div className="relative inline-block mb-3">
        <h1
          className="font-great-vibes text-dark-amaranth leading-none hero-name"
          style={{
            fontSize: '15rem',
            textShadow: '0 2px 24px rgba(255,185,207,0.53)',
          }}
        >
          Oshinoko
        </h1>
      </div>
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
          background: 'linear-gradient(90deg, var(--grad-start), var(--grad-end))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Let's talk
      </a>

      {/* Scroll indicator */}
      <a
        href="#work"
        className="scroll-blink absolute bottom-10 flex flex-col items-center gap-1"
        style={{ color: 'var(--accent-primary)' }}
      >
        <span className="font-inter font-semibold uppercase tracking-widest" style={{ fontSize: '0.65rem' }}>
          Scroll
        </span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 4L7 10L12 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
    </section>
  )
}


