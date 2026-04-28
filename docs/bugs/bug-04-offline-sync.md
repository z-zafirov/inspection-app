# Bug #4: Offline Sync Overwrites Newer Server Data

**Assigned To**: Team 2
**Priority**: High
**Component**: Mobile Inspection Form - Offline Sync
**Type**: Data Conflict/Loss Issue

## Description

When an inspector works offline and later syncs their changes, their local data overwrites any updates made on the server in the meantime, even if the server data is newer. This can cause data loss if multiple inspectors or a manager modified the same inspection while the user was offline.

The system lacks conflict detection and resolution, implementing a "last write wins" strategy that can silently overwrite important changes.

## Steps to Reproduce

**Setup: Create initial inspection**
1. Manager assigns inspection to Inspector A
2. Inspector A opens the inspection (loads to browser cache)

**Scenario: Simultaneous edits**
3. Inspector A enables airplane mode (goes offline)
4. Inspector A adds scores for 3 checklist items (saved to localStorage)
5. Meanwhile, Manager (online) updates the same inspection with notes
6. Inspector A disables airplane mode (comes back online)
7. Inspector A clicks "Sync Now" button
8. Observe that Inspector A's offline data overwrites Manager's updates

**Result**:
- Manager's notes are lost
- No warning or conflict notification shown
- System shows only Inspector A's data

## Expected Result

One of these behaviors would be appropriate:
- **Option 1**: Detect conflict and prompt user: "Server has newer data. Overwrite, merge, or keep server version?"
- **Option 2**: Show diff view of changes and let user choose
- **Option 3**: Implement smart merge (server wins for some fields, local wins for others)
- **Option 4**: Reject sync and require manual review

## Actual Result

- Local changes silently overwrite server changes
- No conflict detection or warning
- Data loss occurs without user awareness

## Additional Test Scenarios

Test these conflict situations:
1. **Offline user, online manager**: Both edit same inspection
2. **Two offline inspectors**: Both edit, both sync later
3. **Offline then deleted**: Item deleted on server, edited offline
4. **Status conflicts**: Server marks "completed", offline marks "in_progress"
5. **Score conflicts**: Different scores for same checklist item

## Technical Context (For Claude Code)

The following technical details are available in the code for Claude to analyze:
- Function `manualSync()` in `client/inspection-form.js` around line 391-451
- Also check `submitInspection()` function
- Currently implements "last write wins" - no conflict detection
- Should implement timestamp comparison or version checking
- Needs proper conflict resolution logic

**Your task as a tester**: Ask Claude Code to analyze the sync logic and create test scenarios for data conflict situations. Focus on functional testing of what happens when multiple users edit the same data.

## Business Impact

- **Data Loss**: Manager or inspector changes can be silently lost
- **Compliance Risk**: Lost inspection notes could be required documentation
- **User Trust**: Users may not trust offline mode if data gets lost
- **Severity**: High (can result in permanent data loss)

## Conflict Resolution Strategies

Consider these approaches when fixing:
1. **Timestamp-based**: Compare `last_modified` timestamps
2. **Version numbers**: Increment version on each change
3. **ETags**: Use hash of data to detect changes
4. **Field-level merge**: Merge non-conflicting fields automatically
5. **User choice**: Let user decide on conflicts

## Test Strategy Considerations

Your test plan should include:
- **Timing tests**: Online edits during offline period
- **Multiple users**: Concurrent edits from different roles
- **Network simulation**: Toggle online/offline at various points (inspector mobile scenario)
- **Data verification**: Ensure no silent data loss
- **User experience**: Clear warnings and choices
- **Edge cases**: Deleted records, permission changes, etc.

## Non-Functional Requirements

- Sync should complete within 5 seconds
- User should see progress indicator during sync
- Failed syncs should retry with exponential backoff
- Conflicts should be logged for debugging
