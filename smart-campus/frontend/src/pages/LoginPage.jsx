import { GraduationCap, Sparkles } from "lucide-react";
import LoginButton from "../components/auth/LoginButton";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import useAuth from "../hooks/useAuth";

export default function LoginPage() {
  const { loginWithRole } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-glow p-4">
      <Card className="w-full max-w-lg shadow-premium">
        <CardHeader>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-3xl">Smart Campus Operations Hub</CardTitle>
          <CardDescription className="mt-1 text-sm">
            Secure sign-in for notifications, dashboard access, and role-based campus operations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LoginButton onClick={() => loginWithRole("STUDENT")} />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button variant="secondary" className="gap-2" onClick={() => loginWithRole("STUDENT")}>
              <Sparkles className="h-4 w-4" />
              Demo as Student
            </Button>
            <Button variant="outline" onClick={() => loginWithRole("ADMIN")}>Demo as Admin</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
