const DISCORD = 'https://discord.gg/rzuNFKn2'

export default function Contact() {
  return (
    <section id="contact" className="py-32 px-8 text-center" style={{ position: 'relative', zIndex: 10 }}>
      <p className="font-inter text-xs font-bold tracking-widest uppercase text-berry-crush mb-6">
        Contact
      </p>
      <h2
        className="font-great-vibes text-dark-amaranth leading-none mb-6"
        style={{ fontSize: '7rem' }}
      >
        Let&apos;s talk
      </h2>
      <p className="font-inter text-sm text-berry-crush mb-8 tracking-wide">
        Reach out on Discord
      </p>
      <a
        href={DISCORD}
        target="_blank"
        rel="noopener noreferrer"
        className="font-inter font-semibold tracking-widest text-sm uppercase"
        style={{
          background: 'linear-gradient(90deg, #9c1e4a, #bd3c6d)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        discord.gg/rzuNFKn2
      </a>
    </section>
  )
}
