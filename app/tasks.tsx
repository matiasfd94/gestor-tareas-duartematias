import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Alert, FlatList, Keyboard, Pressable, StyleSheet,
  Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TaskCard } from '../src/components/TaskCard';
import { StatusTabs } from '../src/components/StatusTabs';
import { ApiError, isAbortError, tasksService } from '../src/services/taskService';
import type { Task, TaskFilters, TaskStatus } from '../src/types/task';
import {
  isValidTaskTitle, MAX_DESCRIPTION_BYTES, utf8ByteLength,
} from '../src/utils/taskValidation';

export default function TaskManagerScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todas');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [feedbackError, setFeedbackError] = useState(false);
  const [busy, setBusy] = useState<Set<number>>(new Set());

  const creating = useRef(false);
  const pendingMutations = useRef(new Set<number>());
  const filters = useRef<TaskFilters>({ search: '', status: 'todas' });
  const listController = useRef<AbortController | null>(null);
  const sequence = useRef(0);
  const active = useRef(true);

  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
      sequence.current += 1;
      listController.current?.abort();
    };
  }, []);

  async function loadTasks() {
    const currentSequence = ++sequence.current;
    listController.current?.abort();
    const controller = new AbortController();
    listController.current = controller;
    setLoading(true);
    setError(null);

    try {
      const records = await tasksService.list(filters.current, controller.signal);
      if (active.current && currentSequence === sequence.current) setTasks(records);
    } catch (caught) {
      if (isAbortError(caught)) return;
      if (active.current && currentSequence === sequence.current) {
        setError(caught instanceof Error ? caught.message : 'No pudimos cargar las tareas.');
      }
    } finally {
      if (active.current && currentSequence === sequence.current) setLoading(false);
    }
  }

  useEffect(() => {
    filters.current = { search: query.trim(), status };
    sequence.current += 1;
    listController.current?.abort();
    setLoading(true);
    const timer = setTimeout(() => void loadTasks(), 275);
    return () => {
      clearTimeout(timer);
      sequence.current += 1;
      listController.current?.abort();
    };
  }, [query, status]);

  async function addTask() {
    if (creating.current) return;

    if (!isValidTaskTitle(newTitle)) {
      setFeedbackError(true);
      setFeedback('Ingresá un título con texto de hasta 200 bytes UTF-8.');
      return;
    }
    if (utf8ByteLength(newDescription.trim()) > MAX_DESCRIPTION_BYTES) {
      setFeedbackError(true);
      setFeedback('La descripción admite hasta 10000 bytes UTF-8.');
      return;
    }

    creating.current = true;
    setSaving(true);
    setFeedback('');
    try {
      await tasksService.create({ title: newTitle.trim(), description: newDescription.trim() });
      if (!active.current) return;
      setNewTitle('');
      setNewDescription('');
      Keyboard.dismiss();
      setFeedbackError(false);
      setFeedback('Tarea guardada. Se consultará el listado con los filtros actuales.');
      await loadTasks();
    } catch (caught) {
      if (!active.current) return;
      setFeedbackError(true);
      const message = caught instanceof Error ? caught.message : 'No pudimos crear la tarea.';
      setFeedback(message + (
        caught instanceof ApiError && caught.status === 0
          ? ' Consultá el listado antes de repetir el alta: podría haberse guardado.'
          : ''
      ));
    } finally {
      creating.current = false;
      if (active.current) setSaving(false);
    }
  }

  async function mutate(
    id: number,
    action: () => Promise<Task | void>,
    success: string,
  ) {
    if (pendingMutations.current.has(id)) return;
    pendingMutations.current.add(id);
    setBusy(new Set(pendingMutations.current));
    setFeedback('');

    try {
      const updated = await action();
      if (!active.current) return;
      setTasks((previous) => updated
        ? previous.map((item) => item.id === id ? updated : item)
        : previous.filter((item) => item.id !== id));
      setFeedbackError(false);
      setFeedback(success);
      await loadTasks();
    } catch (caught) {
      if (!active.current) return;
      setFeedbackError(true);
      setFeedback(caught instanceof Error ? caught.message : 'No pudimos guardar el cambio.');
      if (caught instanceof ApiError && caught.status === 404) await loadTasks();
    } finally {
      pendingMutations.current.delete(id);
      if (active.current) setBusy(new Set(pendingMutations.current));
    }
  }

  function toggleTask(task: Task) {
    void mutate(
      task.id,
      () => tasksService.setCompleted(task.id, !task.completed),
      task.completed ? 'Tarea marcada como pendiente.' : 'Tarea completada.',
    );
  }

  function deleteTask(task: Task) {
    if (pendingMutations.current.has(task.id)) return;
    Alert.alert(
      'Eliminar tarea compartida',
      '¿Querés eliminar "' + task.title + '"? La eliminación es definitiva y afecta al listado compartido.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => void mutate(
            task.id, () => tasksService.remove(task.id), 'Tarea eliminada.',
          ),
        },
      ],
    );
  }

  const completed = tasks.filter((task) => task.completed).length;

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            busy={busy.has(item.id)}
            onToggle={() => toggleTask(item)}
            onDelete={() => deleteTask(item)}
          />
        )}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <>
            <Text style={styles.eyebrow}>API DEL PROFESOR</Text>
            <Text style={styles.heading}>Gestor de tareas</Text>
            <Text style={styles.subtitle}>
              Tareas compartidas. No se necesita iniciar sesión.
            </Text>

            <View style={styles.statsRow}>
              {[
                ['RESULTADOS', tasks.length],
                ['PENDIENTES', tasks.length - completed],
                ['COMPLETADAS', completed],
              ].map(([label, value]) => (
                <View key={label} style={styles.stat}>
                  <Text style={styles.statLabel}>{label}</Text>
                  <Text style={styles.statNumber}>{value}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.hint}>Los contadores corresponden al listado filtrado.</Text>

            <Text style={styles.label}>NUEVA TAREA</Text>
            <TextInput
              testID="new-task-input"
              accessibilityLabel="Nombre de la nueva tarea"
              placeholder="Ej.: Matías Duarte - prueba de integración"
              placeholderTextColor="#95a0b3"
              value={newTitle}
              onChangeText={setNewTitle}
              maxLength={200}
              editable={!saving}
              style={styles.input}
            />
            <Text style={styles.label}>DESCRIPCIÓN</Text>
            <TextInput
              accessibilityLabel="Descripción de la nueva tarea"
              placeholder="Detalle de la tarea"
              placeholderTextColor="#95a0b3"
              value={newDescription}
              onChangeText={setNewDescription}
              maxLength={10000}
              multiline
              textAlignVertical="top"
              editable={!saving}
              style={[styles.input, { minHeight: 85 }]}
            />
            <Pressable
              testID="add-task-button"
              accessibilityRole="button"
              accessibilityState={{ disabled: saving, busy: saving }}
              disabled={saving}
              onPress={() => void addTask()}
              style={[styles.addButton, saving && { opacity: 0.5 }]}
            >
              <Text style={styles.addText}>{saving ? 'Guardando...' : 'Agregar tarea'}</Text>
            </Pressable>

            {feedback ? (
              <Text accessibilityLiveRegion="polite"
                style={[styles.feedback, feedbackError && { color: '#ffb4ab' }]}>
                {feedback}
              </Text>
            ) : null}

            <Text style={styles.label}>BUSCAR TAREAS</Text>
            <TextInput
              testID="search-input"
              accessibilityLabel="Buscar por título o descripción"
              placeholder="Buscar por título o descripción..."
              placeholderTextColor="#95a0b3"
              value={query}
              onChangeText={setQuery}
              style={styles.input}
            />
            <StatusTabs current={status} onChange={setStatus} />

            <Pressable
              accessibilityRole="button"
              disabled={loading}
              onPress={() => void loadTasks()}
              style={[styles.refreshButton, loading && { opacity: 0.5 }]}
            >
              <Text style={styles.refreshText}>Recargar datos</Text>
            </Pressable>

            {error ? (
              <View style={styles.errorBox}>
                <Text accessibilityRole="alert" style={styles.error}>{error}</Text>
                <Pressable
                  accessibilityRole="button"
                  disabled={loading}
                  onPress={() => void loadTasks()}
                  style={styles.refreshButton}
                >
                  <Text style={styles.refreshText}>Reintentar</Text>
                </Pressable>
              </View>
            ) : null}

            {loading ? (
              <View style={styles.loading}>
                <ActivityIndicator color="#4edea3" />
                <Text style={styles.hint}>Consultando tareas...</Text>
              </View>
            ) : null}
          </>
        }
        ListEmptyComponent={!loading && !error ? (
          <Text style={styles.empty}>No hay tareas para mostrar con estos filtros.</Text>
        ) : null}
        ListFooterComponent={
          <Text style={styles.footer}>EDI · Matías Duarte · Gestor compartido</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b1326' },
  container: { paddingHorizontal: 22, paddingTop: 16, paddingBottom: 48, flexGrow: 1 },
  eyebrow: { color: '#4edea3', fontSize: 11, fontWeight: '700', letterSpacing: 1.4 },
  heading: { fontSize: 30, fontWeight: '800', color: '#dae2fd', marginTop: 8 },
  subtitle: { color: '#bbcabf', fontSize: 14, lineHeight: 21, marginTop: 8, marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 8 },
  stat: { flex: 1, backgroundColor: '#171f33', padding: 12, borderRadius: 14,
    borderWidth: 1, borderColor: '#2d3449' },
  statLabel: { color: '#bbcabf', fontSize: 9, fontWeight: '700' },
  statNumber: { color: '#4edea3', fontSize: 25, fontWeight: '800', marginTop: 8 },
  hint: { color: '#a4afc1', fontSize: 12, lineHeight: 18, marginVertical: 9 },
  label: { color: '#bbcabf', fontSize: 11, fontWeight: '800', letterSpacing: 1, marginTop: 12, marginBottom: 9 },
  input: { backgroundColor: '#171f33', color: '#dae2fd', borderWidth: 1,
    borderColor: '#2d3449', borderRadius: 12, paddingHorizontal: 13,
    paddingVertical: 13, marginBottom: 12, fontSize: 14 },
  addButton: { backgroundColor: '#4edea3', borderRadius: 12,
    minHeight: 48, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  addText: { color: '#003824', fontSize: 14, fontWeight: '800' },
  feedback: { color: '#4edea3', fontSize: 13, lineHeight: 20, marginBottom: 12 },
  refreshButton: { backgroundColor: '#172e2a', borderRadius: 10, padding: 13,
    alignItems: 'center', marginBottom: 12 },
  refreshText: { color: '#4edea3', fontSize: 13, fontWeight: '700' },
  errorBox: { backgroundColor: '#3b202b', padding: 12, borderRadius: 12, marginBottom: 12 },
  error: { color: '#ffb4ab', fontSize: 13, lineHeight: 20, marginBottom: 12 },
  loading: { alignItems: 'center', marginVertical: 12 },
  empty: { color: '#bbcabf', textAlign: 'center', lineHeight: 21, marginVertical: 30 },
  footer: { color: '#a4afc1', fontSize: 11, textAlign: 'center', marginTop: 25 },
});
