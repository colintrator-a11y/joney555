# Joney — Portfolio

A single-page portfolio: everything a client needs to judge the work is on one
screen-scroll — who you are, what you build, the stack, the projects, work
history, languages and how to reach you.

Built with Vite + React 18, in four languages, with no UI framework and no
runtime dependencies beyond React.

## Run it

```bash
npm install
npm run dev            # http://localhost:5173
npm run build          # production build into dist/
npm run preview        # serve the built site on :4173
npm run check:locales  # verify every locale has every string
```

## Languages

The site ships in **English, Portuguese, Spanish and Polish**, switchable from
the button group in the header. On a first visit the language is picked from the
browser's preferences (matching on the primary subtag, so `pt-BR` and `pt-PT`
both land on Portuguese) and falls back to English; after that the visitor's
choice is remembered in `localStorage`. Switching also updates `<html lang>`.

Each locale is one file in [`src/i18n/`](src/i18n/) with an identical shape.
`npm run check:locales` fails if a locale is missing a key, has one the others
don't, or is missing a string for an id defined in `src/data/profile.js` — run it
after any translation edit, because a missing key would quietly render as
`undefined` rather than throwing.

To add a language: copy `src/i18n/en.js`, translate the values, and add it to
`localeList` in [`src/i18n/index.js`](src/i18n/index.js).

## Editing the content

Content is split in two on purpose:

- [`src/data/profile.js`](src/data/profile.js) — everything language independent:
  project ids, tags, card accents, skill lists, the language-bar percentages.
  Technology names are proper nouns and live here, not in the locales.
- [`src/i18n/<locale>.js`](src/i18n/) — every string a translator would touch,
  keyed by the ids above.

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
   `id`, `name`, `category` (one of the keys in `projects.categories` in the
   locales), `accent` (`violet`, `teal`, `emerald`, `amber`, `rose`, `slate`,
   which colours the band at the top of the row), `tags`, and `media`: a list of
   `{ file, width, height }` from step 1. The intrinsic size goes on the `<img>`
   so the row does not jump as images load, and how many images there are picks
   the layout:

   | Images | Layout |
   |---|---|
   | 1 | Beside the text. A landscape screenshot takes the wider half of the row, a phone-shaped one the narrower. |
   | 2 | Beside the text, the two sharing one height — a hero shot next to a full-page strip. |
   | 3+ | Above the text at full width: the first image large and whole, the rest as small top-anchored tiles four across beneath it (three below 1000px, two below 560px). |
3. Add the description under `projects.items.<id>` in **all four** locale files,
   as an array of paragraphs.
4. Run `npm run check:locales`. It fails if a locale is missing the description
   or has a different number of paragraphs from the English one.

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
Both filters are keyed by category id and by the tag text, neither of which is
translated, so switching language keeps the selection. "Clear filters" appears
whenever either is set.

Clicking any image opens it full size in a preview, with the project name and,
in a set, a counter and arrows. This is where the top-anchored tiles pay off: a
page capture cropped to a 365x250 tile in the row is shown whole here.

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
the four locales stay as they are.

## The photo

The portrait is [`public/avatar.jpg`](public/avatar.jpg) — a plain file in
`public/`, not a bundled asset, so it can be replaced without touching the code.
The frame is 4:5; the current file is 900×1125. If it is ever missing, the hero
falls back to a "J" monogram rather than a broken image.

## Structure

```
index.html              meta tags, JSON-LD, fonts, pre-paint theme script
src/data/profile.js     language-independent structure
src/i18n/               en, pt, es, pl + locale detection and React context
src/styles/global.css   design tokens (light + dark) and shared primitives
src/components/         one component + one stylesheet per section
scripts/                locale consistency check
public/                 avatar, favicon, robots.txt, sitemap.xml
```

`src/styles/global.css` is imported before `App.jsx` in `main.jsx` so that
component stylesheets come after it in the bundle and can override the shared
primitives — a component rule and a `.btn` rule have equal specificity, so the
order is what decides.

## Before deploying

- Replace `https://dawid-salwecki.vercel.app/` in `index.html` (canonical + Open
  Graph) and `public/sitemap.xml` with the real domain.

The build is fully static — `dist/` can go on Vercel, Netlify or any static host.
