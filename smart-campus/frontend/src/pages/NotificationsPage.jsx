import AppLayout from "../components/layout/AppLayout";
import { notifications } from "../data/notifications";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function NotificationsPage() {
  return (
    <AppLayout title="Notifications">
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifications.map((item) => (
            <article key={item.id} className="rounded-lg border p-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{item.message}</p>
            </article>
          ))}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
