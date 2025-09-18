import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
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
import { type Task } from "@/components/TaskCard";

function App() {
  // TODO: remove mock functionality
  const [currentPage, setCurrentPage] = useState("all");
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete project documentation',
      description: 'Write comprehensive documentation for the new task management system including API docs and user guide',
      priority: 'high',
      dueDate: new Date(Date.now() + 86400000),
      reminderDate: new Date(Date.now() + 43200000),
      completed: false,
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      id: '2',
      title: 'Review pull requests',
      description: 'Review pending PRs for the authentication module',
      priority: 'medium',
      completed: true,
      createdAt: new Date(Date.now() - 3600000),
    },
    {
      id: '3',
      title: 'Schedule team meeting',
      description: 'Plan next sprint and discuss project roadmap',
      priority: 'low',
      dueDate: new Date(Date.now() - 86400000),
      completed: false,
      createdAt: new Date(Date.now() - 172800000),
    },
    {
      id: '4',
      title: 'Update dependencies',
      description: 'Upgrade all npm packages to latest versions',
      priority: 'low',
      dueDate: new Date(Date.now() + 172800000),
      completed: false,
      createdAt: new Date(Date.now() - 172800000),
    },
    {
      id: '5',
      title: 'Write unit tests',
      description: 'Add comprehensive test coverage for payment service',
      priority: 'high',
      dueDate: new Date(Date.now() - 86400000),
      completed: false,
      createdAt: new Date(Date.now() - 259200000),
    }
  ]);
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

  // Task handlers
  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setCurrentPage('edit-task');
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date(),
    };
    setTasks(prev => [newTask, ...prev]);
    setCurrentPage('all');
  };

  const handleUpdateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    if (!editingTask) return;
    setTasks(prev => prev.map(task => 
      task.id === editingTask.id 
        ? { ...task, ...taskData }
        : task
    ));
    setEditingTask(null);
    setCurrentPage('all');
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
                    <SidebarTrigger data-testid="button-sidebar-toggle" />
                    <h1 className="text-lg font-semibold" data-testid="text-page-title">
                      {getPageTitle()}
                    </h1>
                  </div>
                  <ThemeToggle />
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

export default App;
