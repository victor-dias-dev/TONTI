import { Modal, Pressable, StyleSheet } from 'react-native';
import { colors, radius } from '../theme';
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
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Fechar"
      >
        <Pressable style={styles.sheet} onPress={() => undefined}>
          <AppText variant="titleSm" color={colors.primary} style={styles.title}>
            {title}
          </AppText>
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
                style={[styles.option, selected ? styles.selected : null]}
              >
                <AppText variant="body" color={selected ? colors.primary : colors.text}>
                  {option.label}
                </AppText>
              </Pressable>
            );
          })}
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
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: 20,
    gap: 8,
  },
  title: { marginBottom: 8 },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: radius.md,
  },
  selected: {
    backgroundColor: colors.primarySoft50,
  },
});
