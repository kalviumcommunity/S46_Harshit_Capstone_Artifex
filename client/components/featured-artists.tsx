"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

interface Artist {
  _id: string
  name: string
  bio: string
  profileImage: string
  artworksCount: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function FeaturedArtists() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await fetch(`${API_URL}/api/users?role=artist&featured=true&limit=4`)

        if (!response.ok) {
          throw new Error("Failed to fetch artists")
        }

        const data = await response.json()
        setArtists(data)
      } catch (error) {
        console.error("Error fetching artists:", error)
        toast({
          title: "Error",
          description: "Failed to load featured artists. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchArtists()
  }, [toast])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Skeleton className="h-24 w-24 rounded-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-10 w-28" />
              </CardContent>
            </Card>
          ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {artists.map((artist) => (
        <Card key={artist._id}>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="relative h-24 w-24 rounded-full overflow-hidden mb-4">
              <Image
                src={artist.profileImage || "/placeholder.svg?height=96&width=96"}
                alt={artist.name}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="font-semibold text-lg mb-1">{artist.name}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{artist.bio}</p>
            <Link href={`/artists/${artist._id}`}>
              <Button variant="outline" size="sm">
                View Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

