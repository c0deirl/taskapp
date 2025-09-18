import { TaskCard, type Task } from '../TaskCard';

export default function TaskCardExample() {
  // TODO: remove mock functionality
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Complete project documentation',
      description: 'Write comprehensive documentation for the new task management system including API docs and user guide',
      priority: 'high',
      dueDate: new Date(Date.now() + 86400000), // Tomorrow
      reminderDate: new Date(Date.now() + 43200000), // 12 hours from now
      completed: false,
      createdAt: new Date(Date.now() - 86400000), // Yesterday
    },
    {
      id: '2',
      title: 'Review pull requests',
      priority: 'medium',
      completed: true,
      createdAt: new Date(Date.now() - 3600000), // 1 hour ago
    },
    {
      id: '3',
      title: 'Schedule team meeting',
      description: 'Plan next sprint and discuss project roadmap',
      priority: 'low',
      dueDate: new Date(Date.now() - 86400000), // Overdue
      completed: false,
      createdAt: new Date(Date.now() - 172800000), // 2 days ago
    },
  ];

  const handleToggle = (id: string) => {
    console.log('Toggle task:', id);
  };

  const handleEdit = (task: Task) => {
    console.log('Edit task:', task.title);
  };

  const handleDelete = (id: string) => {
    console.log('Delete task:', id);
  };

  return (
    <div className="p-4 space-y-4 max-w-2xl">
      <h3 className="text-lg font-semibold">Task Cards</h3>
      <div className="space-y-3">
        {mockTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}