import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ExternalLink,
  ArrowLeft,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { eventsApi, reviewsApi } from "@/services/api.service";
import { useAuthStore } from "@/store/auth.store";
import { formatIDR, formatDate, formatDateTime } from "@/lib/utils";
import { Rating } from "@/components/common/Rating";
import { ErrorState } from "@/components/common/ErrorState";

export function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const {
    data: eventRes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["event", slug],
    queryFn: () => eventsApi.getBySlug(slug!),
    enabled: !!slug,
  });

  const event = eventRes?.data?.data;

  const { data: reviewsRes } = useQuery({
    queryKey: ["reviews", event?.id],
    queryFn: () => reviewsApi.getByEvent(event!.id),
    enabled: !!event?.id,
  });

  const reviews = reviewsRes?.data?.data?.reviews || [];
  const avgRating = reviewsRes?.data?.data?.averageRating || 0;

  const handleBuyTicket = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/events/${slug}` } });
      return;
    }
    navigate(`/checkout/${event?.id}`);
  };

  if (isLoading)
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Skeleton className="h-64 w-full rounded-xl mb-6" />
        <Skeleton className="h-8 w-2/3 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );

  if (isError || !event)
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title="Event not found"
          message="This event may no longer exist."
        />
      </div>
    );

  const isPastDeadline = new Date() > new Date(event.registrationDeadline);
  const isSoldOut = event.availableSeats === 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 size-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Banner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative aspect-video rounded-xl overflow-hidden bg-muted"
          >
            {event.banner || event.thumbnail ? (
              <img
                src={event.banner || event.thumbnail}
                alt={event.name}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-linear-to-br from-primary/20 to-primary/5">
                <Calendar className="size-16 text-primary/30" />
              </div>
            )}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge>{event.category?.name}</Badge>
              {event.isFeatured && (
                <Badge className="bg-amber-500">Featured</Badge>
              )}
            </div>
          </motion.div>

          {/* Title and Info */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-4">
              {event.name}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {[
                {
                  icon: Calendar,
                  label:
                    formatDate(event.startDate) +
                    " – " +
                    formatDate(event.endDate),
                },
                {
                  icon: Clock,
                  label: `Deadline: ${formatDateTime(event.registrationDeadline)}`,
                },
                { icon: MapPin, label: `${event.venue}, ${event.city}` },
                {
                  icon: Users,
                  label: `${event.availableSeats} / ${event.capacity} seats available`,
                },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-start gap-2 text-muted-foreground"
                >
                  <Icon className="size-4 shrink-0 mt-0.5" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-3">About This Event</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </div>

          {/* Organizer */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Organized by</h3>
              <div className="flex items-center gap-3">
                <Avatar className="size-12">
                  <AvatarImage src={event.organizer?.logo} />
                  <AvatarFallback>
                    {event.organizer?.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{event.organizer?.name}</p>
                  {event.organizer?.city && (
                    <p className="text-sm text-muted-foreground">
                      {event.organizer.city}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Maps */}
          {event.googleMapsUrl && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Location</h2>
              <p className="text-sm text-muted-foreground mb-2">
                {event.address}
              </p>
              <Button variant="outline" size="sm">
                <a
                  href={event.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 size-4" />
                  Open in Google Maps
                </a>
              </Button>
            </div>
          )}

          {/* Reviews */}
          {reviews.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Reviews</h2>
                <div className="flex items-center gap-2">
                  <Rating value={avgRating} size="sm" />
                  <span className="text-sm font-medium">
                    {avgRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({reviews.length})
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                {reviews.slice(0, 5).map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="size-8">
                          <AvatarImage src={review.user.avatar} />
                          <AvatarFallback>
                            {review.user.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium">
                              {review.user.name}
                            </p>
                            <Rating value={review.rating} size="sm" />
                          </div>
                          {review.comment && (
                            <p className="text-sm text-muted-foreground">
                              {review.comment}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Tickets */}
        <div className="space-y-4">
          <div className="sticky top-24">
            {/* Tickets */}
            <Card className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Ticket className="size-4" />
                  Tickets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {event.tickets?.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <p className="text-sm font-medium">{ticket.name}</p>
                      {ticket.description && (
                        <p className="text-xs text-muted-foreground">
                          {ticket.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {ticket.available} left
                      </p>
                    </div>
                    <div className="text-right">
                      {ticket.type === "FREE" ? (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-100 text-emerald-700"
                        >
                          Free
                        </Badge>
                      ) : (
                        <p className="text-sm font-semibold">
                          {formatIDR(ticket.price)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Buy Button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleBuyTicket}
              disabled={isPastDeadline || isSoldOut}
            >
              {isSoldOut
                ? "Sold Out"
                : isPastDeadline
                  ? "Registration Closed"
                  : "Get Tickets"}
            </Button>

            {isPastDeadline && !isSoldOut && (
              <p className="text-xs text-center text-muted-foreground mt-2">
                Registration deadline has passed
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
