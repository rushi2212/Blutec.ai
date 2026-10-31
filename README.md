# TeddyPups U.A.E. website clone

A responsive, multi-page front-end recreation of the TeddyPups U.A.E. website at https://puppy.instabizweb.com/.

## Run locally

Requires Node.js 18 or newer; no package install is needed.

```sh
npm start
```

Open http://localhost:4173. The lightweight Node server provides history fallback for each route. `netlify.toml` and `vercel.json` provide the same rewrite behavior for static hosting.

## Project structure

- `index.html` — shared application shell and metadata
- `app.js` — page content, puppy data, navigation, filters, accordion and photo viewer
- `styles.css` — responsive layout, typography, colors and components
- `assets/` — locally bundled reference photos and logo
- `server.js` — no-dependency development server
- `netlify.toml`, `vercel.json` — static host route rewrites

## Implementation notes

The reference is a Next.js site. This clone uses plain HTML, CSS and JavaScript so it stays small and easy to run. It includes the home page, puppy listing, individual puppy profiles, how-it-works, FAQ, contact, happy-families and gone-home pages. The listing has breed filters; the FAQ is expandable; family photos open in an accessible keyboard-operable lightbox. The mobile menu and fixed WhatsApp/call actions are present on narrow screens.

Images and logo were bundled from assets already rendered by the reference page and stored locally. The visual system follows its warm cream, caramel and cocoa colors, serif display type, hand-lettered labels, rounded cards, outlined pill buttons and quilt-inspired hero edge. Some repeated family-gallery and puppy images stand in for reference items that were not present in the rendered initial page asset set.

## AI tool and exact prompt

AI tool: OpenAI Codex (GPT-6), used for reference inspection, implementation and documentation.

Initial user prompt (verbatim):

```text
"C:\Users\rushi\OneDrive\Desktop\Blutec"

**Assignment: Clone the Complete Website**

**Reference Website:**\
[https://puppy.instabizweb.com/](https://puppy.instabizweb.com/ "https://puppy.instabizweb.com/")

**Requirements:**

Build a complete clone of the reference website, matching its design, layout, responsiveness, and functionality as closely as possible.

You are required to:

1. Deploy the website and share the live URL.
2. Share your GitHub repository with the complete source code.
3. Record a Loom video with screen sharing, explaining:
   - Your development process and project structure.
   - Technologies and tools used.
   - AI tools used and the exact prompts provided.
   - Implementation decisions and challenges faced.
   - Testing and deployment process.
```

## Loom walkthrough outline

1. Start on the live clone and compare its home page with the reference.
2. Open the project folder; walk through `index.html`, `app.js`, `styles.css`, and `assets/`.
3. Explain that the implementation uses plain HTML/CSS/JS plus a tiny Node static server, with no runtime dependencies.
4. Show the mobile menu, breed filters, a puppy profile, FAQ accordion, photo lightbox, and WhatsApp/call links.
5. Explain the design choices: warm palette, serif headings, scalloped quilt hero, rounded cards, responsive grids and persistent contact bar.
6. Mention the main constraint: the source is an existing Next.js site, and some off-screen family imagery was not included in the initial browser asset inventory, so available puppy imagery is reused in the family gallery.
7. Show local run steps (`npm start`), then open the hosted URL and repository once those are available.
8. Read the “AI tool and exact prompt” section above aloud or show it on screen.
