import React from 'react';
import { View, Text, Image, useWindowDimensions, ScrollView } from 'react-native';
import { styles } from './styles';

export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export interface PokemonData {
  id: number;
  name: string;
  image: string;
  description: string;
  generation: string;
  types: string[];
  weaknesses: string[];
  weight: number;
  height: number;
  evolution: string[];
  involution: string[];
  stats: PokemonStats;
}

interface PokemonInfoProps {
  pokemon: PokemonData;
}

export const PokemonInfo: React.FC<PokemonInfoProps> = ({ pokemon }) => {
  const { width } = useWindowDimensions();
  const imageSize = Math.min(width * 0.6, 300);

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* IMAGEM DO POKÉMON */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: pokemon.image }}
          style={[styles.pokemonImage, { width: imageSize, height: imageSize }]}
          resizeMode="contain"
        />
      </View>

      {/* NOME */}
      <View style={styles.infoSection}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>{pokemon.name}</Text>
      </View>

      {/* GERAÇÃO */}
      <View style={styles.infoSection}>
        <Text style={styles.label}>Geração</Text>
        <Text style={styles.value}>{pokemon.generation}</Text>
      </View>

      {/* TIPO */}
      <View style={styles.infoSection}>
        <Text style={styles.label}>Tipo</Text>
        <View style={styles.typesContainer}>
          {pokemon.types.map((type, index) => (
            <View key={index} style={styles.typeChip}>
              <Text style={styles.typeText}>{type}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* FRAQUEZAS */}
      <View style={styles.infoSection}>
        <Text style={styles.label}>Fraquezas</Text>
        <View style={styles.typesContainer}>
          {pokemon.weaknesses.map((weakness, index) => (
            <View key={index} style={[styles.typeChip, styles.weaknessChip]}>
              <Text style={styles.typeText}>{weakness}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* DESCRIÇÃO */}
      <View style={styles.infoSection}>
        <Text style={styles.label}>Descrição</Text>
        <Text style={styles.descriptionText}>{pokemon.description}</Text>
      </View>

      {/* PESO */}
      <View style={styles.infoSection}>
        <Text style={styles.label}>Peso</Text>
        <Text style={styles.value}>{pokemon.weight} kg</Text>
      </View>

      {/* ALTURA */}
      <View style={styles.infoSection}>
        <Text style={styles.label}>Altura</Text>
        <Text style={styles.value}>{pokemon.height} m</Text>
      </View>

      {/* EVOLUÇÃO */}
      <View style={styles.infoSection}>
        <Text style={styles.label}>Evolução</Text>
        {pokemon.evolution.length > 0 ? (
          <View style={styles.typesContainer}>
            {pokemon.evolution.map((evo, index) => (
              <View key={index} style={styles.evolutionChip}>
                <Text style={styles.evolutionText}>{evo}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.value}>Nenhuma evolução conhecida</Text>
        )}
      </View>

      {/* INVOLUÇÃO */}
      <View style={styles.infoSection}>
        <Text style={styles.label}>Involução</Text>
        {pokemon.involution.length > 0 ? (
          <View style={styles.typesContainer}>
            {pokemon.involution.map((invo, index) => (
              <View key={index} style={styles.evolutionChip}>
                <Text style={styles.evolutionText}>{invo}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.value}>Nenhuma involução conhecida</Text>
        )}
      </View>

      {/* ESTATÍSTICAS */}
      <View style={styles.infoSection}>
        <Text style={styles.label}>Estatísticas</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>HP</Text>
            <View style={styles.statBar}>
              <View style={[styles.statFill, { width: `${(pokemon.stats.hp / 255) * 100}%` }]} />
            </View>
            <Text style={styles.statValue}>{pokemon.stats.hp}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Ataque</Text>
            <View style={styles.statBar}>
              <View style={[styles.statFill, { width: `${(pokemon.stats.attack / 255) * 100}%` }]} />
            </View>
            <Text style={styles.statValue}>{pokemon.stats.attack}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Defesa</Text>
            <View style={styles.statBar}>
              <View style={[styles.statFill, { width: `${(pokemon.stats.defense / 255) * 100}%` }]} />
            </View>
            <Text style={styles.statValue}>{pokemon.stats.defense}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Ataque Especial</Text>
            <View style={styles.statBar}>
              <View style={[styles.statFill, { width: `${(pokemon.stats.specialAttack / 255) * 100}%` }]} />
            </View>
            <Text style={styles.statValue}>{pokemon.stats.specialAttack}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Defesa Especial</Text>
            <View style={styles.statBar}>
              <View style={[styles.statFill, { width: `${(pokemon.stats.specialDefense / 255) * 100}%` }]} />
            </View>
            <Text style={styles.statValue}>{pokemon.stats.specialDefense}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Velocidade</Text>
            <View style={styles.statBar}>
              <View style={[styles.statFill, { width: `${(pokemon.stats.speed / 255) * 100}%` }]} />
            </View>
            <Text style={styles.statValue}>{pokemon.stats.speed}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
