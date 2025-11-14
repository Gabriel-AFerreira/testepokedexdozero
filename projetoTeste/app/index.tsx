import React from 'react';
import { View, useWindowDimensions, Alert } from 'react-native';
import { Header } from '../components';
import { LoginForm } from '../components/LoginForm';
import { authService } from '../services/auth';
import { navigateToCadastro, navigateToProfile } from '../utils/navigation';

export default function LoginScreen() {
  const { height } = useWindowDimensions();
  const headerHeight = Math.max(60, Math.min(height * 0.12, 120));
  const contentHeight = height - headerHeight;

  const handleLogin = async (email: string, password: string) => {
    console.log('handleLogin called with email:', email);
    try {
      console.log('Calling authService.login...');
      const user = await authService.login(email, password);
      console.log('Login result:', user);
      if (user) {
        console.log('Login successful, showing success alert and navigating to profile');
        Alert.alert(
          'Login realizado!',
          `Bem-vindo, ${user.nickname}!`,
          [{ text: 'OK', onPress: () => {
            console.log('Alert OK pressed, navigating to profile');
            navigateToProfile();
          } }]
        );
        // Also navigate immediately as fallback
        setTimeout(() => {
          console.log('Fallback navigation to profile');
          navigateToProfile();
        }, 100);
      } else {
        console.log('Login failed: invalid credentials');
        Alert.alert('Erro', 'Email ou senha incorretos');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Erro', 'Ocorreu um erro durante o login');
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Recuperar Senha', 'Funcionalidade em desenvolvimento');
  };

  const handleSignUp = () => {
    navigateToCadastro();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title="PokeLogin" />
      <View style={{
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        height: contentHeight
      }}>
        <LoginForm
          onLogin={handleLogin}
          onForgotPassword={handleForgotPassword}
          onSignUp={handleSignUp}
        />
      </View>
    </View>
  );
}
