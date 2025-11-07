import React, { useState, useEffect } from 'react';
import { 
  View, 
  useWindowDimensions, 
  Alert,
  ScrollView 
} from 'react-native';
import { PokeHeader } from '../../components/PokeHeader';
import { UserProfile, UserData } from '../../components/UserProfile';
import { FavoritePokemons, FavoritePokemon } from '../../components/FavoritePokemons';
import { styles } from './styles';

// Dados mockados do usuário
const mockUserData: UserData = {
  nickname: 'PokeMestre',
  nome: 'Ash Ketchum',
  idade: '10',
  email: 'ash@pokemon.com',
  profileImage: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainer/1.png'
};

// Dados mockados dos favoritos
const mockFavorites: FavoritePokemon[] = [
  {
    id: 25,
    name: 'pikachu',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    types: ['Elétrico'],
    weaknesses: ['Terra'],
  },
  {
    id: 6,
    name: 'charizard',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',
    types: ['Fogo', 'Voador'],
    weaknesses: ['Água', 'Elétrico', 'Pedra'],
  },
  {
    id: 9,
    name: 'blastoise',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png',
    types: ['Água'],
    weaknesses: ['Elétrico', 'Grama'],
  },
  {
    id: 3,
    name: 'venusaur',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png',
    types: ['Grama', 'Venenoso'],
    weaknesses: ['Fogo', 'Psíquico', 'Voador', 'Gelo'],
  },
];

export const PokePerfilScreen = () => {
  const { height } = useWindowDimensions();
  const [userData, setUserData] = useState<UserData>(mockUserData);
  const [favorites, setFavorites] = useState<FavoritePokemon[]>(mockFavorites);

  const headerHeight = Math.max(60, Math.min(height * 0.12, 120));
  const contentHeight = height - headerHeight;

  const handleMenuSelect = (option: string) => {
    Alert.alert('Menu Selecionado', `Você escolheu: ${option}`);
  };

  const handleImageSelected = (imageUri: string) => {
    setUserData(prev => ({
      ...prev,
      profileImage: imageUri
    }));
    Alert.alert('Sucesso', 'Foto de perfil atualizada!');
  };

  // ✅ NOVA FUNÇÃO: Remover dos favoritos
  const handleRemoveFavorite = (pokemonId: number) => {
    setFavorites(prevFavorites => 
      prevFavorites.filter(pokemon => pokemon.id !== pokemonId)
    );
    
    const removedPokemon = favorites.find(p => p.id === pokemonId);
    if (removedPokemon) {
      Alert.alert('Removido', `${removedPokemon.name} foi removido dos favoritos!`);
    }
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
            onRemoveFavorite={handleRemoveFavorite} // ✅ PROP ADICIONADA
          />
        </ScrollView>
      </View>
    </View>
  );
};