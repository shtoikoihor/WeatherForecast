# Frosted Sky — redesign spec (concept A)

Soft glass cards over a sky gradient. Light + Dark themes, desktop + mobile.
Keeps every block of the current screen: location, search, current temp + range, hourly, weekly, humidity, wind.

## 1. Fixes over the current UI
| Problem today | Fix |
|---|---|
| No max-width (stretches to 1900px+) | Container 1120px, 2-column grid on desktop |
| Hero centred, hourly left-aligned | One alignment axis; hourly lives inside a card with its own width |
| Weekly row spans the full screen | Row inside a card; min/max joined by a range bar |
| `1° 1°`, `0° 3°` hard to read | Range bar + `min` muted / `max` bold |
| Metric cards 930px wide, content in a corner | Fixed-height tiles, big value with unit (`4.1 m/s`) |
| No "now" in hourly | First item labelled `Now`, accent border |
| Midnight not marked | Divider with day label (`Thu`) before `00:00` |
| Tiny icons in week list | 28–32px |
| First day is `Wednesday` | `Today` |

## 2. Tokens (CSS custom properties)
Set on `:root` (light) and `[data-theme="dark"]` on `<html>`. Default = `prefers-color-scheme`, user choice saved in `localStorage` (`theme`). An inline script in `index.html` sets `data-theme` before first paint.

| Token | Light | Dark |
|---|---|---|
| `--bg-from` / `--bg-to` | `#DCEBFF` / `#F4F8FF` | `#0B1220` / `#16233F` |
| `--card` | `rgba(255,255,255,.62)` | `rgba(255,255,255,.07)` |
| `--card-solid` (no-blur fallback) | `#F1F6FF` | `#141E33` |
| `--card-border` | `rgba(255,255,255,.70)` | `rgba(255,255,255,.12)` |
| `--shadow` | `0 8px 32px rgba(40,70,130,.12)` | `0 8px 32px rgba(0,0,0,.45)` |
| `--text` | `#0F1B33` | `#EAF0FF` |
| `--text-2` | `#4A5B78` | `#9FB0CF` |
| `--accent` (icons, borders) | `#3B82F6` | `#7AB0FF` |
| `--accent-text` (small text/links) | `#1D4ED8` | `#9CC4FF` |
| `--accent-soft` (hover/selected bg) | `rgba(59,130,246,.14)` | `rgba(122,176,255,.18)` |
| `--tile` (hourly item, metric tile) | `rgba(255,255,255,.45)` | `rgba(255,255,255,.05)` |
| `--divider` | `rgba(15,27,51,.08)` | `rgba(255,255,255,.08)` |
| `--skeleton` | `rgba(15,27,51,.08)` | `rgba(255,255,255,.08)` |
| `--sun` | `#F59E0B` | `#FBBF24` |
| `--error` | `#DC2626` | `#F87171` |

Contrast notes: `--text-2` on light cards ≈ 6:1; `#3B82F6` on light is only ~3.3:1, so it is for icons/borders, never small text (use `--accent-text`). Re-check on the real gradient in QA.

Glass: `backdrop-filter: blur(20px) saturate(140%)`; wrap in `@supports not (backdrop-filter: blur(1px))` → `background: var(--card-solid)`.
Background: `linear-gradient(180deg, var(--bg-from), var(--bg-to))`, `background-attachment: fixed`; transition `background .3s`.

Shape & spacing (4px grid): card radius 24, tile radius 16, pill 999. Card padding 24 desktop / 16 mobile. Gap 24 desktop / 12 mobile.
Type (Manrope, `font-variant-numeric: tabular-nums` on all numbers):
| Use | Desktop | Mobile |
|---|---|---|
| Hero temp | 96/1, 600, -4px | 72/1, 600, -3px |
| Description | 18, 500 | 16, 500 |
| Range `↓ ↑` | 15, 500 | 14, 500 |
| Section label | 13, 600, +.04em, `--text-2` | same |
| Row / city | 15–16, 500 | same |
| Metric value | 24, 600 (+ unit 14, 500) | 22, 600 |
| Caption | 12, 500 | 12, 500 |

## 3. Layout

### Desktop ≥ 1024px
Container `max-width: 1120px`, side padding 32, 12 columns, gutter 24.
- **Header** (72px): left pin + city (16/500); right: search, units, theme toggle (40×40 buttons, gap 8).
- **Hero card** (cols 1–5, min-height 480): city/status banner on top, centred icon 96px, temp 96px, description, `↓ ↑` range; at the bottom a 2×1 grid of metric tiles (Humidity, Wind). If Feels like / UV have data → 2×2.
- **Hourly card** (cols 6–12, ~168px tall): label `Hourly`, then a strip of 8 items. Item `flex: 1 1 0; min-width: 64px; height: 104px` (time 12, icon 32, temp 15/600); scrolls horizontally with a 24px edge fade if it overflows.
- **Weekly card** (cols 6–12, under hourly): label `7 days` (use actual count), rows 56px, divider between rows.
  Row grid: `day 1fr (min 96) | icon 32 | min 44 (right) | range bar 1fr | max 44`. Range bar: track 6px high, radius 3, `--divider`; fill spans that day's min→max on the week-wide scale, gradient `#7AB0FF → #F59E0B`; today's row shows a 10px dot at the current temp.
- **Search**: icon expands inline to a 360px input; results/favourites in a popover under it (radius 16, `--card-solid`, shadow). `Esc` closes.

### Tablet 600–1023px
Single column, max-width 640 centred. Hero is a horizontal card (temp left, icon right), then hourly, weekly, metrics 2×1.

### Mobile < 600px
Side padding 16, gap 12, header 56.
Order: header → hero → hourly → weekly → metrics.
- **Hero**: padding 20, icon 72, temp 72. Metrics are *not* in the hero here.
- **Hourly**: edge-to-edge scroll (`margin: 0 -16px; padding: 0 16px`), item 64×96, gap 8, `scroll-snap-type: x proximity`, no scrollbar.
- **Weekly**: row 52px; short day names (`Today`, `Thu`, `Fri`…, width 56); icon 28; min 32; bar flexible (≈130px at 375); max 32.
- **Metrics**: 2×1 tiles, height 84.
- **Search**: header icon opens a full-screen sheet (input pinned top, results below, close button 44×44).

## 4. Components & states
**Icon button** (search, units, theme, back, close): 40px desktop / 44px mobile, radius 12. default transparent → hover `--accent-soft` → active `--accent-soft` + `scale(.96)` → focus-visible 2px `--accent` ring, 2px offset → disabled `opacity .4`.

**Theme toggle**: top-right, after units. `role="switch"`, `aria-label="Dark theme"`, sun/moon icon cross-fade + 90° rotate, 150ms. Starts from system preference.

**Units popover** (button shows `°C`): `°C / °F` and `m/s / km/h` segmented controls; saved in `localStorage`; wind always shows its unit.

**Hourly item**: default `--tile`; `Now` = border 1.5px `--accent`, bg `--accent-soft`, time label `Now`; midnight = 1px `--divider` line before the item with a `Thu` caption above it.

**Week row**: default transparent; hover (desktop, if rows become interactive) `--accent-soft` radius 12.

**Metric tile**: `--tile`, radius 16, icon 20 (UV uses `--sun`), label 12 `--text-2`, value 24/600 + unit.

**Hero banners/states**
- Loading: skeletons in `--skeleton`, 1.4s opacity pulse (as today), same geometry as real content.
- Error: error icon + `Failed to load data` + secondary `Retry` button; per-card, other cards keep working.
- Geolocation denied: pill banner in hero `Showing Berlin · Use my location`.
- Empty favourites (search): `Add cities to favourites`.
- UV without data: hide the tile instead of showing `-`.

**Motion**: respect `prefers-reduced-motion` (drop rotate/pulse/background transition).

## 5. Figma structure (file `IDprcdwcpRkUL0eD12h9ER`)
- New page `Frosted Sky`. Variable collection `Theme` with modes Light / Dark holding the tokens above.
- Frames: Desktop 1440 (12-col, margin 32, gutter 24), Tablet 768, Mobile 375 — each in both modes.
- Components: IconButton, HourlyItem (variants: default/now/midnight/loading/error), DayRow, MetricTile, HeroCard, Banner, SearchInput, UnitsPopover.
- Budget: Starter plan limits `use_figma` to ~15–20 calls per session → build in a few large scripts (see project memory).

## 6. Implementation order in this repo
1. `src/styles/themes.scss` (tokens) + `ThemeToggle` + inline pre-paint script in `index.html`.
2. Page container, 12-col grid, breakpoints.
3. Hero card (move metrics inside on desktop).
4. Hourly strip (`Now`, midnight divider, edge fade).
5. Weekly rows + `RangeBar`.
6. Metric tiles with units; hide UV when empty.
7. Header: units popover; search popover/sheet.
8. States: loading, error + Retry, geolocation banner.
9. QA: both themes × 3 breakpoints, contrast, keyboard focus, reduced motion.
