# Workshop Documentation

This directory contains sanitized workshop materials for the Restaurant Inspection System.

## Contents

- **bugs/** - Bug reports for workshop teams to analyze and test
- **features/** - Feature requirements for test planning exercises
- **workshop-guide.md** - General workshop information (no credentials)

## Important Notes

⚠️ **Credentials are NOT included in this directory for security reasons.**

Workshop participants will receive access credentials separately via:
- Printed handout cards (distributed in-person)
- Workshop registration email
- Or instructor announcement

## Bug/Feature Assignment

Each team has 2 bugs and 2 features assigned:
- **Team 1**: Bugs 1-2, Features 1-2
- **Team 2**: Bugs 3-4, Features 3-4
- **Team 3**: Bugs 5-6, Features 5-6
- **Team 4**: Bugs 7-8, Features 7-8

Plus shared discovery bugs:
- **Bug 9**: "Loading..." badge issue (Module 1 discovery)
- **Bug 10**: Score range mismatch (found during pre-workshop testing)

## Structure

```
docs/
├── README.md (this file)
├── workshop-guide.md
├── bugs/
│   ├── bug-01-score-decimal.md
│   ├── bug-02-past-dates.md
│   ├── bug-03-score-validation.md
│   ├── bug-04-offline-sync.md
│   ├── bug-05-manager-auth.md
│   ├── bug-06-cache-loading.md
│   ├── bug-07-progress-bar.md
│   ├── bug-08-owner-auth.md
│   ├── bug-09-loading-badge.md
│   └── bug-10-score-range-mismatch.md
└── features/
    ├── feature-01-pdf-export.md
    ├── feature-02-date-filter.md
    ├── feature-03-bulk-assignment.md
    ├── feature-04-email-notifications.md
    ├── feature-05-inspection-history.md
    ├── feature-06-photo-attachments.md
    ├── feature-07-inspector-workload.md
    └── feature-08-offline-indicator.md
```

## Usage

Participants should:
1. Clone this repository
2. Read bug/feature descriptions in this directory
3. Use Claude Code to analyze requirements
4. Create test plans based on these specifications

Credentials will be provided separately by the workshop instructor.
