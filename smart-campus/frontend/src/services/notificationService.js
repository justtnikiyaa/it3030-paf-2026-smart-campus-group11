import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || `${window.location.protocol}//${window.location.hostname}:8080`;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

function toFriendlyError(error) {
  if (error?.response?.status === 401) return "Please sign in again.";
  return error?.response?.data?.message || error?.message || "Request failed";
}

function formatRelativeTime(value) {
  if (!value) return "Just now";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

function toUiNotification(item) {
  return {
    id: item.id,
    title: item.title,
    message: item.message,
    type: item.type,
    unread: Boolean(item.unread),
    createdAt: item.createdAt,
    time: formatRelativeTime(item.createdAt)
  };
}

const notificationService = {
  getMyNotifications: async () => {
    try {
      const { data } = await api.get("/api/notifications/my");
      return (data || []).map(toUiNotification);
    } catch (error) {
      throw new Error(toFriendlyError(error));
    }
  },

  getUnreadCount: async () => {
    try {
      const { data } = await api.get("/api/notifications/my/unread-count");
      return Number(data?.unreadCount || 0);
    } catch (error) {
      throw new Error(toFriendlyError(error));
    }
  },

  markRead: async (id) => {
    try {
      const { data } = await api.patch(`/api/notifications/${id}/read`);
      return toUiNotification(data);
    } catch (error) {
      throw new Error(toFriendlyError(error));
    }
  },

  markAllRead: async () => {
    try {
      await api.patch("/api/notifications/my/read-all");
      return { ok: true };
    } catch (error) {
      throw new Error(toFriendlyError(error));
    }
  },

  deleteNotification: async (id) => {
    try {
      await api.delete(`/api/notifications/${id}`);
      return { ok: true };
    } catch (error) {
      throw new Error(toFriendlyError(error));
    }
  }
};

export default notificationService;
