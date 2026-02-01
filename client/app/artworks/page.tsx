"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArtworkGrid } from "@/components/artwork-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function ArtworksPage() {
  const [category, setCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [sortBy, setSortBy] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)

  const categories = [
    { value: "painting", label: "Painting" },
    { value: "sculpture", label: "Sculpture" },
    { value: "photography", label: "Photography" },
    { value: "digital", label: "Digital Art" },
    { value: "mixed-media", label: "Mixed Media" },
    { value: "drawing", label: "Drawing" },
  ]

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">Explore Artworks</h1>
            <p className="text-muted-foreground mt-2">Discover unique pieces from artists around the world</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className={`${showFilters ? "block" : "hidden"} md:block`}>
            <div className="sticky top-20 space-y-6">
              <div>
                <h3 className="font-medium mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div key={cat.value} className="flex items-center">
                      <Checkbox
                        id={`category-${cat.value}`}
                        checked={category === cat.value}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setCategory(cat.value)
                          } else if (category === cat.value) {
                            setCategory(null)
                          }
                        }}
                      />
                      <Label htmlFor={`category-${cat.value}`} className="ml-2 text-sm font-normal">
                        {cat.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Price Range</h3>
                <Slider
                  defaultValue={[0, 10000]}
                  max={10000}
                  step={100}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-6"
                />
                <div className="flex items-center space-x-4">
                  <div className="grid gap-2 flex-1">
                    <Label htmlFor="price-min">Min</Label>
                    <Input
                      type="number"
                      id="price-min"
                      value={priceRange[0]}
                      onChange={(e) => {
                        const value = Number.parseInt(e.target.value)
                        if (!isNaN(value) && value >= 0) {
                          setPriceRange([value, priceRange[1]])
                        }
                      }}
                    />
                  </div>
                  <div className="grid gap-2 flex-1">
                    <Label htmlFor="price-max">Max</Label>
                    <Input
                      type="number"
                      id="price-max"
                      value={priceRange[1]}
                      onChange={(e) => {
                        const value = Number.parseInt(e.target.value)
                        if (!isNaN(value) && value <= 10000) {
                          setPriceRange([priceRange[0], value])
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Availability</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox id="available" />
                    <Label htmlFor="available" className="ml-2 text-sm font-normal">
                      In Stock
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="sold" />
                    <Label htmlFor="sold" className="ml-2 text-sm font-normal">
                      Include Sold
                    </Label>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setCategory(null)
                  setPriceRange([0, 10000])
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>

          <div className="md:col-span-3">
            <ArtworkGrid category={category} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

