import { useEffect, useMemo, useRef, useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ActivityIndicator, FlatList, Keyboard, Pressable, ScrollView,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import { TaskCard } from '../src/components/TaskCard';
import { StatusTabs } from '../src/components/StatusTabs';
import { fetchTasks } from '../src/services/taskService';
import type { Task, TaskStatus } from '../src/types/task';
import { filterTasks } from '../src/utils/taskFilters';
import { isValidTaskTitle } from '../src/utils/taskValidation';

export default function TaskManagerScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todas');
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const nextId = useRef(100);

  async function loadTasks(simulateFailure = false) {
    setLoading(true);
    setError(null);
    try {
      const records = await fetchTasks(simulateFailure);
      setTasks(records);
      setLoading(false);
    } catch (caught) {
      console.error('[taskService] No se cargaron las tareas', caught);
      setError('No pudimos cargar las tareas. Probá otra vez.');
    }
  }

  useEffect(() => {
    void loadTasks();
  }, []);

  const visibleTasks = useMemo(() => filterTasks(tasks, query, status), [tasks, status]);
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;

  function toggleTask(id: string) {
    const found = tasks.find((task) => task.id === id);
    if (found) {
      found.completed = !found.completed;
      setTasks(tasks);
    }
  }

  function addTask() {
    if (!isValidTaskTitle(newTitle)) {
      setFeedback('Ingresá un nombre válido para continuar.');
      return;
    }
    const task: Task = {
      id: `nuevo-${nextId.current++}`,
      title: newTitle,
      description: 'Tarea creada durante el taller de debugging.',
      priority: 'media',
      completed: false,
    };
    setTasks((previous) => [task, ...previous]);
    setNewTitle('');
    setFeedback('Tarea agregada.');
    Keyboard.dismiss();
  }

  function deleteTask(id: string) {
    setTasks((previous) => previous.filter((task) => task.id !== id));
    setFeedback('Tarea eliminada.');
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <FlatList
        data={loading ? [] : visibleTasks}
        keyExtractor={(_item, index) => String(index)}
        renderItem={({ item }) => (
          <TaskCard task={item} onToggle={() => toggleTask(item.id)} onDelete={() => deleteTask(item.id)} />
        )}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <>
            <View style={styles.eyebrowRow}>
              <Text style={styles.eyebrow}>LABORATORIO · REACT NATIVE</Text>
              <Pressable accessibilityRole="button" onPress={() => router.push('/guia')} style={styles.helpButton}>
                <Text style={styles.helpText}>Guía ↗</Text>
              </Pressable>
            </View>
            <Text style={styles.heading}>Gestor de tareas</Text>
            <Text style={styles.subtitle}>Proyecto de clase para diagnosticar errores reales.</Text>

            <View style={styles.statsRow}>
              <View style={[styles.stat, styles.statDark]}>
                <Text style={styles.statLabelLight}>TAREAS</Text>
                <Text style={styles.statNumberLight}>{total}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>COMPLETADAS</Text>
                <Text style={styles.statNumber}>{completed}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>PENDIENTES</Text>
                <Text style={styles.statNumber}>{total - completed}</Text>
              </View>
            </View>

            <Text style={styles.label}>NUEVA TAREA</Text>
            <View style={styles.addRow}>
              <TextInput
                testID="new-task-input"
                accessibilityLabel="Nombre de la nueva tarea"
                placeholder="Ej.: Revisar documentación"
                placeholderTextColor="#95A0B3"
                value={newTitle}
                onChangeText={setNewTitle}
                returnKeyType="done"
                style={styles.addInput}
              />
              <Pressable accessibilityRole="button" testID="add-task-button" style={styles.addButton} onPress={addTask}>
                <Text style={styles.addButtonText}>Agregar</Text>
              </Pressable>
            </View>
            {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

            <Text style={[styles.label, styles.sectionHeading]}>MIS TAREAS</Text>
            <TextInput
              testID="search-input"
              accessibilityLabel="Buscar tareas"
              placeholder="Buscar por nombre..."
              placeholderTextColor="#95A0B3"
              value={query}
              onChangeText={setQuery}
              style={styles.searchInput}
            />
            <StatusTabs current={status} onChange={setStatus} />

            <View style={styles.actions}>
              <Pressable accessibilityRole="button" style={styles.retryButton} onPress={() => void loadTasks()}>
                <Text style={styles.retryLabel}>↻ Recargar datos</Text>
              </Pressable>
              <Pressable accessibilityRole="button" testID="simulate-error-button" style={styles.simulateButton} onPress={() => void loadTasks(true)}>
                <Text style={styles.simulateLabel}>⚠ Simular error API</Text>
              </Pressable>
            </View>
            {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
            {loading ? (
              <View style={styles.loading}>
                <ActivityIndicator color="#147D73" size="large" />
                <Text style={styles.loadingLabel}>Consultando tareas…</Text>
              </View>
            ) : null}
          </>
        }
        ListEmptyComponent={!loading ? <Text style={styles.empty}>No hay tareas para mostrar con estos filtros.</Text> : null}
        ListFooterComponent={<Text style={styles.footer}>EDI · Desarrollo de Software Multiplataforma · Auditoría técnica</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F7FB' },
  listContainer: { paddingHorizontal: 19, paddingTop: 18, paddingBottom: 55, flexGrow: 1 },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { fontSize: 10, letterSpacing: 1.5, fontWeight: '900', color: '#168879' },
  helpButton: { backgroundColor: '#E5EFEC', paddingVertical: 8, paddingHorizontal: 11, borderRadius: 9 },
  helpText: { fontWeight: '800', color: '#187A71', fontSize: 12 },
  heading: { fontSize: 30, fontWeight: '900', color: '#172743', marginTop: 12 },
  subtitle: { color: '#75829A', fontSize: 13, marginTop: 7, marginBottom: 21, lineHeight: 20 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  stat: { backgroundColor: '#FFFFFF', padding: 12, borderRadius: 15, flex: 1, borderColor: '#E7EBF3', borderWidth: 1 },
  statDark: { backgroundColor: '#192C4D', borderColor: '#192C4D' },
  statLabel: { fontWeight: '800', color: '#8390A5', fontSize: 9, letterSpacing: 0.35 },
  statLabelLight: { fontWeight: '800', color: '#B3C4DD', fontSize: 9, letterSpacing: 0.35 },
  statNumber: { marginTop: 8, color: '#1B3150', fontWeight: '900', fontSize: 25 },
  statNumberLight: { marginTop: 8, color: '#FFFFFF', fontWeight: '900', fontSize: 25 },
  label: { fontSize: 11, color: '#384E6D', fontWeight: '900', letterSpacing: 1.1, marginBottom: 10 },
  sectionHeading: { marginTop: 12 },
  addRow: { flexDirection: 'row', gap: 8, marginBottom: 7 },
  addInput: { flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E0E6F0', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 11, color: '#1D3151', fontSize: 13, minWidth: 0 },
  addButton: { backgroundColor: '#147D73', paddingHorizontal: 13, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  addButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12 },
  feedback: { color: '#147D73', fontSize: 12, marginBottom: 8 },
  searchInput: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E0E6F0', borderRadius: 12, paddingHorizontal: 13, paddingVertical: 13, color: '#1D3151', fontSize: 13, marginBottom: 12 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', gap: 7, marginBottom: 13 },
  retryButton: { paddingVertical: 11, paddingHorizontal: 11, backgroundColor: '#E5F2EF', borderRadius: 10, flex: 1, alignItems: 'center' },
  retryLabel: { fontSize: 11, color: '#18776D', fontWeight: '800' },
  simulateButton: { paddingVertical: 11, paddingHorizontal: 10, backgroundColor: '#FDEBEB', borderRadius: 10, flex: 1, alignItems: 'center' },
  simulateLabel: { fontSize: 11, color: '#B84F4F', fontWeight: '800' },
  error: { color: '#A53D49', backgroundColor: '#FFF0F0', padding: 11, borderRadius: 10, fontWeight: '700', marginBottom: 10, fontSize: 12 },
  loading: { alignItems: 'center', paddingTop: 24, paddingBottom: 18, gap: 10 },
  loadingLabel: { color: '#75829A', fontSize: 12 },
  empty: { marginTop: 30, textAlign: 'center', color: '#8490A5', lineHeight: 20, fontSize: 13 },
  footer: { textAlign: 'center', color: '#A4AFC1', fontSize: 10, paddingTop: 30 },
});
