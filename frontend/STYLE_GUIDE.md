# IndusInternalApp - Style Guide

## Overview
This style guide ensures consistent typography, colors, spacing, and component usage across the entire application.

## Typography

### Heading Hierarchy
```typescript
// Use semantic HTML headings with automatic styling
<h1>Page Title</h1>           // 4xl font-extrabold (lg:5xl)
<h2>Section Title</h2>        // 3xl font-semibold with border
<h3>Subsection</h3>           // 2xl font-semibold
<h4>Component Title</h4>      // xl font-semibold
<h5>Small Section</h5>        // lg font-semibold
<h6>Caption/Label</h6>        // base font-semibold
```

### Page Layout Components
```typescript
// Use these utility classes for consistent page layouts
<div className="page-container">        // Max-width container with padding
  <div className="page-header">         // Standard page header spacing
    <h1 className="page-title">Title</h1>
    <p className="page-subtitle">Subtitle</p>
  </div>
</div>
```

### Text Utilities
```typescript
// Text formatting
<p className="text-balance">Long title text</p>    // Better line breaks
<p className="text-pretty">Paragraph text</p>     // Avoid orphaned words

// Body text uses automatic line-height and spacing
<p>Regular paragraph text</p>  // leading-7 with automatic spacing
```

## Color System

### Semantic Colors (Use these instead of raw colors)
```typescript
// Background colors
bg-background           // Main page background
bg-card                 // Card backgrounds
bg-muted               // Subtle backgrounds
bg-accent              // Accent backgrounds

// Text colors
text-foreground        // Primary text
text-muted-foreground  // Secondary text
text-primary           // Primary brand color
text-destructive       // Error/danger text

// Border colors
border-border          // Standard borders
border-input           // Input borders
border-ring           // Focus rings
```

### Status Colors
```typescript
// Use these classes for status indicators
.status-success        // Green for success states
.status-warning        // Yellow for warnings
.status-error          // Red for errors
.status-info           // Blue for information
```

## Spacing System

### Consistent Spacing
```typescript
// Section spacing (between major page sections)
<div className="section-spacing">     // space-y-6 sm:space-y-8 lg:space-y-12

// Content spacing (between related content)
<div className="content-spacing">     // space-y-4 sm:space-y-6
```

### Grid Layouts
```typescript
// Card grids
<div className="card-grid">           // 4-column responsive grid
<div className="card-grid-2">         // 2-column responsive grid
<div className="card-grid-3">         // 3-column responsive grid
```

## Component Usage

### Buttons
```typescript
import { Button } from '@/components/ui/button';

// Primary actions
<Button>Primary Action</Button>

// Secondary actions
<Button variant="outline">Secondary</Button>

// Destructive actions
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

### Cards
```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content here
  </CardContent>
</Card>
```

### Forms
```typescript
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

<div className="space-y-2">
  <Label htmlFor="field">Field Label</Label>
  <Input id="field" placeholder="Enter value" />
</div>
```

### Status Badges
```typescript
import { Badge } from '@/components/ui/badge';

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>
```

## Interactive States

### Hover and Focus
```typescript
// Use the interactive utility for consistent hover/focus states
<div className="interactive">Hoverable content</div>

// Or use transition-default for custom interactions
<div className="transition-default hover:bg-muted">Custom hover</div>
```

## Shadows

### Shadow Hierarchy
```typescript
// Subtle shadows for cards
<div className="shadow-soft">Light elevation</div>

// Medium shadows for dropdowns
<div className="shadow-medium">Medium elevation</div>

// Strong shadows for modals
<div className="shadow-strong">High elevation</div>
```

## Loading States

### Skeleton Loading
```typescript
// Use skeleton class for loading placeholders
<div className="skeleton h-4 w-full rounded"></div>
<div className="skeleton h-8 w-24 rounded"></div>
```

## Mobile-First Approach

### Responsive Design
```typescript
// Always start with mobile styles, then add larger breakpoints
<div className="p-4 sm:p-6 lg:p-8">        // Padding scales up
<div className="text-sm sm:text-base lg:text-lg">  // Text scales up
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">  // Grid scales up
```

## Accessibility

### Focus Management
```typescript
// Focus indicators are automatically applied
// Use proper semantic HTML
<button>Button</button>     // ✅ Good
<div onClick={}>Button</div> // ❌ Bad

// Use proper labels
<Label htmlFor="email">Email</Label>
<Input id="email" />
```

## Component Examples

### Page Layout
```typescript
export default function Page() {
  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Page Title</h1>
          <p className="page-subtitle">Page description</p>
        </div>

        <div className="section-spacing">
          <Card>
            <CardHeader>
              <CardTitle>Section Title</CardTitle>
            </CardHeader>
            <CardContent className="content-spacing">
              <p>Content goes here</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
```

### Form Layout
```typescript
<Card>
  <CardHeader>
    <CardTitle>Form Title</CardTitle>
  </CardHeader>
  <CardContent>
    <form className="content-spacing">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Enter name" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="Enter email" />
      </div>

      <Button type="submit">Submit</Button>
    </form>
  </CardContent>
</Card>
```

## Best Practices

### DO:
- ✅ Use semantic HTML elements
- ✅ Use shadcn/ui components when available
- ✅ Use design tokens (text-muted-foreground, bg-card, etc.)
- ✅ Start with mobile styles and scale up
- ✅ Use consistent spacing classes
- ✅ Follow the component hierarchy

### DON'T:
- ❌ Use hardcoded colors (text-gray-500, bg-blue-600)
- ❌ Mix different design systems
- ❌ Skip responsive considerations
- ❌ Ignore accessibility best practices
- ❌ Create custom components when shadcn/ui equivalents exist

## File Structure
```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   └── custom/          # Custom reusable components
├── app/
│   ├── globals.css      # Global styles and design tokens
│   └── pages/           # Page components
└── styles/
    └── components.css   # Additional component styles (if needed)
```