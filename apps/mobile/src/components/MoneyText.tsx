import type { TextStyle } from 'react-native';
import type { MoneyCents } from '../domain';
import { formatMoney, formatMoneyCompact, isNegativeMoney } from '../domain';
import { useThemeScheme } from '../theme';
import { AppText } from './AppText';

interface MoneyTextProps {
  cents: MoneyCents;
  compact?: boolean;
  signed?: boolean;
  income?: boolean;
  sign?: 'auto' | 'always' | 'never';
  variant?: 'display' | 'titleLg' | 'titleSm' | 'heading' | 'label';
  color?: string;
  style?: TextStyle;
}

export function MoneyText({
  cents,
  compact,
  signed,
  income,
  sign,
  variant = 'heading',
  color,
  style,
}: MoneyTextProps) {
  const { colors, hideBalances, currency } = useThemeScheme();
  void hideBalances;
  void currency;
  const signMode = sign ?? (signed ? (income ? 'always' : 'auto') : 'never');
  const value = compact
    ? formatMoneyCompact(cents, { sign: signMode })
    : formatMoney(cents, { sign: signMode });
  const display =
    !sign && signed && !income && !cents.startsWith('-')
      ? `- ${formatMoney(cents, { sign: 'never' })}`
      : value;
  const negative = isNegativeMoney(cents);

  return (
    <AppText
      variant={variant}
      color={
        color ??
        (income
          ? colors.incomeValue
          : negative && signMode !== 'never'
            ? colors.danger
            : colors.text)
      }
      style={style}
    >
      {display}
    </AppText>
  );
}
