---
name: Tonti Design System
colors:
  surface: '#f8fafa'
  surface-dim: '#d8dada'
  surface-bright: '#f8fafa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f4'
  surface-container: '#eceeee'
  surface-container-high: '#e6e8e8'
  surface-container-highest: '#e1e3e3'
  on-surface: '#191c1d'
  on-surface-variant: '#3f4945'
  inverse-surface: '#2e3131'
  inverse-on-surface: '#eff1f1'
  outline: '#707975'
  outline-variant: '#bfc9c4'
  surface-tint: '#29695b'
  primary: '#00342b'
  on-primary: '#ffffff'
  primary-container: '#004d40'
  on-primary-container: '#7ebdac'
  inverse-primary: '#94d3c1'
  secondary: '#3b6663'
  on-secondary: '#ffffff'
  secondary-container: '#bbe8e4'
  on-secondary-container: '#3f6a67'
  tertiary: '#705d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#c8a900'
  on-tertiary-container: '#4b3e00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#afefdd'
  primary-fixed-dim: '#94d3c1'
  on-primary-fixed: '#00201a'
  on-primary-fixed-variant: '#065043'
  secondary-fixed: '#beebe7'
  secondary-fixed-dim: '#a2cfcb'
  on-secondary-fixed: '#00201e'
  on-secondary-fixed-variant: '#224e4b'
  tertiary-fixed: '#ffe16d'
  tertiary-fixed-dim: '#e9c400'
  on-tertiary-fixed: '#221b00'
  on-tertiary-fixed-variant: '#544600'
  background: '#f8fafa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e3'
typography:
  balance-display:
    fontFamily: Hanken Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  currency-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-margin: 20px
  stack-gap: 16px
  element-gap: 8px
  section-padding: 32px
---

## Brand & Style

The design system is engineered to transform the perception of personal finance from a stressful chore into a premium, effortless experience. It targets the modern Brazilian consumer who values speed, transparency, and a sophisticated aesthetic.

The visual direction is **Modern Corporate with a Tactile edge**. It balances the reliability of traditional banking with the agility of a startup. By utilizing deep, grounded greens paired with soft, organic shapes, the UI evokes "Growth and Security." The style emphasizes extreme clarity, generous whitespace to eliminate cognitive load, and high-quality finishes that feel "expensive" yet accessible.

## Colors

The palette is anchored by **Deep Forest (#004D40)**, representing stability and financial depth. This is contrasted with **Mint Glaze (#B2DFDB)** for secondary actions and **Tonti Gold (#FFD700)** as a premium accent for loyalty or high-value highlights.

- **Backgrounds:** Use a very soft off-white (`#F5F7F7`) to distinguish from pure white card elements, creating a subtle layered effect.
- **Semantic Logic:** Green represents "Entrada" (Income), Red represents "Saída" (Expense). These are slightly desaturated to maintain a premium feel, avoiding the "harshness" of utility-only apps.

## Typography

The system utilizes **Hanken Grotesk** for headlines and financial figures to provide a sharp, modern, and high-end feel. **Inter** handles body text and labels for maximum legibility in dense data views.

- **Financial Figures:** Currency symbols (R$) should be slightly smaller and lighter than the main value (e.g., `currency-md` alongside `balance-display`).
- **Hierarchy:** Use large titles for main balances to establish immediate context upon app entry.
- **Localization:** All labels must accommodate Portuguese (PT-BR) word lengths, which often exceed English equivalents by 20-30%.

## Layout & Spacing

This design system uses a **Fluid Mobile-First Grid**.

- **Margins:** A standard 20px horizontal margin for all screen content.
- **Rhythm:** An 8px linear scale. Most card components utilize 16px internal padding.
- **Bottom Navigation:** A persistent bottom bar (56px height) provides primary navigation, ensuring easy reachability for one-handed use.
- **Safe Areas:** Adhere strictly to iOS and Android safe-area insets, particularly for the bottom home indicator and top status bar.

## Elevation & Depth

To maintain a "Premium Modern" feel, this design system avoids heavy shadows.

- **Tonal Layering:** The primary method of depth is placing pure white (#FFFFFF) cards on the light grey (#F5F7F7) background.
- **Soft Shadows:** When elevation is required (e.g., for floating action buttons or primary cards), use a "Tonti Glow": `0px 8px 24px rgba(0, 77, 64, 0.08)`. This tints the shadow with the primary teal, making it feel more integrated and cleaner than a neutral black shadow.
- **Glassmorphism:** Use sparingly for top app bars (blur 10px, 80% opacity) to allow content to flow underneath while maintaining legibility.

## Shapes

The shape language is defined by **High-Radius Geometry**.

- **Standard Cards:** Use `rounded-lg` (16px) to evoke a friendly, approachable feeling.
- **Primary Buttons/Containers:** Use `rounded-xl` (24px) to create a distinct, modern silhouette.
- **Selection Controls:** Checkboxes and radio buttons should be rounded (4px and 100% respectively) to match the overall softness.

## Components

### Buttons

- **Primary:** Forest green background, white text, 24px corner radius. Fixed height of 56px for touch accessibility.
- **Secondary:** Mint glaze background, forest green text.
- **Tertiary/Ghost:** No background, forest green bold text.

### Cards (The "Tonti" Container)

- Pure white background, 16px corner radius, subtle teal-tinted shadow.
- Internal padding should be a consistent 20px.

### Input Fields

- Soft grey background (#F0F2F2) with no border.
- On focus, a 2px border of Forest Green.
- Placeholder text in a neutral mid-grey.

### Chips & Tags

- Used for transaction categories (e.g., "Alimentação", "Transporte").
- Pill-shaped (fully rounded) with low-opacity backgrounds matching the category icon color.

### Financial Lists

- Transaction items: 56px height, leading icon in a circle, title and subtitle stacked, trailing amount colored by semantic logic (Green for +, Black/Red for -).

### Custom Icons

- Rounded-cap strokes (2px weight).
- Avoid sharp corners; every icon should feel cohesive with the 16px card radii.
