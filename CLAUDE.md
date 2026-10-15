# tridentfilms-site

Trident Films website (cinematic wedding videography, Trident Event Group division). Live: https://www.tridentfilms.ca/

## Stack
- Static HTML/CSS/JS, no framework, no package.json. No build step.
- `api/instagram.js`: Vercel serverless function proxying the @tridentfilms feed JSON from public B2 (published every 30 min by a1 `Automation/ig-feed-sync`) for the homepage feed grid; edge-cached 5 min.
- Vercel Edge `middleware.js`: requests with `Accept: text/markdown` get the page's `.md` twin (`/` -> `/index.md`), or a Markdown 404.
- `webmcp.js`: registers WebMCP in-page tools for browser agents (site guide from `llms.txt`, page Markdown, inquiry form). Loaded via `<script src="/webmcp.js" data-brand="Trident Films" data-inquiry="/inquiry.html">`; `index.html` inlines a copy.
- `vercel.json`: clean-URL rewrites only for `/about`, `/contact`, `/privacy`, `/tylertinowedding`; all other pages are served at `.html` paths. `Vary: Accept` header.
- Analytics: GA4 inline + Vercel Web Analytics (`/_vercel/insights/script.js`).

## Commands (verified on a1)
```bash
npx serve .                 # local preview with clean URLs; /api and middleware do not run locally
python3 -m http.server 8000 # alternative; use /about.html etc.
```
No build, lint or test suite exists.

## Verify (run against live URL or a Vercel preview URL)
```bash
python3 ~/TEG-Labs/Automation/seo-audit/seo_audit.py https://www.tridentfilms.ca/
python3 ~/TEG-Labs/Automation/design-slop/design_slop.py --path .
python3 ~/TEG-Labs/Automation/copy-check/copy_check.py https://www.tridentfilms.ca/
```
Exit codes: 0 clean, 1 warnings, 2 errors. Baseline 2026-10-15: SEO 0 errors / 9 image-weight warnings (images over 300 KB); design-slop flags missing prefers-reduced-motion (fix on branch `a11y/reduced-motion-2026-10-14`, unmerged).

## Layout and conventions
- Every public page is a pair: `<page>.html` + `<page>.md` (Markdown twin), linked by `<link rel="alternate" type="text/markdown">` in the HTML head. Exception: `tylertinowedding.html` (no twin, not in sitemap).
- Blog posts are flat files: `blog-<slug>.html` + `blog-<slug>.md`; city landing pages `brandon.*`, `regina.*`.
- `llms.txt` = agent guide (links the `.md` twins); `sitemap.xml`; `robots.txt`; `images/` = assets (keep new images under 300 KB).
- Adding a page: create `.html` + `.md` twin, add the alternate link and the `webmcp.js` script tag, add to `sitemap.xml` and `llms.txt`.

## Deploy
- Vercel project `site-tridentfilms` (team story93), git-connected. Production branch `main` (push = prod deploy); other branches get preview URLs.

## Hard rules
- Work on a branch. Never push/merge to `main` or deploy prod without Rhoni's explicit OK.
- Commit as `Rhoni Mohanraj <rhoni@tridenteventgroup.ca>` (Vercel blocks deploys from other commit authors):
  `git -c user.name="Rhoni Mohanraj" -c user.email=rhoni@tridenteventgroup.ca commit ...`
