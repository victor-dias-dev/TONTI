import { Platform, ViewStyle } from 'react-native';

export const shadows = {
  card: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#004D40',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },
    android: { elevation: 3 },
    default: {},
  }),
  fab: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 15,
    },
    android: { elevation: 6 },
    default: {},
  }),
} as const;
