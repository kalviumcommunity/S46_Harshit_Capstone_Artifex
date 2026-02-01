"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface CartItem {
  artwork: {
    _id: string;
    title: string;
    images: string[];
    imageUrl?: string;
    price: number;
    artist?: {
      displayName?: string;
      username?: string;
    };
  };
  quantity: number;
  priceAtAdd: number;
}

interface Cart {
  _id: string;
  items: CartItem[];
  total: number;
  itemCount: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_URL}/api/cart/${user?._id}`);
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (artworkId: string, quantity: number) => {
    try {
      const response = await fetch(`${API_URL}/api/cart`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?._id, artworkId, quantity }),
      });
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    }
  };

  const removeItem = async (artworkId: string) => {
    try {
      const response = await fetch(
        `${API_URL}/api/cart/${user?._id}/${artworkId}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        const data = await response.json();
        setCart(data);
        toast({
          title: "Removed",
          description: "Item removed from cart",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce(
      (sum, item) => sum + item.priceAtAdd * item.quantity,
      0
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
          <Card className="max-w-md w-full p-8 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Sign in to view your cart</h1>
            <p className="text-muted-foreground mb-6">
              Please log in to access your shopping cart
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
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Shopping Cart
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-lg" />
                ))}
            </div>
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        ) : !cart?.items?.length ? (
          <Card className="max-w-md mx-auto p-8 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Discover amazing artworks and add them to your cart
            </p>
            <Link href="/artworks">
              <Button>
                Browse Artworks
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <Card key={item.artwork._id} className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-40 h-40 flex-shrink-0">
                      <Image
                        src={
                          item.artwork.imageUrl ||
                          item.artwork.images?.[0] ||
                          "/placeholder.svg"
                        }
                        alt={item.artwork.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="flex-1 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link href={`/artworks/${item.artwork._id}`}>
                            <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                              {item.artwork.title}
                            </h3>
                          </Link>
                          {item.artwork.artist && (
                            <p className="text-sm text-muted-foreground">
                              by{" "}
                              {item.artwork.artist.displayName ||
                                item.artwork.artist.username}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.artwork._id)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateQuantity(
                                item.artwork._id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateQuantity(item.artwork._id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-lg font-bold text-primary">
                          ${(item.priceAtAdd * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Subtotal ({cart.items.length} items)
                      </span>
                      <span>${calculateTotal().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">
                        ${calculateTotal().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
