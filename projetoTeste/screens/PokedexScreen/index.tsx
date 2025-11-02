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
import { styles } from './styles';

// Função para gerar dados mockados da Pokedex
const generateMockPokemon = (startId: number, count: number): PokedexPokemon[] => {
  const types = ['Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Fighting', 'Dark', 'Fairy'];
  const pokemonNames = [
    'Bulbasaur', 'Ivysaur', 'Venusaur', 'Charmander', 'Charmeleon', 'Charizard',
    'Squirtle', 'Wartortle', 'Blastoise', 'Caterpie', 'Metapod', 'Butterfree',
    'Weedle', 'Kakuna', 'Beedrill', 'Pidgey', 'Pidgeotto', 'Pidgeot',
    'Rattata', 'Raticate', 'Spearow', 'Fearow', 'Ekans', 'Arbok',
    'Pikachu', 'Raichu', 'Sandshrew', 'Sandslash', 'Nidoran', 'Nidorina'
  ];

  return Array.from({ length: count }, (_, index) => {
    const id = startId + index;
    const randomType1 = types[Math.floor(Math.random() * types.length)];
    const randomType2 = Math.random() > 0.7 ? types[Math.floor(Math.random() * types.length)] : undefined;
    const pokemonTypes = randomType2 ? [randomType1, randomType2] : [randomType1];
    
    return {
      id,
      name: pokemonNames[Math.floor(Math.random() * pokemonNames.length)] || `Pokemon${id}`,
      types: pokemonTypes,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      isFavorite: Math.random() > 0.8, // 20% chance de ser favorito inicialmente
      inParty: Math.random() > 0.9, // 10% chance de estar na party
    };
  });
};

const ITEMS_PER_PAGE = 150;

export const PokedexScreen = () => {
  const { height } = useWindowDimensions();
  const [pokemonList, setPokemonList] = useState<PokedexPokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentOffset, setCurrentOffset] = useState(0);

  const headerHeight = Math.max(60, Math.min(height * 0.12, 120));
  const contentHeight = height - headerHeight;

  // Carregar dados iniciais
  useEffect(() => {
    loadMorePokemon();
  }, []);

  const loadMorePokemon = useCallback(async () => {
    if (loadingMore) return;
    
    setLoadingMore(true);
    
    // Simula delay de API
    setTimeout(() => {
      const newPokemon = generateMockPokemon(currentOffset + 1, ITEMS_PER_PAGE);
      setPokemonList(prev => [...prev, ...newPokemon]);
      setCurrentOffset(prev => prev + ITEMS_PER_PAGE);
      setLoadingMore(false);
      setLoading(false);
    }, 1000);
  }, [currentOffset, loadingMore]);

  const handleMenuSelect = (option: string) => {
    Alert.alert('Menu Selecionado', `Você escolheu: ${option}`);
  };

  const handleSearchPress = () => {
    setSearchVisible(!searchVisible);
  };

  const handleAddToParty = (pokemon: PokedexPokemon) => {
    Alert.alert(
      'Adicionar à Party',
      `Deseja adicionar ${pokemon.name} à sua party?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Adicionar',
          onPress: () => {
            Alert.alert('Sucesso', `${pokemon.name} foi adicionado à sua party!`);
            // TODO: Implementar lógica real de adicionar à party
          },
        },
      ]
    );
  };

  const handleToggleFavorite = (pokemon: PokedexPokemon) => {
    // Atualiza o estado local
    setPokemonList(prev => 
      prev.map(p => 
        p.id === pokemon.id ? { ...p, isFavorite: pokemon.isFavorite } : p
      )
    );
    
    const action = pokemon.isFavorite ? 'adicionado aos' : 'removido dos';
    Alert.alert('Sucesso', `${pokemon.name} foi ${action} favoritos!`);
    
    // TODO: Implementar lógica real de favoritos no banco de dados
  };

  // Filtrar Pokémon baseado na busca
  const filteredPokemon = pokemonList.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pokemon.id.toString().includes(searchQuery)
  );

  const renderPokemonCard = useCallback(({ item }: { item: PokedexPokemon }) => (
    <PokedexCard
      pokemon={item}
      onAddToParty={handleAddToParty}
      onToggleFavorite={handleToggleFavorite}
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