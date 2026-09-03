# CLAUDE.md — Vango veebileht

Static site for **vango.ee**, built with **Hugo extended v0.165.0**. No theme —
all layouts live in this repo. npm is only for the Playwright E2E tests; the
site itself has no build dependencies.

For human-facing editing instructions see `README.md`; for deeper architecture
(home page assembly, URL building, pagination) see `CONTENT.md`.

## Run it locally

```bash
npm run dev        # hugo server --disableFastRender  → http://localhost:1313
```

A `hugo server` is often already running during a session — check
`ps aux | grep hugo` before starting another. It re-renders on every save,
including on branch switches.

```bash
hugo --gc --minify   # production build into ./public
npm test             # Playwright suite (starts its own hugo server, see playwright.config.js)
```

## Deploy model

- **`main` is the live site.** Every push to `origin/main` (`vangotalu-glitch/vango`)
  deploys automatically via **Cloudflare Pages** (Git integration, no workflow).
  The Pages project builds with `hugo --gc --minify` (Hugo preset, `HUGO_VERSION`
  set as a build environment variable) and serves `public/`; `static/_redirects`
  and `static/_headers` are picked up automatically. `upstream` is
  `koorikla/vango`. CI (`ci.yml`) still runs a Hugo build + the E2E suite on
  every push and PR.
- The user has granted push rights via the `gh` CLI. Since `main` publishes,
  push to `main` only when the change is complete and verified; otherwise use a
  branch + PR.
- End commit messages with the `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>` line.

## Content layout

- Bilingual: **et** is default (`/…`), **en** lives under `/en/…`. Folder names
  are Estonian in *both* languages (`content/et/ruumid/`, `content/en/ruumid/`).
- **Every page exists twice** — once per language — tied together by a matching
  `translationKey` in the front matter. Change one, change both.
- Sections: `uudised` (news), `sundmused` (events), `galerii` (galleries, one
  folder per gallery), `ruumid` (rooms).
- Site-wide text / contacts / partners: `data/et/site.json`, `data/en/site.json`.
- Post cover images: `assets/img/uploads/` — lowercase ASCII names only, no
  spaces, no ä/ö/ü/õ. Referenced as `img/uploads/<name>` (path starts at `img/`).

## Gotchas

- The `---` front-matter block is fragile: straight quotes only, one item per
  line. A blank page or red preview error usually means a typo there.
- **Never rename a room's `slug`** — those URLs are indexed. A rename needs a
  redirect added to `static/_redirects` at the same time.
- `draft: true` in front matter hides a page from the live site (still visible
  in local preview). Removing the line brings it back — e.g. the Heliaed room
  was hidden this way and restored by dropping the line from
  `content/{et,en}/ruumid/heliaed.md`.
- Hugo processes photos to AVIF/WebP/JPEG at several widths. `/resources/` and
  `/public/` are gitignored — never commit generated derivatives (see commit
  "Stop re-encoding every photograph on every push"). CI caches `resources/_gen`.
- Estonian letters are fine in page *titles*, only file/folder names must stay
  plain ASCII.
