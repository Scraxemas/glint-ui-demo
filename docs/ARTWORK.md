# Artwork and typography

All artwork is bundled locally. The site makes no runtime requests to image services, CDNs or font providers.

## Cinematic hero

`assets/hero.webp` is an original image created with the built-in image-generation tool for this redesign. The generated PNG was encoded as WebP (1816 × 866, approximately 156 KB) without changing its composition. It is concept artwork, not an image from *Interstellar* or another film.

Final generation prompt:

> Use case: stylized-concept. Create one original cinematic environment image for the Glint entertainment website hero, landscape 1536x1024 or wider. A lone small explorer in a neutral spacesuit stands on a vast wind-carved dark rocky ridge in the right third of frame, looking toward an immense pale lavender ringed planet rising above distant snowy mountains and a mist-filled valley. Foreground slate charcoal rocks, subtle dusk pink light on horizon, magnificent atmospheric depth, distant stars, photorealistic cinematic concept art, tactile rock and haze, film still quality, elegant quiet adventurous mood. Keep left third dark and relatively uncluttered for white HTML title overlay. Wide establishing shot. Muted desaturated lavender, charcoal, blue-grey and dusty pale peach palette, no neon. Original world and costume, not a depiction of any specific film, fictional character or franchise. No text, logo, UI, typography, frame, watermark or collage. This will be a locally hosted editorial concept background, not movie poster art.

## Vector studies

`assets/art/` contains nine original code-authored SVG studies: cosmos, forest, desert, city, ocean, arcade, mountain, studio and Snake. They deliberately stand in for licensed catalog artwork and are reused as consistent visual families. No official movie/comic posters, game screenshots, copyrighted character illustrations or logos were imported.

The reader's **The Quiet Signal** is an original illustrated sample with 12 narrative panels/pages generated locally by `js/media.js`; no actual comic pages are bundled. The favicon is an original Glint glyph. Interface line icons are retained from the provided prototype.

## Typeface

Manrope by Mikhail Sharanda and Mirko Velimirovic is bundled as `assets/Manrope.ttf` under the SIL Open Font License 1.1. The complete license is in `assets/FONT-LICENSE.txt`.

Source: https://github.com/google/fonts/tree/main/ofl/manrope

System sans-serif fallbacks remain available while the local font loads. No remote font CSS is used.
