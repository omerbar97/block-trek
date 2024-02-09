import About from "@/components/homepage/about.component";
import Hero from "@/components/homepage/hero.component";
import Navbar from "@/components/homepage/navbar.component";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 overflow-hidden">
      <Navbar />
      <Hero />
      <About/>
    </main>
  )
}
