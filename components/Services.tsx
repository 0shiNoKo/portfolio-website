interface Service {
  title: string
  price: string
}

const services: Service[] = [
  { title: 'Thumbnails',     price: '$5 – $10+' },
  { title: 'Montages',       price: '$2 / 30s'  },
  { title: 'Regular Videos', price: '$1 / 30s'  },
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
              background: 'var(--bg-card)',
              border: '1.5px solid var(--border)',
              boxShadow: '0 4px 20px var(--shadow-sm)',
            }}
          >
            <p className="font-inter text-xs font-bold tracking-widest uppercase text-berry-crush">
              {s.title}
            </p>
            <p
              className="font-inter font-bold text-2xl"
              style={{
                background: 'linear-gradient(90deg, var(--grad-start), var(--grad-end))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {s.price}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
