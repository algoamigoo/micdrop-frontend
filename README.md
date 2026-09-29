# MicDrop — Frontend

React + TypeScript + Vite SPA for MicDrop. Feed, prompt detail, user profiles,
Google OAuth sign-in, and server-driven voting.

- Data: TanStack Query (`staleTime` 30s) over an axios client (`VITE_API_URL`)
- Auth: token + user in `localStorage`, Google OAuth via backend redirects
- Voting: one `useVote` hook, optimistic counter + `viewer_vote` patch with
  snapshot rollback; all queries refetch on session change

Architecture notes: [`docs/architecture.md`](docs/architecture.md).
Backend API contract: `../micdrop/docs/ApiContract.md`.

## Quickstart

Prerequisites: Node 20+, backend running on `http://localhost:3000` (or set `VITE_API_URL`).

```bash
npm install
npm run dev      # http://localhost:5173
```

Scripts: `dev`, `build` (`tsc -b && vite build`), `lint`, `preview`.

## Routes

| Route | Page |
|---|---|
| `/` | Feed (`?sort=newest\|top`), inline prompt composer |
| `/p/:postId` | Prompt detail + response composer + responses |
| `/u/:username` | Profile (header/karma, prompts/responses tabs, editor) |
| `/login`, `/signup` | OAuth entry points |
| `/onboarding/username` | Username picker (new Google identities) |
| `/auth/callback` | OAuth landing (`?token=` or `?onboarding=`) |

## Conventions

- Domain types live in `src/types/domain.ts` and mirror the API envelope
  (`viewer_vote: "upvote" | "downvote" | null`).
- Query keys are centralized per feature (`features/*/keys.ts`); vote cache
  helpers in `features/votes/cache.ts` must sweep **all** key families that
  render an item (feed, detail, profile) — see `docs/architecture.md`.
- Auth state is a tiny external store (`features/auth/auth.ts`); `useAuth`
  subscribes to it. Never cache `viewer_vote` outside React Query.
