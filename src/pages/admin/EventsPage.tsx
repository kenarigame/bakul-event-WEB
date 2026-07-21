import { Calendar } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

export function AdminEventsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Events</h1>
        <p className="text-muted-foreground">Manage all platform events</p>
      </div>
      <EmptyState
        icon={<Calendar className="size-8 text-muted-foreground" />}
        title="Events management"
        description="Full events management with approve, feature, and status control."
      />
    </div>
  );
}
