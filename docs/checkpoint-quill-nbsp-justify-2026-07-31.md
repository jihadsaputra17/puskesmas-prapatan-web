# Checkpoint: Quill + Image Upload + nbsp Justify

**Commit:** `e4b6168`
**Date:** 2026-07-31
**Branch:** `main`
**Deploy:** https://puskesmas-prapatan-web.vercel.app/

---

## Done

### Rich-text editor (Quill) — admin berita
- `RichTextEditor.tsx` — dynamic import of `react-quill-new`, toolbar (h2–h4, bold/italic, lists, link, image, blockquote)
- Image in toolbar → browser picker → `image-compress.ts` → data URL inserted inline
- Content saved via hidden textarea + form submit
- `BeritaFormFields.tsx` uses `RichTextEditor` + `CoverImageField`

### Cover image upload
- `CoverImageField.tsx` — drag/drop or file picker → WebP/JPEG compress → data URL preview
- Falls back to plain URL input
- `ImageUploader.tsx` — shared existing component
- POST/PUT routes accept `images` form field as fallback for `image_url`

### SmartImage
- `SmartImage.tsx` — renders `data:` URIs as `<img>`, remote URLs via Next `<Image>`
- Used in berita listing (`page.tsx`), detail (`[slug]/page.tsx`), and `BeritaSection.tsx`

### nbsp → space normalization (root cause fix)
- `sanitize-html.ts` — `normalizeArticleWhitespace()` strips `&nbsp;`, `&#160;`, `&#x0a0;`, `\u00A0` before sanitization + after
- `admin-schemas.ts` — same normalization on save for both `content` and `excerpt`
- Article `[slug]/page.tsx` lead paragraph inline-normalized
- Sanitizer strips Quill `ql-align-*` classes + inline `style`/`align` — CSS justify only

### Justify CSS tightened
- `overflow-wrap: break-word`, `hyphens: auto`, `word-break: normal` on all article paragraphs
- `article-lead` class for excerpt paragraph

### Tests
- 66 tests pass across 20 test files
- Schema: accepts `data:image/*` cover, rejects `<p><br></p>` empty
- Sanitize: allows data images, strips non-image data URLs, strips ql-align classes
- Content mutations: updated to looser field matcher

## Files

**New:**
- `src/lib/image-compress.ts` — browser-side WebP compression
- `src/components/ui/SmartImage.tsx` — hybrid data:/ remote Image renderer
- `src/components/admin/CoverImageField.tsx` — drag/drop cover upload
- `src/components/admin/RichTextEditor.tsx` — Quill wrapper
- `src/components/admin/ImageUploader.tsx` — shared upload component

**Modified:**
- `src/lib/admin-schemas.ts` — nbsp normalization in content + excerpt
- `src/lib/sanitize-html.ts` — `normalizeArticleWhitespace()` + `stripAlignJunk()`
- `src/lib/admin-schemas.test.ts` — data image & empty content tests
- `src/lib/sanitize-html.test.ts` — nbsp & ql-align tests
- `src/app/globals.css` — justify + overflow-wrap + article-lead
- `src/app/api/berita/route.ts` — `FormData` `images` field fallback
- `src/app/api/berita/[id]/route.ts` — same
- `src/app/api/content-mutations.test.ts` — looser error matcher
- `src/app/berita/page.tsx` — SmartImage
- `src/app/berita/[slug]/page.tsx` — SmartImage, lead normalize
- `src/components/admin/BeritaFormFields.tsx` — Quill + CoverImageField
- `src/components/layout/BeritaSection.tsx` — SmartImage

## Next Tracks (optional)
- Author fields (name, role) in DB + admin form
- Multi-category/tags
- Cover image to Vercel Blob instead of data URL
- Article image gallery (table of contents, related inline)
