import Hero from '@/components/hero.component'
import Navbar from '@/components/navbar.component'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 overflow-hidden">
      <Navbar />
      <Hero />
    </main>
  )
}
