# ericmatchett1.github.io

Portfolio for **Eric Matchett** — Senior Staff AI Engineer (Computer Vision,
Robotics & Multimodal AI). Static, no build step, clean URLs.

## Structure
- `index.html` — one-page **Home** (hero + pipeline, quick stats, about +
  research interests, featured projects, featured videos, skills, news + CTA)
- `experience/index.html` → **/experience/** — vertical timeline of roles
- `education/index.html` → **/education/** — degrees, coursework, research areas, publications
- `resume/index.html` → **/resume/** — metrics + embedded PDF viewer + download

## Shared
- `style.css` — styling + light/dark theme
- `about.css` — hero AI-pipeline + particle styles
- `main.js` — theme toggle, active nav (home anchors + page links), scroll
  reveals, count-up stats, drawing timelines, click-to-play videos, particles
- `assets/` — add `eric-matchett.pdf` for the Resume download + preview

## Nav
Home anchors (`/#about`, `/#projects`, `/#videos`, `/#contact`) + page links
(`/experience/`, `/education/`, `/resume/`). Smooth scroll on home.

## Run locally
Serve from repo root so root-absolute paths (`/style.css`) resolve:

```bash
python -m http.server 8000   # http://localhost:8000
```
