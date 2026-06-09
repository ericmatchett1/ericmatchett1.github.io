# ericmatchett1.github.io

Personal portfolio for **Eric Matchett** — Senior Staff AI Engineer (Computer Vision, Robotics & Multimodal AI).

A single-page, static site — no build step.

## Files
- `index.html` — page content (About, Experience, Research, Media, Skills, Contact)
- `style.css` — all styling
- `assets/` — media files for the Media section (see `assets/README.md`)

## Run locally
Just open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploy (GitHub Pages)
This repo is named `ericmatchett1.github.io`, so pushing to the default branch
publishes it at `https://ericmatchett1.github.io/` (enable Pages → Deploy from
branch → `main` / root in repo Settings if not already on).

## Customize
- Edit text directly in `index.html`.
- Swap colors/fonts via the CSS variables at the top of `style.css` (`--accent`, etc.).
- Add your video/image to `assets/` using the filenames listed in `assets/README.md`.
