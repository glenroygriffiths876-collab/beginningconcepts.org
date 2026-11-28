# Universal Gia — central Cloudflare deployment

## Verified local safety checks
Gateway tests can be run with `npm test` in this directory. A local reconstructed implementation passed 14 tests on 2026-11-27; **GitHub Actions and Cloudflare production deployment have not been verified**. The deploy script (`npm run deploy`) runs tests before invoking Wrangler.

## Single GitHub-connected Worker
- Repository: `glenroygriffiths876-collab/beginningconcepts.org`
- Branch: `main`
- Worker source directory: `universal-ai/gateway`
- Build command: `npm install`
- Deploy command: `npm run deploy`
- Worker name in `wrangler.toml`: `universal-gia`
- AI binding: `AI`
- Durable Object binding: `QUOTA`
- SQLite migration: `v1`

**Do not enable builds yet.** The existing `universal-gia` Cloudflare Worker is a separately edited pilot. Deploying this source to the same name will replace its code. The source currently sets `ENABLE_INFERENCE=false`, intentionally returning a fallback instead of invoking AI. Do not flip that flag until Cloudflare binding, quota, costs, and public access controls are reviewed. The existing business site's separate `gia-ai` Worker must not be changed during this rollout.

## Adding an application
1. Register a unique application ID, assistant display name, approved public origin, and narrowly scoped public knowledge in `worker.mjs`.
2. Add tests that prove its origin is accepted and other applications' origins are rejected.
3. In the application's frontend, import `client.mjs`, create an assistant with `endpoint: 'https://universal-gia.glenroygriffiths876.workers.dev'` and the registered `application` ID, and supply the existing local fallback handler.
4. Test from the actual deployed origin, then turn on cloud inference only after approval.

A browser Origin header is **not authentication**: non-browser callers can forge it. No internal documents, private knowledge, customer data, privileged actions, or secrets may be exposed through this public endpoint. No secret should ever be embedded in frontend JavaScript.

## Rollout blocker
There is no Cloudflare management connection available to this chat. Only the account holder can confirm or change the Cloudflare Builds root directory, deployment settings, and enable the build connection. The current gateway is a **staging implementation**, not a finished production universal bot. 
