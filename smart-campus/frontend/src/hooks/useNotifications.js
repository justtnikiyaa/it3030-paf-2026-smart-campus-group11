import { useMemo } from "react";
import { mockNotifications } from "../data/mock";

export default function useNotifications() {
  return useMemo(
    () => ({
      items: mockNotifications,
      unreadCount: mockNotifications.filter((item) => item.unread).length
    }),
    []
  );
}
