import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { PlusCircle, Edit, Trash2, Eye, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import { eventsApi } from "@/services/api.service";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  DRAFT: "bg-secondary text-secondary-foreground",
  PUBLISHED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-blue-100 text-blue-700",
};

export function OrganizerEventsPage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["organizer-events", page],
    queryFn: () => eventsApi.getMyEvents({ page, limit: 10 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => eventsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizer-events"] });
      toast.success("Event deleted");
    },
    onError: () => toast.error("Failed to delete event"),
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => eventsApi.publish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizer-events"] });
      toast.success("Event published!");
    },
  });

  const events = data?.data?.data || [];
  const meta = data?.data?.meta;

  if (isLoading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Events</h1>
          <p className="text-muted-foreground">Manage your created events</p>
        </div>
        <Button>
          <Link to="/organizer/events/create">
            <PlusCircle className="mr-2 size-4" />
            Create Event
          </Link>
        </Button>
      </div>

      {events.length === 0 ? (
        <EmptyState
          title="No events yet"
          description="Create your first event to start accepting bookings."
          action={{
            label: "Create Event",
            onClick: () => (window.location.href = "/organizer/events/create"),
          }}
        />
      ) : (
        <>
          <div className="space-y-3">
            {events.map(
              (event: {
                id: string;
                name: string;
                slug: string;
                startDate: string;
                city: string;
                availableSeats: number;
                capacity: number;
                status: string;
                tickets?: Array<{ type: string; price: number }>;
              }) => (
                <Card key={event.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">
                            {event.name}
                          </h3>
                          <Badge className={statusColors[event.status]}>
                            {event.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(event.startDate)} · {event.city}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {event.availableSeats}/{event.capacity} seats
                          remaining
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {event.status === "DRAFT" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => publishMutation.mutate(event.id)}
                          >
                            Publish
                          </Button>
                        )}
                        <Button size="icon-sm" variant="ghost">
                          <Link to={`/organizer/events/${event.id}/vouchers`}>
                            <Tag className="size-4" />
                          </Link>
                        </Button>
                        <Button size="icon-sm" variant="ghost">
                          <Link to={`/events/${event.slug}`}>
                            <Eye className="size-4" />
                          </Link>
                        </Button>
                        <Button size="icon-sm" variant="ghost">
                          <Link to={`/organizer/events/${event.id}/edit`}>
                            <Edit className="size-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger>
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Event</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete "{event.name}".
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(event.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ),
            )}
          </div>
          {meta && (
            <Pagination
              page={page}
              totalPages={meta.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
