"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Globe, Mail } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Artist {
  _id: string;
  username: string;
  displayName: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  location?: string;
  website?: string;
}

interface Artwork {
  _id: string;
  title: string;
  price: number;
  images: string[];
  imageUrl?: string;
}

export default function ArtistDetailPage() {
  const params = useParams();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchArtistAndArtworks = async () => {
      try {
        const [artistRes, artworksRes] = await Promise.all([
          fetch(`${API_URL}/api/users/${params.id}`),
          fetch(`${API_URL}/api/artworks/artist/${params.id}`),
        ]);

        if (!artistRes.ok) throw new Error("Artist not found");

        const artistData = await artistRes.json();
        setArtist(artistData);

        if (artworksRes.ok) {
          const artworksData = await artworksRes.json();
          setArtworks(artworksData);
        }
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "Failed to load artist profile.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchArtistAndArtworks();
  }, [params.id, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Skeleton className="h-64 w-full rounded-lg mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-lg" />
              ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Artist Not Found</h1>
            <Link href="/artists">
              <Button>Back to Artists</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative h-64 md:h-80 bg-gradient-to-br from-primary/30 via-purple-600/20 to-pink-500/20">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        </div>

        <div className="container mx-auto px-4 -mt-20">
          {/* Artist Info Card */}
          <Card className="mb-8 overflow-hidden shadow-xl">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-background shadow-lg mx-auto md:mx-0">
                    {artist.profilePicture ? (
                      <Image
                        src={artist.profilePicture}
                        alt={artist.displayName || artist.username}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                        {(artist.displayName || artist.username).charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-2">
                    {artist.displayName || artist.username}
                  </h1>
                  <p className="text-muted-foreground mb-4">@{artist.username}</p>

                  {artist.bio && (
                    <p className="text-muted-foreground mb-4 max-w-2xl">
                      {artist.bio}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-muted-foreground">
                    {artist.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {artist.location}
                      </div>
                    )}
                    {artist.website && (
                      <a
                        href={artist.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-primary"
                      >
                        <Globe className="h-4 w-4" />
                        Website
                      </a>
                    )}
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {artist.email}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex md:flex-col gap-6 justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {artworks.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Artworks</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Artworks Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Artworks by {artist.displayName || artist.username}</h2>
              <Link href="/artists">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Artists
                </Button>
              </Link>
            </div>

            {artworks.length === 0 ? (
              <div className="text-center py-12 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">No artworks yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {artworks.map((artwork) => (
                  <Link key={artwork._id} href={`/artworks/${artwork._id}`}>
                    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="relative aspect-square">
                        <Image
                          src={artwork.imageUrl || artwork.images?.[0] || "/placeholder.svg"}
                          alt={artwork.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardFooter className="p-4 flex justify-between items-center">
                        <h3 className="font-medium truncate">{artwork.title}</h3>
                        <span className="font-bold text-primary">
                          ${artwork.price.toLocaleString()}
                        </span>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
