# Design Audit — HadiKatul Uloom

Phase 0 deliverable. Every value below was read from files on disk, not assumed.
Audit date: 2026-10-28. Auditor: automated (no human sign-off yet).

---

## 0. SOURCE-OF-TRUTH PROBLEM (read this first)

The session brief names three sources. Only one of them exists.

| Expected source                        | Actual state                                          |
| -------------------------------------- | ----------------------------------------------------- |
| `docs/HADIKATUL_MASTER_INSTRUCTION.md` | **MISSING** — `docs/` was an empty directory          |
| `docs/LMS_FULL_PLAN.md`                | **MISSING**                                           |
| `Education-Website-main/`              | **MISSING by that name** — the real site is in `old/` |

Consequences, stated honestly:

1. No rule precedence could be applied ("Master Instruction wins on conflict") because neither document was available to compare.
2. Phase definitions and the Definition of Done come **only** from the session brief, not from the master document.
3. The data model in `docs/ARCHITECTURE.md` is built from what the brief itself names
   (`Institution`, `Campus`, `User`, `Membership`, "as in plan §8"). Anything beyond those four entities is marked
   **provisional** and must be reconciled against `LMS_FULL_PLAN.md` when it arrives.
4. `docs/IMPLEMENTATION_STATUS.md` lists this as an open blocker.

Also: the folder is **not a git repository** (`git status` → `fatal: not a git repository`). No history, no diff
baseline. `git init` has not been run because creating a repository is a project-structure decision the user has not
asked for; the brief only asked to _inspect_ `git status`.

---

## 1. Real file inventory (`old/`)

```
old/
  index.html          13,073 B   single page, 7 sections + nav + footer
  style.css           11,692 B   desktop styles
  responsive.css      10,329 B   11 media queries
  extra.css            1,723 B   scrollbar, scroll-driven keyframes
  script.js              273 B   hamburger open/close only
  Images/
    brand.png        355,374 B   wordmark logo
    classroom.jpg    301,210 B   "why us" photo
    mashid.jpg       711,823 B   hero background AND all four team avatars
    call.png           2,800 B   footer phone icon
    inbox.png          2,704 B   footer mail icon
    place.png          3,863 B   footer location icon
    Icon/favicon.png 172,956 B   favicon (heavily oversized)
  svgs/  18 files
    call, close, fb, gmail, group, hamburger, hsc, linkdin (sic),
    location, moon, page, phonecall, right, ssc, teaching, three,
    whatsapp, others
```

Notes: `moon.svg` and `three.svg` are referenced (`three.svg` as the "class 3-12" glyph); `moon.svg` is **unused** in
`index.html`. `mashid.jpg` is reused as the hero backdrop and as four identical team portraits — placeholder
behaviour, not real content.

## 2. Page inventory

One page only (`old/index.html`). Sections in document order:

| #   | id / class                  | Content                                                                      | Interactive elements                                                   |
| --- | --------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| —   | `nav`                       | top utility bar (email, address, 2 phones) + brand + 6 links + CTA           | hamburger toggles mobile menu (real); CTA is a `<button>` inside `<a>` |
| 1   | `#home .maintopic`          | hero: bg photo, 20% black overlay, eyebrow, 2-line h1, 2 sublines, CTA       | CTA `<button>` **does nothing**                                        |
| 2   | `.wehave`                   | 4 stats (students/mentors/experience/classes)                                | none                                                                   |
| 3   | `#courses .academicprogram` | 4 programme cards (class 3-12, SSC, HSC, others) + decorative `teaching.svg` | cards are `<div>`s, not links                                          |
| 4   | `.whywe`                    | photo + 2-paragraph rationale                                                | none                                                                   |
| 5   | `#aboutus .ourteam`         | 4 team cards with 3 social icons each                                        | **all 12 social links are `href="#"`** (dead)                          |
| 6   | `#contactus .contactus`     | call panel (hours + phone) + Facebook page/group panels                      | call button is decorative; FB buttons do nothing                       |
| 7   | `.ourlocation`              | heading, address, Google Maps iframe (real embed URL)                        | iframe works                                                           |
| —   | `footer`                    | brand, link column, contact column, address column                           | **link column is 4× `href="#"`**                                       |

Broken/dead interactive surface total: 2 dead nav/footer link groups (5+4 links), 3 buttons with no handler, 12
social links to `#`, 1 CTA with no behaviour. Under the "no fake buttons, no dead links" hard rule these must be
either wired to a real destination or removed.

## 3. Tokens extracted from the real CSS

### 3.1 Colour (hex exactly as authored)

| Role                    | Value                                             | Where                                                       |
| ----------------------- | ------------------------------------------------- | ----------------------------------------------------------- |
| Primary green           | `#1e8449`                                         | nav CTA, call button, stat 1, "why us" heading              |
| Primary green hover     | `#196f3d`                                         | nav CTA hover, link hover, team heading, call panel heading |
| Accent green (border)   | `#239b56`                                         | programme card hover border                                 |
| Green tint (section bg) | `#eafaf1`                                         | academic programme section                                  |
| Blue tint (section bg)  | `#ebf5fb`                                         | team section                                                |
| Gray tint (section bg)  | `#f7f9f9`                                         | location section                                            |
| Gray surface 1          | `#f0f3f4`                                         | card hover bg, avatar border                                |
| Gray surface 2          | `#f4f6f7`                                         | mobile menu item bg                                         |
| Gray surface 3          | `#ecf0f1`                                         | panel shadows                                               |
| Gold (CTA)              | `#f1c40f`                                         | hero CTA, stat 4, top bar gradient start                    |
| Gold hover              | `#d4ac0d`                                         | hero CTA hover                                              |
| Nav ink                 | `#424949`                                         | nav links                                                   |
| Shadow ink              | `#626567`                                         | hero text-shadow                                            |
| Stat shadow             | `#d7dbdd`                                         | stat text-shadow                                            |
| Card shadow             | `#d0d3d4dc`                                       | team card                                                   |
| Blog blue               | `rgb(61, 175, 253)`                               | stat 2 (off-palette)                                        |
| Coral                   | `rgb(255, 110, 118)`                              | stat 3 (off-palette)                                        |
| Facebook blue           | `#0165E1` / hover `#0258c0`                       | page/group buttons                                          |
| Top bar gradient        | `linear-gradient(45deg, #f1c40f, green, #1e8449)` | utility bar (`green` keyword mixed with hex)                |
| Overlay                 | `#000` @ `0.2` opacity                            | hero scrim                                                  |

### 3.2 Typography

- Single family: **`Baloo Da 2`** (`@import` from Google Fonts), weights 400–800, global weight **500**.
  It is a Bengali+Latin family, which is why the site reads correctly in Bengali — this is the identity, keep it.
- Sizes (desktop → ≤793px → ≤498px):
  hero h1 `56 → 40 → 29`, hero h2 `20 → 16 → 10`, hero eyebrow `16 (default) → 14 → 12`,
  section h2 `46 → 36 → 24`, section h3 `24 → 24 → 14`, card title `26 → 26 → 19`, card sub `17 → 17 → 15`,
  stat value `36 → 36 → 22`, stat label `18 → 18 → 14`, nav link `18 → 15 → 15`, top bar `14`,
  button `15 → 15 → 13`, body copy `20 → 16`, footer heading `24 → 20`, footer link `17 → 14`.
- Weights actually used: 500 (global), 600 (nav, headings, subheads), 650 (stat values, team names), 700 (hero,
  "why us"), 800 (available, unused).

### 3.3 Radii

`6px` buttons · `10px` programme cards, FB panels, scrollbar · `12px` call panel, mobile menu items, timing bar ·
`16px` photos, team cards, map · `50%` avatars.

### 3.4 Shadows

| Name             | Value                                   |
| ---------------- | --------------------------------------- |
| nav              | `2px 2px 15px 2px rgba(75,74,74,0.473)` |
| card (team)      | `5px 5px 15px 5px #d0d3d4dc`            |
| panel (call)     | `5px 5px 15px 5px #ecf0f1`              |
| panel (facebook) | `4px 4px 15px 5px #ecf0f1`              |
| text (hero)      | `2px 2px 4px #626567`                   |
| text (stat)      | `3px 3px 4px #d7dbdd`                   |

### 3.5 Spacing & layout

- Rhythm: `4 5 6 8 9 10 12 16 18 20 24 26 36 52 55 60 80 120` px. Section padding `24`–`52`; large gaps `36`/`52`/`120`.
- Nav height `100px` (`36px` utility bar + `64px`), sticky, `z-index: 6`.
- Hero height `80vh` → `60vh` (≤1600) → `50vh` (≤498); overlay full-size.
- Widths: hero text block `80vw` (→`90vw` ≤854), programme grid `70vw`, member strip `80vw` (→`96/90vw`),
  map `90vw` (→`100%` ≤650), call panel `800px`, FB panels `500px` (→`400` → `300`), programme card `500×150`,
  team card `280×400`.
- Grid strategy in the original: `flex-wrap` everywhere, no CSS grid, several fixed pixel widths.

### 3.6 Breakpoints (exact, from `responsive.css`)

`1600, 1100, 950, 920, 854, 793, 650, 620, 498, 400, 370` px (all `max-width`).
Key behaviour changes: `1100` hides the utility bar, `950` swaps the nav for the off-canvas drawer + hamburger,
`920` stacks the FB panels, `854` centres the hero and hides `teaching.svg`, `498` shrinks the brand to `150px`.

### 3.7 Motion

- Scroll-driven `appear` (opacity 0→1, scale .8→1) on `.animationop`, `last` on footer blocks — uses bare
  `animation-timeline: view()`, so **no fallback** for browsers without scroll-driven animations.
- Hero: `first` fade-in 1.8s; overlay `filter` 0.9→0.2 over 1s.
- No `prefers-reduced-motion` guard anywhere. Must be added.

## 4. Defects found in the legacy source (fix during migration, do not carry over)

1. `<html lang="ban">` — invalid tag; Bengali is `bn`.
2. `#aboutus` section is closed by a stray `</section>`; the `nav` has an extra `</div>`; footer nests `<div>`
   inside `<ul>` and `<li>` is not a child of `ul` in places.
3. `<button>` nested inside `<a>` (invalid interactive nesting), and a duplicated CTA (`ul li.btn` + sibling `<a>`).
4. `href="#"` on 9 links and 12 social icons; 3 buttons with no handler.
5. Hero text positioned with hand-tuned `top/bottom/left` offsets (`top: 36px`, `bottom: -12px`, `bottom: 130px`)
   instead of real spacing → fragile, not responsive.
6. `green` CSS keyword alongside hex in one gradient.
7. Off-palette stat colours (`rgb(61,175,253)`, `rgb(255,110,118)`) with no token names.
8. Assets unoptimised: 711 KB JPG used 5×, 356 KB logo PNG, 173 KB favicon.
9. No `alt` text worth the name (`alt=""` on all decorative-but-load-bearing images, `alt="gmail"`/`"location"`).
10. No focus styles, no skip link, no landmarks (`nav`/`main`/`footer` only), no heading hierarchy
    (h1 → h2 pairs are visually styled but semantically loose).
11. `.members` forces `overflow-x: auto` on a vertical flex column — the team row never wraps sanely.

## 5. Proposed token set (mapped to §3, no invented colours)

Frozen in `src/styles/tokens.css`. Only audited values are used; two families of derived values are labelled:

```
--hu-green-600  #1e8449   --hu-green-700  #196f3d   --hu-green-500  #239b56
--hu-green-50   #eafaf1   --hu-blue-50    #ebf5fb   --hu-gray-50    #f7f9f9
--hu-gray-100   #f0f3f4   --hu-gray-150   #f4f6f7   --hu-gray-200   #ecf0f1
--hu-gold-500   #f1c40f   --hu-gold-600   #d4ac0d
--hu-ink-700    #424949   --hu-ink-500    #626567   --hu-ink-200    #d7dbdd
--hu-slate-300  #d0d3d4   --hu-sky-400    #3dadfd   --hu-coral-400  #ff6e76
--hu-facebook   #0165E1   --hu-facebook-hover #0258c0
```

Derived (documented, not guessed from nothing):

- `--hu-radius-*`: `sm 6 · md 10 · lg 12 · xl 16 · full` (all audited).
- `--hu-shadow-*`: `nav · card · panel · panel-sm · text · text-stat` (all audited).
- `--hu-container`: `min(90vw, 1280px)` — the legacy max useful width is `70vw` at 1920 (≈1344) shaded down to a
  round number; flagged as derived.
- Breakpoints kept **as authored** (`370 … 1600`) and exposed as `--hu-bp-*` for documentation. The audited
  `max-width` queries are converted to mobile-first Tailwind `min-width` screens: `sm 500`, `md 794`, `lg 921`,
  `xl 1101`, `2xl 1601` (from ≤498, ≤793, ≤950/≤920, ≤1100, ≤1600). The unused 370px value is documentation only.

## 6. Migrate vs. scaffold — decision

**Decision: scaffold a fresh Next.js App Router project at the repository root and _port_ the legacy markup into React
components, keeping `old/` untouched as the visual reference.**

Reason:

- The legacy source is 5 static files with no build step, no components, no routing and no shared state. There is
  nothing to "upgrade in place" — migrating means rewriting the markup as components either way.
- The ERP is multi-tenant with server-rendered authz, so the app shell, middleware and data layer must be created
  regardless; retrofitting a framework onto a static page buys nothing.
- Keeping `old/` in place preserves the single evidence source for the design audit and allows pixel comparison.
  Assets are **copied** (not moved) into `public/`, so nothing is destroyed.
- A single root app (modular monolith) rather than a monorepo: the brief forbids microservices and no second
  deployable target exists.

## 7. Migration outcome (Phase 1)

The legacy markup was ported into React components; `old/` remains untouched. Decisions taken during the port and
their reasons:

- **Dead UI removed.** The "আপডেট" nav item, Facebook page/group panels, twelve team social icons and utility-bar social
  icons had no destination. They were removed rather than left as inert controls; re-add them when real URLs exist.
- **Programme cards became anchors** to the real `#contactus` section. The legacy cards were `<div>`s with no action.
- **Team portraits became initials.** The legacy reused `mashid.jpg` (the hero mosque photo) as four different staff
  portraits. A mosque labelled with a person's name is false content, so the stylesheet's circular avatar shape is kept
  with an initial until real photographs are supplied.
- **Images are honest.** The hero backdrop is decorative (`alt=""`); the "why us" photo uses the generic alt
  "শ্রেণিকক্ষ" instead of claiming it is the institution's own classroom.
- **Contrast fixes.** Utility-bar icons are inverted to white on the gold→green gradient; gold buttons use dark ink
  instead of white.
- **Language/layout.** `lang="ban"` → `lang="bn"`; physical spacing/margins replaced with logical properties; a skip
  link, landmarks and `:focus-visible` styles added; reduced-motion fallback added.
- **Keep the audited type size.** The 12px hero subheading was retained rather than rounded up for aesthetics.
- **Framework/package choices.** Fresh Next.js App Router app (see §6), pnpm 12.11.2, Tailwind v4 CSS-first theme, and
  the audited breakpoints converted to mobile-first min-widths. No tokens, colours or fonts were invented.

Full verification log, remaining content risks and database status: `docs/IMPLEMENTATION_STATUS.md`.
