import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  useWindowDimensions,
  Alert 
} from 'react-native';
import { styles } from './styles';

export interface PokedexPokemon {
  id: number;
  name: string;
  types: string[];
  image: string;
  isFavorite?: boolean;
  inParty?: boolean;
}

interface PokedexCardProps {
  pokemon: PokedexPokemon;
  onAddToParty: (pokemon: PokedexPokemon) => void;
  onToggleFavorite: (pokemon: PokedexPokemon) => void;
}

export const PokedexCard: React.FC<PokedexCardProps> = ({ 
  pokemon, 
  onAddToParty, 
  onToggleFavorite 
}) => {
  const { width } = useWindowDimensions();
  const [isFavorite, setIsFavorite] = useState(pokemon.isFavorite || false);

  const handleAddToParty = () => {
    onAddToParty(pokemon);
  };

  const handleToggleFavorite = () => {
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    onToggleFavorite({ ...pokemon, isFavorite: newFavoriteState });
  };

  const cardWidth = width - 40; // Largura total com margens

  return (
    <View style={[styles.card, { width: cardWidth }]}>
      {/* Número e Nome */}
      <View style={styles.header}>
        <Text style={styles.pokemonNumber}>#{pokemon.id.toString().padStart(3, '0')}</Text>
        <Text style={styles.pokemonName}>{pokemon.name}</Text>
      </View>

      {/* Tipos */}
      <View style={styles.typesContainer}>
        {pokemon.types.map((type, index) => (
          <View key={index} style={[styles.typeChip, { backgroundColor: getTypeColor(type) }]}>
            <Text style={styles.typeText}>{type}</Text>
          </View>
        ))}
      </View>

      {/* Botões de Ação */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.partyButton}
          onPress={handleAddToParty}
        >
          <Text style={styles.partyButtonText}>Add Party</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
          onPress={handleToggleFavorite}
        >
          <Text style={styles.favoriteButtonText}>
            {isFavorite ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Função para cores dos tipos (você pode expandir esta função)
const getTypeColor = (type: string): string => {
  const typeColors: { [key: string]: string } = {
    'Normal': '#A8A878',
    'Fire': '#F08030',
    'Water': '#6890F0',
    'Electric': '#F8D030',
    'Grass': '#78C850',
    'Ice': '#98D8D8',
    'Fighting': '#C03028',
    'Poison': '#A040A0',
    'Ground': '#E0C068',
    'Flying': '#A890F0',
    'Psychic': '#F85888',
    'Bug': '#A8B820',
    'Rock': '#B8A038',
    'Ghost': '#705898',
    'Dragon': '#7038F8',
    'Dark': '#705848',
    'Steel': '#B8B8D0',
    'Fairy': '#EE99AC',
  };
  
  return typeColors[type] || '#68A090'; // Cor padrão
};