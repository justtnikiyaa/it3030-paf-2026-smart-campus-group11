import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";

export default function NotificationItem({ item }) {
  return (
    <article className={cn("rounded-lg border p-3 transition hover:bg-secondary", item.unread && "border-l-4 border-l-primary")}>
      <div className="mb-1 flex items-start justify-between gap-3">
        <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
        {item.unread && <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />}
      </div>
      <p className="mb-2 text-sm text-muted-foreground">{item.message}</p>
      <div className="flex items-center justify-between text-xs">
        <Badge variant="muted">{item.type}</Badge>
        <span className="font-mono text-muted-foreground">{item.timestamp}</span>
      </div>
    </article>
  );
}
