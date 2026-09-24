# Crimson Racing Website

The University of Alabama Formula SAE team's website. Plain HTML/CSS/JS —
no build step, no framework, nothing to install to start editing.

If you're new to this project, also read **`DECISIONS.md`** in this same
folder. It's a full log of *why* the site is built this way — audience,
tone, page structure, tech choices — plus a technical reference section.
This README is the "how to run/edit/deploy it" doc; `DECISIONS.md` is the
"why it's built this way" doc. Keep both.

---

## 1. Running it locally

You need a local web server — you can't just double-click `index.html` and
open it in your browser. The site injects its shared header/footer via
JavaScript (`fetch()`), and browsers block that kind of request when a page
is opened directly from disk (`file://...`). This is a one-time setup, not
a build step you repeat.

**Requirements:** Python 3 (already installed on Mac; on Windows, install
from [python.org](https://www.python.org/) and check "Add to PATH" during
setup).

**Steps:**
1. Open a terminal in the project's root folder (the one with `index.html`
   directly inside it).
2. Run:
   ```
   python3 -m http.server
   ```
   (On Windows, if `python3` isn't recognized, try `python -m http.server`.)
3. Open `http://localhost:8000` in your browser.
4. Edit any file, save it, and refresh the browser tab to see the change.
   Stop the server any time with `Ctrl+C` in the terminal.

No `npm install`, no build command — the site runs exactly as the files sit
on disk.

---

## 2. How to update content (no coding required)

Most of the site's real content — car specs, team roster, sponsors, gallery
items — lives in four JSON files in `/data/`, **not** hardcoded into the
HTML pages. Editing these files updates the live site without touching any
page's layout:

| File | Controls |
|---|---|
| `data/cars.json` | Every car page: stats, results, specs, roster |
| `data/team.json` | The Team overview page and all ten subteam pages |
| `data/sponsors.json` | The Sponsors page logo wall |
| `data/gallery.json` | The Gallery page |

Each file starts with a `"_readme"` field explaining what to fill in — you
can ignore that field itself, it's just a note and isn't shown on the site.

**To edit content directly on GitHub (no local setup needed):**
1. Go to the file on GitHub.com (e.g. `data/cars.json`).
2. Click the pencil ("Edit this file") icon.
3. Make your change, being careful to keep the punctuation (commas, quotes,
   brackets) intact — JSON is picky about this. If you're not sure, copy
   the whole file into [jsonlint.com](https://jsonlint.com/) after editing
   to check it's still valid before saving.
4. Scroll down, add a short commit message describing the change, and
   click "Commit changes directly to the `main` branch."
5. Cloudflare Pages automatically rebuilds and publishes the live site
   within about a minute — no extra step needed.

**Adding a new car (new season):**
1. In `data/cars.json`, copy an existing car entry and give it a new
   unique `"id"` (e.g. `"cr26"`) and the new `"year"`.
2. Copy `cars/2025.html` to a new file named after the year, e.g.
   `cars/2026.html`.
3. In that new file, change `data-car-id="cr25"` in the `<body>` tag to
   match the new car's id (e.g. `data-car-id="cr26"`).
4. Add a link to the new page in `partials/header.html` (the "Garage" nav
   link) and `partials/footer.html` if you want it to be the default
   Garage link going forward — otherwise the sticky car-selector strip at
   the top of every car page will pick it up automatically from
   `cars.json`, no extra linking needed.

**Adding/removing a sponsor:** just add or remove an entry in the relevant
tier in `data/sponsors.json`. The page re-renders whatever is in the file.

**Swapping a placeholder photo for a real one:** every placeholder is a
gray box with a caption telling you what belongs there (e.g. "CR-25 —
Front 3/4 View"). Real photos aren't wired up yet by design — see
`DECISIONS.md` section 1.19 for why, and get in touch with whoever set up
the project if you want help wiring a specific image in.

---

## 3. Deployment (Cloudflare Pages)

The site deploys automatically from GitHub — pushing to `main` publishes
the live site within about a minute. If this hasn't been set up yet, or
you're setting it up for a new Cloudflare account:

1. Push this project to a GitHub repository (if it isn't already).
2. In the [Cloudflare dashboard](https://dash.cloudflare.com/), go to
   **Workers & Pages → Create → Pages → Connect to Git**, and select the
   repository.
3. Build settings: leave the **build command blank** and set the
   **output directory** to `/` (the project root) — there's no build step,
   the files are served as-is.
4. Deploy. Cloudflare gives you a `*.pages.dev` URL immediately.
5. **Custom domain:** in the Pages project's **Custom domains** tab, add
   the team's domain (e.g. `alabamafsae.com`) and follow Cloudflare's DNS
   instructions.

From here on, every push to `main` auto-deploys. See `DECISIONS.md`
section 1.5 for why Cloudflare Pages was chosen over other hosts, and 1.6
for how to make day-to-day edits through GitHub's web UI without ever
touching the command line or Git branches.

---

## 4. Setting up the contact form (Formspree)

The contact form on `contact.html` needs a one-time setup before it will
actually deliver messages:

1. Go to [formspree.io](https://formspree.io/) and create a free account.
2. Create a new form and set its destination to the team's general inbox
   email address.
3. Formspree will give you a form endpoint URL that looks like
   `https://formspree.io/f/abcdwxyz`.
4. Open `contact.html`, find this line:
   ```html
   <form action="https://formspree.io/f/REPLACE_WITH_FORM_ID" method="POST">
   ```
   and replace `REPLACE_WITH_FORM_ID` with your real form ID.
5. Commit and push — the form is now live. Formspree's free tier includes
   a monthly submission limit; check their pricing page if the team ever
   needs more.

The embedded map on the same page uses Google Maps' free "Share → Embed a
map" feature (no API key). To point it at the team's real shop address:
open Google Maps, search the address, click **Share → Embed a map**, copy
the `src="..."` URL from the generated `<iframe>`, and swap it into the
`<iframe>` in `contact.html`.

---

## 5. Project structure

See `DECISIONS.md` section 2 ("Technical Reference") for the full file
map, JSON data schemas, design token reference, and component conventions
(placeholders, the toggle-banner pattern, vertical tabs, etc.). That
section is kept up to date as the single source of truth for how the code
fits together — read it before adding a new page type or component so new
work stays consistent with what's already here.

---

## 6. Known limitations (by design, not oversights)

- **Content "pops in" after page load.** Car specs, team roster, sponsors,
  and gallery items load via JavaScript after the page itself loads —
  there's a brief moment before that content appears. This is the
  accepted tradeoff of avoiding a build step (see `DECISIONS.md` 1.3). A
  future move to a static site generator would resolve it automatically,
  and the JSON data files are already structured to make that move easy
  if the team ever wants to.
- **Video is never hosted on this site.** Embed YouTube/Vimeo links
  instead — see `DECISIONS.md` 1.5 for why.
- **No merch/shop page.** Deferred — see `DECISIONS.md` 1.7.
