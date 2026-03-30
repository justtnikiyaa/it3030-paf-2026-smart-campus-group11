import AppLayout from "../components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function DashboardPage() {
  return (
    <AppLayout title="Dashboard">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-base">Today Alerts</CardTitle></CardHeader>
          <CardContent className="text-2xl font-semibold">12</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Unread Notices</CardTitle></CardHeader>
          <CardContent className="text-2xl font-semibold">34</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Delivery Rate</CardTitle></CardHeader>
          <CardContent className="text-2xl font-semibold">99.1%</CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
