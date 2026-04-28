# Feature #7: Inspector Workload Dashboard

**Assigned To**: Team 4
**Priority**: Medium
**Component**: Manager Dashboard - Analytics
**Type**: Resource Management/Analytics

## User Story
**As a** manager
**I want to** see each inspector's current workload and performance metrics
**So that** I can distribute work fairly and identify inspectors who need support

## Acceptance Criteria

### 1. Workload Overview Table
Columns:
- Inspector Name
- Assigned (count of scheduled inspections)
- In Progress (count)
- Completed This Month (count)
- Avg Score (average of completed inspections)

Features:
- Sort by any column
- Color indicators:
  - Red: > 10 assigned (overloaded)
  - Yellow: 6-10 (busy)
  - Green: < 6 (available)

### 2. Inspector Detail View
Click inspector name shows:
- List of assigned inspections with statuses
- Performance chart: Average scores over last 3 months
- Completion rate: % of inspections completed on time
- Late inspections count

### 3. Load Balancing
- Highlight inspectors with 0 assignments
- Show "Recommended Inspector" when assigning (lowest workload)
- Warn when assigning to overloaded inspector (> 10)

### 4. Filters
- Show all inspectors OR only active (with assignments)
- Date range for performance metrics
- Team filter (if multiple manager teams exist)

## Test Planning Guide

**Your Role as a Tester**: Create test scenarios for workload visualization and load balancing.

**Testing Approach**:
1. **Display Testing**: Verify workload table shows correct data
2. **Color Coding Testing**: Test red/yellow/green indicators
3. **Detail View Testing**: Test inspector drill-down functionality
4. **Recommendation Testing**: Verify "recommended inspector" logic
5. **Filter Testing**: Test active/inactive inspector filtering

**Suggested Claude Code Prompts**:
```
"Analyze the inspector workload dashboard feature and create a test plan covering:
- Workload table with sortable columns
- Color-coded indicators (red > 10, yellow 6-10, green < 6)
- Inspector detail view with performance metrics
- Recommended inspector calculation
- Filter functionality
- Load balancing warnings"

"What calculations should I verify for workload distribution and recommendations?"

"Create test scenarios for overload warnings and load balancing suggestions"
```

**Key Test Scenarios**:
1. No inspectors - shows empty state
2. Equal workload (all 5 assigned) - all green
3. One overloaded (12 assigned) - shows red
4. Mixed workload - shows correct colors
5. Click inspector name - detail view loads
6. Detail view shows correct inspection list
7. Performance chart displays trend
8. Recommended inspector - shows lowest count
9. Filter "active only" - hides inspectors with 0 assignments
10. Sort by "Assigned" column - orders correctly
11. Warning when assigning to overloaded inspector
12. Completion rate calculates correctly

**Verification Points**:
- Assigned count matches inspection list
- Color thresholds are correct (10, 6)
- Average score calculation is accurate
- Completion rate % is correct
- Late inspection count is accurate

## Technical Context (For Claude Code)

Technical considerations:
- Data aggregation from inspections table
- Real-time vs cached workload calculations
- Chart library for performance visualization
- Recommendation algorithm (lowest workload)
- Threshold configuration (6, 10 limits)
- Filter and sort implementation
- Performance with many inspectors

**For Testers**: Ask Claude Code to analyze the workload calculation logic and suggest data accuracy tests.
