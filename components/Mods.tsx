import Image from 'next/image'
import type { JSX } from 'react'

interface ModrinthProject {
  title: string
  description: string
  downloads: number
  followers: number
  icon_url: string
  categories: string[]
  slug: string
  gallery: { url: string; title: string }[]
}

export default async function Mods(): Promise<JSX.Element> {
  let mod: ModrinthProject | null = null

  try {
    const res = await fetch('https://api.modrinth.com/v2/project/xbow-timer', {
      next: { revalidate: 3600 },
    })
    if (res.ok) mod = await res.json()
  } catch {}

  if (!mod) return <></>

  const modrinthUrl = `https://modrinth.com/project/${mod.slug}`

  return (
    <section id="mods" style={{ position: 'relative', zIndex: 10 }} className="py-24 px-8 max-w-4xl mx-auto">
      <p className="font-inter text-xs font-bold tracking-widest uppercase text-berry-crush mb-3">Mods</p>
      <h2 className="font-great-vibes text-dark-amaranth leading-none mb-10" style={{ fontSize: '3.5rem' }}>
        My Mods
      </h2>

      <a
        href={modrinthUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        <div
          className="rounded-2xl p-6 transition-transform duration-300 group-hover:-translate-y-1"
          style={{
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border)',
            boxShadow: '0 4px 24px var(--shadow-sm)',
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-4">
            {mod.icon_url && (
              <Image
                src={mod.icon_url}
                alt={mod.title}
                width={56}
                height={56}
                className="rounded-xl flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-inter font-bold text-xl text-dark-amaranth">{mod.title}</h3>
              <p className="font-inter text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {mod.description}
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <span
                className="font-inter font-bold text-sm"
                style={{
                  background: 'linear-gradient(90deg, var(--grad-start), var(--grad-end))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {mod.downloads.toLocaleString()} downloads
              </span>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-5">
            {mod.categories.map(cat => (
              <span
                key={cat}
                className="font-inter text-xs font-semibold tracking-wide px-3 py-1 rounded-full capitalize"
                style={{ background: 'var(--kit-bg)', color: 'var(--accent-primary)' }}
              >
                {cat.replace(/-/g, ' ')}
              </span>
            ))}
          </div>

          {/* Gallery */}
          {mod.gallery.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {mod.gallery.slice(0, 3).map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden aspect-video relative">
                  <Image
                    src={img.url}
                    alt={img.title || `Screenshot ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <p
            className="font-inter text-xs text-center mt-4 tracking-wide opacity-40"
            style={{ color: 'var(--accent-primary)' }}
          >
            View on modrinth.com
          </p>
        </div>
      </a>
    </section>
  )
}
