# Dance Request App - Technical Documentation

**Version:** 1.0.0  
**Last Updated:** November 20, 2025  
**Framework:** Vue 3 (Composition API)  
**Build Tool:** Vite  
**Styling:** Tailwind CSS v4.1.17

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Component Documentation](#component-documentation)
5. [Data Models](#data-models)
6. [State Management](#state-management)
7. [Features Implementation](#features-implementation)
8. [Firebase Integration](#firebase-integration)
9. [Styling Approach](#styling-approach)
10. [Testing](#testing)
11. [Build and Deployment](#build-and-deployment)
12. [Future Enhancements](#future-enhancements)

---

## Architecture Overview

### Application Architecture

The Dance Request App is a **single-page application (SPA)** built with Vue 3 using the Composition API. The architecture follows a component-based approach with a simple, flat hierarchy:

```
App.vue (Root)
└── RequestQueue.vue (Main View)
    ├── RequestCard.vue (Repeating Item)
    └── NewRequestModal.vue (Modal Overlay)
```

### Design Principles

- **Mobile-First**: Optimized for phone screens with touch-friendly UI
- **Real-Time Ready**: Prepared for Firebase Firestore real-time updates
- **Component Isolation**: Each component is self-contained with minimal dependencies
- **Reactive State**: Uses Vue 3's Composition API with reactive refs
- **Inline Styling**: Currently uses inline styles for rapid prototyping (to be migrated to Tailwind utility classes)

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Vue.js** | 3.5.24 | Core framework with Composition API |
| **Vite** | 7.2.4 | Build tool and dev server |
| **Tailwind CSS** | 4.1.17 | Utility-first CSS framework |
| **Firebase SDK** | 12.6.0 | Backend services (Firestore, Auth, Hosting) |

### Development Tools

| Tool | Version | Purpose |
|------|---------|---------|
| **Playwright** | 1.56.1 | End-to-end testing |
| **@vitejs/plugin-vue** | 6.0.1 | Vue SFC support in Vite |
| **@tailwindcss/vite** | 4.1.17 | Tailwind integration with Vite |

### Build Output

- **Bundle Size**: ~70KB (Vue + Firebase SDK)
- **Target**: ES modules for modern browsers
- **Output Format**: Static files for Firebase Hosting

---

## Project Structure

```
dance-request-app/
├── src/
│   ├── components/
│   │   ├── RequestQueue.vue      # Main view component
│   │   ├── RequestCard.vue       # Individual request display
│   │   └── NewRequestModal.vue   # Request submission form
│   ├── firebase/
│   │   └── config.js             # Firebase initialization
│   ├── assets/                   # Static assets (images, icons)
│   ├── App.vue                   # Root component
│   ├── main.js                   # Application entry point
│   └── style.css                 # Global styles (Tailwind import)
├── docs/
│   ├── Project Outline.md        # Product requirements
│   ├── README.md                 # User documentation
│   ├── SETUP.md                  # Setup instructions
│   └── TECHNICAL_DOCUMENTATION.md # This file
├── tests/
│   ├── new-request-modal.spec.js # Modal tests
│   ├── request-queue.spec.js     # Queue tests
│   └── screenshots/              # Visual regression tests
├── public/                       # Static public assets
├── firebase.json                 # Firebase hosting config
├── playwright.config.js          # Test configuration
├── tailwind.config.js            # Tailwind configuration
├── vite.config.js                # Vite build configuration
├── package.json                  # Dependencies and scripts
└── index.html                    # HTML entry point
```

---

## Component Documentation

### 1. App.vue

**Purpose:** Root component that mounts the main application view.

**Implementation:**
- Minimal wrapper component
- Imports and renders `RequestQueue.vue`
- No state or logic

**Code Structure:**
```vue
<script setup>
import RequestQueue from './components/RequestQueue.vue'
</script>

<template>
  <RequestQueue />
</template>
```

---

### 2. RequestQueue.vue

**Purpose:** Main application view displaying the request queue with sorting, upvoting, and request submission.

#### Key Features

1. **Request Display**
   - Shows list of dance requests
   - Real-time sorting
   - Empty state message

2. **Sorting System**
   - Sort by: Dance Name, Song Name, Artist, Likes, Request Time
   - Dropdown menu with visual selection indicator
   - Persistent sort mode

3. **Upvote System**
   - Users can upvote requests
   - Prevents duplicate upvotes per session
   - Updates count in real-time

4. **Request Submission**
   - Modal overlay for new requests
   - Form with dance name (required), song name, and artist

#### State Management

```javascript
// Request data (currently mock data, will connect to Firebase)
const requests = ref([...])

// Upvote tracking (session-based)
const upvotedRequests = ref([2]) // Array of request IDs

// UI state
const showNewRequestModal = ref(false)
const showSortMenu = ref(false)
const sortMode = ref('likes') // 'dance' | 'song' | 'artist' | 'likes' | 'time'
```

#### Computed Properties

**`sortedRequests`**
- Returns sorted copy of requests based on `sortMode`
- Sort implementations:
  - **dance**: Alphabetical by `dance_name`
  - **song**: Alphabetical by `song_title`
  - **artist**: Alphabetical by `artist`
  - **likes**: Descending by `upvote_count`, then alphabetical by `dance_name`
  - **time**: Descending by `timestamp` (most recent first)

**`pendingRequestsCount`**
- Counts requests with `status === 'pending'`
- Used for displaying queue metrics

#### Methods

**`handleUpvote(requestId)`**
- Adds request ID to `upvotedRequests` array
- Increments `upvote_count` on the request
- Prevents duplicate upvotes from same session

**`selectSort(mode)`**
- Updates `sortMode` to selected option
- Closes sort menu
- Triggers re-sort via computed property

**`handleNewRequest(requestData)`**
- Receives form data from modal
- Generates new request ID
- Adds request to `requests` array
- Closes modal

#### UI Layout

**Header:**
- Purple gradient background
- "Dance Requests" title
- Sticky positioning

**Request List:**
- Scrollable area with padding for fixed buttons
- Each request rendered as `<RequestCard>`
- Empty state with icon when no requests

**Sort Menu (Dropdown):**
- Dark overlay backdrop
- Floating menu positioned above action buttons
- 5 sort options with checkmark indicators
- Click outside to close

**Fixed Action Buttons:**
- Bottom bar with 2 buttons:
  - **New Request**: Purple gradient, opens modal
  - **Sort**: White with border, toggles menu
- Fixed positioning with shadow

---

### 3. RequestCard.vue

**Purpose:** Display individual dance request with upvote functionality.

#### Props

```javascript
{
  request: {
    type: Object,
    required: true,
    // Expected shape:
    // {
    //   id: Number,
    //   dance_name: String,
    //   song_title: String,
    //   artist: String,
    //   upvote_count: Number,
    //   timestamp: Date,
    //   status: String
    // }
  },
  isUpvoted: {
    type: Boolean,
    default: false
  },
  showSource: {
    type: Boolean,
    default: false
  }
}
```

#### Emits

- `upvote`: Triggered when user clicks upvote button

#### Layout Structure

```
┌─────────────────────────────────────────────────────┐
│ [Dance Name - Bold, Large]                    Time  │
│ [Song Title • Artist - Gray, Medium]         ❤ 12  │
└─────────────────────────────────────────────────────┘
```

**Left Section (flex: 1):**
- Dance name (16px, bold, dark gray)
- Song title and artist on same line (14px, medium gray)
- Separated by bullet point if artist exists

**Right Section (flex-shrink: 0):**
- Request time (12px, light gray)
- Upvote button with heart icon and count
  - Pink fill when upvoted
  - Gray outline when not upvoted
  - Disabled state after upvoting

#### Computed Properties

**`formattedTime`**
- Formats `timestamp` to "10:12 PM" format
- Uses `toLocaleTimeString()` with hour/minute options
- Returns empty string if no timestamp or error

---

### 4. NewRequestModal.vue

**Purpose:** Modal overlay for submitting new dance requests.

#### Features

1. **Overlay Backdrop**
   - Dark semi-transparent background (50% opacity)
   - Click outside to close
   - Centers modal content

2. **Form Fields**
   - **Dance Name** (required): Text input
   - **Song Name** (optional): Text input
   - **Artist** (optional): Text input

3. **Form Behavior**
   - Required field validation on dance name
   - Submit button triggers form submission
   - Close button (X) in header
   - Form resets after submission

#### Emits

- `close`: Triggered when user closes modal
- `submit`: Triggered with form data on submission

#### Form Data Structure

```javascript
{
  dance_name: String,      // Required
  song_title: String,      // Defaults to dance_name if empty
  artist: String,          // Optional
  upvote_count: 0,         // Always starts at 0
  status: 'pending',       // Always pending for new requests
  timestamp: Date          // Set to current time
}
```

#### Styling

- Modal width: 500px max, 90% on mobile
- Border radius: 16px
- Animation: Slide up with fade-in (0.3s ease-out)
- Input focus: Purple border (matches app theme)
- Button: Purple gradient with hover scale effect

---

## Data Models

### Request Object

```javascript
{
  id: Number,                    // Unique identifier
  dance_name: String,            // Display name for dance
  song_title: String,            // Song title
  artist: String,                // Artist name (optional)
  upvote_count: Number,          // Number of upvotes (default: 0)
  status: String,                // 'pending' | 'added_to_playlist' | 'played'
  timestamp: Date,               // Request submission time
  upvoted_by: Array<String>      // Future: Session IDs who upvoted
}
```

### Current Mock Data

The app currently uses 14 mock requests for UI development:
- 4 real dances (Copperhead Road, Electric Slide, Boot Scootin' Boogie, Wobble)
- 10 mock dances for scrolling/testing
- All with `status: 'pending'` except Electric Slide (`added_to_playlist`)
- Varied upvote counts (5-67)

---

## State Management

### Current Approach: Local Component State

The app uses **Vue 3 Composition API** with reactive refs for state management:

```javascript
// RequestQueue.vue
const requests = ref([...])           // Array of request objects
const upvotedRequests = ref([])       // Array of upvoted request IDs
const showNewRequestModal = ref(false)
const showSortMenu = ref(false)
const sortMode = ref('likes')
```

### Session Management (Planned)

**Dancer Sessions:**
- Generate unique session ID on first visit
- Store in `localStorage`
- Track upvotes per session to prevent duplicates
- Session expires after 24 hours

**DJ Authentication:**
- Firebase Authentication with email/password
- Protected admin routes
- Session token stored securely

---

## Features Implementation

### 1. Request Submission

**User Flow:**
1. User clicks "New Request" button
2. Modal opens with form
3. User fills dance name (required) and optionally song/artist
4. User submits form
5. Modal closes and request appears in queue

**Implementation:**
- Form validation: HTML5 `required` attribute
- Default behavior: Song title defaults to dance name if empty
- New request gets unique ID (currently `length + 1`, will use Firebase auto-ID)
- Request starts with 0 upvotes and 'pending' status

### 2. Upvoting System

**User Flow:**
1. User browses request queue
2. User clicks heart button on desired request
3. Heart fills with color, count increments
4. Button disables to prevent duplicate upvote

**Implementation:**
- Session tracking via `upvotedRequests` array
- Check before upvoting: `!upvotedRequests.includes(requestId)`
- Increment: `request.upvote_count++`
- Disable: `:disabled="isUpvoted"` prop

**Future Enhancement:**
- Store upvotes in Firebase with session IDs
- Prevent upvoting across page refreshes

### 3. Sorting System

**Available Sort Options:**

| Sort Mode | Implementation | Order |
|-----------|---------------|--------|
| Dance Name | `a.dance_name.localeCompare(b.dance_name)` | A-Z |
| Song Name | `a.song_title.localeCompare(b.song_title)` | A-Z |
| Artist | `a.artist.localeCompare(b.artist)` | A-Z |
| Likes | `b.upvote_count - a.upvote_count` | High to Low |
| Request Time | `b.timestamp - a.timestamp` | Recent to Old |

**Tie Breaker:**
- For "Likes" sort: Secondary sort by dance name alphabetically

**UI Interaction:**
1. User clicks "Sort" button
2. Dropdown menu appears
3. User selects sort option
4. Menu closes
5. Queue re-sorts instantly

### 4. Time Display

**Format:** "10:12 PM"

**Implementation:**
```javascript
const formattedTime = computed(() => {
  if (!props.request.timestamp) return ''
  try {
    const date = new Date(props.request.timestamp)
    return date.toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit' 
    })
  } catch (e) {
    return ''
  }
})
```

**Display Location:** Right side of request card, left of upvote button

---

## Firebase Integration

### Configuration

**File:** `src/firebase/config.js`

**Initialized Services:**
- Firestore Database (`db`)
- Authentication (`auth`)

**Project Details:**
- Project ID: `dance-request-app`
- Hosting URL: `dance-request-app.web.app`

### Planned Firestore Structure

```
/requests (collection)
  /{requestId} (document)
    - dance_name: string
    - song_title: string
    - artist: string
    - upvote_count: number
    - upvoted_by: array
    - status: string
    - timestamp: timestamp
    - event_id: string (future)

/dances (collection)
  /{danceId} (document)
    - dance_name: string
    - song_title: string
    - artist: string
    - last_requested: timestamp
    - created_at: timestamp

/events (collection) - Phase 2+
  /{eventId} (document)
    - name: string
    - date: timestamp
    - is_active: boolean
```

### Real-Time Updates (To Implement)

```javascript
import { onSnapshot, collection } from 'firebase/firestore'

// Listen for real-time updates
onSnapshot(collection(db, 'requests'), (snapshot) => {
  requests.value = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
})
```

---

## Styling Approach

### Current Implementation: Inline Styles

**Why Inline Styles (Currently):**
- Rapid prototyping and iteration
- No class naming conflicts
- Component-scoped styling
- Easy to read component structure

**Example:**
```vue
<div style="background: white; padding: 12px 16px; display: flex;">
  <!-- Content -->
</div>
```

### Tailwind CSS Integration

**Status:** Installed but not actively used

**Configuration:**
- Tailwind v4.1.17 with Vite plugin
- Content paths configured for `.vue`, `.js`, `.jsx`, `.tsx` files
- Default theme (no customizations yet)

**Migration Plan:**
- Replace inline styles with Tailwind utility classes
- Create custom theme colors in `tailwind.config.js`
- Define reusable component patterns

**Example Migration:**
```vue
<!-- Before (inline) -->
<button style="padding: 16px; background: #9333ea; color: white; border-radius: 12px;">

<!-- After (Tailwind) -->
<button class="px-4 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700">
```

### Design System

**Colors:**
- **Primary:** Purple gradient (`#9333ea` to `#7e22ce`)
- **Success:** Green (for "added to playlist")
- **Neutral:** Gray scales for text and borders
- **Accent:** Pink (`#ec4899`) for upvote hearts

**Typography:**
- Headings: 24-32px, bold (700)
- Body text: 14-16px, normal (400-600)
- Small text: 12px, light gray

**Spacing:**
- Card padding: 12px
- Section gaps: 16-24px
- Touch targets: Minimum 44x44px

**Border Radius:**
- Buttons: 12px
- Modals: 16px
- Inputs: 8px

---

## Testing

### Test Framework: Playwright

**Configuration:** `playwright.config.js`
- Base URL: `http://localhost:5173`
- Browser: Chromium (Desktop Chrome)
- Test directory: `./tests`
- Reporter: HTML report

### Test Suites

#### 1. Request Queue Tests (`tests/request-queue.spec.js`)

**Tests:**
- ✅ Display request queue with header
- ✅ Display request cards with all elements
- ✅ Show floating action button
- ✅ Display status badges correctly
- ✅ Mobile viewport responsiveness
- ✅ Sort requests when selecting sort option

**Coverage:**
- UI rendering
- Component visibility
- Mobile responsiveness
- Sort functionality

#### 2. New Request Modal Tests (`tests/new-request-modal.spec.js`)

**Coverage:**
- Modal opening/closing
- Form field validation
- Submission workflow
- Search functionality (if applicable)

### Running Tests

```powershell
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run specific test file
npm run test -- tests/request-queue.spec.js

# Generate screenshots
npm run test:screenshots
```

### Test Output

- HTML reports: `playwright-report/`
- Test results: `test-results/`
- Screenshots: `tests/screenshots/`

---

## Build and Deployment

### Development

**Start Dev Server:**
```powershell
npm run dev
```
- Dev server: `http://localhost:5173`
- Hot module replacement enabled
- Source maps for debugging

**Local Network Testing (Mobile):**
```powershell
# Find your IP address
ipconfig

# Access from phone (same WiFi):
# http://192.168.1.XXX:5173
```

### Production Build

**Build Command:**
```powershell
npm run build
```

**Output:**
- Directory: `dist/`
- Optimized and minified
- Code splitting enabled
- Assets fingerprinted for caching

**Preview Build:**
```powershell
npm run preview
```

### Firebase Deployment

**Prerequisites:**
- Firebase CLI installed globally
- Authenticated: `firebase login`
- Project initialized

**Deploy Command:**
```powershell
firebase deploy
```

**Live URLs:**
- `https://dance-request-app.web.app`
- `https://dance-request-app.firebaseapp.com`

**Hosting Configuration (`firebase.json`):**
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

## Future Enhancements

### Phase 1: Firebase Integration (In Progress)

- [ ] Connect to Firestore for real-time data
- [ ] Implement Firebase Authentication for DJ
- [ ] Replace mock data with live database queries
- [ ] Add anonymous auth for session tracking
- [ ] Implement upvote persistence

### Phase 2: Enhanced Features

- [ ] Browse pre-loaded dance list (modal tabs)
- [ ] Search/filter dance library
- [ ] Duplicate request detection
- [ ] Auto-merge duplicate requests with upvote
- [ ] DJ admin view for request management
- [ ] Mark requests as "Added to Playlist" or "Played"

### Phase 3: Advanced Functionality

- [ ] Event management (create/close events)
- [ ] Request history and analytics
- [ ] CSV upload for dance library
- [ ] Dance metadata (difficulty, style, step sheets)
- [ ] Export event data

### Phase 4: Optimizations

- [ ] Migrate inline styles to Tailwind utilities
- [ ] Implement lazy loading for large lists
- [ ] Add pull-to-refresh gesture
- [ ] PWA support for offline functionality
- [ ] Performance monitoring

---

## Development Notes

### Known Issues

1. **Mock Data:** Currently using hardcoded request data
2. **Session Persistence:** Upvotes don't persist across page refreshes
3. **ID Generation:** Using simple increment (will switch to Firebase auto-IDs)
4. **No Backend:** All state is client-side only

### Code Quality

- **No TypeScript:** Currently using JavaScript (can migrate later)
- **ESLint:** Not configured yet
- **Prettier:** Not configured yet
- **Husky/Git Hooks:** Not configured yet

### Performance Considerations

- Bundle size: ~70KB (acceptable for mobile)
- First paint: < 1 second on 3G
- No code splitting yet (small app)
- Images not optimized yet

---

## Contributing Guidelines

### Code Style

- Use Vue 3 Composition API (`<script setup>`)
- Follow `snake_case` for data model fields
- Use `camelCase` for JavaScript variables/functions
- Use `PascalCase` for component names
- Keep components focused and single-purpose

### Component Guidelines

- Props should be strongly typed with validation
- Emit events for parent communication
- Use computed properties for derived state
- Keep template logic minimal
- Document complex logic with comments

### Git Workflow

- Main branch: `main`
- Feature branches: `feature/feature-name`
- Commit messages: Descriptive and concise
- Test before committing

---

## Support and Resources

### Documentation

- Vue 3 Docs: https://vuejs.org/guide/
- Vite Docs: https://vitejs.dev/guide/
- Tailwind CSS: https://tailwindcss.com/docs
- Firebase Docs: https://firebase.google.com/docs

### Project Files

- Product Requirements: `docs/Project Outline.md`
- Setup Instructions: `docs/SETUP.md`
- User Guide: `docs/README.md`

---

## Changelog

### v1.0.0 - November 20, 2025

**Features:**
- ✅ Request queue display
- ✅ Upvoting system
- ✅ Sort by dance, song, artist, likes, time
- ✅ New request form (dance name, song, artist)
- ✅ Time display on requests
- ✅ Responsive mobile-first UI
- ✅ Modal overlay for new requests
- ✅ Session-based upvote tracking

**Testing:**
- ✅ Playwright test suite
- ✅ Request queue tests
- ✅ Sort functionality tests

**Infrastructure:**
- ✅ Vite build setup
- ✅ Tailwind CSS integration
- ✅ Firebase project initialized
- ✅ Firebase hosting configured

---

**Document End**
