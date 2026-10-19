# Boxi Learn

<https://boxi-learn.github.io> — every subject, from the first seed. A bilingual (English / 中文) K12 site:
Chinese, English, science, physics, chemistry, biology, geography, history and computing, organised by
seeds and five stages instead of school grades. Each lesson has an interactive page you can try with your
own hands. Maths lives on its sister site, [Boxi Math](https://boxi-math.github.io).

- `src/` — Astro 5 site. `src/data/subjects.json` is generated; edit the course data, not this file.
- `public/play/<subject>/<lesson>.html` — self-contained interactive pages (no network), sharing
  `public/play/play.css` and `play.js` (API documented at the top of `play.js`).

```bash
npm install
npm run dev
```

Pushing to `main` deploys to GitHub Pages.

Code: MIT ([LICENSE](LICENSE)). Text and interactive pages: CC BY-SA 4.0 ([LICENSE-CONTENT](LICENSE-CONTENT)); logos and trademarks excluded. By Boxi Yu. Copies published before 2026-10-19 remain available under CC BY 4.0.
