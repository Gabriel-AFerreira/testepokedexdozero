import React, { useState, useEffect } from 'react';
import {
  View,
  useWindowDimensions,
  Alert,
  ScrollView,
  ActivityIndicator,
  Text
} from 'react-native';
import { useRouter } from 'expo-router';
import { PokeHeader } from '../components/PokeHeader';
import { PartyPokemons } from '../components/PartyPokemons';
import { getCurrentUser, toggleParty } from '../services/auth';
import { getParty } from '../services/database';
import { navigateToPokedex, navigateToProfile } from '../utils/navigation';
import { styles } from './styles';

export default function PokePartyScreen() {
  const { height } = useWindowDimensions();
  const router = useRouter();
  const [party, setParty] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const headerHeight = Math.max(60, Math.min(height * 0.12, 120));
  const contentHeight = height - headerHeight;

  useEffect(() => {
    loadParty();
  }, []);

  const loadParty = async () => {
    try {
      const user = getCurrentUser();
      if (!user || !user.id) {
        Alert.alert('Erro', 'Usuário não autenticado');
        return;
      }

      const userParty = await getParty(user.id);
      setParty(userParty);
    } catch (error) {
      console.error('Error loading party:', error);
      Alert.alert('Erro', 'Não foi possível carregar a party');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuSelect = (option: string) => {
    console.log('handleMenuSelect called with option:', option);
    switch (option) {
      case 'dex':
        console.log('Navigating to pokedex');
        navigateToPokedex();
        break;
      case 'party':
        console.log('Already on party');
        break;
      case 'perfil':
        console.log('Navigating to profile');
        navigateToProfile();
        break;
      default:
        console.log('Unknown menu option:', option);
        break;
    }
  };

  const handleRemoveFromParty = async (pokemonId: number) => {
    try {
      const user = getCurrentUser();
      if (!user || !user.id) {
        Alert.alert('Erro', 'Usuário não autenticado');
        return;
      }

      // Find the pokemon to remove
      const pokemonToRemove = party.find(p => p.pokemonId === pokemonId);
      if (!pokemonToRemove) return;

      // Remove from party
      await toggleParty(user.id, {
        id: pokemonToRemove.pokemonId,
        name: pokemonToRemove.pokemonName,
        image: pokemonToRemove.pokemonImage,
        types: JSON.parse(pokemonToRemove.pokemonTypes)
      });

      // Update local state
      setParty(prevParty => prevParty.filter(pokemon => pokemon.pokemonId !== pokemonId));

      Alert.alert('Removido', `\`${pokemonToRemove.pokemonName} foi removido da sua party!\``);
    } catch (error) {
      console.error('Error removing from party:', error);
      Alert.alert('Erro', 'Não foi possível remover da party');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <PokeHeader title="PokeParty" onMenuSelect={handleMenuSelect} />
        <View style={[styles.content, { height: contentHeight }, styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#FF0000" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PokeHeader title="PokeParty" onMenuSelect={handleMenuSelect} />

      <View style={[styles.content, { height: contentHeight }]}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <PartyPokemons
            party={party.map(p => ({
              id: p.pokemonId,
              name: p.pokemonName,
              image: p.pokemonImage,
              types: JSON.parse(p.pokemonTypes),
              weaknesses: JSON.parse(p.pokemonWeaknesses)
            }))}
            onRemoveFromParty={handleRemoveFromParty}
          />
        </ScrollView>
      </View>
    </View>
  );
}
