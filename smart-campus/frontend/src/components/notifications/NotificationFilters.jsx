import { Button } from "../ui/button";

export default function NotificationFilters({ activeFilter, onFilterChange }) {
  const filters = ["All", "Unread", "System", "Academic"];

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Button
          key={filter}
          size="sm"
          variant={activeFilter === filter ? "default" : "secondary"}
          onClick={() => onFilterChange(filter)}
        >
          {filter}
        </Button>
      ))}
    </div>
  );
}
