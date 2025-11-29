import React from 'react';
import { 
  View, 
  Text, 
  Image,
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
  onToggleFavorite: (pokemon: PokedexPokemon) => void;
  onPress?: (pokemon: PokedexPokemon) => void;
}

export const PokedexCard: React.FC<PokedexCardProps> = ({
  pokemon,
  onToggleFavorite,
  onPress
}) => {
  const { width } = useWindowDimensions();

  const handleToggleFavorite = () => {
    onToggleFavorite(pokemon);
  };

  const handlePress = () => {
    onPress?.(pokemon);
  };

  const handleNavigateToInfo = () => {
    onPress?.(pokemon);
  };

  const cardWidth = width - 40; // Largura total com margens

  return (
    <TouchableOpacity style={[styles.card, { width: cardWidth }]} onPress={handlePress}>
      {/* Cabeçalho com Número e Nome */}
      <View style={styles.header}>
        <Text style={styles.pokemonNumber}>#{pokemon.id.toString().padStart(3, '0')}</Text>
        <Text style={styles.pokemonName}>{pokemon.name}</Text>
      </View>

      {/* SPRITE DO POKÉMON */}
      <View style={styles.spriteContainer}>
        <Image
          source={{ uri: pokemon.image }}
          style={styles.pokemonSprite}
          resizeMode="contain"
        />
      </View>

      {/* Tipos */}
      <View style={styles.typesContainer}>
        {pokemon.types.map((type, index) => (
          <View key={index} style={[styles.typeChip, { backgroundColor: getTypeColor(type) }]}>
            <Text style={styles.typeText}>{type}</Text>
          </View>
        ))}
      </View>

      {/* BOTÕES DE AÇÃO */}
      <View style={styles.actionsContainer}>
        {/* BOTÃO FAVORITO NA ESQUERDA */}
        <TouchableOpacity
          style={[styles.favoriteButton, pokemon.isFavorite && styles.favoriteButtonActive]}
          onPress={handleToggleFavorite}
        >
          <Text style={styles.favoriteButtonText}>
            {pokemon.isFavorite ? '★' : '☆'}
          </Text>
        </TouchableOpacity>

        {/* BOTÃO INFO NA DIREITA */}
        <TouchableOpacity
          style={styles.partyButton}
          onPress={handleNavigateToInfo}
        >
          <Text style={styles.partyButtonText}>👁️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

// Função para cores dos tipos
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