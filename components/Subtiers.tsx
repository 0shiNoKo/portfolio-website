import type { JSX } from 'react'

const KIT_META: Record<string, { label: string; emoji: string }> = {
  og_vanilla:  { label: 'OG Vanilla',  emoji: '🪨' },
  dia_smp:     { label: 'Dia SMP',     emoji: '💎' },
  dia_crystal: { label: 'Dia Crystal', emoji: '🔮' },
  trident:     { label: 'Trident',     emoji: '🔱' },
  elytra:      { label: 'Elytra',      emoji: '🪶' },
  manhunt:     { label: 'Manhunt',     emoji: '🏃' },
  minecart:    { label: 'Minecart',    emoji: '🛤️' },
  bed:         { label: 'Bed',         emoji: '🛏️' },
  bow:         { label: 'Bow',         emoji: '🏹' },
  debuff:      { label: 'Debuff',      emoji: '🧪' },
  creeper:     { label: 'Creeper',     emoji: '💚' },
}

interface Ranking {
  tier: number
  pos: number
  peak_tier: number
  peak_pos: number
  retired: boolean
}

interface SubtiersProfile {
  name: string
  region: string
  points: number
  overall: number
  rankings: Record<string, Ranking>
}

function tierLabel(tier: number, pos: number) {
  return `${pos === 0 ? 'HT' : 'LT'}${tier}`
}

export default async function Subtiers(): Promise<JSX.Element> {
  let profile: SubtiersProfile | null = null
  try {
    const res = await fetch(
      'https://subtiers.net/api/profile/8f89fe006abb4b4d8ccfd511f8e2df61',
      { next: { revalidate: 3600 } }
    )
    if (res.ok) profile = await res.json()
  } catch {
    // silently fail — show nothing if API is down
  }

  if (!profile) return <></>

  const kits = Object.entries(profile.rankings)
    .filter(([key]) => KIT_META[key])
    .map(([key, r]) => ({ key, ...KIT_META[key], ...r }))

  return (
    <section id="rankings" style={{ position: 'relative', zIndex: 10 }} className="py-24 px-8 max-w-4xl mx-auto">
      <p className="font-inter text-xs font-bold tracking-widest uppercase text-berry-crush text-center mb-4">
        Rankings
      </p>
      <h2 className="font-great-vibes text-dark-amaranth text-center leading-none mb-12" style={{ fontSize: '4rem' }}>
        Competitive
      </h2>

      <div
        className="rounded-2xl p-8"
        style={{
          background: '#fff9eb',
          border: '1.5px solid rgba(255,185,207,0.5)',
          boxShadow: '0 8px 40px rgba(189,60,109,0.1)',
        }}
      >
        {/* Header */}
        <div className="mb-6 pb-6" style={{ borderBottom: '1px solid rgba(255,185,207,0.4)' }}>
          <h3 className="font-inter font-bold text-2xl text-dark-amaranth mb-1">{profile.name}</h3>
          <div className="flex flex-wrap gap-4 mt-3">
            <span
              className="font-inter font-bold text-lg"
              style={{
                background: 'linear-gradient(90deg, #9c1e4a, #bd3c6d)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              #{profile.overall} Overall
            </span>
            <span className="font-inter text-sm text-berry-crush self-center">
              {profile.points} Points
            </span>
            <span className="font-inter text-sm text-berry-crush self-center opacity-60">
              {profile.region}
            </span>
          </div>
        </div>

        {/* Kit grid */}
        <div className="grid grid-cols-3 gap-3">
          {kits.map(kit => (
            <div
              key={kit.key}
              className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ background: 'rgba(255,185,207,0.15)', border: '1px solid rgba(255,185,207,0.3)' }}
            >
              <span className="text-2xl">{kit.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-inter text-xs text-berry-crush font-semibold truncate">{kit.label}</p>
              </div>
              <span
                className="font-inter font-bold text-sm px-3 py-1 rounded-lg flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #9c1e4a, #bd3c6d)',
                  color: '#fff9eb',
                }}
              >
                {tierLabel(kit.tier, kit.pos)}
              </span>
            </div>
          ))}
        </div>

        <p className="font-inter text-xs text-center mt-6 opacity-40 text-berry-crush tracking-wide">
          via subtiers.net
        </p>
      </div>
    </section>
  )
}
