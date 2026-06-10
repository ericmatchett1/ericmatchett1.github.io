# ericmatchett1.github.io

Single-page portfolio for **Eric Matchett** — Senior Staff AI Engineer
(Computer Vision, Robotics & Multimodal AI). Static, no build step.

## Files
- `index.html` — the whole one-page site (anchor navigation)
- `style.css` — all styling + light/dark theme (`:root[data-theme="dark"]`)
- `about.css` — hero AI-pipeline + particle/animation styles
- `main.js` — theme toggle, smooth-scroll active nav, scroll reveals,
  count-up stats, drawing timeline, click-to-play videos, neural particles
- `assets/` — add `eric-matchett.pdf` for the Resume button (see `assets/README.md`)

## Sections (anchors)
`#about · #research · #work · #impact · #experience · #videos · #skills ·
#education / #news · #contact`

## Animations (all vanilla JS/CSS/SVG — no frameworks)
Fade-up scroll reveals, staggered cards, count-up numbers, animated AI
pipeline (perception → reasoning → action) with flowing data dots and a
drifting particle field, drawing experience timeline, click-to-play
featured videos. Respects `prefers-reduced-motion`.

## Run locally
Serve from the repo root so root-absolute paths (`/style.css`) resolve:

```bash
python -m http.server 8000   # http://localhost:8000
```

## Deploy
Repo `ericmatchett1.github.io` publishes its default branch to
`https://ericmatchett1.github.io/`.
