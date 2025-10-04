import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star } from "lucide-react";

const sellers = [
  {
    name: "Sarah's Organic Farm",
    type: "Organic Farmer",
    location: "San Francisco, CA",
    rating: 4.9,
    sales: "500+",
    badge: "Verified",
    description: "Fresh seasonal vegetables and fruits grown with sustainable practices",
  },
  {
    name: "Creative Canvas Studio",
    type: "Digital Artist",
    location: "Austin, TX",
    rating: 5.0,
    sales: "300+",
    badge: "Top Rated",
    description: "Custom illustrations, logo design, and digital art commissions",
  },
  {
    name: "EcoWear Creations",
    type: "Student Entrepreneur",
    location: "Portland, OR",
    rating: 4.8,
    sales: "200+",
    badge: "Rising Star",
    description: "Handcrafted sustainable fashion and upcycled clothing",
  },
];

const FeaturedSellers = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Meet Our <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Community</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Real people building real businesses on LUMENO
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {sellers.map((seller, index) => (
            <Card 
              key={index} 
              className="border-border/50 hover:shadow-card transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden group"
            >
              <div className="h-48 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 relative">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-foreground hover:bg-white">
                    {seller.badge}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-1">{seller.name}</h3>
                <p className="text-sm text-primary font-medium mb-3">{seller.type}</p>
                
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{seller.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="font-medium text-foreground">{seller.rating}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{seller.description}</p>
                
                <div className="pt-4 border-t border-border">
                  <span className="text-sm font-medium">{seller.sales} sales</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSellers;
