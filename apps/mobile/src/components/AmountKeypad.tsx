import { Pressable, StyleSheet, View } from 'react-native';
import { appendMoneyDigit, formatMoney, removeMoneyDigit } from '../domain';
import { useColors } from '../theme';
import { AppText } from './AppText';

interface AmountKeypadProps {
  value: string;
  onChange: (cents: string) => void;
  label?: string;
}

export function AmountKeypad({ value, onChange, label = 'Valor' }: AmountKeypadProps) {
  const colors = useColors();
  return (
    <View style={styles.amount}>
      <AppText variant="caption" color={colors.muted} align="center">
        {label}
      </AppText>
      <AppText variant="display" color={colors.primary} align="center">
        {formatMoney(value || '0', { sign: 'never' })}
      </AppText>
      <View style={styles.digits}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', '⌫'].map((key) => (
          <Pressable
            key={key}
            onPress={() => {
              if (key === '⌫') {
                onChange(removeMoneyDigit(value || '0'));
                return;
              }
              const next =
                key === '00'
                  ? appendMoneyDigit(appendMoneyDigit(value || '0', '0'), '0')
                  : appendMoneyDigit(value || '0', key);
              onChange(next);
            }}
            accessibilityRole="button"
            accessibilityLabel={key === '⌫' ? 'Apagar' : key}
            style={styles.digit}
          >
            <AppText variant="titleSm" color={colors.primary}>
              {key}
            </AppText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  amount: { alignItems: 'center', gap: 8, paddingVertical: 8 },
  digits: { flexDirection: 'row', flexWrap: 'wrap', width: '100%', justifyContent: 'center' },
  digit: {
    width: '30%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
