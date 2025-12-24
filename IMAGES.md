# Image optimization & conversion (WebP / AVIF)

This project uses lightweight SVG placeholders and supports WebP/AVIF hero images.

Recommended sizes:
- Hero image: 1200×400 (desktop) and a mobile variant ~800×400
- Preview images: keep max dimension ≤ 1200px; also store a 800px variant for mobile

Convert with these example commands:

Using ImageMagick (if installed):

```bash
# Create WebP
magick input.jpg -strip -quality 75 -resize 1200x1200\> assets/hero.webp

# Create AVIF (libavif + magick)
magick input.jpg -quality 60 -resize 1200x1200\> assets/hero.avif
```

Using cwebp (Google) and avifenc (libavif):

```bash
# WebP (cwebp)
cwebp -q 75 input.jpg -o assets/hero.webp

# AVIF (libavif)
avifenc --min 20 --max 40 input.jpg assets/hero.avif
```

Recommendations:
- Test both WebP and AVIF; AVIF often gives smaller files but may take longer to encode.
- Use a quality tradeoff (60-80) to balance size and fidelity.
- Always provide an accessible `alt` attribute for `img` fallbacks.
- Lazy-load large images using `loading="lazy"` and consider responsive `srcset` for multiple sizes.

If you want, I can generate example compressed images from a source you provide, or add responsive `srcset` variants and JS to progressively load higher-resolution images on large screens.