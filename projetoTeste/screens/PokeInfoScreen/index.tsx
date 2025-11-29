import React, { useState, useEffect } from 'react';
import { View, useWindowDimensions, Alert, ActivityIndicator } from 'react-native';
import { PokeHeader } from '../../components/PokeHeader';
import { PokemonInfo } from '../../components/PokemonInfo';
import { ActionButtons } from '../../components/ActionButtons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../utils/navigation';
import { fetchPokemonDetails, PokemonDetails } from '../../utils/api';
import { getFavoritePokemons, saveFavoritePokemon, getPartyPokemons, savePartyPokemon, initDatabase } from '../../utils/database';
import { styles } from './styles';

type PokeInfoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PokeInfo'>;
type PokeInfoScreenRouteProp = RouteProp<RootStackParamList, 'PokeInfo'>;

export const PokeInfoScreen = () => {
  const navigation = useNavigation<PokeInfoScreenNavigationProp>();
  const route = useRoute<PokeInfoScreenRouteProp>();
  const { height } = useWindowDimensions();
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  const headerHeight = Math.max(60, Math.min(height * 0.12, 120));
  const contentHeight = height - headerHeight;

  // Carregar dados do Pokémon da API e estado de favorito
  useEffect(() => {
    const loadPokemon = async () => {
      try {
        await initDatabase();
        const { pokemonId } = route.params;
        const pokemonData = await fetchPokemonDetails(pokemonId);
        setPokemon(pokemonData);

        // Verificar se o Pokémon está nos favoritos
        const favorites = await getFavoritePokemons();
        const isFav = favorites.some(fav => fav.id === pokemonId);
        setIsFavorite(isFav);

        setLoading(false);
      } catch (error) {
        console.error('Error loading Pokemon:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados do Pokémon');
        setLoading(false);
      }
    };

    loadPokemon();
  }, [route.params]);

  const handleHamburgerSelect = (option: string) => {
    switch (option) {
      case 'perfil':
        navigation.navigate('PokePerfil');
        break;
      case 'dex':
        navigation.navigate('Pokedex');
        break;
      case 'party':
        navigation.navigate('PokeParty');
        break;
      case 'logout':
        navigation.navigate('Login');
        break;
      default:
        break;
    }
  };

  const handleMenuSelect = (option: string) => {
    switch (option) {
      case 'perfil':
        navigation.navigate('PokePerfil');
        break;
      case 'dex':
        navigation.navigate('Pokedex');
        break;
      case 'party':
        navigation.navigate('PokeParty');
        break;
      case 'logout':
        navigation.navigate('Login');
        break;
      default:
        break;
    }
  };

  const handleAddToParty = async () => {
    if (!pokemon) return;

    try {
      const partyPokemon = {
        pokeid: pokemon.id,
        name: pokemon.name,
        image: pokemon.image,
        types: pokemon.types,
        weaknesses: pokemon.weaknesses,
      };

      await savePartyPokemon(partyPokemon);
      Alert.alert('Sucesso', `${pokemon.name} foi adicionado à sua party!`);
    } catch (error: any) {
      console.error('Error adding Pokemon to party:', error);
      Alert.alert('Erro', error.message || 'Não foi possível adicionar o Pokémon à party. Tente novamente.');
    }
  };

  const handleFavorite = async () => {
    if (!pokemon) return;

    try {
      const favoritePokemon = {
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.image,
        types: pokemon.types,
        weaknesses: pokemon.weaknesses,
      };

      await saveFavoritePokemon(favoritePokemon);

      // Reload favorites to get updated state
      const favorites = await getFavoritePokemons();
      const isFav = favorites.some(fav => fav.id === pokemon.id);
      setIsFavorite(isFav);

      Alert.alert(
        isFav ? 'Adicionado aos favoritos' : 'Removido dos favoritos',
        `${pokemon.name} ${isFav ? 'adicionado' : 'removido'} com sucesso!`
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Erro', 'Não foi possível atualizar os favoritos. Tente novamente.');
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

  return (
    <View style={styles.container}>
      <PokeHeader title="PokeInfo" onMenuSelect={handleMenuSelect} />

      <View style={[styles.content, { height: contentHeight - 80 }]}>
        {pokemon && <PokemonInfo pokemon={pokemon} />}
      </View>

      {pokemon && (
        <ActionButtons
          onAddToParty={handleAddToParty}
          onFavorite={handleFavorite}
          isFavorite={isFavorite}
        />
      )}
    </View>
  );
};