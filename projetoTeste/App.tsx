import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Header } from './components'; //Importa todos os elementos que estão criados dentro da pasta 'componets' que eu criei.

export default function App() {
  
  // Cálculos responsivos com limites mínimos e máximos
  const { height } = useWindowDimensions();
  const headerHeight = Math.max(60, Math.min(height * 0.12, 120));
  const contentHeight = height - headerHeight;

  return (
    <View style={styles.container}>

    {/* HEADER REUTILIZÁVEL - Tela de Login */}
      <Header title="PokeLogin" />

      {/* CONTEÚDO PRINCIPAL */}
      <View style={[styles.content,{ height: contentHeight }]}>
        <Text style={styles.welcomeText}>
          Bem-vindo ao PokeLogin!
        </Text>
        <StatusBar style="auto" />
      </View>
    </View>
  );
}

// Os styles permanecem os mesmos...
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa TODA a tela disponível
    backgroundColor: '#fff',
  },
  content: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
  },
});
