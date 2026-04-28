# Bug #5: Manager Can Submit Scores for Unassigned Inspections

**Assigned To**: Team 3
**Priority**: Medium
**Component**: API - Authorization
**Type**: Access Control Issue

## Description

Managers have permission to submit inspection scores for ANY inspection in the system, even those not assigned to any inspector or assigned to a different team's inspector. This bypasses the intended workflow where only the assigned inspector (or their manager) should be able to submit scores.

This creates potential for unauthorized score modifications and workflow confusion.

## Steps to Reproduce

**Note**: This is an authorization bug that's difficult to test through normal GUI workflows. The issue is that the backend doesn't properly check manager permissions.

**GUI Testing Approach**:
1. Login as Manager A (e.g., lisa.chen@management.com)
2. Navigate to the manager dashboard
3. Observe which inspections Manager A can see and manage
4. Login as Manager B (e.g., robert.kim@management.com from Team 2)
5. Assign an inspection to one of Manager B's inspectors
6. The question: Should Manager A be able to submit scores for Manager B's inspections?

**Current Issue**:
The system allows any manager to submit scores for any inspection, regardless of team assignment. While the GUI doesn't expose this functionality, the API doesn't enforce proper authorization.

**Testing Approach**: Ask Claude Code to:
- Analyze what authorization rules SHOULD exist
- Identify which manager actions should be restricted
- Create test scenarios for proper access control

## Expected Result

- API returns **403 Forbidden** status code
- Error message: "You cannot submit scores for inspections outside your team" (or similar)
- No data is written to database
- Only authorized users (assigned inspector, their manager) can submit scores

## Actual Result

- API returns **200 OK**
- Scores are successfully submitted
- Manager can modify any inspection regardless of assignment

## Authorization Matrix

| User Role | Own Inspection | Team Inspection | Other Team | Expected |
|-----------|---------------|-----------------|------------|----------|
| Inspector | ✅ Allow | ❌ Deny | ❌ Deny | Correct |
| Manager | ✅ Allow | ✅ Allow | ❌ Deny | **BUG: Currently allows** |
| Owner | ❌ Deny | ❌ Deny | ❌ Deny | Correct |
| Admin | ✅ Allow | ✅ Allow | ✅ Allow | Correct (by design) |

## Additional Test Cases

Test these authorization scenarios:
1. **Inspector submits own inspection**: Should succeed
2. **Inspector submits other's inspection**: Should fail (already works)
3. **Manager submits team inspection**: Should succeed
4. **Manager submits other team's inspection**: Should fail (BUG)
5. **Manager submits unassigned inspection**: Should fail (BUG)
6. **Owner submits own restaurant**: Should fail (already works)
7. **Admin submits any inspection**: Should succeed (by design)

## Technical Context (For Claude Code)

The following technical details are available in the code for Claude to analyze:
- API endpoint: `/server/routes/inspections.js` around line 181
- This is the `POST /:id/scores` endpoint
- Currently lacks proper authorization logic
- Should check the relationship between manager and inspector
- Needs to define "manager's team" concept

**Your task as a tester**: Ask Claude Code to analyze the authorization logic that SHOULD exist and create test cases for proper access control.

## Business Impact

- **Workflow Integrity**: Managers can bypass proper assignment flow
- **Data Accuracy**: Scores could be entered by unauthorized managers
- **Audit Trail**: Unclear who should have access to which inspections
- **Severity**: Medium (security but may not be exploited in normal use)

## Design Decisions Needed

When fixing this, consider:
- **Does the system have team/region concepts?** If not, should all managers have equal access?
- **Should managers only submit for their assigned inspectors?** Or any inspection they initiated?
- **What about manager overrides?** Should managers be able to override inspector scores?
- **Admin role**: Should admins bypass all checks? (probably yes)

## Test Strategy Considerations

Your test plan should include:
- **Positive tests**: Authorized users can submit (inspector, their manager, admin)
- **Negative tests**: Unauthorized users get 403 (other managers, owners, inspectors)
- **Boundary tests**: Edge cases like unassigned inspections, deleted inspectors
- **Regression tests**: Ensure valid workflows still work after fix
- **API security**: Can't bypass via token manipulation or parameter tampering
