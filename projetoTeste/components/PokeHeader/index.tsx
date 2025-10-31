import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { HamburgerMenu } from '../HamburgerMenu';
import { styles } from './styles';

interface PokeHeaderProps {
  title: string;
  onMenuSelect: (option: string) => void;
}

export const PokeHeader: React.FC<PokeHeaderProps> = ({ title, onMenuSelect }) => {
  const { width, height } = useWindowDimensions();
  
  const headerHeight = Math.max(60, Math.min(height * 0.12, 120));
  const fontSize = Math.max(18, Math.min(width * 0.06, 28));

  return (
    <View style={[styles.header, { width, height: headerHeight }]}>
      <Text style={[styles.headerText, { fontSize }]}>
        {title}
      </Text>
      <HamburgerMenu onSelectOption={onMenuSelect} />
    </View>
  );
};