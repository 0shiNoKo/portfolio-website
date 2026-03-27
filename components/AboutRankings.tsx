import type { JSX } from 'react'
import RankingsTabs from './RankingsTabs'
import SpotifyStats from './SpotifyStats'

const SUBTIERS_META: Record<string, { label: string; svg: string }> = {
  og_vanilla:  { label: 'OG Vanilla',  svg: '/subtiers/og_vanilla-bd47093f.svg' },
  dia_smp:     { label: 'Dia SMP',     svg: '/subtiers/dia_smp-523efa38.svg' },
  dia_crystal: { label: 'Dia Crystal', svg: '/subtiers/dia_crystal-b4032423.svg' },
  trident:     { label: 'Trident',     svg: '/subtiers/trident-1c1a3e5a.svg' },
  elytra:      { label: 'Elytra',      svg: '/subtiers/elytra-73b66265.svg' },
  manhunt:     { label: 'Manhunt',     svg: '/subtiers/manhunt-f5be6ddb.svg' },
  minecart:    { label: 'Minecart',    svg: '/subtiers/minecart-e4204998.svg' },
  bed:         { label: 'Bed',         svg: '/subtiers/bed-7313535b.svg' },
  bow:         { label: 'Bow',         svg: '/subtiers/bow-0b52585f.svg' },
  debuff:      { label: 'Debuff',      svg: '/subtiers/debuff-23da9341.svg' },
  creeper:     { label: 'Creeper',     svg: '/subtiers/creeper-2cbc5b3a.svg' },
  speed:       { label: 'Speed',       svg: '/subtiers/speed-116175c6.svg' },
}

const MCTIERS_META: Record<string, { label: string; svg: string }> = {
  sword:   { label: 'Sword',   svg: '/mctiers/sword.svg' },
  pot:     { label: 'Pot',     svg: '/mctiers/pot.svg' },
  axe:     { label: 'Axe',     svg: '/mctiers/axe.svg' },
  mace:    { label: 'Mace',    svg: '/mctiers/mace.svg' },
  uhc:     { label: 'UHC',     svg: '/mctiers/uhc.svg' },
  smp:     { label: 'SMP',     svg: '/mctiers/smp.svg' },
  vanilla: { label: 'Vanilla', svg: '/mctiers/vanilla.svg' },
  nethop:  { label: 'Nethop',  svg: '/mctiers/nethop.svg' },
}

interface Ranking {
  tier: number
  pos: number
}

interface Profile {
  name: string
  region: string
  points: number
  overall: number
  rankings: Record<string, Ranking>
}

function sortByTier(a: [string, Ranking], b: [string, Ranking]) {
  return (a[1].tier * 2 + a[1].pos) - (b[1].tier * 2 + b[1].pos)
}

export default async function AboutRankings(): Promise<JSX.Element> {
  let subtiers: Profile | null = null
  let mctiers: Profile | null = null

  await Promise.all([
    fetch('https://subtiers.net/api/profile/8f89fe006abb4b4d8ccfd511f8e2df61', { next: { revalidate: 3600 } })
      .then(r => r.ok ? r.json() : null).then(d => { subtiers = d }).catch(() => {}),
    fetch('https://mctiers.com/api/v2/profile/8f89fe00-6abb-4b4d-8ccf-d511f8e2df61', { next: { revalidate: 3600 } })
      .then(r => r.ok ? r.json() : null).then(d => { mctiers = d }).catch(() => {}),
  ])

  const subtierData = subtiers ? {
    name: (subtiers as Profile).name,
    region: (subtiers as Profile).region,
    points: (subtiers as Profile).points,
    overall: (subtiers as Profile).overall,
    kits: Object.entries((subtiers as Profile).rankings)
      .filter(([key]) => SUBTIERS_META[key])
      .sort(sortByTier)
      .map(([key, r]) => ({ key, ...SUBTIERS_META[key], tier: r.tier, pos: r.pos })),
  } : null

  const mctierData = mctiers ? {
    name: (mctiers as Profile).name,
    region: (mctiers as Profile).region,
    points: (mctiers as Profile).points,
    overall: (mctiers as Profile).overall,
    kits: Object.entries((mctiers as Profile).rankings)
      .filter(([key]) => MCTIERS_META[key])
      .sort(sortByTier)
      .map(([key, r]) => ({ key, ...MCTIERS_META[key], tier: r.tier, pos: r.pos })),
  } : null

  return (
    <section id="about" style={{ position: 'relative', zIndex: 10 }} className="py-24 px-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* ── Left: About + 3D Skin ── */}
        <div className="flex flex-col items-center lg:items-start gap-8">
          <div className="w-full">
            <p className="font-inter text-xs font-bold tracking-widest uppercase text-berry-crush mb-4">About</p>
            <h2 className="font-great-vibes text-dark-amaranth text-6xl leading-tight mb-6">Oshinoko</h2>
            <p className="font-inter text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Hi, I&apos;m Oshinoko. I love improving in Minecraft as well as design. I love playing
              Minecraft PvP and just getting better in general.
            </p>
          </div>
          <SpotifyStats />
        </div>

        {/* ── Right: Tabbed Rankings ── */}
        <RankingsTabs subtiers={subtierData} mctiers={mctierData} />
      </div>
    </section>
  )
}
