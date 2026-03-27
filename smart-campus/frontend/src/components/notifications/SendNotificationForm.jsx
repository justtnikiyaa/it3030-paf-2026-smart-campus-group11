import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";

export default function SendNotificationForm() {
  const [form, setForm] = useState({ title: "", message: "", audience: "All Users" });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Send campus alert</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Notification title"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
        />
        <textarea
          className="min-h-[120px] w-full rounded-xl border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Write your alert message"
          value={form.message}
          onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
        />
        <Input
          placeholder="Audience (All Users, Students, Staff)"
          value={form.audience}
          onChange={(e) => setForm((p) => ({ ...p, audience: e.target.value }))}
        />
        <Button className="w-full">Send Notification</Button>
      </CardContent>
    </Card>
  );
}
