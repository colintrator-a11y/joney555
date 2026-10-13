# Joney — Portfolio

A single-page portfolio: everything a client needs to judge the work is on one
screen-scroll — who you are, what you build, the stack, the projects, work
history, languages and how to reach you.

Built with Vite + React 18, in English, with no runtime dependencies beyond
React. The sections written first carry their own CSS; the loading screen and
the header dock are CSS3 and Tailwind.

## Run it

```bash
npm install
npm run dev            # http://localhost:5173
npm run build          # production build into dist/
npm run preview        # serve the built site on :4173
npm run check:locales  # verify every id has its string
```

## The loading screen

A CSS3 cube turning in perspective, held until the page is worth looking at.

It is markup and inline CSS in [`index.html`](index.html), not a component: a
React loader cannot paint until the bundle it lives in has downloaded, which is
the wait being covered. [`src/utils/bootScreen.js`](src/utils/bootScreen.js)
takes it away once the fonts have resolved and the portrait has decoded — at
least 450ms so it reads as a transition rather than a flicker, and at most
3.2s, because a font that never resolves must not leave anyone watching a cube.
Under `prefers-reduced-motion` the cube holds one angle and only the bar
pulses.

## The 3D layer

Three behaviours, one vocabulary, in [`src/styles/depth.css`](src/styles/depth.css)
with the geometry and [`src/utils/depth.js`](src/utils/depth.js) with the numbers:

| Attribute | What it does | Where |
|---|---|---|
| `data-tilt` | Turns towards the pointer and lifts off the page under it. `data-tilt="soft"` halves the angle for anything large. | Service, area and skill cards, project rows, the portrait, the stat tiles, the work history |
| `data-press` | Rises on hover and goes *into* the page on the press itself | Buttons, filters, tags, the preview controls, back-to-top |
| `data-reveal` | Arrives rotated back in perspective and settles upright on scroll | Every card and panel below the fold |

The runtime is delegated from the document rather than wired into components:
the work list rebuilds on every filter change, and handlers bound to a card
would have to be rebound each time. A `MutationObserver` picks up cards that
arrive later, so a filtered list reveals like the first one did.

Three things it will not do. **Tilt on a touch screen** — there is no hover to
tilt during, and a phone has the least compositing power to spare, so pointer
tilt is behind `(hover: hover) and (pointer: fine)`. **Anything under
`prefers-reduced-motion`** — the transforms are dropped, not just shortened,
since the global rule would otherwise apply them instantly instead of not at
all. **Hide content from a visitor whose script never runs** — the rules that
hold a card back until it is revealed are scoped to `.depth-ready`, a class
added by the runtime, so the page without it is the page with everything
visible.

Each tilt costs two custom properties and one `requestAnimationFrame` per
frame; nothing reads layout except the hovered card's own rect.

## The header

A dock: a floating pill of icons, centred, as wide as its contents rather than
the window. [`src/components/Navbar.jsx`](src/components/Navbar.jsx), in
Tailwind utilities.

Each section is one circle, labelled for screen readers and captioned on hover
for everyone else; the section being read is filled with the accent colour,
worked out on scroll rather than with an observer, since "the last section whose
top has passed the dock" is what the eye agrees with. It is `sticky`, not
`fixed`, so it takes its own height in the flow and nothing underneath has to be
padded out of its way. The row fits six sections, the mark and the theme toggle
down to 320px.

## Tailwind

Tailwind v4 through `@tailwindcss/vite`, configured in
[`src/styles/tailwind.css`](src/styles/tailwind.css) — theme and utilities
only, **no preflight**. Preflight would reset the elements the stylesheets in
`src/components/` already style, and those sheets are unlayered: an unlayered
rule beats a layered one whatever the order, so the reset would be the one part
of Tailwind that could not be overridden. Buttons are the exception preflight
usually handles, so `global.css` resets those four properties by hand.

New work can use either; what exists keeps its own stylesheet.

## Copy

Every string on the page lives in [`src/i18n/en.js`](src/i18n/en.js), keyed by
the ids in `src/data/profile.js`. `npm run check:locales` fails if an id is
missing its string — run it after any copy edit, because a missing key would
quietly render as `undefined` rather than throwing.

## Editing the content

Content is split in two on purpose:

- [`src/data/profile.js`](src/data/profile.js) — everything language independent:
  project ids, tags, card accents, skill lists.
  Technology names are proper nouns and live here, not in `en.js`.
- [`src/i18n/en.js`](src/i18n/en.js) — every string on the page, keyed by the
  ids above.

## Adding a project

1. Put the screenshots, GIFs or video stills in `src/assets/projects/`. Any size
   or aspect ratio: the lead image of a project is always shown whole and never
   upscaled past its own resolution. In a set of three or more, the images after
   the lead become uniform tiles anchored to the top of each — a set can mix a
   phone montage with a 6500px-tall page capture, and letting every one keep its
   own height leaves the row ragged. Put the image that has to be seen entire
   first. Vite hashes the files on build, so replacing an image cannot leave
   visitors on a cached old one.
2. Add an entry to `projects` in [`src/data/profile.js`](src/data/profile.js) —
   `id`, `name`, `category` (one of the keys in `projects.categories` in
   `en.js`), `accent` (`violet`, `teal`, `emerald`, `amber`, `rose`, `slate`,
   which colours the band at the top of the row), `tags`, and `media`: a list of
   `{ file, width, height }` from step 1. The intrinsic size goes on the `<img>`
   so the row does not jump as images load, and how many images there are picks
   the layout:

   | Images | Layout |
   |---|---|
   | 1 | Beside the text. A landscape screenshot takes the wider half of the row, a phone-shaped one the narrower. |
   | 2 | Beside the text, the two sharing one height — a hero shot next to a full-page strip. |
   | 3+ | Above the text at full width: the first image large and whole, the rest as small top-anchored tiles four across beneath it (three below 1000px, two below 560px). |
3. Add the description under `projects.items.<id>` in `src/i18n/en.js`, as an
   array of paragraphs.
4. Run `npm run check:locales`. It fails if the description is missing.

The headline "projects" count in the hero follows `projects.length`.

## Browsing the work

The four areas named in the About list — E-commerce, Web apps, Mobile, AI &
automation — are links into the work section. Each selects a **focus**: a set of
categories broader than any single chip, defined by `focusAreas` in
`src/data/profile.js`. The four sets are disjoint and between them cover every
category, so no project is unreachable and none appears under two areas. A focus
shows as an active chip at the front of the row, and picking any category chip
clears it, since the two narrow the same axis.

Two more filters, which combine: category chips across the top, and a **skill**
dropdown listing every tag in use with its count, in two groups — the tags that
appear on more than one project first, then the ones unique to a single
project. Every tag on a project row is
also a button — clicking one filters to that skill, clicking it again clears it.
"Clear filters" appears
whenever either is set.

Clicking any image opens it full size in a preview, with the project name and,
in a set, a counter and arrows. This is where the top-anchored tiles pay off: a
page capture cropped to a 365x250 tile in the row is shown whole here.

On a touch screen the image also takes the gestures the picture invites:
pinch to zoom anywhere between fit and 5x, drag with one finger to pan once
zoomed, and — at fit size, where there is nothing to pan — a sideways swipe
moves through the set.

Clicking the image zooms it to 2x, and clicking again returns it to fit. The
wheel, the buttons and `+` / `-` step through to 5x in 25% increments. A click
or a wheel zoom keeps the pixel under the pointer where it is, rather than
scaling about the middle of the picture. Zoomed, the image can be dragged, and
panning is bounded so it cannot be pushed out of view. `0` or the percentage
button resets it; changing image resets it too. Escape closes, the arrow keys move through the set, and
the page behind is held still.

Clicking anywhere that is not the image or a control closes the preview - the
dimmed surround, the space beside a portrait image, the caption bar. A click
that ends a pan does not count.

Large GIFs are worth optimising before they go in.
[`scripts/optimize-gif.py`](scripts/optimize-gif.py) does it — the Rasa demo went
from 4.0 MB to 2.2 MB at 480px wide and every second frame, with the running time
unchanged:

```bash
python3 scripts/optimize-gif.py demo.gif src/assets/projects/demo.gif
```

It needs Pillow and a `gifsicle` binary (`GIFSICLE=/path/to/gifsicle` if it is
not on PATH). The order it uses matters: letting gifsicle do the resize itself
dithers flat backgrounds into visible yellow-green noise, and giving each frame
its own palette defeats gifsicle's frame differencing and makes the file bigger.

Screenshots are worth converting to JPEG and capping at around 800px wide for
tiles, 1000-1600px for a lead — Ayiko's six page captures went from 1.7 MB of PNG
to 0.5 MB that way. A full-page capture only ever shows its top as a tile, so
crop it there rather than carrying thousands of pixels nobody downloads for a
reason.

## Contact channel

The contact section is a mail form: name, email and message, in
[`src/components/Contact.jsx`](src/components/Contact.jsx). Both it and the
address printed beside it read `profile.contactEmail` from
[`src/data/profile.js`](src/data/profile.js), so changing that one line moves
every destination on the page.

There is no server in this project, so nothing is posted anywhere. Submitting
builds a `mailto:` — subject, message, and the sender's name and address in the
body — and hands it to whatever mail client the visitor has registered. That is
also why the address is printed in full next to the form: a browser with no mail
handler does nothing at all with a `mailto:`, and without the address in plain
sight such a visitor would be stuck.

To post to a real endpoint instead (Formspree, Getform, a function of your own),
replace the body of `submit` with a `fetch` to it. The fields, the labels and
the copy stay as they are.

## The photo

The portrait is [`public/avatar.jpg`](public/avatar.jpg) — a plain file in
`public/`, not a bundled asset, so it can be replaced without touching the code.
The frame is 4:5; the current file is 900×1125. If it is ever missing, the hero
falls back to a "J" monogram rather than a broken image.

## Structure

```
index.html              meta tags, JSON-LD, fonts, pre-paint theme script
src/data/profile.js     language-independent structure
src/i18n/               English copy (en.js) and the React context that serves it
src/styles/global.css   design tokens (light + dark) and shared primitives
src/styles/tailwind.css Tailwind theme + utilities, without preflight
src/styles/depth.css    the tilt / press / reveal vocabulary
src/components/         one component + one stylesheet per section
scripts/                copy coverage check, GIF optimiser
public/                 avatar, logo, "J" tab icon, robots.txt, sitemap.xml
```

`src/styles/global.css` is imported before `App.jsx` in `main.jsx` so that
component stylesheets come after it in the bundle and can override the shared
primitives — a component rule and a `.btn` rule have equal specificity, so the
order is what decides.

## Before deploying

- Replace `https://dawid-salwecki.vercel.app/` in `index.html` (canonical + Open
  Graph) and `public/sitemap.xml` with the real domain.

The build is fully static — `dist/` can go on Vercel, Netlify or any static host.
