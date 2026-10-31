# TeddyPups U.A.E. website

A responsive React recreation of the TeddyPups reference website with a Node.js and Express server.

## Run the website

Requires Node.js 20.19+ (Vite 8) or Node.js 22.12+.

```sh
npm install
npm run dev
```

Open the Vite URL shown in the terminal. For a production build and server:

```sh
npm run build
npm start
```

The Express server serves `dist/` and provides SPA history fallback for all page routes. The local contact API is `POST /api/inquiries`; it validates the form and returns a confirmation, but does not transmit or retain personal information. `GET /api/health` is available for a service check.

## Routes

- `/` — home
- `/puppies` — available puppy directory with breed filters
- `/puppies/:slug` — all 15 puppy profiles
- `/gone-home` — 27 past puppy entries
- `/happy-families` — 64-photo gallery with keyboard-operable lightbox
- `/how-it-works` — adoption, health promise, delivery and collection guide
- `/faq` — nine expandable answers
- `/contact` — contact links and inquiry form

## Project structure

- `src/main.jsx` — React entry point
- `src/App.jsx` — React Router, page lifecycle and interactions
- `src/legacy.js` — page content and reference-site data
- `src/styles.css` — responsive design system and page styles
- `public/assets/` — locally served puppy, family and brand imagery
- `server.js` — Express static server, API validation and route fallback
- `vite.config.js` — React build and local API proxy

## Technologies

React 19, React Router 7, Vite 8, Node.js, and Express 5. The design recreates the reference's cream, caramel and cocoa palette, serif display type, rounded cards, responsive grids, fixed contact bar and warm editorial layout.

## AI tools and prompts

AI tool: OpenAI Codex (GPT-6).

Prompts supplied in this task:

1. “Build a complete clone of the reference website, matching its design, layout, responsiveness, and functionality as closely as possible.” The reference URL was `https://puppy.instabizweb.com/`.
2. “can you complete the whole website and routes use react and node”

External publishing was deferred, so this source has not been pushed to GitHub, deployed, or recorded in Loom.
