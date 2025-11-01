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
  name: string;
  image: string;
  types: string[];
  weaknesses: string[];
}

interface PartyPokemonsProps {
  party: PartyPokemon[];
  onRemoveFromParty?: (pokemonId: number) => void;
}

export const PartyPokemons: React.FC<PartyPokemonsProps> = ({ 
  party, 
  onRemoveFromParty 
}) => {
  const { width } = useWindowDimensions();
  const pokemonCardWidth = (width - 60) / 2; // 2 colunas com margens

  const handleRemoveFromParty = (pokemon: PartyPokemon) => {
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
            if (onRemoveFromParty) {
              onRemoveFromParty(pokemon.id);
            }
          },
        },
      ]
    );
  };

  if (party.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Sua Party está vazia</Text>
        <Text style={styles.emptyText}>Adicione Pokémon à sua party na tela PokeInfo!</Text>
        <Text style={styles.partyLimit}>Limite: 6 Pokémon</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Minha Party</Text>
        <Text style={styles.partyCount}>
          {party.length}/6 Pokémon
        </Text>
      </View>
      
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pokemonGrid}>
          {party.map((pokemon) => (
            <View key={pokemon.id} style={[styles.pokemonCard, { width: pokemonCardWidth }]}>
              
              {/* Botão de Remover da Party */}
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveFromParty(pokemon)}
              >
                <Text style={styles.removeButtonIcon}>🗑️</Text>
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
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};