import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { styles } from './styles';

// Define as props que o componente vai receber
interface HeaderProps {
  title: string;        // Texto que aparece no header
  backgroundColor?: string; // Cor de fundo (opcional, padrão vermelho)
  textColor?: string;   // Cor do texto (opcional, padrão branco)
}

// Componente Header reutilizável
export const Header: React.FC<HeaderProps> = ({ 
  title, 
  backgroundColor = '#FF0000', // Valor padrão se não for informado
  textColor = '#FFFFFF' 
}) => {
  const { width, height } = useWindowDimensions();
  
  // Altura do header: 12% da tela, mas entre 30px (mínimo) e 80px (máximo)
  const headerHeight = Math.max(35, Math.min(height * 0.12, 80));
  // Tamanho da fonte: 6% da LARGURA, mas entre 16px (mínimo) e 28px (máximo)
  // ⚠️ CORREÇÃO: Usar Math.min e Math.max corretamente
  const baseFontSize = width * 0.06; // 6% da largura
  const fontSize = Math.max(14, Math.min(baseFontSize, 28));
  // Isso significa: "Não menor que 14px, não maior que 28px"

  //old version
  // Calcula o tamanho da fonte responsivamente
  //const fontSize = Math.max(18, Math.min(width * 0.06, 32));
  
  return (
    <View style={[
      styles.header,
      { 
        backgroundColor, // Usa a cor passada ou a padrão
        width: width, // Ocupa 100% da largura
        height: headerHeight,
      }
    ]}>
      <Text style={[
        styles.headerText,
        { 
          color: textColor, // Usa a cor do texto passada ou a padrão
          fontSize: fontSize 
        }
      ]}>
        {title} {/* Renderiza o título dinamicamente */}
      </Text>
    </View>
  );
};