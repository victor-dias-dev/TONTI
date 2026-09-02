export type ThemeColors = {
  background: string;
  surface: string;
  surfaceMuted: string;
  primary: string;
  primaryMuted: string;
  primarySoft: string;
  primarySoft50: string;
  primarySoft30: string;
  primaryInk: string;
  onPrimary: string;
  text: string;
  muted: string;
  mutedSoft: string;
  border: string;
  chip: string;
  income: string;
  incomeSoft: string;
  incomeValue: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
  dangerSoft20: string;
  success: string;
  track: string;
  overlay: string;
  brand: string;
  onBrand: string;
};

export const lightColors: ThemeColors = {
  background: '#F8FAFA',
  surface: '#FFFFFF',
  surfaceMuted: '#F2F4F4',
  primary: '#00342B',
  primaryMuted: '#3B6663',
  primarySoft: '#BBE8E4',
  primarySoft50: 'rgba(187, 232, 228, 0.5)',
  primarySoft30: 'rgba(187, 232, 228, 0.3)',
  primaryInk: '#3F6A67',
  onPrimary: '#FFFFFF',
  text: '#191C1D',
  muted: '#3F4945',
  mutedSoft: '#707975',
  border: '#E1E3E3',
  chip: '#ECEEEE',
  income: '#00342B',
  incomeSoft: 'rgba(0, 77, 64, 0.2)',
  incomeValue: '#3B6663',
  warning: '#C8A900',
  warningSoft: 'rgba(200, 169, 0, 0.2)',
  danger: '#93000A',
  dangerSoft: '#FFDAD6',
  dangerSoft20: 'rgba(255, 218, 214, 0.2)',
  success: '#00342B',
  track: '#E1E3E3',
  overlay: 'rgba(248, 250, 250, 0.8)',
  brand: '#00342B',
  onBrand: '#FFFFFF',
};

export const darkColors: ThemeColors = {
  background: '#191C1D',
  surface: '#2E3131',
  surfaceMuted: '#3A3D3D',
  primary: '#94D3C1',
  primaryMuted: '#A2CFCB',
  primarySoft: '#224E4B',
  primarySoft50: 'rgba(34, 78, 75, 0.7)',
  primarySoft30: 'rgba(34, 78, 75, 0.4)',
  primaryInk: '#BBE8E4',
  onPrimary: '#00342B',
  text: '#EFF1F1',
  muted: '#BFC9C4',
  mutedSoft: '#8E9692',
  border: '#3F4945',
  chip: '#3A3D3D',
  income: '#94D3C1',
  incomeSoft: 'rgba(148, 211, 193, 0.2)',
  incomeValue: '#A2CFCB',
  warning: '#E9C400',
  warningSoft: 'rgba(233, 196, 0, 0.2)',
  danger: '#FFB4AB',
  dangerSoft: '#93000A',
  dangerSoft20: 'rgba(147, 0, 10, 0.35)',
  success: '#94D3C1',
  track: '#3F4945',
  overlay: 'rgba(25, 28, 29, 0.85)',
  brand: '#00342B',
  onBrand: '#FFFFFF',
};

export const colors = lightColors;
