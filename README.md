# ericmatchett1.github.io

Multi-page portfolio for **Eric Matchett** — Senior Staff AI Engineer
(Computer Vision, Robotics & Multimodal AI). Static HTML, no build step,
with **clean URLs** (folder-per-page).

## Structure (clean URLs)
| URL | File |
|-----|------|
| `/` | `index.html` |
| `/about/` | `about/index.html` (animated) |
| `/research/` | `research/index.html` |
| `/projects/` | `projects/index.html` |
| `/videos/` | `videos/index.html` |
| `/news/` | `news/index.html` |
| `/experience/` | `experience/index.html` |
| `/education/` | `education/index.html` |
| `/contact/` | `contact/index.html` |
| `/resume/` | `resume/index.html` |

GitHub Pages serves `/about/` from `about/index.html`, so the address bar
shows clean paths with no `.html`.

## Shared assets (root-absolute, e.g. `/style.css`)
- `style.css` — global styling + light/dark theme
- `main.js` — theme toggle, active-nav highlight, year, filter tabs
- `about.css` / `about.js` — animations for the About page only
- `assets/` — add `eric-matchett.pdf` for the resume download

## Run locally
Because pages use root-absolute paths (`/style.css`), serve from the repo
root so `/` resolves correctly:

```bash
python -m http.server 8000   # http://localhost:8000
```

(Opening files directly via `file://` will not resolve the `/`-paths.)
