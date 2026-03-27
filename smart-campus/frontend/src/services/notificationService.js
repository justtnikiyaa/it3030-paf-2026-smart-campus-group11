import { mockNotifications } from "../data/mock";

const notificationService = {
  getMyNotifications: async () => mockNotifications,
  getUnreadCount: async () => mockNotifications.filter((n) => n.unread).length,
  markRead: async () => ({ ok: true }),
  markAllRead: async () => ({ ok: true })
};

export default notificationService;
