import { Badge } from "@/components/ui/badge";

type TransactionStatus =
  | "PENDING_PAYMENT"
  | "WAITING_CONFIRMATION"
  | "CONFIRMED"
  | "REJECTED"
  | "CANCELLED"
  | "EXPIRED"
  | "COMPLETED";

const statusConfig: Record<
  TransactionStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    className: string;
  }
> = {
  PENDING_PAYMENT: {
    label: "Pending Payment",
    variant: "outline",
    className: "border-amber-500 text-amber-600 bg-amber-50",
  },
  WAITING_CONFIRMATION: {
    label: "Waiting Confirmation",
    variant: "outline",
    className: "border-blue-500 text-blue-600 bg-blue-50",
  },
  CONFIRMED: {
    label: "Confirmed",
    variant: "outline",
    className: "border-emerald-500 text-emerald-600 bg-emerald-50",
  },
  REJECTED: { label: "Rejected", variant: "destructive", className: "" },
  CANCELLED: { label: "Cancelled", variant: "secondary", className: "" },
  EXPIRED: { label: "Expired", variant: "secondary", className: "" },
  COMPLETED: {
    label: "Completed",
    variant: "default",
    className: "bg-emerald-600 hover:bg-emerald-700",
  },
};

export function TransactionStatusBadge({
  status,
}: {
  status: TransactionStatus;
}) {
  const config = statusConfig[status] || {
    label: status,
    variant: "outline",
    className: "",
  };
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}
