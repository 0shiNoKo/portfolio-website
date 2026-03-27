import fs from 'fs'
import path from 'path'
import Background from '@/components/Background'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Gallery from '@/components/Gallery'
import AboutRankings from '@/components/AboutRankings'
import Services from '@/components/Services'
import Mods from '@/components/Mods'
import Contact from '@/components/Contact'

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif'])

function readImageDir(dir: string): string[] {
  try {
    return fs.readdirSync(dir).filter(f => IMAGE_EXTS.has(path.extname(f).toLowerCase()))
  } catch {
    return []
  }
}

export default function Home() {
  const thumbnailFiles = readImageDir(path.join(process.cwd(), 'public', 'thumbnails'))
  const bannerFiles = readImageDir(path.join(process.cwd(), 'public', 'banners'))

  return (
    <main className="relative">
      <Background />
      <Nav />
      <Hero />
      <Gallery thumbnailFiles={thumbnailFiles} bannerFiles={bannerFiles} />
      <AboutRankings />
      <Services />
      <Mods />
      <Contact />
    </main>
  )
}
