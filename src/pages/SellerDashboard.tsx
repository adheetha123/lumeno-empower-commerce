import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Package, ShoppingBag, Calendar, Settings, TrendingUp } from "lucide-react";

const SellerDashboard = () => {
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileData && !profileData.is_seller) {
      await supabase
        .from("profiles")
        .update({ is_seller: true })
        .eq("id", user.id);
    }

    const { data: productsData } = await supabase
      .from("products")
      .select("*")
      .eq("seller_id", user.id);

    const { data: servicesData } = await supabase
      .from("services")
      .select("*")
      .eq("provider_id", user.id);

    const { data: ordersData } = await supabase
      .from("orders")
      .select("*, buyer:buyer_id(full_name)")
      .eq("seller_id", user.id);

    const { data: bookingsData } = await supabase
      .from("bookings")
      .select("*, user:user_id(full_name), service:service_id(title)")
      .eq("provider_id", user.id);

    setProfile(profileData);
    setProducts(productsData || []);
    setServices(servicesData || []);
    setOrders(ordersData || []);
    setBookings(bookingsData || []);
    setLoading(false);
  };

  const updateStoreSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const { error } = await supabase
      .from("profiles")
      .update({
        store_name: formData.get("store_name") as string,
        store_description: formData.get("store_description") as string,
        banner_url: formData.get("banner_url") as string,
        theme_color: formData.get("theme_color") as string,
      })
      .eq("id", profile.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Store settings updated" });
      fetchDashboardData();
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status, tracking_status: status })
      .eq("id", orderId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Order status updated" });
      fetchDashboardData();
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Seller <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Dashboard</span>
          </h1>
          <p className="text-muted-foreground">Manage your store, products, and orders</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Package className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Products</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <ShoppingBag className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Services</p>
                  <p className="text-2xl font-bold">{services.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <TrendingUp className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Orders</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Calendar className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Bookings</p>
                  <p className="text-2xl font-bold">{bookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-4">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">Buyer: {order.buyer?.full_name}</p>
                      <p className="text-sm">Amount: ${order.total_amount}</p>
                      <p className="text-sm">Status: {order.status}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updateOrderStatus(order.id, "confirmed")}>
                        Confirm
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateOrderStatus(order.id, "shipped")}>
                        Ship
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateOrderStatus(order.id, "delivered")}>
                        Delivered
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{booking.service?.title}</p>
                      <p className="text-sm text-muted-foreground">Client: {booking.user?.full_name}</p>
                      <p className="text-sm">Date: {new Date(booking.booking_date).toLocaleDateString()}</p>
                      <p className="text-sm">Status: {booking.status}</p>
                    </div>
                    <Button size="sm">Manage</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="products">
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-bold">Your Products & Services</h2>
              <Button onClick={() => navigate("/sell")}>Add New</Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{product.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                    <p className="text-primary font-bold mt-2">${product.price}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Store Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={updateStoreSettings} className="space-y-4">
                  <div>
                    <Label htmlFor="store_name">Store Name</Label>
                    <Input id="store_name" name="store_name" defaultValue={profile?.store_name || ""} />
                  </div>
                  <div>
                    <Label htmlFor="store_description">Store Description</Label>
                    <Textarea id="store_description" name="store_description" defaultValue={profile?.store_description || ""} />
                  </div>
                  <div>
                    <Label htmlFor="banner_url">Banner Image URL</Label>
                    <Input id="banner_url" name="banner_url" defaultValue={profile?.banner_url || ""} />
                  </div>
                  <div>
                    <Label htmlFor="theme_color">Theme Color</Label>
                    <Input id="theme_color" name="theme_color" type="color" defaultValue={profile?.theme_color || "#8B4513"} />
                  </div>
                  <Button type="submit">Save Settings</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default SellerDashboard;
