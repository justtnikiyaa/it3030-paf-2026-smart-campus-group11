import {
  Bell,
  LayoutDashboard,
  ShieldCheck,
  Settings,
  UserCircle
} from "lucide-react";

export const navByRole = {
  STUDENT: [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "Notifications", to: "/notifications", icon: Bell },
    { label: "Profile", to: "/dashboard", icon: UserCircle }
  ],
  ADMIN: [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "Admin", to: "/admin", icon: ShieldCheck },
    { label: "Notifications", to: "/notifications", icon: Bell },
    { label: "Settings", to: "/admin", icon: Settings }
  ]
};
