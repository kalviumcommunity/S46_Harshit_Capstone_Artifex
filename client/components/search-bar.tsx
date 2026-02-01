"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface SearchBarProps {
  onClose?: () => void
}

export function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      if (onClose) {
        onClose()
      }
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-3xl mx-auto">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for artworks, artists, or categories..."
          className="pl-10 pr-4 py-2 h-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <Button type="submit" className="ml-2">
        Search
      </Button>
      {onClose && (
        <Button type="button" variant="ghost" size="icon" className="ml-2" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      )}
    </form>
  )
}

