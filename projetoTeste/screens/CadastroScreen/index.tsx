import React from 'react';
import { View, useWindowDimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, CadastroForm } from '../../components';
import { styles } from './styles';
import { CadastroData } from '../../components/CadastroForm';
import { saveUser } from '../../utils/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../utils/navigation';

type CadastroScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Cadastro'>;

interface CadastroScreenProps {
  navigation: CadastroScreenNavigationProp;
}

export const CadastroScreen: React.FC<CadastroScreenProps> = ({ navigation }) => {
  const { height } = useWindowDimensions();
  const headerHeight = Math.max(60, Math.min(height * 0.12, 120));
  const contentHeight = height - headerHeight;

  // Função chamada quando o usuário se cadastra
  const handleCadastro = async (data: CadastroData) => {
    try {
      await saveUser({
        nome: data.nome,
        idade: parseInt(data.idade, 10),
        nickname: data.nickname,
        email: data.email,
        senha: data.senha,
      });

      Alert.alert(
        'Cadastro realizado!',
        `Bem-vindo, ${data.nickname}! Sua conta foi criada com sucesso.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      const errorMessage = error.message || 'Falha ao cadastrar. Tente novamente.';
      Alert.alert('Erro', errorMessage);
    }
  };

  // Função para voltar para login
  const handleVoltar = () => {
    navigation.goBack();
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
