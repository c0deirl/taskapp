import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Circle, ArrowUp } from "lucide-react";

type Priority = "low" | "medium" | "high";

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

const priorityConfig = {
  low: {
    label: "Low",
    icon: Circle,
    className: "border-blue-500 text-blue-500",
  },
  medium: {
    label: "Medium",
    icon: ArrowUp,
    className: "border-yellow-500 text-yellow-500",
  },
  high: {
    label: "High",
    icon: AlertTriangle,
    className: "border-red-500 text-red-500",
  },
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  const Icon = config.icon;
  
  return (
    <Badge
      variant="outline"
      className={`${config.className} ${className || ""}`}
      data-testid={`badge-priority-${priority}`}
    >
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
}

export type { Priority };