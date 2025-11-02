import React from 'react';
import { View, Text, useWindowDimensions, TouchableOpacity } from 'react-native';
import { HamburgerMenu } from '../HamburgerMenu';
import { styles } from './styles';

interface PokeHeaderProps {
  title: string;
  onMenuSelect: (option: string) => void;
  onSearchPress?: () => void; // ✅ Nova prop para a lupa
}

export const PokeHeader: React.FC<PokeHeaderProps> = ({ 
  title, 
  onMenuSelect,
  onSearchPress 
}) => {
  const { width, height } = useWindowDimensions();
  
  const headerHeight = Math.max(60, Math.min(height * 0.12, 120));
  const fontSize = Math.max(18, Math.min(width * 0.06, 28));

  return (
    <View style={[styles.header, { width, height: headerHeight }]}>
      <Text style={[styles.headerText, { fontSize }]}>
        {title}
      </Text>
      
      {/* ✅ Container para os botões do header */}
      <View style={styles.buttonsContainer}>
        {/* Botão Lupa */}
        {onSearchPress && (
          <TouchableOpacity
            style={styles.searchButton}
            onPress={onSearchPress}
          >
            <Text style={styles.searchButtonText}>🔍</Text>
          </TouchableOpacity>
        )}
        
        {/* Hamburger Menu */}
        <HamburgerMenu onSelectOption={onMenuSelect} />
      </View>
    </View>
  );
};