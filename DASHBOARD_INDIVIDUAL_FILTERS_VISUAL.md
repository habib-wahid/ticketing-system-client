# Dashboard Individual Date Filters - Visual Guide

## Dashboard Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                           DASHBOARD                             │
│                 Welcome back, [User Name]!                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     TICKET OVERVIEW                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  📊 Open │  │  ⭐ New  │  │  ⏱️ In-  │  │  ✓ Close │        │
│  │ Tickets  │  │ Tickets  │  │ Process  │  │  Tickets │        │
│  │   [10]   │  │   [5]    │  │  [8]     │  │  [15]    │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┬──────────────────────────────────┐
│   PRIORITY DISTRIBUTION      │   CATEGORY DISTRIBUTION          │
├──────────────────────────────┼──────────────────────────────────┤
│ [🗓️ Filter by Date]  ▼       │ [🗓️ Filter by Date]  ▼           │
│                              │                                  │
│ Critical  [5] ████████       │ Technical    [12] ███████████    │
│ High      [8] ██████████████ │ Billing      [8]  ████████       │
│ Medium    [3] ████           │ Support      [5]  █████          │
│ Low       [2] ██             │ General      [3]  ███            │
│                              │ (Scrollable list)                │
└──────────────────────────────┴──────────────────────────────────┘
```

## Date Filter Dropdown UI

```
┌─────────────────────┐
│ 🗓️ Filter by Date  ▼│  ← Button shows "Filtered" when active
└─────────────────────┘
         │
         ▼
    ┌──────────────────────────────┐
    │  Date Range Selector         │
    ├──────────────────────────────┤
    │ From                         │
    │ ┌──────────────────────────┐ │
    │ │ YYYY-MM-DD               │ │ ← Date picker
    │ └──────────────────────────┘ │
    │                              │
    │ To                           │
    │ ┌──────────────────────────┐ │
    │ │ YYYY-MM-DD               │ │ ← Date picker
    │ └──────────────────────────┘ │
    │                              │
    │ ┌──────────┐ ┌────────────┐ │
    │ │  Reset   │ │   Apply    │ │ ← Action buttons
    │ └──────────┘ └────────────┘ │
    └──────────────────────────────┘
```

## Filter States

### 1. Initial State (No Filter)
```
[🗓️ Filter by Date]  ← Gray button, no active indicator
```

### 2. Filter Applied
```
[🗓️ Filtered ✕]  ← Shows "Filtered" text with X icon, gray button
```

### 3. Dropdown Open
```
[🗓️ Filter by Date ▼]  ← Darker background
    ↓ (Dropdown visible)
```

## Component Flow

### Priority Section Flow
```
User clicks "Filter by Date" button
    ↓
Dropdown appears with date inputs
    ↓
User selects From and To dates
    ↓
User clicks "Apply"
    ↓
Dropdown closes
    ↓
Hook detects priorityDateRange change
    ↓
API call: GET /api/dashboard/tickets-by-priority?from=...&to=...
    ↓
Dashboard data updates
    ↓
Priority chart re-renders with new data
```

### Category Section Flow
```
User clicks "Filter by Date" button (independent)
    ↓
Dropdown appears with date inputs
    ↓
User selects From and To dates
    ↓
User clicks "Apply"
    ↓
Dropdown closes
    ↓
Hook detects categoryDateRange change
    ↓
API call: GET /api/dashboard/tickets-by-complaint-category?from=...&to=...
    ↓
Dashboard data updates
    ↓
Category chart re-renders with new data
```

## State Management Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   Dashboard Component                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  dashboardData ──┐                                           │
│  priorityDateRange ──┬─► useEffect Hook                      │
│  categoryDateRange ──┘   ├─► Fetch 3 endpoints              │
│                         └─► Update dashboardData            │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Stats Section (No date filter)                      │    │
│  │ Uses: dashboardData.stats                           │    │
│  │ Updates: On component mount and user changes        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Priority Section (Individual filter)                │    │
│  │ Uses: dashboardData.priorityStats                   │    │
│  │ State: priorityDateRange (controlled)               │    │
│  │ Filter: DateRangeFilter component                   │    │
│  │ Updates: When priorityDateRange changes             │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Category Section (Individual filter)                │    │
│  │ Uses: dashboardData.categoryStats                   │    │
│  │ State: categoryDateRange (controlled)               │    │
│  │ Filter: DateRangeFilter component                   │    │
│  │ Updates: When categoryDateRange changes             │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## API Call Timing

```
Timeline when user changes Priority filter:

1. priorityDateRange state updates
2. useEffect dependency change detected
3. useEffect executes:
   - Stats API: GET /api/dashboard/tickets (no params)
   - Priority API: GET /api/dashboard/tickets-by-priority?from=...&to=...
   - Category API: GET /api/dashboard/tickets-by-complaint-category (old params or none)
4. Promise.all() waits for all three calls
5. dashboardData state updates
6. Components re-render with new data
```

## Key Interactions

### Scenario 1: Filter Priority Data Only
```
Initial: All sections show unfiltered data

1. User clicks "Filter by Date" in Priority section
2. User selects May 1-15, 2026
3. User clicks Apply
4. ✅ Priority data updates to May 1-15
5. ✅ Category data shows all dates (unchanged)
6. ✅ Stats show all dates (unchanged)
```

### Scenario 2: Filter Both Sections
```
1. User filters Priority to May 1-15
2. User filters Category to May 5-10
3. ✅ Priority shows May 1-15 data
4. ✅ Category shows May 5-10 data (different range!)
5. ✅ Stats show all dates (unchanged)
```

### Scenario 3: Compare Across Periods
```
Use Case: Compare priority distribution across months

1. View Priority filter: May 2026 (current month)
2. View Category filter: April 2026 (previous month)
3. Spot trends: Which categories increased/decreased
4. Make data-driven decisions
```

## Responsive Behavior

### Desktop (lg)
```
┌────────────────────┬────────────────────┐
│ Priority Section   │ Category Section   │
│ with filter button │ with filter button │
└────────────────────┴────────────────────┘
```

### Tablet (md)
```
┌────────────────────────────────┐
│ Priority Section               │
│ with filter button             │
└────────────────────────────────┘
┌────────────────────────────────┐
│ Category Section               │
│ with filter button             │
└────────────────────────────────┘
```

### Mobile
```
┌──────────────────┐
│ Priority Section │
│ with filter btn  │
└──────────────────┘
┌──────────────────┐
│ Category Section │
│ with filter btn  │
└──────────────────┘
```

## Benefits of Individual Filters

| Feature | Benefit |
|---------|---------|
| **Independent Filters** | Compare different time periods simultaneously |
| **Compact UI** | Filter buttons in card headers, minimal space |
| **Quick Access** | One-click to open, select, and apply |
| **Reset Per Section** | Reset one filter without affecting others |
| **Flexible Analysis** | Different metrics can have different date ranges |
| **Better UX** | Users understand what each filter controls |
| **Clean Layout** | No global filter section cluttering interface |

## Summary

This design provides **granular control** over dashboard data:
- Each chart section has **independent date filtering**
- Users can compare **different time periods** for different metrics
- **Compact UI** with filter buttons inline in chart headers
- **Flexible API calls** that respect each section's date range
- **Clean, intuitive interface** that scales well on all devices
