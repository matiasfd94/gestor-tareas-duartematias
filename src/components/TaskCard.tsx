import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Task } from '../types/task';

type TaskCardProps = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
};

export function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.topLine}>
        <Pressable
          testID={`toggle-${task.id}`}
          accessibilityRole="button"
          accessibilityLabel={`Cambiar estado de ${task.title}`}
          style={[styles.check, task.completed && styles.checked]}
          onPress={onToggle}
        >
          <Text style={styles.checkText}>{task.completed ? '✓' : ''}</Text>
        </Pressable>
        <View style={styles.content}>
          <Text style={[styles.title, task.completed && styles.completed]}>{task.title}</Text>
          <View style={styles.row}>
            <Text style={[styles.priority, task.priority === 'alta' && styles.high]}>
              {task.priority.toUpperCase()}
            </Text>
            <Text style={styles.dividerText}>·</Text>
            <Text style={styles.state}>{task.completed ? 'Completada' : 'Pendiente'}</Text>
          </View>
        </View>
        <Pressable
          testID={`expand-${task.id}`}
          accessibilityRole="button"
          accessibilityLabel={`Ver detalle de ${task.title}`}
          onPress={() => setExpanded((current) => !current)}
          style={styles.expandButton}
        >
          <Text style={styles.expandText}>{expanded ? '−' : '+'}</Text>
        </Pressable>
      </View>
      {expanded ? (
        <View style={styles.details} testID={`details-${task.id}`}>
          <Text style={styles.description}>{task.description}</Text>
          <Pressable accessibilityRole="button" onPress={onDelete} style={styles.deleteButton}>
            <Text style={styles.deleteText}>Eliminar tarea</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', borderRadius: 17, padding: 16, marginBottom: 11, borderWidth: 1, borderColor: '#E7EBF3' },
  topLine: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  check: { height: 25, width: 25, borderRadius: 8, borderWidth: 2, borderColor: '#A9B2C6', justifyContent: 'center', alignItems: 'center' },
  checked: { backgroundColor: '#147D73', borderColor: '#147D73' },
  checkText: { color: '#FFFFFF', fontWeight: '900', fontSize: 16 },
  content: { flex: 1 },
  title: { color: '#192846', fontSize: 15, fontWeight: '800', lineHeight: 21 },
  completed: { color: '#97A1B3', textDecorationLine: 'line-through' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 6 },
  priority: { fontSize: 10, letterSpacing: 0.5, color: '#56738F', fontWeight: '800' },
  high: { color: '#C95348' },
  dividerText: { color: '#B0BAC9', fontSize: 11 },
  state: { color: '#63728C', fontSize: 11 },
  expandButton: { width: 30, height: 30, borderRadius: 9, backgroundColor: '#ECF2F7', justifyContent: 'center', alignItems: 'center' },
  expandText: { color: '#294665', fontWeight: '800', fontSize: 19 },
  details: { marginTop: 13, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E9EEF4' },
  description: { fontSize: 13, color: '#53627E', lineHeight: 20 },
  deleteButton: { alignSelf: 'flex-start', marginTop: 13, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#FFF0F0', borderRadius: 9 },
  deleteText: { color: '#B63D4E', fontSize: 12, fontWeight: '800' },
});
