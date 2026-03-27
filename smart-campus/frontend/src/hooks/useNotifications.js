import { useMemo } from "react";

export default function useNotifications() {
  return useMemo(() => ({ items: [], unreadCount: 0 }), []);
}
