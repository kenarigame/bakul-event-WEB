import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Calendar, CreditCard, Clock, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionStatusBadge } from "@/components/common/TransactionStatusBadge";
import { dashboardApi } from "@/services/api.service";
import { formatIDR, formatDate } from "@/lib/utils";

export function OrganizerDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "organizer"],
    queryFn: () => dashboardApi.getOrganizer(),
  });

  const stats = data?.data?.data;

  if (isLoading)
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );

  const statCards = [
    {
      icon: Calendar,
      label: "Total Events",
      value: stats?.totalEvents || 0,
      color: "text-blue-600",
      bg: "bg-blue-50",
      link: "/organizer/events",
    },
    {
      icon: Calendar,
      label: "Active Events",
      value: stats?.activeEvents || 0,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      link: "/organizer/events",
    },
    {
      icon: CreditCard,
      label: "Confirmed Bookings",
      value: stats?.totalTransactions || 0,
      color: "text-purple-600",
      bg: "bg-purple-50",
      link: "/organizer/transactions",
    },
    {
      icon: Clock,
      label: "Pending Approval",
      value: stats?.pendingConfirmations || 0,
      color: "text-amber-600",
      bg: "bg-amber-50",
      link: "/organizer/transactions",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Organizer Dashboard
          </h1>
          <p className="text-muted-foreground">
            Overview of your events and bookings
          </p>
        </div>
        <Button>
          <Link to="/organizer/events/create">
            <PlusCircle className="mr-2 size-4" />
            Create Event
          </Link>
        </Button>
      </div>

      {/* Revenue Card */}
      <Card className="bg-linear-to-r from-foreground to-foreground/80 text-background">
        <CardContent className="p-6">
          <p className="text-background/60 text-sm mb-1">Total Revenue</p>
          <p className="text-4xl font-bold">
            {formatIDR(stats?.totalRevenue || 0)}
          </p>
          <p className="text-background/60 text-sm mt-1">
            from confirmed & completed orders
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ icon: Icon, label, value, color, bg, link }) => (
          <Link key={label} to={link}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div
                  className={`flex size-10 items-center justify-center rounded-lg ${bg} mb-3`}
                >
                  <Icon className={`size-5 ${color}`} />
                </div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Recent Bookings</CardTitle>
            <Button variant="ghost" size="sm">
              <Link to="/organizer/transactions">View all</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!stats?.recentTransactions?.length ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No bookings yet
            </p>
          ) : (
            <div className="space-y-3">
              {stats.recentTransactions.map(
                (tx: {
                  id: string;
                  user: { name: string; email: string };
                  event: { name: string };
                  total: number;
                  status: string;
                  createdAt: string;
                }) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {tx.user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tx.event?.name} · {formatDate(tx.createdAt)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium">
                        {formatIDR(tx.total)}
                      </p>
                      <TransactionStatusBadge
                        status={
                          tx.status as Parameters<
                            typeof TransactionStatusBadge
                          >[0]["status"]
                        }
                      />
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
