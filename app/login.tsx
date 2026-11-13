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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
            <TextInput
              style={styles.input}
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
              onPress={() => setShowPassword((previous) => !previous)}
              style={styles.visibilityButton}
            >
              <Text style={styles.link}>
                {showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: true }}
              disabled
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>Iniciar sesión</Text>
            </Pressable>

            <Text style={styles.notice}>
              Inicio de sesión pendiente de conexión con el backend.
            </Text>

            {__DEV__ && (
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push('/tasks')}
                style={styles.developmentButton}
              >
                <Text style={styles.link}>
                  Abrir gestor para pruebas de desarrollo
                </Text>
              </Pressable>
            )}
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
  notice: {
    color: '#bbcabf',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 16,
  },
  developmentButton: {
    paddingVertical: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#2d3449',
    borderRadius: 12,
  },
});