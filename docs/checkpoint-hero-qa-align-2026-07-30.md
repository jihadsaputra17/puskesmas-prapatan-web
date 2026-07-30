# Checkpoint — Hero nav ↔ Akses cepat aligned (2026-07-30)

**Status:** APPROVED by user — restore target if later work breaks alignment.

| Item | Value |
|------|--------|
| Commit | `7b11e7a` — `fix(hero): align swiper nav with content-container edges` |
| Branch | `main` (= `origin/main`) |
| Live | https://puskesmas-prapatan-web.vercel.app/ |
| Date | 2026-07-30 |
| Parent | `9ca2e2e` (QuickAccess `panel panel-lift`) |

## Why this checkpoint

Hero swiper next/prev arrows line up with Akses cepat card outer edges.
User confirmed: **"amazing! that i want."**

## Restore (git)

```bash
# Full tree back to this good state
git checkout main
git reset --hard 7b11e7a

# Or restore only the two key files without full reset
git checkout 7b11e7a -- src/app/globals.css src/components/layout/QuickAccess.tsx
```

After restore: push if needed (`git push origin main` — force only if history rewritten and agreed).

## Files locked at this checkpoint

### 1. `src/app/globals.css` — hero nav block

Key rules (do **not** go back to viewport-edge `4px` or CSS-mask `::after`):

```css
/* Hero slideshow nav — align to content-container (max-w-7xl + pad)
   so arrows line up with Akses cepat card edges below. */
.hero-slideshow {
  --nav-inset: 1rem; /* px-4 */
  --content-max: 80rem; /* max-w-7xl */
}
@media (min-width: 640px) {
  .hero-slideshow { --nav-inset: 1.5rem; /* sm:px-6 */ }
}
@media (min-width: 1024px) {
  .hero-slideshow { --nav-inset: 2rem; /* lg:px-8 */ }
}

.hero-slideshow .swiper-button-next,
.hero-slideshow .swiper-button-prev {
  top: 50%;
  width: 48px;
  height: 48px;
  margin-top: -24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  color: #081b2b;
  transition: background 0.3s, transform 0.3s, color 0.2s;
  z-index: 10;
}

/* Same horizontal edges as .content-container */
.hero-slideshow .swiper-button-prev {
  left: max(var(--nav-inset), calc((100% - var(--content-max)) / 2 + var(--nav-inset)));
  right: auto;
}
.hero-slideshow .swiper-button-next {
  right: max(var(--nav-inset), calc((100% - var(--content-max)) / 2 + var(--nav-inset)));
  left: auto;
}

.hero-slideshow .swiper-button-next:hover,
.hero-slideshow .swiper-button-prev:hover {
  background: rgba(255, 255, 255, 1);
  color: #0d9488;
  transform: scale(1.1);
}

/* Swiper 14 ships SVG icons — size them, drop font ::after */
.hero-slideshow .swiper-button-next svg,
.hero-slideshow .swiper-button-prev svg,
.hero-slideshow .swiper-navigation-icon {
  width: 18px !important;
  height: 18px !important;
  fill: currentColor;
}
.hero-slideshow .swiper-button-next::after,
.hero-slideshow .swiper-button-prev::after {
  content: none !important;
  display: none !important;
}
```

### 2. `src/components/layout/QuickAccess.tsx`

- Wrapper: **`content-container` only** — no `max-w-full`, no `overflow-hidden`
  (those overrode `max-w-7xl` and broke shared column with hero).
- Cards: `panel panel-lift`
- Grid:

```tsx
<ul className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 box-border">
  <li className="flex w-full min-w-0">
    <Link className="group panel panel-lift flex h-full w-full min-w-0 items-start gap-3 p-4">
      ...
      <span className="min-w-0 flex-1">
        <span className="mt-1 block truncate text-sm leading-6 text-slate-600" title={item.text}>
```

### 3. `src/components/layout/HeroSlideshow.tsx`

- Default Swiper `navigation` (no custom React refs / extra DOM buttons)
- Class: `hero-slideshow`
- Slide content still uses `content-container` for title/CTA

## Alignment contract (do not break)

| Layer | Horizontal system |
|-------|-------------------|
| Hero slide text | `.content-container` → `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8` |
| Swiper prev/next | same inset via `--nav-inset` + `--content-max: 80rem` |
| Akses cepat section | plain `.content-container` |

Viewport edge (`left/right: 4px` default Swiper) = **misaligned**. Never restore that.

## Related history (do not re-apply blindly)

| Commit | Note |
|--------|------|
| `0a62c8f` … `da2c6b5` | Earlier custom nav experiments |
| `daf80b2` | Revert to default Swiper + CSS (mask era) |
| `9ca2e2e` | QuickAccess → `panel panel-lift` |
| **`7b11e7a`** | **This checkpoint** — content-edge nav + SVG icons |

Older handoff `docs/handoff-nav-qa-polish-2026-07-29.md` describes pre-checkpoint mask/`max-w-full` approach — **superseded** by this file for restore.

## Verify after restore / deploy

1. Open https://puskesmas-prapatan-web.vercel.app/ (incognito / hard refresh)
2. Prev arrow left edge ≈ first Akses cepat card left edge
3. Next arrow right edge ≈ last Akses cepat card right edge
4. Cards not full-bleed; stay in max-w-7xl column
5. Hover: circle white solid, arrow teal, slight scale

## Next work after this checkpoint

Safe to continue other pages. If hero/QA alignment regresses → return here (`7b11e7a` / this doc).
