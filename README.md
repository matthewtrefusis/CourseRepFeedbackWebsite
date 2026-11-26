# Year 1 CS Course Reps

Website for Year 1 Computer Science students at the University of Reading to
find course information, follow feedback updates, vote in a workload poll, and
send feedback to their course reps.

## Features

- Course modules, rep contacts, support information, and feedback updates.
- Anonymous feedback submissions stored in Cloudflare D1 and deleted after 90
  days.
- A workload poll with public aggregate results.
- A private feedback dashboard at `/dashboard`, protected by Cloudflare Access.

## Run locally

Install dependencies and start the Vite development server:

```sh
npm install
npm run dev
```

Apply the D1 migrations locally before testing the feedback form or poll:

```sh
npx wrangler d1 migrations apply year-1-cs-course-reps-feedback --local
```

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm run lint` | Run ESLint. |
| `npm run build` | Build the site and Worker. |
| `npm run deploy` | Build and deploy with Wrangler. |

Before deploying schema changes, apply migrations to the remote database:

```sh
npx wrangler d1 migrations apply year-1-cs-course-reps-feedback --remote
npm run deploy
```

## Project structure

- `src/` contains the React site and its sections.
- `worker/` contains the Cloudflare Worker API.
- `migrations/` contains D1 schema migrations.
- `docs/quick-poll.md` explains poll behavior and setup.
- `docs/feedback-dashboard.md` explains Cloudflare Access setup for reps.

The dashboard requires the Worker secrets `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD`,
and `REP_EMAILS`. See [the dashboard setup guide](docs/feedback-dashboard.md)
before enabling access.