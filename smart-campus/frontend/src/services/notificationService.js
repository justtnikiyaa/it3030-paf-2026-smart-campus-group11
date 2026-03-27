const notificationService = {
  getMyNotifications: () => Promise.resolve([]),
  getUnreadCount: () => Promise.resolve(0),
  markRead: () => Promise.resolve(null),
  markAllRead: () => Promise.resolve(null),
  send: () => Promise.resolve(null),
};

export default notificationService;
