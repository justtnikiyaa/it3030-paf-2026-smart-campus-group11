import {
  Bell,
  LayoutDashboard,
  ShieldCheck,
  Settings,
  UserCircle,
  Ticket,
  Calendar
} from "lucide-react";

export const navByRole = {
  USER: [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "Tickets", to: "/tickets", icon: Ticket },
    { label: "Bookings", to: "/bookings", icon: Calendar },
    { label: "Notifications", to: "/notifications", icon: Bell },
    { label: "Settings", to: "/settings/notifications", icon: Settings },
    { label: "Profile", to: "/dashboard", icon: UserCircle }
  ],
  ADMIN: [
    { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
    { label: "Tickets", to: "/tickets", icon: Ticket },
    { label: "Manage Bookings", to: "/admin/bookings", icon: ShieldCheck },
    { label: "Admin", to: "/admin", icon: ShieldCheck },
    { label: "Notifications", to: "/admin/notifications", icon: Bell },
    { label: "Settings", to: "/settings/notifications", icon: Settings }
  ],
  TECHNICIAN: [
    { label: "Dashboard", to: "/technician", icon: LayoutDashboard },
    { label: "Tickets", to: "/tickets", icon: Ticket },
    { label: "Notifications", to: "/notifications", icon: Bell },
    { label: "Settings", to: "/settings/notifications", icon: Settings }
  ]
};
