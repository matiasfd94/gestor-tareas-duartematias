import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Task } from '../types/task';

type TaskCardProps = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onEdit?: () => void;
};

export function TaskCard({
    task,
    onToggle,
    onDelete,
    onEdit,
  }: TaskCardProps) {
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
          {task.categories ? (
            <Text style={[styles.description, { marginTop: 10 }]}>
              <Text style={{ fontWeight: '700' }}>Categoría: </Text>
              {task.categories}
            </Text>
          ) : null}

          {task.notes ? (
            <Text style={[styles.description, { marginTop: 10 }]}>
              <Text style={{ fontWeight: '700' }}>Notas: </Text>
              {task.notes}
            </Text>
          ) : null}

          {task.due_date ? (
            <Text style={[styles.description, { marginTop: 10 }]}>
              <Text style={{ fontWeight: '700' }}>Vencimiento: </Text>
              {task.due_date.split('-').reverse().join('/')}
            </Text>
          ) : null}
          {onEdit ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Editar ${task.title}`}
              onPress={onEdit}
              style={styles.editButton}
            >
              <Text style={styles.editText}>Editar tarea</Text>
            </Pressable>
          ) : null}
          <Pressable accessibilityRole="button" onPress={onDelete} style={styles.deleteButton}>
            <Text style={styles.deleteText}>Eliminar tarea</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#171f33',
    borderRadius: 17,
    padding: 16,
    marginBottom: 11,
    borderWidth: 1,
    borderColor: '#2d3449',
  },
  topLine: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  check: {
    height: 25,
    width: 25,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#86948a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#4edea3',
    borderColor: '#4edea3',
  },
  checkText: { color: '#003824', fontWeight: '900', fontSize: 16 },
  content: { flex: 1 },
  title: {
    color: '#dae2fd',
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 21,
  },
  completed: {
    color: '#a0ada7',
    textDecorationLine: 'line-through',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 6,
  },
  priority: {
    fontSize: 10,
    letterSpacing: 0.5,
    color: '#bbcabf',
    fontWeight: '800',
  },
  high: { color: '#ffb4ab' },
  dividerText: { color: '#86948a', fontSize: 11 },
  state: { color: '#bbcabf', fontSize: 11 },
  expandButton: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#222a3d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandText: { color: '#4edea3', fontWeight: '800', fontSize: 19 },
  details: {
    marginTop: 13,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2d3449',
  },
  description: { fontSize: 13, color: '#bbcabf', lineHeight: 20 },
  deleteButton: {
    alignSelf: 'flex-start',
    marginTop: 13,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#3b202b',
    borderRadius: 9,
  },
  deleteText: { color: '#ffb4ab', fontSize: 12, fontWeight: '800' },
  editButton: {
    alignSelf: 'flex-start',
    marginTop: 13,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#172e2a',
    borderRadius: 9,
  },
  editText: { color: '#4edea3', fontSize: 12, fontWeight: '800' },
});
