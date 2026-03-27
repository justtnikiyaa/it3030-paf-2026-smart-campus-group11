import { Bell, X } from "lucide-react";
import { mockNotifications } from "../../data/mock";
import NotificationList from "./NotificationList";
import MarkAllReadButton from "./MarkAllReadButton";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export default function NotificationPanel({ open, onClose }) {
  if (!open) return null;

  const unreadCount = mockNotifications.filter((item) => item.unread).length;

  return (
    <div className="absolute right-0 top-14 z-40 w-[360px] max-w-[92vw] rounded-xl border bg-card shadow-premium">
      <header className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">Notifications</h3>
          <Badge>{unreadCount} unread</Badge>
        </div>
        <Button size="icon" variant="ghost" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </header>
      <div className="space-y-3 p-4">
        <div className="flex justify-end">
          <MarkAllReadButton onClick={() => {}} />
        </div>
        <NotificationList items={mockNotifications} />
      </div>
    </div>
  );
}
