# Bug #6: Checklist Items Not Loading from Cache When Offline

**Assigned To**: Team 3
**Priority**: Medium
**Component**: Mobile Inspection Form - Offline Mode
**Type**: Cache/Loading Issue

## Description

When an inspector opens the inspection form while offline, checklist items fail to load from the localStorage cache, leaving the form blank and unusable. The cached data exists in the browser's localStorage, but the loading logic has a bug that prevents it from being rendered to the UI.

This defeats the purpose of offline mode, as inspectors cannot complete inspections without internet.

## Steps to Reproduce

**Setup: Load data while online**
1. Login as an inspector (with internet connection)
2. Navigate to any assigned inspection
3. Wait for page to fully load (checklist items visible)
4. Verify checklist items are visible and functional
5. Return to dashboard

**Reproduce bug**:
6. Enable airplane mode or disable internet
7. Navigate back to the same inspection
8. Observe the inspection form loads
9. Restaurant name and date appear correctly
10. Checklist section shows: "No checklist items available"
11. Form is unusable - cannot score items that don't appear

**Observation**:
12. The data should have been cached when you loaded it online
13. But it's not appearing when you're offline
14. This is the bug - cached data isn't loading properly

## Expected Result

- Checklist items load from localStorage cache
- All previously loaded items appear in the UI
- Inspector can score items while offline
- Form functions identically to online mode

## Actual Result

- Checklist section displays "No checklist items available"
- Cached data exists in localStorage but is not rendered
- Inspector cannot complete inspection while offline
- Offline mode is essentially broken

## Additional Test Scenarios

Test these caching situations:
1. **Never loaded online**: Fresh user with no cache (expected to fail gracefully)
2. **Partially loaded**: Some items cached, some not
3. **Stale cache**: Cached items from 1 week ago
4. **Updated items online**: Items change while user offline
5. **Cache cleared**: Browser cache manually cleared
6. **Multiple inspections**: Different cached data per inspection

## Technical Context (For Claude Code)

The following technical details are available in the code for Claude to analyze:
- Function `loadOfflineData()` in `client/inspection-form.js` around line 288-311
- Specifically lines 305-310 where cached items should be loaded
- Compare with `loadChecklistItems()` function around line 112-132
- The cached data structure uses localStorage
- The issue is likely in how cached data is rendered to the UI

Likely causes:
1. Data is loaded but not rendered to the page
2. Race condition between loading and rendering
3. Missing call to render the cached items
4. Async timing issue

**Your task as a tester**: Ask Claude Code to analyze why cached data isn't appearing in the UI and create test cases for offline functionality.

## Business Impact

- **Offline Mode Useless**: Primary feature (offline) doesn't work
- **Inspector Frustration**: Can't work in areas with poor connectivity
- **Lost Productivity**: Inspectors must wait for internet to work
- **Severity**: Medium (core feature broken, but only in offline scenario)

## User Experience Requirements

When fixed, offline mode should:
- Load instantly from cache (< 100ms)
- Display clear indicator that data is from cache
- Show "last synced" timestamp
- Gracefully handle missing cache data

## Test Strategy Considerations

Your test plan should include:
- **Online-to-offline flow**: Load online, use offline
- **Cache verification**: Confirm data is saved correctly
- **UI rendering**: Verify items appear on screen
- **Functionality**: Can score items using cached data
- **Edge cases**: Empty cache, corrupted cache, partial cache
- **Performance**: Cache load should be fast (< 100ms)

## Non-Functional Requirements

- Offline load should be faster than online (no network latency)
- Cache should survive browser refresh
- Clear messaging if cache is stale (> 24 hours old)
