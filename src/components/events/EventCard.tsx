import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Event } from "@/services/api.service";
import { formatIDR, formatDate } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const lowestPrice = event.tickets?.reduce((min, t) => {
    if (t.type === "FREE") return 0;
    return Math.min(min, t.price);
  }, Infinity);
  const isFree =
    lowestPrice === 0 || event.tickets?.some((t) => t.type === "FREE");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link to={`/events/${event.slug}`}>
        <Card className="group overflow-hidden border hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 p-0">
          {/* Thumbnail */}
          <div className="relative aspect-video overflow-hidden bg-muted">
            {event.thumbnail ? (
              <img
                src={event.thumbnail}
                alt={event.name}
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-linear-to-br from-primary/20 to-primary/5">
                <Calendar className="size-12 text-primary/40" />
              </div>
            )}
            {/* Status badges */}
            <div className="absolute top-2 left-2 flex gap-1">
              {event.isFeatured && (
                <Badge className="text-xs bg-amber-500 hover:bg-amber-600">
                  Featured
                </Badge>
              )}
              {isFree && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-emerald-500 text-white hover:bg-emerald-600"
                >
                  Free
                </Badge>
              )}
            </div>
            <div className="absolute top-2 right-2">
              <Badge
                variant="outline"
                className="text-xs bg-background/80 backdrop-blur"
              >
                {event.availableSeats} seats left
              </Badge>
            </div>
          </div>

          <CardContent className="p-4">
            {/* Category */}
            <div className="flex items-center gap-1 mb-2">
              <Tag className="size-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {event.category?.name}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-sm line-clamp-2 mb-3 group-hover:text-primary transition-colors leading-snug">
              {event.name}
            </h3>

            {/* Details */}
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="size-3 shrink-0" />
                <span>{formatDate(event.startDate)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="size-3 shrink-0" />
                <span className="truncate">{event.city}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="size-3 shrink-0" />
                <span>{event.organizer?.name}</span>
              </div>
            </div>

            {/* Price */}
            <div className="mt-3 pt-3 border-t flex items-center justify-between">
              <div>
                {isFree ? (
                  <span className="font-semibold text-emerald-600">Free</span>
                ) : (
                  <span className="font-semibold text-sm">
                    {lowestPrice === Infinity
                      ? "See tickets"
                      : `From ${formatIDR(lowestPrice)}`}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
