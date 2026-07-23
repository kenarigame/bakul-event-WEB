import { NavLink, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Ticket,
  CreditCard,
  Star,
  User,
  Gift,
  Calendar,
  PlusCircle,
  Tag,
  Users,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { authApi } from "@/services/api.service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const customerNav = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/my-tickets", icon: Ticket, label: "My Tickets" },
  { href: "/transactions", icon: CreditCard, label: "Transactions" },
  { href: "/reviews", icon: Star, label: "Reviews" },
  { href: "/points", icon: Gift, label: "Point History" },
  { href: "/profile", icon: User, label: "Profile" },
];

const organizerNav = [
  { href: "/organizer/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/organizer/events", icon: Calendar, label: "My Events" },
  { href: "/organizer/events/create", icon: PlusCircle, label: "Create Event" },
  { href: "/organizer/transactions", icon: CreditCard, label: "Transactions" },
  { href: "/organizer/profile", icon: User, label: "Profile" },
];

const adminNav = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/events", icon: Calendar, label: "Events" },
  { href: "/admin/categories", icon: Tag, label: "Categories" },
  { href: "/admin/transactions", icon: CreditCard, label: "Transactions" },
];

interface AppSidebarProps {
  role: "CUSTOMER" | "ORGANIZER" | "ADMIN";
}

export function AppSidebar({ role }: AppSidebarProps) {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const navItems =
    role === "CUSTOMER"
      ? customerNav
      : role === "ORGANIZER"
        ? organizerNav
        : adminNav;

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      /* ignore */
    }
    clearAuth();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <NavLink to="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Calendar className="size-4" />
          </div>
          <span>Bakul Events</span>
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {role === "CUSTOMER"
              ? "Customer"
              : role === "ORGANIZER"
                ? "Organizer"
                : "Admin"}{" "}
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        "flex h-8 w-full items-center gap-3 rounded-md px-2 text-sm transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )
                    }
                  >
                    <item.icon className="size-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="size-8">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>
              {user?.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="text-destructive hover:text-destructive"
            >
              <LogOut className="size-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
