"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Artist {
  _id: string;
  username: string;
  displayName: string;
  profilePicture?: string;
  bio?: string;
  artworkCount?: number;
}

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await fetch(`${API_URL}/api/users/artists`);
        if (!response.ok) throw new Error("Failed to fetch artists");
        const data = await response.json();
        setArtists(data);
      } catch (error) {
        console.error("Error fetching artists:", error);
        toast({
          title: "Error",
          description: "Failed to load artists. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Featured Artists
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Discover talented artists from around the world
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
          </div>
        ) : artists.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium text-muted-foreground">
              No artists found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Check back later for new artists
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {artists.map((artist) => (
              <Link key={artist._id} href={`/artists/${artist._id}`}>
                <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50">
                  <div className="relative h-48 bg-gradient-to-br from-primary/20 to-purple-600/20">
                    {artist.profilePicture ? (
                      <Image
                        src={artist.profilePicture}
                        alt={artist.displayName || artist.username}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                          {(artist.displayName || artist.username || "A").charAt(0).toUpperCase()}
                        </div>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                      {artist.displayName || artist.username}
                    </h3>
                    {artist.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {artist.bio}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
