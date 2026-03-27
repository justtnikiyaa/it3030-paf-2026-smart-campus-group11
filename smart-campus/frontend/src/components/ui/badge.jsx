import { cn } from "../../lib/utils";

export function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "bg-accent text-accent-foreground",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    muted: "bg-secondary text-muted-foreground"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    />
  );
}
