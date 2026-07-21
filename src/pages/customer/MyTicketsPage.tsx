import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Calendar, Ticket, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { transactionsApi } from "@/services/api.service";
import { formatDate } from "@/lib/utils";

export function MyTicketsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["transactions", "confirmed"],
    queryFn: () => transactionsApi.getMyTransactions({ status: "CONFIRMED" }),
  });

  const transactions = data?.data?.data || [];

  if (isLoading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-36" />
        ))}
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Tickets</h1>
        <p className="text-muted-foreground">Your confirmed event tickets</p>
      </div>

      {transactions.length === 0 ? (
        <EmptyState
          icon={<Ticket className="size-8 text-muted-foreground" />}
          title="No tickets yet"
          description="Book your first event to see your tickets here."
          action={{
            label: "Browse Events",
            onClick: () => (window.location.href = "/events"),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transactions.map(
            (tx: {
              id: string;
              event: {
                id: string;
                name: string;
                slug: string;
                startDate: string;
                endDate: string;
                venue: string;
                city: string;
                thumbnail?: string;
              };
              details: Array<{
                id: string;
                ticket: { name: string };
                quantity: number;
              }>;
              total: number;
              status: string;
            }) => (
              <Card key={tx.id} className="overflow-hidden">
                <div className="relative h-32 bg-muted">
                  {tx.event.thumbnail ? (
                    <img
                      src={tx.event.thumbnail}
                      alt={tx.event.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <Calendar className="size-12 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold line-clamp-1">
                      {tx.event.name}
                    </h3>
                    <Badge className="bg-emerald-600 hover:bg-emerald-700 shrink-0 ml-2">
                      Confirmed
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {formatDate(tx.event.startDate)}
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    {tx.event.venue}, {tx.event.city}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      {tx.details?.map(
                        (d: {
                          id: string;
                          ticket: { name: string };
                          quantity: number;
                        }) => (
                          <span key={d.id} className="text-muted-foreground">
                            {d.quantity}x {d.ticket.name}
                          </span>
                        ),
                      )}
                    </div>
                    <Button size="sm" variant="outline">
                      <Link to={`/events/${tx.event.slug}`}>
                        <ExternalLink className="mr-1 size-3" />
                        View
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ),
          )}
        </div>
      )}
    </div>
  );
}
