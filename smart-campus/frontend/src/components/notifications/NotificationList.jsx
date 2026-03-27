import React from "react";
import NotificationItem from "./NotificationItem";

export default function NotificationList({ items = [] }) {
  if (items.length === 0) return <p>No notifications yet.</p>;
  return (
    <section>
      {items.map((item) => (
        <NotificationItem key={item.id} item={item} />
      ))}
    </section>
  );
}
