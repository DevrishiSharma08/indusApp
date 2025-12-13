# App-Wide Standardization Plan

## Goal
Make every data-display page in the entire app consistent with the same UI/UX, features, and button positions.

## Standard Features for ALL List Pages

### 1. **Top Section (Always in this order)**
```
PageHeader (with back button on mobile by default)
  ├── Title
  ├── Description
  └── Primary Action (Create button) - Top Right

SearchBar - Full width below PageHeader

Toolbar Row:
  ├── FilterExportBar - Left side
  ├── ViewToggle (Table/Grid/Card) - Right side
  └── ColumnToggle (Show/Hide columns) - Right side
```

### 2. **Bulk Selection Section** (Shows when items selected)
```
BulkActions Bar:
  ├── "X of Y selected" with Clear button
  └── Bulk Actions Dropdown (Delete, Export, Change Status, etc.)
```

### 3. **Data Display Section**
```
Card wrapper with:
  ├── Table View (default)
  │   ├── Checkbox column (for bulk selection)
  │   ├── Data columns (respecting column visibility)
  │   └── Actions column (View/Edit/Delete dropdown)
  │
  ├── Grid View (2-3 columns on desktop, 1 on mobile)
  │   └── Cards with key info + action buttons
  │
  └── Card View (1 column, detailed cards)
      └── Expandable cards with all info
```

### 4. **Bottom Section** (if applicable)
```
Pagination:
  ├── Items per page selector
  ├── Page numbers
  └── Next/Previous buttons
```

## Standard Button Positions

### Create Button
- Location: PageHeader primaryAction (top right)
- Icon: Plus
- Label: "Create [Entity]"

### Row Actions (View/Edit/Delete)
- Location: Last column in table, right-aligned
- Style: DropdownMenu with MoreVertical icon
- Order: View → Edit → Separator → Delete (red)

### Back Button
- Location: PageHeader (top left, mobile only by default)
- Icon: ArrowLeft
- Behavior: router.back()

### Bulk Actions
- Location: Separate bar above table when items selected
- Style: Select dropdown
- Common actions: Delete, Export, Archive, Change Status

### Filter/Export
- Location: FilterExportBar component, left side of toolbar
- Export button: Download icon with Excel/CSV/PDF options

## Standard Components to Use

1. **PageHeader** - Every page must have this
2. **SearchBar** - All list pages
3. **FilterExportBar** - All list pages with data
4. **ViewToggle** - All list pages
5. **ColumnToggle** - All table views
6. **BulkActions** - All list pages with selectable items
7. **DataTable** or **Table** - For tabular data
8. **Card** - For grid/card views

## Color/Styling Standards

### Use ONLY semantic tokens (from globals.css):
- `bg-background` - Page background
- `bg-card` - Card backgrounds
- `bg-muted` - Secondary backgrounds
- `bg-primary` - Primary actions
- `bg-destructive` - Delete/danger actions
- `text-foreground` - Primary text
- `text-muted-foreground` - Secondary text
- `border-border` - All borders

### NO hardcoded colors:
❌ `bg-gray-50`, `text-blue-600`, `border-gray-200`
✅ `bg-background`, `text-primary`, `border-border`

## Pages to Standardize

### Priority 1 (MUST FIX):
1. ✅ /hrm/employees - Already good
2. ✅ /hrm/leave-attendance - Already good
3. ✅ /ticketmanagement/tickets - Already good
4. ✅ /assets/all - Already good
5. ⚠️ /projectmanagement/projects - NEEDS: Column toggle, view toggle, bulk actions
6. ⚠️ /projectmanagement/tasks - NEEDS: Column toggle, view toggle
7. ⚠️ /projectmanagement/sprints - NEEDS: Complete redesign
8. ⚠️ /assets/* - Multiple pages need standardization

### Priority 2 (IMPROVE):
9. /hrm/payroll - Different pattern, may keep tabs but standardize filters
10. /ticketmanagement/my-work - Add missing features
11. /ticketmanagement/support - Add missing features
12. /ticketmanagement/testing - Add missing features

## Implementation Strategy

### Phase 1: Create Reference Implementation
- Update /projectmanagement/projects with ALL features
- This becomes the gold standard template

### Phase 2: Apply to Other Pages
- Copy pattern to all list pages
- Maintain same structure, just change data/columns

### Phase 3: Dashboard Pages
- Ensure all dashboards have:
  - Consistent KPI card layout
  - Same quick action patterns
  - Consistent chart styling

### Phase 4: Form Pages
- All create/edit forms:
  - Back button (mobile-only by default)
  - Consistent field layout
  - Same submit button position

### Phase 5: Detail Pages
- All detail views:
  - Back button
  - Edit button (top right)
  - Tabs for organizing info
  - Consistent info display

## Testing Checklist

For each page, verify:
- [ ] PageHeader with correct title and create button
- [ ] Back button on mobile (if not main module page)
- [ ] SearchBar working
- [ ] FilterExportBar with correct filters
- [ ] ViewToggle switching between views
- [ ] ColumnToggle hiding/showing columns
- [ ] Checkbox selection working
- [ ] BulkActions appearing when items selected
- [ ] Row actions (View/Edit/Delete) working
- [ ] All buttons using semantic color tokens
- [ ] Responsive on mobile (test with F12)
- [ ] All action buttons functional (console.log at minimum)

## Files Modified/Created

### New Components:
- ✅ /src/components/ColumnToggle.tsx
- ✅ /src/components/ViewToggle.tsx
- ✅ /src/components/BulkActions.tsx

### Updated Components:
- ✅ /src/components/PageHeader.tsx (added mobile back button)

### Pages to Update:
- [ ] /src/app/projectmanagement/projects/page.tsx
- [ ] /src/app/projectmanagement/tasks/page.tsx
- [ ] /src/app/projectmanagement/sprints/page.tsx
- [ ] /src/app/projectmanagement/calendar/page.tsx
- [ ] /src/app/assets/all/page.tsx
- [ ] /src/app/assets/categories/page.tsx
- [ ] /src/app/assets/expenses/page.tsx
- [ ] /src/app/assets/subscriptions/page.tsx
- [ ] /src/app/ticketmanagement/my-work/page.tsx
- [ ] /src/app/ticketmanagement/support/page.tsx
- [ ] /src/app/ticketmanagement/testing/page.tsx
- [ ] /src/app/ticketmanagement/customers/page.tsx

## Next Steps

1. Complete projectmanagement/projects/page.tsx as reference
2. Test it thoroughly on desktop and mobile
3. Create a reusable template
4. Apply to all other pages systematically
5. Final testing of entire app
