import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Users, Calendar } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary to-teal-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 container mx-auto px-4 text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Discover the <span className="text-secondary">Unseen</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 max-w-2xl mx-auto font-light">
            Connect with travelers, find offbeat destinations, and plan your perfect trip with AI.
          </p>

          {/* Search Bar Mockup */}
          <div className="max-w-3xl mx-auto mt-8 p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-4">
              <Search className="w-5 h-5 text-gray-300" />
              <Input
                className="bg-transparent border-none text-white placeholder:text-gray-300 focus-visible:ring-0 h-12 text-lg"
                placeholder="Where do you want to go?"
              />
            </div>
            <Button size="lg" className="rounded-full px-8 bg-secondary hover:bg-secondary/90 text-white font-semibold">
              Explore
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MapPin className="w-8 h-8 text-primary" />}
              title="Offbeat Destinations"
              description="Find hidden gems and verified stays in remote locations."
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-secondary" />}
              title="Travel Community"
              description="Join group chats, find travel partners, and share your journey."
            />
            <FeatureCard
              icon={<Calendar className="w-8 h-8 text-accent" />}
              title="AI Trip Planner"
              description="Generate personalized itineraries and routes in seconds."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4 p-3 bg-muted rounded-xl w-fit">{icon}</div>
      <h3 className="text-xl font-heading font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
