# Feature #8: Offline Mode Indicator with Sync Status

**Assigned To**: Team 4
**Priority**: High
**Component**: Mobile Inspection Form - UX
**Type**: User Feedback/Status

## User Story
**As an** inspector
**I want to** see clear indicators showing which data is synced vs stored locally
**So that** I know when my work is safely saved to the server

## Acceptance Criteria

### 1. Global Sync Status Banner
Always visible at top of inspection form:
- **Online + Synced**: Green background, "✓ All changes saved to server"
- **Online + Pending**: Yellow background, "⟳ Syncing changes..."
- **Offline**: Orange background, "⚠ Offline - Changes saved locally only"
- **Error**: Red background, "✗ Sync failed - Will retry when online"

### 2. Item-Level Indicators
Small icon next to each scored checklist item:
- ✓ (green) = synced to server
- ⟳ (yellow) = pending sync
- ⚠ (orange) = local only
- Tooltip on hover: "Last synced: 2 minutes ago"

### 3. Manual Sync Button
- Always visible in banner
- Disabled when offline or already syncing
- Shows last sync timestamp: "Last synced: Just now"
- Confirmation toast: "✓ Sync successful" (2 seconds)

### 4. Auto-Sync Behavior
- Auto-sync when connection restored
- Auto-sync every 30 seconds while online
- Retry failed syncs with exponential backoff (1s, 2s, 4s, 8s, 16s)
- Never auto-sync if conflicts detected (show warning instead)

## Test Planning Guide

**Your Role as a Tester**: Create test scenarios for offline mode indicators and sync status.

**Testing Approach**:
1. **Status Banner Testing**: Verify all 4 states (synced, pending, offline, error)
2. **Item Indicators Testing**: Test per-item sync status icons
3. **Manual Sync Testing**: Test sync button and progress feedback
4. **Auto-Sync Testing**: Verify automatic sync behavior
5. **Network Simulation**: Test online/offline transitions (inspector on mobile device)

**Suggested Claude Code Prompts**:
```
"Analyze the offline mode indicator feature and create a test plan including:
- Global sync status banner (4 states)
- Item-level sync indicators (4 icons)
- Manual sync button behavior
- Auto-sync timing and triggers
- Retry logic with exponential backoff
- Network transition scenarios"

"What network simulation tests should I include for offline/online transitions?"

"Create test scenarios for sync conflicts and error handling"
```

**Key Test Scenarios**:
1. Online → shows green "All changes saved to server"
2. Go offline (airplane mode) → banner turns orange "Offline"
3. Add score while offline → item shows orange ⚠ icon
4. Add multiple scores offline → all show ⚠
5. Come online → auto-syncs within 30 seconds
6. After auto-sync → banner turns green, items show ✓
7. Sync fails (simulate server error) → shows red error banner
8. Failed sync retries automatically (1s, 2s, 4s, 8s, 16s)
9. Manual sync button click → shows "Syncing..." progress
10. Manual sync success → shows "✓ Sync successful" toast (2 seconds)
11. Last sync timestamp updates correctly
12. Hover on item icon → tooltip shows "Last synced: X minutes ago"

**Network Simulation Tests (Inspector Mobile Scenarios)**:
- Stable online connection
- Go offline mid-inspection (inspector enters building with no signal)
- Intermittent connection (on/off repeatedly - weak signal area)
- Slow connection (sync takes > 5 seconds - poor network)
- Come online after extended offline period (inspector leaves building)

**Timing Verification**:
- Auto-sync every 30 seconds while online
- Retry intervals: 1s, 2s, 4s, 8s, 16s
- Toast notification duration: 2 seconds
- Tooltip appears on hover

## Technical Context (For Claude Code)

Technical considerations:
- Online/offline detection (navigator.onLine)
- localStorage for pending sync queue
- Retry logic with exponential backoff
- WebSocket or polling for real-time sync
- Conflict detection mechanism
- Background sync API (if supported)
- Icon state management
- Timestamp formatting

**For Testers**: Ask Claude Code about network simulation strategies and conflict resolution test scenarios.
