import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Music,
  Palette,
  Briefcase,
  Utensils,
  Dumbbell,
  GraduationCap,
  Star,
  Search,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EventCard } from "@/components/events/EventCard";
import { EventGridSkeleton } from "@/components/events/EventCardSkeleton";
import { eventsApi } from "@/services/api.service";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const categoryIcons: Record<string, React.ReactNode> = {
  music: <Music className="size-6" />,
  art: <Palette className="size-6" />,
  business: <Briefcase className="size-6" />,
  food: <Utensils className="size-6" />,
  sports: <Dumbbell className="size-6" />,
  education: <GraduationCap className="size-6" />,
};

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Event Attendee",
    comment:
      "Found amazing events in my city. The booking process was seamless!",
    rating: 5,
    avatar: "SJ",
  },
  {
    name: "Budi Santoso",
    role: "Event Organizer",
    comment:
      "Managing my events has never been easier. Great platform for organizers!",
    rating: 5,
    avatar: "BS",
  },
  {
    name: "Maria Santos",
    role: "Regular Attendee",
    comment:
      "Love the variety of events. Discovered so many new interests here.",
    rating: 5,
    avatar: "MS",
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: featuredResponse, isLoading: featuredLoading } = useQuery({
    queryKey: ["events", "featured"],
    queryFn: () => eventsApi.getFeatured(),
  });

  const { data: upcomingResponse, isLoading: upcomingLoading } = useQuery({
    queryKey: ["events", "upcoming"],
    queryFn: () => eventsApi.getUpcoming(),
  });

  const { data: categoriesResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: () => eventsApi.getCategories(),
  });

  const featuredEvents = featuredResponse?.data?.data || [];
  const upcomingEvents = upcomingResponse?.data?.data || [];
  const categories = categoriesResponse?.data?.data || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/events?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-foreground via-foreground/95 to-foreground/90 text-background">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 size-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 size-96 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-24 md:py-36 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Badge className="mb-6 bg-background/20 text-background border-background/30 hover:bg-background/30">
              <TrendingUp className="mr-1 size-3" />
              Indonesia's #1 Event Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-balance mb-6">
              Discover & Experience{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-orange-400">
                Unforgettable Events
              </span>
            </h1>
            <p className="text-lg text-background/70 max-w-xl mb-10 leading-relaxed">
              From concerts to tech conferences, food festivals to art
              exhibitions — find and book events that match your passion across
              Indonesia.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events, cities, categories..."
                  className="pl-9 bg-background text-foreground h-12"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-white shrink-0"
              >
                Search
              </Button>
            </form>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12 text-sm">
              {[
                { label: "Active Events", value: "500+" },
                { label: "Cities", value: "50+" },
                { label: "Happy Attendees", value: "100K+" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-background">
                    {stat.value}
                  </div>
                  <div className="text-background/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              Browse by Category
            </h2>
            <p className="text-muted-foreground">
              Explore events across various interests
            </p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {(categories.length > 0
              ? categories
              : [
                  {
                    id: "1",
                    name: "Music",
                    slug: "music",
                    icon: "music",
                    color: "#8B5CF6",
                  },
                  {
                    id: "2",
                    name: "Business",
                    slug: "business",
                    icon: "business",
                    color: "#3B82F6",
                  },
                  {
                    id: "3",
                    name: "Art",
                    slug: "art",
                    icon: "art",
                    color: "#EC4899",
                  },
                  {
                    id: "4",
                    name: "Food",
                    slug: "food",
                    icon: "food",
                    color: "#F59E0B",
                  },
                  {
                    id: "5",
                    name: "Sports",
                    slug: "sports",
                    icon: "sports",
                    color: "#10B981",
                  },
                  {
                    id: "6",
                    name: "Education",
                    slug: "education",
                    icon: "education",
                    color: "#6366F1",
                  },
                ]
            )
              .slice(0, 6)
              .map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to={`/events?categoryId=${cat.id}`}>
                    <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
                      <CardContent className="flex flex-col items-center justify-center py-6 gap-2">
                        <div
                          className="flex size-12 items-center justify-center rounded-xl text-white"
                          style={{ backgroundColor: cat.color || "#6366f1" }}
                        >
                          {categoryIcons[cat.icon?.toLowerCase() || ""] || (
                            <Calendar className="size-6" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-center">
                          {cat.name}
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">
                Featured Events
              </h2>
              <p className="text-muted-foreground">
                Hand-picked experiences you don't want to miss
              </p>
            </div>
            <Button variant="outline" >
              <Link to="/events?featured=true">
                View all <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>

          {featuredLoading ? (
            <EventGridSkeleton count={4} />
          ) : featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredEvents.slice(0, 4).map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No featured events yet
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">
                Upcoming Events
              </h2>
              <p className="text-muted-foreground">
                Don't miss what's coming up
              </p>
            </div>
            <Button variant="outline" >
              <Link to="/events">
                Browse all <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>

          {upcomingLoading ? (
            <EventGridSkeleton count={4} />
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {upcomingEvents.slice(0, 8).map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No upcoming events
            </div>
          )}
        </div>
      </section>

      {/* CTA for Organizers */}
      <section className="py-20 bg-foreground text-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Host Your Event?
            </h2>
            <p className="text-background/70 max-w-xl mx-auto mb-8">
              Join thousands of organizers who trust Eventify to create, manage,
              and grow their events across Indonesia.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                variant="outline"
                className="border-background text-background hover:bg-background hover:text-foreground"
                
              >
                <Link to="/register">Start for Free</Link>
              </Button>
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                <Link to="/events">Explore Events</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              What People Say
            </h2>
            <p className="text-muted-foreground">
              Loved by attendees and organizers alike
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star
                          key={j}
                          className="size-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      "{t.comment}"
                    </p>
                    <Separator className="mb-4" />
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                        {t.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <h2 className="text-2xl font-bold mb-3">Stay in the Loop</h2>
          <p className="text-muted-foreground mb-6">
            Get notified about the latest events in your city.
          </p>
          <form className="flex gap-2">
            <Input
              placeholder="Enter your email"
              type="email"
              className="flex-1"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  );
}
