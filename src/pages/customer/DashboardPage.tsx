import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Calendar, CreditCard, Gift, Star, Ticket } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionStatusBadge } from "@/components/common/TransactionStatusBadge";
import { dashboardApi } from "@/services/api.service";
import { useAuthStore } from "@/store/auth.store";
import { formatIDR, formatDate } from "@/lib/utils";

export function CustomerDashboardPage() {
  const { user } = useAuthStore();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "customer"],
    queryFn: () => dashboardApi.getCustomer(),
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
      icon: CreditCard,
      label: "Total Bookings",
      value: stats?.totalTransactions || 0,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Calendar,
      label: "Upcoming Events",
      value: stats?.upcomingEvents || 0,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      icon: Gift,
      label: "Points Balance",
      value: `${(stats?.totalPoints || 0).toLocaleString()} pts`,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      icon: Star,
      label: "Available Coupons",
      value: stats?.availableCoupons || 0,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-muted-foreground">Here's your activity overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ icon: Icon, label, value, color, bg }) => (
          <Card key={label}>
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
        ))}
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Recent Bookings</CardTitle>
            <Button variant="ghost" size="sm">
              <Link to="/transactions">View all</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {stats?.recentTransactions?.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No bookings yet
            </p>
          ) : (
            <div className="space-y-3">
              {stats?.recentTransactions?.map(
                (tx: {
                  id: string;
                  event: {
                    name: string;
                    startDate: string;
                    thumbnail?: string;
                  };
                  total: number;
                  status: string;
                }) => (
                  <div key={tx.id} className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted shrink-0">
                      <Ticket className="size-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {tx.event?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(tx.event?.startDate)}
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

      <div className="flex gap-3">
        <Button>
          <Link to="/events">
            <Calendar className="mr-2 size-4" />
            Browse Events
          </Link>
        </Button>
        <Button variant="outline">
          <Link to="/points">
            <Gift className="mr-2 size-4" />
            View Points
          </Link>
        </Button>
      </div>
    </div>
  );
}
