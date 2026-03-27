import React from "react";
import NotificationList from "../components/notifications/NotificationList";
import NotificationFilters from "../components/notifications/NotificationFilters";

export default function NotificationCenterPage() {
  return (
    <main>
      <h1>Notifications</h1>
      <NotificationFilters />
      <NotificationList />
    </main>
  );
}
