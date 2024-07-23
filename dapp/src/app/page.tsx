import About from "@/components/homepage/about.component";
import Geometry from "@/components/homepage/geometry";
import Hero from "@/components/homepage/hero.component";
import Navbar from "@/components/homepage/navbar.component";
import ProductIntroduction from "@/components/homepage/product.component";
import Transparency from "@/components/homepage/transparency.component";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between pl-2 md:pr-24 md:pl-24 pt-8 overflow-hidden">
      <Geometry />
      <Navbar />
      <Hero />
      <ProductIntroduction />
      <About/>
      <Transparency/>
    </main>
  )
}
