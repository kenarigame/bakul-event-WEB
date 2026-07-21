import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import api from "@/lib/api";

export function AdminUsersPage() {
  useQuery({
    queryKey: ["admin-users"],
    queryFn: () => api.get("/admin/users"),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">Manage platform users</p>
      </div>
      <EmptyState
        icon={<Users className="size-8 text-muted-foreground" />}
        title="Users list coming soon"
        description="User management features including search, filter, and role management."
      />
    </div>
  );
}
