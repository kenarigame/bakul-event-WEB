import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { TransactionStatusBadge } from "@/components/common/TransactionStatusBadge";
import { Pagination } from "@/components/common/Pagination";
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
import { transactionsApi } from "@/services/api.service";
import { formatIDR, formatDateTime } from "@/lib/utils";
import { toast } from "sonner";

type OrgTx = {
  id: string;
  user: { name: string; email: string };
  event: { name: string };
  details: Array<{ quantity: number }>;
  total: number;
  status: string;
  createdAt: string;
  paymentProofs?: Array<{ imageUrl: string }>;
};

export function OrganizerTransactionsPage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["organizer-transactions", page],
    queryFn: () =>
      transactionsApi.getOrganizerTransactions({ page, limit: 10 }),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => transactionsApi.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizer-transactions"] });
      toast.success("Payment approved!");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) =>
      transactionsApi.reject(id, "Payment rejected by organizer"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizer-transactions"] });
      toast.success("Payment rejected");
    },
  });

  const transactions = (data?.data?.data || []) as unknown as OrgTx[];
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
          Booking Management
        </h1>
        <p className="text-muted-foreground">
          Review and manage payment confirmations
        </p>
      </div>

      {transactions.length === 0 ? (
        <EmptyState
          title="No bookings yet"
          description="Bookings for your events will appear here."
        />
      ) : (
        <>
          <div className="space-y-3">
            {transactions.map((tx: OrgTx) => (
              <Card key={tx.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">{tx.user?.name}</p>
                        <TransactionStatusBadge
                          status={
                            tx.status as Parameters<
                              typeof TransactionStatusBadge
                            >[0]["status"]
                          }
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {tx.event?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(tx.createdAt)} ·{" "}
                        {tx.details?.reduce(
                          (s: number, d: { quantity: number }) =>
                            s + d.quantity,
                          0,
                        )}{" "}
                        ticket(s)
                      </p>
                      {tx.paymentProofs?.[0] && (
                        <a
                          href={tx.paymentProofs[0].imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                        >
                          <Eye className="size-3" />
                          View payment proof
                        </a>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <p className="font-semibold">{formatIDR(tx.total)}</p>
                      {tx.status === "WAITING_CONFIRMATION" && (
                        <div className="flex gap-1">
                          <AlertDialog>
                            <AlertDialogTrigger>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-emerald-600 border-emerald-600 hover:bg-emerald-50"
                              >
                                <CheckCircle className="mr-1 size-3" />
                                Approve
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Approve Payment
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Confirm payment from {tx.user?.name} for{" "}
                                  {formatIDR(tx.total)}?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => approveMutation.mutate(tx.id)}
                                >
                                  Approve
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-destructive border-destructive hover:bg-destructive/10"
                            onClick={() => rejectMutation.mutate(tx.id)}
                          >
                            <XCircle className="mr-1 size-3" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
