import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function AdminDashboardPage() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Manage campus alerts, monitor unread trends, and dispatch critical updates quickly.
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Operational quick stats</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
          <div className="rounded-lg border p-3">Alerts sent today: 12</div>
          <div className="rounded-lg border p-3">Unread critical: 34</div>
          <div className="rounded-lg border p-3">Delivery success: 99.1%</div>
        </CardContent>
      </Card>
    </>
  );
}
