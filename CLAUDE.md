# CLAUDE.md

Movie app built with Vue.

## Project

- Standalone Nuxt app (`movie-app-vue`): no authentication, no database. Host port: 3004.
- Stack (fixed, do not substitute): Nuxt (current stable) + TypeScript, Vue Composition API with `<script setup>`, Pinia (`@pinia/nuxt`), Tailwind CSS v4 (official Vite plugin), Docker + Compose for development.
- External data only through Nuxt server routes.
- Not allowed: Firebase, Supabase, Vuex, Axios, or any extra library without asking first.
- Do not install anything until the segment where Docker setup is finished.

## Rules

1. Verify configuration and APIs against current official docs. If unsure, say so.
2. The TMDB key stays server-side (private `runtimeConfig`), never in client code.
3. Code must be SSR-safe: no `window`/`localStorage` at setup time; use `onMounted` or `<ClientOnly>`.
4. Make the smallest correct change; prefer the most optimized, idiomatic approach.
5. Never output real secrets; use placeholders in `.env.example`. Remind the user to commit after each segment with a Conventional Commit message.

## Teaching format

The user is learning while building. Every step has: (a) concept in 4 lines or fewer, (b) code with file paths, (c) how to verify it works, (d) one question to check understanding. Then stop and wait.

## Development workflow

- The app is developed in 10 segments, numbered 0–9.
- Segment 0 is the initial project directory setup. It lives in the initial `main` commit(s). Only segment 0 goes directly into `main`.
- Segment 0 is done.
- When a segment is finished, the user will provide instructions for the next one. Do not start a segment without those instructions.
- Before starting a new segment, create a branch from an updated `main` (pull/update first), named `feature/<feature-name-in-kebab-case>`, e.g. `feature/movie-list`.
- Do all work for segments 1–8 on their feature branch, not on `main`.

## Commits and code changes

- No Claude signature or attribution anywhere: no `Co-Authored-By` trailers, no "Generated with Claude Code" lines, and no mentions of Claude/AI in commit messages, PR descriptions, code, or comments.
- Only commit or push when the user asks.
