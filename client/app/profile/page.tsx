"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Mail, MapPin, Edit, Package, Heart, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Skeleton className="h-64 w-full rounded-lg mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-lg" />
              ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
          <Card className="max-w-md w-full p-8 text-center">
            <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Sign in to view profile</h1>
            <p className="text-muted-foreground mb-6">
              Please log in to access your profile
            </p>
            <Link href="/login">
              <Button className="w-full">Sign In</Button>
            </Link>
          </Card>
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
        <div className="relative h-48 md:h-64 bg-gradient-to-br from-primary/30 via-purple-600/20 to-pink-500/20">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        </div>

        <div className="container mx-auto px-4 -mt-16">
          {/* Profile Card */}
          <Card className="mb-8 overflow-hidden shadow-xl">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                {/* Avatar */}
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-lg">
                  <div className="w-full h-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                    {(user?.name || "U").charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-1">{user?.name}</h1>
                  <p className="text-muted-foreground mb-4 flex items-center justify-center md:justify-start gap-2">
                    <Mail className="h-4 w-4" />
                    {user?.email}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center md:justify-start">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium capitalize">
                      {user?.role || "Collector"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Section */}
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">My Orders</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Track your purchases
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Link href="/orders">
                      <Button variant="outline" className="w-full">
                        View Orders
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-pink-500/10 flex items-center justify-center">
                      <Heart className="h-6 w-6 text-pink-500" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Wishlist</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Saved artworks
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Link href="/wishlist">
                      <Button variant="outline" className="w-full">
                        View Wishlist
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <Settings className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Settings</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Account preferences
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Manage Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="orders" className="mt-6">
              <Card className="p-8 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Your Orders</h3>
                <p className="text-muted-foreground mb-4">
                  View and track all your orders in one place
                </p>
                <Link href="/orders">
                  <Button>View All Orders</Button>
                </Link>
              </Card>
            </TabsContent>

            <TabsContent value="wishlist" className="mt-6">
              <Card className="p-8 text-center">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Your Wishlist</h3>
                <p className="text-muted-foreground mb-4">
                  View all your saved artworks
                </p>
                <Link href="/wishlist">
                  <Button>View Wishlist</Button>
                </Link>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
