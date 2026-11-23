import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, LogOut, Mail, UserRound } from 'lucide-react-native';

import {
  getCurrentUser,
  logout,
  type AuthUser,
} from '../src/services/authService';

export default function ProfileScreen() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState('');

  async function loadProfile() {
    setLoading(true);
    setError('');

    try {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        router.replace('/login');
        return;
      }

      setUser(currentUser);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'No pudimos cargar el perfil.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProfile();
  }, []);

  async function handleLogout() {
    if (loggingOut || loading) return;

    setLoggingOut(true);
    setError('');

    try {
      await logout();
      setUser(null);
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

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver al gestor"
            disabled={loggingOut}
            onPress={() => router.replace('/tasks')}
            style={styles.backButton}
          >
            <ArrowLeft size={20} color="#dae2fd" />
          </Pressable>

          <Text style={styles.heading}>Mi perfil</Text>
          <View style={{ width: 44 }} />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#4edea3" />
        ) : null}

        {error ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
        ) : null}

        {!loading && !user ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => void loadProfile()}
            style={styles.backButton}
          >
            <Text style={styles.text}>Reintentar</Text>
          </Pressable>
        ) : null}

        {user ? (
          <View style={styles.card}>
            <View style={styles.avatar}>
              <UserRound size={30} color="#4edea3" />
            </View>

            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.subtitle}>
              Tu cuenta del gestor de tareas
            </Text>

            <View style={styles.field}>
              <View style={styles.fieldHeading}>
                <UserRound size={18} color="#4edea3" />
                <Text style={styles.label}>Nombre</Text>
              </View>
              <Text style={styles.text}>{user.name}</Text>
            </View>

            <View style={styles.field}>
              <View style={styles.fieldHeading}>
                <Mail size={18} color="#4edea3" />
                <Text style={styles.label}>Correo electrónico</Text>
              </View>
              <Text selectable style={styles.text}>
                {user.email}
              </Text>
            </View>
          </View>
        ) : null}

        <Pressable
          accessibilityRole="button"
          accessibilityState={{
            disabled: loggingOut || loading,
            busy: loggingOut,
          }}
          disabled={loggingOut || loading}
          onPress={() => void handleLogout()}
          style={[
            styles.logoutButton,
            { opacity: loggingOut || loading ? 0.5 : 1 },
          ]}
        >
          <LogOut size={18} color="#003824" />
          <Text style={styles.logoutText}>
            {loggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b1326' },
  container: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  backButton: {
    minWidth: 44,
    minHeight: 44,
    padding: 10,
    backgroundColor: '#171f33',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: { color: '#dae2fd', fontSize: 22, fontWeight: '700' },
  card: {
    backgroundColor: '#171f33',
    borderColor: '#2d3449',
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    backgroundColor: '#222a3d',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  name: { color: '#dae2fd', fontSize: 26, fontWeight: '700' },
  subtitle: { color: '#bbcabf', marginTop: 6, marginBottom: 24 },
  field: {
    backgroundColor: '#131b2e',
    borderColor: '#2d3449',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  fieldHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  label: { color: '#bbcabf', fontSize: 12, fontWeight: '700' },
  text: { color: '#dae2fd', fontSize: 15 },
  error: {
    color: '#ffdad6',
    backgroundColor: '#93000a',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  logoutButton: {
    backgroundColor: '#4edea3',
    borderRadius: 12,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  logoutText: { color: '#003824', fontWeight: '700' },
});