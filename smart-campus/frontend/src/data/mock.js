export const mockNotifications = [
  {
    id: "n1",
    title: "Lab timetable updated",
    message: "Software lab on Friday moved to 2:00 PM.",
    type: "Academic",
    timestamp: "5 min ago",
    unread: true
  },
  {
    id: "n2",
    title: "Tuition payment reminder",
    message: "Semester 2 fee due in 3 days.",
    type: "Finance",
    timestamp: "1 hour ago",
    unread: true
  },
  {
    id: "n3",
    title: "Campus network maintenance",
    message: "Wi-Fi downtime scheduled tonight from 11 PM to 1 AM.",
    type: "System",
    timestamp: "Yesterday",
    unread: false
  }
];

export const roleNavConfig = {
  STUDENT: [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Notifications", to: "/notifications" },
    { label: "Profile", to: "/profile" }
  ],
  ADMIN: [
    { label: "Admin Dashboard", to: "/admin" },
    { label: "Send Alerts", to: "/admin/notifications" },
    { label: "Notifications", to: "/notifications" }
  ]
};
