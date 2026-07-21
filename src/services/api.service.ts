import api from '../lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ORGANIZER' | 'ADMIN';
  avatar?: string;
  referralCode: string;
  organizer?: Organizer;
}

export interface Organizer {
  id: string;
  userId: string;
  name: string;
  description?: string;
  logo?: string;
  banner?: string;
  website?: string;
  instagram?: string;
  city?: string;
}

export interface Event {
  id: string;
  slug: string;
  name: string;
  description: string;
  thumbnail?: string;
  banner?: string;
  venue: string;
  address: string;
  city: string;
  province?: string;
  googleMapsUrl?: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  capacity: number;
  availableSeats: number;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  isFeatured: boolean;
  category: Category;
  organizer: Organizer;
  tickets: Ticket[];
  vouchers?: Voucher[];
  reviews?: Review[];
  _count?: { reviews: number };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
}

export interface Ticket {
  id: string;
  name: string;
  description?: string;
  type: 'FREE' | 'PAID';
  price: number;
  quantity: number;
  available: number;
  maxPerOrder: number;
}

export interface Voucher {
  id: string;
  code: string;
  discount: number;
  isPercent: boolean;
  maxUses: number;
  usedCount: number;
  minPurchase?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
}

export interface Transaction {
  id: string;
  status: 'PENDING_PAYMENT' | 'WAITING_CONFIRMATION' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED' | 'EXPIRED' | 'COMPLETED';
  subtotal: number;
  voucherDiscount: number;
  pointsDiscount: number;
  total: number;
  paymentDeadline: string;
  event: Event;
  details: TransactionDetail[];
  paymentProofs?: PaymentProof[];
  createdAt: string;
}

export interface TransactionDetail {
  id: string;
  quantity: number;
  price: number;
  subtotal: number;
  ticket: Ticket;
}

export interface PaymentProof {
  id: string;
  imageUrl: string;
  uploadedAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  images?: string[];
  user: { id: string; name: string; avatar?: string };
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: { page: number; limit: number; total: number; totalPages: number };
}

// Auth
export const authApi = {
  register: (data: { name: string; email: string; password: string; role: string; referralCode?: string }) =>
    api.post<ApiResponse<User>>('/auth/register', data),
  login: (email: string, password: string) =>
    api.post<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>>('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => api.post('/auth/reset-password', { token, password }),
  getProfile: () => api.get<ApiResponse<User>>('/auth/profile'),
};

// Events
export const eventsApi = {
  getAll: (params?: Record<string, unknown>) => api.get<ApiResponse<Event[]>>('/events', { params }),
  getFeatured: () => api.get<ApiResponse<Event[]>>('/events/featured'),
  getUpcoming: () => api.get<ApiResponse<Event[]>>('/events/upcoming'),
  getCategories: () => api.get<ApiResponse<Category[]>>('/events/categories'),
  getBySlug: (slug: string) => api.get<ApiResponse<Event>>(`/events/${slug}`),
  getMyEvents: (params?: Record<string, unknown>) => api.get<ApiResponse<Event[]>>('/events/my-events', { params }),
  create: (data: unknown) => api.post<ApiResponse<Event>>('/events', data),
  update: (id: string, data: unknown) => api.put<ApiResponse<Event>>(`/events/${id}`, data),
  publish: (id: string) => api.patch<ApiResponse<Event>>(`/events/${id}/publish`),
  delete: (id: string) => api.delete(`/events/${id}`),
};

// Transactions
export const transactionsApi = {
  checkout: (data: unknown) => api.post<ApiResponse<Transaction>>('/transactions/checkout', data),
  getMyTransactions: (params?: Record<string, unknown>) => api.get<ApiResponse<Transaction[]>>('/transactions/my', { params }),
  getOrganizerTransactions: (params?: Record<string, unknown>) => api.get<ApiResponse<Transaction[]>>('/transactions/organizer', { params }),
  getById: (id: string) => api.get<ApiResponse<Transaction>>(`/transactions/${id}`),
  uploadPaymentProof: (id: string, imageUrl: string) => api.post(`/transactions/${id}/payment-proof`, { imageUrl }),
  approve: (id: string) => api.patch(`/transactions/${id}/approve`),
  reject: (id: string, notes: string) => api.patch(`/transactions/${id}/reject`, { notes }),
  cancel: (id: string) => api.patch(`/transactions/${id}/cancel`),
};

// Reviews
export const reviewsApi = {
  getByEvent: (eventId: string, params?: Record<string, unknown>) => api.get<ApiResponse<{ reviews: Review[]; averageRating: number }>>(`/reviews/event/${eventId}`, { params }),
  create: (eventId: string, data: unknown) => api.post(`/reviews/event/${eventId}`, data),
  update: (id: string, data: unknown) => api.put(`/reviews/${id}`, data),
  delete: (id: string) => api.delete(`/reviews/${id}`),
};

// Vouchers
export const vouchersApi = {
  create: (eventId: string, data: unknown) => api.post(`/vouchers/event/${eventId}`, data),
  getByEvent: (eventId: string) => api.get(`/vouchers/event/${eventId}`),
  delete: (id: string) => api.delete(`/vouchers/${id}`),
  validate: (eventId: string, code: string) => api.get(`/vouchers/validate/${eventId}/${code}`),
};

// Dashboard
export const dashboardApi = {
  getCustomer: () => api.get('/dashboard/customer'),
  getOrganizer: () => api.get('/dashboard/organizer'),
  getAdmin: () => api.get('/dashboard/admin'),
  getPoints: (params?: Record<string, unknown>) => api.get('/dashboard/points', { params }),
};
