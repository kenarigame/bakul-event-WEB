import { PublicLayout } from "@/layouts/PublicLayout";
import { Route, Routes } from "react-router-dom";
import { DashboardLayout } from "./layouts/DashboardLayout";

// Public pages
import { HomePage } from "./pages/public/HomePage";
import { EventsPage } from "./pages/public/EventsPage";
import { EventDetailPage } from "./pages/public/EventDetailPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";
import { NotFoundPage } from "@/pages/public/NotFoundPage";

// Customer pages
import { CustomerDashboardPage } from "@/pages/customer/DashboardPage";
import { MyTicketsPage } from "@/pages/customer/MyTicketsPage";
import { CustomerTransactionsPage } from "@/pages/customer/TransactionsPage";
import { CustomerReviewsPage } from "@/pages/customer/ReviewsPage";
import { CustomerProfilePage } from "@/pages/customer/ProfilePage";
import { PointHistoryPage } from "@/pages/customer/PointHistoryPage";
import { CheckoutPage } from "@/pages/customer/CheckoutPage";

// Organizer pages
import { OrganizerDashboardPage } from "@/pages/organizer/DashboardPage";
import { OrganizerEventsPage } from "@/pages/organizer/EventsPage";
import { CreateEventPage } from "@/pages/organizer/CreateEventPage";
import { EditEventPage } from "@/pages/organizer/EditEventPage";
import { VoucherManagementPage } from "@/pages/organizer/VoucherManagementPage";
import { OrganizerTransactionsPage } from "@/pages/organizer/TransactionsPage";
import { OrganizerProfilePage } from "@/pages/organizer/ProfilePage";

// Admin pages
import { AdminDashboardPage } from "@/pages/admin/DashboardPage";
import { AdminUsersPage } from "@/pages/admin/UsersPage";
import { AdminEventsPage } from "@/pages/admin/EventsPage";
import { AdminTransactionsPage } from "@/pages/admin/TransactionsPage";
import { AdminCategoriesPage } from "./pages/admin/CatagoriesPage";

export function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:slug" element={<EventDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Customer routes */}
      <Route element={<ProtectedRoute allowedRoles={["CUSTOMER"]} />}>
        <Route element={<DashboardLayout role="CUSTOMER" />}>
          <Route path="/dashboard" element={<CustomerDashboardPage />} />
          <Route path="/my-tickets" element={<MyTicketsPage />} />
          <Route path="/transactions" element={<CustomerTransactionsPage />} />
          <Route path="/reviews" element={<CustomerReviewsPage />} />
          <Route path="/profile" element={<CustomerProfilePage />} />
          <Route path="/points" element={<PointHistoryPage />} />
          <Route path="/checkout/:eventId" element={<CheckoutPage />} />
        </Route>
      </Route>

      {/* Organizer routes */}
      <Route element={<ProtectedRoute allowedRoles={["ORGANIZER"]} />}>
        <Route element={<DashboardLayout role="ORGANIZER" />}>
          <Route
            path="/organizer/dashboard"
            element={<OrganizerDashboardPage />}
          />
          <Route path="/organizer/events" element={<OrganizerEventsPage />} />
          <Route
            path="/organizer/events/create"
            element={<CreateEventPage />}
          />
          <Route
            path="/organizer/events/:id/edit"
            element={<EditEventPage />}
          />
          <Route
            path="/organizer/events/:id/vouchers"
            element={<VoucherManagementPage />}
          />
          <Route
            path="/organizer/transactions"
            element={<OrganizerTransactionsPage />}
          />
          <Route path="/organizer/profile" element={<OrganizerProfilePage />} />
        </Route>
      </Route>

      {/* Admin routes */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route element={<DashboardLayout role="ADMIN" />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/events" element={<AdminEventsPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route
            path="/admin/transactions"
            element={<AdminTransactionsPage />}
          />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
