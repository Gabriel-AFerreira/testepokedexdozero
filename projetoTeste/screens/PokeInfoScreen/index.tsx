import React, { useState, useEffect } from 'react';
import { View, useWindowDimensions, Alert, ActivityIndicator } from 'react-native';
import { PokeHeader } from '../../components/PokeHeader';
import { PokemonInfo, PokemonData } from '../../components/PokemonInfo';
import { ActionButtons } from '../../components/ActionButtons';
import { styles } from './styles';

// Dados mockados para teste (depois substituiremos pela API real)
const mockPokemon: PokemonData = {
  id: 25,
  name: 'Pikachu',
  image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
  description: 'Quando se enfurece, descarrega imediatamente a energia armazenada nas bolsas das bochechas.',
  generation: 'Geração I',
  types: ['Elétrico'],
  weaknesses: ['Terra'],
};

export const PokeInfoScreen = () => {
  const { height } = useWindowDimensions();
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  const headerHeight = Math.max(60, Math.min(height * 0.12, 120));
  const contentHeight = height - headerHeight;

  // Simula carregamento da API
  useEffect(() => {
    const loadPokemon = async () => {
      try {
        // TODO: Implementar chamada real para a PokeAPI
        // const response = await fetch('https://pokeapi.co/api/v2/pokemon/25');
        // const data = await response.json();
        
        // Por enquanto usa dados mockados
        setTimeout(() => {
          setPokemon(mockPokemon);
          setLoading(false);
        }, 1000);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados do Pokémon');
        setLoading(false);
      }
    };

    loadPokemon();
  }, []);

  const handleMenuSelect = (option: string) => {
    Alert.alert('Menu Selecionado', `Você escolheu: ${option}`);
    // Aqui você implementará a navegação para as outras telas
  };

  const handleAddToParty = () => {
    Alert.alert('Sucesso', `${pokemon?.name} foi adicionado à sua party!`);
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      isFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos',
      `${pokemon?.name} ${isFavorite ? 'removido' : 'adicionado'} com sucesso!`
    );
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
      
      <View style={[styles.content, { height: contentHeight }]}>
        {pokemon && (
          <>
            <PokemonInfo pokemon={pokemon} />
            <ActionButtons
              onAddToParty={handleAddToParty}
              onFavorite={handleFavorite}
              isFavorite={isFavorite}
            />
          </>
        )}
      </View>
    </View>
  );
};