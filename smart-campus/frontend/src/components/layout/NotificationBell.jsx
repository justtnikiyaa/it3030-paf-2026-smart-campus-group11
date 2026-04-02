import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import NotificationPanel from "../notifications/NotificationPanel";
import notificationService from "../../services/notificationService";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const containerRef = useRef(null);

  const refreshUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch {
      // Keep old badge count if request fails.
    }
  };

  const loadNotifications = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await notificationService.getMyNotifications();
      setItems(data);
      setUnreadCount(data.filter((item) => item.unread).length);
      await refreshUnreadCount();
    } catch (err) {
      setError(err.message || "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const toggleOpen = async () => {
    if (!open) {
      setOpen(true);
      setSuccess("");
      await loadNotifications();
      return;
    }
    setOpen(false);
  };

  const onMarkRead = async (id) => {
    const target = items.find((item) => item.id === id);
    if (!target || !target.unread) return;

    setSuccess("");
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, unread: false } : item)));
    setUnreadCount((prev) => Math.max(prev - 1, 0));

    try {
      await notificationService.markRead(id);
    } catch (err) {
      setError(err.message || "Failed to mark as read.");
      await loadNotifications();
    }
  };

  const onDelete = async (id) => {
    const target = items.find((item) => item.id === id);
    if (!target) return;

    setError("");
    setSuccess("");

    try {
      await notificationService.deleteNotification(id);
      setItems((prev) => prev.filter((item) => item.id !== id));

      if (target.unread) {
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      }

      setSuccess("Notification deleted.");
      await refreshUnreadCount();
    } catch (err) {
      setError(err.message || "Failed to delete notification.");
    }
  };

  const onMarkAllRead = async () => {
    const hadUnread = items.some((item) => item.unread);
    if (!hadUnread) return;

    setSuccess("");
    setItems((prev) => prev.map((item) => ({ ...item, unread: false })));
    setUnreadCount(0);

    try {
      await notificationService.markAllRead();
      setSuccess("All notifications marked as read.");
    } catch (err) {
      setError(err.message || "Failed to mark all as read.");
      await loadNotifications();
    }
  };

  useEffect(() => {
    refreshUnreadCount();
  }, []);

  useEffect(() => {
    function onDocClick(event) {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", onDocClick);
    }

    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleOpen}
        className="relative h-8 w-8 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
      >
        <Bell className="h-3.5 w-3.5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex min-w-4 items-center justify-center rounded-full bg-blue-500 px-1 py-0.5 text-[10px] font-semibold text-white shadow-sm">
            {unreadCount}
          </span>
        )}
      </Button>

      <NotificationPanel
        open={open}
        loading={loading}
        error={error}
        success={success}
        notifications={items}
        unreadCount={unreadCount}
        onClose={() => setOpen(false)}
        onRetry={loadNotifications}
        onMarkAllRead={onMarkAllRead}
        onMarkRead={onMarkRead}
        onDelete={onDelete}
      />
    </div>
  );
}
