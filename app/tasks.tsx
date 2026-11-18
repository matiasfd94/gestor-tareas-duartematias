import { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ActivityIndicator, Alert, FlatList, Keyboard, Pressable, ScrollView,
  StyleSheet, Text, TextInput, View, Modal,
} from 'react-native';
import { TaskCard } from '../src/components/TaskCard';
import { StatusTabs } from '../src/components/StatusTabs';
import {fetchTasks, createTask, updateTaskCompleted, deleteTaskById, updateTask,} from '../src/services/taskService';
import type {Task, TaskStatus, TaskPriority,} from '../src/types/task';
import { filterTasks } from '../src/utils/taskFilters';
import { isValidTaskTitle } from '../src/utils/taskValidation';
import { logout, getCurrentUser } from '../src/services/authService';

export default function TaskManagerScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todas');
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState<TaskPriority>('media');
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [sessionVerified, setSessionVerified] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);

  async function loadTasks(simulateFailure = false) {
    setLoading(true);
    setError(null);

    try {
      const records = await fetchTasks(simulateFailure);
      setTasks(records);
    } catch (caught) {
      console.error('[taskService] No se cargaron las tareas', caught);
      setError('No pudimos cargar las tareas. Probá otra vez.');
    } finally {
      setLoading(false);
    }
  } 

  async function verifySession() {
    setCheckingSession(true);
    setSessionError(null);

    try {
      const user = await getCurrentUser();

      if (!user) {
        router.replace('/login');
        return;
      }

      setSessionVerified(true);
      await loadTasks();
    } catch (caught) {
      setSessionError(
        caught instanceof Error
          ? caught.message
          : 'No pudimos verificar la sesión.'
      );
    } finally {
      setCheckingSession(false);
    }
  }

  useEffect(() => {
    void verifySession();
  }, []);

  const visibleTasks = useMemo(() => filterTasks(tasks, query, status),[tasks, query, status]);
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;

  async function toggleTask(id: string) {
    if (updating || loading) return;

    const task = tasks.find((item) => item.id === id);
    if (!task) return;

    setUpdating(true);
    setError(null);
    setFeedback('');

    try {
      const updatedTask = await updateTaskCompleted(
        id,
        !task.completed
      );

      setTasks((previous) =>
        previous.map((item) =>
          item.id === id ? updatedTask : item
        )
      );

      setFeedback(
        updatedTask.completed
          ? 'Tarea marcada como completada.'
          : 'Tarea marcada como pendiente.'
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'No pudimos actualizar la tarea.'
      );
    } finally {
      setUpdating(false);
    }
  }

  async function addTask() {
    if (saving || loading) return;

    if (!isValidTaskTitle(newTitle)) {
      setFeedback('Ingresá un nombre válido para continuar.');
      return;
    }

    setSaving(true);
    setError(null);
    setFeedback('');

    try {
      const task = await createTask(newTitle);

      setTasks((previous) => [task, ...previous]);
      setNewTitle('');
      setFeedback('Tarea guardada correctamente.');
      Keyboard.dismiss();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'No pudimos guardar la tarea. Probá otra vez.'
      );
    } finally {
      setSaving(false);
    }
  }

  function deleteTask(id: string) {
    if (deleting || loading || updating || saving) return;

    const task = tasks.find((item) => item.id === id);
    if (!task) return;

    Alert.alert(
      'Eliminar tarea',
      `¿Querés eliminar "${task.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => void confirmDeleteTask(id),
        },
      ]
    );
  }

  async function confirmDeleteTask(id: string) {
    if (deleting || loading || updating || saving) return;

    setDeleting(true);
    setError(null);
    setFeedback('');

    try {
      await deleteTaskById(id);

      setTasks((previous) =>
        previous.filter((task) => task.id !== id)
      );

      setFeedback('Tarea eliminada correctamente.');
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'No pudimos eliminar la tarea.'
      );
    } finally {
      setDeleting(false);
    }
  }

  function startEditing(task: Task) {
    if (loading || saving || updating || deleting || savingEdit) return;

    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditPriority(task.priority);
    setEditError(null);
  }

  async function saveEditing() {
    if (!editingTask || savingEdit) return;

    if (!isValidTaskTitle(editTitle)) {
      setEditError('Ingresá un título válido.');
      return;
    }

    setSavingEdit(true);
    setEditError(null);

    try {
      const updatedTask = await updateTask(editingTask.id, {
        title: editTitle,
        description: editDescription,
        priority: editPriority,
      });

      setTasks((previous) =>
        previous.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );

      setEditingTask(null);
      setFeedback('Cambios guardados correctamente.');
      Keyboard.dismiss();
    } catch (caught) {
      setEditError(
        caught instanceof Error
          ? caught.message
          : 'No pudimos guardar los cambios.'
      );
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleLogout() {
    if (
      loggingOut || loading || saving ||
      updating || deleting || savingEdit
    ) return;

    setLoggingOut(true);
    setError(null);
    setFeedback('');

    try {
      await logout();
      setTasks([]);
      router.replace('/login');
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'No pudimos cerrar la sesión.'
      );
    } finally {
      setLoggingOut(false);
    }
  }

  if (!sessionVerified) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.listContainer}>
          <Text style={styles.heading}>Gestor de tareas</Text>

          {checkingSession ? (
            <View style={styles.loading}>
              <ActivityIndicator color="#147D73" size="large" />
              <Text style={styles.loadingLabel}>
                Verificando sesión...
              </Text>
            </View>
          ) : sessionError ? (
            <>
              <Text accessibilityRole="alert" style={styles.error}>
                {sessionError}
              </Text>

              <Pressable
                accessibilityRole="button"
                onPress={() => void verifySession()}
                style={styles.retryButton}
              >
                <Text style={styles.retryLabel}>Reintentar</Text>
              </Pressable>
            </>
          ) : (
            <Text style={styles.loadingLabel}>
              Volviendo al inicio de sesión...
            </Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <Modal
        visible={editingTask !== null}
        animationType="slide"
        onRequestClose={() => {
          if (!savingEdit) setEditingTask(null);
        }}
      >
        <SafeAreaView style={styles.screen}>
          <ScrollView
            contentContainerStyle={styles.listContainer}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.heading}>Editar tarea</Text>
            <Text style={styles.subtitle}>
              Modificá los datos y guardá los cambios.
            </Text>

            <Text style={styles.label}>TÍTULO</Text>
            <TextInput
              accessibilityLabel="Título de la tarea"
              value={editTitle}
              onChangeText={setEditTitle}
              maxLength={150}
              editable={!savingEdit}
              style={styles.searchInput}
            />

            <Text style={styles.label}>DESCRIPCIÓN</Text>
            <TextInput
              accessibilityLabel="Descripción de la tarea"
              value={editDescription}
              onChangeText={setEditDescription}
              maxLength={2000}
              editable={!savingEdit}
              multiline
              textAlignVertical="top"
              style={[styles.searchInput, { minHeight: 120 }]}
            />

            <Text style={styles.label}>PRIORIDAD</Text>
            <View style={styles.actions}>
              {(['baja', 'media', 'alta'] as const).map((priority) => (
                <Pressable
                  key={priority}
                  accessibilityRole="button"
                  accessibilityState={{
                    selected: editPriority === priority,
                    disabled: savingEdit,
                  }}
                  disabled={savingEdit}
                  onPress={() => setEditPriority(priority)}
                  style={[
                    styles.retryButton,
                    editPriority === priority && {
                      backgroundColor: '#147D73',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.retryLabel,
                      editPriority === priority && { color: '#FFFFFF' },
                    ]}
                  >
                    {priority.toUpperCase()}
                  </Text>
                </Pressable>
              ))}
            </View>

            {editError ? (
              <Text accessibilityRole="alert" style={styles.error}>
                {editError}
              </Text>
            ) : null}

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: savingEdit, busy: savingEdit }}
              disabled={savingEdit}
              onPress={() => void saveEditing()}
              style={[
                styles.addButton,
                { paddingVertical: 15, opacity: savingEdit ? 0.5 : 1 },
              ]}
            >
              <Text style={styles.addButtonText}>
                {savingEdit ? 'Guardando...' : 'Guardar cambios'}
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              disabled={savingEdit}
              onPress={() => setEditingTask(null)}
              style={[styles.retryButton, { marginTop: 12 }]}
            >
              <Text style={styles.retryLabel}>Cancelar</Text>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </Modal>
      <FlatList
        data={loading ? [] : visibleTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard task={item} onToggle={() => void toggleTask(item.id)} onDelete={() => deleteTask(item.id)} onEdit={() => startEditing(item)}/>
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
            <Pressable
              accessibilityRole="button"
              accessibilityState={{
                disabled: loggingOut || loading || saving ||
                  updating || deleting || savingEdit,
                busy: loggingOut,
              }}
              disabled={
                loggingOut || loading || saving ||
                updating || deleting || savingEdit
              }
              onPress={() => void handleLogout()}
              style={[
                styles.retryButton,
                { alignSelf: 'flex-end', marginBottom: 16 },
              ]}
            >
              <Text style={styles.retryLabel}>
                {loggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
              </Text>
            </Pressable>

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
                maxLength={150}
                editable={!saving}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: saving || loading, busy: saving }}
                testID="add-task-button"
                style={[styles.addButton, { opacity: saving || loading ? 0.5 : 1 }]}
                disabled={saving || loading}
                onPress={() => void addTask()}
              >
                <Text style={styles.addButtonText}>
                  {saving ? 'Guardando...' : 'Agregar'}
                </Text>
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
