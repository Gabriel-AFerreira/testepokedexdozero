import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  useWindowDimensions,
  Alert,
  ScrollView 
} from 'react-native';
import { styles } from './styles';

// Interface para os dados do cadastro
export interface CadastroData {
  nome: string;
  idade: string;
  nickname: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

// Interface para as props do componente
interface CadastroFormProps {
  onCadastro?: (data: CadastroData) => void; // Callback quando usuário se cadastrar
  onVoltar?: () => void; // Callback para voltar para login
}

export const CadastroForm = ({
  onCadastro,
  onVoltar
}: CadastroFormProps) => {
  const [formData, setFormData] = useState<CadastroData>({
    nome: '',
    idade: '',
    nickname: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });
  
  const [isSenhaVisible, setIsSenhaVisible] = useState(false);
  const [isConfirmarSenhaVisible, setIsConfirmarSenhaVisible] = useState(false);
  const { width } = useWindowDimensions();

  // Função para atualizar um campo específico
  const handleInputChange = (field: keyof CadastroData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Função chamada quando o botão de cadastro é pressionado
  const handleCadastro = () => {
    // Validações
    if (!formData.nome.trim()) {
      Alert.alert('Erro', 'Por favor, digite seu nome completo');
      return;
    }

    if (!formData.idade.trim() || isNaN(Number(formData.idade)) || Number(formData.idade) < 1) {
      Alert.alert('Erro', 'Por favor, digite uma idade válida');
      return;
    }

    if (!formData.nickname.trim()) {
      Alert.alert('Erro', 'Por favor, digite seu nickname');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      Alert.alert('Erro', 'Por favor, digite um email válido');
      return;
    }

    if (!formData.senha.trim() || formData.senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    // Chama a função de cadastro
    if (onCadastro) {
      onCadastro(formData);
    }
  };

  // Calcula tamanhos responsivos
  const inputWidth = Math.min(width * 0.9, 400);

  return (
    <ScrollView 
      style={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        
        {/* TÍTULO DO FORMULÁRIO */}
        <Text style={styles.title}>Crie sua conta Poke</Text>
        
        {/* INPUT DE NOME COMPLETO */}
        <View style={[styles.inputContainer, { width: inputWidth }]}>
          <Text style={styles.label}>Nome Completo *</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome completo"
            placeholderTextColor="#999"
            value={formData.nome}
            onChangeText={(value) => handleInputChange('nome', value)}
            autoCapitalize="words"
          />
        </View>

        {/* INPUT DE IDADE */}
        <View style={[styles.inputContainer, { width: inputWidth }]}>
          <Text style={styles.label}>Idade *</Text>
          <TextInput
            style={styles.input}
            placeholder="Sua idade"
            placeholderTextColor="#999"
            value={formData.idade}
            onChangeText={(value) => handleInputChange('idade', value)}
            keyboardType="numeric"
            maxLength={3}
          />
        </View>

        {/* INPUT DE NICKNAME */}
        <View style={[styles.inputContainer, { width: inputWidth }]}>
          <Text style={styles.label}>Nickname *</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu nickname no jogo"
            placeholderTextColor="#999"
            value={formData.nickname}
            onChangeText={(value) => handleInputChange('nickname', value)}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* INPUT DE EMAIL */}
        <View style={[styles.inputContainer, { width: inputWidth }]}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            placeholder="seu@email.com"
            placeholderTextColor="#999"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* INPUT DE SENHA */}
        <View style={[styles.inputContainer, { width: inputWidth }]}>
          <Text style={styles.label}>Senha *</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#999"
              value={formData.senha}
              onChangeText={(value) => handleInputChange('senha', value)}
              secureTextEntry={!isSenhaVisible}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity 
              style={styles.eyeButton}
              onPress={() => setIsSenhaVisible(!isSenhaVisible)}
            >
              <Text style={styles.eyeButtonText}>
                {isSenhaVisible ? '👁️' : '👁️‍🗨️'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* INPUT DE CONFIRMAR SENHA */}
        <View style={[styles.inputContainer, { width: inputWidth }]}>
          <Text style={styles.label}>Confirmar Senha *</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Digite a senha novamente"
              placeholderTextColor="#999"
              value={formData.confirmarSenha}
              onChangeText={(value) => handleInputChange('confirmarSenha', value)}
              secureTextEntry={!isConfirmarSenhaVisible}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity 
              style={styles.eyeButton}
              onPress={() => setIsConfirmarSenhaVisible(!isConfirmarSenhaVisible)}
            >
              <Text style={styles.eyeButtonText}>
                {isConfirmarSenhaVisible ? '👁️' : '👁️‍🗨️'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* BOTÃO DE CADASTRAR */}
        <TouchableOpacity 
          style={[styles.cadastroButton, { width: inputWidth }]}
          onPress={handleCadastro}
        >
          <Text style={styles.cadastroButtonText}>Cadastrar</Text>
        </TouchableOpacity>

        {/* BOTÃO VOLTAR */}
        <TouchableOpacity 
          style={styles.voltarButton}
          onPress={onVoltar}
        >
          <Text style={styles.voltarButtonText}>← Voltar para Login</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
};