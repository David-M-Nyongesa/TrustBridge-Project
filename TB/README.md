# TrustBridge
 
**Bridging asset owners and seekers — rental houses, plus cars and
motorbikes for ride-hailing drivers — on one trusted platform.**
  
---
 
## The Problem
 
In Kenya, house-hunting runs on word of mouth and agents who charge
viewing fees for houses that sometimes don't exist. Drivers and riders
who want a car or motorbike to work on Bolt/Uber depend on knowing
someone who knows someone. And the owners of those assets hand over keys
to strangers on trust alone. There is no single, transparent place where
these two sides meet.
 
## The Solution
 
TrustBridge is a marketplace that treats houses, cars, and motorbikes as
one thing — **assets to be listed, discovered, and leased** — with two
kinds of users:
 
- **Owners** post listings, manage availability, and respond to inquiries.
- **Seekers** browse, filter, save favorites, and send inquiries.
One shared listing model with a `type` field powers all three asset
categories: one card component, one fetching hook, one detail page.
Adding a fourth asset type would be a data change, not new code.
 
## Features
 
- **Browse & filter** — live filtering by asset type, location
  (substring match), and maximum price
- **Listing details** — photos, type-specific facts (bedrooms vs
  make/model), owner info, availability status
- **Inquiries** — seekers contact owners; owners see an inbox on their
  dashboard and can mark inquiries responded
- **Post a listing** — 3-step form (Type → Details → Review) with
  per-step validation; fields adapt to the chosen asset type
- **Signup & login** — role chosen at signup (owner/seeker), sessions
  persist across refresh (mock auth against JSON Server)
- **Role-aware dashboard** — owners: stats, my listings (edit
  status/delete), inquiry inbox; seekers: saved listings, sent inquiries
- **Favorites** — heart any listing; persisted per browser
- **Light / dark mode** — one-click toggle, remembers the choice,
  respects OS preference on first visit
 
## Getting Started
 
```bash
npm install
 
# Terminal 1 — the mock API on http://localhost:3001
npm run server
 
# Terminal 2 — the app on http://localhost:5173
npm run dev
```
 
**Demo accounts** (password `demo1234` for all):
 
| Email | Role |
| --- | --- |
| d.nyongesa@example.com | owner |
| c.muchemi@example.com | seeker |
 
Or sign up a fresh account from the navbar — pick Owner to be able to
post listings.
 
## Project Structure
 
```
TB/
├── db.json                  # JSON Server data (listings, users, inquiries)
├── vite.config.js           # Vite + React + Tailwind v4 plugins
├── public/images/           # listing photos (served as-is at /images/…)
└── src/
    ├── main.jsx             # entry point, mounts <App/>
    ├── App.jsx              # UserContext provider + route table
    ├── index.css            # Tailwind import + @theme palette + dark variant
    ├── assets/images.js     # type → fallback photo lookup
    ├── context/
    │   └── UserContext.jsx  # auth state: login, signup, logout, session
    ├── hooks/
    │   ├── useListings.js   # fetch + filter listings (Browse, Dashboard)
    │   ├── useForm.js       # multi-step form state (PostListing)
    │   ├── useTheme.js      # light/dark mode
    │   └── useFavorites.js  # saved listings (localStorage)
    ├── components/
    │   ├── Navbar.jsx       # persistent nav, active states, theme, auth
    │   ├── FilterBar.jsx    # controlled filters (state lifted to Browse)
    │   ├── ListingCard.jsx  # reusable listing card + price helper
    │   ├── InquiryForm.jsx  # contact-the-owner form
    │   ├── MyListings.jsx   # owner rows: status toggle, delete
    │   └── Inquiries.jsx    # inquiry inbox (owner) / sent list (seeker)
    └── pages/
        ├── Browse.jsx       # home: filters + grid
        ├── ListingDetail.jsx# one listing + owner + inquiry
        ├── PostListing.jsx  # 3-step create form
        ├── Dashboard.jsx    # role-aware: owner vs seeker views
        ├── AuthPage.jsx     # login / signup
        └── About.jsx        # mission + roadmap
```
 
## Custom Hooks
 
**`useListings(filters)`** — abstracts fetching from JSON Server,
loading/error state, and filtering (type, location, max price, owner).
Used by Browse AND Dashboard; exposes `refetch()` for after mutations.
 
**`useForm(initialValues, validate)`** — the mechanics of the multi-step
form: values, errors, step navigation behind one generic `handleChange`.
Validation rules stay in the page, so the hook stays reusable.
 
**`useTheme()`** — syncs React state to the `<html>` `dark` class and
localStorage; respects the OS preference on first visit.
 
**`useFavorites()`** — saved listing ids in localStorage, exposed as
`isFavorite` / `toggleFavorite` and passed to cards as props.
 
## State Strategy
 
`UserContext` holds the only truly global state. The signed-in user and
their role — because Navbar, Dashboard, PostListing, and InquiryForm all
need it at different tree depths. Everything else is local: filter state 
lives in Browse (lifted up from FilterBar), form state lives in `useForm`, 
and listings live in whichever page requested them. 
 
## Authentication (mock — and honest about it)
 
Signup POSTs a user to JSON Server; login matches email + password; the
session is the password-stripped user object in localStorage, restored on
startup by a `useState` initializer. Two deliberate shortcuts, both
roadmap items and neither acceptable in production: passwords are stored
in plain text, and the session is client-side.
 
 
I merged all the work to `main` via Pull Requests, no team member has made direct commits
to `main`.
 
## Live Demo
 
_Add your Vercel/Netlify link here._
 
