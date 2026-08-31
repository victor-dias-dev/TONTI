# Mobile design system

Visual source of truth for `apps/mobile`: Figma (teal system), not the older cream/terracotta palette.

Product screens live under `src/features/` and import from `src/theme` and `src/components`. Login and register **do not** use this system; they still use `src/constants/theme.ts` and must stay visually unchanged until those screens exist in Figma.

## Layout

```
apps/mobile/src/
  theme/          tokens
  components/     reusable UI
  features/       screens (compose components; no theme one-offs)
  domain/         money formatting + frontend types
```

Import tokens from `src/theme`. Import UI from `src/components` (barrel `index.ts`).

Do not add a component because a screen might need it later. Repeat a real visual pattern first, then extract.

## Theme tokens

Defined in `src/theme/`. Re-exported from `src/theme/index.ts`.

### Color

| Token                          | Hex                        | Use                                  |
| ------------------------------ | -------------------------- | ------------------------------------ |
| `background`                   | `#F8FAFA`                  | Screen background                    |
| `surface`                      | `#FFFFFF`                  | Cards, sheets                        |
| `surfaceMuted`                 | `#F2F4F4`                  | Icon wells, chips, inactive controls |
| `primary`                      | `#00342B`                  | Brand, headings, primary actions     |
| `primaryMuted` / `incomeValue` | `#3B6663`                  | Income amounts, secondary teal       |
| `primarySoft`                  | `#BBE8E4`                  | Insight, badges, selected tab wash   |
| `text`                         | `#191C1D`                  | Default copy                         |
| `muted`                        | `#3F4945`                  | Supporting copy                      |
| `mutedSoft`                    | `#707975`                  | Meta, chevrons                       |
| `border` / `track` / `chip`    | `#E1E3E3` / `#ECEEEE`      | Dividers, progress track             |
| `warning`                      | `#C8A900`                  | Budget near limit                    |
| `danger`                       | `#93000A`                  | Over budget, expense emphasis        |
| `dangerSoft`                   | `#FFDAD6`                  | Expense segment, food chip           |
| `onPrimary`                    | `#FFFFFF`                  | Text on primary buttons              |
| `overlay`                      | `rgba(248, 250, 250, 0.8)` | Header blur                          |

Do not invent extra semantic colors. Map new Figma fills onto these tokens first.

### Typography

Loaded in `app/_layout.tsx` via `expo-font`:

- Headings and money: **Hanken Grotesk** (Regular / Medium / SemiBold / Bold)
- Body and labels: **Inter** (Regular / Medium / SemiBold / Bold)

Use `AppText` with a `typography` variant. Do not set `fontFamily` by hand except inside the theme.

| Variant    | Size / line | Weight          | Typical use                          |
| ---------- | ----------- | --------------- | ------------------------------------ |
| `display`  | 40 / 48     | Hanken Bold     | Large balance                        |
| `titleLg`  | 32 / 40     | Hanken Bold     | Screen titles, greeting              |
| `titleMd`  | 24 / 32     | Hanken Bold     | Section titles, logo                 |
| `titleSm`  | 20 / 28     | Hanken SemiBold | Card titles                          |
| `heading`  | 16 / 24     | Hanken Medium   | Row titles, amounts                  |
| `body`     | 16 / 24     | Inter Regular   | Paragraphs                           |
| `bodySemi` | 16 / 24     | Inter SemiBold  | Emphasized body                      |
| `label`    | 14 / 20     | Inter SemiBold  | Buttons, chips, captions on controls |
| `caption`  | 12 / 16     | Inter Regular   | Meta                                 |
| `micro`    | 10 / 15     | Inter Regular   | Tab labels                           |

### Spacing, radius, shadow

- Scale: `2, 4, 8, 12, 14, 16, 20, 24, 32`
- Screen horizontal padding: `screenPadding` = **20**
- Radius: `sm` 8, `md` 12 (cards), `lg` 16, `xl` 20, `xxl` 24 (primary button), `pill` 9999
- Shadows: `shadows.card` (teal-tinted, y=8) and `shadows.fab`

Primary button height is **56**. Tab bar min height is **56** plus safe area.

## Money

Financial amounts on product screens are `MoneyCents` (integer centavos as a string). Format only through `formatMoney` / `MoneyText`. Never `` `R$ ${value}` `` and never float arithmetic for money.

See `docs/money-and-dates.md` and `src/domain/money.ts`.

## Icons

`Icon` (`src/components/Icon.tsx`) draws SVG paths. Names are the `IconName` union in `src/domain/types.ts`.

Do not replace Figma icons with emojis. The waving hand in “Bom dia, Victor 👋” is **copy from the design**, not an icon token.

## Components

| Component                         | Role                                               |
| --------------------------------- | -------------------------------------------------- |
| `AppText`                         | All product copy; pick a typography variant        |
| `MoneyText`                       | Formatted BRL from cents                           |
| `Icon`                            | Named line icons                                   |
| `PrimaryButton`                   | Filled 56h pill (`#00342B`)                        |
| `GhostButton`                     | Outlined 56h, optional leading icon                |
| `Card`                            | White surface, radius 12, card shadow              |
| `AppHeader`                       | Logo/avatar, “Tonti”, notifications                |
| `StackHeader`                     | Back/close + title (stack screens)                 |
| `TabBar`                          | Five tabs; Contas stays selected on Cartões/Fatura |
| `BalanceCard`                     | Available balance + variation badge                |
| `StatTile`                        | Compact metric (Entradas / Saídas / Disponível)    |
| `InsightBanner`                   | Teal callout with bulb                             |
| `ProgressBar`                     | Track + fill; `primary` / `warning` / `danger`     |
| `SparkBars`                       | Lightweight bar chart (no chart library)           |
| `TransactionRow`                  | Merchant, category, signed amount                  |
| `UpcomingPaymentRow`              | Next bill row                                      |
| `CategoryBudgetRow`               | Category + spent/planned + bar                     |
| `AccountCard`                     | Account name + balance                             |
| `CategoryChip`                    | Small category pill                                |
| `SettingsRow`                     | Menu row (Mais)                                    |
| `MonthSelector`                   | Prev / month label / next                          |
| `SegmentedControl`                | Despesa / Receita / Transferência                  |
| `FormField`                       | Icon + label + value or text input                 |
| `SelectSheet`                     | Modal list picker                                  |
| `FAB`                             | 56 circular primary “+”                            |
| `Screen` / `Button` / `TextField` | Auth-only; do not reuse on product screens         |

## Navigation chrome

Five tabs: Início, Transações, Planejamento, Contas, Mais.

Cartões and Fatura Detalhada are **not** tabs. They sit on the Contas stack so the Contas tab stays visually active.

Secondary routes (nova transação, detalhes) use `StackHeader` and hide the tab bar when they live outside `(app)`.

## Auth vs product

| Surface                         | Theme                                            | Components                      |
| ------------------------------- | ------------------------------------------------ | ------------------------------- |
| Login / Register                | `src/constants/theme.ts` (legacy teal `#0F766E`) | `Screen`, `Button`, `TextField` |
| Onboarding + 12 product screens | `src/theme`                                      | Design-system components above  |

Do not restyle login/register to match Figma until those frames exist.

## Adding something new

1. Confirm the color, type, and spacing in Figma.
2. Reuse a token or existing component.
3. Extract a component only when the same pattern appears on more than one screen.
4. Keep screens free of mock imports and API clients (`docs/architecture.md`).
