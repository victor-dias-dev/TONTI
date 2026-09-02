import { Text, type TextProps, type TextStyle } from 'react-native';
import { typography } from '../theme';
import { useColors } from '../theme';

type Variant = keyof typeof typography;

interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: string;
  align?: TextStyle['textAlign'];
}

export function AppText({
  variant = 'body',
  color,
  align,
  style,
  children,
  ...props
}: AppTextProps) {
  const colors = useColors();
  return (
    <Text
      style={[typography[variant], { color: color ?? colors.text, textAlign: align }, style]}
      {...props}
    >
      {children}
    </Text>
  );
}
