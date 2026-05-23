# Accessibility Compliance Notes

## 1. Project

**Project:** Christine's Skivvez Studio (Mom's Schivvez Design Studio)
**Files covered:** index.html
**Purpose:** Standalone die-cut card design app, hosted on GitHub Pages and embedded in Kajabi via iframe.
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
| Status messages | 4.1.3 (role="alert" on photo errors) | AA |
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
| White #FFFFFF | Terracotta-dark #9E4A2B | 6.0:1 | Primary action button text | Pass AA |
| Terracotta-dark #9E4A2B | Soft tint #F5EAE3 | 5.1:1 | Error message text | Pass AA |
| Terracotta #BC6A4A | White #FFFFFF | 4.0:1 | Focus ring, dashed upload border | Pass (UI component, 3:1) |

No text relies on the lighter terracotta #BC6A4A. It is used only for focus indication and a control border, both governed by the 3:1 non-text threshold.

## 4. Keyboard navigation flow

Verified by code review. All interactive elements are native button, input, select, or textarea elements, so all are reachable and operable by keyboard.

Tab order: skip link, then the control panel top to bottom (pattern toggle and category buttons, density slider, shuffle, card size select, palette buttons, color pickers, background swatches, photo upload button, style buttons, strength slider, use-on-card button, position grid, size slider, remove button, phrase textarea, font menu, text sliders and toggles), then the Download button, then the preview region.

- Skip link is the first focusable element and jumps to the preview region (which has tabindex="-1" so it can receive focus).
- The font menu opens and closes with Enter or Space on its button, exposes aria-expanded, and closes on Escape. Each font option is a button reachable by Tab.
- No keyboard traps. Focus is visible everywhere via a 2px terracotta outline with a 2px offset.

## 5. Screen reader testing

Performed at the code and structure level: semantic landmarks (header, h1, h2 section headings), role="img" with a descriptive aria-label on the preview canvas, aria-pressed on all toggle and selection controls, aria-label on every icon-only and color-only control, role="alert" on the photo error message, aria-haspopup and aria-expanded on the font menu, and an accessible name for every form control.

A live pass with VoiceOver and NVDA has not yet been run in this environment. See section 6.

## 6. Known limitations and remediation plan

1. **Live screen reader verification pending.** Run VoiceOver (Safari) and NVDA (Firefox) before the public Kajabi launch and confirm every control announces a clear name and state. Remediation: address any gaps found, re-test.
2. **Canvas preview is a single image to assistive tech.** The design inside the canvas is announced through one descriptive aria-label, not navigable element by element. This is acceptable for a visual preview and matches the app's purpose.
3. **Font menu keyboard model.** The menu is fully operable with Tab, Enter, Space, and Escape, but does not implement arrow-key roving focus. Optional future enhancement, not required for AA.
4. **Initial load time.** The app compiles in the browser via Babel, adding roughly one to two seconds on first load. A "Loading the studio" message is shown. Optional future enhancement: ship a pre-compiled build to remove Babel.
5. **Fixed embed height on desktop.** The app is 806px tall on desktop. The baked-in height-sender posts the correct height to the parent Kajabi page; if the Kajabi page's resize listener is active the iframe adjusts automatically, including taller layouts on mobile.

## 7. Reviewer

Prepared for review by Dr. Sharilyn Rennie. Sign-off pending the live screen reader pass described in section 6.
