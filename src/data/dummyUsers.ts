import type { User } from "@/services/api.service";

export const dummyUsers: (User & { password: string })[] = [
  {
    id: "1",
    name: "John Customer",
    email: "customer@mail.com",
    password: "123456",
    role: "CUSTOMER",
    referralCode: "CUS001",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    name: "Event Organizer",
    email: "organizer@mail.com",
    password: "123456",
    role: "ORGANIZER",
    referralCode: "ORG001",
    avatar: "https://i.pravatar.cc/150?img=2",
    organizer: {
      id: "org-1",
      userId: "2",
      name: "Eventify Organizer",
      description: "Organizer for concerts and seminars.",
      logo: "https://placehold.co/200x200",
      banner: "https://placehold.co/1200x400",
      website: "https://eventify.com",
      instagram: "@eventify",
      city: "Jakarta",
    },
  },
  {
    id: "3",
    name: "Super Admin",
    email: "admin@mail.com",
    password: "123456",
    role: "ADMIN",
    referralCode: "ADM001",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
];
