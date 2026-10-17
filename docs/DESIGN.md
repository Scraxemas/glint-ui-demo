# Glint: after-hours cinema

## Foundation

- Canvas `#0b0c10`, surfaces `#15161d` and `#1c1e27`.
- Warm white `#f4f2ef`, secondary text `#a4a4b0`, lavender `#b8aff0`.
- Manrope, locally hosted under the SIL Open Font License. Display weight 500–650; readable interface weights 450–700. System fallback.
- 4/8px spacing rhythm; 24–64px section spacing; 8px controls, 12px artwork, larger editorial hero corners.
- White/lavender primary controls, restrained borders, no neon outlines. Visible keyboard focus; minimum 44px touch controls.

## Composition

The memorable element is the cinematic illustrated environment. The shell stays quiet: a slim desktop navigation rail, a useful search field, and clearly named destinations. The home page moves from an expansive featured story to horizontal resume cards, a compact live row, portrait film covers, then reading, play, studio work, and multiplayer worlds.

```
Navigation | Search                         Profile
           | Cinematic feature                    |
           | Continue watching: landscape cards   |
           | Live: compact six-channel strip      |
           | Tonight: portrait poster shelf       |
           | Reading     /     Featured arcade    |
           | Studio work /     Multiplayer worlds |
           | Quiet supporter invitation           |
```

All content is left aligned, except intentional immersive player/reader compositions. On mobile, the rail becomes a modal navigation drawer and six bottom shortcuts; shelves scroll within themselves. The film catalog remains a two-column portrait grid at 375px. Dense utility tables are confined to administration, settings, and the program guide.

## Brief review

The old prototype repeated the same orbit gradient and rounded panel everywhere. This direction removes metric counters from the homepage, replaces destination tiles with actual content, varies portrait, landscape, editorial and compact layouts, and uses artwork as the source of visual richness. Violet remains a supporting accent rather than the subject of every card. Original local concept artwork is explicitly separate from canonical film/comic art and actual project screenshots.

## Implementation checklist

- [x] Inspect source, README, architecture brief, live site.
- [x] Establish shared tokens and static module boundaries.
- [x] Build content-first homepage and responsive navigation.
- [x] Modernize all nine other sections and modal experiences.
- [x] Verify keyboard, touch, reduced motion and saved demo state.
- [x] Exercise all routes at 375, 430, 768, 1024, 1440 and 1920px.
- Publishing uses the existing main/root Pages configuration; live deployment verification follows the push.
