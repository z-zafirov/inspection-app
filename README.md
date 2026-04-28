# Restaurant Inspection System

**Workshop demo application for Claude Code Team-Based Workshop**
**Date**: April 30, 2026
**Status**: ✅ **COMPLETE - All Features Implemented**

---

## 📋 Overview

A complete restaurant inspection management system with:
- **Multi-role authentication** (Admin, Manager, Inspector, Restaurant Owner)
- **Mobile-first inspector interface** with 44px touch targets
- **Offline sync capabilities** using localStorage
- **Complete inspection workflow** from request → assignment → completion
- **RESTful API backend** with 13 endpoints
- **PostgreSQL database** via Supabase

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and configure:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Set Up Database

Run these SQL files in Supabase SQL Editor (in order):
1. `database/01_create_tables.sql`
2. `database/02_seed_data.sql`
3. `database/03_update_passwords.sql`
4. `database/04_workshop_accounts.sql` (adds team accounts and updates passwords)

### 4. Start the Server

```bash
cd server
npm start
```

Server runs on: **http://localhost:3000**

### 5. Access the Application

- **Landing Page**: http://localhost:3000/ (with login modal)
- **Dashboard**: http://localhost:3000/client/dashboard.html (auto-redirects by role)

---

## 🧪 Test Credentials

All passwords: **`Test1234!`**

### Workshop Team Structure

**4 Teams** with complete accounts for team-based exercises.

See `database/WORKSHOP_TEAMS.md` for complete team assignments.

**Account Summary:**
- **4 Managers** (1 per team)
- **16 Inspectors** (4 per team)
- **4 Restaurant Owners** (1 per team)
- **1 Admin** (facilitator only)

**Sample Accounts:**

| Role | Email | Team |
|------|-------|------|
| Manager | lisa.chen@management.com | Team 1 |
| Manager | robert.kim@management.com | Team 2 |
| Inspector | john.doe@example.com | Team 1 |
| Inspector | james.brown@example.com | Team 2 |
| Restaurant Owner | maria.garcia@downtownpizza.com | Team 1 |
| Restaurant Owner | alex.chen@sunrisecafe.com | Team 2 |

### Facilitator Account

| Role | Email | Use Case |
|------|-------|----------|
| Admin | admin@system.com | System overview & demonstrations |

**Note**: Credentials are distributed via team sheets. Login page does not display test credentials.

---

## 📂 Project Structure

```
inspection-app/
├── client/                          # Frontend application
│   ├── dashboard.html              # Role-based dashboard router
│   ├── dashboard-admin.html        # Admin dashboard
│   ├── dashboard-owner.html        # Restaurant owner dashboard
│   ├── dashboard-owner.js          # Owner dashboard logic
│   ├── dashboard-manager.html      # Manager dashboard
│   ├── dashboard-manager.js        # Manager assignment logic
│   ├── dashboard-inspector.html    # Inspector dashboard
│   ├── dashboard-inspector.js      # Inspector dashboard logic
│   ├── inspection-form.html        # Mobile-first inspection form
│   ├── inspection-form.js          # Offline sync + scoring logic
│   ├── login.html                  # Login page
│   ├── login.js                    # Authentication logic
│   ├── login.css                   # Login styles
│   ├── dashboard-styles.css        # Shared dashboard styles
│   └── styles.css                  # Global styles
├── landing/                         # Landing page
│   ├── index.html                  # Public landing page with login modal
│   ├── login.js                    # Login modal handler
│   └── styles.css                  # Landing page styles
├── server/                          # Backend API
│   ├── server.js                   # Express app entry point
│   ├── package.json                # Dependencies
│   ├── .env                        # Environment config (not in git)
│   ├── .env.example                # Environment template
│   ├── config/
│   │   └── supabase.js            # Supabase client (proxy-aware)
│   ├── middleware/
│   │   └── auth.js                # JWT authentication middleware
│   └── routes/
│       ├── auth.js                # POST /api/auth/login
│       ├── restaurants.js         # GET /api/restaurants/*
│       ├── inspection-requests.js # Inspection request endpoints
│       ├── inspections.js         # Inspection + scoring endpoints
│       ├── checklist-items.js     # GET /api/checklist-items
│       └── users.js               # GET /api/users
├── database/                        # Database scripts
│   ├── 01_create_tables.sql       # Create 6 tables
│   ├── 02_seed_data.sql           # Insert seed data
│   ├── 03_update_passwords.sql    # Update password hashes
│   ├── 04_workshop_accounts.sql   # Workshop team accounts
│   └── WORKSHOP_TEAMS.md          # Team assignments
├── test/                            # Manual testing resources
│   ├── test-cases.html            # Main landing page for testing tools
│   ├── bug-checklist.html         # Module 2A: Bug verification
│   └── feature-checklist.html     # Module 2B: Feature test planning
├── docs/                           # Documentation
│   ├── API-REFERENCE.md           # Complete API documentation
│   ├── DATABASE-SCHEMA.md         # Database structure
│   ├── DEPLOYMENT-GUIDE.md        # Deployment instructions
│   ├── IMPLEMENTATION-STATUS.md   # What's been built
│   ├── QUICK-REFERENCE.md         # Quick start guide
│   └── DEMO-PROJECT-ARCHITECTURE.md  # System architecture
└── README.md                       # This file
```

---

## ✅ Completed Features

### **Phase 1: Dashboard Designs**
- ✅ Admin dashboard with system overview
- ✅ Restaurant owner dashboard with inspection history
- ✅ Manager dashboard with request assignment
- ✅ Inspector dashboard with mobile interface
- ✅ Role-based routing and access control

### **Phase 2: Restaurant Owner Workflow**
- ✅ View restaurant information
- ✅ Request inspection with preferred date
- ✅ View inspection history
- ✅ Track pending requests

### **Phase 3: Manager Workflow**
- ✅ View pending inspection requests
- ✅ Assign inspectors to requests
- ✅ Set scheduled inspection dates
- ✅ Monitor inspector workload
- ✅ View scheduled inspections

### **Phase 4: Inspector Workflow (Mobile-First)**
- ✅ Mobile-optimized inspection form
- ✅ View assigned inspections
- ✅ Score checklist items (1-10 scale)
- ✅ Add notes to items
- ✅ Real-time progress tracking
- ✅ Overall score calculation
- ✅ Save draft functionality
- ✅ **Offline sync with localStorage**
- ✅ **Manual "Sync Now" button**
- ✅ **Online/offline status detection**
- ✅ Form validation (all items must be scored)
- ✅ 44px touch targets for mobile

### **Backend API**
- ✅ 13 RESTful endpoints
- ✅ JWT authentication (24-hour expiry)
- ✅ Role-based access control
- ✅ Bcrypt password hashing
- ✅ CORS configuration
- ✅ Proxy support for corporate networks
- ✅ Request logging

### **Database**
- ✅ 6 tables (users, restaurants, inspection_requests, inspections, checklist_items, checklist_scores)
- ✅ 25 seed users (1 admin, 4 managers, 16 inspectors, 4 owners)
- ✅ 8 sample restaurants
- ✅ 12 checklist items (kitchen, bar, main_hall)
- ✅ 6 sample inspections with scores

---

## 🔄 Complete Workflow

### 1. **Restaurant Owner Requests Inspection**
```
Login → Dashboard → Request Inspection → Select Date → Submit
Result: Request created with status "pending"
```

### 2. **Manager Assigns Inspector**
```
Login → View Pending Requests → Assign Inspector → Select Inspector & Date → Confirm
Result: Inspection created with status "scheduled"
```

### 3. **Inspector Conducts Inspection**
```
Login → View Assigned → Start Inspection → Score 11 Items → Add Notes → Complete
Result: Inspection status "completed" with overall score
```

### 4. **Inspector Works Offline**
```
Start Inspection → Enable Airplane Mode → Score Items → Save Draft → Disable Airplane Mode → Sync Now → Complete
Result: Data synced from localStorage to server
```

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Restaurants
- `GET /api/restaurants` - List all (Admin/Manager)
- `GET /api/restaurants/me` - Get my restaurant (Owner)

### Inspection Requests
- `POST /api/inspection-requests` - Create request (Owner)
- `GET /api/inspection-requests` - List requests
- `PUT /api/inspection-requests/:id/assign` - Assign inspector (Manager)

### Inspections
- `GET /api/inspections` - List inspections (role-filtered)
- `GET /api/inspections/:id` - Get inspection with scores
- `POST /api/inspections/:id/scores` - Submit checklist scores (Inspector)
- `PUT /api/inspections/:id/sync` - Manual sync (Inspector)

### Checklist Items
- `GET /api/checklist-items` - Get active items

### Users
- `GET /api/users` - List users (Admin/Manager)

### Health Check
- `GET /api/health` - Server health status

---

## 🧪 Testing

### Manual Testing
Open interactive test matrix:
```bash
open test/test-cases.html
```

**67 test cases** covering:
- Authentication (7 tests)
- Dashboards (17 tests)
- Inspection workflow (14 tests)
- Offline sync (9 tests)
- API endpoints (13 tests)
- Security (4 tests)
- Integration (4 tests)

### Test on Mobile
1. Start server on your computer
2. Find your local IP: `ifconfig | grep inet`
3. On phone, navigate to: `http://YOUR_IP:3000`
4. Login as inspector
5. Test offline mode with airplane mode

---

## 📱 Mobile Features

- ✅ **Touch-optimized**: All buttons minimum 44px
- ✅ **Responsive layout**: Adapts to phone/tablet screens
- ✅ **Sticky header**: Restaurant info always visible
- ✅ **Fixed footer**: Actions always accessible
- ✅ **Offline-first**: Works without internet
- ✅ **Auto-save**: Data persists in localStorage
- ✅ **Manual sync**: "Sync Now" button when online
- ✅ **Visual feedback**: Score selection, progress bar

---

## 🔐 Security

- ✅ JWT token authentication
- ✅ Bcrypt password hashing (cost factor 10)
- ✅ Role-based access control (RBAC)
- ✅ Protected API routes
- ✅ CORS configuration
- ✅ Parameterized SQL queries
- ✅ Environment variables for secrets

---

## 📚 Documentation

Comprehensive documentation available in `docs/`:

- **QUICK-REFERENCE.md** - Quick start guide and cheat sheets
- **API-REFERENCE.md** - Complete API documentation with examples
- **DATABASE-SCHEMA.md** - Database structure and relationships
- **DEPLOYMENT-GUIDE.md** - Local and Azure deployment instructions
- **IMPLEMENTATION-STATUS.md** - Detailed implementation status
- **DEMO-PROJECT-ARCHITECTURE.md** - System architecture overview

---

## 🚀 Deployment

### Local Development
```bash
cd server
npm install
npm start
```

### Azure App Service
See `docs/DEPLOYMENT-GUIDE.md` for complete Azure deployment instructions.

Quick deploy:
```bash
az webapp deployment source config-zip \
  --name your-app-name \
  --resource-group your-rg \
  --src deploy.zip
```

---

## 🛠️ Technology Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Mobile-first responsive design
- LocalStorage API for offline sync
- Navigator.onLine for network detection

### Backend
- Node.js 18+
- Express.js 4.x
- JWT authentication
- Bcrypt password hashing

### Database
- PostgreSQL (via Supabase)
- 6 tables with referential integrity
- UUID primary keys
- Indexed for performance

### Development Tools
- Git version control
- Supabase SQL Editor
- VS Code
- Chrome DevTools

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Check Node version (requires 18+)
node --version

# Reinstall dependencies
cd server
rm -rf node_modules
npm install
```

### Database connection failed
- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env`
- Check Supabase project is active
- If behind proxy, set `HTTP_PROXY` and `HTTPS_PROXY`

### Login fails
- Verify database seed scripts ran successfully (especially 04_workshop_accounts.sql)
- Check password is exactly: `Test1234!`
- Clear browser cache and try again

### Offline sync not working
- Ensure using HTTPS or localhost (localStorage restrictions)
- Check browser console for errors
- Clear localStorage: `localStorage.clear()`

---

## 📊 System Statistics

- **Total Files**: 40+ files
- **Lines of Code**: ~5,000 lines
- **API Endpoints**: 13 endpoints
- **Database Tables**: 6 tables
- **Seed Data**: 25 users (1 admin, 4 managers, 16 inspectors, 4 owners), 8 restaurants, 12 checklist items, 6 inspections
- **Test Cases**: 67 comprehensive tests
- **Documentation**: 7 detailed guides

---

## 🎯 Workshop Demo Scenarios

### Scenario 1: Complete Workflow (20 min)
1. Owner requests inspection
2. Manager assigns inspector
3. Inspector conducts and completes
4. Owner views results

### Scenario 2: Mobile Offline (15 min)
1. Inspector starts inspection on phone
2. Goes offline (airplane mode)
3. Scores items and saves draft
4. Goes online and syncs
5. Completes inspection

### Scenario 3: Manager Workload (10 min)
1. Multiple pending requests
2. Assign to different inspectors
3. Monitor workload balance
4. View scheduled inspections

---

## 🔮 Future Enhancements

Not implemented (optional future work):
- Analytics dashboard with charts
- Photo upload for inspection evidence
- Email/SMS notifications
- PDF report generation
- PWA service worker for full offline
- Automated testing (Jest, Playwright)
- Manager approval workflow
- Multi-language support

---

## 📝 Version History

- **v1.0** (2026-04-21) - Complete implementation
  - All 4 phases complete
  - Mobile-first inspector interface
  - Offline sync functionality
  - 13 API endpoints
  - 67 test cases
  - Complete documentation

---

## 🤝 Support

- **API Reference**: `docs/API-REFERENCE.md`
- **Quick Reference**: `docs/QUICK-REFERENCE.md`
- **Deployment Guide**: `docs/DEPLOYMENT-GUIDE.md`
- **Test Cases**: Open `test/test-cases.html` in browser

---

**Status**: ✅ Production Ready | **Workshop Ready**: ✅ Yes | **Last Updated**: 2026-04-22
