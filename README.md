# Movie App

A movie browsing app built with Nuxt, powered by [TMDB](https://www.themoviedb.org/). It has no authentication and no database: movie data comes from TMDB through Nuxt server routes.

![Nuxt](https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3-4FC08D?logo=vuedotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-4-FFD859?logo=pinia&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

![Screenshot placeholder](docs/screenshot.png)

> Screenshot coming soon.

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | [Nuxt](https://nuxt.com/) 4 with TypeScript |
| UI | [Vue](https://vuejs.org/) 3 (Composition API, `<script setup>`) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) 4 (Vite plugin) |
| State | [Pinia](https://pinia.vuejs.org/) (`@pinia/nuxt`) |
| Data | [TMDB API](https://developer.themoviedb.org/) via Nuxt server routes |
| Development | Docker and Docker Compose |

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with Docker Compose v2
- [Git](https://git-scm.com/downloads)
- A free TMDB account and API key:
  1. [Sign up for TMDB](https://www.themoviedb.org/signup)
  2. Request an API key at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

Node.js does not need to be installed on your machine. Everything runs in the container.

## Getting started

Clone the repository:

```bash
git clone https://github.com/sadrulhossain/gd-movie-app-vue.git
cd gd-movie-app-vue
```

Create your environment file:

```bash
cp .env.example .env
```

Open `.env` and set your values:

| Variable | Description | Secret |
| --- | --- | --- |
| `NUXT_TMDB_API_KEY` | Your TMDB API key. Server-side only, never sent to the browser. | **SECRET** |
| `HOST_PORT` | Port on your machine the app is served on. Default: `3004`. | No |

Start the app:

```bash
docker compose up
```

The first start installs dependencies inside the container, so it takes a few minutes. When the log shows `Ready`, open [http://localhost:3004](http://localhost:3004).

Stop the app:

```bash
docker compose down
```

Rebuild the image (for example after changing the `Dockerfile`):

```bash
docker compose up --build
```

## Project structure

```text
.
├── app/
│   ├── assets/css/main.css   # Tailwind entry
│   ├── layouts/default.vue   # Navbar and page shell
│   ├── pages/                # Home and Watchlist routes
│   ├── stores/counter.ts     # Pinia test store
│   └── app.vue
├── .github/workflows/        # GitHub Pages deploy workflow
├── public/                   # Static files
├── .env.example              # Environment variable template
├── docker-compose.yml
├── Dockerfile
├── nuxt.config.ts
└── package.json
```

## Roadmap

- [x] Nuxt project with Docker and Git setup
- [x] Tailwind CSS and Pinia
- [x] README
- [ ] TMDB server routes
- [ ] Movie list and search
- [ ] Movie details
- [ ] Watchlist
- [ ] Polish and deployment

## Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.

## License

Released under the MIT License.
