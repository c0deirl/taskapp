import { ThemeToggle } from '../ThemeToggle';
import { ThemeProvider } from '../ThemeProvider';

export default function ThemeToggleExample() {
  return (
    <ThemeProvider>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Theme Toggle</h3>
          <ThemeToggle />
        </div>
        <p className="text-sm text-muted-foreground">
          Click the button to toggle between light and dark themes
        </p>
      </div>
    </ThemeProvider>
  );
}