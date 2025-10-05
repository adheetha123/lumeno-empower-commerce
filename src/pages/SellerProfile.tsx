import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MapPin, Heart, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SellerProfile = () => {
  const { sellerId } = useParams();
  const [seller, setSeller] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSellerData();
    checkFollowStatus();
  }, [sellerId]);

  const fetchSellerData = async () => {
    const { data: sellerData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", sellerId)
      .single();

    const { data: productsData } = await supabase
      .from("products")
      .select("*")
      .eq("seller_id", sellerId)
      .eq("status", "active");

    const { data: servicesData } = await supabase
      .from("services")
      .select("*")
      .eq("provider_id", sellerId)
      .eq("status", "available");

    const { data: reviewsData } = await supabase
      .from("reviews")
      .select("*, user:user_id(full_name, avatar_url)")
      .eq("seller_id", sellerId)
      .order("created_at", { ascending: false });

    setSeller(sellerData);
    setProducts(productsData || []);
    setServices(servicesData || []);
    setReviews(reviewsData || []);
    setLoading(false);
  };

  const checkFollowStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("seller_follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("seller_id", sellerId)
      .single();

    setIsFollowing(!!data);
  };

  const toggleFollow = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Please sign in", variant: "destructive" });
      return;
    }

    if (isFollowing) {
      await supabase
        .from("seller_follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("seller_id", sellerId);
      toast({ title: "Unfollowed seller" });
    } else {
      await supabase
        .from("seller_follows")
        .insert({ follower_id: user.id, seller_id: sellerId });
      toast({ title: "Following seller" });
    }
    setIsFollowing(!isFollowing);
  };

  const addToCart = async (productId: string, price: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Please sign in", variant: "destructive" });
      return;
    }

    const { error } = await supabase
      .from("cart_items")
      .insert({ user_id: user.id, product_id: productId, quantity: 1 });

    if (error) {
      toast({ title: "Error adding to cart", variant: "destructive" });
    } else {
      toast({ title: "Added to cart!" });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const bannerStyle = seller?.banner_url 
    ? { backgroundImage: `url(${seller.banner_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: `linear-gradient(135deg, ${seller?.theme_color || '#8B4513'}, #D2691E)` };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="h-64 relative" style={bannerStyle}>
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container mx-auto px-4 -mt-16 relative z-10">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <img
                  src={seller?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${seller?.id}`}
                  alt={seller?.store_name || seller?.full_name}
                  className="w-32 h-32 rounded-full border-4 border-background"
                />
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{seller?.store_name || seller?.full_name}</h1>
                  <p className="text-muted-foreground mb-4">{seller?.store_description || seller?.bio}</p>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-primary text-primary" />
                      <span className="font-semibold">{seller?.seller_rating?.toFixed(1) || "0.0"}</span>
                      <span className="text-sm text-muted-foreground">({seller?.total_reviews || 0} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{seller?.city}, {seller?.state}</span>
                    </div>
                  </div>
                  <Button onClick={toggleFollow} className="gap-2">
                    <Heart className={`w-4 h-4 ${isFollowing ? 'fill-current' : ''}`} />
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="products" className="mt-8">
            <TabsList>
              <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
              <TabsTrigger value="services">Services ({services.length})</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="mt-6">
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-primary">${product.price}</span>
                        <Button size="sm" onClick={() => addToCart(product.id, product.price)}>
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="services" className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <Card key={service.id}>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-primary font-bold">
                          ${service.pricing_type === 'hourly' ? `${service.price_per_hour}/hr` : service.fixed_price}
                        </span>
                        <Button size="sm">Book</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6 space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={review.user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.user_id}`}
                        alt={review.user?.full_name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{review.user?.full_name}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SellerProfile;
