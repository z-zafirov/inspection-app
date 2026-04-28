# Feature #3: Bulk Inspector Assignment

**Assigned To**: Team 2
**Priority**: Medium
**Component**: Manager Dashboard
**Type**: Productivity/Batch Operation

## User Story
**As a** manager
**I want to** assign multiple pending inspection requests to the same inspector at once
**So that** I can efficiently schedule a full day's work instead of assigning one request at a time

## Acceptance Criteria

### 1. Selection UI
- Add checkbox column to "Pending Requests" table (leftmost position)
- "Select All" checkbox in table header
- Display selected count: "3 requests selected"
- "Bulk Assign" button appears when ≥ 1 selected (otherwise disabled/hidden)

### 2. Assignment Modal
Opens when "Bulk Assign" clicked, contains:
- List of selected restaurants (names, scrollable if > 5)
- Inspector dropdown selector
- Date picker for scheduling
- Scheduling options (radio buttons):
  - **"Same date for all"** (default): All assigned to selected date
  - **"Sequential scheduling"**: 1st request on selected date, 2nd next day, 3rd day after, etc.
- Conflict warning if inspector busy on selected dates
- "Assign" and "Cancel" buttons

### 3. Validation
- Max 10 requests selected at once (show error if exceeded)
- Warn if inspector has > 2 inspections on selected date
- Confirmation dialog: "Assign X inspections to [Inspector]?"
- Validate date not in past (reuse existing validation)

### 4. Results & Feedback
- Success: "Successfully assigned 5 inspections to John Doe"
- Partial success: "Assigned 4 of 5. Failed: Restaurant X (conflict)"
- Error: Clear message with retry option
- Table updates immediately
- Selections cleared after successful assignment

## Test Planning Guide

**Your Role as a Tester**: Create test scenarios for bulk operations and error handling.

**Testing Approach**:
1. **Selection Workflow**: Test checkbox interactions and selection limits
2. **Assignment Modes**: Test both "same date" and "sequential" scheduling
3. **Error Handling**: Test conflicts, validation errors, partial failures
4. **User Feedback**: Verify all success/error messages are clear

**Suggested Claude Code Prompts**:
```
"Analyze the bulk assignment feature and create a test plan including:
- Selection UI behavior (select all, individual selection, limits)
- Both scheduling modes (same date vs sequential)
- Validation scenarios (date conflicts, inspector overload)
- Partial success handling
- Cancel and reset behaviors"

"What edge cases should I test for bulk assignment of 1, 5, 10, and 11 requests?"

"Create test scenarios for inspector conflict warnings and error messages"
```

**Key Test Scenarios**:
1. Select 3, assign same date - all succeed
2. Select 5, sequential mode - dates increment correctly
3. Select > 10 - error prevents selection
4. Inspector conflict - shows warning
5. Some fail - partial success message shows details
6. Cancel modal - selections remain
7. Select all, then deselect some - count updates
8. Assign to past date - validation error
9. Refresh page after assignment - table updates
10. Sequential mode over weekend - handles correctly

## Technical Context (For Claude Code)

Technical considerations:
- Checkbox state management
- Modal dialog implementation
- Batch API calls or single call with array
- Transaction handling for partial failures
- Rollback strategy if some assignments fail
- Performance with large selections

**For Testers**: Claude Code can analyze these to suggest additional test cases around data integrity and performance.
