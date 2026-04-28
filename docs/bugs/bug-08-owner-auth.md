# Bug #8: Restaurant Owner Can Request Inspection for Other Restaurants

**Assigned To**: Team 4
**Priority**: High
**Component**: API - Inspection Requests
**Type**: Authorization/Security Issue

## Description

While the API has authorization logic to prevent restaurant owners from requesting inspections for other restaurants, the check can be bypassed by modifying the `restaurantId` parameter in the API request. This allows unauthorized inspection requests to be created.

A restaurant owner should only be able to request inspections for their own restaurant, but they can currently bypass this restriction.

## Steps to Reproduce

**Note**: This is a security authorization bug that cannot be easily demonstrated through normal GUI usage. It requires understanding that the backend authorization check has a flaw.

**GUI Observation**:
1. Login as Restaurant Owner A (e.g., maria.garcia@downtownpizza.com)
2. Navigate to "Request Inspection" page
3. Observe that the form allows you to request an inspection
4. The GUI shows only your restaurant (correct)
5. Submit a legitimate request for your own restaurant (this works correctly)

**The Security Issue**:
While the GUI correctly shows only the owner's restaurant, the backend API has a flaw in its authorization check. If someone were to modify the request (using developer tools or API calls), they could potentially request inspections for other restaurants.

**Testing Approach**: Ask Claude Code to:
- Analyze what authorization checks SHOULD exist on the inspection request endpoint
- Identify how the API should verify restaurant ownership
- Create test scenarios for proper authorization

## Expected Result

- API returns **403 Forbidden** status code
- Error message: "You can only request inspections for your own restaurant"
- No inspection request is created
- Authorization check cannot be bypassed

## Actual Result

- API returns **201 Created** status code
- Inspection request is created for a restaurant the owner doesn't own
- System allows unauthorized requests
- Authorization check is present but ineffective

## Authorization Flow Analysis

**What should happen**:
1. Owner submits request with `restaurantId`
2. API checks: `user.restaurant_id === request.restaurantId`
3. If match: Create request ✓
4. If no match: Reject with 403 ✗

**What's actually happening**:
1. Owner submits request with modified `restaurantId`
2. API check may exist but has logic flaw
3. Request succeeds regardless of ownership ✗

## Technical Context (For Claude Code)

The following technical details are available in the code for Claude to analyze:
- API endpoint: `/server/routes/inspection-requests.js` around line 22-34
- Authorization logic exists but has an implementation flaw
- Should compare `user.restaurant_id` with `req.body.restaurantId`
- The check may exist but doesn't properly enforce the restriction
- Likely missing a `return` statement to actually stop unauthorized requests

**Your task as a tester**: Ask Claude Code to analyze the authorization implementation and identify why it's not effective. Create test cases for proper restaurant ownership verification.

## Security Implications

- **Data Integrity**: Inspection requests created for wrong restaurants
- **Business Impact**: Managers waste time on invalid requests
- **Abuse Potential**: Malicious users could spam other restaurants with fake requests
- **Compliance**: May violate data access regulations
- **Severity**: High (security vulnerability with business impact)

## Additional Test Cases

Test these authorization scenarios:
1. **Own restaurant**: Should succeed ✓
2. **Other restaurant (same city)**: Should fail ✗ (BUG)
3. **Nonexistent restaurant**: Should fail (404 or 403)
4. **Null/empty restaurantId**: Should fail (400)
5. **Invalid UUID format**: Should fail (400)
6. **Multiple restaurants**: If owner somehow owns multiple, both should work

## Attack Scenarios to Test

- **Parameter tampering**: Modify POST body before sending
- **Token manipulation**: Use valid token but wrong restaurant ID
- **Race conditions**: Send rapid requests with different IDs
- **SQL injection**: Try `restaurantId: "1' OR '1'='1"`
- **Type confusion**: Send number vs string vs object

## Test Strategy Considerations

Your test plan should include:
- **Positive tests**: Owner can request for own restaurant
- **Negative tests**: Owner CANNOT request for other restaurants
- **API security testing**: Try various bypass techniques
- **Error handling**: Clear, safe error messages (no info leakage)
- **Regression testing**: Ensure fix doesn't break valid requests
- **Integration testing**: Check end-to-end flow with frontend

## Acceptance Criteria for Fix

- ✅ Server-side authorization check is enforced (cannot be bypassed)
- ✅ Returns 403 for unauthorized restaurant IDs
- ✅ Returns clear error message
- ✅ No request created for unauthorized restaurants
- ✅ Audit log shows attempted unauthorized access
- ✅ Owner can still request for their own restaurant
- ✅ Admin/manager bypass still works (if intended)
