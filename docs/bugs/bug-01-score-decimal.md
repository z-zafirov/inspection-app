# Bug #1: Score Calculation Returns Incorrect Decimal Values

**Assigned To**: Team 1
**Priority**: High
**Component**: Inspection Scoring
**Type**: Calculation/Display Issue

## Description

When an inspector submits an inspection with checklist item scores, the overall score calculation sometimes produces unexpected decimal values with excessive precision. For example, scoring 3 items as [8, 9, 8] should give 8.33 (rounded to 2 decimal places), but the system shows 8.333333333 with many unnecessary decimal places.

This creates a poor user experience and makes scores difficult to read in reports and dashboards.

## Steps to Reproduce

1. Login as an inspector user
2. Navigate to assigned inspections
3. Open any inspection
4. Score checklist items with values that produce repeating decimals:
   - Item 1: Score 8
   - Item 2: Score 9
   - Item 3: Score 8
5. Click "Complete Inspection"
6. View the inspection details page
7. Observe the overall score display

## Expected Result

Overall score displays as **8.33** (rounded to 2 decimal places for readability)

## Actual Result

Overall score displays as **8.333333333** (many unnecessary decimal places)

## Additional Test Cases

Try these score combinations to verify the issue:
- [7, 8, 7] → Should show 7.33, actually shows 7.333333333
- [9, 8, 9, 8] → Should show 8.50, actually shows 8.5 (inconsistent)
- [10, 9, 8] → Should show 9.00, actually shows 9 (missing decimals)

## Technical Context (For Claude Code)

The following technical details are available in the code for Claude to analyze:
- Score calculation logic in `client/inspection-form.js` around line 261-263
- API endpoint `/api/inspections/:id/scores` processes the scores
- JavaScript `toFixed()` method can help format decimal numbers
- The issue is in how the overall score is calculated and displayed

**Your task as a tester**: Ask Claude Code to analyze the score calculation and suggest how to properly format decimal values to 2 decimal places.

## Impact

- **Users**: Difficult to read scores in dashboards and reports
- **Business**: Unprofessional appearance in exported reports
- **Severity**: Medium (cosmetic but affects all inspections)

## Test Strategy Considerations

When creating tests for this bug:
- Test various score combinations (repeating decimals, whole numbers, mixed)
- Verify both API response AND frontend display
- Check consistency across different views (dashboard, details, reports)
- Ensure fix doesn't break existing valid scores
