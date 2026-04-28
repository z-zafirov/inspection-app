# Manual Testing Resources

This directory contains interactive HTML tools and test data for manual testing during the workshop.

## Contents

### Interactive HTML Tools

📄 **[test-cases.html](./test-cases.html)** - Main landing page
- Overview of all testing resources
- Links to bug verification and feature testing tools
- Workflow guidance
- Quick links to documentation and live app

🐛 **[bug-checklist.html](./bug-checklist.html)** - Module 2A: Bug Verification
- Team-based bug reproduction checklists
- Step-by-step verification tracking
- Notes and observations section
- Progress tracking
- Export verification reports

✨ **[feature-checklist.html](./feature-checklist.html)** - Module 2B: Feature Test Planning
- Interactive test case creator
- Suggested test scenarios for each feature
- Claude Code prompts for analysis
- Test case templates
- Export test plans

### Test Credentials

🔐 **Test user credentials** are provided separately by the workshop instructor
- NOT stored in this public repository
- Distributed via printed handouts at workshop start
- See facilitator guide for credential information

## How to Use

### During Module 2A (Bug Verification - 40 min)

1. Open `bug-checklist.html` in your browser
2. Select your team from the dropdown
3. Work through each bug reproduction step-by-step:
   - Check off completed steps
   - Document observations in notes
   - Mark when bug is successfully reproduced
4. Save progress (auto-saves to browser localStorage)
5. Export your verification report

### During Module 2B (Feature Test Planning - 50 min)

1. Open `feature-checklist.html` in your browser
2. Select your team from the dropdown
3. For each assigned feature:
   - Review suggested test scenarios
   - Use the provided Claude Code prompts
   - Create your own test cases using the "Add Test Case" button
   - Fill in: Title, Steps, Expected Result
4. Save progress regularly
5. Export your test plan

### Features

**Auto-Save**:
- All progress is automatically saved to browser localStorage
- Work is preserved even if you close the browser
- Each team's data is stored separately

**Export**:
- Bug verification reports export as `.txt` files
- Feature test plans export as `.txt` files
- Include timestamp and team information
- Ready to share with team or instructor

**Team-Based**:
- Each team sees only their assigned bugs and features
- Team 1: Bugs 1-2, Features 1-2
- Team 2: Bugs 3-4, Features 3-4
- Team 3: Bugs 5-6, Features 5-6
- Team 4: Bugs 7-8, Features 7-8

## Integration with Workshop

### Module Flow

```
Module 2A (40 min)
    ↓
Use bug-checklist.html
    ↓
Reproduce & verify bugs
    ↓
Export verification report
    ↓
Module 2B (50 min)
    ↓
Use feature-checklist.html
    ↓
Create test cases (knowing bugs from 2A)
    ↓
Export test plan
    ↓
Module 3 & 4 (Optional automation)
```

### Connecting to Automation (Module 4)

Your test cases from `feature-checklist.html` can be used to:
- Generate automated tests with Claude Code
- Serve as specifications for Playwright tests
- Provide test data for automation framework

Example workflow:
1. Complete feature test planning in `feature-checklist.html`
2. Export test plan
3. Ask Claude Code: "Generate Playwright tests from these test cases"
4. Add generated tests to `/inspection-automation/tests/ui/` or `/inspection-automation/tests/api/`

## Tips

**For Participants**:
- 💾 Save frequently (or rely on auto-save)
- 📝 Use notes sections generously - capture all observations
- 🤝 Discuss findings with team before finalizing
- 💡 Use Claude Code prompts provided in feature planning
- 📤 Export before moving to next module

**For Facilitators**:
- Open `test-cases.html` as the starting point
- Guide teams to select correct team number
- Remind teams to export their work
- These tools work offline (localStorage only)
- Can be used post-workshop for reference

## Technical Details

**Technology**:
- Pure HTML + CSS + JavaScript
- No server required
- No dependencies
- Works in any modern browser
- Uses localStorage API for persistence

**Browser Compatibility**:
- Chrome, Firefox, Safari, Edge (latest versions)
- localStorage must be enabled

**Data Storage**:
- Stored in browser localStorage
- Keys: `bugChecklist_{team}` and `featureTests_{team}`
- Data persists until browser cache is cleared
- Each team's data is isolated

## Troubleshooting

**Progress not saving?**
- Check if localStorage is enabled in browser
- Check browser console for errors
- Try clicking "Save Progress" manually

**Can't see my team's bugs/features?**
- Ensure you selected correct team from dropdown
- Try refreshing the page
- Check if you're using correct HTML file (bug vs feature)

**Lost my work?**
- If localStorage was cleared, data is gone
- Always export important work as backup
- Export creates downloadable text files

## Future Enhancements

Possible additions for future workshops:
- Real-time collaboration between team members
- Integration with automation framework
- Test execution tracking
- Screenshots/evidence attachment
- Sync to cloud storage

---

**Workshop**: Claude Code Testing Workshop
**Version**: 1.0
**Last Updated**: 2026-04-28
