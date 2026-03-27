import React from "react";

export default function NotificationItem({ item }) {
  return (
    <article>
      <h3>{item.title}</h3>
      <p>{item.message}</p>
    </article>
  );
}
