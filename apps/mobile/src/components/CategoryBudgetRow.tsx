import { useEffect, useRef } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, View } from 'react-native';
import type { Budget, Category } from '../domain';
import { formatMoney, percentOf } from '../domain';
import { radius } from '../theme';
import { useThemeScheme } from '../theme';
import { AppText } from './AppText';
import { Icon } from './Icon';
import { ProgressBar } from './ProgressBar';

const DELETE_WIDTH = 80;
const OPEN_DISTANCE = 18;
const OPEN_VELOCITY = -0.12;

function wantsHorizontalSwipe(
  gesture: { dx: number; dy: number },
  open: boolean,
): boolean {
  const horizontal = Math.abs(gesture.dx) >= 3 && Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.35;
  if (!horizontal) {
    return false;
  }
  return open || gesture.dx < 0;
}

interface CategoryBudgetRowProps {
  budget: Budget;
  category?: Category;
  open?: boolean;
  onPress?: () => void;
  onDelete?: () => void;
  onOpenChange?: (open: boolean) => void;
}

export function CategoryBudgetRow({
  budget,
  category,
  open = false,
  onPress,
  onDelete,
  onOpenChange,
}: CategoryBudgetRowProps) {
  const { colors, hideBalances, currency } = useThemeScheme();
  void hideBalances;
  void currency;
  const percent = percentOf(budget.spentCents, budget.plannedCents);
  const tone = percent > 100 ? 'danger' : percent >= 85 ? 'warning' : 'primary';
  const translateX = useRef(new Animated.Value(0)).current;
  const openRef = useRef(open);
  const onOpenChangeRef = useRef(onOpenChange);
  const startX = useRef(0);
  const dragging = useRef(false);

  openRef.current = open;
  onOpenChangeRef.current = onOpenChange;

  useEffect(() => {
    if (dragging.current) {
      return;
    }
    Animated.spring(translateX, {
      toValue: open ? -DELETE_WIDTH : 0,
      useNativeDriver: true,
      bounciness: 0,
      speed: 28,
    }).start();
  }, [open, translateX]);

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_event, gesture) => wantsHorizontalSwipe(gesture, openRef.current),
      onMoveShouldSetPanResponderCapture: (_event, gesture) =>
        wantsHorizontalSwipe(gesture, openRef.current),
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        dragging.current = true;
        startX.current = openRef.current ? -DELETE_WIDTH : 0;
        if (!openRef.current) {
          onOpenChangeRef.current?.(true);
        }
      },
      onPanResponderMove: (_event, gesture) => {
        const next = Math.min(0, Math.max(-DELETE_WIDTH, startX.current + gesture.dx));
        translateX.setValue(next);
      },
      onPanResponderRelease: (_event, gesture) => {
        const offset = startX.current + gesture.dx;
        const shouldOpen = offset < -OPEN_DISTANCE || gesture.vx < OPEN_VELOCITY;
        openRef.current = shouldOpen;
        onOpenChangeRef.current?.(shouldOpen);
        dragging.current = false;
        Animated.spring(translateX, {
          toValue: shouldOpen ? -DELETE_WIDTH : 0,
          useNativeDriver: true,
          bounciness: 0,
          speed: 28,
        }).start();
      },
      onPanResponderTerminate: () => {
        dragging.current = false;
        const stillOpen = openRef.current;
        Animated.spring(translateX, {
          toValue: stillOpen ? -DELETE_WIDTH : 0,
          useNativeDriver: true,
          bounciness: 0,
          speed: 28,
        }).start();
      },
    }),
  ).current;

  return (
    <View style={[styles.clip, { backgroundColor: colors.danger }]}>
      {onDelete ? (
        <Pressable
          onPress={onDelete}
          accessibilityRole="button"
          accessibilityLabel={`Apagar ${category?.name ?? 'planejamento'}`}
          style={styles.deleteAction}
        >
          <Icon name="trash" size={18} color={colors.onPrimary} />
          <AppText variant="label" color={colors.onPrimary}>
            Apagar
          </AppText>
        </Pressable>
      ) : null}
      <Animated.View
        style={[styles.card, { backgroundColor: colors.surface, transform: [{ translateX }] }]}
        {...(onDelete ? pan.panHandlers : {})}
      >
        <Pressable
          onPress={() => {
            if (openRef.current) {
              onOpenChangeRef.current?.(false);
              return;
            }
            onPress?.();
          }}
          accessibilityRole="button"
          accessibilityLabel={category?.name ?? 'Categoria'}
          style={({ pressed }) => [styles.press, pressed && !open ? styles.pressed : null]}
        >
          <View style={styles.top}>
            <View style={styles.left}>
              <View style={[styles.icon, { backgroundColor: category?.iconBg ?? colors.chip }]}>
                <Icon name={category?.icon ?? 'grid'} size={18} color={colors.primary} />
              </View>
              <View>
                <AppText variant="label">{category?.name}</AppText>
                <AppText variant="caption" color={colors.muted}>
                  {`${formatMoney(budget.spentCents, { sign: 'never' })} / ${formatMoney(budget.plannedCents, { sign: 'never' })}`}
                </AppText>
              </View>
            </View>
            <AppText variant="heading" color={tone === 'danger' ? colors.danger : colors.text}>
              {budget.percentLabel}
            </AppText>
          </View>
          <ProgressBar percent={percent} tone={tone} />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  deleteAction: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: DELETE_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  card: {
    borderRadius: radius.md,
  },
  press: {
    padding: 16,
    gap: 12,
  },
  pressed: { opacity: 0.75 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
