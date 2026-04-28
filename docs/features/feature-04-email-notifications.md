# Feature #4: Email Notifications for Inspection Events

**Assigned To**: Team 2
**Priority**: Medium
**Component**: Backend - Notifications
**Type**: Communication/Automation

## User Story
**As a** system user
**I want to** receive email notifications for important inspection events
**So that** I stay informed without constantly checking the dashboard

## Notification Triggers

| Event | Recipient | Subject | Content |
|-------|-----------|---------|---------|
| Inspection assigned | Inspector | "New Inspection Assigned" | Restaurant, date, view link |
| Request scheduled | Owner | "Inspection Scheduled" | Inspector, date, view link |
| Inspection completed | Owner | "Inspection Complete" | Score, inspector, view link |
| Daily digest (8 AM) | Manager | "Pending Requests Summary" | Count, list, dashboard link |

## Acceptance Criteria

### 1. Email Content
- Clear subject line: "[Inspection System] - [Event Type]"
- Restaurant name and address
- Scheduled date (for assignments/scheduling)
- Inspector name (for owners)
- Direct link to dashboard page
- Unsubscribe link at bottom

### 2. User Preferences
- Add "Notification Preferences" in user profile
- Toggle switch for each notification type
- Save preferences per user
- Default: All enabled for new users

### 3. Technical Requirements
- Use email service (SendGrid, AWS SES, or similar)
- Queue emails (async, don't block API responses)
- Retry failed sends up to 3 times
- Log all attempts for debugging
- Template system for email content

## Test Planning Guide

**Your Role as a Tester**: Create test scenarios for email delivery and user preferences.

**Testing Approach**:
1. **Functional Testing**: Verify emails are sent for each trigger event
2. **Content Testing**: Check email contains correct information and links
3. **Preference Testing**: Test user controls over notification settings
4. **Timing Testing**: Verify emails arrive within expected timeframe
5. **Error Handling**: Test retry logic and failure scenarios

**Suggested Claude Code Prompts**:
```
"Analyze the email notification feature and create a test plan including:
- All 4 notification triggers (assignment, scheduling, completion, daily digest)
- User preference toggle functionality
- Email content verification (subject, body, links)
- Timing and delivery tests
- Error handling and retry scenarios"

"What tests should verify that email links work correctly and lead to the right dashboard pages?"

"Create test scenarios for the notification preferences UI and persistence"
```

**Key Test Scenarios**:
1. Inspector assigned - receives email within 1 minute
2. Owner receives completion email with correct score
3. Manager gets daily digest at 8 AM
4. User toggles preference off - no email sent
5. Email service down - retries 3 times, logs failure
6. Links in email work correctly
7. Unsubscribe works
8. Change preferences - saves correctly
9. New user - all preferences enabled by default
10. Multiple events in short time - all emails sent

**Note**: Email testing may require checking inbox or using email testing services. Ask Claude Code about email testing strategies.

## Technical Context (For Claude Code)

Technical considerations:
- Email service integration (SendGrid, AWS SES)
- Queue system for async email sending
- Retry logic with exponential backoff
- Email template system
- Preference storage in database
- Unsubscribe token generation
- Daily digest scheduling (cron job or similar)

**For Testers**: Claude Code can help analyze potential failure points and suggest comprehensive error scenario tests.
