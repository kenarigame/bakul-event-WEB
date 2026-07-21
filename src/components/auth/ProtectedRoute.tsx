import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    const roleRedirects: Record<string, string> = {
      CUSTOMER: "/dashboard",
      ORGANIZER: "/organizer/dashboard",
      ADMIN: "/admin/dashboard",
    };
    return <Navigate to={roleRedirects[user.role] || "/"} replace />;
  }

  return <Outlet />;
}
