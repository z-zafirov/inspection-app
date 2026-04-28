# Feature #2: Filter Inspections by Date Range

**Assigned To**: Team 1
**Priority**: Medium
**Component**: Manager Dashboard
**Type**: Filtering/Search Feature

## Business Value

Managers need to review inspections from specific time periods (quarterly reports, monthly analysis, specific date ranges) for reporting and analysis purposes. Currently, they see all inspections with no filtering capability, making it difficult to focus on relevant time periods.

## User Story

**As a** manager
**I want to** filter inspections by custom date ranges
**So that** I can review inspections from specific time periods (e.g., last quarter, specific month) for reporting and analysis

## Acceptance Criteria

### 1. Date Range Picker UI

- Add date filter controls above the inspections table
- Layout: Two date inputs side-by-side
  - **"From Date"** input (left)
  - **"To Date"** input (right)
- Include "Quick Filters" buttons for common ranges:
  - Today
  - Last 7 Days
  - Last 30 Days
  - This Month
  - Last Month
- "Clear Filter" button to reset to default (all dates)
- Filters persist when switching between dashboard tabs

### 2. Filtering Behavior

- Filter applies to `inspection_date` field
- Results update immediately when dates change (no "Apply" button needed)
- Inclusive range: includes both start and end dates
- Default state: Shows all inspections (no filter applied)
- Visual indicator when filter is active (e.g., blue border on inputs)

### 3. Validation Rules

- "From Date" cannot be after "To Date"
- Display error message: "From date must be before To date"
- Error message appears below the date inputs (red text)
- Maximum range: 1 year (to prevent performance issues)
- If range > 1 year, show error: "Date range cannot exceed 1 year"
- Minimum date: No restrictions (can filter historical data)
- Future dates: Allowed (can pre-filter upcoming scheduled inspections)

### 4. Results Display

- Show count: "Showing X inspections from [start date] to [end date]"
- Count appears above the table, below the filter controls
- If no results: "No inspections found in this date range"
- Show helpful message: "Try adjusting your date range or clearing filters"
- Maintain table sorting while filtered
- Pagination adjusts to filtered results

### 5. Integration with Other Features

- Export functionality (if exists) respects date filter
- Statistics/charts update based on filtered date range
- URL should reflect filter state (for sharing/bookmarking)
- Example: `?from=2026-01-01&to=2026-03-31`

## UI Placement

Insert filter controls between:
- **Above**: Statistics cards (pending, scheduled, in-progress counts)
- **Below**: Inspections table header

## Test Planning Guide

**Your Role as a Tester**: Create a test plan focused on user interactions with the date filter.

**Testing Approach**:
1. **User Flow Testing**: Walk through the complete filtering workflow
2. **Validation Testing**: Try invalid date ranges and verify error messages
3. **Integration Testing**: Ensure filter works with sorting, pagination, etc.
4. **Edge Case Testing**: Empty results, single day, maximum range

**Suggested Claude Code Prompts**:
```
"Analyze the date range filter feature and create a test plan covering:
- All quick filter buttons (Today, Last 7 Days, etc.)
- Custom date range selection
- Validation rules and error messages
- Integration with table sorting and pagination
- URL parameter handling"

"What boundary value tests should I include for date range validation?"

"Create test scenarios for the date filter including edge cases"
```

**Key Test Areas**:
- Quick filters work correctly
- Manual date selection updates results
- Validation prevents invalid ranges
- Results count is accurate
- Clear filter restores default view
- Filter persists across page navigation

## Technical Context (For Claude Code)

Technical considerations for implementation:
- Date picker UI component selection
- Client-side vs server-side filtering logic
- URL state management for bookmarking
- Performance optimization for large datasets
- Accessibility (keyboard navigation, ARIA labels)

**For Testers**: Ask Claude Code to analyze these to suggest performance and compatibility tests.

## Out of Scope

- Advanced filters (by restaurant, inspector, score range) - future enhancement
- Saved filter presets - future enhancement
- Date range comparison (e.g., this month vs last month) - future enhancement

## Test Scenarios

### Functional Tests
1. Select "Last 7 Days" quick filter - shows correct inspections
2. Manual date range selection - filters correctly
3. "Clear Filter" resets to show all inspections
4. Switch between quick filters - updates correctly

### Validation Tests
5. Set From date > To date - shows error, no filter applied
6. Set date range > 1 year - shows error
7. Invalid date formats - handled gracefully
8. Empty date fields - treated as no filter

### Edge Cases
9. No inspections in date range - shows empty state message
10. All inspections in range - shows full list
11. Single day range - shows inspections from that day only
12. Future date range - works for scheduled inspections

### Integration Tests
13. Filter + sort - both work together
14. Filter + pagination - pages adjust correctly
15. Filter persists across page refresh (if URL-based)
16. Filter + export - exports only filtered results

## Acceptance Criteria Summary

- ✅ Date range picker with From/To inputs
- ✅ Quick filter buttons for common ranges
- ✅ Clear filter button
- ✅ Validation for invalid date ranges
- ✅ Results count display
- ✅ Empty state when no results
- ✅ Performance: Filters apply instantly
- ✅ Mobile responsive
- ✅ Maintains filter when switching tabs
