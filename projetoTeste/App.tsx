import React from 'react';
import { PokeInfoScreen } from './screens';

export default function App() {
  return <PokeInfoScreen />;
}
{/*import React from 'react';
import { CadastroScreen } from './screens';

// ✅ Substitua temporariamente a tela principal pelo Cadastro
export default function App() {
  return <CadastroScreen />;
}*/}

{/*import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, useWindowDimensions, Alert } from 'react-native';
import { Header } from './components'; //Importa todos os elementos que estão criados dentro da pasta 'componets' que eu criei.
import { LoginForm } from './components/LoginForm'; //Importa todos os elementos que estão criados dentro da pasta 'componets' que eu criei.
import { CadastroScreen } from './screens';

export default function App() {

  // Cálculos responsivos com limites mínimos e máximos
  const { height } = useWindowDimensions();
  const headerHeight = Math.max(60, Math.min(height * 0.12, 120));
  const contentHeight = height - headerHeight;

  // Função chamada quando o usuário tenta fazer login
  const handleLogin = (email: string, password: string) => {
    // Aqui você fará a integração com sua API/banco de dados
    console.log('Tentativa de login:', { email, password });
    
    // Exemplo de feedback
    Alert.alert(
      'Login realizado!',
      `Bem-vindo, ${email}!`,
      [{ text: 'OK' }]
    );
  };

  // Função para "Esqueci minha senha"
  const handleForgotPassword = () => {
    Alert.alert('Recuperar Senha', 'Funcionalidade em desenvolvimento');
  };

  // Função para "Criar conta"
  const handleSignUp = () => {
    Alert.alert('Criar Conta', 'Funcionalidade em desenvolvimento');
  };

  return (
    <View style={styles.container}>

    // HEADER REUTILIZÁVEL - Tela de Login
      <Header title="PokeLogin" />

      // CONTEÚDO COM FORMULÁRIO
        <View style={[styles.content,{ height: contentHeight }]}>
          <LoginForm 
          onLogin={handleLogin}
          onForgotPassword={handleForgotPassword}
          onSignUp={handleSignUp}
          />
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
});*/}
