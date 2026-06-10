# ericmatchett1.github.io

Multi-page personal portfolio for **Eric Matchett** — Senior Staff AI Engineer
(Computer Vision, Robotics & Multimodal AI). Static HTML, no build step.

## Pages
`index.html` (Home), `about.html`, `research.html`, `projects.html`,
`videos.html`, `news.html`, `experience.html`, `education.html`,
`contact.html`, `resume.html`.

## Shared
- `style.css` — all styling (light + dark theme via `:root[data-theme="dark"]`)
- `main.js` — theme toggle (persisted to localStorage), active-nav highlight,
  year stamp, and the project/video filter tabs
- `assets/` — see `assets/README.md` (add `eric-matchett.pdf` for the resume download)

## Run locally
Open `index.html`, or serve the folder:

```bash
python -m http.server 8000   # http://localhost:8000
```

## Deploy
Repo is `ericmatchett1.github.io`, so the default branch publishes to
`https://ericmatchett1.github.io/`.
