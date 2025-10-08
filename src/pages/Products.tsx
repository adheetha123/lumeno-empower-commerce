import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  location: string;
  is_organic: boolean;
  seller_id: string;
  profiles: {
    full_name: string;
  };
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        profiles:seller_id (full_name)
      `)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
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
        description: "Item has been added to your cart",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Browse <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Products</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover unique handcrafted goods and student projects
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
            <p className="text-muted-foreground">No products available yet. Be the first to list!</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-card transition-all duration-300">
                <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
                  {product.is_organic && (
                    <Badge className="absolute top-2 right-2 bg-secondary">Organic</Badge>
                  )}
                  {product.image_url && (
                    <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">{product.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <MapPin className="w-3 h-3" />
                    <span>{product.location || "Location not specified"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">₹{product.price}</span>
                    <Button 
                      size="sm" 
                      onClick={() => addToCart(product.id)}
                      className="bg-gradient-to-r from-primary to-primary-glow"
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

export default Products;
