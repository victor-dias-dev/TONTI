import type { TextStyle } from 'react-native';
import type { MoneyCents } from '../domain';
import { formatMoney, formatMoneyCompact } from '../domain';
import { colors } from '../theme';
import { AppText } from './AppText';

interface MoneyTextProps {
  cents: MoneyCents;
  compact?: boolean;
  signed?: boolean;
  income?: boolean;
  variant?: 'display' | 'titleLg' | 'titleSm' | 'heading' | 'label';
  color?: string;
  style?: TextStyle;
}

export function MoneyText({
  cents,
  compact,
  signed,
  income,
  variant = 'heading',
  color,
  style,
}: MoneyTextProps) {
  const value = compact
    ? formatMoneyCompact(cents)
    : formatMoney(cents, { sign: signed ? (income ? 'always' : 'auto') : 'never' });
  const display =
    signed && !income && !cents.startsWith('-')
      ? `- ${formatMoney(cents, { sign: 'never' })}`
      : value;

  return (
    <AppText
      variant={variant}
      color={color ?? (income ? colors.incomeValue : colors.text)}
      style={style}
    >
      {display}
    </AppText>
  );
}
