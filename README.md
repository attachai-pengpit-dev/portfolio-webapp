# Portfolio — Attachai Pengpit

Personal portfolio web app built with React 19 and Vite, deployed to GitHub Pages.

**Live site:** https://attachai-pengpit-dev.github.io/portfolio-webapp

## Features

- Single-page layout with sections for About, Experience, Education, Projects, and Contact
- All content driven by one JSON file — no component edits needed to update the résumé
- Typewriter role rotation, animated stat counters, and scroll reveal animations
- Responsive layout with a mobile nav drawer
- Respects `prefers-reduced-motion` (animations fall back to static content)

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | React 19 |
| Build tool | Vite 8 |
| Icons | `lucide-react`, `react-icons` |
| Linting | Oxlint |
| Hosting | GitHub Pages via GitHub Actions |

Plain CSS — no UI framework or CSS-in-JS.

## Getting started

Requires Node.js 20.19+ (Vite 8 requirement).

```bash
npm install
npm run dev
```

The dev server prints a local URL (default http://localhost:5173).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built output locally |
| `npm run lint` | Run Oxlint |

Because `base` is `/portfolio-webapp/`, `npm run preview` serves the app at http://localhost:4173/portfolio-webapp/ — the bare root will 404.

## Project structure

```
.github/workflows/
  deploy.yml       lint + build + publish to Pages on push to main
public/            favicon and static icons
src/
  App.jsx          all sections, hooks, and animation logic
  App.css          component styles
  index.css        design tokens and global resets
  data/
    portfolio.json single source of content
  assets/          hero image and logos
vite.config.js     base path for the GitHub Pages subpath
```

## Updating content

Edit [src/data/portfolio.json](src/data/portfolio.json). It holds:

- `personalInfo` — name, role, tagline, about text, email, phone, location, GitHub, LinkedIn
- `techStack` — skill groups, each `{ category, skills[] }`
- `experience` — roles with `duration`, `highlights[]`, and an optional `current: true` badge
- `education`, `languages`, `interests`, `projects`

A few values live in [src/App.jsx](src/App.jsx) rather than the JSON: the `STATS` counters and the `ROTATING_WORDS` typewriter list near the top of the file.

## Deployment

Pushing to `main` is the deploy. [.github/workflows/deploy.yml](.github/workflows/deploy.yml) lints, builds, and publishes `dist/` straight to GitHub Pages — there is no `gh-pages` branch and nothing to run locally.

Repository setting this depends on: **Settings → Pages → Source = GitHub Actions**.

`base: '/portfolio-webapp/'` in [vite.config.js](vite.config.js) matches the Pages subpath. If the repository is ever renamed, update it to match or every asset 404s.

## License

Personal project — content and résumé data are not licensed for reuse.
