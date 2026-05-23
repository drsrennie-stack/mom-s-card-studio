# Accessibility Compliance Notes

## 1. Project

**Project:** Christine's Skivvez Studio (Mom's Schivvez Design Studio)
**Files covered:** index.html
**Supporting file:** worker.js (Cloudflare Worker proxy, server-side, no user interface)
**Purpose:** Standalone die-cut card design app, hosted on GitHub Pages and embedded in Kajabi via iframe. Includes an AI artwork generator that calls the Claude API through the worker proxy.
**Date:** 2026-05-22

## 2. WCAG version and target level

Standard: WCAG 2.2. Target: AA minimum, AAA where achievable.

| Area | Criterion | Level achieved |
|------|-----------|----------------|
| Semantic structure | 1.3.1 Info and Relationships | AA |
| Heading hierarchy | 2.4.6 Headings and Labels (h1 wordmark, h2 sections) | AA |
| Text contrast | 1.4.3 / 1.4.6 Contrast | AA, AAA on primary text |
| Non-text contrast | 1.4.11 (borders, focus ring, controls) | AA |
| Keyboard operable | 2.1.1 Keyboard | AA |
| No keyboard trap | 2.1.2 | AA |
| Focus visible | 2.4.7 Focus Visible (2px terracotta outline) | AA |
| Focus appearance | 2.4.13 | AA |
| Skip link | 2.4.1 Bypass Blocks | AA |
| Labels for inputs | 3.3.2 / 4.1.2 (label + control, accessible names) | AA |
| Status messages | 4.1.3 (aria-live on AI generation status, role="alert" on errors) | AA |
| Reduced motion | 2.3.3 (prefers-reduced-motion disables transitions) | AAA |
| Selection not by color alone | 1.4.1 (aria-pressed plus border-weight change) | AA |
| Target size | 2.5.8 (controls at or above 24x24 CSS px) | AA |

## 3. Color contrast audit

All ratios calculated against WCAG relative luminance. Normal text passes at 4.5:1, large text and UI components at 3:1, AAA normal text at 7:1.

| Foreground | Background | Ratio | Use | Result |
|-----------|-----------|-------|-----|--------|
| Ink #221F1D | White #FFFFFF | 16.4:1 | Primary text, headings | Pass AAA |
| Ink #221F1D | Paper #F4F1EC | 14.5:1 | Text on app surface | Pass AAA |
| Muted #5C544B | White #FFFFFF | 7.4:1 | Section labels, hints | Pass AAA |
| Muted #5C544B | Soft tint #F5EAE3 | 6.3:1 | Hint text on tinted button | Pass AA |
| White #FFFFFF | Ink #221F1D | 16.4:1 | Button text, selected states | Pass AAA |
| White #FFFFFF | Terracotta-dark #9E4A2B | 6.0:1 | Primary action buttons (Create designs, Use on card) | Pass AA |
| Terracotta-dark #9E4A2B | Soft tint #F5EAE3 | 5.1:1 | Error message text | Pass AA |
| Terracotta #BC6A4A | White #FFFFFF | 4.0:1 | Focus ring, dashed upload border | Pass (UI component, 3:1) |

No text relies on the lighter terracotta #BC6A4A. It is used only for focus indication and control borders, both governed by the 3:1 non-text threshold. The "Create designs" button keeps its full-contrast terracotta-dark background while generating (the "Creating..." label stays at 6.0:1); when it is disabled because the description field is empty it is dimmed with opacity, which is the disabled state and is exempt from the contrast requirement under WCAG 1.4.3.

## 4. Keyboard navigation flow

Verified by code review. All interactive elements are native button, input, select, or textarea elements, so all are reachable and operable by keyboard.

Tab order: skip link, then the control panel top to bottom. Background Pattern (no-pattern toggle, category buttons, design buttons, density slider, shuffle), Card Size select, Color Palette (preset buttons, three color pickers), Card Background (swatches, custom picker), Artwork (source toggle of Describe / From a photo / My own art, then the art-style buttons, description textarea, Create buttons, the two AI option previews and their Use buttons, photo upload, photo treatment toggle, stylize controls, position grid, size slider, remove button), Text (phrase textarea, font menu, sliders, color swatches, alignment, position, bold and shadow). The footer Reset and Download PNG buttons come next, then the preview region.

- Skip link is the first focusable element and jumps to the preview region (tabindex="-1" so it can receive focus).
- The font menu opens and closes with Enter or Space, exposes aria-expanded, and closes on Escape. Each font option is a button reachable by Tab.
- Reset triggers a native confirm dialog so the card cannot be cleared by accident.
- No keyboard traps. Focus is visible everywhere via a 2px terracotta outline with a 2px offset.

## 5. Screen reader testing

Performed at the code and structure level: semantic landmarks (header, h1, h2 section headings), role="img" with a descriptive aria-label on the preview canvas and on each of the two AI design previews, aria-pressed on all toggle and selection controls (pattern, palette, artwork mode, art style, photo treatment, text controls), aria-label on every icon-only and color-only control, role="alert" on the photo, artwork, and generation error messages, aria-live="polite" on the AI generation status so progress is announced, aria-haspopup and aria-expanded on the font menu, and an accessible name for every form control including the file inputs.

A live pass with VoiceOver and NVDA has not yet been run in this environment. See section 6.

## 6. Known limitations and remediation plan

1. **Live screen reader verification pending.** Run VoiceOver (Safari) and NVDA (Firefox) before the public Kajabi launch and confirm every control announces a clear name and state, including the AI generation status. Remediation: address any gaps found, re-test.
2. **Canvas preview is a single image to assistive tech.** The design inside the canvas is announced through one descriptive aria-label, not navigable element by element. This is acceptable for a visual preview and matches the app's purpose.
3. **AI artwork previews.** Each generated design is announced as "Design option 1 / 2"; the artwork content itself is not described in detail. Acceptable for a visual selection step.
4. **Font menu keyboard model.** The menu is fully operable with Tab, Enter, Space, and Escape, but does not implement arrow-key roving focus. Optional future enhancement, not required for AA.
5. **Initial load time.** The app compiles in the browser via Babel, adding roughly one to two seconds on first load. A "Loading the studio" message is shown. Optional future enhancement: ship a pre-compiled build to remove Babel.
6. **AI generation requires network.** The AI generator calls the Claude API through the Cloudflare Worker. If the network or worker is unavailable, the app shows a clear error message and the rest of the studio (patterns, photo stylize, upload-your-own-art, text, download) continues to work offline.
7. **Fixed embed height on desktop.** The app is 806px tall on desktop. The baked-in height-sender posts the correct height to the parent Kajabi page; if the Kajabi page's resize listener is active the iframe adjusts automatically, including taller layouts on mobile.

## 7. Reviewer

Prepared for review by Dr. Sharilyn Rennie. Sign-off pending the live screen reader pass described in section 6.
