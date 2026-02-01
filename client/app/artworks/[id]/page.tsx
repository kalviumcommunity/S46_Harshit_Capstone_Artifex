"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { Skeleton } from "@/components/ui/skeleton"

interface Artwork {
  _id: string
  title: string
  description: string
  price: number
  imageUrl: string
  category: string
  dimensions: string
  medium: string
  year: number
  artist: {
    _id: string
    name: string
    bio: string
    profileImage: string
  }
}

interface Review {
  _id: string
  user: {
    _id: string
    name: string
  }
  rating: number
  comment: string
  createdAt: string
}

export default function ArtworkDetailPage() {
  const { id } = useParams()
  const [artwork, setArtwork] = useState<Artwork | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [inWishlist, setInWishlist] = useState(false)
  const { toast } = useToast()
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/artworks/${id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch artwork")
        }

        const data = await response.json()
        setArtwork(data)
      } catch (error) {
        console.error("Error fetching artwork:", error)
        toast({
          title: "Error",
          description: "Failed to load artwork details. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/reviews/artwork/${id}`)

        if (response.ok) {
          const data = await response.json()
          setReviews(data)
        }
      } catch (error) {
        console.error("Error fetching reviews:", error)
      }
    }

    const checkWishlist = async () => {
      if (isAuthenticated && user?._id) {
        try {
          const response = await fetch(`http://localhost:5000/api/wishlist/${user._id}`)

          if (response.ok) {
            const data = await response.json()
            const isInWishlist = data.items.some((item: any) => item.artwork === id)
            setInWishlist(isInWishlist)
          }
        } catch (error) {
          console.error("Error checking wishlist:", error)
        }
      }
    }

    fetchArtwork()
    fetchReviews()
    checkWishlist()
  }, [id, isAuthenticated, user, toast])

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to add items to your wishlist",
        variant: "default",
      })
      return
    }

    try {
      const method = inWishlist ? "DELETE" : "POST"
      const url = `http://localhost:5000/api/wishlist/${user?._id}/${id}`

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to update wishlist")
      }

      setInWishlist(!inWishlist)
      toast({
        title: inWishlist ? "Removed from wishlist" : "Added to wishlist",
        description: inWishlist
          ? "The artwork has been removed from your wishlist"
          : "The artwork has been added to your wishlist",
        variant: "default",
      })
    } catch (error) {
      console.error("Error updating wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again later.",
        variant: "destructive",
      })
    }
  }

  const addToCart = () => {
    // Implement cart functionality
    toast({
      title: "Added to cart",
      description: "The artwork has been added to your cart",
      variant: "default",
    })
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-8 w-1/3" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="flex space-x-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!artwork) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold">Artwork not found</h1>
          <p className="text-muted-foreground mt-2">
            The artwork you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/artworks">
            <Button className="mt-4">Browse Other Artworks</Button>
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={artwork.imageUrl || "/placeholder.svg?height=600&width=600"}
              alt={artwork.title}
              fill
              className="object-contain"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{artwork.title}</h1>
              <Link href={`/artists/${artwork.artist._id}`}>
                <p className="text-lg text-muted-foreground hover:underline">by {artwork.artist.name}</p>
              </Link>
            </div>

            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(averageRating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                  }`}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-2">
                {reviews.length > 0 ? `${averageRating.toFixed(1)} (${reviews.length} reviews)` : "No reviews yet"}
              </span>
            </div>

            <p className="text-2xl font-bold">${artwork.price.toLocaleString()}</p>

            <div className="flex space-x-4">
              <Button className="flex-1" onClick={addToCart}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button variant="outline" size="icon" onClick={toggleWishlist}>
                <Heart className={`h-5 w-5 ${inWishlist ? "fill-primary text-primary" : ""}`} />
                <span className="sr-only">Add to wishlist</span>
              </Button>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Category</p>
                <p className="font-medium">{artwork.category}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Year</p>
                <p className="font-medium">{artwork.year}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Medium</p>
                <p className="font-medium">{artwork.medium}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Dimensions</p>
                <p className="font-medium">{artwork.dimensions}</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="description" className="mt-12">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="artist">Artist</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-4">
            <div className="prose max-w-none">
              <p>{artwork.description}</p>
            </div>
          </TabsContent>
          <TabsContent value="artist" className="mt-4">
            <div className="flex items-start space-x-4">
              <div className="relative h-20 w-20 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={artwork.artist.profileImage || "/placeholder.svg?height=80&width=80"}
                  alt={artwork.artist.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{artwork.artist.name}</h3>
                <p className="mt-2">{artwork.artist.bio}</p>
                <Link href={`/artists/${artwork.artist._id}`}>
                  <Button variant="link" className="p-0 h-auto mt-2">
                    View Artist Profile
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4">
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{review.user.name}</p>
                        <div className="flex items-center mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className="mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No reviews yet. Be the first to review this artwork!</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </>
  )
}

