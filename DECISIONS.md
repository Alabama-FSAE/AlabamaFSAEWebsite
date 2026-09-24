# Crimson Racing Website — Decision Log & Build Brief

**Purpose of this document:** This is a complete record of the planning process behind the Crimson Racing (University of Alabama FSAE) website redesign — every major decision, the alternatives that were considered, the tradeoffs of each, and why we landed where we did. It's meant to do two jobs:

1. **Hand off to another AI agent or developer** to continue or resume the build with full context, without needing to re-derive any of this reasoning.
2. **Show a human team member** the reasoning and philosophy behind the site's structure, so decisions can be revisited deliberately rather than accidentally undone.

Section 1 covers strategy and content decisions. Section 2 is a technical reference (file structure, data schemas, conventions) for whoever picks up the code. Section 3 is exact build status as of hand-off.

---

## 1. Decision Log

### 1.1 Primary Audience

**Decision:** The homepage and site prioritize **industry recruiters** evaluating the team's technical caliber first, with **prospective members** and **rival FSAE teams** as a very close second priority. Sponsors and competition judges are real but secondary audiences.

**Alternatives considered:**
| Option | Pros | Cons |
|---|---|---|
| Sponsors first | Funding is existential to the team | Sponsors decide based on sponsorship packets and in-person outreach, not by browsing the site — the website's actual job for them is just to look credible and list logos |
| Judges first | Judges do look teams up | Judges score based on the car and in-person presentations, not the website — minimal actual influence |
| Equal priority, no lead audience | Simple, avoids picking favorites | Doesn't resolve real tradeoffs (e.g., what leads the homepage hero, what gets the most detailed treatment) |
| **Recruiters first, recruits/rival teams close second (chosen)** | Directly matches how the team described its own goals: "showcasing what our team does and how good we are as a team and as engineers" for industry recruiters, with new members and competitor teams a close second | Requires real technical depth (specs, data) that the current site doesn't have — raises the bar on content, not just design |

**Why:** This came directly from the team's own framing, not an assumption — they explicitly separated "recruiters" (industry professionals assessing engineering competence, effectively a technical portfolio audience) from "recruits" (prospective members). This shifted the whole project's center of gravity: the car pages need to hold up to scrutiny from a real engineer, not just look nice.

### 1.2 Tone & Voice

**Decision:** Hybrid tone, leaning **technical/professional**, but high-energy — the energy comes from strong photography/videography and confident, clean design, not from hype copywriting or visual clutter.

**Alternatives considered:**
- *Hybrid leaning motorsport hype* — more exciting language, but risks undercutting credibility with the recruiter/technical audience.
- *Straight technical/portfolio, minimal hype* — safest for credibility, but risked feeling dry/corporate and losing the "motorsport vibe" requirement.
- *Full motorsport hype, sponsor-reel energy* — most exciting, but actively works against the "recruiters evaluating engineering competence" priority.

**Why:** The team's own words: "high-energy to captivate the audience... but shouldn't make it too overcrowded or noisy." This directly informed the visual system later (generous white space, restrained accent color use, no decorative clutter) — the design carries the energy so the copy doesn't have to oversell.

### 1.3 Tech Stack Foundation

**Decision:** **Plain HTML/CSS/JS with zero build tools.** Shared header/footer injected via a small client-side JS "include" pattern (`fetch()` + `outerHTML` swap). All car specs and other structured content live in central JSON data files, read at runtime by page-specific renderer scripts.

**Context that drove this:** The site is currently maintained by the team's Communications subteam (media/outreach-focused, not developers), whose stated comfort level is "HTML/CSS/JS basics, not much beyond." The team is open to AI-agent help for anything more complex, but explicitly did not want a structure that *requires* an AI agent to maintain.

**Alternatives considered:**
| Option | Pros | Cons |
|---|---|---|
| Plain HTML/CSS/JS, shared elements copy-pasted into every page | Simplest possible mental model | With 20+ pages, updating the nav/footer means manually editing every file — error-prone and doesn't scale |
| Minimal custom Node build script (stitches partials, generates pages from data) | No framework lock-in, fully transparent | Still requires Node/npm *now*, which the team explicitly wanted to avoid until they have the bandwidth for it |
| Full static site generator (11ty) | Mature, huge ecosystem, very AI-agent-friendly (well-documented, not bespoke) | Requires Node/npm from day one — directly contradicts the team's stated preference to not depend on that yet |
| **Plain HTML/CSS/JS + JS-include pattern + central JSON data (chosen)** | Zero dependencies, zero build step, zero "dependency rot" risk (a real problem for high-turnover student orgs — a framework that "worked" until the one person who understood npm graduated is a common failure mode); anyone can open and hand-edit any file; JSON data files map cleanly onto a real static site generator later if the team ever wants to graduate to one | Some duplication remains (every page needs its own shell); no server-side rendering, so content briefly "pops in" after JSON fetch completes |

**Why:** This is the direct resolution of an explicit tension the team named: *"doesn't rely on [node/npm] now, but allows simplified expansion into node/npm structures in the future."* Plain HTML/CSS/JS satisfies "doesn't rely on it now." Centralizing structured content in JSON (rather than hardcoding it into HTML) satisfies "simplified expansion later" — if the team eventually adopts a real static site generator, the data files transfer over almost directly.

**Known tradeoff accepted:** Content "pops in" after a JSON fetch (no flash-of-unstyled-content issue since data is layout-agnostic, but there's a brief unstyled/unpopulated moment before JS renders). Acceptable for a small team site; would be solved automatically by a future SSG migration.

### 1.4 Local Development Server

**Decision:** Python's built-in `http.server` (`python3 -m http.server`).

**Alternatives considered:**
- *VS Code Live Server extension* — easier (one click, auto-reload), but only if the person uses VS Code specifically.
- *Node's `npx serve`* — works, but pulls in a Node dependency for a team trying to avoid that.

**Why:** Zero install on Mac/Linux, trivial install on Windows, zero project dependencies. **Important technical note:** the JS-include pattern requires the page to be loaded via an actual server — opening an HTML file directly (`file://`) is blocked by browser CORS security for `fetch()` calls. This isn't optional; it's a hard requirement of the architecture chosen in 1.3.

### 1.5 Public Hosting

**Decision (revised mid-conversation):** **Cloudflare Pages** (free tier) for hosting. **Video is never self-hosted** — it's uploaded to YouTube/Vimeo and embedded. **Formspree** (free tier) handles contact/sponsor-inquiry form submissions.

**What changed and why:** The first recommendation was Netlify's free tier. The team pushed back with a specific, well-founded concern: bandwidth and form-submission limits given a site meant to be full of high-res photos, video, and interactive pages, with a stated budget ceiling of **~$15/month** (their site doesn't generate revenue). Research at the time of this conversation confirmed the concern was valid — Netlify had moved to a credit-based pricing model where the free tier works out to roughly **15GB of bandwidth/month**, Personal tier ($9/mo) to ~50GB, and Pro ($20/mo, comfortable headroom) exceeds the budget ceiling. *(Note to whoever picks this up: re-verify current Netlify/Cloudflare pricing before relying on these figures — hosting pricing changes.)*

**Alternatives considered:**
| Option | Pros | Cons |
|---|---|---|
| Netlify free tier | Native form handling built in | ~15GB/month bandwidth — genuinely risky for a media-heavy site |
| Netlify Personal, $9/mo | More headroom (~50GB) | Still a real ceiling; doesn't solve the underlying problem of self-hosting heavy media |
| GitHub Pages | Completely free, simple, well-known | No native form handling (would still need Formspree or similar on top); historically has soft bandwidth guidelines rather than a hard free allowance |
| **Cloudflare Pages + YouTube/Vimeo + Formspree (chosen)** | Free tier gives effectively unlimited bandwidth for static content (fair-use policy restricts using it as a video CDN, which is why video is never self-hosted); custom domain support for `alabamafsae.com` later; $0/month regardless of traffic | No native form handling (solved via Formspree); slightly more moving pieces than an all-in-one platform |

**Why this specific combination:** It solves the actual underlying problem two ways at once — Cloudflare eats unlimited static bandwidth for free, and routing video through YouTube/Vimeo removes the one content type that could actually blow through *any* host's free tier. This is also just standard practice: YouTube/Vimeo compress and stream video far better than a static host would anyway.

### 1.6 Version Control

**Decision:** **Git + GitHub**, with the repo connected to Cloudflare Pages for auto-deploy on every push to the main branch.

**Alternative considered:** Manual drag-and-drop uploads to Cloudflare's dashboard each time. Simpler conceptually, but no change history, no easy rollback, and a manual step required for every single update.

**Why:** The team was already planning a GitHub repo for simulation/code files, so this aligns with existing plans. It also directly addresses a real risk for a high-turnover student org: someone eventually *will* break the live site, and having history + easy rollback matters.

**Explicit caveat acknowledged and accepted by the team:** Git is a genuinely steeper concept for a non-STEM-minded future officer than drag-and-drop uploads. Mitigation: day-to-day content edits (swap a photo, fix a typo, update a car's specs) can be done entirely through **GitHub's web UI** — click a file, click edit, type, commit — with no command line required. The steeper Git concepts (branches, merge conflicts) only come up for larger structural changes, which is exactly where an AI coding agent or a more technical teammate can help. **A plain-language handoff doc for non-technical future officers is a planned deliverable** (see Section 3, "Remaining Work").

### 1.7 Site Map

**Decision:** Eight top-level destinations: **Home, About, Cars/Garage, Team, Sponsors, Join Us, Gallery, Contact.**

**Content deliberately folded into other pages rather than given their own top-level slot:**
| Considered as its own page | Where it actually lives instead | Why |
|---|---|---|
| Results / News feed | Each individual car's page, in a results-forward overview section | A competition result means more attached to the specific car that earned it than floating in a generic news feed |
| Crowdfunding | A section within Sponsors → Sponsor Us | Seasonal/niche — doesn't justify permanent nav real estate |
| Alumni / Team History | A section within About → Our Team | Complements the FSAE competition explainer without adding nav complexity |
| Shop / Merch | Not built — explicitly deferred | The team described it as an occasional seasonal bulk-order item, not a standing need; can be added later if that changes |

**Why the core eight and no more:** Every additional top-level nav item is a small tax on "clean and uncluttered," which the team explicitly asked for. Each of the folded-in items had a clear better home rather than a genuine need for independence.

### 1.8 About Page Structure

**Decision:** **One page, one URL** (`/about.html`), with a **toggle banner** — a two-sided button/tab strip near the top that switches which content panel is shown below it: "What is Formula SAE?" (the competition, explained) vs. "Our Team" (history, structure, culture).

**Alternatives considered:**
- *Split into an "About" dropdown with two separate sub-pages* — rejected because a dropdown nav item for just one page's worth of content isn't worth the added nav complexity for the payoff.
- *One single scrolling page with both topics back-to-back* — rejected because the two topics are only "partially related" (per the team) and reading them as one continuous scroll would blur two distinct purposes (educating a newcomer about FSAE vs. telling Crimson Racing's specific story).

**Why the toggle banner specifically:** It's the team's own proposed solution to exactly this tension, and it's a strong one — no dropdown complexity, but the two topics stay functionally and visually distinct. **This same pattern was reused on the Sponsors page** (see 1.11) once that page turned out to have the same two-topics-one-nav-slot shape.

### 1.9 Cars / Garage — Page Architecture

**Decision:** Each car gets its **own dedicated URL** (e.g. `/cars/cr25.html`), and a **shared, sticky, horizontally-scrollable car-selector strip** (cover photo, car name, competition year) is pinned at the top across every car page, letting a visitor switch cars without losing their place.

**Alternatives considered:**
| Option | Pros | Cons |
|---|---|---|
| One single page, JS swaps car content in place, no separate URLs | Most literally matches "one continuous page" feel; no page reloads | No shareable/bookmarkable link per car (can't text someone "check out our 2025 car"); worse for individual SEO indexing |
| One page, but with clean per-car URLs via client-side routing (History API) | Best of both — shareable URLs *and* no reload | Meaningfully more JS complexity (routing, back-button handling, initial-load state) for marginal benefit at the team's actual scale (~15 cars) and skill level |
| **Separate URL per car + shared sticky strip (chosen)** | Recruiters (the top audience) can be linked straight to a specific car; each car indexed individually by search engines; simpler to build within the plain-HTML-no-framework constraint | Slightly more files (one shell per car) — mitigated by making each shell nearly all boilerplate, with real content coming from JSON at runtime |

**Inspiration:** TU Delft's Formula Student team site uses a "Garage" section with a heritage timeline strip for exactly this kind of year-to-year navigation — validated as a proven pattern in this exact site genre, not a novel risk.

### 1.10 Car Page Content

**Decision:** Each car page includes, in this order:
1. A **rotating hero photo/video gallery** at the top (auto-advances, but always gives manual control via arrows/dots and pauses on hover/focus — an auto-rotating gallery with zero user control is a UX/accessibility problem, not a nice-to-have to skip)
2. A **results-forward overview**: design philosophy blurb, quick stat cards, full event-by-event competition scoring table (Design, Cost & Manufacturing, Presentation, Acceleration, Skidpad, Autocross, Endurance, Efficiency, Overall), performance/dimension specs, and that year's roster
3. **Five vertical tabs** (stacked list on the left, content panel to the right — collapses to a horizontal scrollable strip on mobile, a responsive necessity, not a design compromise): **Powertrain, Chassis & Suspension, Aero, Electrical, Notable/Other** — each with 1–2 supporting photos

**Key research finding that shaped this:** The current Alabama site has **zero technical specs** on any car page — only that year's roster and competition placement. Given the "impress a recruiter/rival team" priority (1.1), this was identified as the single highest-leverage content gap on the whole site.

**A second key finding that shaped the data model:** Crimson Racing has historically run **combustion** (IC engine) cars, and — per a recent team update found during research — is actively working on its **first electric car**. This means the spec schema can't assume one powertrain type; it has to support both, with fields that adapt automatically (see Section 2, Data Schemas).

**Alternatives considered for the tab mechanism:**
- *Accordion/dropdown* — the team's fallback suggestion in case tabs were harder to build. Resolved by pointing out tabs and accordions are **not meaningfully different in implementation complexity** in vanilla JS/CSS (both are "click a button, show one block, hide the others" — they just differ in visual layout). Given that, tabs were kept as originally preferred, since they read more like a spec sheet and less like a form.
- *Six tabs (adding a separate "Performance" tab)* — considered, but performance/dimension data (weight, wheelbase, track width, top speed, 0–60) ended up folded into the overview section instead, alongside results, rather than becoming its own tab. This keeps the tab count at the five the team explicitly confirmed.

**Field categories, and why each was added:**
- *Powertrain & performance, Chassis/suspension/aero, full event scoring, notable highlights* — the four categories the team confirmed together up front, chosen because together they read as a real engineering portfolio rather than a fan page.
- *Electrical/Electronics* — added afterward specifically to give the Electrical subteam (and, for electric cars, LV systems) its own visibility, matching how the team's actual subteam structure is organized.
- *Notable/Other* — added to have a home for one-off accomplishments that don't fit a fixed category (e.g., "first traction control system," "first undertray design") without forcing every car's page into an identical template that can't capture what was actually new that year.

**Gallery concept, and its direct inspiration:** The rotating full-car photo/video gallery at the top of each car page was directly inspired by FaSTTUBe's (TU Berlin) garage page, which uses a similar small rotating gallery per car before the spec details. The team explicitly wanted this "flip through periodically" effect at the top of each individual car page.

### 1.11 Team Page

**Decision:** A **Team overview page** (`/team.html`) shows a quick-glance snapshot — management team (Team Manager, Engineering Manager, Business Manager) and all ten subteam leads, each with a photo — very close to the current site's existing format. Each subteam card is also a link into a **dedicated subteam subpage** (`/team/<subteam-id>.html`) that goes deeper: the subteam's mission, and a list of the **specific senior-engineer roles** that exist within it (e.g., under Aerodynamics: Front Wing, Rear Wing, Undertray, Side Aero, Cooling), each with a short description of what that role owns.

**The decision that was walked back, and why:** The team's original idea was for each subteam subpage to include **individual headshots and bios for every senior engineer** in that subteam (not just the lead) — mirroring the Cars/Garage subpage pattern exactly. This was pushed back on, with the team's own agreement, for a specific reason:

| | Car pages | A 30–50 person senior-engineer roster |
|---|---|---|
| Update cadence | Written once, becomes historical, rarely touched again | Needs re-verifying almost every semester as people graduate, swap roles, or step back |
| Maintained by | Comms subteam, occasionally | Comms subteam, constantly |
| Cost of staleness | Low (a 2024 car page doesn't need 2026 edits) | High (a visibly outdated "meet the team" page — wrong names, graduated members still listed — reads worse to a recruiter than no individual listing at all) |

**Resolution:** Subteam subpages describe **roles, not people**. Leads keep individual photos/bios (both on the overview page and their subteam's page) since they're already the team's "public faces," but individual senior engineers are represented by role descriptions that stay accurate regardless of who currently holds them — updatable once per season rather than chased down person-by-person. This was explicitly requested by the team as the resolution, with the added requirement that the Team overview page still function as a "quick snapshot of the whole team structure," similar to the current site, with the subpages available for visitors who want to go deeper.

**Ten subteams represented:** Aerodynamics, Chassis, Electrical, EV Powersystems, Manufacturing, Powertrain, Suspension, Systems Engineering, Communications, Sponsorship.

### 1.12 Sponsors Page

**Decision:** The Sponsors section keeps its **existing two-part structure** — a tiered sponsor logo wall (**Platinum, Crimson, Gold, Silver, Bronze**) and a separate "how to give" section (email your logo + University of Alabama Gift Fund donation process, with the crowdfunding campaign link folded in) — but delivered as **one URL with a toggle banner**, reusing the exact About-page pattern (1.8), rather than as a nav dropdown with two sub-pages.

**A correction that happened mid-conversation:** The first pass at this decision was made on incomplete information — an initial page fetch found only the "Sponsor Us" (how-to-give) content and concluded, incorrectly, that the team had no formal tiers. The team corrected this, and a follow-up fetch of the actual "Sponsors" subpage confirmed the real tier structure (Platinum/Crimson/Gold/Silver/Bronze, each a grid of logos). **Lesson for whoever continues this project: verify content assumptions against the actual current site before building on them — a plausible-looking summary can still be wrong.**

**Decision explicitly avoided:** Introducing formal sponsor tiers with defined benefit packages (e.g., "Platinum sponsors get X, Gold gets Y") where none currently exist. This was treated as **out of scope for a web redesign** — defining what a $500 vs. $5,000 sponsor actually receives is a business/sponsorship-team decision, not something to invent while building the site. The data structure supports adding a "tier benefits" field later if the team formalizes this themselves.

### 1.13 Join Us Page

**Decision:** Lightweight page — subteam blurbs, meeting time/location, a single "get involved" contact point. **No in-site application or interview system.**

**Why:** Confirmed directly by the team — recruitment is genuinely open ("no formal interview/application... simply that they come to meetings and show enthusiasm and desire to contribute and learn"). Building an application system would have been unnecessary backend complexity for a fundamentally static site, solving a problem the team doesn't actually have.

### 1.14 Gallery Page

**Decision:** Organized **by year, with category tags/filters within each year** (e.g., Competition, Build Nights, Socials).

**Alternatives considered:** By category only (can't jump straight to "just 2025"); one continuous unsorted feed (becomes unmanageable once several years of photos accumulate); by year only with no tags (can't isolate "just competition photos" within a year). Year + tags gives both axes without over-complicating the UI.

### 1.15 Contact Page

**Decision:** A form (via Formspree, emails the team's general inbox) + **Instagram and Facebook links only** (no LinkedIn) + an **embedded Google Map** to the team's shop/workspace location.

**Alternative considered and rejected:** Separate contact-routing options for different inquiry types (Sponsorship vs. Recruitment vs. Press). Rejected in favor of one general inbox a human sorts — simpler to maintain, and cleaner to implement with a single Formspree free-tier endpoint.

**Technical note resolved during planning:** The team was concerned an embedded map might add backend complexity. It doesn't — Google Maps' own "Share → Embed a map" feature generates a keyless iframe embed, purely front-end, zero API key or backend required.

### 1.16 Color System

**Decision:** **White/light-gray dominant background, dark charcoal (not pure black) body text, University of Alabama's official Crimson Flame (`#9E1B32`) as the site's single accent color.** All values implemented as CSS custom-property tokens (see Section 2).

**What changed and why:** The first recommendation was a dark (near-black) background with crimson accent — a very common pattern in motorsport branding generally (most F1 team sites, for instance). The team raised a specific, well-founded objection: this might not comply with University of Alabama brand guidelines. Research confirmed they were right:

- `brand.ua.edu/colors/` specifies a **required primary palette** (Crimson Flame `#9E1B32`, Capstone Gray `#828A8F`, Victory White) that "should be used in all marketing and advertising materials," with a secondary palette capped at **no more than 20% of any design's total color**, and an explicit rule: **"Black should not be used as a primary color element."**
- This directly ruled out a black/charcoal-*dominant* theme.
- A follow-up source, `web.ua.edu/design/color/`, provided a full **WCAG 2.2 AA-compliant web-specific token system** — tonal scales (50–900) for primary (crimson) and neutral (gray), plus semantic informative/positive/negative scales — which became the literal basis for the site's CSS variables.

**Alternatives considered:**
- *Dark base, crimson accent* — the original recommendation; ruled out by brand compliance.
- *Bold crimson + black color-blocking throughout* — not pursued once the "black should not be a primary element" rule was found.
- *Light/white base, crimson accent (chosen)* — brand-compliant, and doesn't actually cost the "sleek/high-energy" feeling: that feeling comes from generous white space, confident typography, and precise/sparing accent use instead of from darkness.

**Why this still achieves the design goals despite not being "dark mode":** The tone decision in 1.2 already established that energy should come from photography and disciplined design, not the color palette itself — so this pivot didn't actually conflict with anything already decided, it just changed *how* the professional/premium feeling gets built.

### 1.17 Typography

**Decision:** **Manrope** (a free Google Font), used across both headings and body copy, varied by weight only — not paired with a second typeface.

**What changed and why:** Research found that UA's actual official web typeface is **Proxima Nova** (per `brand.ua.edu/typography` and `web.ua.edu/design/typography`) — but it's a **paid commercial font**. Official university web pages can use it because they run on UA's centrally-licensed WordPress platform; this team's independently-hosted site (`alabamafsae.com`, not `ua.edu`) almost certainly does not inherit that license, and licensing it directly runs on paid, traffic-tiered pricing.

**Alternatives considered:**
- *Pursue an actual Proxima Nova license* (e.g., checking whether the engineering department has Adobe Creative Cloud access students could use) — left on the table as an option but not pursued for this build; genuinely worth a follow-up if the team wants to match UA's web typography exactly.
- *A free lookalike (Manrope or Montserrat)* — chosen. Both are commonly cited by type-matching resources as close free substitutes for Proxima Nova's geometric-humanist style.
- *Match whatever font the current Wix site happens to use* — offered as an option (would take the team ~10 seconds to check in the Wix editor); the team opted to skip checking and just use the free lookalike instead.

**Why Manrope specifically over Montserrat:** A close call between two reasonable options — Manrope was chosen as slightly more distinctive/technical-feeling, fitting a spec-sheet-style aesthetic better than the very ubiquitous Montserrat. This is a low-stakes, easily reversible choice (a one-line CSS change).

### 1.18 Loading Screen

**Decision:** Appears **only on the Home page**, but **every time** Home is loaded — first visit or clicking "Home" again later in the session (not a global once-per-session suppression).

**Alternatives considered for frequency:** Once per browser session, site-wide (rejected once the team clarified they specifically wanted it tied to the Home page itself, not session state); every single page load site-wide (would actively slow down and annoy repeat visitors clicking between multiple car pages — explicitly identified as bad for the recruiter audience).

**Visual concept — final version, built up over several rounds of iteration:**
1. Starting point: a logo-reveal-with-checkered-wipe concept (initial recommendation).
2. The team's own idea, inspired by (but explicitly wanting to differ from) University of Michigan's top-down car-on-a-skidpad-circle loading animation: a small graphic of their own car driving **horizontally** across a **plain white background**, with the car's apparent speed changing as if tied to page-load progress.
3. **Practical adjustment made to that idea:** the animation is **not actually tied to real network load progress** — since this is a lightweight static site, real load time is typically near-instant, so a progress-tied animation would often finish before anyone registered it happened. Instead, it's a **fixed ~1.2–1.5 second animation** with a crafted acceleration/deceleration easing curve, giving a consistent "changing speeds" feeling on every visit regardless of actual connection speed.
4. **Final combined concept** (the team's synthesis of several offered directions): the ground/road graphic has a **checkered-pattern segment at the finish end** (a graphic treatment, not a separate animated object); **speed lines trail the car with lengths tied to the exact same easing curve as the car's motion** (long during the fast/cruise phase, short during acceleration and deceleration); and the **team logo fades/wipes in left-to-right** as the car passes the horizontal midpoint of the screen.

**Accessibility built in, not requested but included as standard practice:** Respects `prefers-reduced-motion` (skips straight to the end state); includes a manual "Skip" button.

### 1.19 Placeholder Strategy

**Decision:** Every image/video slot site-wide uses a **labeled gray placeholder block** — correct aspect ratio for its slot, a small icon (camera for photos, play for video), and a descriptive caption (e.g., "2025 Car — Front 3/4 View").

**Alternatives considered:**
- *Plain solid-color blocks, no labels* — simpler, but gives no guidance to whoever replaces them later.
- *Hotlink real photos from the current Wix site* — considered and rejected for a concrete technical reason: the build environment has no general internet access to download and properly re-host those images, so this would mean linking directly to images still living on the old Wix site's servers — fragile (breaks the moment that site is ever taken down or Wix reorganizes URLs), and not something to build permanently into a new codebase.

**Why labeled blocks specifically:** They keep every page's layout and proportions accurate to the final design (so the team can evaluate real layout, not just placeholder-shaped boxes), while making it unambiguous to any team member exactly what asset belongs in each slot without guessing.

### 1.20 Logo Asset

**What happened:** The team provided the real team logo file (`CR-LogoFull-White.png`) — the Alabama Script-A mark alongside a "CRIMSON" wordmark and a small identifier, 8000×3825px, with a solid white background baked in (RGB, not transparent).

**Processing decisions made:**
- Generated a **transparent-background version** via simple white-pixel-to-alpha conversion — this is background *removal* on an asset the team already provided, not image *generation*, and stays within the "don't generate images" instruction given at the very start of the project.
- Resized both versions to a web-appropriate width (1200px) from the 8000px original.
- **Cropped and isolated just the Script-A mark** for favicon use, exported at 16/32/48/180/512px — the full horizontal wordmark would be illegible at favicon scale, so only the mark (the most recognizable, simplest element) is used there.

**Why this mattered:** The white-background original works seamlessly against the site's white-dominant theme (1.16) with zero processing needed for most placements; the transparent version adds flexibility for any future placement over a photo or colored section (e.g., the footer).

### 1.21 Homepage Content Flow

**Decision (final):** Hero (latest car photo + welcome message) → "What we're about" pillars → recent results snapshot, tied to the specific car that earned them, with a "see full car" link → footer.

**What was cut from the original proposal, and why:** An earlier draft flow included a dedicated "latest car highlight" section separate from the hero, and a sponsor-logo strip near the bottom. The team's revision merged the car highlight directly into the hero (car photo + welcome message together) and **dropped the sponsor strip from the homepage entirely** — reasoning that sponsors are already committed once they've sponsored and don't need homepage convincing the way a recruiter or prospective member does; that attention is better spent elsewhere.

---

## 2. Technical Reference

This section is for whoever (human or agent) continues the build. It documents the conventions already established so new pages stay consistent with what exists.

### 2.1 Architecture Summary

- **No build step.** Every file is served as-is. Local preview: `python3 -m http.server` from the project root, then visit `http://localhost:8000`.
- **All internal links and asset paths are root-relative** (e.g., `href="/about.html"`, `src="/css/tokens.css"`), not relative to the current file's folder. This means the exact same header/footer partial and the exact same `fetch()` calls work identically whether the current page is at the root (`/index.html`) or nested (`/cars/cr25.html`, `/team/aerodynamics.html`). **This only works when the site is served from its domain/server root** — don't open files via `file://`, and don't deploy into a subdirectory path without adjusting every root-relative reference.
- **Shared header/footer** live in `/partials/header.html` and `/partials/footer.html`, injected into any page via a `<div data-include="/partials/header.html"></div>` placeholder and `/js/include.js`. Other scripts that depend on the header/footer existing (nav toggle, active-link highlighting) listen for the `partials:loaded` event this dispatches — see `/js/nav.js` for the pattern.
- **Structured content lives in JSON**, not hardcoded HTML: `/data/cars.json`, `/data/team.json`, `/data/sponsors.json`, `/data/gallery.json`. Each has a `"_readme"` field at the top explaining what's placeholder and how to extend it. Page-specific renderer scripts (`/js/car-page.js`, `/js/team-page.js`) fetch the relevant JSON at runtime and populate the DOM.

### 2.2 File Structure (as of hand-off)

```
/
├── index.html                  Home (loading screen lives here only)
├── about.html                  Toggle banner: FSAE explainer / Our Team
├── cars/
│   ├── 2025.html                Shell page — data-car-id="cr25"
│   └── 2024.html                Shell page — data-car-id="cr24"
├── team/
│   ├── aerodynamics.html
│   ├── chassis.html
│   ├── electrical.html
│   ├── ev-powersystems.html
│   ├── manufacturing.html
│   ├── powertrain.html
│   ├── suspension.html
│   ├── systems-engineering.html
│   ├── communications.html
│   └── sponsorship.html         (10 subteam shell pages, one per data/team.json id)
├── team.html
├── sponsors.html
├── join-us.html
├── gallery.html
├── contact.html
├── css/
│   ├── tokens.css               Design tokens (color, type, spacing) — see 2.3
│   ├── base.css                 Reset + base element styles + .placeholder + .btn
│   ├── components.css           Nav, footer, toggle-banner, car strip, hero gallery,
│   │                            results table, vertical tabs, cards, forms, etc.
│   └── loading-screen.css       Loading screen only (index.html)
├── js/
│   ├── include.js               Injects header/footer partials
│   ├── nav.js                   Mobile menu + active-link highlighting
│   ├── loading-screen.js        Home-page loading animation
│   ├── toggle-banner.js         Shared by About and Sponsors pages
│   ├── tabs.js                  Vertical tabs (car pages), keyboard-navigable
│   ├── car-page.js              Renders a car page from cars.json
│   ├── team-page.js             Renders team.html AND team/<id>.html from team.json
│   ├── gallery.js               Hero rotating gallery + Gallery page filtering behavior
│   ├── gallery-page.js          Boots gallery.html: fetches gallery.json, calls gallery.js
│   ├── sponsors-page.js         Boots sponsors.html: fetches sponsors.json, renders logo wall
│   └── join-page.js             Boots join-us.html: fetches team.json, renders subteam blurbs
├── data/
│   ├── cars.json                2 sample cars (cr25, cr24) — see schema below
│   ├── team.json                Management + all 10 subteams — see schema below
│   ├── sponsors.json             5 tiers, placeholder logos — see schema below
│   └── gallery.json             2 sample years of placeholder gallery items
├── partials/
│   ├── header.html
│   └── footer.html
├── assets/
│   ├── logo/
│   │   ├── crimson-racing-logo-original.png       Untouched upload (8000x3825)
│   │   ├── crimson-racing-logo-white-bg.png       Resized to 1200px wide
│   │   ├── crimson-racing-logo-transparent.png    Background removed, 1200px wide
│   │   └── mark-transparent.png                   Script-A mark only, isolated
│   └── favicon/
│       └── favicon-{16,32,48,180,512}.png         Generated from the mark
├── README.md                    Setup, deployment, Formspree, and content-editing guide
└── DECISIONS.md                 This file
```

### 2.3 Design Tokens (`/css/tokens.css`)

All colors/type/spacing are CSS custom properties on `:root` — change a value once, it updates everywhere. Key ones:

```css
--color-primary-500: #9E1B32;   /* Official UA Crimson Flame — the one accent color */
--color-neutral-900:  #212124;  /* Body text — NOT pure black, per UA brand rules */
--color-neutral-50:   #F2F3F4;  /* Subtle section backgrounds */
--color-bg:            var(--color-neutral-0);   /* white */
--color-accent:        var(--color-primary-500);
--font-sans: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

Full primary (50–900) and neutral (50–900) scales are defined for cases needing a lighter/darker variant (hover states, tinted backgrounds). See the file for the complete token list, including spacing scale (`--space-1` through `--space-9`) and motion tokens (respects `prefers-reduced-motion`).

**Font loading:** Manrope is loaded via Google Fonts CDN in each page's `<head>` — requires an internet connection to render in the intended font (falls back gracefully to system sans-serif otherwise, which is harmless but not on-brand). If UA brand compliance later requires the real Proxima Nova, only `--font-sans` needs to change, plus adding the appropriate `<link>`/`@font-face` for it.

### 2.4 Data Schemas

**`data/cars.json`** — array of car objects under `"cars"`. Key fields per car:
```
id, name, year, powertrainType ("combustion" | "electric"),
designPhilosophy (string), stats (array of {label, value} — shown as quick stat cards),
results (array of {event, score, max, isTotal?} — the 8 FSAE events + Overall),
roster (array of {name, role}),
specs: {
  performance (array of {label, value} — weight/wheelbase/track/top speed/0-60),
  powertrain_combustion (array of {label, value}),
  powertrain_electric (array of {label, value}),
  chassis (array of {label, value}),
  aero: { description, elements: [{label, value}] },
  electrical: { description, elements: [{label, value}] },
  notable (array of {title, description})
}
```
`car-page.js` picks `powertrain_combustion` or `powertrain_electric` automatically based on `powertrainType`. **To add a new car:** add an entry here, copy `cars/2025.html` to `cars/<year>.html`, change its `data-car-id` attribute, and add the id to the strip (the strip renders from whatever's in this JSON automatically, linking to `/cars/<year>.html` — no separate list to maintain). Car page URLs are year-based (`cars/2025.html`), not id-based, to match the nav/footer/homepage links — see 2.6.

**`data/team.json`** — `"management"` (array of {role, name, bio}) and `"subteams"` (array of {id, name, leadName, shortDescription, mission, roles: [{title, description}]}). One file drives both `team.html` (overview) and every `team/<id>.html` subpage — `team-page.js` checks for a `data-subteam-id` attribute on `<body>` to decide which to render.

**`data/sponsors.json`** — `"tiers"` (array of {name, sponsors: [{name, url}]}). Currently five tiers matching the real current site: Platinum, Crimson, Gold, Silver, Bronze.

**`data/gallery.json`** — `"years"` (array of {year, items: [{category, type ("photo"|"video"), caption}]}).

Every JSON file has a `"_readme"` key at the top (ignored by the renderers, meant for humans/agents) explaining what's placeholder and how to extend it.

### 2.5 Component Conventions Established

- **Placeholders:** any image/video slot renders via a shared `.placeholder` block (icon + caption) — see `/css/base.css`. Renderer scripts generate these inline (see the `placeholder()` helper functions in `car-page.js`, `team-page.js`, `gallery.js`) rather than hardcoding `<img>` tags with missing sources.
- **Toggle banner:** any `.toggle-banner` whose buttons carry `data-target="some-id"` automatically wires up to show/hide `.toggle-panel` elements with matching `id`s — see `/js/toggle-banner.js`. Reused as-is for the (not-yet-built) Sponsors page; no new JS needed, just matching HTML structure.
- **Vertical tabs:** any `.vtabs` block with `.vtabs__tab` / `.vtabs__panel` children wires up automatically, including arrow-key navigation — see `/js/tabs.js`.
- **Root-relative paths everywhere** — see 2.1. Don't introduce `../`-style relative paths; it'll break when files move.
- **Per-page JSON boot scripts:** for a page whose only job is "fetch one JSON file and render it into a container," the pattern is a small dedicated file (`sponsors-page.js`, `join-page.js`, `gallery-page.js`) that fetches, renders, and listens for `partials:loaded` (falling back to `DOMContentLoaded` if the page has no includes) — see any of those three files for the ~15-line template. `car-page.js` and `team-page.js` do the same thing but are larger because they also handle tabs/strips/multiple render targets, so they stayed as their own files rather than following this smaller pattern.

### 2.6 Known Issues Found & Fixed (Sanity Pass)

The final pass through every page (see Section 3) turned up a few non-obvious bugs. Noted here so nobody "fixes" these CSS choices back into bugs later:

- **`backdrop-filter` was silently breaking the mobile nav on every page.** `.site-header` had `backdrop-filter` directly on it for the frosted-glass effect. In Chromium, `backdrop-filter` on an element creates a CSS containing block for any `position: fixed` descendants — and the mobile off-canvas nav (`.primary-nav`, also inside `.site-header`) is exactly that. The effect: instead of covering the full viewport height, the nav drawer was getting clipped to the header's own ~70px box, so opening the mobile menu showed a thin sliver of links near the top instead of a full-height drawer. Fix: the blur now lives on a `.site-header::before` pseudo-element (`position: absolute; inset: 0`) instead of on `.site-header` itself — pseudo-elements have no descendants, so they can't trap anything, and the visual result is pixel-identical. **If you ever add `backdrop-filter`, `filter`, `transform`, `perspective`, or `will-change` to an ancestor of anything `position: fixed`, check the fixed element still covers what it's supposed to.**
- **The open mobile nav covered the button that closes it.** `.nav-toggle` (the hamburger button) and `.primary-nav` (the drawer) are siblings. A `position: fixed` element paints above a plain static one by default, regardless of DOM order — so once the drawer was open, tapping the hamburger again hit the drawer instead of the button underneath it, and there was no other way to close the menu (no backdrop-click-to-close, no Escape handler). Fix: `.nav-toggle` now has `position: relative; z-index: 101`, explicitly above the drawer. Confirmed by scripted open→close→open testing, not just a visual check.
- **`html` had no `overflow-x: hidden`.** The off-canvas nav pattern (`position: fixed` + `transform: translateX(...)`) technically still contributes to `document.documentElement.scrollWidth` even while off-screen, which can let a horizontal swipe on a touch device reveal it, or show a horizontal scrollbar. Added `overflow-x: hidden` to `html` in `base.css` — harmless (nothing on the site relies on horizontal scroll) and closes that off. This also incidentally makes the homepage's hero carousel (which lays its slides out in a row wider than the viewport by design) properly clipped on mobile.
- **The car-selector strip linked to the wrong URLs.** `car-page.js`'s `renderStrip()` built links as `/cars/<car.id>.html` (e.g. `/cars/cr25.html`), but the actual page files are year-named (`/cars/2025.html`) to match how `index.html`, `header.html`, and `footer.html` already linked to the Garage. Fixed to build the link from `car.year` instead of `car.id`.
- **The subteam page template had `padding-bottom: 0` on its only section.** Copied from the car-page pattern (safe there because another section follows immediately), but on a subteam page it's the last thing before the footer, so it left the Roles list touching the footer with no breathing room. Removed the override.

All caught by an automated pass (Playwright + a local `http.server`) that loaded every page, checked for console/page errors, verified the JSON-driven containers actually populate, exercised the interactive components (tab switching, toggle-banner, gallery filters, mobile nav open/close), and screenshotted every page at both a desktop and a mobile viewport. Worth re-running a version of this any time the shared CSS/JS (not page content) changes, since that's where a bug affects every page at once instead of just one.

---

## 3. Build Status As Of Hand-Off

### Complete — the site is fully built

- Full design token system, base styles, and shared component CSS (nav, footer, toggle-banner, sticky car strip, hero gallery, results table, vertical tabs, cards, forms, logo wall, gallery grid)
- Loading screen (CSS + JS), fully matching the final spec in 1.18
- Shared header/footer partials + include pattern + nav behavior (mobile menu, active-link highlighting)
- Toggle-banner component (JS) — used by both About and Sponsors
- Vertical tabs component (JS) — generic, keyboard-accessible
- Hero rotating gallery component (JS) — auto-advance with full manual override, pauses on hover/focus
- Car page renderer (`car-page.js`) — reads `cars.json`, renders strip/hero/overview/tabs, adapts powertrain fields by type
- Team page renderer (`team-page.js`) — handles both the overview page and individual subteam subpages from one data file
- Gallery page filtering (`gallery.js`'s `initGalleryPage`) + its boot script (`gallery-page.js`)
- Sponsors page renderer (`sponsors-page.js`) and Join Us page renderer (`join-page.js`)
- All four JSON data files, populated with clearly-labeled sample/placeholder data (not fabricated "real" figures)
- Logo processed into transparent/white-bg/favicon variants
- **`index.html`** (Home)
- **`about.html`**
- **`cars/2025.html`** and **`cars/2024.html`** — full car page shells
- **`team.html`** — overview page, plus all 10 **`team/<id>.html`** subteam shells
- **`sponsors.html`** — toggle-banner shell (Sponsors / Sponsor Us) with the JSON-driven logo wall
- **`join-us.html`** — meeting info + JSON-driven subteam blurbs, no application system
- **`gallery.html`** — year tabs + category filters + grid
- **`contact.html`** — Formspree form (needs a real form ID, see README), Instagram/Facebook links, keyless embedded Google Map
- **`README.md`** — setup, local dev, Cloudflare Pages deployment, Formspree setup, and a plain-language content-editing guide for non-technical future officers
- A full sanity pass across every page (see 2.6 for what it found and fixed)

### What's genuinely left — not code, just real content

The site is done; what's left is dropping in the team's real information wherever a "Sample text" or `TBD` placeholder currently sits (car specs and results, roster names/photos, subteam leads and bios, sponsor logos, real photos/videos, meeting time/location, and the Formspree form ID). See README.md section 2 for exactly how to do each of these — none of it requires touching code. The one actual technical setup step left is creating the Formspree form and swapping in its ID (README section 4), since the contact form can't deliver anywhere until that's done.
