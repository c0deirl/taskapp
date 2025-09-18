import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Mail, Bell, Upload, Save, TestTube, Eye } from "lucide-react";
import { FileUpload } from "./FileUpload";

interface AdminSettings {
  // SMTP Settings
  emailEnabled: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  smtpSecure: boolean;
  emailFrom: string;
  emailTemplate: string;
  
  // NTFY Settings
  ntfyEnabled: boolean;
  ntfyServer: string;
  ntfyTopic: string;
  ntfyPriority: "min" | "low" | "default" | "high" | "max";
  
  // App Settings
  appTitle: string;
  logoUrl?: string;
}

interface AdminPanelProps {
  settings: AdminSettings;
  onUpdateSettings: (settings: AdminSettings) => void;
  onClose: () => void;
}

const defaultEmailTemplate = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Task Reminder</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 20px; color: #333;">
    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
        <h2 style="color: #6366f1;">🔔 Task Reminder</h2>
        <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 10px 0;">
            <h3>{{task.title}}</h3>
            <p><strong>Priority:</strong> <span style="color: {{priority.color}};">{{task.priority}}</span></p>
            <p><strong>Due:</strong> {{task.dueDate}}</p>
            {{#if task.description}}
            <p><strong>Description:</strong> {{task.description}}</p>
            {{/if}}
        </div>
        <p style="color: #666; font-size: 12px;">Sent from TaskFlow</p>
    </div>
</body>
</html>`;

export { type AdminSettings };

export function AdminPanel({ settings, onUpdateSettings, onClose }: AdminPanelProps) {
  const [localSettings, setLocalSettings] = useState<AdminSettings>({ ...settings });
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [isTestingNtfy, setIsTestingNtfy] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  const handleSave = () => {
    onUpdateSettings(localSettings);
    console.log('Admin settings saved:', localSettings);
  };

  const handleLogoUpload = (file: File) => {
    // TODO: remove mock functionality
    const mockUrl = URL.createObjectURL(file);
    setLocalSettings(prev => ({ ...prev, logoUrl: mockUrl }));
    console.log('Logo uploaded:', file.name);
  };

  const testEmailConnection = async () => {
    setIsTestingEmail(true);
    // TODO: remove mock functionality
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Testing email connection...', localSettings.smtpHost);
    setIsTestingEmail(false);
  };

  const testNtfyConnection = async () => {
    setIsTestingNtfy(true);
    // TODO: remove mock functionality
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Testing NTFY connection...', localSettings.ntfyServer);
    setIsTestingNtfy(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto" data-testid="admin-panel">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Admin Settings</CardTitle>
          <div className="flex gap-2">
            <Button onClick={handleSave} data-testid="button-save-settings">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
            <Button variant="outline" onClick={onClose} data-testid="button-close-admin">
              Close
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="ntfy">NTFY</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">App Branding</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="app-title">Application Title</Label>
                    <Input
                      id="app-title"
                      value={localSettings.appTitle}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, appTitle: e.target.value }))}
                      placeholder="TaskFlow"
                      data-testid="input-app-title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Logo</Label>
                    <FileUpload
                      onFileSelect={handleLogoUpload}
                      accept="image/*"
                      currentFile={localSettings.logoUrl}
                      label="Upload Logo"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="email" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Email Notifications
                    </CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={localSettings.emailEnabled}
                      onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, emailEnabled: checked }))}
                      data-testid="switch-email-enabled"
                    />
                    <Label>Enabled</Label>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-host">SMTP Host</Label>
                      <Input
                        id="smtp-host"
                        value={localSettings.smtpHost}
                        onChange={(e) => setLocalSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
                        placeholder="smtp.gmail.com"
                        disabled={!localSettings.emailEnabled}
                        data-testid="input-smtp-host"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtp-port">SMTP Port</Label>
                      <Input
                        id="smtp-port"
                        type="number"
                        value={localSettings.smtpPort}
                        onChange={(e) => setLocalSettings(prev => ({ ...prev, smtpPort: parseInt(e.target.value) || 587 }))}
                        placeholder="587"
                        disabled={!localSettings.emailEnabled}
                        data-testid="input-smtp-port"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-username">Username</Label>
                      <Input
                        id="smtp-username"
                        value={localSettings.smtpUsername}
                        onChange={(e) => setLocalSettings(prev => ({ ...prev, smtpUsername: e.target.value }))}
                        placeholder="your-email@example.com"
                        disabled={!localSettings.emailEnabled}
                        data-testid="input-smtp-username"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtp-password">Password</Label>
                      <Input
                        id="smtp-password"
                        type="password"
                        value={localSettings.smtpPassword}
                        onChange={(e) => setLocalSettings(prev => ({ ...prev, smtpPassword: e.target.value }))}
                        placeholder="••••••••"
                        disabled={!localSettings.emailEnabled}
                        data-testid="input-smtp-password"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={localSettings.smtpSecure}
                      onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, smtpSecure: checked }))}
                      disabled={!localSettings.emailEnabled}
                      data-testid="switch-smtp-secure"
                    />
                    <Label>Use TLS/SSL</Label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email-from">From Email</Label>
                    <Input
                      id="email-from"
                      value={localSettings.emailFrom}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, emailFrom: e.target.value }))}
                      placeholder="taskflow@example.com"
                      disabled={!localSettings.emailEnabled}
                      data-testid="input-email-from"
                    />
                  </div>
                  
                  <Button
                    onClick={testEmailConnection}
                    disabled={!localSettings.emailEnabled || isTestingEmail}
                    variant="outline"
                    className="w-full"
                    data-testid="button-test-email"
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    {isTestingEmail ? 'Testing Connection...' : 'Test Email Connection'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ntfy" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      NTFY Push Notifications
                    </CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={localSettings.ntfyEnabled}
                      onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, ntfyEnabled: checked }))}
                      data-testid="switch-ntfy-enabled"
                    />
                    <Label>Enabled</Label>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ntfy-server">NTFY Server</Label>
                    <Input
                      id="ntfy-server"
                      value={localSettings.ntfyServer}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, ntfyServer: e.target.value }))}
                      placeholder="https://ntfy.sh"
                      disabled={!localSettings.ntfyEnabled}
                      data-testid="input-ntfy-server"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ntfy-topic">Topic</Label>
                    <Input
                      id="ntfy-topic"
                      value={localSettings.ntfyTopic}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, ntfyTopic: e.target.value }))}
                      placeholder="taskflow-notifications"
                      disabled={!localSettings.ntfyEnabled}
                      data-testid="input-ntfy-topic"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={localSettings.ntfyPriority}
                      onValueChange={(value: typeof localSettings.ntfyPriority) => 
                        setLocalSettings(prev => ({ ...prev, ntfyPriority: value }))
                      }
                      disabled={!localSettings.ntfyEnabled}
                    >
                      <SelectTrigger data-testid="select-ntfy-priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="min">Min</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="max">Max</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button
                    onClick={testNtfyConnection}
                    disabled={!localSettings.ntfyEnabled || isTestingNtfy}
                    variant="outline"
                    className="w-full"
                    data-testid="button-test-ntfy"
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    {isTestingNtfy ? 'Testing Connection...' : 'Test NTFY Connection'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Email Template</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEmailPreview(!showEmailPreview)}
                    data-testid="button-preview-template"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {showEmailPreview ? 'Hide' : 'Show'} Preview
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Available Variables</Label>
                    <div className="flex flex-wrap gap-2">
                      {['{{task.title}}', '{{task.description}}', '{{task.priority}}', '{{task.dueDate}}', '{{priority.color}}'].map(variable => (
                        <Badge key={variable} variant="outline" className="text-xs">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email-template">HTML Template</Label>
                    <Textarea
                      id="email-template"
                      value={localSettings.emailTemplate}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, emailTemplate: e.target.value }))}
                      className="font-mono text-sm min-h-64"
                      placeholder={defaultEmailTemplate}
                      data-testid="textarea-email-template"
                    />
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => setLocalSettings(prev => ({ ...prev, emailTemplate: defaultEmailTemplate }))}
                    data-testid="button-reset-template"
                  >
                    Reset to Default Template
                  </Button>
                  
                  {showEmailPreview && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Template Preview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-muted p-4 rounded-md">
                          <div className="text-sm text-muted-foreground mb-2">Rendered HTML preview (with sample data):</div>
                          <div 
                            className="bg-background p-4 rounded border text-sm max-h-40 overflow-y-auto"
                            dangerouslySetInnerHTML={{
                              __html: localSettings.emailTemplate
                                .replace(/\{\{task\.title\}\}/g, "Sample Task Title")
                                .replace(/\{\{task\.description\}\}/g, "This is a sample task description for preview")
                                .replace(/\{\{task\.priority\}\}/g, "High")
                                .replace(/\{\{task\.dueDate\}\}/g, "Tomorrow")
                                .replace(/\{\{priority\.color\}\}/g, "#ef4444")
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}