# Bug #9: "Loading..." Badge Never Updates on Owner Dashboard

**Assigned To**: Discovery Exercise (All Teams)
**Priority**: Low
**Component**: Owner Dashboard - UI
**Type**: Display/Update Issue

## Description

On the restaurant owner dashboard, the "Loading..." text below the "Pending Requests" stat card never updates, even after the actual pending count loads successfully. The number updates correctly (showing 0, 1, 2, etc.), but the status text remains stuck on "Loading..." indefinitely.

This is a UI polish issue that creates a perception of incomplete loading or broken functionality.

## Steps to Reproduce

1. Login as a restaurant owner (any team)
2. Navigate to the owner dashboard (should load automatically)
3. Observe the "Pending Requests" stat card
4. The number (e.g., "0", "1", "2") displays correctly
5. Below the number, the text still shows "Loading..."
6. Refresh the page multiple times - text never changes
7. Create a new inspection request to change the count
8. Number updates but text remains "Loading..."

## Expected Result

The status text below the pending count should update to something meaningful:
- "Awaiting assignment" (if count > 0)
- "No pending requests" (if count = 0)
- Or simply remove the "Loading..." text entirely

## Actual Result

- The pending request count updates correctly
- The "Loading..." text never changes
- Creates impression that data is still loading

## Visual Comparison

**Current (Incorrect)**:
```
┌─────────────────────────┐
│ Pending Requests    ⏳   │
│                         │
│         1               │  ← Number updates correctly
│                         │
│    Loading...           │  ← ❌ Stuck forever
└─────────────────────────┘
```

**Expected (Correct)**:
```
┌─────────────────────────┐
│ Pending Requests    ⏳   │
│                         │
│         1               │  ← Number updates correctly
│                         │
│  Awaiting assignment    │  ← ✓ Meaningful text
└─────────────────────────┘
```

**Or** (Alternative):
```
┌─────────────────────────┐
│ Pending Requests    ⏳   │
│                         │
│         0               │  ← Number updates correctly
│                         │
│  No pending requests    │  ← ✓ Meaningful text
└─────────────────────────┘
```

## Location in UI

- **Dashboard**: Owner Dashboard (accessible after login as restaurant owner)
- **Card**: Stats section, middle card
- **Element**: Stat card with title "Pending Requests"
- **Specific element**: `<span>` inside `<div class="stat-change neutral">`

## Technical Context (For Claude Code)

The following technical details are available in the code for Claude to analyze:
- HTML template: `client/dashboard-owner.html` around line 106-108
- The `<span>` with "Loading..." text has no ID attribute
- JavaScript file: `client/dashboard-owner.js` function `loadPendingRequests()` around line 163-185
- The JavaScript updates the number but not the status text
- The element needs an ID so JavaScript can update it
- Needs logic to show different text based on whether there are pending requests

**Your task as a tester**: Ask Claude Code to analyze why the loading text never updates and suggest what changes are needed to make it work properly.

## Business Impact

- **User Perception**: Looks like page didn't finish loading
- **Trust**: Users may doubt data accuracy
- **Polish**: Unprofessional appearance
- **Severity**: Low (cosmetic issue, doesn't affect functionality)

## Related Elements

Check if other stat cards have similar issues:
- "Total Inspections" card
- "Average Score" card
- "Next Inspection" card (this one does update correctly)

## Discovery Exercise

**This bug is for teams to discover during Module 1!**

When you explore the owner dashboard during Module 1, see if you can find this bug. Try:
1. Login as owner
2. Look at all the stat cards
3. Notice which elements update and which don't
4. Use browser DevTools to inspect the HTML
5. Ask Claude: "What elements in the owner dashboard might not be updating correctly?"

## Test Strategy Considerations

Your test plan should include:
- **UI state verification**: Check all dynamic text elements update
- **Visual testing**: Compare before/after data loads
- **Browser testing**: Verify across different browsers
- **Regression testing**: Ensure fix doesn't break other elements
- **Accessibility**: Ensure screen readers get updated text

## Acceptance Criteria for Fix

- ✅ Status text updates when pending count loads
- ✅ Shows meaningful text based on count (0 vs >0)
- ✅ No "Loading..." text remains after data loads
- ✅ Updates correctly when count changes
- ✅ Consistent with other dashboard status messages
- ✅ No console errors
