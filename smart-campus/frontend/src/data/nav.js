import {
  Bell,
  LayoutDashboard,
  ShieldCheck,
  Settings,
  UserCircle
} from "lucide-react";

export const navByRole = {
  USER: [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "Notifications", to: "/notifications", icon: Bell },
    { label: "Settings", to: "/settings/notifications", icon: Settings },
    { label: "Profile", to: "/dashboard", icon: UserCircle }
  ],
  ADMIN: [
    { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
    { label: "Admin", to: "/admin", icon: ShieldCheck },
    { label: "Notifications", to: "/admin/notifications", icon: Bell },
    { label: "Settings", to: "/settings/notifications", icon: Settings }
  ]
};
