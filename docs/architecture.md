# MicDrop Frontend — Architecture

## 1. Stack

React 19, TypeScript, Vite, React Router v6, TanStack Query v5, axios,
Tailwind CSS v4, Radix UI primitives, Sonner toasts.

## 2. Structure

```text
src/
  api/            axios client, envelope unwrap, ApiError, per-resource endpoints
  app/            Providers (QueryClient + auth invalidator + Toaster)
  components/     presentational UI (layout, prompt, response, vote, profile, ...)
  features/       stateful logic per domain (auth, prompts, responses, votes, profile)
    */keys.ts        centralized query-key factories
    */queries.ts     useQuery hooks
    */mutations.ts   useMutation hooks (or useVote.ts for votes)
    */cache.ts       optimistic cache helpers
  pages/          route-level screens
  types/domain.ts domain models mirroring the API
```

Rules:

- Components render; features fetch and mutate. Pages compose both.
- Query keys are the contract between queries, mutations, and cache
  helpers — new key families must be registered in the vote sweep (see §5).

## 3. API Layer

`api/client.ts` attaches the session token and converts failures to
`ApiError` (with `status`). A 401 (except `/auth/me` mid-callback) dispatches
`auth:unauthorized`, which clears the session. `api/envelope.ts` unwraps the
backend `{ "data": ... }` envelope. Helpers in `api/errors.ts`
(`isNotFound`, `isConflict`, …) classify errors for UI branches.

## 4. Auth

`features/auth/auth.ts` is a tiny external store (`token` + `user` in
`localStorage`, cross-tab sync via `storage` events). `useAuth()` exposes
`{ user, isAuthenticated, login, logout }`; `login` redirects to
`GET /auth/google/login`.

OAuth landing (`/auth/callback`):

- `?token=` → parked, `GET /auth/me` resolves the user, session stored.
- `?onboarding=` → parked in `sessionStorage`, routed to username picker,
  `POST /auth/complete-signup` returns `{ token, user }`.

`app/providers.tsx` holds the `QueryClient` and an `AuthInvalidator`: cached
data is identity-dependent (`viewer_vote`, karma), so **every** query is
invalidated whenever the session token changes.

## 5. Voting

Backend contract: `PUT /prompts/{id}/vote` and `PUT /responses/{id}/vote`
with `{"vote": "upvote"|"downvote"|"none"}` — the desired end state.
Responses include `viewer_vote: "upvote" | "downvote" | null`, always from
the server. Never persist vote state outside React Query (the old
`localStorage` cache couldn't represent auto-upvotes or other devices).

`features/votes/useVote.ts`:

- `nextVote(current, clicked)` — pure toggle: same direction → `"none"`,
  otherwise the clicked direction. Unit-testable in isolation.
- `useVote({ kind, id, current })` — one mutation for prompts and responses:
  - `onMutate`: cancel in-flight queries, snapshot affected caches, apply the
    optimistic `counter + delta` and `viewer_vote` patch.
  - `onError`: restore the snapshot (rollback by restore, not inverse math).
  - `onSuccess`: overwrite with the server item (source of truth).
  - `onSettled`: invalidate detail/list keys plus `userKeys.all` (profile
    lists show the same items; the header shows karma).

`features/votes/cache.ts` (`patchPromptInCache`, `patchResponseInCache`,
plus the `patchUser*InCache` sweeps) must cover **every** key family that can
render the item:

| Surface | Keys |
|---|---|
| Feed / detail | `promptKeys`, `responseKeys` |
| Profile tabs | `userKeys` prompts/responses lists |

If you add a new surface rendering prompts/responses (search, bookmarks,
…), register its keys in `cache.ts` and the `useVote` snapshot/settle —
otherwise votes there will look dead until a refetch, and the stale
`viewer_vote` will corrupt the next toggle.

`components/vote/VoteControl.tsx` is dumb by design: `score` + `viewerVote`
in, `useVote` out. No self-vote special-casing — authors vote like anyone
else; karma exclusion is a backend rule.

## 6. Feed & Mutations

- `usePrompts({ sort, limit, offset })` with `keepPreviousData`; per-sort
  limits preserved across tab switches.
- `useCreatePrompt` does an optimistic prepend (placeholder
  `prompt_upvotes: 1`, `viewer_vote: "upvote"` — matching the server's
  auto-upvote) and swaps in the real row on success.
- `useCreateResponse` bumps the parent's `response_count` optimistically via
  the shared prompt-cache helper.

## 7. Testing & Lint

- `npm run build` (`tsc -b` + `vite build`), `npm run lint`. No test runner
  is configured yet — `nextVote` is the natural first unit test if one is added.
