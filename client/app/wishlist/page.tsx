"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { Skeleton } from "@/components/ui/skeleton"

interface WishlistItem {
  _id: string
  artwork: {
    _id: string
    title: string
    price: number
    imageUrl: string
    artist: {
      _id: string
      name: string
    }
  }
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const fetchWishlist = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/wishlist/${user?._id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch wishlist")
        }

        const data = await response.json()
        setWishlistItems(data.items)
      } catch (error) {
        console.error("Error fetching wishlist:", error)
        toast({
          title: "Error",
          description: "Failed to load wishlist. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [isAuthenticated, user, router, toast])

  const removeFromWishlist = async (artworkId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/wishlist/${user?._id}/${artworkId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to remove from wishlist")
      }

      setWishlistItems(wishlistItems.filter((item) => item.artwork._id !== artworkId))
      toast({
        title: "Removed from wishlist",
        description: "The artwork has been removed from your wishlist",
        variant: "default",
      })
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to remove from wishlist. Please try again later.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <Card key={index}>
                  <div className="flex p-4">
                    <Skeleton className="h-24 w-24 rounded-md" />
                    <div className="ml-4 flex-1">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                </Card>
              ))}
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-6">
              Start exploring our collection to add artworks to your wishlist
            </p>
            <Link href="/artworks">
              <Button>Browse Artworks</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item._id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex p-4">
                    <div className="relative h-24 w-24 rounded-md overflow-hidden">
                      <Image
                        src={item.artwork.imageUrl || "/placeholder.svg?height=96&width=96"}
                        alt={item.artwork.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <Link href={`/artworks/${item.artwork._id}`}>
                        <h3 className="font-semibold hover:underline truncate">{item.artwork.title}</h3>
                      </Link>
                      <Link href={`/artists/${item.artwork.artist._id}`}>
                        <p className="text-sm text-muted-foreground hover:underline">{item.artwork.artist.name}</p>
                      </Link>
                      <p className="font-medium mt-2">${item.artwork.price.toLocaleString()}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromWishlist(item.artwork._id)}
                      className="h-8 w-8 self-start"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove from wishlist</span>
                    </Button>
                  </div>
                  <div className="border-t p-4 flex justify-between">
                    <Link href={`/artworks/${item.artwork._id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                    <Button size="sm">Add to Cart</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

