import { ShoppingBag, Briefcase, Sprout } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  {
    icon: ShoppingBag,
    title: "Products & Goods",
    description: "Handcrafted items, student projects, and unique goods from local entrepreneurs",
    color: "from-primary to-primary-glow",
    bgColor: "bg-primary/5 hover:bg-primary/10",
  },
  {
    icon: Sprout,
    title: "Organic Produce",
    description: "Fresh, locally-sourced produce directly from farmers without intermediaries",
    color: "from-secondary to-accent",
    bgColor: "bg-secondary/5 hover:bg-secondary/10",
  },
  {
    icon: Briefcase,
    title: "Services & Skills",
    description: "Writing, design, editing, and more talents monetized by skilled individuals",
    color: "from-accent to-accent/70",
    bgColor: "bg-accent/5 hover:bg-accent/10",
  },
];

const Categories = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            One Platform,
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"> Endless Possibilities</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Browse products, discover local farmers, and hire talented individuals—all in one place
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card 
                key={index} 
                className={`${category.bgColor} border-border/50 hover:shadow-card transition-all duration-300 hover:-translate-y-1 cursor-pointer group`}
              >
                <CardContent className="p-8">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{category.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{category.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
