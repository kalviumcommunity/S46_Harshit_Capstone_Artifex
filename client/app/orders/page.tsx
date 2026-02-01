"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, Clock, CheckCircle, Truck, XCircle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { format } from "date-fns";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface OrderItem {
  artwork: {
    _id: string;
    title: string;
    images: string[];
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="h-4 w-4" />,
  confirmed: <CheckCircle className="h-4 w-4" />,
  processing: <Package className="h-4 w-4" />,
  shipped: <Truck className="h-4 w-4" />,
  delivered: <CheckCircle className="h-4 w-4" />,
  cancelled: <XCircle className="h-4 w-4" />,
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  processing: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  shipped: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  delivered: "bg-green-500/10 text-green-600 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/orders/user/${user?._id}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
          <Card className="max-w-md w-full p-8 text-center">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Sign in to view orders</h1>
            <p className="text-muted-foreground mb-6">
              Please log in to see your order history
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
          My Orders
        </h1>

        {loading ? (
          <div className="space-y-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-lg" />
              ))}
          </div>
        ) : orders.length === 0 ? (
          <Card className="max-w-md mx-auto p-8 text-center">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">
              Start exploring our collection and place your first order
            </p>
            <Link href="/artworks">
              <Button>
                Browse Artworks
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="bg-muted/50 pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.orderNumber}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Placed on{" "}
                        {format(new Date(order.createdAt), "MMMM d, yyyy")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`${statusColors[order.status]} flex items-center gap-1`}
                      >
                        {statusIcons[order.status]}
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex -space-x-4">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div
                          key={idx}
                          className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-background"
                        >
                          <Image
                            src={item.artwork.images?.[0] || "/placeholder.svg"}
                            alt={item.artwork.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="relative w-16 h-16 rounded-lg bg-muted border-2 border-background flex items-center justify-center">
                          <span className="text-sm font-medium">
                            +{order.items.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "item" : "items"}
                      </p>
                      <p className="text-lg font-bold text-primary">
                        ${order.total.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-end">
                      <Link href={`/orders/${order._id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
