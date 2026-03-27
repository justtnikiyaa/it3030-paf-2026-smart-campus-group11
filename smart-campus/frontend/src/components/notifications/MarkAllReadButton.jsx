import { CheckCheck } from "lucide-react";
import { Button } from "../ui/button";

export default function MarkAllReadButton({ onClick }) {
  return (
    <Button size="sm" variant="ghost" className="gap-2" onClick={onClick}>
      <CheckCheck className="h-4 w-4" />
      Mark all read
    </Button>
  );
}
