"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Artwork {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  images?: string[];
  artist: {
    _id: string;
    name: string;
    displayName?: string;
    username?: string;
  };
  category: string;
  isFeatured: boolean;
}

interface ArtworkGridProps {
  featured?: boolean;
  category?: string;
  artist?: string;
  limit?: number;
}

export function ArtworkGrid({
  featured,
  category,
  artist,
  limit,
}: ArtworkGridProps) {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        let url = `${API_URL}/api/artworks`;
        const params = new URLSearchParams();

        if (featured) params.append("featured", "true");
        if (category) params.append("category", category);
        if (artist) params.append("artist", artist);
        if (limit) params.append("limit", limit.toString());

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch artworks");
        }

        const data = await response.json();
        // Transform data to ensure imageUrl is populated
        const transformedData = data.map((artwork: Artwork) => ({
          ...artwork,
          imageUrl: artwork.imageUrl || (artwork.images && artwork.images[0]) || "/placeholder.svg?height=400&width=400",
        }));
        setArtworks(transformedData);
      } catch (error) {
        console.error("Error fetching artworks:", error);
        toast({
          title: "Error",
          description: "Failed to load artworks. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchWishlist = async () => {
      if (isAuthenticated && user?._id) {
        try {
          const response = await fetch(
            `${API_URL}/api/wishlist/${user._id}`
          );

          if (response.ok) {
            const data = await response.json();
            setWishlist(data.artworks?.map((item: any) => item._id || item) || []);
          }
        } catch (error) {
          console.error("Error fetching wishlist:", error);
        }
      }
    };

    fetchArtworks();
    fetchWishlist();
  }, [featured, category, artist, limit, isAuthenticated, user, toast]);

  const toggleWishlist = async (artworkId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to add items to your wishlist",
        variant: "default",
      });
      return;
    }

    try {
      const isInWishlist = wishlist.includes(artworkId);
      const method = isInWishlist ? "DELETE" : "POST";
      const url = `${API_URL}/api/wishlist/${user?._id}/${artworkId}`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update wishlist");
      }

      // Update local wishlist state
      if (isInWishlist) {
        setWishlist(wishlist.filter((id) => id !== artworkId));
        toast({
          title: "Removed from wishlist",
          description: "The artwork has been removed from your wishlist",
          variant: "default",
        });
      } else {
        setWishlist([...wishlist, artworkId]);
        toast({
          title: "Added to wishlist",
          description: "The artwork has been added to your wishlist",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-[300px] w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
              <CardFooter className="flex justify-between p-4">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </CardFooter>
            </Card>
          ))}
      </div>
    );
  }

  if (artworks.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium">No artworks found</h3>
        <p className="text-muted-foreground mt-2">
          Try adjusting your filters or check back later
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {artworks.map((artwork) => (
        <Card key={artwork._id} className="overflow-hidden group">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={artwork.imageUrl || "/placeholder.svg?height=400&width=400"}
              alt={artwork.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
              onClick={() => toggleWishlist(artwork._id)}
            >
              <Heart
                className={`h-5 w-5 ${
                  wishlist.includes(artwork._id)
                    ? "fill-primary text-primary"
                    : ""
                }`}
              />
              <span className="sr-only">Add to wishlist</span>
            </Button>
          </div>
          <CardContent className="p-4">
            <Link href={`/artworks/${artwork._id}`}>
              <h3 className="font-semibold text-lg hover:underline truncate">
                {artwork.title}
              </h3>
            </Link>

            {artwork.artist ? (
              <Link href={`/artists/${artwork.artist._id}`}>
                <p className="text-sm text-muted-foreground hover:underline">
                  {artwork.artist.displayName || artwork.artist.name || artwork.artist.username}
                </p>
              </Link>
            ) : (
              <p className="text-sm text-muted-foreground">Unknown Artist</p>
            )}
          </CardContent>

          <CardFooter className="flex justify-between p-4 pt-0">
            <p className="font-medium">${artwork.price.toLocaleString()}</p>
            <Link href={`/artworks/${artwork._id}`}>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
