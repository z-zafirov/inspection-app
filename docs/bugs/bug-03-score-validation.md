# Bug #3: Missing Server-Side Validation for Score Values

**Assigned To**: Team 2
**Priority**: High
**Component**: API - Inspection Scores
**Type**: Security/Data Integrity Issue

## Description

The inspection scoring API endpoint accepts scores outside the valid range (1-10) without validation. A malicious user or a bug in the frontend could submit scores like 0, 15, -5, or even non-numeric values, causing data integrity issues and potentially breaking calculations.

Valid scores must be integers between 1 and 10 (inclusive), but the API currently accepts any value.

## Steps to Reproduce

**Note**: This bug is difficult to test through the GUI alone since the frontend prevents invalid scores. Testing requires understanding that the API lacks validation. The code is available to help Claude Code suggest the proper validation that should exist.

**Scenario**: What happens if the frontend validation is bypassed?
1. Login as an inspector
2. Navigate to an assigned inspection
3. Observe that the GUI only allows scores 1-10 (correct)
4. However, the API endpoint that receives these scores has no validation
5. This means if the frontend had a bug, or someone used developer tools to bypass the UI, invalid scores could be saved
6. This is a **backend security issue** - the API should validate all inputs

**Testing Approach**: Since direct API testing is out of scope, ask Claude Code to:
- Analyze what validation SHOULD exist on the score submission endpoint
- Identify what invalid inputs the API should reject
- Suggest test cases for proper validation

## Expected Result

- API returns **400 Bad Request** status code
- Error message: "Scores must be between 1 and 10"
- No data is written to the database
- Clear indication of which scores are invalid

## Actual Result

- API returns **200 OK**
- Invalid scores are accepted and saved
- Database contains data outside valid range
- Overall score calculations may be incorrect

## Additional Test Cases

Test these invalid inputs:
- **Score = 0**: Below minimum (should reject)
- **Score = 11**: Above maximum (should reject)
- **Score = -5**: Negative number (should reject)
- **Score = 100**: Far above maximum (should reject)
- **Score = 5.5**: Decimal number (should reject - only integers allowed)
- **Score = "abc"**: Non-numeric string (should reject)
- **Score = null**: Missing score (should reject)
- **Score = undefined**: Missing field (should reject)

**Valid boundary cases**:
- Score = 1: Minimum valid (should accept)
- Score = 10: Maximum valid (should accept)

## Technical Context (For Claude Code)

The following technical details are available in the code for Claude to analyze:
- API endpoint: `/server/routes/inspections.js` around line 157-168
- This is the scores submission endpoint
- Currently lacks input validation before database insert
- Should validate that scores are integers between 1 and 10
- Should also validate overall score calculation

**Your task as a tester**: Ask Claude Code to analyze the code and identify what validation is missing, then create a test plan for what validation SHOULD exist.

## Security Implications

- **Data Integrity**: Invalid data corrupts the database
- **Report Accuracy**: Analytics and reports show incorrect data
- **Business Impact**: Restaurant scores could be manipulated
- **Severity**: High (security and data quality issue)

## Related Issues

Consider these related validation needs:
- Should scores be required for ALL checklist items?
- What if overall score doesn't match the average of item scores?
- Should there be validation on the number of scores submitted?

## Test Strategy Considerations

Your test plan should include:
- **Boundary value testing**: 0, 1, 10, 11
- **Invalid data types**: Strings, nulls, objects
- **Negative testing**: All rejection scenarios
- **Positive testing**: Valid scores still work
- **API security testing**: Can't bypass validation
- **Database verification**: No invalid data persists
