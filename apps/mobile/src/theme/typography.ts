export const fonts = {
  display: 'HankenGrotesk_400Regular',
  displayMedium: 'HankenGrotesk_500Medium',
  displaySemiBold: 'HankenGrotesk_600SemiBold',
  displayBold: 'HankenGrotesk_700Bold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
} as const;

export const typography = {
  display: { fontFamily: fonts.displayBold, fontSize: 40, lineHeight: 48, letterSpacing: -0.8 },
  titleLg: { fontFamily: fonts.displayBold, fontSize: 32, lineHeight: 40 },
  titleMd: { fontFamily: fonts.displayBold, fontSize: 24, lineHeight: 32 },
  titleSm: { fontFamily: fonts.displaySemiBold, fontSize: 20, lineHeight: 28 },
  heading: { fontFamily: fonts.displayMedium, fontSize: 16, lineHeight: 24 },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24 },
  bodySemi: { fontFamily: fonts.bodySemiBold, fontSize: 16, lineHeight: 24 },
  label: { fontFamily: fonts.bodySemiBold, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fonts.body, fontSize: 12, lineHeight: 16 },
  micro: { fontFamily: fonts.body, fontSize: 10, lineHeight: 15 },
} as const;
