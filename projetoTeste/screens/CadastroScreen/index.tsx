import React from 'react';
import { View, useWindowDimensions, Alert } from 'react-native';
import { Header, CadastroForm } from '../../components';
import { styles } from './styles';
import { CadastroData } from '../../components/CadastroForm';

export const CadastroScreen = () => {
  const { height } = useWindowDimensions();
  const headerHeight = Math.max(60, Math.min(height * 0.12, 120));
  const contentHeight = height - headerHeight;

  // Função chamada quando o usuário se cadastra
  const handleCadastro = (data: CadastroData) => {
    console.log('Dados do cadastro:', data);
    
    // Aqui você integrará com sua API/banco de dados
    Alert.alert(
      'Cadastro realizado!',
      `Bem-vindo, ${data.nickname}! Sua conta foi criada com sucesso.`,
      [{ text: 'OK' }]
    );
    
    // Futuramente: navegar para a tela de login ou home
  };

  // Função para voltar para login
  const handleVoltar = () => {
    console.log('Voltar para login');
    // Futuramente: navigation.goBack() ou navigation.navigate('Login')
  };

  return (
    <View style={styles.container}>
      {/* HEADER COM TEXTO ESPECÍFICO */}
      <Header title="PokeCadastro" />
      
      {/* CONTEÚDO COM FORMULÁRIO DE CADASTRO */}
      <View style={[styles.content, { height: contentHeight }]}>
        <CadastroForm 
          onCadastro={handleCadastro}
          onVoltar={handleVoltar}
        />
      </View>
    </View>
  );
};