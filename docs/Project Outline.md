# Line Dance DJ Request App - Project Outline

## Project Overview
A mobile-first web application that enables line dancers at events to submit song/dance requests to the DJ through a digital queue system. Dancers can request from a pre-loaded dance list or submit custom requests, and upvote existing requests. The DJ manages these requests separately from their actual music playback system.

## Core Features (MVP)

### 1. Dancer Features (Mobile-First Interface)
- **Submit Requests**
  - Select from pre-loaded dance list (uploaded by DJ/admin)
  - Submit custom song/dance request (free text entry)
  - See confirmation when request is submitted
  
- **Upvote System**
  - View all pending requests in the queue
  - Upvote existing requests to show support
  - See upvote counts on each request
  
- **Queue Visibility**
  - View all pending requests ordered by upvotes/time
  - See which requests have been added to DJ's playlist (marked complete)

### 2. DJ Features (Admin Interface)
- **View Request Queue**
  - See all incoming requests in real-time
  - See upvote counts for each request
  - Sort by most upvoted or time submitted
  
- **Manage Requests**
  - Mark requests as "Added to Playlist" (crosses off the request)
  - Mark requests as "Played" (removes from active queue)
  - Clear completed requests from view
  
- **Dance Library Management**
  - Upload/replace dance library via CSV file
  - Simple file replacement (no individual editing needed)
  - Each dance entry includes: Dance Name, Song Title, Artist
  - View current library size and last update date

**Note**: The DJ's actual music playback happens on a separate system. This app only manages the request queue and tracking.

## Future Enhancements (Post-MVP)

### Phase 2 Features
- **Smart Request Entry**
  - Autocomplete suggestions as dancers type
  - Match custom requests to existing dances in the list
  - Prevent duplicate requests (merge with existing and upvote instead)
  
- **Enhanced Queue Management**
  - DJ can reorder queue manually (override upvote order)
  - DJ can decline/remove inappropriate requests
  - Add notes to requests
  
- **Dancer Experience**
  - Optional dancer name on requests
  - Track "my requests" for each user session
  - Filter/search the dance list by song name or dance name

### Phase 3 Features
- **Analytics & History**
  - Track most popular dances per event
  - View play history
  - Export request data after event
  
- **Advanced Dance List**
  - Filter by difficulty level
  - Filter by dance style (country, pop, Latin, etc.)
  - Include links to step sheets or videos
  
- **Event Management**
  - Create/close events
  - Archive past event requests
  - Reuse dance lists across events

### Phase 4 Features
- **Music System Integration** (Future exploration)
  - Sync with external DJ software (if API available)
  - Auto-update "now playing"
  - Automatic queue progression

## Technology Stack (FINAL DECISION)

### Frontend
- **Framework**: Vue 3 (Composition API)
  - Lightweight and fast (~30KB gzipped)
  - Excellent reactivity for real-time updates
  - Single-file components (clean organization)
  - Easy to learn and maintain
  - Perfect for small-to-medium apps
  
- **Build Tool**: Vite
  - Lightning-fast dev server (< 1 second start)
  - Instant hot module replacement
  - Optimized production builds
  - Native ES modules
  
- **Styling**: Tailwind CSS v4.1.17
  - Responsive mobile-first design
  - Quick prototyping and customization
  - Utility-first approach for rapid development
  - Uses @tailwindcss/vite plugin for integration
  
- **State Management**: Vue Composition API (built-in)
  - No external state library needed
  - Firebase SDK handles real-time data
  - Reactive refs and computed properties
  
- **Language**: JavaScript (TypeScript optional)
  - Keep it simple for MVP
  - Can add TypeScript later if needed
  
- **Build Tool**: Vite
  - Fast development server
  - Optimized production builds

### Backend & Database
- **Platform**: Firebase (All-in-One Solution)
  - **Firestore**: NoSQL database with real-time updates
  - **Firebase Authentication**: Simple PIN/password for DJ
  - **Firebase SDK**: Real-time listeners for live updates
  - **No separate backend needed** - Firebase handles all server-side logic

### Hosting & Deployment
- **Hosting**: Firebase Hosting
  - Free tier: 10 GB storage, 360 MB/day transfer
  - Free subdomain: `your-app-name.web.app` or `your-app-name.firebaseapp.com`
  - Automatic HTTPS
  - Global CDN for fast access
  - Deploy with single command: `firebase deploy`
  
- **Domain**: Firebase subdomain (no purchase needed)
  - Example: `dance-request-app.web.app`
  - Professional enough for community use
  - Can add custom domain later if desired ($12/year)

### Scale Considerations
- **Expected Usage**: 30-40 concurrent users (max ~100)
- **Event Frequency**: Weekly (Thursday nights)
- **Attendance**: ~400 people per event
- **Data Persistence**: Request queue resets each event; dance list and "last requested" dates persist
- **Implication**: Firebase free tier is perfect for this scale

### Why Vue + Vite + Firebase for This Project

**Vue Benefits:**
- **Lightweight**: ~30KB gzipped (smallest modern framework)
- **Fast mobile loading**: Critical for dancers on phones
- **Reactive by design**: Perfect for real-time Firebase updates
- **Simple learning curve**: Even with AI assistance, cleaner code is better
- **Single-file components**: HTML/CSS/JS together, easy to organize

**Vite Benefits:**
- **Development speed**: Instant dev server and hot reload
- **Production optimization**: Automatic code splitting and minification
- **Essential even with AI**: Runs/tests code, builds for deployment
- **Modern tooling**: Native ES modules, fast builds

**Firebase Benefits:**
- **Real-time updates**: Built-in, no WebSocket setup needed
- **Free tier**: 50K reads, 20K writes, 20K deletes per day (far exceeds needs)
- **Zero server maintenance**: No backend code to write or servers to manage
- **Automatic scaling**: Handles 40 users as easily as 1000
- **Integrated hosting**: One platform for database + website
- **Simple authentication**: Built-in auth for DJ access
- **Quick setup**: 2-3 hours to working app
- **Cost**: $0/month at this usage level

**Combined Bundle Size**: ~70KB total (Vue + Firebase SDK) - loads in < 1 second on 3G

## Development Phases

### Phase 1: MVP (Minimum Viable Product)
**Goal**: Core request and upvote system working
- Mobile-first dancer interface
  - Select from pre-loaded dance list
  - Submit custom request (text input)
  - View request queue
  - Upvote existing requests
  
- DJ admin interface
  - View all requests with upvote counts
  - Mark requests as "Added to Playlist" or "Played"
  - Upload/manage pre-loaded dance list
  
- Real-time updates (queue changes visible to all users)
- Simple authentication for DJ access
- Basic responsive design

**Timeline**: 2-3 weeks

### Phase 2: Enhanced Usability
- Smart autocomplete for custom requests
- Duplicate detection (merge requests + auto-upvote)
- Search/filter the dance list
- DJ can manually reorder queue
- Improved mobile UI/UX
- Request tracking per user session

**Timeline**: 2-3 weeks

### Phase 3: Advanced Features
- Event management (create/close/archive events)
- Analytics dashboard for DJ
- Export request data
- Dance list enhancements (difficulty, style, step sheets)
- Performance optimization

**Timeline**: 2-3 weeks

### Phase 4: Testing & Deployment
- User testing with local dance community
- Bug fixes and refinements
- Production deployment
- User documentation

**Timeline**: 1-2 weeks

## User Stories

### Dancer Perspective (MVP)
1. As a dancer, I want to select from a list of known dances so I can quickly make a request
2. As a dancer, I want to submit a custom song request so I can request dances not on the list
3. As a dancer, I want to upvote existing requests so popular songs get played sooner
4. As a dancer, I want to see the current request queue so I know what's been requested
5. As a dancer, I want to see which songs have been added to the DJ's playlist so I know they're coming

### DJ Perspective (MVP)
1. As a DJ, I want to see all requests with upvote counts so I know what's most popular
2. As a DJ, I want to mark requests as "added to playlist" so dancers know I've queued them
3. As a DJ, I want to mark requests as "played" so they're removed from active queue
4. As a DJ, I want to upload a pre-made dance list so dancers can easily select from known dances
5. As a DJ, I want to manage the dance list so I can add/edit/remove dances as needed

### Future User Stories
- As a dancer, I want autocomplete suggestions so I don't create duplicate requests
- As a DJ, I want to manually reorder the queue so I can balance the event flow
- As a DJ, I want to see request history and analytics so I can prepare better for future events
- As a dancer, I want to filter the dance list by style or difficulty so I can find appropriate dances

## Data Models

### Dance (Pre-loaded List)
- id (unique identifier)
- danceName (string) - e.g., "Copperhead Road"
- songTitle (string) - e.g., "Copperhead Road"
- artist (string) - e.g., "Steve Earle"
- difficulty (optional: beginner/intermediate/advanced) - Future
- style (optional: country/pop/Latin/etc.) - Future
- stepSheetUrl (optional link) - Future
- createdAt (datetime)

### Request
- id (unique identifier)
- danceId (optional reference to Dance - null if custom request)
- customDanceName (optional string - for custom requests)
- customSongTitle (optional string - for custom requests)
- customArtist (optional string - for custom requests)
- timestamp (datetime)
- status (pending/added_to_playlist/played)
- upvoteCount (number, default 0)
- upvotedBy (array of session IDs to prevent duplicate upvotes)
- createdAt (datetime)
- completedAt (optional datetime)

### Event (Future)
- id (unique identifier)
- name (string)
- date (datetime)
- startTime (datetime)
- endTime (optional datetime)
- isActive (boolean)

## Security Considerations
- DJ admin access protected with authentication
- Rate limiting on request submissions to prevent spam
- Input validation and sanitization
- HTTPS for all communications
- Session management for DJ authentication

## Key Technical Requirements

### Mobile-First Design
- Responsive layout optimized for phones (primary use case)
- Large touch-friendly buttons
- Fast loading on mobile networks
- Works well on iOS and Android browsers

### Real-Time Functionality
- Queue updates appear instantly for all users
- Upvote counts update in real-time
- DJ actions (marking as added/played) visible immediately

### Data Import
- DJ can upload dance list (CSV format recommended)
- **CSV Format Specification:**
  - Header row: `Dance Name,Song Title,Artist`
  - Example: `Copperhead Road,Copperhead Road,Steve Earle`
  - UTF-8 encoding
  - No quotes required unless field contains commas
- Bulk import capability
- Validation: Check for required fields (Song Title minimum)

### Session Management
- **Dancers:** 
  - No login required, anonymous access
  - Generate unique session ID on first visit (localStorage or cookie)
  - Session ID used to track upvotes (prevent duplicate voting)
  - Session persists across page refreshes
  - Session expires after 24 hours or can be cleared manually
  
- **DJ:**
  - Simple password/PIN authentication (e.g., 4-6 digit PIN)
  - Session token stored securely
  - Auto-logout after period of inactivity (optional)
  - Single DJ session at a time (or allow multiple for backup)

## Success Metrics
- Reduction in paper request slips
- DJ satisfaction with request management
- Dancer engagement (number of requests and upvotes per event)
- App responsiveness and uptime
- User feedback scores
- Time saved managing requests vs. traditional methods

## UI/UX Design

### Dancer View (Mobile-First)

#### Screen 1: Request Queue (Home/Default View)
**Key Elements:**
- **Header**
  - App title/logo
  - "New Request" button (prominent, fixed at top or bottom)
  - Total pending requests count
  
- **Request Queue List** (scrollable)
  - Each request card shows:
    - Dance name / Song title (large, bold text)
    - Artist name (smaller, secondary text)
    - Upvote count (large number, visually prominent)
    - Upvote button (heart icon or thumbs up)
      - Visual state: upvoted (filled/colored) vs not upvoted (outline)
      - Disabled if already upvoted by this user
    - Status indicator:
      - "Pending" (default, no badge)
      - "Added to Playlist" (green checkmark badge)
      - "Played" (faded out or removed after brief delay)
    - Time submitted (e.g., "5 min ago")
  
- **Sort/Filter Options** (optional for MVP, add later)
  - Sort by: Most upvotes, Most recent, Alphabetical

- **Visual Design Notes:**
  - Large touch targets (minimum 44x44px)
  - Clear visual hierarchy (song name > upvotes > other info)
  - Color coding for status (green = added, gray = played)
  - Smooth animations when upvotes change
  - Pull-to-refresh gesture

#### Screen 2: New Request Modal/Screen
**Triggered by:** Tapping "New Request" button

**Key Elements:**
- **Tab/Toggle Selection**
  - Tab 1: "Browse Dances" (pre-loaded list)
  - Tab 2: "Custom Request" (manual entry)

- **Tab 1: Browse Dances**
  - Search bar (filter as you type)
  - Scrollable list of dances
    - Dance name (bold)
    - Song title - Artist (secondary)
    - "Last requested: X days ago" (if tracked)
    - Tap to select
  - Selected dance highlighted
  - "Submit Request" button (bottom, always visible)

- **Tab 2: Custom Request**
  - Input fields:
    - Dance Name (optional, placeholder: "e.g., Copperhead Road")
    - Song Title (required)
    - Artist Name (optional)
  - Helper text: "Can't find your dance? Add it here!"
  - "Submit Request" button (enabled when song title filled)
  
- **Confirmation**
  - Success message: "Request submitted!"
  - Auto-return to queue view
  - New request appears at top with animation

#### Mobile Navigation
- Single-page app (minimal navigation)
- Modal overlays for new requests
- Swipe gestures for refresh/close

---

### DJ Admin View (Tablet/Desktop Optimized)

#### Main Dashboard (Single Screen Layout)

**Left Panel (40% width): Request Queue**
- **Header**
  - "Incoming Requests" title
  - Event controls: "Start Event" / "End Event" button
  - "Clear Completed" button (removes played requests)
  
- **Request List** (scrollable)
  - Each request card shows:
    - Dance/Song name (large)
    - Artist (if available)
    - Upvote count (prominent badge/number)
    - Time submitted
    - Source: "From dance list" or "Custom request"
    - Action buttons (inline):
      - "Add to Playlist" button (primary action, green)
      - "Mark Played" button (secondary, gray)
      - Optional: "Remove" button (red X icon)
  
- **Sort Controls**
  - Dropdown or tabs: "Most Upvoted" / "Chronological" / "Custom Order"
  - Drag-and-drop to reorder (Phase 2 feature)

**Right Panel (60% width): Event Stats & Info**
- **Quick Stats**
  - Total requests tonight: X
  - Pending: Y
  - Completed: Z
  - Most upvoted: [Dance Name] (X votes)
  
- **Dance Library Status**
  - "Current library: X dances loaded"
  - "Last updated: [Date]"
  - "Upload New Library" button
    - Opens simple file upload modal
    - Replaces entire library with new CSV
    - Confirmation prompt: "This will replace the current library. Continue?"
  
- **Optional: Recent Activity Feed** (Phase 2)
  - Live feed of new requests coming in
  - Upvote activity
  - Completed requests

**Top Bar (Full Width)**
- DJ name/logout
- Current event status: "Event Active" or "No Active Event"
- Real-time indicator (green dot = connected)
- Time/date

#### Modal: Upload Dance List (CSV)
- File upload dropzone (drag & drop or click to browse)
- Format instructions:
  - "CSV format: Dance Name, Song Title, Artist"
  - Example row shown: "Copperhead Road,Copperhead Road,Steve Earle"
  - Download sample CSV template link
- Preview table (shows first 5-10 rows after file selected)
- Warning message: "This will replace your entire dance library"
- "Cancel" and "Replace Library" buttons

---

### Common UI Patterns

**Color Scheme:**
- Primary: Vibrant color for actions (e.g., blue, purple, teal)
- Success: Green (for "added to playlist")
- Neutral: Gray (for "played" or disabled states)
- Background: Light/white (or dark mode option)
- Text: High contrast for readability

**Typography:**
- Large, readable fonts (minimum 16px on mobile)
- Bold for song/dance names
- Secondary text for supporting info

**Interactive Feedback:**
- Button press animations
- Upvote button "pops" when clicked
- Success toast messages
- Loading spinners for actions
- Real-time update animations (subtle pulse/highlight)

**Accessibility:**
- High contrast text
- Clear focus indicators
- Screen reader friendly labels
- Touch targets 44x44px minimum

---

### Key User Flows

**Dancer: Submit Request from List**
1. Open app → See queue
2. Tap "New Request" button
3. Search or scroll dance list
4. Tap dance to select
5. Tap "Submit Request"
6. See confirmation → Return to queue
7. New request appears with upvote button

**Dancer: Upvote Existing Request**
1. Open app → See queue
2. Scroll through requests
3. Tap upvote button on desired request
4. Button fills/colors, count increments
5. Button disables (can't upvote again)

**DJ: Process Requests**
1. Open admin view → See all requests
2. Review requests sorted by upvotes
3. Select a request
4. Click "Add to Playlist" → Request shows green badge
5. After playing, click "Mark Played" → Request fades/removes
6. Periodically click "Clear Completed" to clean up

**DJ: Upload Dance List (Setup/Update)**
1. Open admin view
2. Click "Upload New Library" button
3. Drag and drop CSV file (or click to browse)
4. Preview first few rows
5. Confirm replacement
6. Click "Replace Library"
7. See success message, library updated

---

### Wireframe Notes
**Priority Screens to Mock:**
1. Dancer: Request Queue (home screen)
2. Dancer: New Request modal (browse dances tab)
3. DJ: Main dashboard with split view
4. DJ: Upload CSV modal

## Implementation Notes

### URL Structure
- Dancer view: `/` or `/queue`
- DJ admin: `/admin` or `/dj`
- Direct access control via simple authentication

### Firebase Structure & Operations
- **Firestore Collections:**
  - `dances` - pre-loaded dance library (persists)
  - `requests` - active request queue (reset each event)
  - `events` - event metadata (Phase 2+)
  
- **Key Operations:**
  - Real-time listener: `onSnapshot()` on `requests` collection for all clients
  - Upvote: Update `upvoteCount` and add to `upvotedBy` array
  - Status change: Update `status` field and `completedAt` timestamp
  - CSV upload: Batch write to `dances` collection (delete old, insert new)
  - Reset queue: Delete all documents in `requests` collection or filter by event date
  
- **Firebase Authentication:**
  - Email/password for DJ (simple setup)
  - Anonymous auth for dancers (tracks session for upvotes)
  - Security rules enforce DJ-only write access to certain fields

### Error Handling
- Network disconnection: Show offline indicator, queue operations
- Failed request submission: Show error message, allow retry
- CSV upload errors: Validate format, show specific error messages
- Rate limiting: Prevent spam submissions (e.g., 1 request per user per 30 seconds)

### Performance Considerations
- Lazy load request list (paginate if >50 requests)
- Optimize real-time listeners (only subscribe to active data)
- Debounce search inputs
- Cache dance list locally after first load

## Next Steps
1. ✅ **Technology stack chosen**: Firebase (Firestore + Hosting + Auth)
2. **Create visual mockups/wireframes** - Ready to proceed
3. Set up Firebase project and development environment
4. Initialize React + TypeScript project with Vite
5. Configure Firebase SDK and Firestore
6. Begin Phase 1 MVP development

## Development Environment Setup
**Required Tools:**
- Node.js (v18+)
- npm or yarn
- Firebase CLI: `npm install -g firebase-tools`
- Code editor: VS Code (recommended)

**Initial Setup Commands:**
```bash
# Create Vue app with Vite
npm create vite@latest dance-request-app -- --template vue

# Install dependencies
cd dance-request-app
npm install firebase

# Optional: Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Initialize Firebase
firebase login
firebase init

# Run dev server
npm run dev

# Run tests
node ./node_modules/@playwright/test/cli.js test
```

**PowerShell Script Execution Workaround:**
Due to PowerShell script execution restrictions on this system, use the following command format to run npm/node commands:
```powershell
# Run npm commands using node directly
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run dev
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run build
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" install <package>

# Or use cmd wrapper
cmd /c "npm run dev"
```

**Deployment to Firebase Hosting:**
```powershell
# Build the production app
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run build

# Deploy to Firebase (requires firebase-tools installed)
node "C:\Program Files\nodejs\node_modules\npm\bin\npx-cli.js" firebase deploy

# App will be live at:
# https://dance-request-app.web.app
# https://dance-request-app.firebaseapp.com
```

**Local Development on Phone:**
```powershell
# Find your computer's IP address
ipconfig

# Start dev server
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run dev

# On phone (same WiFi network), open browser to:
# http://YOUR-IP-ADDRESS:5173
# Example: http://192.168.1.100:5173
```

**Project Structure:**
```
dance-request-app/
├── src/
│   ├── components/      # Vue components
│   │   ├── HelloWorld.vue
│   │   ├── NewRequestModal.vue
│   │   ├── RequestCard.vue
│   │   └── RequestQueue.vue
│   ├── firebase/       # Firebase config and utilities
│   │   └── config.js
│   ├── assets/         # Static assets (images, icons)
│   │   └── vue.svg
│   ├── App.vue         # Root component
│   ├── main.js         # Entry point
│   └── style.css       # Global styles
├── tests/              # Playwright test files
│   ├── new-request-modal.spec.js
│   ├── request-queue.spec.js
│   └── screenshots/    # Test screenshots
├── public/             # Static public assets
│   └── vite.svg
├── playwright-report/  # Test reports
├── test-results/       # Test execution results
├── dist/               # Production build output
├── .firebaserc         # Firebase project config
├── .gitignore
├── firebase.json       # Firebase hosting config
├── index.html          # HTML entry point
├── package.json
├── playwright.config.js # Playwright test configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── vite.config.js      # Vite build configuration
├── Project Outline.md  # This file
├── README.md
└── SETUP.md            # Setup instructions
```