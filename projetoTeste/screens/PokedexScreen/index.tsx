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
import { PokeHeader } from '../../components/PokeHeader';
import { PokedexCard, PokedexPokemon } from '../../components/PokedexCard';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../utils/navigation';
import { fetchPokemonList, PokemonBasic, calculateWeaknesses } from '../../utils/api';
import { saveFavoritePokemon, getFavoritePokemons, FavoritePokemon, getPartyPokemons, savePartyPokemon, initDatabase } from '../../utils/database';
import { styles } from './styles';

// Convert API Pokemon to PokedexPokemon format
const convertToPokedexPokemon = (pokemon: PokemonBasic, favorites: FavoritePokemon[]): PokedexPokemon => ({
  id: pokemon.id,
  name: pokemon.name,
  types: pokemon.types,
  image: pokemon.image,
  isFavorite: favorites.some(fav => fav.id === pokemon.id),
  inParty: false, // Will be managed by local state/database later
});

const ITEMS_PER_PAGE = 20;

type PokedexScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Pokedex'>;

interface PokedexScreenProps {
  onLogout?: () => void;
}

export const PokedexScreen: React.FC<PokedexScreenProps> = ({ onLogout }) => {
  const navigation = useNavigation<PokedexScreenNavigationProp>();
  const { height } = useWindowDimensions();
  const [pokemonList, setPokemonList] = useState<PokedexPokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentOffset, setCurrentOffset] = useState(0);
  const [favorites, setFavorites] = useState<FavoritePokemon[]>([]);

  const headerHeight = Math.max(60, Math.min(height * 0.12, 120));
  const contentHeight = height - headerHeight;

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData();
  }, []);

  // Reload favorites when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  // Update pokemon list favorite status when favorites change
  useEffect(() => {
    setPokemonList(prev =>
      prev.map(p => ({
        ...p,
        isFavorite: favorites.some(fav => fav.id === p.id)
      }))
    );
  }, [favorites]);

  const loadInitialData = async () => {
    try {
      await initDatabase();
      const favoritePokemons = await getFavoritePokemons();
      setFavorites(favoritePokemons);
      await loadInitialPokemon(favoritePokemons);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const loadInitialPokemon = async (favoritePokemons: FavoritePokemon[]) => {
    setLoadingMore(true);

    try {
      const newPokemon = await fetchPokemonList(0, ITEMS_PER_PAGE);
      const pokedexPokemon = newPokemon.map(pokemon => convertToPokedexPokemon(pokemon, favoritePokemons));
      setPokemonList(pokedexPokemon);
      setCurrentOffset(ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error loading initial Pokemon:', error);
      Alert.alert('Erro', 'Não foi possível carregar os Pokémon. Tente novamente.');
    } finally {
      setLoadingMore(false);
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const favoritePokemons = await getFavoritePokemons();
      setFavorites(favoritePokemons);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const loadMorePokemon = useCallback(async () => {
    if (loadingMore) return;

    setLoadingMore(true);

    try {
      const newPokemon = await fetchPokemonList(currentOffset, ITEMS_PER_PAGE);
      const pokedexPokemon = newPokemon.map(pokemon => convertToPokedexPokemon(pokemon, favorites));
      setPokemonList(prev => [...prev, ...pokedexPokemon]);
      setCurrentOffset(prev => prev + ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error loading more Pokemon:', error);
      Alert.alert('Erro', 'Não foi possível carregar mais Pokémon. Tente novamente.');
    } finally {
      setLoadingMore(false);
      setLoading(false);
    }
  }, [currentOffset, loadingMore, favorites]);

  const handleMenuSelect = (option: string) => {
    switch (option) {
      case 'perfil':
        navigation.navigate('PokePerfil');
        break;
      case 'dex':
        // Already on Pokedex
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

  const handleSearchPress = () => {
    setSearchVisible(!searchVisible);
  };



  const handleToggleFavorite = async (pokemon: PokedexPokemon) => {
    try {
      const wasFavorited = favorites.some(fav => fav.id === pokemon.id);

      // Prepare favorite pokemon data
      const favoritePokemon: FavoritePokemon = {
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.image,
        types: pokemon.types,
        weaknesses: calculateWeaknesses(pokemon.types),
      };

      // Save to database (this will toggle favorite status)
      await saveFavoritePokemon(favoritePokemon);

      // Reload favorites to get updated state
      await loadFavorites();

      // Get the updated favorites list
      const updatedFavorites = await getFavoritePokemons();
      setFavorites(updatedFavorites);

      // Update pokemon list to reflect new favorite status
      setPokemonList(prev =>
        prev.map(p => ({
          ...p,
          isFavorite: updatedFavorites.some(fav => fav.id === p.id)
        }))
      );

      // Determine action based on new state
      const isNowFavorited = updatedFavorites.some(fav => fav.id === pokemon.id);
      const message = isNowFavorited ? `${pokemon.name} foi adicionado aos favoritos!` : `pokemon removido`;

      Alert.alert('Sucesso', message);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Erro', 'Não foi possível atualizar os favoritos. Tente novamente.');
    }
  };

  // Filtrar Pokémon baseado na busca
  const filteredPokemon = pokemonList.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pokemon.id.toString().includes(searchQuery)
  );

  const handlePokemonPress = (pokemon: PokedexPokemon) => {
    navigation.navigate('PokeInfo', { pokemonId: pokemon.id });
  };

  const renderPokemonCard = useCallback(({ item }: { item: PokedexPokemon }) => (
    <PokedexCard
      pokemon={item}
      onToggleFavorite={handleToggleFavorite}
      onPress={handlePokemonPress}
    />
  ), []);

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
        {/* Barra de Pesquisa */}
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

        {/* Lista de Pokémon */}
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
};