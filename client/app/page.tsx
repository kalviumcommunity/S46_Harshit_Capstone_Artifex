import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArtworkGrid } from "@/components/artwork-grid"
import { FeaturedArtists } from "@/components/featured-artists"
import { HeroSection } from "@/components/hero-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Featured Artworks</h2>
          <Link href="/artworks">
            <Button variant="outline" className="mt-4 md:mt-0">
              View All Artworks
            </Button>
          </Link>
        </div>

        <ArtworkGrid featured={true} limit={6} />

        <div className="mt-20 mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-8">Featured Artists</h2>
          <FeaturedArtists />
        </div>
      </div>
    </div>
  )
}

