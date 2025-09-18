import { TaskList } from '../TaskList';
import { type Task } from '../TaskCard';

export default function TaskListExample() {
  // TODO: remove mock functionality
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Design new dashboard layout',
      description: 'Create wireframes and mockups for the updated admin dashboard with improved UX',
      priority: 'high',
      dueDate: new Date(Date.now() + 86400000),
      reminderDate: new Date(Date.now() + 43200000),
      completed: false,
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      id: '2',
      title: 'Code review for authentication module',
      description: 'Review pull request #234 for new OAuth integration',
      priority: 'medium',
      completed: true,
      createdAt: new Date(Date.now() - 3600000),
    },
    {
      id: '3',
      title: 'Update dependencies',
      priority: 'low',
      dueDate: new Date(Date.now() + 172800000),
      completed: false,
      createdAt: new Date(Date.now() - 172800000),
    },
    {
      id: '4',
      title: 'Write unit tests for payment service',
      description: 'Add comprehensive test coverage for the new payment processing functionality',
      priority: 'high',
      dueDate: new Date(Date.now() - 86400000), // Overdue
      completed: false,
      createdAt: new Date(Date.now() - 259200000),
    },
    {
      id: '5',
      title: 'Team retrospective meeting',
      priority: 'medium',
      completed: true,
      createdAt: new Date(Date.now() - 604800000),
    },
  ];

  const handleToggleTask = (id: string) => {
    console.log('Toggle task:', id);
  };

  const handleEditTask = (task: Task) => {
    console.log('Edit task:', task.title);
  };

  const handleDeleteTask = (id: string) => {
    console.log('Delete task:', id);
  };

  const handleCreateTask = (taskData: any) => {
    console.log('Quick create task:', taskData);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h3 className="text-lg font-semibold mb-4">Task List (All Tasks Filter)</h3>
      <TaskList 
        tasks={mockTasks}
        onToggleTask={handleToggleTask}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        onCreateTask={handleCreateTask}
        currentFilter="all"
      />
    </div>
  );
}