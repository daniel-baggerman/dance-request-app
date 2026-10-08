# Dance Request App

A mobile-first web app that lets line dancers send song and dance requests to the DJ from their phones. Dancers add requests to a shared live queue and "like" the ones they want to hear, so the DJ can see at a glance what the floor is asking for.

The app only manages the request queue. The DJ's music still plays from their own system.

Built with **Vue 3**, **Vite**, **Tailwind CSS**, and **Firebase** (Firestore + Auth + Hosting).

---

## Features

### For dancers (`/`)

- **Live request queue.** Every phone sees new requests and likes in real time, with no refresh needed.
- **New requests.** Submit a dance name, with optional song title and artist. If the song title is left blank, the dance name is used.
- **Likes.** Tap the heart to like a request, once per device.
- **Sorting.** Sort the queue by likes (default), dance name, song name, artist, or request time.
- **No sign-up.** Each device is signed in anonymously in the background, which is how likes are tracked.

### For the DJ (`/admin`)

- PIN-protected admin dashboard
- Queue statistics: total requests and total likes
- **Clear queue** to delete all requests, for example between events
- **Add sample requests** to load demo data for testing

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | Vue 3 (`<script setup>` single-file components, Composition API) |
| Build tool | Vite 7 |
| Styling | Tailwind CSS 4 plus inline styles |
| Database | Cloud Firestore with real-time `onSnapshot` listeners |
| Auth | Firebase Authentication (anonymous for dancers) |
| Hosting | Firebase Hosting (single-page app rewrite to `index.html`) |
| Testing | Playwright end-to-end tests |

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- A [Firebase](https://console.firebase.google.com/) project with:
  - **Cloud Firestore** enabled
  - **Authentication** enabled, with the **Anonymous** sign-in provider turned on

### Install and run

```bash
git clone https://github.com/daniel-baggerman/dance-request-app.git
cd dance-request-app
npm install
npm run dev
```

The app runs at <http://localhost:5173>. The admin dashboard is at <http://localhost:5173/admin>.

### Use your own Firebase project

The repo is configured for the `dance-request-app` Firebase project. To point it at your own:

1. In the Firebase console, add a web app to your project and copy its config object.
2. Replace the `firebaseConfig` values in [`src/firebase/config.js`](https://github.com/daniel-baggerman/dance-request-app/blob/main/src/firebase/config.js).
3. Update the project ID in [`.firebaserc`](https://github.com/daniel-baggerman/dance-request-app/blob/main/.firebaserc).

Firebase web config values are not secrets; access is controlled by Firestore security rules.

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run the Playwright tests (starts the dev server automatically) |
| `npm run test:ui` | Run Playwright in interactive UI mode |
| `npm run test:screenshots` | Run the tests in Chromium only |

First-time Playwright setup: `npx playwright install chromium`.

---

## Deployment

The app deploys to Firebase Hosting as a static single-page app.

```bash
npm run build
npx firebase login      # first time only
npx firebase deploy --only hosting
```

`firebase.json` serves the `dist/` folder and rewrites every path to `index.html`, so `/admin` works on refresh.

---

## Project structure

```
dance-request-app/
├── docs/                         # Planning and technical documentation
├── src/
│   ├── App.vue                   # Root: waits for auth, routes "/" vs "/admin"
│   ├── main.js                   # App entry point
│   ├── style.css                 # Tailwind import and global styles
│   ├── components/
│   │   ├── RequestQueue.vue      # Dancer view: queue, sort menu, action bar
│   │   ├── RequestCard.vue       # A single request row with like button
│   │   ├── NewRequestModal.vue   # Form for submitting a request
│   │   └── AdminView.vue         # PIN screen and DJ dashboard
│   ├── composables/
│   │   ├── useAuth.js            # Shared auth state, auto anonymous sign-in
│   │   └── useRequests.js        # Live queue subscription, add, like
│   └── firebase/
│       ├── config.js             # Firebase initialization
│       ├── auth.js               # Auth helpers (anonymous, email/password)
│       ├── requests.js           # Firestore reads and writes for requests
│       └── seed.js               # Sample data for testing
├── tests/                        # Playwright end-to-end tests
├── firebase.json                 # Hosting config
├── playwright.config.js
└── vite.config.js
```

---

## Data model

All requests live in a single Firestore collection, `requests`:

| Field | Type | Notes |
| --- | --- | --- |
| `dance_name` | string | Required |
| `song_title` | string | Defaults to `dance_name` if left blank |
| `artist` | string | Optional |
| `upvote_count` | number | Incremented atomically on each like |
| `upvoted_by` | string[] | Anonymous user IDs that have liked the request |
| `status` | string | `pending` (reserved for future DJ workflow states) |
| `timestamp` | timestamp | Server timestamp at creation |

---

## Known limitations

This is an early-stage project. Before relying on it at a real event:

- **Admin access is client-side only.** Hard-coded admin PIN was temporarily added and needs to be removed in later update. The plan is to switch the DJ to Firebase email/password sign-in (helpers already exist in `src/firebase/auth.js`).
- **No Firestore security rules in the repo.** Rules should restrict deleting requests to the DJ and limit each user to one like per request on the server side, not just in the UI.

---

## Roadmap

Planned features from the [project outline](https://github.com/daniel-baggerman/dance-request-app/blob/main/docs/Project%20Outline.md):

- DJ request management: mark requests as "added to playlist" or "played"
- Dance library upload via CSV, with dancers picking from the list
- Autocomplete and duplicate detection (merge a duplicate into a like)
- Manual queue reordering and removing requests
- Events: create, close, and archive per-event queues
- Request history and export after an event

---

## Documentation

More detail lives in [`docs/`](https://github.com/daniel-baggerman/dance-request-app/tree/main/docs):

- [Project Outline](https://github.com/daniel-baggerman/dance-request-app/blob/main/docs/Project%20Outline.md): goals, feature scope, and phased roadmap
- [Technical Documentation](https://github.com/daniel-baggerman/dance-request-app/blob/main/docs/TECHNICAL_DOCUMENTATION.md): architecture, components, and state management
- [Firebase Backend Plan](https://github.com/daniel-baggerman/dance-request-app/blob/main/docs/FIREBASE_BACKEND_PLAN.md): Firestore design and backend integration
- [Setup Guide](https://github.com/daniel-baggerman/dance-request-app/blob/main/docs/SETUP.md): first-time environment setup
