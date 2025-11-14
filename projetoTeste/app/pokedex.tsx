import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  useWindowDimensions,
  Alert,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Text
} from 'react-native';
import { PokeHeader } from '../components/PokeHeader';
import { PokedexCard, PokedexPokemon } from '../components/PokedexCard';
import { authService } from '../services/auth';
import { fetchPokemonList, fetchPokemonDetails, searchPokemon } from '../services/pokeapi';
import { getUserFavorites, getUserParty, toggleFavorite, toggleParty } from '../services/database';
import { navigateToPokemonInfo, navigateToParty, navigateToProfile, navigateToScreen } from '../utils/navigation';
import { HamburgerMenu } from '../components/HamburgerMenu';
import { styles } from './pokedex/styles';

const ITEMS_PER_PAGE = 20;

export default function PokedexScreen() {
  const { height } = useWindowDimensions();
  const [pokemonList, setPokemonList] = useState<PokedexPokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentOffset, setCurrentOffset] = useState(0);
  const [userFavorites, setUserFavorites] = useState<Set<number>>(new Set());
  const [userParty, setUserParty] = useState<Set<number>>(new Set());


  const headerHeight = Math.max(60, Math.min(height * 0.12, 120));
  const contentHeight = height - headerHeight;

  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    if (currentUser) {
      loadUserData();
    }
  }, [currentUser]);



  useEffect(() => {
    loadMorePokemon();
  }, []);

  const loadUserData = async () => {
    if (!currentUser) return;

    try {
      const [favorites, party] = await Promise.all([
        getUserFavorites(currentUser.id!),
        getUserParty(currentUser.id!)
      ]);

      const newFavorites = new Set(favorites.map((f: any) => f.pokemonId));
      const newParty = new Set(party.map((p: any) => p.pokemonId));

      setUserFavorites(newFavorites);
      setUserParty(newParty);

      // Update existing pokemon list with new favorite/party states
      setPokemonList(prev => prev.map(p => ({
        ...p,
        isFavorite: newFavorites.has(p.id),
        inParty: newParty.has(p.id)
      })));
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadMorePokemon = useCallback(async () => {
    if (loadingMore) return;

    try {
      setLoadingMore(true);
      const response = await fetchPokemonList(currentOffset, ITEMS_PER_PAGE);

      const pokemonDetails = await Promise.all(
        response.results.map(async (pokemon) => {
          const id = parseInt(pokemon.url.split('/').filter(Boolean).pop()!);
          const details = await fetchPokemonDetails(id);

          return {
            id: details.id,
            name: details.name,
            types: details.types.map(t => t.type.name),
            image: details.sprites.other?.['official-artwork']?.front_default ||
                   details.sprites.front_default,
            isFavorite: userFavorites.has(details.id),
            inParty: userParty.has(details.id),
          };
        })
      );

      // Filter out duplicates based on pokemon ID
      setPokemonList(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newPokemon = pokemonDetails.filter(p => !existingIds.has(p.id));
        return [...prev, ...newPokemon].map(p => ({
          ...p,
          isFavorite: userFavorites.has(p.id),
          inParty: userParty.has(p.id)
        }));
      });

      setCurrentOffset(prev => prev + response.results.length);
    } catch (error) {
      console.error('Error loading Pokemon:', error);
      Alert.alert('Erro', 'Falha ao carregar Pokémon');
    } finally {
      setLoadingMore(false);
      setLoading(false);
    }
  }, [currentOffset, userFavorites, userParty]);

  const filteredPokemon = pokemonList.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pokemon.id.toString().includes(searchQuery)
  );

  const handleAddToParty = useCallback(async (pokemon: PokedexPokemon) => {
    if (!currentUser) {
      Alert.alert('Erro', 'Usuário não autenticado');
      return;
    }

    if (userParty.size >= 6 && !userParty.has(pokemon.id)) {
      Alert.alert('Erro', 'Você já tem 6 Pokémon na party');
      return;
    }

    try {
      await toggleParty(currentUser.id!, pokemon);
      const newParty = new Set(userParty);
      if (newParty.has(pokemon.id)) {
        newParty.delete(pokemon.id);
      } else {
        newParty.add(pokemon.id);
      }
      setUserParty(newParty);
      setPokemonList(prev => prev.map(p =>
        p.id === pokemon.id ? { ...p, inParty: newParty.has(p.id) } : p
      ));
    } catch (error) {
      console.error('Error toggling party:', error);
      Alert.alert('Erro', 'Falha ao atualizar party');
    }
  }, [currentUser, userParty]);

  const handleToggleFavorite = useCallback(async (pokemon: PokedexPokemon) => {
    if (!currentUser) {
      Alert.alert('Erro', 'Usuário não autenticado');
      return;
    }

    try {
      await toggleFavorite(currentUser.id!, pokemon);
      const newFavorites = new Set(userFavorites);
      if (newFavorites.has(pokemon.id)) {
        newFavorites.delete(pokemon.id);
      } else {
        newFavorites.add(pokemon.id);
      }
      setUserFavorites(newFavorites);
      setPokemonList(prev => prev.map(p =>
        p.id === pokemon.id ? { ...p, isFavorite: newFavorites.has(p.id) } : p
      ));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Erro', 'Falha ao atualizar favoritos');
    }
  }, [currentUser, userFavorites]);

  const handleMenuSelect = useCallback((option: string) => {
    console.log('handleMenuSelect called with option:', option);
    switch (option) {
      case 'party':
        console.log('Navigating to party');
        navigateToParty();
        break;
      case 'perfil':
        console.log('Navigating to profile');
        navigateToProfile();
        break;
      case 'dex':
        console.log('Already on pokedex');
        break;
      default:
        console.log('Unknown menu option:', option);
        break;
    }
  }, []);

  const handleSearchPress = useCallback(() => {
    setSearchVisible(!searchVisible);
    if (searchVisible) {
      setSearchQuery('');
    }
  }, [searchVisible]);

  const renderPokemonCard = useCallback(({ item }: { item: PokedexPokemon }) => (
    <PokedexCard
      pokemon={item}
      onAddToParty={handleAddToParty}
      onToggleFavorite={handleToggleFavorite}
      onPress={() => navigateToPokemonInfo(item.id)}
    />
  ), [handleAddToParty, handleToggleFavorite]);

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#FF0000" />
        <Text style={styles.footerText}>Carregando mais Pokémon...</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <PokeHeader
        title="Pokedex"
        onMenuSelect={handleMenuSelect}
        onSearchPress={handleSearchPress}
      />

      <View style={[styles.content, { height: contentHeight }]}>
        {searchVisible && (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar Pokémon por nome ou número..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSearchQuery('')}
              >
                <Text style={styles.clearButtonText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF0000" />
            <Text style={styles.loadingText}>Carregando Pokedex...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredPokemon}
            renderItem={renderPokemonCard}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            onEndReached={loadMorePokemon}
            onEndReachedThreshold={0.1}
            ListFooterComponent={renderFooter}
            contentContainerStyle={styles.listContent}
            initialNumToRender={20}
            maxToRenderPerBatch={50}
            windowSize={10}
          />
        )}
      </View>
    </View>
  );
}
