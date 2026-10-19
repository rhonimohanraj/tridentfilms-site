# Trident Films site (tridentfilms.ca)

## Architecture
- Plain static HTML, no framework, no package.json, no build step. Each page is a hand-written `*.html` at repo root (index, about, book, brandon, regina, contact, inquiry, privacy, our-thoughts, blog-*.html, tylertinowedding).
- Every `*.html` has a hand-maintained Markdown twin `*.md` (same basename) for agents; edit both together. Also `llms.txt`, `robots.txt`, `sitemap.xml`, `webmcp.js` (WebMCP in-page tools, configured via data-attrs on its script tag).
- `middleware.js` (Vercel Node middleware): serves the `.md` twin when the request sends `Accept: text/markdown`, agent-friendly 404s; browsers pass through. Matcher skips static asset extensions.
- `api/instagram.js` (Vercel function): proxies the IG feed JSON from public B2 (published every 30 min by a1 `Automation/ig-feed-sync`); edge-cached 5 min. Homepage keeps static fallback tiles if it fails.
- `vercel.json`: clean-URL rewrites (/about, /contact, /privacy, /tylertinowedding) and `Vary: Accept`. New clean URLs need a rewrite entry.
- `images/` holds all media (large; includes a banner .mp4). `.gitignore`: `.claude/`, `.vercel/`.
- Deploy: Vercel (git push to origin `rhonimohanraj/tridentfilms-site`, main auto-deploys). No `.vercel` link in this checkout. Live: https://www.tridentfilms.ca (200).
- Env vars: none required.

## Verify
- `cd Websites/tridentfilms-site`
- `for f in middleware.js api/instagram.js webmcp.js; do node --check $f; done` (passed)
- `node -e 'JSON.parse(require("fs").readFileSync("vercel.json"))'` (passed)
- Preview: `python3 -m http.server 8080` then http://localhost:8080/ (static only; middleware/api/rewrites need `vercel dev`, unverified).
- After adding a page: update sitemap.xml, llms.txt, the `.md` twin, and a vercel.json rewrite if using a clean URL.
- Then run the teg-site-checker agent on the branch or https://www.tridentfilms.ca.
