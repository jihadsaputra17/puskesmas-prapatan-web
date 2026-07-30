# Checkpoint — Brand logo + hero building photo (2026-07-30)

**Status:** APPROVED by user (“awesome!!” / “amazing!!!”).

| Item | Value |
|------|--------|
| Logo commit | `a9c3cec` — `feat(brand): use LOGO PKM as header/footer mark` |
| Hero photo commit | `599f3b0` — `feat(hero): put puskesmas building photo as first slide` |
| Prior alignment | `7b11e7a` — hero nav ↔ Akses cepat (see `checkpoint-hero-qa-align-2026-07-30.md`) |
| Branch | `main` |
| Live | https://puskesmas-prapatan-web.vercel.app/ |
| Date | 2026-07-30 |

## What is locked

### Logo
- Source: `LOGO PKM EDIT.png` (repo root, untracked original OK)
- Served: `public/images/logo-pkm.png`
- Used in: `SiteHeader` (`ClinicMark`), `SiteFooter`
- No navy monogram SVG box — image `object-contain` in `h-10 w-10`

### Hero slide #1
- Source: `poto puskesmas prapatan.jpg`
- Served: `public/images/hero-pkm.jpg`
- First entry in `HeroSlideshow` slides array (before hero-1…6)
- Title: “Puskesmas Prapatan” · CTA → `/profil`

### Still in force from earlier checkpoint
- Swiper nav inset = `.content-container` edges
- QuickAccess plain `content-container` + `panel panel-lift`

## Restore

```bash
# Brand + hero photo only
git checkout 599f3b0 -- \
  public/images/logo-pkm.png \
  public/images/hero-pkm.jpg \
  src/components/layout/SiteHeader.tsx \
  src/components/layout/SiteFooter.tsx \
  src/components/layout/HeroSlideshow.tsx

# Or full tree at this brand state
git reset --hard 599f3b0
```

If only alignment needed without brand: `7b11e7a` / `docs/checkpoint-hero-qa-align-2026-07-30.md`.

## Verify

1. Header + footer show official PKM logo
2. First slideshow frame = building photo
3. Nav arrows still line up with Akses cepat
