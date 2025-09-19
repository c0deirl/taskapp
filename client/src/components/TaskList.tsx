import { useState } from "react";
import { Search, SortAsc, SortDesc, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskCard, type Task } from "./TaskCard";
import { Card, CardContent } from "@/components/ui/card";

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onCreateTask?: (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  currentFilter: string;
}

type SortOption = "dueDate" | "priority" | "createdAt" | "title";
type SortDirection = "asc" | "desc";

export function TaskList({ tasks, onToggleTask, onEditTask, onDeleteTask, onCreateTask, currentFilter }: TaskListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [quickAddTitle, setQuickAddTitle] = useState("");

  // Filter tasks based on current filter
  const getFilteredTasks = () => {
    let filtered = tasks;

    // Apply current filter
    switch (currentFilter) {
      case "pending":
        filtered = tasks.filter((task) => !task.completed);
        break;
      case "completed":
        filtered = tasks.filter((task) => task.completed);
        break;
      case "high-priority":
        filtered = tasks.filter((task) => task.priority === "high" && !task.completed);
        break;
      default:
        filtered = tasks;
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  // Sort tasks
  const sortedTasks = getFilteredTasks().sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortBy) {
      case "title":
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
        break;
      case "dueDate":
        aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        break;
      case "createdAt":
      default:
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const handleQuickAdd = () => {
    if (!quickAddTitle.trim() || !onCreateTask) return;
    
    onCreateTask({
      title: quickAddTitle.trim(),
      priority: "medium",
    });
    
    setQuickAddTitle("");
  };

  const handleQuickAddKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleQuickAdd();
    }
  };

  return (
    <div className="space-y-4" data-testid="task-list">
      {/* Quick Add Task */}
      {onCreateTask && (
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Quick add task... (Press Enter to save)"
                  value={quickAddTitle}
                  onChange={(e) => setQuickAddTitle(e.target.value)}
                  onKeyDown={handleQuickAddKeyDown}
                  className="pr-10"
                  data-testid="input-quick-add-task"
                />
              </div>
              <Button 
                onClick={handleQuickAdd}
                disabled={!quickAddTitle.trim()}
                size="icon"
                data-testid="button-quick-add-task"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-tasks"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-32" data-testid="select-sort-by">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Created</SelectItem>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="icon"
                onClick={toggleSortDirection}
                data-testid="button-sort-direction"
              >
                {sortDirection === "asc" ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Results */}
      <div className="space-y-3">
        {sortedTasks.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">
                {searchQuery.trim() ? (
                  <div>
                    <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No tasks found matching "<strong>{searchQuery}</strong>"</p>
                  </div>
                ) : (
                  <div>
                    <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No tasks in this category</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="text-sm text-muted-foreground mb-2">
              {sortedTasks.length} task{sortedTasks.length === 1 ? "" : "s"}
            </div>
            {sortedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={onToggleTask}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}