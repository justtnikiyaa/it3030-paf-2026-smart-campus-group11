import { LockKeyhole, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import useAuth from "../hooks/useAuth";

export default function LoginPage() {
  const { loginAs } = useAuth();
  const navigate = useNavigate();

  const loginAndGo = (role) => {
    loginAs(role);
    navigate(role === "ADMIN" ? "/admin" : "/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-glow p-4">
      <Card className="w-full max-w-md shadow-premium">
        <CardHeader>
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
            <LockKeyhole className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-2xl">Smart Campus Hub</CardTitle>
          <CardDescription>Sign in to continue to your operations dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full" onClick={() => loginAndGo("STUDENT")}>Continue with Google</Button>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button variant="secondary" className="gap-2" onClick={() => loginAndGo("STUDENT")}>
              <Sparkles className="h-4 w-4" />
              Demo Student
            </Button>
            <Button variant="outline" onClick={() => loginAndGo("ADMIN")}>Demo Admin</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
