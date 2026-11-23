import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Task } from '../types/task';

type TaskCardProps = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  busy?: boolean;
};

export function TaskCard({ task, onToggle, onDelete, busy = false }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={[styles.card, busy && { opacity: 0.6 }]}>
      <View style={styles.topLine}>
        <Pressable
          testID={'toggle-' + task.id}
          accessibilityRole="checkbox"
          accessibilityLabel={'Cambiar estado de ' + task.title}
          accessibilityState={{ checked: task.completed, disabled: busy, busy }}
          disabled={busy}
          style={[styles.check, task.completed && styles.checked]}
          onPress={onToggle}
        >
          <Text style={styles.checkText}>{task.completed ? '✓' : ''}</Text>
        </Pressable>
        <View style={styles.content}>
          <Text style={[styles.title, task.completed && styles.completed]}>{task.title}</Text>
          <Text style={styles.state}>
            {busy ? 'Guardando...' : task.completed ? 'Completada' : 'Pendiente'}
          </Text>
        </View>
        <Pressable
          testID={'expand-' + task.id}
          accessibilityRole="button"
          accessibilityLabel={'Ver detalle de ' + task.title}
          accessibilityState={{ expanded }}
          onPress={() => setExpanded((current) => !current)}
          style={styles.expandButton}
        >
          <Text style={styles.expandText}>{expanded ? '−' : '+'}</Text>
        </Pressable>
      </View>
      {expanded ? (
        <View style={styles.details} testID={'details-' + task.id}>
          <Text style={styles.description}>{task.description || 'Sin descripción.'}</Text>
          <Text style={styles.date}>
            {'Creada: ' + new Date(task.createdAt).toLocaleString()}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={'Eliminar ' + task.title}
            accessibilityState={{ disabled: busy, busy }}
            disabled={busy}
            onPress={onDelete}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>Eliminar tarea</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#171f33', borderRadius: 17, padding: 16,
    marginBottom: 11, borderWidth: 1, borderColor: '#2d3449' },
  topLine: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  check: { minHeight: 44, minWidth: 44, borderRadius: 12, borderWidth: 2,
    borderColor: '#86948a', justifyContent: 'center', alignItems: 'center' },
  checked: { backgroundColor: '#4edea3', borderColor: '#4edea3' },
  checkText: { color: '#003824', fontWeight: '900', fontSize: 19 },
  content: { flex: 1 },
  title: { color: '#dae2fd', fontSize: 15, fontWeight: '800', lineHeight: 21 },
  completed: { color: '#a0ada7', textDecorationLine: 'line-through' },
  state: { color: '#bbcabf', fontSize: 12, marginTop: 6 },
  expandButton: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#222a3d',
    justifyContent: 'center', alignItems: 'center' },
  expandText: { color: '#4edea3', fontWeight: '800', fontSize: 21 },
  details: { marginTop: 13, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#2d3449' },
  description: { fontSize: 14, color: '#bbcabf', lineHeight: 21 },
  date: { fontSize: 12, color: '#a4afc1', marginTop: 12 },
  deleteButton: { alignSelf: 'flex-start', marginTop: 13, paddingVertical: 12,
    paddingHorizontal: 14, backgroundColor: '#3b202b', borderRadius: 9 },
  deleteText: { color: '#ffb4ab', fontSize: 12, fontWeight: '800' },
});
