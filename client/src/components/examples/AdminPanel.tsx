import { AdminPanel } from '../AdminPanel';

export default function AdminPanelExample() {
  // TODO: remove mock functionality
  const mockSettings = {
    // SMTP Settings
    emailEnabled: true,
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: 'admin@taskflow.com',
    smtpPassword: '',
    smtpSecure: true,
    emailFrom: 'notifications@taskflow.com',
    emailTemplate: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Task Reminder</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 20px; color: #333;">
    <h2 style="color: #6366f1;">🔔 Task Reminder</h2>
    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 6px;">
        <h3>{{task.title}}</h3>
        <p><strong>Priority:</strong> {{task.priority}}</p>
        <p><strong>Due:</strong> {{task.dueDate}}</p>
    </div>
</body>
</html>`,
    
    // NTFY Settings
    ntfyEnabled: true,
    ntfyServer: 'https://ntfy.sh',
    ntfyTopic: 'taskflow-demo',
    ntfyPriority: 'default' as const,
    
    // App Settings
    appTitle: 'TaskFlow',
  };

  const handleUpdateSettings = (settings: any) => {
    console.log('Settings updated:', settings);
  };

  const handleClose = () => {
    console.log('Admin panel closed');
  };

  return (
    <div className="p-4">
      <AdminPanel 
        settings={mockSettings}
        onUpdateSettings={handleUpdateSettings}
        onClose={handleClose}
      />
    </div>
  );
}