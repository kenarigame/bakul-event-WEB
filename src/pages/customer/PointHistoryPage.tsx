import { useQuery } from "@tanstack/react-query";
import { Gift, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import { dashboardApi } from "@/services/api.service";
import { formatDate } from "@/lib/utils";
import { useState } from "react";

export function PointHistoryPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ["points", page],
    queryFn: () => dashboardApi.getPoints({ page, limit: 10 }),
  });

  const pointData = data?.data?.data;
  const meta = data?.data?.meta;

  if (isLoading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-20" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Point History</h1>
        <p className="text-muted-foreground">
          Track your earned and used points
        </p>
      </div>

      <Card className="bg-linear-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-amber-500">
            <Gift className="size-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-amber-700">Available Balance</p>
            <p className="text-3xl font-bold text-amber-800">
              {(pointData?.totalPoints || 0).toLocaleString()} pts
            </p>
            <p className="text-xs text-amber-600">
              ≈{" "}
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(pointData?.totalPoints || 0)}
            </p>
          </div>
        </CardContent>
      </Card>

      {pointData?.points?.length === 0 ? (
        <EmptyState
          title="No point history"
          description="Points earned from referrals and activities will appear here."
        />
      ) : (
        <>
          <div className="space-y-2">
            {pointData?.points?.map(
              (pt: {
                id: string;
                amount: number;
                description: string;
                createdAt: string;
                expiresAt: string;
                isExpired: boolean;
              }) => (
                <Card key={pt.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-8 items-center justify-center rounded-full ${pt.amount > 0 ? "bg-emerald-100" : "bg-red-100"}`}
                        >
                          {pt.amount > 0 ? (
                            <TrendingUp className="size-4 text-emerald-600" />
                          ) : (
                            <TrendingDown className="size-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {pt.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(pt.createdAt)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Expires: {formatDate(pt.expiresAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold ${pt.amount > 0 ? "text-emerald-600" : "text-red-600"}`}
                        >
                          {pt.amount > 0 ? "+" : ""}
                          {pt.amount.toLocaleString()} pts
                        </p>
                        {pt.isExpired && (
                          <Badge variant="secondary" className="text-xs">
                            Expired
                          </Badge>
                        )}
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
