import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { TaskStatus } from '../types/task';

const options: { key: TaskStatus; label: string }[] = [
  { key: 'todas', label: 'Todas' },
  { key: 'pendientes', label: 'Pendientes' },
  { key: 'completadas', label: 'Completadas' },
];

type Props = { current: TaskStatus; onChange: (status: TaskStatus) => void };

export function StatusTabs({ current, onChange }: Props) {
  return (
    <View style={styles.container}>
      {options.map((item) => (
        <Pressable
          key={item.key}
          accessibilityRole="button"
          accessibilityState={{ selected: current === item.key }}
          onPress={() => onChange(item.key)}
          style={[styles.button, current === item.key && styles.active]}
        >
          <Text style={[styles.text, current === item.key && styles.textActive]}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', backgroundColor: '#E7ECF5', padding: 4, borderRadius: 14, gap: 3, marginBottom: 13 },
  button: { flex: 1, borderRadius: 11, paddingVertical: 10, justifyContent: 'center', alignItems: 'center' },
  active: { backgroundColor: '#FFFFFF' },
  text: { color: '#67748B', fontWeight: '700', fontSize: 11 },
  textActive: { color: '#213B63' },
});
