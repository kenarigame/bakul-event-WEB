import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { TransactionStatusBadge } from "@/components/common/TransactionStatusBadge";
import { Pagination } from "@/components/common/Pagination";
import { transactionsApi } from "@/services/api.service";
import { formatIDR, formatDateTime } from "@/lib/utils";

export function CustomerTransactionsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ["transactions", "my", page],
    queryFn: () => transactionsApi.getMyTransactions({ page, limit: 10 }),
  });

  const transactions = data?.data?.data || [];
  const meta = data?.data?.meta;

  if (isLoading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Transaction History
        </h1>
        <p className="text-muted-foreground">All your booking transactions</p>
      </div>

      {transactions.length === 0 ? (
        <EmptyState
          title="No transactions"
          description="Your booking history will appear here."
        />
      ) : (
        <>
          <div className="space-y-3">
            {transactions.map(
              (tx: {
                id: string;
                event: { id: string; name: string };
                details: Array<{ quantity: number }>;
                total: number;
                status: string;
                createdAt: string;
              }) => (
                <Card key={tx.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{tx.event?.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDateTime(tx.createdAt)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tx.details?.reduce(
                            (s: number, d: { quantity: number }) =>
                              s + d.quantity,
                            0,
                          )}{" "}
                          ticket(s)
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <p className="font-semibold">{formatIDR(tx.total)}</p>
                          <TransactionStatusBadge
                            status={
                              tx.status as Parameters<
                                typeof TransactionStatusBadge
                              >[0]["status"]
                            }
                          />
                        </div>
                        <Button variant="ghost" size="icon-sm">
                          <Link to={`/transactions/${tx.id}`}>
                            <Eye className="size-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ),
            )}
          </div>
          {meta && meta.totalPages > 1 && (
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
