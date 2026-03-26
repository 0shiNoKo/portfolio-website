interface Service {
  title: string
  price: string
  description: string
}

const services: Service[] = [
  {
    title: 'Thumbnails',
    price: '$5 – $10+',
    description: 'Eye-catching Minecraft thumbnails. Price varies depending on the request.',
  },
  {
    title: 'Montages',
    price: '$2 / 30s',
    description: 'High-energy montage edits. Priced per 30 seconds of finished video.',
  },
  {
    title: 'Regular Videos',
    price: '$1 / 30s',
    description: 'Clean Minecraft video edits. Priced per 30 seconds of finished video.',
  },
]

export default function Services() {
  return (
    <section id="services" className="py-24 px-8 max-w-5xl mx-auto" style={{ position: 'relative', zIndex: 10 }}>
      <p className="font-inter text-xs font-bold tracking-widest uppercase text-berry-crush text-center mb-4">
        Services
      </p>
      <h2 className="font-inter font-bold text-3xl text-dark-amaranth text-center mb-14 tracking-wide">
        What I Offer
      </h2>
      <div className="grid grid-cols-3 gap-6">
        {services.map((s) => (
          <div
            key={s.title}
            className="rounded-xl p-6 flex flex-col gap-3"
            style={{
              background: '#fff9eb',
              border: '1.5px solid rgba(255,185,207,0.5)',
              boxShadow: '0 4px 20px rgba(189,60,109,0.07)',
            }}
          >
            <p className="font-inter text-xs font-bold tracking-widest uppercase text-berry-crush">
              {s.title}
            </p>
            <p
              className="font-inter font-bold text-2xl"
              style={{
                background: 'linear-gradient(90deg, #9c1e4a, #bd3c6d)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {s.price}
            </p>
            <p className="font-inter text-sm leading-relaxed" style={{ color: '#3a0010cc' }}>
              {s.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
