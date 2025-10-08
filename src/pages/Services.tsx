import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Service = {
  id: string;
  title: string;
  description: string;
  price_per_hour: number;
  fixed_price: number;
  pricing_type: string;
  skills: string[];
  location: string;
  rating: number;
  total_orders: number;
  provider_id: string;
  profiles: {
    full_name: string;
  };
};

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from("services")
      .select(`
        *,
        profiles:provider_id (full_name)
      `)
      .eq("status", "available")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching services:", error);
    } else {
      setServices(data || []);
    }
    setLoading(false);
  };

  const contactProvider = (service: Service) => {
    toast({
      title: "Feature coming soon!",
      description: "Direct messaging with service providers will be available soon.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold">
              Browse <span className="bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">Services</span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Find talented individuals offering skills and expertise
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6 space-y-3">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-20 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : services.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No services available yet. Offer your skills and start earning!</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="group hover:shadow-card transition-all duration-300 border-accent/20">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg mb-1 group-hover:text-accent transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        by {service.profiles?.full_name || "Service Provider"}
                      </p>
                    </div>
                    {service.rating > 0 && (
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-primary text-primary" />
                        <span className="font-medium">{service.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{service.description}</p>

                  {service.skills && service.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {service.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <MapPin className="w-3 h-3" />
                    <span>{service.location || "Remote available"}</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      {service.pricing_type === "hourly" && (
                        <span className="text-lg font-bold text-accent">₹{service.price_per_hour}/hr</span>
                      )}
                      {service.pricing_type === "fixed" && (
                        <span className="text-lg font-bold text-accent">₹{service.fixed_price}</span>
                      )}
                      {service.pricing_type === "negotiable" && (
                        <span className="text-lg font-bold text-accent">Negotiable</span>
                      )}
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => contactProvider(service)}
                      className="bg-gradient-to-r from-accent to-accent/80"
                    >
                      Contact
                    </Button>
                  </div>

                  {service.total_orders > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {service.total_orders} completed order{service.total_orders !== 1 ? "s" : ""}
                    </p>
                  )}
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

export default Services;
