# Handoff — Nav & QuickAccess Polish (2026-07-29)

> **SUPERSEDED for restore.** Approved alignment checkpoint is:
> **`docs/checkpoint-hero-qa-align-2026-07-30.md`** @ commit **`7b11e7a`**
> Live: https://puskesmas-prapatan-web.vercel.app/
>
> Do **not** restore the mask/`max-w-full` notes below — they predate the fix.

## Changes Made

### 1. Removed "Catatan:" disclaimer blocks
- `/layanan/page.tsx` — removed note box
- `/profil/page.tsx` — removed note box

### 2. QuickAccess cards — alignment fixes
Multiple iterations to get cards perfectly linear:
- `items-start` — content aligns at top in every card
- `truncate` — description forced to single line, no wrapping differences
- `w-full` — on `<li>`, `<a>`, and text `<span>` for full width
- `min-w-0` — on `<li>` and `<a>` to prevent flex overflow
- `flex-1` on text span instead of `w-full`
- `grid-cols-1` explicit on mobile
- `box-border` on `<ul>`
- `content-container w-full max-w-full overflow-hidden`
- Card class changed from `border border-slate-200 bg-clinic-wash/60...` → `panel panel-lift` to match Pelayanan section cards

**Final classes:**
- `<ul class="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 box-border">`
- `<li class="flex w-full min-w-0">`
- `<a class="group panel panel-lift flex h-full w-full min-w-0 items-start gap-3 p-4">`
- `<span class="min-w-0 flex-1">`
- `<span class="mt-1 block truncate text-sm leading-6 text-slate-600" title={item.text}>`

### 3. Hero slideshow nav buttons
Final approach: default Swiper navigation with pure CSS.

CSS in `globals.css`:
- 48px white circle (`bg-white/70`), `backdrop-filter: blur(12px)`, `shadow-md`
- Thin navy chevron via CSS mask (Lucide-style, stroke-width 2)
- Hover: bg solid white, scale(1.1), arrow turns teal
- `::after` hidden, replaced by mask: `mask-image` with inline SVG data URI

### 4. QuickAccess card styling aligned to Pelayanan
Both sections now use `panel panel-lift` for consistent card language:
- White bg + `shadow-soft` (instead of tinted wash)
- Same hover lift + border-teal + shadow
- Same border style and rounded radius

## Deploy
- All on `main`, direct pushes
- Production URL: `https://puskesmas-prapatan-web.vercel.app`
- Wait ~2 min for deploy, hard refresh + incognito to bust CDN cache
- Last commit: `9ca2e2e`

## Known issues / next steps
- Hero nav CSS mask approach may need browser testing
- User may want more content pages updated next
