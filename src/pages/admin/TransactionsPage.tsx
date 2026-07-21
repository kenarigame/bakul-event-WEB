import { CreditCard } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

export function AdminTransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">
          Monitor all platform transactions
        </p>
      </div>
      <EmptyState
        icon={<CreditCard className="size-8 text-muted-foreground" />}
        title="Transaction monitoring"
        description="Complete transaction oversight with filters, exports, and status management."
      />
    </div>
  );
}
