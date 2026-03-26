# Oshinoko Portfolio — Design Spec
**Date:** 2026-03-26

---

## Overview

A personal portfolio website for Oshinoko — a Minecraft editor, thumbnail maker, and banner maker. Bold, creative, and elegant with a cherry blossom aesthetic.

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **Fonts:** Great Vibes (name/logo) · Inter (all other text)

---

## Visual Design

### Colors
| Name | Hex | Usage |
|---|---|---|
| White | `#ffffff` | Primary background |
| Ivory Mist | `#fff9eb` | Nav, cards, section tints |
| Cherry Blossom | `#ffb9cf` | Light accents, petal colors |
| Pink Carnation | `#ff78b3` | Mid accent |
| Berry Crush | `#bd3c6d` | Primary accent, tagline text |
| Cherry Rose | `#9c1e4a` | Gradient start (buttons/links) |
| Dark Amaranth | `#7b0027` | Name text color |

### Typography
- **Name/Logo:** Great Vibes, ~15rem on hero, smaller in nav
- **Body, headings, UI:** Inter (variable font)

### Background Treatment (all pages)
- Base: `#fff9eb` ivory
- Soft pink/rose radial blur blobs at low opacity (18–22%) positioned at corners and mid-sections — creates a subtle pink noise/splotch effect
- Animated cherry blossom petals (SVG ellipses/teardrops in pink tones) falling continuously from top, random size/speed/drift/delay, ~38 petals at a time

---

## Sections

### 1. Nav
- Left: "Oshinoko" in Great Vibes, linked to top
- Right: links — Work · About · Services · Contact
- Sticky, transparent background with slight ivory tint
- No border, floats over hero

### 2. Hero
- Full viewport height, centered
- **"Oshinoko"** — Great Vibes, 15rem, color `#7b0027`, soft glow shadow
- **Tagline:** "Improvement is Key" — Inter, 0.85rem, letter-spacing 5px, uppercase, `#bd3c6d`
- **CTA:** "Let's talk" — Inter, gradient text (`#9c1e4a` → `#bd3c6d`), links to Discord (`https://discord.gg/rzuNFKn2`), no button style

### 3. Work Gallery
- Section heading: "Work" or "My Work" in Inter
- Scroll-reveal gallery: cards fade + tilt in from alternating left/right sides as user scrolls
- Cards 60% wide, overlapping slightly at center
- `transform: rotateX(28deg) rotateY(±16deg)` initial state → `rotateX(0) rotateY(0)` on reveal
- No scrollbar visible
- Hover: slight counter-tilt + elevated shadow, overlay fades in with title + category tag
- Images from `/public/thumbnails/` directory

**Initial thumbnails:**
- Karma0shiNoKoDuotage.png
- LeaftageV1.png
- TmoaHT3Tage.png
- LunamcMaceHT3Duotage.png
- LunamcCartHT3.png
- ChristmasLeaftage(unused).png

### 4. About
- Two-column layout (text left, decorative accent right)
- **Content:** "Hi, I'm Oshinoko. I love improving in Minecraft as well as design. I love playing Minecraft PvP and just getting better in general."
- Accent: pink gradient shape or floating petal cluster on the right

### 5. Services
- Three cards on a row:
  1. **Thumbnails** — $5–$10 (varies by request)
  2. **Montages** — $2 per 30 seconds
  3. **Regular Videos** — $1 per 30 seconds
- Cards: ivory background (`#fff9eb`), subtle pink border, Inter text, rose accent on title

### 6. Contact
- Centered layout
- Heading: "Let's talk" in Great Vibes, large
- Subtext: "Reach out on Discord"
- Button/link: Discord invite `https://discord.gg/rzuNFKn2` — gradient text style matching hero CTA

---

## Assets

- `/public/thumbnails/` — all thumbnail images
- `/public/fonts/GreatVibes-Regular.ttf`
- `/public/fonts/Inter-VariableFont_opsz,wght.ttf`

---

## Behavior Notes

- Cherry blossom petals render on a fixed layer behind all content (z-index 0), above the background blobs
- Blobs are `position: fixed`, `filter: blur(80px)`, non-interactive
- Scroll reveal uses `IntersectionObserver` on the gallery section
- "Let's talk" in hero and contact both open Discord link
