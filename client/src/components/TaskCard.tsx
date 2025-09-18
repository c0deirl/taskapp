import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Edit, Trash2, Bell } from "lucide-react";
import { PriorityBadge, type Priority } from "./PriorityBadge";
import { format } from "date-fns";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: Date;
  reminderDate?: Date;
  completed: boolean;
  createdAt: Date;
}

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const isOverdue = task.dueDate && task.dueDate < new Date() && !task.completed;
  const isUpcoming = task.reminderDate && task.reminderDate <= new Date() && !task.completed;
  
  return (
    <Card
      className={`transition-all hover-elevate ${
        task.completed ? "opacity-75" : ""
      } ${isOverdue ? "border-red-500/50" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`task-card-${task.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggle(task.id)}
            className="mt-1"
            data-testid={`checkbox-task-${task.id}`}
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={`font-medium text-sm leading-5 ${
                  task.completed ? "line-through text-muted-foreground" : ""
                }`}
                data-testid={`text-task-title-${task.id}`}
              >
                {task.title}
              </h3>
              
              <div className={`flex items-center gap-1 transition-opacity ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onEdit(task)}
                  data-testid={`button-edit-${task.id}`}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-600"
                  onClick={() => onDelete(task.id)}
                  data-testid={`button-delete-${task.id}`}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            {task.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
            
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <PriorityBadge priority={task.priority} />
              
              {task.dueDate && (
                <Badge
                  variant={isOverdue ? "destructive" : "outline"}
                  className="text-xs"
                  data-testid={`badge-due-date-${task.id}`}
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  Due {format(task.dueDate, "MMM d")}
                </Badge>
              )}
              
              {task.reminderDate && (
                <Badge
                  variant={isUpcoming ? "secondary" : "outline"}
                  className="text-xs"
                  data-testid={`badge-reminder-${task.id}`}
                >
                  <Bell className="h-3 w-3 mr-1" />
                  {format(task.reminderDate, "MMM d, h:mm a")}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}