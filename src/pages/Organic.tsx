import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ShoppingCart, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  location: string;
  seller_id: string;
  profiles: {
    full_name: string;
  };
};

const Organic = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrganicProducts();
  }, []);

  const fetchOrganicProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        profiles:seller_id (full_name)
      `)
      .eq("status", "active")
      .eq("is_organic", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching organic products:", error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const addToCart = async (productId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("cart_items")
      .insert({ user_id: user.id, product_id: productId, quantity: 1 });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Added to cart!",
        description: "Fresh produce added to your cart",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Organic</span> Produce
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Fresh, locally-sourced produce directly from farmers
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted" />
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No organic products available yet. Farmers, start listing your fresh produce!</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-card transition-all duration-300 border-secondary/20">
                <div className="h-48 bg-gradient-to-br from-secondary/10 to-accent/10 relative overflow-hidden">
                  <Badge className="absolute top-2 right-2 bg-secondary">
                    <Leaf className="w-3 h-3 mr-1" />
                    Organic
                  </Badge>
                  {product.image_url && (
                    <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-1 group-hover:text-secondary transition-colors">{product.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <MapPin className="w-3 h-3" />
                    <span>{product.location || "Location not specified"}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">
                    by {product.profiles?.full_name || "Unknown Farmer"}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-secondary">${product.price}</span>
                    <Button 
                      size="sm" 
                      onClick={() => addToCart(product.id)}
                      className="bg-gradient-to-r from-secondary to-accent hover:shadow-soft"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add
                    </Button>
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
};

export default Organic;
