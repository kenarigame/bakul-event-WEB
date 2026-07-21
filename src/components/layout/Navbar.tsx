import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Menu,
  Search,
  User,
  LogOut,
  LayoutDashboard,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth.store";
import { authApi } from "@/services/api.service";
import { toast } from "sonner";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
];

export function Navbar() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const navigate = useNavigate();

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

  const getDashboardPath = () => {
    if (user?.role === "ORGANIZER") return "/organizer/dashboard";
    if (user?.role === "ADMIN") return "/admin/dashboard";
    return "/dashboard";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur ">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Calendar className="size-4" />
          </div>
          <span>Bakul Events</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Link to="/events">
              <Search className="size-4" />
            </Link>
          </Button>

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant="ghost"
                  className="relative size-9 rounded-full"
                >
                  <Avatar className="size-9">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to={getDashboardPath()}>
                    <LayoutDashboard className="mr-2 size-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                {user.role === "CUSTOMER" && (
                  <DropdownMenuItem>
                    <Link to="/my-tickets">
                      <Ticket className="mr-2 size-4" />
                      My Tickets
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Link
                    to={
                      user.role === "ORGANIZER"
                        ? "/organizer/profile"
                        : "/profile"
                    }
                  >
                    <User className="mr-2 size-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive"
                >
                  <LogOut className="mr-2 size-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm">
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-lg font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <div className="flex flex-col gap-2 mt-4">
                    <Button variant="outline">
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button>
                      <Link to="/register">Get Started</Link>
                    </Button>
                  </div>
                )}
                {isAuthenticated && (
                  <div className="flex flex-col gap-2 mt-4">
                    <Button variant="outline">
                      <Link to={getDashboardPath()}>Dashboard</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="text-destructive justify-start"
                    >
                      <LogOut className="mr-2 size-4" />
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
