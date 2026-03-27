import { useMemo, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import NotificationPanel from "./NotificationPanel";
import { mockNotifications } from "../../data/mock";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const unreadCount = useMemo(() => mockNotifications.filter((item) => item.unread).length, []);

  return (
    <div className="relative">
      <Button size="icon" variant="secondary" onClick={() => setOpen((prev) => !prev)}>
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </Button>
      <NotificationPanel open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
