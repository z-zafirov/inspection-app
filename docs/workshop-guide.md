# Claude Code Workshop Guide

## Workshop Overview

**Title**: Hands-On Testing with Claude Code
**Duration**: Full day (09:00 - 17:15)
**Format**: Team-based discovery + Rotating skill stations
**Participants**: 12-16 people in teams of 3-4

## Workshop Structure

### Morning: Guided Team Modules (09:00 - 12:45)

| Time | Module | Activity |
|------|--------|----------|
| 09:00-09:30 | Setup | Claude Code installation & authentication |
| 09:30-09:45 | Demo | Live instructor demonstration |
| 09:45-10:30 | Module 1 | Understanding the Business |
| 10:30-11:20 | Module 2 | Test Planning from Requirements |
| 11:20-12:20 | Module 3 | Test Generation |
| 12:20-12:45 | Module 4 | Debugging |

### Afternoon: Rotating Skill Stations (13:45 - 17:15)

Teams rotate through 4 hands-on stations:
1. **Advanced Test Generation** - Complex integration tests
2. **Deep Debugging** - Progressive debugging challenges
3. **Test Analysis & Coverage** - Gap identification
4. **Documentation & Reporting** - Professional deliverables

## Module Details

### Module 1: Understanding the Business
**Focus**: Business logic and GUI exploration
- Explore the live system as different user roles
- Use Claude to understand workflows
- Compare GUI experience with Claude's explanations
- No technical/API focus yet

### Module 2: Test Planning
**Focus**: Analyzing requirements and creating test strategies
- Each team receives 2 bugs and 2 features (see `/docs/bugs/` and `/docs/features/`)
- Use Claude to analyze requirements
- Create comprehensive test plans
- Identify edge cases and gaps

### Module 3: Test Generation
**Focus**: Creating actual tests with Claude
- Generate API tests (REST Assured or similar)
- Generate UI tests (Playwright or similar)
- Follow project patterns
- Review and validate generated code

### Module 4: Debugging
**Focus**: Fixing broken tests
- Debug provided failing tests
- Determine if test issue or application bug
- Use Claude for root cause analysis
- Fix and verify solutions

## Demo Project: Restaurant Inspection System

**What it is**: Quality inspection platform for restaurants with multiple user roles.

**User Roles**:
- **Restaurant Owner**: Requests inspections for their restaurant
- **Manager**: Assigns inspections to inspectors
- **Inspector**: Conducts inspections using mobile forms
- **Admin**: System oversight (instructor only)

**Key Features**:
- Inspection request workflow
- Mobile-first inspection forms
- Offline mode support
- Score calculation and reporting
- Role-based dashboards

## Team Assignments

Each team has:
- **2 Bugs** to analyze and create test plans for
- **2 Features** to design test strategies for

**Team Assignments**:
- **Team 1**: Bugs 1-2, Features 1-2
- **Team 2**: Bugs 3-4, Features 3-4
- **Team 3**: Bugs 5-6, Features 5-6
- **Team 4**: Bugs 7-8, Features 7-8
- **Discovery Bug**: Bug 9 (all teams can find during Module 1)

See `/docs/bugs/` and `/docs/features/` directories for detailed descriptions.

## Access & Credentials

**IMPORTANT**: Access credentials are provided separately by the workshop instructor.

You will receive:
- Live system URL
- Login credentials for your team
- GitHub repository access
- Any additional resources

**DO NOT** share credentials or attempt to access other teams' data.

## Getting Started

### Prerequisites
- Laptop with internet connection
- Modern browser (Chrome, Firefox, Safari, Edge)
- Claude Code CLI installed
- Git installed

### Setup Steps
1. **Install Claude Code** (if not already done)
2. **Authenticate** using provided API key
3. **Clone repository**: `git clone [provided-url]`
4. **Navigate to project**: `cd inspection-app`
5. **Explore docs**: Review `/docs/bugs/` and `/docs/features/`

### Using Claude Code
```bash
# Start Claude in project directory
cd inspection-app
claude

# Example prompts
"What does this Restaurant Inspection System do?"
"Analyze bug-01-score-decimal.md and create a test plan"
"Help me debug this failing test"
```

## Tips for Success

### Working with Claude
- **Be Specific**: "Analyze this specific bug" vs "tell me about bugs"
- **Iterate**: Ask follow-up questions to refine responses
- **Verify**: Review Claude's suggestions before using
- **Learn Patterns**: Notice what prompts work well

### Team Collaboration
- **Support Each Other**: Mixed skill levels - help teammates
- **Divide & Conquer**: Explore different aspects, then combine insights
- **Discuss**: Talk about Claude's responses, don't just copy

### During Workshop
- **Don't Rush**: Understanding > completion
- **Ask Questions**: Instructors are here to help
- **Experiment**: Try different approaches
- **Have Fun**: Hands-on learning!

## Success Criteria

By the end of the workshop, you should be able to:
- ✅ Use Claude Code to understand unfamiliar codebases
- ✅ Analyze requirements and create test plans
- ✅ Generate tests following project patterns
- ✅ Debug failing tests efficiently
- ✅ Apply Claude Code to your actual work

## Resources

### Workshop Materials
- This guide: `/docs/workshop-guide.md`
- Bugs: `/docs/bugs/`
- Features: `/docs/features/`
- Main README: `/README.md`

### External Resources
- Claude Code documentation: https://docs.claude.ai/claude-code
- GitHub repository: [Provided by instructor]
- Live system: [Provided by instructor]

## After the Workshop

### Continue Learning
- Start using Claude Code at work
- Try it on your actual projects
- Share with your team
- Build context documentation for your domain

### Feedback
Please share:
- What worked well for you?
- What will you use in your daily work?
- What questions remain?
- Suggestions for improvement?

---

**Good luck and enjoy hands-on learning!** 🚀

**Note**: This is a sanitized guide for public distribution. Sensitive information (credentials, API keys, internal URLs) is distributed separately by the instructor.
