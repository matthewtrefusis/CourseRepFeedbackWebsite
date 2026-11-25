# Quick poll

The public poll asks how students are finding their workload this term. It
stores each answer and a SHA-256 hash of a random browser token in D1; it does
not store names, email addresses, or the raw token. The token helps prevent
repeat votes from the same browser profile, but is not a way to verify a
student's identity.

The current question, poll ID, and allowed answers are defined by
`POLL_ID`, `POLL_QUESTION`, and `POLL_OPTIONS` in `worker/index.js`. Update
these together with the browser storage keys in `src/sections/QuickPoll.jsx`
when creating a new poll.

## Database setup

Apply migrations to the local D1 database before local testing:

```powershell
npx wrangler d1 migrations apply year-1-cs-course-reps-feedback --local
```

Before deploying the poll, apply the migration to the remote D1 database, then
deploy the Worker and site:

```powershell
npx wrangler d1 migrations apply year-1-cs-course-reps-feedback --remote
npm run deploy
```

`GET /api/poll` returns the public question and aggregate counts. `POST
/api/poll/vote` records a vote. Keep these endpoints public; Cloudflare Access
should protect the reps dashboard paths only.
