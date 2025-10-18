import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

export default function App() {

  const { width, height } = useWindowDimensions(); // Hook que atualiza automaticamente quando a tela gira ou dimensões mudam
  
  // Cálculos responsivos com limites mínimos e máximos
  const headerHeight = Math.max(60, Math.min(height * 0.12, 120));
  const fontSize = Math.max(18, Math.min(width * 0.06, 32));
  const contentHeight = height - headerHeight;

  return (
    <View style={styles.container}>

      {/* HEADER VERMELHO RESPONSIVO COM LIMITES */}
      <View style={[styles.header,{width: width,height: headerHeight,}]}>
        <Text style={[styles.headerText,{fontSize: fontSize}]}>
          PokeLogin
        </Text>
      </View>

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
  header: {
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    paddingLeft: 20,
    elevation: 4, //Sombra ANDROID (profundidade)
    shadowColor: '#000', //Cor da sombra iOS
    shadowOffset: { width: 0, height: 2 }, //Sombra 2px para baixo
    shadowOpacity: 0.23, //23% de opacidade (sutil)
    shadowRadius: 2.62, //Desfoque da sombra
  },
  headerText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)', // Sombra no texto para mais legibilidade
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
