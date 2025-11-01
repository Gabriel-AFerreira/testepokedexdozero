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

export interface PartyPokemon {
  id: number;
  pokemon_id: number;
  name: string;
  image: string;
  types: string[];
  weaknesses: string[];
  added_at: string;
}

interface PartyPokemonListProps {
  pokemons: PartyPokemon[];
  onRemovePokemon?: (pokemonId: number) => void;
}

export const PartyPokemonList: React.FC<PartyPokemonListProps> = ({ 
  pokemons, 
  onRemovePokemon 
}) => {
  const { width } = useWindowDimensions();

  const handleRemovePokemon = (pokemon: PartyPokemon) => {
    Alert.alert(
      'Remover da Party',
      `Tem certeza que deseja remover ${pokemon.name} da sua party?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            if (onRemovePokemon) {
              onRemovePokemon(pokemon.pokemon_id);
            }
          },
        },
      ]
    );
  };

  if (pokemons.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Sua Party está vazia</Text>
        <Text style={styles.emptyText}>
          Volte à PokeInfo para adicionar Pokémon à sua party!
        </Text>
        <Text style={styles.emptySubtext}>
          Máximo de 6 Pokémon na party
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Minha Party</Text>
        <Text style={styles.partyCount}>
          {pokemons.length}/6 Pokémon
        </Text>
      </View>
      
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pokemonList}>
          {pokemons.map((pokemon) => (
            <View key={pokemon.pokemon_id} style={styles.pokemonCard}>
              
              {/* Botão de Remover */}
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemovePokemon(pokemon)}
              >
                <Text style={styles.removeIcon}>🗑️</Text>
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
                <View style={styles.typesSection}>
                  <Text style={styles.sectionLabel}>Tipo:</Text>
                  <View style={styles.chipsContainer}>
                    {pokemon.types.map((type, index) => (
                      <View key={index} style={[styles.chip, styles.typeChip]}>
                        <Text style={styles.chipText}>{type}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                
                {/* Fraquezas */}
                <View style={styles.typesSection}>
                  <Text style={styles.sectionLabel}>Fraquezas:</Text>
                  <View style={styles.chipsContainer}>
                    {pokemon.weaknesses.map((weakness, index) => (
                      <View key={index} style={[styles.chip, styles.weaknessChip]}>
                        <Text style={styles.chipText}>{weakness}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Data de Adição */}
                <Text style={styles.addedDate}>
                  Adicionado em: {new Date(pokemon.added_at).toLocaleDateString('pt-BR')}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};