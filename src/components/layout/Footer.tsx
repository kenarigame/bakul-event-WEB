import { Link } from "react-router-dom";
import {
  Calendar,
  Mail,
  Phone,
  MapPin,
  Globe,
  MessageCircle,
  Share2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-foreground text-background mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link
              to="/"
              className="flex items-center gap-2 font-bold text-xl text-background mb-4"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-background text-foreground">
                <Calendar className="size-4" />
              </div>
              <span>Eventify</span>
            </Link>
            <p className="text-sm text-background/70 leading-relaxed">
              Indonesia's premier event management platform. Discover, create,
              and manage unforgettable experiences.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="#"
                className="text-background/70 hover:text-background transition-colors"
              >
                <Globe className="size-5" />
              </a>
              <a
                href="#"
                className="text-background/70 hover:text-background transition-colors"
              >
                <MessageCircle className="size-5" />
              </a>
              <a
                href="#"
                className="text-background/70 hover:text-background transition-colors"
              >
                <Share2 className="size-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4 text-background">Explore</h3>
            <ul className="space-y-2 text-sm text-background/70">
              {[
                "All Events",
                "Featured Events",
                "Categories",
                "Organizers",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="/events"
                    className="hover:text-background transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-background">
              For Organizers
            </h3>
            <ul className="space-y-2 text-sm text-background/70">
              {["Create Event", "Manage Events", "Analytics", "Support"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      to="/register"
                      className="hover:text-background transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-background">Contact</h3>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" />
                <span>hello@eventify.id</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" />
                <span>+62 21 1234 5678</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0" />
                <span>Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-background/20" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/50">
          <p>© 2024 Eventify. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-background/80 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-background/80 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
