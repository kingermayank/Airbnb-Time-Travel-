# Decision: IconButton and button hover/press states

**Date:** 2026-02-07  
**Status:** Accepted  
**Context:** Align design system with Figma home page (node 283-2649): header icon-only buttons and text-only ghost button with hover and press states.

## Decision

1. **Introduce a dedicated IconButton foundation**  
   - Icon-only control (e.g. 40×40px, rounded) for header actions (language, menu).  
   - Props: `icon` (ReactNode), `ariaLabel` (required), optional `size` (sm/md).  
   - Styling driven by tokens: `--ds-surface-icon-button`, `--ds-surface-icon-button-hover`, `--ds-surface-icon-button-active`.  
   - Hover and press (active) states implemented via a small CSS file (`.ds-icon-button`) so states work reliably in Storybook and the app.

2. **Add hover and press to Button**  
   - Keep existing variants (primary, secondary, ghost).  
   - Apply hover/active via shared class names (`ds-button`, `ds-button--ghost`, etc.) and `Button.css`:  
     - Ghost: hover `rgba(0,0,0,0.05)`, active slightly darker.  
     - Primary: hover/active via filter darken.  
     - Secondary: hover/active use icon-button hover/active tokens.  
   - No new variant; ghost remains the “text-only” style (e.g. “Become a host”).

3. **Tokens**  
   - New tokens for nav and icon buttons: `--ds-text-nav-inactive`, `--ds-surface-icon-button`, `--ds-surface-icon-button-hover`, `--ds-surface-icon-button-active`.  
   - Documented in `src/design-system/tokens/TOKENS.md`.

## Consequences

- Header and other screens can use `IconButton` for icon-only actions and `Button variant="ghost"` for text-only actions with consistent hover/press.  
- Storybook can document Default, Hover, and Press via stories and interaction.  
- Future button-like controls (e.g. icon+text) can reuse the same token set or extend Button/IconButton.
