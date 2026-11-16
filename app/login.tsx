import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { login } from '../src/services/authService';
import { Eye, EyeOff } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    if (loading) return;

    setError(null);

    if (!email.trim() || !password) {
      setError('Completá el correo y la contraseña.');
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      setPassword('');
      router.replace('/tasks');
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'No se pudo iniciar sesión.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            <Text style={styles.brand}>MACEDO</Text>
            <Text style={styles.title}>Bienvenido</Text>
            <Text style={styles.subtitle}>
              Accedé a tu cuenta para gestionar tus tareas.
            </Text>

            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              accessibilityLabel="Correo electrónico"
              placeholder="tucorreo@ejemplo.com"
              placeholderTextColor="#86948a"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              autoComplete="email"
            />
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={styles.passwordInput}
                accessibilityLabel="Contraseña"
                placeholder="Ingresá tu contraseña"
                placeholderTextColor="#86948a"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="current-password"
              />

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                }
                onPress={() => setShowPassword((previous) => !previous)}
                style={styles.eyeButton}
              >
                {showPassword ? (
                  <EyeOff size={22} color="#4edea3" />
                ) : (
                  <Eye size={22} color="#4edea3" />
                )}
              </Pressable>
            </View>

            {error && (
              <Text
                accessibilityRole="alert"
                style={{ color: '#ffb4ab', marginBottom: 16 }}
              >
                {error}
              </Text>
            )}

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: loading, busy: loading }}
              disabled={loading}
              onPress={handleLogin}
              style={[styles.loginButton, { opacity: loading ? 0.5 : 1  }]}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Ingresando...' : 'Iniciar sesión'}
              </Text>
            </Pressable>

            

            
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b1326' },
  container: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  form: { width: '100%', maxWidth: 440, alignSelf: 'center' },
  brand: {
    color: '#4edea3',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 40,
  },
  title: { color: '#dae2fd', fontSize: 32, fontWeight: '700' },
  subtitle: {
    color: '#bbcabf',
    fontSize: 15,
    lineHeight: 24,
    marginTop: 8,
    marginBottom: 32,
  },
  label: {
    color: '#bbcabf',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#131b2e',
    color: '#dae2fd',
    borderColor: '#2d3449',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 56,
    fontSize: 16,
    marginBottom: 20,
  },
  visibilityButton: {
    alignSelf: 'flex-end',
    paddingVertical: 10,
    marginBottom: 20,
  },
  link: { color: '#4edea3', fontSize: 14, textAlign: 'center' },
  loginButton: {
    backgroundColor: '#4edea3',
    opacity: 0.5,
    borderRadius: 12,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: { color: '#003824', fontSize: 16, fontWeight: '700' },

  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131b2e',
    borderColor: '#2d3449',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    minWidth: 0,
    minHeight: 56,
    paddingHorizontal: 16,
    color: '#dae2fd',
    fontSize: 16,
  },
  eyeButton: {
    width: 48,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
});