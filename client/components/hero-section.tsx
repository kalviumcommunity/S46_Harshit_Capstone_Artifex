import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"

export function HeroSection() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 z-10" />
      <div
        className="relative h-[600px] bg-cover bg-center"
        style={{ backgroundImage: "url('/placeholder.svg?height=600&width=1200')" }}
      >
        <Navbar />
        <div className="container relative z-20 flex h-[calc(600px-4rem)] flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Discover Unique <span className="text-primary">Artworks</span>
          </h1>
          <p className="mx-auto mt-4 max-w-[700px] text-lg text-muted-foreground md:text-xl">
            Connect with talented artists and find the perfect piece for your collection
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/artworks">
              <Button size="lg" className="h-12 px-8">
                Browse Gallery
              </Button>
            </Link>
            <Link href="/artists">
              <Button size="lg" variant="outline" className="h-12 px-8">
                Meet Artists
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

