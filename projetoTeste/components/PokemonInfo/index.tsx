import React from 'react';
import { View, Text, Image, useWindowDimensions, ScrollView } from 'react-native';
import { styles } from './styles';

export interface PokemonData {
  id: number;
  name: string;
  image: string;
  description: string;
  generation: string;
  types: string[];
  weaknesses: string[];
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

      {/* DESCRIÇÃO */}
      <View style={styles.infoSection}>
        <Text style={styles.label}>Descrição</Text>
        <Text style={styles.descriptionText}>{pokemon.description}</Text>
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
    </ScrollView>
  );
};