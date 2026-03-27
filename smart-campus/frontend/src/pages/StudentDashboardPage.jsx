import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import NotificationList from "../components/notifications/NotificationList";
import { mockNotifications } from "../data/mock";

export default function StudentDashboardPage() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Student Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Track announcements, deadlines, and campus updates from one place.
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationList items={mockNotifications.slice(0, 2)} />
        </CardContent>
      </Card>
    </>
  );
}
