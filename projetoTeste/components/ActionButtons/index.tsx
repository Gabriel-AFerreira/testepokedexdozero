import React from 'react';
import { View, TouchableOpacity, Text, useWindowDimensions } from 'react-native';
import { styles } from './styles';

interface ActionButtonsProps {
  onAddToParty: () => void;
  onFavorite: () => void;
  isFavorite?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onAddToParty,
  onFavorite,
  isFavorite = false,
}) => {
  const { width } = useWindowDimensions();
  const buttonWidth = Math.min(width * 0.9, 400) / 2 - 10;

  return (
    <View style={[styles.container, { width: width * 0.9 }]}>
      <TouchableOpacity
        style={[styles.button, styles.partyButton, { width: buttonWidth }]}
        onPress={onAddToParty}
      >
        <Text style={styles.buttonText}>Adicionar a Party</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          styles.favoriteButton,
          { width: buttonWidth },
          isFavorite && styles.favoriteButtonActive
        ]}
        onPress={onFavorite}
      >
        <Text style={styles.buttonText}>
          {isFavorite ? '★ Favoritado' : '☆ Favoritar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};