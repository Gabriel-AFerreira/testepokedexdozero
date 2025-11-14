import React, { useState, useEffect } from 'react';
import { View, useWindowDimensions, Alert, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PokeHeader } from '../components/PokeHeader';
import { PokemonInfo } from '../components/PokemonInfo';
import { ActionButtons } from '../components/ActionButtons';
import { fetchPokemonDetails, fetchPokemonSpecies } from '../services/pokeapi';
import { toggleFavorite, toggleParty, getCurrentUser } from '../services/auth';
import { styles } from './styles';

export default function PokeInfoScreen() {
  const { height } = useWindowDimensions();
  const router = useRouter();
  const { pokemonId } = useLocalSearchParams<{ pokemonId: string }>();

  const [pokemon, setPokemon] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [inParty, setInParty] = useState(false);
  const [loading, setLoading] = useState(true);

  const headerHeight = Math.max(60, Math.min(height * 0.12, 120));
  const contentHeight = height - headerHeight;

  useEffect(() => {
    loadPokemonData();
  }, [pokemonId]);

  const loadPokemonData = async () => {
    if (!pokemonId) return;

    try {
      setLoading(true);
      const id = parseInt(pokemonId);

      // Fetch Pokemon details and species data
      const [pokemonData, speciesData] = await Promise.all([
        fetchPokemonDetails(id),
        fetchPokemonSpecies(id)
      ]);

      // Get user data for favorites/party status
      const user = getCurrentUser();
      if (user) {
        // TODO: Check if Pokemon is favorite/party for this user
        // For now, set to false
        setIsFavorite(false);
        setInParty(false);
      }

      setPokemon({
        id: pokemonData.id,
        name: pokemonData.name,
        image: pokemonData.sprites.other?.['official-artwork']?.front_default ||
               pokemonData.sprites.front_default,
        description: speciesData.flavor_text_entries.find(
          (entry: any) => entry.language.name === 'en'
        )?.flavor_text.replace(//g, ' ') || 'No description available.',
        generation: `\`Generation ${speciesData.generation.name.split('-')[1].toUpperCase()}\``,
        types: pokemonData.types.map((type: any) => type.type.name),
        weaknesses: [] // TODO: Calculate weaknesses based on types
      });
    } catch (error) {
      console.error('Error loading Pokemon:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do Pokémon');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuSelect = (option: string) => {
    switch (option) {
      case 'Pokedex':
        router.push('/pokedex');
        break;
      case 'Party':
        router.push('/pokeparty');
        break;
      case 'Perfil':
        router.push('/pokeperfil');
        break;
      case 'Logout':
        // TODO: Implement logout
        router.push('/');
        break;
      default:
        Alert.alert('Menu', `\`Opção: ${option}\``);
    }
  };

  const handleAddToParty = async () => {
    if (!pokemon) return;

    try {
      const user = getCurrentUser();
      if (!user) {
        Alert.alert('Erro', 'Usuário não autenticado');
        return;
      }

      await toggleParty(user.id, pokemon);
      setInParty(!inParty);
      Alert.alert('Sucesso', `\`${pokemon.name} ${inParty ? 'removido da' : 'adicionado à'} party!\``);
    } catch (error) {
      console.error('Error toggling party:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a party');
    }
  };

  const handleFavorite = async () => {
    if (!pokemon) return;

    try {
      const user = getCurrentUser();
      if (!user) {
        Alert.alert('Erro', 'Usuário não autenticado');
        return;
      }

      await toggleFavorite(user.id, pokemon);
      setIsFavorite(!isFavorite);
      Alert.alert(
        isFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos',
        `\`${pokemon.name} ${isFavorite ? 'removido' : 'adicionado'} com sucesso!\``
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Erro', 'Não foi possível atualizar os favoritos');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <PokeHeader title="PokeInfo" onMenuSelect={handleMenuSelect} />
        <View style={[styles.content, { height: contentHeight }, styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#FF0000" />
        </View>
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View style={styles.container}>
        <PokeHeader title="PokeInfo" onMenuSelect={handleMenuSelect} />
        <View style={[styles.content, { height: contentHeight }, styles.loadingContainer]}>
          <Text>Pokémon não encontrado</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PokeHeader title="PokeInfo" onMenuSelect={handleMenuSelect} />

      <View style={[styles.content, { height: contentHeight }]}>
        <PokemonInfo pokemon={pokemon} />
        <ActionButtons
          onAddToParty={handleAddToParty}
          onFavorite={handleFavorite}
          isFavorite={isFavorite}
          inParty={inParty}
        />
      </View>
    </View>
  );
}
