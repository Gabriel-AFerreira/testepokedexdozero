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
import { UserProfile } from '../components/UserProfile';
import { FavoritePokemons } from '../components/FavoritePokemons';
import { getCurrentUser, toggleFavorite } from '../services/auth';
import { getFavorites, updateUser } from '../services/database';
import { HamburgerMenu } from '../components/HamburgerMenu';
import { navigateToPokedex, navigateToParty, navigateToProfile } from '../utils/navigation';
import { styles } from './styles';

export default function PokePerfilScreen() {
  const { height } = useWindowDimensions();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  const headerHeight = Math.max(60, Math.min(height * 0.12, 120));
  const contentHeight = height - headerHeight;

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = getCurrentUser();
      if (!user || !user.id) {
        Alert.alert('Erro', 'Usuário não autenticado');
        router.push('/');
        return;
      }

      setUserData(user);

      // Load user favorites
      const userFavorites = await getFavorites(user.id);
      setFavorites(userFavorites);
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do usuário');
    } finally {
      setLoading(false);
    }
  };



  const handleMenuSelect = (option: string) => {
    console.log('handleMenuSelect called with option:', option);
    switch (option) {
      case 'party':
        console.log('Navigating to party');
        navigateToParty();
        break;
      case 'perfil':
        console.log('Already on profile');
        break;
      case 'dex':
        console.log('Navigating to pokedex');
        navigateToPokedex();
        break;
      default:
        console.log('Unknown menu option:', option);
        break;
    }
  };

  const handleImageSelected = async (imageUri: string) => {
    try {
      const user = getCurrentUser();
      if (!user || !user.id) return;

      await updateUser(user.id, { profileImage: imageUri });
      setUserData((prev: any) => ({
        ...prev,
        profileImage: imageUri
      }));
      Alert.alert('Sucesso', 'Foto de perfil atualizada!');
    } catch (error) {
      console.error('Error updating profile image:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a foto de perfil');
    }
  };

  const handleRemoveFavorite = async (pokemonId: number) => {
    try {
      const user = getCurrentUser();
      if (!user || !user.id) {
        Alert.alert('Erro', 'Usuário não autenticado');
        return;
      }

      // Find the pokemon to remove
      const pokemonToRemove = favorites.find(p => p.pokemonId === pokemonId);
      if (!pokemonToRemove) return;

      // Remove from favorites
      await toggleFavorite(user.id, {
        id: pokemonToRemove.pokemonId,
        name: pokemonToRemove.pokemonName,
        image: pokemonToRemove.pokemonImage,
        types: JSON.parse(pokemonToRemove.pokemonTypes)
      });

      // Update local state immediately
      setFavorites(prevFavorites => prevFavorites.filter(pokemon => pokemon.pokemonId !== pokemonId));

      Alert.alert('Removido', `\`${pokemonToRemove.pokemonName} foi removido dos favoritos!\``);
    } catch (error) {
      console.error('Error removing favorite:', error);
      Alert.alert('Erro', 'Não foi possível remover dos favoritos');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <PokeHeader title="PokePerfil" onMenuSelect={handleMenuSelect} />
        <View style={[styles.content, { height: contentHeight }, styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#FF0000" />
        </View>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <PokeHeader title="PokePerfil" onMenuSelect={handleMenuSelect} />
        <View style={[styles.content, { height: contentHeight }, styles.loadingContainer]}>
          <Text>Usuário não encontrado</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PokeHeader title="PokePerfil" onMenuSelect={handleMenuSelect} />

      <View style={[styles.content, { height: contentHeight }]}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Seção de Perfil do Usuário */}
          <UserProfile
            user={userData}
            onImageSelected={handleImageSelected}
          />

          {/* Barra Divisória */}
          <View style={styles.divider} />

          {/* Seção de Favoritos */}
          <FavoritePokemons
            favorites={favorites.map(f => ({
              id: f.pokemonId,
              name: f.pokemonName,
              image: f.pokemonImage,
              types: JSON.parse(f.pokemonTypes),
              weaknesses: JSON.parse(f.pokemonWeaknesses)
            }))}
            onRemoveFavorite={handleRemoveFavorite}
          />
        </ScrollView>
      </View>
    </View>
  );
}
