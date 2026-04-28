# Bug #10: Score Range Database Constraint Mismatch

**Assigned To**: Discovery Exercise (Found During Testing)
**Priority**: High
**Component**: Database Schema vs UI
**Type**: Data Integrity / Validation Issue

## Description

The inspection form UI allows inspectors to select scores from 1-10, but the database has a CHECK constraint limiting scores to 1-7. When an inspector selects a score of 8, 9, or 10 for any checklist item, the submission fails with a 500 Internal Server Error.

This creates a broken user experience where the UI permits certain values that the backend rejects, with no clear error message to the user.

## Steps to Reproduce

1. Login as an inspector
2. Navigate to any assigned inspection
3. Open the inspection form (checklist page)
4. Observe score buttons: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 are all available
5. Select score **8, 9, or 10** for any checklist item
6. Fill out remaining items (can use scores 1-7 for others)
7. Click "Complete Inspection" or "Sync Now"
8. Observe error message: "Failed to save checklist scores"
9. Check browser console: Shows 500 Internal Server Error
10. Check Network tab: POST to `/api/inspections/{id}/scores` returns 500

## Expected Result

**One of these should be true**:
- **Option A**: If 1-10 scale is correct, database should accept all values 1-10
- **Option B**: If 1-7 scale is correct, UI should only show buttons 1-7
- **Option C**: Frontend validation should prevent selecting invalid values before submission
- **Option D**: Backend should return 400 Bad Request with clear message: "Score must be between 1 and 7"

## Actual Result

- UI shows buttons 1-10 (suggests 1-10 is valid)
- Database constraint limits to 1-7 (enforces different range)
- Submission fails with generic 500 error
- No clear indication to user what went wrong
- No frontend validation to prevent issue

## Root Cause

**Database constraint** in `checklist_scores` table:
```sql
ALTER TABLE checklist_scores
ADD CONSTRAINT check_score_range
CHECK (score >= 1 AND score <= 7);
```

**Frontend implementation** in `client/inspection-form.js` (line ~194-207):
```javascript
function renderScoreButtons(itemId) {
  let buttons = '';
  for (let i = 1; i <= 10; i++) {  // ← Renders 1-10
    const isSelected = scores[itemId]?.score === i;
    buttons += `
      <button class="score-btn ${isSelected ? 'selected' : ''}"
              onclick="setScore('${itemId}', ${i})">
        ${i}
      </button>
    `;
  }
  return buttons;
}
```

**Backend** in `server/routes/inspections.js` (line ~200):
- No validation before database insert
- Relies on database constraint
- Returns generic error on constraint violation

## Technical Context (For Claude Code)

The following technical details are available in the code for Claude to analyze:

**Database Design**:
- Database has a constraint limiting scores to 1-7
- Database schema file: `database/01_create_tables.sql`
- Schema comments indicate "1-7 scale" was the original design
- Overall score stored as DECIMAL(4,2) with range 0.00 - 7.00

**Frontend Implementation**:
- UI file: `client/inspection-form.js` around line 194-207
- The score buttons render options 1 through 10
- This creates a mismatch: UI allows 1-10, database only accepts 1-7

**Backend**:
- Server file: `server/routes/inspections.js` around line 200
- No validation before database insert
- Relies solely on database constraint
- When constraint violated, returns generic 500 error

**The Conflict**: UI was updated to 1-10 scale but database constraint wasn't updated.

**Your task as a tester**: Ask Claude Code to analyze this mismatch and create test cases that verify the score range is consistent between frontend, backend, and database.

## Business Impact

- **Critical**: Inspectors cannot complete inspections if they use scores 8-10
- **User Frustration**: No clear error message, appears as system failure
- **Data Loss**: Inspectors may lose work if they don't realize scores aren't saved
- **Training Issue**: Inconsistent scoring scale causes confusion
- **Severity**: High (blocks core functionality)

## Possible Fixes

### **Fix Option A: Update Database to 1-10 Scale** (Recommended)
```sql
-- Drop old constraint
ALTER TABLE checklist_scores DROP CONSTRAINT check_score_range;

-- Add new constraint for 1-10 range
ALTER TABLE checklist_scores
ADD CONSTRAINT check_score_range
CHECK (score >= 1 AND score <= 10);

-- Update schema comments
COMMENT ON COLUMN inspections.overall_score IS 'Average score of all checklist items (1-10 scale)';
```

**Pros**: Matches current UI expectations
**Cons**: Changes data model, may affect existing data/reports

---

### **Fix Option B: Update UI to 1-7 Scale**
```javascript
// Change loop from 1-10 to 1-7
for (let i = 1; i <= 7; i++) {
```

**Pros**: Matches database constraint, simpler scale
**Cons**: Less granular scoring, requires UI changes

---

### **Fix Option C: Add Frontend Validation**
```javascript
// Validate before submission
if (score < 1 || score > 7) {
  alert('Scores must be between 1 and 7');
  return;
}
```

**Pros**: Prevents error, gives clear feedback
**Cons**: Doesn't fix root mismatch, confusing if buttons show 1-10

---

### **Fix Option D: Better Backend Error Handling**
```javascript
// In server/routes/inspections.js
// Validate scores before database insert
scores.forEach(score => {
  if (score.score < 1 || score.score > 7) {
    return res.status(400).json({
      error: 'Scores must be between 1 and 7'
    });
  }
});
```

**Pros**: Clear error message, prevents 500 error
**Cons**: Doesn't fix root mismatch

---

## Recommended Solution

**Implement ALL of these**:
1. **Decide on correct scale** (1-7 or 1-10) - likely 1-10 based on UI
2. **Update database constraint** to match UI
3. **Add frontend validation** to prevent invalid input
4. **Add backend validation** with clear error messages (defense in depth)
5. **Update all comments** and documentation

## Test Strategy

### Functional Tests
1. Submit inspection with scores 1-7 only - should succeed
2. Submit inspection with score 8 - should succeed (after fix) or show validation error
3. Submit inspection with score 10 - should succeed (after fix) or show validation error
4. Submit inspection with score 0 - should fail with validation error
5. Submit inspection with score 11 - should fail with validation error

### Validation Tests
6. Frontend validation prevents selecting invalid scores (if implemented)
7. Backend returns 400 (not 500) for invalid scores
8. Error message clearly states valid range
9. Database constraint matches validation rules

### Edge Cases
10. Mix of valid and invalid scores - which error handling wins?
11. Update existing inspection scores to invalid values - handled correctly?
12. Overall score calculation with new range

### Regression Tests
13. Existing inspections with 1-7 scores still work
14. Score display in dashboards uses correct scale
15. Reports and analytics updated for new range (if changed)

## Related Issues

- May relate to Bug #1 (decimal formatting) if overall_score range changes
- May relate to Bug #3 (score validation) - similar validation gap

## Discovery Notes

**Found during**: Pre-workshop testing by instructor
**Discovered by**: Testing inspection submission workflow
**Impact**: Would block workshop participants from completing exercises
**Status**: Documented for workshop or pre-workshop fix

## Non-Functional Requirements

- Error messages must be user-friendly and actionable
- Validation should happen both client-side and server-side
- Database constraints should match application logic
- Documentation should reflect actual implementation
