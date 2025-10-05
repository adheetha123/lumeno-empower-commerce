import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, TrendingUp, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Discover = () => {
  const [sellers, setSellers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDiscoverData();
  }, []);

  const fetchDiscoverData = async () => {
    const { data: sellersData } = await supabase
      .from("profiles")
      .select("*")
      .eq("is_seller", true)
      .order("seller_rating", { ascending: false })
      .limit(6);

    const { data: productsData } = await supabase
      .from("products")
      .select("*, seller:seller_id(full_name, avatar_url)")
      .eq("status", "active")
      .order("views", { ascending: false })
      .limit(8);

    const { data: servicesData } = await supabase
      .from("services")
      .select("*, provider:provider_id(full_name, avatar_url)")
      .eq("status", "available")
      .order("rating", { ascending: false })
      .limit(6);

    setSellers(sellersData || []);
    setProducts(productsData || []);
    setServices(servicesData || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Discover <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Local Treasures</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Trending sellers, products, and services in your area
          </p>
        </div>

        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold">Top Sellers</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {sellers.map((seller) => (
              <Card 
                key={seller.id} 
                className="group hover:shadow-card transition-all cursor-pointer"
                onClick={() => navigate(`/seller/${seller.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={seller.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${seller.id}`}
                      alt={seller.store_name || seller.full_name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{seller.store_name || seller.full_name}</h3>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {seller.store_description || seller.bio}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-primary text-primary" />
                          <span className="font-semibold">{seller.seller_rating?.toFixed(1) || "0.0"}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{seller.city}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold">Trending Products</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-card transition-all">
                <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
                  {product.is_organic && (
                    <Badge className="absolute top-2 right-2 bg-secondary">Organic</Badge>
                  )}
                  {product.image_url && (
                    <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-1">{product.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src={product.seller?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${product.seller_id}`}
                      alt={product.seller?.full_name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-xs text-muted-foreground">{product.seller?.full_name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-primary">${product.price}</span>
                    <Button size="sm" onClick={() => navigate(`/seller/${product.seller_id}`)}>
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-6">
            <Heart className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold">Popular Services</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="group hover:shadow-card transition-all">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{service.description}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <img
                      src={service.provider?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${service.provider_id}`}
                      alt={service.provider?.full_name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium">{service.provider?.full_name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="text-sm font-semibold">{service.rating?.toFixed(1) || "0.0"}</span>
                    </div>
                    <span className="text-primary font-bold">
                      ${service.pricing_type === 'hourly' ? `${service.price_per_hour}/hr` : service.fixed_price}
                    </span>
                  </div>
                  <Button className="w-full mt-4" onClick={() => navigate(`/seller/${service.provider_id}`)}>
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Discover;
