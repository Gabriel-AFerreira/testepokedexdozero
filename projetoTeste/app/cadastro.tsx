import React from 'react';
import { View, useWindowDimensions, Alert } from 'react-native';
import { Header, CadastroForm } from '../components';
import { authService } from '../services/auth';
import { navigateToScreen } from '../utils/navigation';
import { styles } from './styles';
import { CadastroData } from '../components/CadastroForm';

export default function CadastroScreen() {
  const { height } = useWindowDimensions();
  const headerHeight = Math.max(60, Math.min(height * 0.12, 120));
  const contentHeight = height - headerHeight;

  const handleCadastro = async (data: CadastroData) => {
    console.log('handleCadastro called with data:', data);
    try {
      console.log('Calling authService.register...');
      const user = await authService.register({
        nickname: data.nickname,
        email: data.email,
        senha: data.senha,
        nome: data.nome,
        idade: data.idade,
      });
      console.log('Registration successful, user:', user);

      console.log('Showing success alert and navigating to login screen');
      Alert.alert(
        'Cadastro realizado!',
        `Bem-vindo, ${user.nickname}! Sua conta foi criada com sucesso.`,
        [{ text: 'OK', onPress: () => {
          console.log('Alert OK pressed, navigating to login screen');
          navigateToScreen('');
        } }]
      );
      // Also navigate immediately as fallback
      setTimeout(() => {
        console.log('Fallback navigation to login screen');
        navigateToScreen('');
      }, 100);
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof Error && error.message === 'User already exists') {
        Alert.alert('Erro', 'Este email já está cadastrado');
      } else {
        Alert.alert('Erro', 'Ocorreu um erro durante o cadastro');
      }
    }
  };

  const handleVoltar = () => {
    navigateToScreen('');
  };

  return (
    <View style={styles.container}>
      <Header title="PokeCadastro" />
      <View style={[styles.content, { height: contentHeight }]}>
        <CadastroForm
          onCadastro={handleCadastro}
          onVoltar={handleVoltar}
        />
      </View>
    </View>
  );
}
