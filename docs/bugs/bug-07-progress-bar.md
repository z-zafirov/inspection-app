# Bug #7: Progress Bar Shows Incorrect Count When Items Have Notes Only

**Assigned To**: Team 4
**Priority**: Low
**Component**: Mobile Inspection Form - UI
**Type**: Display/Logic Issue

## Description

The progress bar counts checklist items as "scored" if they have notes added, even when the actual score (1-10) has not been selected. This gives inspectors false confidence that they've completed more items than they actually have.

While the submit button correctly prevents submission until all items are scored, the misleading progress bar can cause confusion during the inspection process.

## Steps to Reproduce

1. Login as an inspector
2. Open any assigned inspection
3. Navigate to the inspection form (checklist)
4. Select the first checklist item
5. **Do NOT select a score** (don't click any 1-10 button)
6. Add notes in the notes textarea: "Equipment needs cleaning"
7. Observe the progress bar increases (e.g., from 0/12 to 1/12)
8. Move to next item, add notes without scoring
9. Progress bar continues to increase
10. Try to submit the inspection
11. Submit is correctly blocked (can't submit without scores)
12. But progress bar shows misleading completion percentage

## Expected Result

- Progress bar should count only items with actual scores (1-10 selected)
- Adding notes alone should NOT increase progress
- Progress should accurately reflect completion state
- Example: 5 items scored, 3 items with notes only → Progress shows "5/12"

## Actual Result

- Progress bar counts items with notes as "complete"
- Adding notes without scores increases progress
- Progress shows misleading higher completion
- Example: 5 items scored, 3 items with notes only → Progress shows "8/12" (incorrect)

## Visual Example

**Current (Incorrect)**:
```
Progress: 8/12 items ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 67%
Submit button: DISABLED ✓ (correct - not all scored)
```

**Expected (Correct)**:
```
Progress: 5/12 items ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 42%
Submit button: DISABLED ✓ (correct - not all scored)
```

## Additional Test Cases

Test these scenarios:
1. **Score only (no notes)**: Should count in progress ✓
2. **Notes only (no score)**: Should NOT count in progress ✗ (BUG)
3. **Score + notes**: Should count in progress ✓
4. **Empty item**: Should NOT count in progress ✓
5. **Score then remove**: Progress should decrease ✓

## Technical Context (For Claude Code)

The following technical details are available in the code for Claude to analyze:
- Function `updateProgress()` in `client/inspection-form.js` around line 242-249
- The issue is in how "scored items" are counted
- Currently counting items that have ANY data (including just notes)
- Should only count items that have an actual score value
- The logic needs to filter for items with `score !== null`

**Your task as a tester**: Ask Claude Code to analyze the progress calculation logic and create test cases to verify that progress only counts items with actual scores, not just notes.

## Business Impact

- **User Confusion**: Inspectors think they're further along than they are
- **Workflow Disruption**: False sense of completion, then surprise when can't submit
- **User Experience**: Frustrating to see high progress but can't complete
- **Severity**: Low (doesn't break functionality, just misleading UI)

## Edge Cases to Consider

- What if inspector scores 10/12 items but adds notes to all 12?
- What if inspector removes a score but notes remain?
- What if inspector refreshes page - does progress persist correctly?
- What about items with score = 0? (if that becomes valid later)

## User Experience Requirements

- Progress bar should give accurate completion status
- Users should know exactly how many items remain
- Visual feedback should match actual state
- Should be consistent with submit button state

## Test Strategy Considerations

Your test plan should include:
- **UI state testing**: Verify progress matches actual scored count
- **User flow testing**: Score items in different orders and combinations
- **Visual regression testing**: Progress bar updates correctly in real-time
- **Calculation testing**: Verify percentage calculation (scored/total * 100)
- **Edge case testing**: All scored, none scored, partial combinations
- **Data persistence**: Refresh page and verify progress accuracy

## Acceptance Criteria for Fix

- ✅ Progress counts only items with scores (1-10)
- ✅ Notes without scores do NOT increase progress
- ✅ Progress bar percentage is accurate
- ✅ Progress text shows "X / Total" correctly
- ✅ Submit button state matches progress state
- ✅ No regression in other progress functionality
