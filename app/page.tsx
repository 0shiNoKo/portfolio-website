import Background from '@/components/Background'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Gallery from '@/components/Gallery'
import AboutRankings from '@/components/AboutRankings'
import Services from '@/components/Services'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <main className="relative">
      <Background />
      <Nav />
      <Hero />
      <Gallery />
      <AboutRankings />
      <Services />
      <Contact />
    </main>
  )
}
