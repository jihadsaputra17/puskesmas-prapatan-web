# Session Handoff — 2026-08-10

**Head commit:** `c61a245` (unchanged — audit only, no code changes)
**Branch:** `main` (origin/main in sync)
**Live:** https://pkmprapatanbpn.web.id ✅
**Fallback:** https://puskesmas-prapatan-web.vercel.app

---

## Last Update

Security audit: env files NOT exposed to public. Verified across local git, GitHub, Vercel. No code changes made. Full audit trail below.

## Env file security audit — DONE ✅

### Local
- `.gitignore` line 47: `.env*` — covers `.env.local`, `.env.vercel`, any env file
- `git check-ignore -v .env.local .env.vercel` → both matched, properly ignored
- Env files absent from `git status` untracked list
- Only env-related commit in history: `e80a7a4` = added 3 ignore lines to `.gitignore` only. `.env*` files NEVER committed in any ref (`git log --diff-filter=D` empty, `--name-only` scan empty)

### GitHub — `jihadsaputra17/puskesmas-prapatan-web` (⚠️ PUBLIC repo)
- All 4 branches (`main`, `feat/admin-ui-design-a-polish`, `feat/dokter-profiles`, `feat/public-patient-experience`) tree-scanned via GitHub API → **no `.env*`, no `.vercel` files**
- Commits API for `.env.local` / `.env.vercel` → empty
- Note: `git remote -v` showed nothing once (odd) but `.git/config` has `url = https://github.com/jihadsaputra17/puskesmas-prapatan-web.git`

### Vercel
- Live at `puskesmas-prapatan-web.vercel.app` + custom domain
- `/.env.local`, `/.env.vercel`, `/.env` all → **404** (root-level files not servable; Next.js serves `public/` only)
- Vercel dashboard env vars live in encrypted storage (not in git) — standard practice, no access needed

### Findings worth remembering
- `.env*` glob also blocks `.env.example` — intentional (commit comment says "can opt-in for committing if needed")
- `VERCEL_OIDC_TOKEN` present in local `.env.local` (build-time OIDC) — safe on disk, must never be committed
- `NEXT_PUBLIC_SITE_URL` is inlined to client bundle by design — not a leak
- `VERCEL_GIT_REPO_OWNER/SLUG/URL` in local `.env.vercel` are empty strings (deploy-time injected)

### ⚠️ Open flag
Repo is **PUBLIC**. Source visible to anyone (includes CMS + admin UI). Env vars safe regardless, but if repo should be private: GitHub → Settings → Danger Zone → Change visibility.

## Repo state at session end

- `main` HEAD = `c61a245`, origin/main in sync, production live
- Untracked root images still uncommitted: `LOGO PKM EDIT.png`, `poto puskesmas prapatan.jpg`, 6× `WhatsApp Image 2026-06-29...jpeg`
- Worktree `.worktrees/dokter-profiles` dirty/stale (wrong description copy + old photo sizing) — parked, do not merge as-is
- Parked branches: `feat/admin-ui-design-a-polish`, `feat/public-patient-experience`

## Backlog (from prior handoffs)

1. Re-upload 4 doctor photos via Kelola Dokter for uniform 4:5 crop
2. Commit or delete untracked root images
3. (Optional) Make GitHub repo private — see ⚠️ above
4. Author fields (name, role) for berita
5. Jadwal override (cuti/dinas) — DB migration needed
6. Vercel Blob for images instead of data URLs
7. Admin panel for viewing complaints in DB
8. Optional: map in footer "Hubungi kami"
