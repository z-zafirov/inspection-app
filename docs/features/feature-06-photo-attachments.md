# Feature #6: Photo Attachments for Checklist Items

**Assigned To**: Team 3
**Priority**: Low
**Component**: Mobile Inspection Form
**Type**: Evidence/Documentation

## User Story
**As an** inspector
**I want to** attach photos to specific checklist items
**So that** I can provide visual evidence of issues found during inspections

## Acceptance Criteria

### 1. Photo Capture
- "Add Photo" button for each checklist item
- Opens device camera OR file picker
- Support up to 3 photos per item
- File size limit: 5MB per photo
- Auto-compress images > 2MB

### 2. Photo Preview
- Thumbnail previews below checklist item
- Click thumbnail to view full size
- "X" button to remove photo
- Photos saved to localStorage when offline
- Show upload status icon (pending/uploaded)

### 3. Photo Upload
- Upload when online or during sync
- Progress bar for uploads
- Store in cloud storage (Supabase Storage or similar)
- Link photo URLs to checklist_scores table

### 4. Display in Reports
- Photos visible in inspection details view
- Gallery view for all inspection photos
- Include in PDF exports (if PDF feature exists)
- Thumbnail grid layout

## Test Planning Guide

**Your Role as a Tester**: Create test scenarios for photo upload, storage, and display.

**Testing Approach**:
1. **Upload Testing**: Test camera and file picker on mobile devices
2. **Limit Testing**: Verify max 3 photos and file size limits
3. **Offline Testing**: Test localStorage saving and later sync
4. **Display Testing**: Verify thumbnails, full-size view, removal
5. **Integration Testing**: Photos appear in reports and details

**Suggested Claude Code Prompts**:
```
"Analyze the photo attachment feature and create a test plan including:
- Photo capture from camera vs file picker
- File size limits and auto-compression
- Offline storage and online sync
- Thumbnail display and full-size viewing
- Photo removal and confirmation
- Integration with inspection reports"

"What mobile device tests should I include for photo capture functionality?"

"Create test scenarios for offline photo storage and sync behavior"
```

**Key Test Scenarios**:
1. Add photo from camera - appears as thumbnail
2. Add photo from file picker - appears as thumbnail
3. Add 3 photos - all appear as thumbnails
4. Try 4th photo - shows error "Max 3 photos"
5. Upload 6MB photo - auto-compressed to under 5MB
6. Offline mode - saves to localStorage
7. Come online - click sync, uploads pending photos
8. Remove photo - shows confirmation, deletes correctly
9. View full size - opens modal/lightbox
10. Close full size - returns to inspection form
11. Photos visible in inspection details
12. Photos included in PDF export (if feature exists)

**Mobile Device Tests (Inspector Use Case)**:
- Camera access permission handling
- Portrait/landscape photo orientation
- Photo quality on mobile device
- Touch interactions (tap, pinch to zoom)
- Works on inspector's mobile device in the field

## Technical Context (For Claude Code)

Technical considerations:
- File input vs camera API
- Image compression library
- Cloud storage integration (Supabase Storage)
- localStorage for offline photos
- Sync queue implementation
- Database schema for photo URLs
- Mobile device support

**For Testers**: Ask Claude Code about mobile testing strategies and cloud storage test approaches.
