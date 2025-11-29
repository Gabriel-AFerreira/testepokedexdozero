import React, { useState } from 'react';
import { View, useWindowDimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components';
import { LoginForm } from '../../components/LoginForm';
import { styles } from './styles';
import { authenticateUser, saveCurrentUser } from '../../utils/auth';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { height } = useWindowDimensions();
  const headerHeight = Math.max(60, Math.min(height * 0.12, 120));
  const contentHeight = height - headerHeight;

  // Função chamada quando o usuário faz login
  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await authenticateUser(email, password);

      if (user) {
        // Save current user session
        await saveCurrentUser(user);

        Alert.alert(
          'Login realizado!',
          `Bem-vindo de volta, ${user.nickname}!`,
          [{ text: 'OK', onPress: () => navigation.navigate('Pokedex') }]
        );
      } else {
        Alert.alert('Erro', 'Email ou senha incorretos.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao fazer login. Tente novamente.');
    }
  };

  // Função para ir para cadastro
  const handleSignUp = () => {
    navigation.navigate('Cadastro');
  };

  // Função para "esqueci senha" (placeholder)
  const handleForgotPassword = () => {
    Alert.alert('Esqueci senha', 'Funcionalidade ainda não implementada.');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER COM TEXTO ESPECÍFICO */}
      <Header title="PokeLogin" />

      {/* CONTEÚDO COM FORMULÁRIO DE LOGIN */}
      <View style={[styles.content, { height: contentHeight }]}>
        <LoginForm
          onLogin={handleLogin}
          onForgotPassword={handleForgotPassword}
          onSignUp={handleSignUp}
        />
      </View>
    </SafeAreaView>
  );
};
