import { Star } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

export function CustomerReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Reviews</h1>
        <p className="text-muted-foreground">
          Reviews you've written for events you've attended
        </p>
      </div>
      <EmptyState
        icon={<Star className="size-8 text-muted-foreground" />}
        title="No reviews yet"
        description="After attending an event, you can leave a review. Your reviews will appear here."
        action={{
          label: "Browse Events",
          onClick: () => (window.location.href = "/events"),
        }}
      />
    </div>
  );
}
