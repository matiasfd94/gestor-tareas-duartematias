import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Pressable, StyleSheet, Text, View } from 'react-native';

const missions = [
  'Reproducir los errores antes de cambiar el código.',
  'Examinar las variables con DevTools, consola o breakpoints.',
  'Corregir al menos cuatro incidencias con cambios mínimos.',
  'Ejecutar pruebas automatizadas y explicar sus resultados.',
  'Documentar causa raíz, corrección y prueba de regresión.',
  'Crear un commit con los cambios y defender las decisiones.',
];

export default function GuiaScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← Volver al gestor</Text>
        </Pressable>
        <Text style={styles.eyebrow}>GUÍA DE TRABAJO</Text>
        <Text style={styles.title}>Investigar antes de corregir</Text>
        <Text style={styles.intro}>
          No se trata de encontrar el código correcto en Internet, sino de demostrar
          cómo se detecta una falla, cómo se explica y cómo se evita que reaparezca.
        </Text>
        <View style={styles.callout}>
          <Text style={styles.calloutTitle}>Misión de la clase</Text>
          <Text style={styles.calloutText}>Corregir al menos 4 fallos y entregar un informe técnico verificable.</Text>
        </View>
        {missions.map((mission, index) => (
          <View key={mission} style={styles.mission}>
            <Text style={styles.number}>{String(index + 1).padStart(2, '0')}</Text>
            <Text style={styles.missionText}>{mission}</Text>
          </View>
        ))}
        <Text style={styles.note}>Usá la plantilla INFORME_INCIDENTES.md del proyecto para registrar las evidencias.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F7FB' },
  content: { paddingHorizontal: 22, paddingBottom: 35, paddingTop: 14 },
  back: { paddingVertical: 10, marginBottom: 20 },
  backText: { color: '#137B70', fontWeight: '800' },
  eyebrow: { fontSize: 10, letterSpacing: 1.6, color: '#178B7B', fontWeight: '900' },
  title: { fontSize: 29, color: '#1B2D4A', fontWeight: '900', marginTop: 10, lineHeight: 35 },
  intro: { fontSize: 14, color: '#69788F', lineHeight: 23, marginTop: 13, marginBottom: 22 },
  callout: { backgroundColor: '#1A2E4C', borderRadius: 16, padding: 18, marginBottom: 20 },
  calloutTitle: { fontSize: 15, fontWeight: '900', color: '#FFFFFF' },
  calloutText: { marginTop: 7, color: '#DCE6F4', lineHeight: 20 },
  mission: { flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 13, gap: 14, marginBottom: 9 },
  number: { color: '#168A7A', fontWeight: '900' },
  missionText: { flex: 1, color: '#314864', lineHeight: 20, fontSize: 13 },
  note: { marginTop: 22, color: '#60718A', fontStyle: 'italic', lineHeight: 19 },
});
