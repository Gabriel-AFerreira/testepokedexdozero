import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  useWindowDimensions, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import { styles } from './styles';

export interface FavoritePokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  weaknesses: string[];
}

interface FavoritePokemonsProps {
  favorites: FavoritePokemon[];
  onRemoveFavorite?: (pokemonId: number) => void;
  onPokemonPress?: (pokemon: FavoritePokemon) => void;
}

export const FavoritePokemons: React.FC<FavoritePokemonsProps> = ({
  favorites,
  onRemoveFavorite,
  onPokemonPress
}) => {
  const { width } = useWindowDimensions();
  const pokemonCardWidth = (width - 60) / 2; // 2 colunas com margens

  const handleRemoveFavorite = (pokemon: FavoritePokemon) => {
    Alert.alert(
      'Remover Favorito',
      `Tem certeza que deseja remover ${pokemon.name} dos favoritos?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            if (onRemoveFavorite) {
              onRemoveFavorite(pokemon.id);
            }
          },
        },
      ]
    );
  };

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhum Pokémon favoritado ainda</Text>
        <Text style={styles.emptySubtext}>Volte à PokeInfo para favoritar Pokémon!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Meus Favoritos</Text>
      
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pokemonGrid}>
          {favorites.map((pokemon) => (
            <TouchableOpacity
              key={pokemon.id}
              style={[styles.pokemonCard, { width: pokemonCardWidth }]}
              onPress={() => onPokemonPress?.(pokemon)}
            >

              {/* Botão de Remover Favorito */}
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveFavorite(pokemon)}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>

              {/* Imagem do Pokémon */}
              <Image
                source={{ uri: pokemon.image }}
                style={styles.pokemonImage}
                resizeMode="contain"
              />

              {/* Informações do Pokémon */}
              <View style={styles.pokemonInfo}>
                <Text style={styles.pokemonName}>{pokemon.name}</Text>

                {/* Tipos */}
                <View style={styles.typesContainer}>
                  <Text style={styles.smallLabel}>Tipo:</Text>
                  <View style={styles.chipsContainer}>
                    {pokemon.types.map((type, index) => (
                      <View key={index} style={[styles.chip, styles.typeChip]}>
                        <Text style={styles.chipText}>{type}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Fraquezas */}
                <View style={styles.typesContainer}>
                  <Text style={styles.smallLabel}>Fraquezas:</Text>
                  <View style={styles.chipsContainer}>
                    {pokemon.weaknesses.map((weakness, index) => (
                      <View key={index} style={[styles.chip, styles.weaknessChip]}>
                        <Text style={styles.chipText}>{weakness}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};