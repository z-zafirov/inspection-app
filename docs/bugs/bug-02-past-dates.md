# Bug #2: Past Dates Allowed for Inspection Scheduling

**Assigned To**: Team 1
**Priority**: Medium
**Component**: Manager Dashboard - Assignment
**Type**: Validation Issue

## Description

Managers can schedule inspections for dates in the past when assigning inspectors to pending inspection requests. This causes confusion as inspectors see "overdue" inspections that they cannot realistically complete, and the system allows logically impossible scheduling.

The system should prevent scheduling inspections for any date before today.

## Steps to Reproduce

1. Login as a manager user
2. Navigate to the "Pending Requests" section of the dashboard
3. Click "Assign Inspector" button for any pending request
4. In the assignment modal:
   - Select any inspector from the dropdown
   - Set the "Scheduled Date" field to yesterday (or any past date)
   - Click "Assign" button
5. Observe that the system accepts the assignment
6. Login as the assigned inspector
7. View the inspection - it appears as overdue

## Expected Result

- The system displays an error message: "Scheduled date cannot be in the past"
- The assignment is NOT created
- The date picker should ideally disable past dates

## Actual Result

- The assignment succeeds without any validation error
- The inspection is created with a past date
- Inspector sees the inspection marked as overdue

## Additional Test Cases

Test these scenarios:
- **Today's date**: Should be accepted (valid)
- **Yesterday**: Should be rejected
- **Last week**: Should be rejected
- **Last year**: Should be rejected
- **Tomorrow**: Should be accepted (valid)
- **Next week**: Should be accepted (valid)

## Technical Context (For Claude Code)

The following technical details are available in the code for Claude to analyze:
- API endpoint: `/api/inspection-requests/:id/assign`
- Currently missing date validation logic
- Frontend assignment modal may have client-side validation
- Consider timezone handling (server vs. client time)

**Your task as a tester**: Ask Claude Code to analyze what date validation should exist and create test cases for proper date handling including boundary conditions (today, yesterday, tomorrow).

## Business Impact

- **Inspectors**: See confusing "overdue" inspections that are impossible to complete on time
- **Managers**: Can accidentally create invalid schedules
- **Reporting**: Historical data becomes unreliable
- **Severity**: Medium (causes confusion but system still functions)

## Related Considerations

When fixing this bug, consider:
- Should the scheduled date be >= today, or >= tomorrow?
- What timezone should be used for "today"? (server time, client time, UTC?)
- Should there be a maximum future date allowed? (e.g., no scheduling 10 years ahead)
- What happens to existing inspections with past dates?

## Test Strategy Considerations

Your test plan should include:
- **Boundary tests**: Yesterday, today, tomorrow
- **UI tests**: Check if date picker enforces validation
- **API tests**: Verify server-side validation (can't bypass via API)
- **Error handling**: Clear, user-friendly error messages
- **Regression tests**: Ensure valid future dates still work
