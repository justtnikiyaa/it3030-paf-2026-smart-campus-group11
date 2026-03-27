import { useMemo, useState } from "react";
import { mockNotifications } from "../data/mock";
import NotificationFilters from "../components/notifications/NotificationFilters";
import NotificationList from "../components/notifications/NotificationList";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function NotificationCenterPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredItems = useMemo(() => {
    if (activeFilter === "All") return mockNotifications;
    if (activeFilter === "Unread") return mockNotifications.filter((item) => item.unread);
    return mockNotifications.filter((item) => item.type === activeFilter);
  }, [activeFilter]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification center</CardTitle>
      </CardHeader>
      <CardContent>
        <NotificationFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        <NotificationList items={filteredItems} />
      </CardContent>
    </Card>
  );
}
