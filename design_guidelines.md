# To-Do Application Design Guidelines

## Design Approach
**System-Based Approach**: Using a modern, utility-focused design system optimized for productivity applications. Drawing inspiration from Linear, Notion, and Todoist for clean task management interfaces.

## Core Design Elements

### Color Palette
**Dark Mode Primary** (Default):
- Background: 217 19% 9% (deep slate)
- Surface: 217 19% 12% (elevated panels)
- Border: 217 19% 18% (subtle borders)
- Text Primary: 217 19% 95% (high contrast)
- Text Secondary: 217 19% 65% (muted text)
- Brand Primary: 260 100% 70% (vibrant purple)
- Success: 120 70% 50% (task completion)
- Warning: 45 100% 60% (high priority)
- Danger: 0 70% 60% (deletion/alerts)

**Light Mode** (Optional toggle):
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Text Primary: 217 19% 15%
- Same accent colors with adjusted opacity

### Typography
- **Primary Font**: Inter (Google Fonts) - excellent readability for tasks
- **Headings**: 600-700 weight, sizes from text-sm to text-2xl
- **Body Text**: 400-500 weight, text-sm for dense information
- **UI Elements**: 500 weight for buttons and labels

### Layout System
**Spacing Units**: Primarily 2, 4, 6, and 8 (p-2, m-4, gap-6, h-8)
- Consistent 4-unit spacing for form elements
- 6-unit spacing between major sections
- 8-unit spacing for page margins

### Component Library

#### Task Management
- **Task Cards**: Rounded borders (rounded-lg), subtle shadows, checkbox integration
- **Priority Indicators**: Color-coded dots or badges (high/medium/low)
- **Due Date Displays**: Subtle time indicators with warning states
- **Completion States**: Strikethrough animation with opacity reduction

#### Navigation
- **Sidebar Navigation**: Collapsible on mobile, persistent on desktop
- **Top Bar**: Logo placement, user settings, admin access
- **Mobile Navigation**: Bottom tab bar for core functions

#### Forms & Inputs
- **Dark Mode Inputs**: Consistent background treatment with focus states
- **SMTP Configuration**: Multi-step form with validation feedback
- **File Upload**: Drag-and-drop areas for logo uploads
- **Rich Text Editor**: For email template customization

#### Admin Interface
- **Settings Panels**: Tabbed interface for different configuration areas
- **Email Templates**: Live preview alongside HTML editor
- **NTFY Configuration**: Clear connection status indicators

#### Data Displays
- **Task Lists**: Infinite scroll with loading states
- **Filter Controls**: Dropdown and toggle combinations
- **Search Interface**: Prominent search with autocomplete

#### Mobile Responsiveness
- **Breakpoints**: Mobile-first approach with sm/md/lg variants
- **Touch Targets**: Minimum 44px for all interactive elements
- **Swipe Gestures**: Swipe-to-complete and swipe-to-delete on mobile
- **Responsive Typography**: Scales appropriately across devices

#### Overlays & Modals
- **Task Creation Modal**: Full-screen on mobile, centered on desktop
- **Confirmation Dialogs**: Consistent styling with clear actions
- **Settings Overlays**: Slide-in panels for configuration

### Visual Hierarchy
- **Primary Actions**: Bright brand color (purple) for main CTAs
- **Secondary Actions**: Outline buttons with subtle backgrounds
- **Destructive Actions**: Red accent with confirmation steps
- **Status Indicators**: Consistent iconography with color coding

### Animations
**Minimal Approach**:
- Task completion checkmark animation
- Smooth transitions for modal appearances
- Subtle hover states for interactive elements
- No distracting or unnecessary animations

This design system prioritizes functionality and accessibility while maintaining a modern, professional appearance suitable for productivity use across all devices.