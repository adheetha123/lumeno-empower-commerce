import { UserCheck, Package, TrendingUp, MapPin } from "lucide-react";

const steps = [
  {
    icon: UserCheck,
    title: "Create Your Profile",
    description: "Sign up and complete our verification process. We ensure trust and safety for all users.",
  },
  {
    icon: Package,
    title: "List Your Offerings",
    description: "Upload products, services, or produce with detailed descriptions and pricing.",
  },
  {
    icon: MapPin,
    title: "Get Discovered Locally",
    description: "Location-based discovery connects you with nearby customers in your community.",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    description: "Track sales, interact with customers, and build a sustainable digital presence.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">LUMENO</span> Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Four simple steps to start your digital business journey
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connection line for desktop */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary via-secondary to-accent opacity-20" />
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative text-center group">
                <div className="relative inline-flex mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-300">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm z-20">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
