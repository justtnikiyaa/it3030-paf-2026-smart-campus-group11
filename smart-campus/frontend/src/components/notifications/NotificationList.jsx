import NotificationItem from "./NotificationItem";

export default function NotificationList({ items }) {
  if (!items.length) {
    return <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">No notifications yet.</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <NotificationItem key={item.id} item={item} />
      ))}
    </div>
  );
}
