import { useQuery } from "@tanstack/react-query";
import { Users, Calendar, CreditCard, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardApi } from "@/services/api.service";
import { formatIDR, formatDate } from "@/lib/utils";

export function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "admin"],
    queryFn: () => dashboardApi.getAdmin(),
  });

  const stats = data?.data?.data;

  if (isLoading)
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );

  const statCards = [
    {
      icon: Users,
      label: "Total Users",
      value: stats?.totalUsers || 0,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Calendar,
      label: "Total Events",
      value: stats?.totalEvents || 0,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      icon: CreditCard,
      label: "Transactions",
      value: stats?.totalTransactions || 0,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      icon: TrendingUp,
      label: "Total Revenue",
      value: formatIDR(stats?.totalRevenue || 0),
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Platform overview and statistics
        </p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats?.recentUsers?.map(
                (u: {
                  id: string;
                  name: string;
                  email: string;
                  role: string;
                  createdAt: string;
                }) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{u.role}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(u.createdAt)}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats?.recentEvents?.map(
                (e: {
                  id: string;
                  name: string;
                  city: string;
                  status: string;
                  organizer: { name: string };
                  category: { name: string };
                }) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div>
                      <p className="font-medium line-clamp-1">{e.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {e.organizer?.name} · {e.city}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {e.status}
                    </span>
                  </div>
                ),
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
