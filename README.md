# GD Movies

A movie browsing app built with Nuxt, powered by [TMDB](https://www.themoviedb.org/). It has no authentication and no database: movie data comes from TMDB through Nuxt server routes, and the watchlist lives in your browser.

![Nuxt](https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3-4FC08D?logo=vuedotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-4-FFD859?logo=pinia&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

> Screenshot: add an image at `docs/screenshot.png` and reference it here.

## Features

- Trending movies of the week as the default home view
- Debounced search, with the query and page kept in the URL (`/?q=matrix&page=2`)
- Genre filter chips (combine several genres, kept in the URL as `?genre=28,12`); picking a genre clears the search text, and searching drops the genres
- Pagination, plus skeleton, empty and error states
- Movie detail page (`/movies/<id>`), server-rendered, with SEO and social tags, poster and backdrop, rating, genres, runtime, cast and a trailer that plays in a modal on the page
- Cast detail page (`/people/<id>`) with photo, biography, birth details and a slider of the movies they are known for; every cast card links to it
- On the movie page, below the details: TMDB score with vote count, a swipeable cast slider, tabs for videos (play in the modal), backdrops and posters with a slider for each, user reviews ("Read more" appears when a review is cut off, plus "Load more"), a similar movies slider, and in-page links to each section
- "Where to watch" on the movie page: streaming, free-with-ads, rent and buy services with logos, for the visitor's country (detected on Cloudflare) with a country dropdown, credited to JustWatch
- A 404 page for unknown or invalid movie and person ids
- Local watchlist with "Want to watch" and "Watched" buttons on every card and on the detail page, saved to `localStorage`, with a filterable `/watchlist` page
- Responsive layout with a mobile navbar
- The TMDB key stays on the server: the browser only talks to `/api/movies/*`
- Short server-side caching of TMDB responses

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | [Nuxt](https://nuxt.com/) 4 with TypeScript |
| UI | [Vue](https://vuejs.org/) 3 (Composition API, `<script setup>`) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) 4 (Vite plugin) |
| State | [Pinia](https://pinia.vuejs.org/) (`@pinia/nuxt`) |
| Data | [TMDB API](https://developer.themoviedb.org/) via Nuxt server routes |
| Development | Docker and Docker Compose |
| Hosting | Cloudflare Workers |

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
| `NUXT_TMDB_API_KEY` | Your TMDB API key (the v3 "API Key" or the "API Read Access Token"). Server-side only, never sent to the browser. | **SECRET** |
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

After editing `.env`, recreate the container so it picks up the new values:

```bash
docker compose up -d --force-recreate
```

## API routes

All routes are `GET`, served by Nuxt server routes that call TMDB with the private key. Responses are normalized (camelCase fields, full image URLs).

| Route | Query | Returns | Cache |
| --- | --- | --- | --- |
| `/api/movies/trending` | `page` (1 to 500, default 1) | Paginated list of movies | 1 hour |
| `/api/movies/search` | `query` (required, max 100 characters), `page` (1 to 500, default 1) | Paginated list of movies | 5 minutes |
| `/api/movies/discover` | `genre` (optional, up to 5 comma-separated ids, all must match), `page` (1 to 500, default 1) | Paginated list, most popular first | 1 hour |
| `/api/movies/<id>/reviews` | `page` (1 to 500, default 1) | User reviews as plain text (long ones cut at 4000 characters) | 1 hour |
| `/api/movies/<id>/media` | none | Up to 12 videos (YouTube), 12 backdrops and 12 posters | 1 hour |
| `/api/movies/<id>/recommendations` | none | Up to 12 similar movies | 1 hour |
| `/api/movies/<id>/providers` | `region` (optional 2-letter country code; default is the visitor's country, else `US`) | Where to watch in that country, plus every country with data | 6 hours, per country |
| `/api/people/<id>` | none | Person details with their most popular movies | 1 hour |
| `/api/genres` | none | List of movie genres (`id`, `name`) | 24 hours |
| `/api/movies/<id>` | none | Movie details with top cast and trailer | 1 hour |

Errors:

| Status | Meaning |
| --- | --- |
| 400 | Invalid `query`, `page` or `id` |
| 404 | Movie or person not found |
| 429 | TMDB rate limit reached |
| 500 | `TMDB API key is not configured` |
| 502 | TMDB rejected the key, or the request failed |

Try them:

```bash
curl "http://localhost:3004/api/movies/trending"
curl "http://localhost:3004/api/movies/search?query=matrix&page=1"
curl "http://localhost:3004/api/movies/603"
```

## Manual test checklist

- [ ] Home shows "Trending this week" with movie cards
- [ ] Typing in the search box updates the URL (`?q=`) about half a second after you stop typing
- [ ] Reloading `/?q=matrix&page=2` shows the same results
- [ ] Clicking genre chips filters the list, updates `?genre=` and highlights the chips; clicking a highlighted chip removes it
- [ ] Typing a search clears the genre filter, and picking a genre clears the search box
- [ ] Browser back and forward restore the previous search and page
- [ ] Next and Previous change the page, and the page scrolls to the top
- [ ] A search with no results (for example `zzzzzz`) shows the empty message
- [ ] Clicking a card opens `/movies/<id>` with poster, rating, cast and a trailer button
- [ ] "Watch trailer" opens a modal that autoplays, and Esc, the close button or a click outside closes it and stops the sound
- [ ] `/movies/abc` and `/movies/999999999` show the 404 page
- [ ] "Where to watch" lists services with logos; changing the country dropdown updates the list; "JustWatch" is credited
- [ ] The movie page shows the vote count, and the in-page links jump to their sections
- [ ] The cast, similar movies and "Known for" lists scroll sideways: swipe on a phone, arrow buttons on wider screens
- [ ] The Videos, Backdrops and Posters tabs switch (arrow keys too), each with its own slider
- [ ] Videos open in the modal, backdrops and posters open full size in a new tab
- [ ] The Back button on the movie and cast pages returns to the previous page (home if you opened the page directly)
- [ ] A long review is cut off and shows "Read more"; a short one does not
- [ ] "Load more reviews" appends more; "You might also like" shows movie cards
- [ ] Clicking a cast card opens `/people/<id>` with photo, biography ("Read more" for long ones) and known-for movies; `/people/abc` shows the 404 page
- [ ] "Want to watch" and "Watched" toggle on cards and on the detail page
- [ ] Reloading keeps the watchlist, and `/watchlist` filters by status
- [ ] No console errors or hydration warnings
- [ ] The mobile menu opens and closes on a narrow window

## Troubleshooting

**Port 3004 is already in use.** Pick another host port in `.env` (for example `HOST_PORT=3005`), then run `docker compose up -d --force-recreate` and open that port. To see what is using the port on Windows, run `netstat -ano | findstr :3004`.

**Hot reload does not work.** Docker on Windows and macOS does not pass file-change events from your project folder into the container, so the compose file turns on polling (`CHOKIDAR_USEPOLLING`). Make sure the project folder is shared with Docker Desktop, save the file again, and if it still does not update, run `docker compose restart app`.

**"TMDB API key is not configured" (500).** `NUXT_TMDB_API_KEY` is empty or missing in the container. Check `.env`, then run `docker compose up -d --force-recreate`. On Cloudflare, add it as a **Secret** in the Worker's runtime Variables and Secrets (not the Build section).

**"TMDB rejected the configured API key" (502).** The key is wrong, still the placeholder `your_key_here`, or not active yet. Copy it again from [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) without quotes or spaces. If you still see old data after fixing it, clear the dev cache and restart:

```bash
docker compose exec app rm -rf .nuxt/cache/nitro/handlers
docker compose restart app
```

**Images do not load.** Posters, backdrops and cast photos come from `image.tmdb.org`. Check that your network, VPN or ad blocker is not blocking it, and open the movie's `posterUrl` from `/api/movies/<id>` directly in the browser. A movie without an image shows "No poster" or "No photo" on purpose.

**The trailer does not play.** Trailers use YouTube's embedded player, so your network, VPN or ad blocker must allow `youtube-nocookie.com`. Some videos disable embedding: use the "Open it on YouTube" link in the modal.

## Deployment (Cloudflare Workers)

The app needs a server runtime for its `/api/movies/*` routes, which keep the TMDB key off the browser, so it cannot be hosted on GitHub Pages (static files only). It deploys to Cloudflare Workers, using the `cloudflare_module` preset set in `nuxt.config.ts`.

1. In the Cloudflare dashboard, go to **Workers & Pages**, create an application, and import this repository.
2. Use these settings: build command `npm run build`, deploy command `npx wrangler deploy`, production branch `main`.
3. In the Worker's **Settings**, open the runtime **Variables and Secrets** (not the Build section) and add a **Secret** named `NUXT_TMDB_API_KEY`. Never put the key in the repository.
4. Push to `main` and Cloudflare builds and deploys automatically.

The Worker is named `sadrulhossain-gd-movie-app-vue` by the build. If your Worker has a different name, the secret must be on the Worker that is actually deployed.

## Project structure

```text
.
├── app/
│   ├── assets/
│   │   ├── css/main.css           # Tailwind entry
│   │   └── img/logo.svg           # Logo and favicon
│   ├── components/
│   │   ├── AppSlider.vue          # Horizontal slider with prev/next buttons
│   │   ├── BackLink.vue           # Back button (previous page, or home on a direct visit)
│   │   ├── GenreChips.vue         # Genre filter chips
│   │   ├── MovieCard.vue          # Poster card with watchlist buttons
│   │   ├── MovieCardSkeleton.vue  # Loading placeholder
│   │   ├── MovieMedia.vue         # Tabs for videos, backdrops and posters
│   │   ├── MovieReviews.vue       # User reviews with load more
│   │   ├── ReviewItem.vue         # One review with measured Read more
│   │   ├── SimilarMovies.vue      # Recommendations
│   │   ├── TrailerPlayer.vue      # Trailer button and modal player
│   │   ├── WhereToWatch.vue       # Streaming providers with country dropdown
│   │   └── WatchlistButtons.vue   # Want / Watched toggles
│   ├── composables/               # useDebouncedRef, useIsClamped
│   ├── layouts/default.vue        # Navbar, page shell, TMDB attribution footer
│   ├── pages/
│   │   ├── index.vue              # Trending, search and genre browsing
│   │   ├── movies/[id].vue        # Movie details
│   │   ├── people/[id].vue        # Cast and crew details
│   │   └── watchlist.vue          # Saved movies
│   ├── plugins/watchlist.client.ts  # Loads and saves the watchlist (browser only)
│   ├── stores/
│   │   ├── watchlist.ts           # Watchlist Pinia store
│   │   └── counter.ts             # Pinia demo store (not used by any page)
│   └── app.vue
├── server/
│   ├── api/                       # movies (trending, search, discover, [id]), people and genres routes
│   └── utils/                     # TMDB client and response normalization
├── shared/                        # Types and helpers used by server and client
├── public/                        # Static files
├── .env.example                   # Environment variable template
├── docker-compose.yml
├── Dockerfile
├── nuxt.config.ts
└── package.json
```

## Roadmap

- [x] Nuxt project with Docker and Git setup
- [x] Tailwind CSS and Pinia
- [x] README
- [x] TMDB server routes
- [x] Movie list and search
- [x] Movie details
- [x] Local watchlist
- [x] Cloudflare Workers deployment
- [x] Trailer player
- [x] Genre filter
- [x] Cast detail page
- [x] Where to watch
- [x] Reviews, media and similar movies
- [ ] Add the official TMDB logo to the footer attribution
- [ ] Add a screenshot
- [ ] Automated tests
- [ ] Sync the watchlist across browser tabs

## Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.

## License

Released under the [MIT License](LICENSE).
