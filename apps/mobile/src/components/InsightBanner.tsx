import { StyleSheet, View } from 'react-native';
import { colors, radius } from '../theme';
import { AppText } from './AppText';
import { Icon } from './Icon';

interface InsightBannerProps {
  text: string;
}

export function InsightBanner({ text }: InsightBannerProps) {
  return (
    <View style={styles.banner}>
      <Icon name="bulb" size={18} color={colors.primary} />
      <AppText variant="label" color={colors.primaryInk} style={styles.text}>
        {text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  text: { flex: 1, fontFamily: 'Inter_400Regular', lineHeight: 18 },
});
