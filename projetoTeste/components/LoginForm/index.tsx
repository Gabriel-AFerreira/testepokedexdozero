import React, { useState } from 'react';
import { View,Text,TextInput,TouchableOpacity,useWindowDimensions,Alert } from 'react-native';
import { styles } from './styles';

// Interface para as props do componente
interface LoginFormProps {
  onLogin?: (email: string, password: string) => void; // Callback quando usuário fizer login
  onForgotPassword?: () => void; // Callback para "esqueci senha"
  onSignUp?: () => void; // Callback para "criar conta"
}

  export const LoginForm: React.FC<LoginFormProps> = ({ 
  onLogin,
  onForgotPassword,
  onSignUp 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { width } = useWindowDimensions();

  // Função chamada quando o botão de login é pressionado
  const handleLogin = () => {
    console.log('LoginForm handleLogin called');
    // Validações básicas
    if (!email.trim()) {
      console.log('Login validation failed: email vazio');
      Alert.alert('Erro', 'Por favor, digite seu email');
      return;
    }

    if (!password.trim()) {
      console.log('Login validation failed: senha vazia');
      Alert.alert('Erro', 'Por favor, digite sua senha');
      return;
    }

    console.log('Login validations passed, calling onLogin');
    // Chama a função passada via props
    if (onLogin) {
      onLogin(email, password);
    }
  };

    // Calcula tamanhos responsivos
  const inputWidth = Math.min(width * 0.85, 400); // 85% da largura, máximo 400px
  const buttonWidth = Math.min(width * 0.85, 400);

  return (
    <View style={styles.container}>
      
      {/* TÍTULO DO FORMULÁRIO */}
      <Text style={styles.title}>Acesse sua conta</Text>
      
      {/* INPUT DE EMAIL */}
      <View style={[styles.inputContainer, { width: inputWidth }]}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="seu@email.com"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* INPUT DE SENHA */}
      <View style={[styles.inputContainer, { width: inputWidth }]}>
        <Text style={styles.label}>Senha</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Sua senha"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {/* BOTÃO PARA MOSTRAR/OCULTAR SENHA */}
          <TouchableOpacity 
            style={styles.eyeButton}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Text style={styles.eyeButtonText}>
              {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* BOTÃO DE LOGIN */}
      <TouchableOpacity 
        style={[styles.loginButton, { width: buttonWidth }]}
        onPress={handleLogin}
      >
        <Text style={styles.loginButtonText}>Entrar</Text>
      </TouchableOpacity>

      {/* LINKS ADICIONAIS */}
      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={onForgotPassword}>
          <Text style={styles.linkText}>Esqueci minha senha</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={onSignUp}>
          <Text style={styles.linkText}>Criar nova conta</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};