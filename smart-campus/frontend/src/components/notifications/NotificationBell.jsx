import React from "react";

export default function NotificationBell({ unreadCount = 0 }) {
  return <button type="button">Bell ({unreadCount})</button>;
}
