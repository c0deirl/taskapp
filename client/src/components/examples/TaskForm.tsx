import { TaskForm } from '../TaskForm';
import { type Task } from '../TaskCard';

export default function TaskFormExample() {
  // TODO: remove mock functionality
  const mockTask: Task = {
    id: '1',
    title: 'Sample Task',
    description: 'This is a sample task for editing',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000),
    reminderDate: new Date(Date.now() + 43200000),
    completed: false,
    createdAt: new Date(),
  };

  const handleSubmit = (taskData: any) => {
    console.log('Task form submitted:', taskData);
  };

  const handleCancel = () => {
    console.log('Task form cancelled');
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">New Task Form</h3>
          <TaskForm 
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Edit Task Form</h3>
          <TaskForm 
            task={mockTask}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}