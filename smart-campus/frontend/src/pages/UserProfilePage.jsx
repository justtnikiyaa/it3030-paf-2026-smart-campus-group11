import useAuth from "../hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function UserProfilePage() {
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p><span className="font-semibold">Name:</span> {user?.name}</p>
        <p><span className="font-semibold">Email:</span> {user?.email}</p>
        <p><span className="font-semibold">Role:</span> {user?.role}</p>
      </CardContent>
    </Card>
  );
}
