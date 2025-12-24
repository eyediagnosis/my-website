# Changelog

## 2025-12-24 — UX & Accessibility Improvements

- Added fixed top navigation (`EyeAI`) and keyboard-accessible skip link for faster navigation.
- Improved header and abstract contrast for readability.
- Added a hero guidance card above the upload area explaining why and how to take photos.
- Added AI Disclaimer section before the footer to improve trust and set expectations.
- Made upload drop area keyboard-focusable and added `role="button"` and keyboard activation (Enter/Space).
- Added small upload microinteraction (flash) and set preview images to `loading="lazy"` with `alt` text.
- Added focus outlines for interactive elements to improve accessibility.
- Added `theme-color` meta tag to pages for better mobile UX polish.
- Propagated navigation and accessibility roles to all disease pages, `app.html`, and `random.html`.
- Updated per-disease page `<title>` and `<meta name="description">` for better SEO.

Files changed: `index.html`, `style.css`, `script.js`, `app.html`, `random.html`, `disease.html`, `disease1.html`–`disease8.html`.

---

If you'd like, I can now:
- Commit these changes to Git (if you want, provide commit message or I can create one).
- Run a Lighthouse accessibility/SEO audit (requires Chrome/Node; I can run it from terminal if available).
- Apply the same header and metadata to any additional pages you add.
