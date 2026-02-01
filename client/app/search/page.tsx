"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Filter, X } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Artwork {
  _id: string;
  title: string;
  price: number;
  images: string[];
  imageUrl?: string;
  category: string;
  artist?: {
    _id: string;
    displayName?: string;
    username?: string;
  };
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      let url = `${API_URL}/api/artworks/search?query=${encodeURIComponent(searchQuery)}`;
      if (category) url += `&category=${category}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();
      setArtworks(data);
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Error",
        description: "Failed to search artworks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
            Search Artworks
          </h1>
          <p className="text-muted-foreground">
            Find the perfect piece for your collection
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by title, artist, or style..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-[200px] h-12">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="painting">Painting</SelectItem>
                <SelectItem value="sculpture">Sculpture</SelectItem>
                <SelectItem value="photography">Photography</SelectItem>
                <SelectItem value="digital">Digital</SelectItem>
                <SelectItem value="mixed-media">Mixed Media</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" size="lg" className="h-12 px-8">
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </form>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-square w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
          </div>
        ) : artworks.length === 0 && initialQuery ? (
          <Card className="max-w-md mx-auto p-8 text-center">
            <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No results found</h2>
            <p className="text-muted-foreground mb-4">
              No artworks match &quot;{initialQuery}&quot;
            </p>
            <Button variant="outline" onClick={() => setQuery("")}>
              <X className="h-4 w-4 mr-2" />
              Clear Search
            </Button>
          </Card>
        ) : artworks.length > 0 ? (
          <>
            <p className="text-muted-foreground mb-6">
              Found {artworks.length} result{artworks.length !== 1 ? "s" : ""}{" "}
              for &quot;{query}&quot;
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {artworks.map((artwork) => (
                <Link key={artwork._id} href={`/artworks/${artwork._id}`}>
                  <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="relative aspect-square">
                      <Image
                        src={
                          artwork.imageUrl ||
                          artwork.images?.[0] ||
                          "/placeholder.svg"
                        }
                        alt={artwork.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                        {artwork.title}
                      </h3>
                      {artwork.artist && (
                        <p className="text-sm text-muted-foreground">
                          {artwork.artist.displayName || artwork.artist.username}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <span className="font-bold text-primary">
                        ${artwork.price.toLocaleString()}
                      </span>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <Card className="max-w-md mx-auto p-8 text-center">
            <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Start your search</h2>
            <p className="text-muted-foreground">
              Enter keywords to find amazing artworks
            </p>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-64 mb-8" />
          <Skeleton className="h-12 w-full mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full" />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
