import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  useWindowDimensions,
  Alert,
  ScrollView
} from 'react-native';
import { PokeHeader } from '../../components/PokeHeader';
import { UserProfile, UserData } from '../../components/UserProfile';
import { FavoritePokemons } from '../../components/FavoritePokemons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../utils/navigation';
import { getFavoritePokemons, removeFavoritePokemon, FavoritePokemon, initDatabase } from '../../utils/database';
import { getCurrentUser, User, clearCurrentUser } from '../../utils/auth';
import { styles } from './styles';

type PokePerfilScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PokePerfil'>;



export const PokePerfilScreen = () => {
  const navigation = useNavigation<PokePerfilScreenNavigationProp>();
  const { height } = useWindowDimensions();
  const [userData, setUserData] = useState<UserData>({
    nickname: '',
    nome: '',
    idade: '',
    email: '',
    profileImage: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainer/1.png'
  });
  const [favorites, setFavorites] = useState<FavoritePokemon[]>([]);

  const headerHeight = Math.max(60, Math.min(height * 0.12, 120));
  const contentHeight = height - headerHeight;

  // Carregar dados do usuário ao montar o componente
  useEffect(() => {
    const loadData = async () => {
      await initDatabase();
      loadUserData();
    };
    loadData();
  }, []);

  // Reload favorites when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadUserData = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUserData({
          nickname: currentUser.nickname,
          nome: currentUser.nome,
          idade: currentUser.idade.toString(),
          email: currentUser.email,
          profileImage: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainer/1.png' // Default image
        });
      } else {
        // No user logged in, redirect to login
        Alert.alert('Erro', 'Usuário não logado.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
    }
  };

  const loadFavorites = async () => {
    try {
      const favoritePokemons = await getFavoritePokemons();
      setFavorites(favoritePokemons);
    } catch (error) {
      console.error('Error loading favorites:', error);
      Alert.alert('Erro', 'Não foi possível carregar os favoritos.');
    }
  };

  const handleMenuSelect = (option: string) => {
    switch (option) {
      case 'perfil':
        // Already on PokePerfil
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

  const handleImageSelected = (imageUri: string) => {
    setUserData(prev => ({
      ...prev,
      profileImage: imageUri
    }));
    Alert.alert('Sucesso', 'Foto de perfil atualizada!');
  };

  // ✅ NOVA FUNÇÃO: Remover dos favoritos
  const handleRemoveFavorite = async (pokemonId: number) => {
    try {
      await removeFavoritePokemon(pokemonId);
      setFavorites(prevFavorites =>
        prevFavorites.filter(pokemon => pokemon.id !== pokemonId)
      );

      const removedPokemon = favorites.find(p => p.id === pokemonId);
      if (removedPokemon) {
        Alert.alert('Removido', `${removedPokemon.name} foi removido dos favoritos!`);
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      Alert.alert('Erro', 'Não foi possível remover dos favoritos. Tente novamente.');
    }
  };

  // ✅ NOVA FUNÇÃO: Navegar para PokeInfo
  const handlePokemonPress = (pokemon: FavoritePokemon) => {
    navigation.navigate('PokeInfo', { pokemonId: pokemon.id });
  };

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
            favorites={favorites}
            onRemoveFavorite={handleRemoveFavorite}
            onPokemonPress={handlePokemonPress}
          />
        </ScrollView>
      </View>
    </View>
  );
};