"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, ShoppingCart, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { SearchBar } from "@/components/search-bar"
import { useAuth } from "@/hooks/use-auth"

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="/"
                className={cn("hover:text-foreground/80", pathname === "/" ? "text-foreground" : "text-foreground/60")}
              >
                Home
              </Link>
              <Link
                href="/artworks"
                className={cn(
                  "hover:text-foreground/80",
                  pathname?.startsWith("/artworks") ? "text-foreground" : "text-foreground/60",
                )}
              >
                Artworks
              </Link>
              <Link
                href="/artists"
                className={cn(
                  "hover:text-foreground/80",
                  pathname?.startsWith("/artists") ? "text-foreground" : "text-foreground/60",
                )}
              >
                Artists
              </Link>
              <Link
                href="/about"
                className={cn(
                  "hover:text-foreground/80",
                  pathname === "/about" ? "text-foreground" : "text-foreground/60",
                )}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={cn(
                  "hover:text-foreground/80",
                  pathname === "/contact" ? "text-foreground" : "text-foreground/60",
                )}
              >
                Contact
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold text-xl">ARTIFEX</span>
        </Link>

        <div className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Artworks</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          href="/artworks"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">Browse All Artworks</div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Discover unique pieces from artists around the world
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <Link
                        href="/artworks/category/painting"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Paintings</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Oil, acrylic, watercolor and more
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/artworks/category/sculpture"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Sculptures</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Three-dimensional art pieces
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/artworks/category/photography"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Photography</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Fine art photography from talented photographers
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/artworks/category/digital"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Digital Art</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Contemporary digital creations
                        </p>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/artists" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Artists</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>About</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Contact</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {isSearchOpen && (
            <div className="absolute inset-x-0 top-16 bg-background border-b p-4">
              <SearchBar onClose={() => setIsSearchOpen(false)} />
            </div>
          )}

          <Link href="/cart">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Button>
          </Link>

          {isAuthenticated ? (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <User className="h-5 w-5 mr-2" />
                    {user?.name?.split(" ")[0]}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-3 p-4">
                      <li>
                        <Link
                          href="/profile"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Profile</div>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/wishlist"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Wishlist</div>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/orders"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Orders</div>
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={logout}
                          className="w-full text-left select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Logout</div>
                        </button>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          ) : (
            <Link href="/login">
              <Button variant="default">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

