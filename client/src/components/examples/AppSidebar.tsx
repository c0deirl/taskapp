import { AppSidebar } from '../AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function AppSidebarExample() {
  const mockTaskCounts = {
    all: 12,
    pending: 8,
    completed: 4,
    high: 3,
  };

  const handleNavigate = (page: string) => {
    console.log('Navigate to:', page);
  };

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-96 w-full border rounded-lg overflow-hidden">
        <AppSidebar 
          onNavigate={handleNavigate}
          currentPage="all"
          taskCounts={mockTaskCounts}
        />
        <div className="flex-1 p-4 bg-muted/30">
          <p className="text-sm text-muted-foreground">
            Content area - sidebar navigation will update this section
          </p>
        </div>
      </div>
    </SidebarProvider>
  );
}