# Project Management Integration Summary

## ✅ Completed Updates

### 1. Navigation Fixed
- **[BottomNavigation.tsx](frontend/src/components/BottomNavigation.tsx#L17)**: Fixed module detection from `/projects` to `/projectmanagement`
- **[ModuleSidebar.tsx](frontend/src/components/ModuleSidebar.tsx#L49-67)**:
  - Added complete PM menu with 14 pages
  - Fixed typo in paths
  - Added proper icons (KanbanSquare, ListTodo, Clock, GitBranch, Zap, BookOpen, Share2, MapPin)

### 2. Components Updated
- **[PageHeader.tsx](frontend/src/components/PageHeader.tsx)**:
  - Added support for `href` prop (in addition to `onClick`)
  - Added `description` alias for `subtitle`
  - Added `content` alias for `label` in primaryAction
  - Now supports Link navigation

### 3. Pages Integrated

#### ✅ Dashboard Page
**[projectmanagement/dashboard/page.tsx](frontend/src/app/projectmanagement/dashboard/page.tsx)**
- ✅ Uses `page-container` utility
- ✅ Uses `page-header` + `page-title` + `page-subtitle`
- ✅ KPI cards match HRM style
- ✅ Semantic tokens (text-muted-foreground, text-card-foreground, bg-primary/10)
- ✅ Consistent grid: `grid-cols-2 lg:grid-cols-4`
- ✅ Removed hardcoded colors

#### ✅ Projects List Page
**[projectmanagement/projects/page.tsx](frontend/src/app/projectmanagement/projects/page.tsx)**
- ✅ Uses `page-container` utility
- ✅ Uses PageHeader with primaryAction (Create Project button)
- ✅ Uses SearchBar component
- ✅ Uses FilterExportBar component
- ✅ Uses shadcn/ui Table, Badge, Progress components
- ✅ Mobile-responsive with hidden columns
- ✅ Loading skeleton states

## ⚠️ Pages Needing Updates

### High Priority (Core Functionality)

#### 1. Board Page (Kanban)
**[projectmanagement/board/page.tsx](frontend/src/app/projectmanagement/board/page.tsx)**
- ❌ Uses hardcoded colors: `bg-white`, `bg-blue-600`, `text-gray-500`, `border-red-500`
- ❌ No `page-container` utility
- ❌ Should use Card component from shadcn/ui
- ❌ Should use Badge for priority indicators
- **Fix Needed**: Replace all color classes with semantic tokens

#### 2. Backlog Page
**[projectmanagement/backlog/page.tsx](frontend/src/app/projectmanagement/backlog/page.tsx)**
- ❌ Uses hardcoded colors
- ❌ No consistent layout utilities
- **Fix Needed**: Use DataTable or custom tree view with semantic tokens

#### 3. Tasks Page
**[projectmanagement/tasks/page.tsx](frontend/src/app/projectmanagement/tasks/page.tsx)**
- **Fix Needed**: Similar pattern to Projects page (list view with filters)

### Medium Priority

#### 4. Sprints Page
- Should use Card grid layout
- Sprint cards with Progress bars

#### 5. Gantt Chart Page
- Complex visualization - may need custom component
- Ensure semantic tokens in timeline

#### 6. Reports Pages
- Use consistent chart styling with Recharts
- Match dashboard chart patterns

### Low Priority (Simple Pages)

#### 7. Wiki, Integrations, Automation
- Simple list/grid views
- Can follow Projects page pattern

## 🎨 Design System Consistency Checklist

For each page, ensure:

### Layout
- ✅ Wraps content in `page-container` utility class
- ✅ Uses `page-header` for header section
- ✅ Uses `section-spacing` or `content-spacing` for vertical rhythm

### Components
- ✅ Import from `@/components/ui/` (shadcn) when available
- ✅ Use PageHeader for page titles
- ✅ Use SearchBar for search inputs
- ✅ Use FilterExportBar for filters
- ✅ Use Card, CardHeader, CardTitle, CardContent
- ✅ Use Badge for status indicators
- ✅ Use Button with proper variants
- ✅ Use Table for data tables
- ✅ Use Progress for progress bars

### Colors & Tokens
- ✅ **Never use**: `bg-white`, `text-gray-500`, `bg-blue-600`, `border-red-500`
- ✅ **Always use**:
  - `bg-card`, `bg-background`, `bg-muted`, `bg-accent`
  - `text-foreground`, `text-muted-foreground`, `text-card-foreground`
  - `border-border`, `border-input`
  - `text-primary`, `bg-primary`, `bg-primary/10`
  - `text-destructive`, `bg-destructive`
  - For status colors: `text-emerald-600 dark:text-emerald-400` (theme-aware)

### Responsive Design
- ✅ Start mobile-first: `grid-cols-1` or `grid-cols-2`
- ✅ Scale up: `sm:grid-cols-2 lg:grid-cols-4`
- ✅ Hide non-essential columns: `hidden md:table-cell`
- ✅ Mobile padding: `px-4` → `lg:px-6`

### Loading States
- ✅ Use skeleton loaders with `animate-pulse`
- ✅ Use `bg-muted` for skeleton backgrounds
- ✅ Match layout structure of actual content

## 📝 Quick Update Template

For list pages (like Tasks, Backlog items):

```tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Eye, Edit } from 'lucide-react';

import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import FilterExportBar from '@/components/FilterExportBar';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function PageName() {
  // State and hooks here

  return (
    <div className="page-container">
      <PageHeader
        title="Page Title"
        description="Page description"
        primaryAction={{
          content: 'Create New',
          href: '/projectmanagement/page/create',
          icon: Plus,
        }}
      />

      <SearchBar
        placeholder="Search..."
        value={searchTerm}
        onChange={setSearchTerm}
      />

      <FilterExportBar filters={filterConfig} />

      <Card>
        <CardContent className="p-0">
          <Table>
            {/* Table content */}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
```

## 🚀 Next Steps

1. **Board Page**: Critical - Replace hardcoded colors, use Card components
2. **Backlog Page**: Use expandable/collapsible rows with shadcn Accordion
3. **Tasks Page**: Follow Projects page pattern
4. **Sprints Page**: Card grid with Sprint info
5. **Update remaining pages** following the template above

## 📚 Reference Files

- **Style Guide**: `frontend/STYLE_GUIDE.md`
- **Example HRM Page**: `frontend/src/app/hrm/page.tsx`
- **Example Employees Page**: `frontend/src/app/hrm/employees/page.tsx`
- **Available Components**: `frontend/src/components/`
- **CLAUDE.md**: Root level project documentation