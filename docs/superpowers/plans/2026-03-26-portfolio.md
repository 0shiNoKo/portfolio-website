# Oshinoko Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a Next.js portfolio site for Oshinoko with cherry blossom background, scroll-reveal gallery, and sections for Work, About, Services, and Contact.

**Architecture:** Single-page Next.js App Router site with all sections on one page. Shared background (blobs + petals) rendered as a fixed client component. Each section is its own component. Gallery uses IntersectionObserver for scroll-reveal.

**Tech Stack:** Next.js 14 (App Router), Tailwind CSS, local fonts via `next/font/local`, Vercel deployment.

---

## File Map

```
app/
  layout.tsx          — root layout: fonts, metadata, global styles
  page.tsx            — assembles all sections in order
  globals.css         — Tailwind directives + custom CSS (blob/petal animations)

components/
  Background.tsx      — fixed blobs + animated petals (client component)
  Nav.tsx             — sticky nav with Great Vibes logo + links
  Hero.tsx            — full-viewport hero with name, tagline, CTA
  Gallery.tsx         — scroll-reveal work gallery (client component)
  About.tsx           — two-column about section
  Services.tsx        — three service cards
  Contact.tsx         — centered contact section with Discord link

lib/
  thumbnails.ts       — static array of thumbnail metadata (name, file, category)

public/
  fonts/
    GreatVibes-Regular.ttf
    Inter-VariableFont_opsz,wght.ttf
  thumbnails/
    Karma0shiNoKoDuotage.png
    LeaftageV1.png
    TmoaHT3Tage.png
    LunamcMaceHT3Duotage.png
    LunamcCartHT3.png
    ChristmasLeaftage(unused).png
```

---

## Task 1: Scaffold Next.js project + copy assets

**Files:**
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`
- Create: `public/fonts/` (copy from project root)
- Create: `public/thumbnails/` (copy from Downloads)

- [ ] **Step 1: Create the Next.js project**

```bash
cd /Users/oshi/portfolio-website
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --no-eslint --import-alias "@/*"
```

When prompted, accept all defaults. This will create `app/`, `components/`, `public/`, `tailwind.config.ts`, `next.config.ts`, `package.json`.

- [ ] **Step 2: Copy fonts into public/**

```bash
mkdir -p public/fonts
cp Great_Vibes/GreatVibes-Regular.ttf public/fonts/
cp "Inter/Inter-VariableFont_opsz,wght.ttf" public/fonts/
```

- [ ] **Step 3: Copy thumbnails into public/**

```bash
mkdir -p public/thumbnails
cp /Users/oshi/Downloads/thumbnails/*.png public/thumbnails/
```

- [ ] **Step 4: Replace `app/globals.css` with base styles**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}

body {
  background-color: #fff9eb;
  color: #1a0008;
}

/* Scrollbar hidden globally */
* {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
*::-webkit-scrollbar {
  display: none;
}
```

- [ ] **Step 5: Replace `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const greatVibes = localFont({
  src: '../public/fonts/GreatVibes-Regular.ttf',
  variable: '--font-great-vibes',
})

const inter = localFont({
  src: '../public/fonts/Inter-VariableFont_opsz,wght.ttf',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Oshinoko',
  description: 'Minecraft editor, thumbnail maker, and banner maker.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${greatVibes.variable} ${inter.variable}`}>
      <body className="font-inter">{children}</body>
    </html>
  )
}
```

- [ ] **Step 6: Update `tailwind.config.ts` to register font variables**

Open `tailwind.config.ts` and replace the `theme.extend` block with:

```ts
theme: {
  extend: {
    fontFamily: {
      inter: ['var(--font-inter)', 'sans-serif'],
      'great-vibes': ['var(--font-great-vibes)', 'cursive'],
    },
    colors: {
      ivory: '#fff9eb',
      'cherry-blossom': '#ffb9cf',
      'pink-carnation': '#ff78b3',
      'berry-crush': '#bd3c6d',
      'cherry-rose': '#9c1e4a',
      'dark-amaranth': '#7b0027',
    },
  },
},
```

- [ ] **Step 7: Replace `app/page.tsx` with a placeholder**

```tsx
export default function Home() {
  return <main>Hello Oshinoko</main>
}
```

- [ ] **Step 8: Start dev server and verify it runs**

```bash
npm run dev
```

Open `http://localhost:3000`. Expected: page loads showing "Hello Oshinoko" with no errors in terminal.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with fonts and assets"
```

---

## Task 2: Background — blobs + cherry blossom petals

**Files:**
- Create: `components/Background.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Add petal keyframe animation to `app/globals.css`**

Append to the end of the file:

```css
@keyframes petalFall {
  0%   { transform: translateY(-40px) rotate(0deg) translateX(0px); opacity: 0; }
  5%   { opacity: 0.85; }
  90%  { opacity: 0.7; }
  100% { transform: translateY(110vh) rotate(540deg) translateX(var(--drift)); opacity: 0; }
}

.petal {
  position: fixed;
  pointer-events: none;
  animation: petalFall linear infinite;
  z-index: 1;
}
```

- [ ] **Step 2: Create `components/Background.tsx`**

```tsx
'use client'

import { useEffect, useRef } from 'react'

const PETAL_COUNT = 38
const COLORS = ['#ffb9cf', '#ff99c1', '#ff89ba', '#ff78b3', '#fde8f0', '#ffd0e0']
const SHAPES = [
  (c: string) => `<svg width="18" height="22" viewBox="0 0 18 22"><ellipse cx="9" cy="11" rx="7" ry="10" fill="${c}"/></svg>`,
  (c: string) => `<svg width="14" height="20" viewBox="0 0 14 20"><path d="M7 0 C12 6 12 14 7 20 C2 14 2 6 7 0Z" fill="${c}"/></svg>`,
  (c: string) => `<svg width="22" height="14" viewBox="0 0 22 14"><ellipse cx="11" cy="7" rx="10" ry="6" fill="${c}"/></svg>`,
]

export default function Background() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    for (let i = 0; i < PETAL_COUNT; i++) {
      const el = document.createElement('div')
      el.className = 'petal'
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)]
      const scale = 0.6 + Math.random() * 1.2
      const drift = (Math.random() - 0.5) * 180
      const duration = 6 + Math.random() * 10
      const delay = Math.random() * 12
      const startX = Math.random() * 110
      el.innerHTML = shape(color)
      el.style.cssText = `left:${startX}vw;top:0;transform:scale(${scale});--drift:${drift}px;animation-duration:${duration}s;animation-delay:${delay}s;`
      container.appendChild(el)
    }

    return () => { container.innerHTML = '' }
  }, [])

  return (
    <>
      {/* Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute rounded-full" style={{ width: 520, height: 420, background: '#ff89ba', top: -100, left: -80, filter: 'blur(80px)', opacity: 0.18 }} />
        <div className="absolute rounded-full" style={{ width: 380, height: 380, background: '#ffb9cf', top: '30%', right: -60, filter: 'blur(80px)', opacity: 0.22 }} />
        <div className="absolute rounded-full" style={{ width: 300, height: 260, background: '#bd3c6d', bottom: '10%', left: '20%', filter: 'blur(80px)', opacity: 0.12 }} />
        <div className="absolute rounded-full" style={{ width: 240, height: 200, background: '#ff78b3', top: '55%', left: '10%', filter: 'blur(80px)', opacity: 0.14 }} />
        <div className="absolute rounded-full" style={{ width: 200, height: 180, background: '#ffb9cf', bottom: '5%', right: '15%', filter: 'blur(80px)', opacity: 0.20 }} />
      </div>
      {/* Petals */}
      <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }} />
    </>
  )
}
```

- [ ] **Step 3: Add Background to `app/page.tsx`**

```tsx
import Background from '@/components/Background'

export default function Home() {
  return (
    <main className="relative" style={{ zIndex: 2 }}>
      <Background />
      <div className="flex items-center justify-center min-h-screen">
        <p className="font-great-vibes text-9xl text-dark-amaranth">Oshinoko</p>
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Verify in browser**

Open `http://localhost:3000`. Expected: ivory background, pink blobs visible, petals falling. "Oshinoko" in Great Vibes displayed large.

- [ ] **Step 5: Commit**

```bash
git add components/Background.tsx app/globals.css app/page.tsx
git commit -m "feat: add animated background with blobs and cherry blossom petals"
```

---

## Task 3: Nav component

**Files:**
- Create: `components/Nav.tsx`

- [ ] **Step 1: Create `components/Nav.tsx`**

```tsx
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
```

- [ ] **Step 2: Add Nav to `app/page.tsx`**

```tsx
import Background from '@/components/Background'
import Nav from '@/components/Nav'

export default function Home() {
  return (
    <main className="relative" style={{ zIndex: 2 }}>
      <Background />
      <Nav />
      <div className="flex items-center justify-center min-h-screen">
        <p className="font-great-vibes text-9xl text-dark-amaranth">Oshinoko</p>
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Verify in browser**

Open `http://localhost:3000`. Expected: sticky nav with Great Vibes "Oshinoko" left and links right. Nav stays in place when scrolling.

- [ ] **Step 4: Commit**

```bash
git add components/Nav.tsx app/page.tsx
git commit -m "feat: add sticky nav with Great Vibes logo and section links"
```

---

## Task 4: Hero section

**Files:**
- Create: `components/Hero.tsx`

- [ ] **Step 1: Create `components/Hero.tsx`**

```tsx
const DISCORD = 'https://discord.gg/rzuNFKn2'

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-center px-8">
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
```

- [ ] **Step 2: Add Hero to `app/page.tsx`**

```tsx
import Background from '@/components/Background'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'

export default function Home() {
  return (
    <main className="relative" style={{ zIndex: 2 }}>
      <Background />
      <Nav />
      <Hero />
    </main>
  )
}
```

- [ ] **Step 3: Verify in browser**

Open `http://localhost:3000`. Expected: full-viewport hero with large "Oshinoko" in Great Vibes, small uppercase tagline, gradient "Let's talk" text below. Clicking "Let's talk" opens Discord.

- [ ] **Step 4: Commit**

```bash
git add components/Hero.tsx app/page.tsx
git commit -m "feat: add hero section with name, tagline, and Discord CTA"
```

---

## Task 5: Thumbnail metadata

**Files:**
- Create: `lib/thumbnails.ts`

- [ ] **Step 1: Create `lib/thumbnails.ts`**

```ts
export interface Thumbnail {
  file: string
  name: string
  category: string
}

export const thumbnails: Thumbnail[] = [
  { file: 'Karma0shiNoKoDuotage.png',       name: 'Karma Duotage',        category: 'Thumbnail' },
  { file: 'LeaftageV1.png',                 name: 'Leaftage V1',          category: 'Thumbnail' },
  { file: 'TmoaHT3Tage.png',               name: 'TMOA HT3',             category: 'Thumbnail' },
  { file: 'LunamcMaceHT3Duotage.png',      name: 'Lunamc Mace Duotage',  category: 'Thumbnail' },
  { file: 'LunamcCartHT3.png',             name: 'Lunamc Cart HT3',      category: 'Thumbnail' },
  { file: 'ChristmasLeaftage(unused).png', name: 'Christmas Leaftage',   category: 'Thumbnail' },
]
```

- [ ] **Step 2: Commit**

```bash
git add lib/thumbnails.ts
git commit -m "feat: add thumbnail metadata"
```

---

## Task 6: Gallery section

**Files:**
- Create: `components/Gallery.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Add gallery perspective wrapper to `app/globals.css`**

Append:

```css
.gallery-perspective {
  perspective: 1400px;
}
```

- [ ] **Step 2: Create `components/Gallery.tsx`**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { thumbnails } from '@/lib/thumbnails'

export default function Gallery() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    cardRefs.current.forEach((card, i) => {
      if (!card) return
      const isLeft = i % 2 === 0
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            card.style.opacity = '1'
            card.style.transform = 'rotateX(0deg) rotateY(0deg) translateX(0) scale(1)'
            observer.unobserve(card)
          }
        },
        { threshold: 0.1 }
      )
      // Set initial hidden state via style so transition works
      card.style.opacity = '0'
      card.style.transform = isLeft
        ? 'rotateX(28deg) rotateY(16deg) translateX(-30px) scale(0.94)'
        : 'rotateX(28deg) rotateY(-16deg) translateX(30px) scale(0.94)'
      observer.observe(card)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <section id="work" className="py-24 px-8">
      <h2 className="font-inter font-bold text-center text-3xl text-dark-amaranth mb-16 tracking-wide">
        My Work
      </h2>
      <div className="gallery-perspective flex flex-col gap-2 max-w-5xl mx-auto">
        {thumbnails.map((thumb, i) => {
          const isLeft = i % 2 === 0
          return (
            <div
              key={thumb.file}
              className={`flex ${isLeft ? 'justify-start' : 'justify-end'}`}
            >
              <div
                ref={(el) => { cardRefs.current[i] = el }}
                className="relative overflow-hidden rounded-xl cursor-pointer group"
                style={{
                  width: '60%',
                  transformOrigin: isLeft ? 'left bottom' : 'right bottom',
                  boxShadow: '0 6px 24px rgba(189,60,109,0.1)',
                  transition: 'transform 0.75s cubic-bezier(0.22,1,0.36,1), opacity 0.75s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.transform = isLeft
                    ? 'rotateX(-2deg) rotateY(-4deg) scale(1.02)'
                    : 'rotateX(-2deg) rotateY(4deg) scale(1.02)'
                  el.style.boxShadow = '0 20px 48px rgba(189,60,109,0.28)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.transform = 'rotateX(0) rotateY(0) scale(1)'
                  el.style.boxShadow = '0 6px 24px rgba(189,60,109,0.1)'
                }}
              >
                <Image
                  src={`/thumbnails/${thumb.file}`}
                  alt={thumb.name}
                  width={1280}
                  height={720}
                  className="w-full block"
                  style={{ aspectRatio: '16/9', objectFit: 'cover' }}
                />
                <div
                  className="absolute inset-0 flex items-end justify-between px-3 pb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: 'linear-gradient(transparent, rgba(10,0,5,0.72))' }}
                >
                  <span className="font-inter text-xs font-bold" style={{ color: '#fff9eb' }}>{thumb.name}</span>
                  <span className="font-inter text-xs px-2 py-0.5 rounded-full" style={{ color: '#ff78b3', background: 'rgba(123,0,39,0.4)' }}>
                    {thumb.category}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Add Gallery to `app/page.tsx`**

```tsx
import Background from '@/components/Background'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Gallery from '@/components/Gallery'

export default function Home() {
  return (
    <main className="relative" style={{ zIndex: 2 }}>
      <Background />
      <Nav />
      <Hero />
      <Gallery />
    </main>
  )
}
```

- [ ] **Step 4: Verify in browser**

Scroll down past hero. Expected: "My Work" heading, then thumbnails tilt-reveal alternating left/right as they enter viewport. Hovering a card tilts it and shows name + category overlay.

- [ ] **Step 5: Commit**

```bash
git add components/Gallery.tsx app/globals.css app/page.tsx lib/thumbnails.ts
git commit -m "feat: add scroll-reveal work gallery with 3D tilt effect"
```

---

## Task 7: About section

**Files:**
- Create: `components/About.tsx`

- [ ] **Step 1: Create `components/About.tsx`**

```tsx
export default function About() {
  return (
    <section id="about" className="py-24 px-8 max-w-5xl mx-auto">
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
```

- [ ] **Step 2: Add About to `app/page.tsx`**

```tsx
import Background from '@/components/Background'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Gallery from '@/components/Gallery'
import About from '@/components/About'

export default function Home() {
  return (
    <main className="relative" style={{ zIndex: 2 }}>
      <Background />
      <Nav />
      <Hero />
      <Gallery />
      <About />
    </main>
  )
}
```

- [ ] **Step 3: Verify in browser**

Scroll to About. Expected: two-column layout, Great Vibes "Oshinoko" heading left, bio text, soft pink glowing circle on right.

- [ ] **Step 4: Commit**

```bash
git add components/About.tsx app/page.tsx
git commit -m "feat: add about section"
```

---

## Task 8: Services section

**Files:**
- Create: `components/Services.tsx`

- [ ] **Step 1: Create `components/Services.tsx`**

```tsx
const services = [
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
    <section id="services" className="py-24 px-8 max-w-5xl mx-auto">
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
```

- [ ] **Step 2: Add Services to `app/page.tsx`**

```tsx
import Background from '@/components/Background'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Gallery from '@/components/Gallery'
import About from '@/components/About'
import Services from '@/components/Services'

export default function Home() {
  return (
    <main className="relative" style={{ zIndex: 2 }}>
      <Background />
      <Nav />
      <Hero />
      <Gallery />
      <About />
      <Services />
    </main>
  )
}
```

- [ ] **Step 3: Verify in browser**

Scroll to Services. Expected: three ivory cards side by side, each with gradient price, title, and description.

- [ ] **Step 4: Commit**

```bash
git add components/Services.tsx app/page.tsx
git commit -m "feat: add services section with three pricing cards"
```

---

## Task 9: Contact section

**Files:**
- Create: `components/Contact.tsx`

- [ ] **Step 1: Create `components/Contact.tsx`**

```tsx
const DISCORD = 'https://discord.gg/rzuNFKn2'

export default function Contact() {
  return (
    <section id="contact" className="py-32 px-8 text-center">
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
```

- [ ] **Step 2: Add Contact to `app/page.tsx`**

```tsx
import Background from '@/components/Background'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Gallery from '@/components/Gallery'
import About from '@/components/About'
import Services from '@/components/Services'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <main className="relative" style={{ zIndex: 2 }}>
      <Background />
      <Nav />
      <Hero />
      <Gallery />
      <About />
      <Services />
      <Contact />
    </main>
  )
}
```

- [ ] **Step 3: Verify full page in browser**

Scroll through entire page. Expected: Nav → Hero → Gallery → About → Services → Contact all render correctly. All section links in nav scroll to the right sections.

- [ ] **Step 4: Commit**

```bash
git add components/Contact.tsx app/page.tsx
git commit -m "feat: add contact section with Discord link"
```

---

## Task 10: Deploy to Vercel

**Files:** none (deployment config only)

- [ ] **Step 1: Push to GitHub**

Create a new GitHub repo named `portfolio-website` (public or private), then:

```bash
git remote add origin https://github.com/<your-username>/portfolio-website.git
git branch -M main
git push -u origin main
```

- [ ] **Step 2: Deploy on Vercel**

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New → Project**
3. Import the `portfolio-website` repo
4. Leave all settings as default (Next.js auto-detected)
5. Click **Deploy**

Expected: Vercel builds and gives you a live URL like `portfolio-website-xxx.vercel.app`.

- [ ] **Step 3: Verify live site**

Open the Vercel URL. Check that fonts, thumbnails, petals, and all sections load correctly.

- [ ] **Step 4: (Optional) Add custom domain**

In Vercel project settings → Domains, add your own domain if you have one.
