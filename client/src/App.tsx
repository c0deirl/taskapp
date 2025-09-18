import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery, useMutation } from "@tanstack/react-query";
import { taskApi } from "./lib/api";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

// Components
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AppSidebar } from "@/components/AppSidebar";
import { TaskList } from "@/components/TaskList";
import { TaskForm } from "@/components/TaskForm";
import { AdminPanel, type AdminSettings } from "@/components/AdminPanel";
import { LogOut } from "lucide-react";
import { type Task } from "@/components/TaskCard";

import { AuthProvider, useAuth } from './lib/AuthContext';
import { LoginPage } from './pages/LoginPage';

function AppContent() {
  // Auth state
  const { user, isLoading: authLoading } = useAuth();
  
  // All state hooks must be declared before any conditional returns
  const [currentPage, setCurrentPage] = useState("all");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    emailEnabled: false,
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    smtpSecure: true,
    emailFrom: '',
    emailTemplate: '',
    ntfyEnabled: false,
    ntfyServer: 'https://ntfy.sh',
    ntfyTopic: '',
    ntfyPriority: 'default',
    appTitle: 'TaskFlow',
  });

  // Query hook with authentication dependency
  const { data: tasks = [], isLoading: tasksLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => user ? taskApi.getTasks() : Promise.resolve([]),
    enabled: !!user,
    retry: (failureCount, error: any) => {
      // Don't retry on 401 unauthorized
      if (error.response?.status === 401) return false;
      return failureCount < 3;
    }
  });
  
  // Handle authentication states
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  // Calculate task counts for sidebar
  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
    high: tasks.filter(t => t.priority === 'high' && !t.completed).length,
  };

  // Navigation handler
  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setEditingTask(null);
  };

  // Task mutations
  const toggleTaskMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) => 
      taskApi.toggleTask(id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const createTaskMutation = useMutation({
    mutationFn: taskApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setCurrentPage('all');
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, task }: { id: string; task: any }) => 
      taskApi.updateTask(id, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setEditingTask(null);
      setCurrentPage('all');
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: taskApi.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  // Task handlers
  const handleToggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      toggleTaskMutation.mutate({ id, completed: !task.completed });
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setCurrentPage('edit-task');
  };

  const handleDeleteTask = (id: string) => {
    deleteTaskMutation.mutate(id);
  };

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    createTaskMutation.mutate(taskData);
  };

  const handleUpdateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    if (!editingTask) return;
    updateTaskMutation.mutate({ id: editingTask.id, task: taskData });
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setCurrentPage('all');
  };

  const handleUpdateSettings = (settings: AdminSettings) => {
    setAdminSettings(settings);
  };

  // Render main content based on current page
  const renderMainContent = () => {
    switch (currentPage) {
      case 'new-task':
        return (
          <TaskForm 
            onSubmit={handleCreateTask}
            onCancel={handleCancelEdit}
          />
        );
      case 'edit-task':
        return editingTask ? (
          <TaskForm 
            task={editingTask}
            onSubmit={handleUpdateTask}
            onCancel={handleCancelEdit}
          />
        ) : (
          <TaskList 
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onCreateTask={handleCreateTask}
            currentFilter="all"
          />
        );
      case 'admin':
        return (
          <AdminPanel 
            settings={adminSettings}
            onUpdateSettings={handleUpdateSettings}
            onClose={() => setCurrentPage('all')}
          />
        );
      default:
        if (tasksLoading) {
          return <div className="flex items-center justify-center p-8">Loading tasks...</div>;
        }
        
        if (error) {
          return (
            <div className="flex flex-col items-center justify-center p-8 text-red-500">
              <p>Error loading tasks</p>
              <button 
                className="mt-4 px-4 py-2 bg-red-100 rounded-md hover:bg-red-200"
                onClick={() => queryClient.invalidateQueries({ queryKey: ['tasks'] })}
              >
                Retry
              </button>
            </div>
          );
        }

        return (
          <TaskList 
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onCreateTask={handleCreateTask}
            currentFilter={currentPage}
          />
        );
    }
  };

  // Get page title
  const getPageTitle = () => {
    switch (currentPage) {
      case 'new-task':
        return 'Create New Task';
      case 'edit-task':
        return 'Edit Task';
      case 'admin':
        return 'Admin Settings';
      case 'pending':
        return 'Pending Tasks';
      case 'completed':
        return 'Completed Tasks';
      case 'high-priority':
        return 'High Priority Tasks';
      default:
        return 'All Tasks';
    }
  };

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider defaultTheme="dark">
          <SidebarProvider style={sidebarStyle as React.CSSProperties}>
            <div className="flex h-screen w-full" data-testid="app-main">
              <AppSidebar 
                onNavigate={handleNavigate}
                currentPage={currentPage}
                taskCounts={taskCounts}
              />
              
              <div className="flex flex-col flex-1 overflow-hidden">
                {/* Header */}
                <header className="flex items-center justify-between p-4 border-b bg-background" data-testid="header-main">
                  <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
                    <span className="text-sm text-muted-foreground">
                      {user.username}
                    </span>
                    <SidebarTrigger data-testid="button-sidebar-toggle" />
                    <h1 className="text-lg font-semibold" data-testid="text-page-title">
                      {getPageTitle()}
                    </h1>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => auth.logout()}
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                </header>
                
                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6" data-testid="main-content">
                  {renderMainContent()}
                </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AppContent />
            <Toaster />
          </ThemeProvider>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
