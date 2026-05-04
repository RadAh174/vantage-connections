# Vantage Connections — Design Document

> Single source of truth for the design direction.
> No code yet. This is the spec we build from.

---

## 0. Brand

**Name** — Vantage Connections
**Tagline** — *"Websites that put your business in view."*
**Audience** — SMB owners, 35–55, decision-makers, design-literate enough to recognize craft
**Voice** — confident, calm, design-literate. Never patronizing, never aggressive, never "synergy." Speaks like a senior craftsperson explaining their work to a peer.
**Position** — boutique freelance studio building modern, conversion-focused websites. Selective about projects. Honest about scope and timeline.

---

## 1. Concept — "The Vantage Build"

The site has one persistent signature device: **the Viewport.**

A floating browser-window component lives on the right side of the home page. At the top of the page it's a low-fidelity wireframe — gray boxes, lorem placeholder. As you scroll, it progressively resolves: typography appears, then color, then real images and interactivity, until it lands on a real client site scrolling on its own loop.

The page demonstrates what we do **by doing it on itself.**

The Viewport returns on every page in a different role:
- **Work** — every project lives inside a Viewport, all scrolling on slow loops
- **Process** — Viewport walks through phase-by-phase
- **Pricing** — three Viewports side-by-side, each at a different build state (representing the tier)
- **About** — Viewport in the corner with live counter ("currently in flight: 3 projects")
- **Contact** — Viewport types the lead's company name into the wireframe hero in real-time as they fill the form
- **Blog** — Viewport rests; articles take center stage

This single device gives the site coherence. Everything else is restrained around it.

---

## 2. Color System — Aurora

A 5-color palette with strict hierarchy. Most ink budget goes to the first two colors. Coral is used sparingly (~5% of accent surface).

| Slot | Name | Light | Dark | Role |
|---|---|---|---|---|
| **c0** | Plum | `#6E3B6E` | `#C495C4` | Primary — main button, headline italic word, viewport title |
| **c1** | Mint | `#6FBF93` | `#6FBF93` | Secondary — link, viewport button, second-tier emphasis |
| **c2** | Periwinkle | `#7884D2` | `#8B98E5` | Tertiary — eyebrow labels, ambient accents |
| **c3** | Electric | `#4258FF` | `#7B92FF` | Quaternary — chips, emphasis dots, "live" indicators |
| **c4** | Coral | `#E8624D` | `#FF9580` | Minimal — used in ~5% of accent moments. Pull-quote curly mark, error states, the rightmost stat dot |

### Surfaces (light mode focus)
- Page background: `#F8F5EE` — warm cream, not pure white
- Card surface: `#FFFFFF` (elevated) or `#FBF9F4` (calm)
- Text primary: `#1A1A1A`
- Text muted: `#6B6B68`
- Hairlines: `rgba(26, 26, 26, 0.08)`

### Aurora Hairline (signature decorative element)
A 1px-tall horizontal line with `linear-gradient(90deg, plum, mint, periwinkle, electric, coral)`. Used as section dividers, footer top border, under-nav rule. Background-position animates slowly (10s) so the gradient drifts. **The whole palette appears once on every page**, even if the page is otherwise mostly mono-Plum.

---

## 3. Typography

Two-family system.

- **Display — Fraunces** (variable serif, optical-size axis tuned)
  - Hero headlines, section H2s, pull quotes
  - Weight 600 for headlines; 500 italic for accent words ("view")
  - Optical size pinned high for display — softer, sharper at huge sizes
- **Body / UI — Inter Variable**
  - 400 body, 500 UI labels, 600 button labels
  - Letter-spacing -0.011em on body for tighter rhythm
- **Mono — JetBrains Mono**
  - Marginalia, hex labels, stats numbers, code blocks, the "draft 8" annotations

### Scale (fluid)
| Use | Size |
|---|---|
| Hero | `clamp(3.5rem, 7vw, 6.25rem)` |
| H2 | `clamp(2.25rem, 4vw, 3.5rem)` |
| H3 | `1.5rem` |
| Body | `1rem (16px)` / `1.125rem (18px)` for editorial reading |
| Small | `0.875rem` |
| Eyebrow | `0.6875rem`, uppercase, letter-spacing `0.18em` |

### Treatments
- **Italic accent words** — `view`, `vantage`, `connections` rendered in Fraunces italic 500 with gradient text (plum → mint → periwinkle, 135°)
- **Display weight contrast** — paragraphs are deliberately light; Fraunces 600 carries all the weight
- **Underline-on-link** — text links use `border-bottom: 1px solid currentColor`, never `text-decoration` (gradient text + underline behaves better with currentColor)

---

## 4. Layout

- **8px grid** base
- **Outer container** max 1320px, 40px horizontal padding
- **Reading width** 720px max for body-heavy sections (blog, about, case studies)
- **Section vertical rhythm** `clamp(96px, 12vw, 160px)` between sections
- **Asymmetric grids** — most sections use 8/4 or 7/5 columns, never 6/6. Symmetry reads generic.

---

## 5. Motion Vocabulary

The site has motion. None of it is gimmicky. None of it gets in the way of reading.

### Hero motion
- **Headline word rotation** — every 4 seconds, the word "view" cycles through `view → focus → motion → hand`. Vertical slide + gradient text. Pauses on cursor hover.
- **Persistent Viewport progressive build** — slow 60s loop. Wireframe → typography → color → polished → real client site. Driven by scroll position on home, by autoplay on other pages.

### Site-wide
- **Reveal on scroll** — every section: 12px translate up + opacity, 600ms cubic-bezier(0.2, 0.8, 0.2, 1). Once-only per page load.
- **Cursor-aware tilt** — project cards tilt up to 4° max following cursor position with damping. Subtle, not "Active Theory."
- **Custom cursor** — 8px dot by default, expands to 32px outlined ring on interactive elements. Hidden on touch.
- **Marquee strips** — client logos in two opposing rows (top scrolls left, bottom scrolls right). Continuous, no jump.
- **Sticky chapter nav** — appears after 40% scroll, shows current section with a tiny aurora-gradient progress fill.
- **Scroll progress bar** — 1px hairline at top of viewport, aurora gradient.
- **Number counter animations** — stats count up from 0 when entering viewport (700ms easeOutQuart).
- **Aurora hairline drift** — section dividers gently animate the gradient position (10s loop, almost imperceptible).
- **Marginalia hover-fade** — small mono notes in the right margin sit at 30% opacity by default; on hover-proximity (within 200px), fade to 100%.
- **Button states** — 200ms scale `1.02` on hover with subtle saturation lift; 100ms scale `0.98` on press.

---

## 6. Signature Elements (the "cool shit")

### The Viewport
- Browser chrome (3 dots, faint URL bar)
- `-2deg` default tilt, drop shadow, mouse-aware
- 4 build states with cross-fade transition
- States are deliberately art-directed — even the "wireframe" state looks intentional, not a placeholder

### The Available Stamp
Circular rotating badge top-right of nav: `AVAILABLE FOR MAY 2026 · BOOKING NOW · ` written in mono on a circular path, plum on cream, rotates slowly (15s loop). Click → contact page.

### Color-Word System
The italic accent word in every heading is gradient. Used systematically:
- Home hero: "in **view**"
- Work: "Selected **work**"
- Process: "How we **build**"
- Pricing: "Simple **pricing**"
- About: "**Real** people, real work"
- Blog: "**Notes**"
- Contact: "Let's **talk**"

### Marginalia
Small JetBrains Mono notes in the right margin, 60% opacity. Examples:
- "draft 8" next to a polished pull quote
- "this is the part clients always push back on" next to scope items on Pricing
- "ship date: 14 days" next to the timeline on Process
- "we don't take every project" next to selection criteria on About

These read as designer's-notebook annotations. Honest, slightly self-deprecating, never cute.

### Connection Lines (Process page only)
Faint 1px lines drawn between phase cards as you scroll, stroke-dasharray animated. Process becomes a visual diagram of itself.

### Pull Quotes
Fraunces italic 500, ~56px, oversized coral curly quote (`"`) at top-left, body in dark text, byline in mono small below.

### Wordmark
"**Vantage**" in Fraunces italic 500 + "**Connections**" in Inter 600 small caps. Compact form: `V·C` with a tiny aurora-gradient dot between letters.

---

## 7. Page Walkthrough (light mode)

### Home
**Section 1 — Hero**
- Top bar: Wordmark left, nav (Work · Process · Pricing · About · Blog · Contact), Available Stamp right
- Eyebrow (periwinkle): `FREELANCE WEB STUDIO · BASED IN [CITY]`
- Headline: *Websites that put your business in **view**.* (rotating word)
- Lede (Inter 18px, max 480px): "We design and build modern websites for businesses ready to be seen — calm, confident, built to convert."
- CTAs: primary "See our work" (plum), text link "Read our process →" (mint)
- Right column: Persistent Viewport, currently in wireframe state
- Scroll cue: tiny mono "↓ scroll to see what we build"

**Section 2 — Stats strip**
- Aurora hairline above
- 4-stat row: "12 projects shipped" / "100% on time" / "14d avg ship" / "0 active retainers — every site is owned by its client"
- Numbers in Fraunces 600 with plum→mint gradient text, animated counters
- Below: 1-paragraph mission in Inter 18px with key word in plum gradient

**Section 3 — Selected work teaser**
- Eyebrow "SELECTED WORK · 2025–2026"
- Asymmetric 8/4 grid: large featured project (8 cols) + small project (4 cols)
- Each project = Viewport showing the live site, scrolling on slow loop
- Cards have cursor-aware tilt
- Caption: project name (Fraunces 500) + client (mono small) + 2-3 tags (chips)
- "View all work →" link in mint at bottom

**Section 4 — How we work (process teaser)**
- 4 phase chips horizontal: `01 Discovery` / `02 Design` / `03 Build` / `04 Launch`
- Each chip has aurora-gradient border on hover
- Connection lines between chips
- "Read the full process →" link

**Section 5 — Pricing teaser**
- 3 tier cards horizontally: Starter / **Standard** (highlighted plum) / Bespoke
- Each card: tier name, range, 4-bullet feature list, CTA
- Subtle aurora gradient borders on hover
- "See full pricing →" link

**Section 6 — Closing CTA**
- Aurora hairline above
- Big Fraunces: "Have a project in mind? Let's *talk*."
- Email button (plum) + "Schedule a 30-min intro →" (mint link)
- Below: small mono "Currently booking projects for May 2026"

**Footer**
- Aurora hairline
- Wordmark + nav links + small social cluster (LinkedIn, Twitter, Email)
- Tiny mono: `Vantage Connections — based in [city]. © 2026 — Built by hand.`

---

### Work
- Hero: massive `Selected **work**.` Fraunces 700, lede below
- Filter chips: All · Service · E-commerce · SaaS · Agency · Editorial
- Grid of project Viewport cards (3 cols desktop, 2 tablet, 1 mobile)
- Each Viewport scrolls on its own slow loop, slightly different starting offset so the wall of motion isn't synchronized
- Cursor-tilt on each
- Marginalia between rows: "we spend ~3 hours per page on craft"
- Click → case study

### Work Case Study (`work/[slug]`)
- Sticky sidebar metadata: Client, Year, Role, Scope, Services, Visit live →
- Body: H2 sections — *Brief, Approach, Results*
- Full-bleed image moments between sections
- Pull quote from client (real one)
- "Next project" preview card at bottom

### Process
- Hero: `How we **build**.` + lede
- 4 long-scroll sections, one per phase, each with:
  - Massive number (Fraunces 700, gradient text)
  - Eyebrow `PHASE 01 — DISCOVERY` (in Periwinkle)
  - Heading
  - Body (max 720px)
  - 2-3 marginalia annotations on the right
  - Aurora hairline divider
  - Connection line drawn into the next phase as you scroll
- Final section: rough timeline graphic — ASCII-style block layout, mono labels

### Pricing
- Hero: `Simple **pricing**. Honest scope.`
- 3 tier cards stacked mobile, side-by-side desktop:
  - **Starter** — for SMBs needing a clean conversion-focused site fast (5-page max, 2-week ship)
  - **Standard** (highlighted, plum bg, ivory text) — full marketing site with custom design (10 pages, 4-week ship)
  - **Bespoke** — custom motion, integrations, CMS, multi-language ($X+, 6-week+)
- Each card: tier name (Fraunces), price/range, aurora hairline, features list (mono labels + check icons), CTA
- Marginalia: "we don't do hourly. we don't do retainers. we ship and we move on."
- FAQ accordion below: "what's not included?" / "do you do CMS?" / "what if I need changes after launch?"

### About
- Hero: `**Real** people, real work.`
- Two-column: portrait/photo + bio in Inter 18px
- Mission section (full-width pull quote)
- Values list (3-5 items, hand-drawn-feel divider between)
- Tools we use: small grid of logos (Next.js, Tailwind, Sanity, Vercel, Resend) with aurora-gradient hover glow
- Selected clients (real names only) as a marquee row
- Closing: link to Work + Contact

### Blog
- Hero: `**Notes**.` Fraunces 700
- Editorial article cards — large typography, no thumbnails (or one feature image each)
- Per card: date (mono) + title (Fraunces 600) + excerpt (Inter) + read time + tag
- Filter by tag at top
- 3 articles per row desktop, 1 mobile

### Blog Post (`blog/[slug]`)
- Centered 720px reading width
- Date · tag · read-time strip at top (mono)
- Massive Fraunces title
- Body Inter 18px, line-height 1.7
- Pull quotes break the rhythm
- Code blocks: JetBrains Mono with subtle bg
- Aurora hairline at end
- Author bio + previous/next post nav

### Contact
- Two-column: form left, Viewport right
- Form fields: Name, Company, Email, Project type (chips: Marketing site / E-com / SaaS / Other), Budget (chips: <$5k / $5–15k / $15k+ / Not sure), Message
- Validation: subtle coral underline on errors
- The Viewport on the right **lives** — types the entered company name into a wireframe hero in real-time
- Submit → success state: "We'll respond within 24 hours" + Viewport snaps to polished state showing the company's name in the hero
- Below form: alternative contact (email link + scheduling link)

---

## 8. Component Library

| Component | Notes |
|---|---|
| **Button (Primary)** | Plum bg, ivory text, 4px radius, 14px label, scale-1.02 on hover |
| **Button (Secondary)** | Mint outline + mint text, transparent bg |
| **Text Link** | Mint text + 1px solid currentColor underline, 2px padding-bottom |
| **Chip** | 999px radius pill, white surface, hairline border, optional accent dot prefix |
| **Project Card** | 8px radius, white bg, hairline, drop shadow on hover, cursor-tilt |
| **Pricing Card** | 12px radius, optional plum-bg variant for featured tier |
| **Testimonial Card** | -1deg tilt, large Fraunces quote, byline in mono |
| **Form Input** | Bottom border only (no full box), transparent bg, plum on focus, floating label |
| **Marginalia** | 11px JetBrains Mono, 60% opacity, right-aligned in margin, hover-near = 100% |
| **Aurora Hairline** | 1px gradient line, slow drift animation |
| **Viewport Device** | Browser chrome, -2deg tilt, mouse-aware, 4 build states |
| **Wordmark** | Fraunces italic "Vantage" + Inter caps "Connections" |
| **Available Stamp** | Circular text-on-path, 64px, plum on cream, 15s rotation |
| **Custom Cursor** | 8px dot → 32px ring on interactive |
| **Stat Strip** | Fraunces 600 number with plum→mint gradient, mono label, animated count-up |
| **Pull Quote** | Fraunces italic 500 ~56px, oversized coral curly mark, byline in mono |

---

## 9. Inspiration & References

What we're studying, and what we're borrowing from each:

- **Pentagram** (pentagram.com) — editorial typography weight, magazine-grade headlines, generous whitespace discipline
- **Tiny Wins** (tiny.wins) — monochrome-with-accent rigor; we adapt this with plum dominant + aurora as supporting cast
- **Studio375** (375.studio) — fluid typography, modern kinetic feel without scroll-jack
- **Hello Monday** (hellomonday.com) — handcrafted motion that doesn't overwhelm
- **Linear** (linear.app) — subtle gradient borders on cards (lifted directly for pricing/process)
- **Humaan** (humaan.com) — calm transitions, soft on-entry
- **Brittany Chiang** (brittanychiang.com) — sticky chapter nav with progress fill
- **Studio Dialect**, **Unseen Studio**, **Joby**, **Voku.Studio** — recent (early 2026) Awwwards SOTD winners; current craft reference points

---

## 10. Anti-patterns (what we deliberately won't do)

- ❌ No WebGL hero
- ❌ No scroll-jacking (pinning sections that prevent normal scroll)
- ❌ No autoplay video with sound
- ❌ No popup chat overlays
- ❌ No carousel/slider on the home page
- ❌ No mock testimonials, fake client logos, or invented stats — all content has to be real
- ❌ No "schedule a free consultation" sales-pressure patterns
- ❌ No infinite scroll
- ❌ No hamburger menu on desktop unless screen <800px
- ❌ No dark patterns, period

---

## 11. Open Questions (lock before build)

- [ ] Real client list — which 4-6 lead the Work page, which 1-2 lead the Home teaser
- [ ] Founder/team direction — solo with photo, team with photos, or wordmark-only
- [ ] Pricing tiers — exact numbers or ranges
- [ ] Real stats — sites shipped, on-time rate, avg ship time
- [ ] Domain — `vantageconnections.com` or `.co` or `.studio`
- [ ] City to mention in footer / about
- [ ] Initial blog content — 2-3 real posts at launch, or skip blog at v1

---

*Document version: v1 — May 2026*
