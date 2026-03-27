import { ShieldAlert } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function SessionExpiredModal({ open, onRelogin }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <CardTitle>Session expired</CardTitle>
          <CardDescription>Your login session ended. Sign in again to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={onRelogin}>
            Sign in again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
