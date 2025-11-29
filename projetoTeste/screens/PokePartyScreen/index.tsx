import React, { useState, useEffect } from 'react';
import {
  View,
  useWindowDimensions,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { PokeHeader } from '../../components/PokeHeader';
import { PartyPokemons, PartyPokemon } from '../../components/PartyPokemons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../utils/navigation';
import { getPartyPokemons, removePartyPokemon, resetDatabase } from '../../utils/database';
import { styles } from './styles';

type PokePartyScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PokeParty'>;

export const PokePartyScreen = () => {
  const navigation = useNavigation<PokePartyScreenNavigationProp>();
  const { height } = useWindowDimensions();
  const [party, setParty] = useState<PartyPokemon[]>([]);
  const [loading, setLoading] = useState(true);

  const headerHeight = Math.max(60, Math.min(height * 0.12, 120));
  const contentHeight = height - headerHeight;

  const handleMenuSelect = (option: string) => {
    switch (option) {
      case 'perfil':
        navigation.navigate('PokePerfil');
        break;
      case 'dex':
        navigation.navigate('Pokedex');
        break;
      case 'party':
        // Already on PokeParty
        break;
      case 'logout':
        navigation.navigate('Login');
        break;
      default:
        break;
    }
  };

  // Função para remover Pokémon da party
  const handleRemoveFromParty = async (pokemonId: number) => {
    try {
      await removePartyPokemon(pokemonId);

      // Update local state
      setParty(prevParty =>
        prevParty.filter(pokemon => pokemon.id !== pokemonId)
      );

      const removedPokemon = party.find(p => p.id === pokemonId);
      if (removedPokemon) {
        Alert.alert('Removido', `${removedPokemon.name} foi removido da sua party!`);
      }
    } catch (error) {
      console.error('Error removing Pokemon from party:', error);
      Alert.alert('Erro', 'Não foi possível remover o Pokémon da party. Tente novamente.');
    }
  };

  // Carrega os dados da party do banco de dados
  useEffect(() => {
    const loadParty = async () => {
      try {
        const partyData = await getPartyPokemons();
        setParty(partyData);
      } catch (error) {
        console.error('Error loading party:', error);
        Alert.alert('Erro', 'Não foi possível carregar a party. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadParty();
  }, []);

  return (
    <View style={styles.container}>
      <PokeHeader title="PokeParty" onMenuSelect={handleMenuSelect} />

      <View style={[styles.content, { height: contentHeight }]}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF0000" />
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <PartyPokemons
              party={party}
              onRemoveFromParty={handleRemoveFromParty}
            />
          </ScrollView>
        )}
      </View>
    </View>
  );
};