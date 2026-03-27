import { Chrome } from "lucide-react";
import { Button } from "../ui/button";

export default function LoginButton({ onClick }) {
  return (
    <Button className="w-full gap-2" onClick={onClick}>
      <Chrome className="h-4 w-4" />
      Continue with Google
    </Button>
  );
}
