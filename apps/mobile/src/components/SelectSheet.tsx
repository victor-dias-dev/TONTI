import { Modal, Pressable, ScrollView, StyleSheet } from 'react-native';
import { radius } from '../theme';
import { useColors } from '../theme';
import { AppText } from './AppText';

interface SelectOption {
  id: string;
  label: string;
}

interface SelectSheetProps {
  visible: boolean;
  title: string;
  options: SelectOption[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export function SelectSheet({
  visible,
  title,
  options,
  selectedId,
  onSelect,
  onClose,
}: SelectSheetProps) {
  const colors = useColors();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Fechar"
      >
        <Pressable
          style={[styles.sheet, { backgroundColor: colors.surface }]}
          onPress={() => undefined}
        >
          <AppText variant="titleSm" color={colors.primary} style={styles.title}>
            {title}
          </AppText>
          <ScrollView style={styles.list} keyboardShouldPersistTaps="handled">
            {options.map((option) => {
              const selected = option.id === selectedId;
              return (
                <Pressable
                  key={option.id}
                  onPress={() => {
                    onSelect(option.id);
                    onClose();
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={option.label}
                  style={[
                    styles.option,
                    selected ? { backgroundColor: colors.primarySoft50 } : null,
                  ]}
                >
                  <AppText variant="body" color={selected ? colors.primary : colors.text}>
                    {option.label}
                  </AppText>
                </Pressable>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(25, 28, 29, 0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: 20,
    gap: 8,
  },
  title: { marginBottom: 8 },
  list: { maxHeight: 360 },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: radius.md,
  },
});
