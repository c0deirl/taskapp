import { CheckSquare, Settings, Plus, Filter, Archive, Bell } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  taskCounts: {
    all: number;
    pending: number;
    completed: number;
    high: number;
  };
}

const navigationItems = [
  {
    title: "All Tasks",
    key: "all",
    icon: CheckSquare,
    count: "all" as keyof AppSidebarProps["taskCounts"],
  },
  {
    title: "Pending",
    key: "pending",
    icon: Filter,
    count: "pending" as keyof AppSidebarProps["taskCounts"],
  },
  {
    title: "High Priority",
    key: "high-priority",
    icon: Bell,
    count: "high" as keyof AppSidebarProps["taskCounts"],
  },
  {
    title: "Completed",
    key: "completed",
    icon: Archive,
    count: "completed" as keyof AppSidebarProps["taskCounts"],
  },
];

export function AppSidebar({ onNavigate, currentPage, taskCounts }: AppSidebarProps) {
  return (
    <Sidebar data-testid="sidebar-main">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <CheckSquare className="h-4 w-4 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-semibold" data-testid="text-app-title">TaskFlow</h1>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tasks</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    onClick={() => onNavigate(item.key)}
                    data-active={currentPage === item.key}
                    data-testid={`button-nav-${item.key}`}
                    className="flex w-full justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </div>
                    <Badge variant="secondary" className="ml-auto">
                      {taskCounts[item.count]}
                    </Badge>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onNavigate('new-task')}
                  data-testid="button-new-task"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Task</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('admin')}
          data-testid="button-admin-settings"
          className="w-full justify-start"
        >
          <Settings className="h-4 w-4 mr-2" />
          Admin Settings
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}