import AppLayout from "../components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function AdminPage() {
  return (
    <AppLayout title="Admin">
      <Card>
        <CardHeader>
          <CardTitle>Admin Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">Manage operations, send notifications, and monitor system-level updates.</p>
          <Button>Send Campus Alert</Button>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
