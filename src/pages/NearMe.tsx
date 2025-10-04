import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NearMe = () => {
  const [location, setLocation] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const requestLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
        toast({
          title: "Location detected",
          description: "Finding sellers and services near you...",
        });
        setLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast({
          title: "Location access denied",
          description: "Please enable location services to find nearby sellers",
          variant: "destructive",
        });
        setLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
              <Navigation className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Discover <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Near You</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Find local entrepreneurs, farmers, and service providers in your community
            </p>

            <Button
              size="lg"
              onClick={requestLocation}
              disabled={loading}
              className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-all duration-300"
            >
              <Navigation className="w-5 h-5 mr-2" />
              {loading ? "Detecting location..." : "Use My Location"}
            </Button>

            {location && (
              <div className="mt-4 text-sm text-muted-foreground">
                Location: {location}
              </div>
            )}
          </div>

          <div className="grid gap-6">
            <Card className="border-primary/20">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Location-Based Discovery</h3>
                    <p className="text-muted-foreground mb-4">
                      LUMENO uses your location to connect you with sellers, farmers, and service providers in your area. Support your local community and reduce delivery times.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Badge>Local Products</Badge>
                      <Badge>Fresh Produce</Badge>
                      <Badge>Nearby Services</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-secondary/20">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4">Why Buy Local?</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-secondary">•</span>
                    <span>Support small businesses and local entrepreneurs in your community</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-secondary">•</span>
                    <span>Get fresh, organic produce directly from nearby farmers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-secondary">•</span>
                    <span>Reduce carbon footprint with shorter delivery distances</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-secondary">•</span>
                    <span>Build meaningful connections with makers and creators</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {!location && (
              <Card className="bg-muted/30">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    Enable location services to discover sellers and services near you. Your privacy is protected - we only use your location to show nearby listings.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NearMe;
