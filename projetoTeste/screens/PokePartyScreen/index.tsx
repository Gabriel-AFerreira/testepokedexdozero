import React, { useState, useEffect } from 'react';
import { 
  View, 
  useWindowDimensions, 
  Alert,
  ScrollView 
} from 'react-native';
import { PokeHeader } from '../../components/PokeHeader';
import { PartyPokemons, PartyPokemon } from '../../components/PartyPokemons';
import { styles } from './styles';

// Dados mockados da party
const mockParty: PartyPokemon[] = [
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
  {
    id: 150,
    name: 'mewtwo',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png',
    types: ['Psíquico'],
    weaknesses: ['Fantasma', 'Sombrio', 'Inseto'],
  },
  {
    id: 94,
    name: 'gengar',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png',
    types: ['Fantasma', 'Venenoso'],
    weaknesses: ['Fantasma', 'Sombrio', 'Psíquico', 'Terrestre'],
  },
];

export const PokePartyScreen = () => {
  const { height } = useWindowDimensions();
  const [party, setParty] = useState<PartyPokemon[]>(mockParty);

  const headerHeight = Math.max(60, Math.min(height * 0.12, 120));
  const contentHeight = height - headerHeight;

  const handleMenuSelect = (option: string) => {
    Alert.alert('Menu Selecionado', `Você escolheu: ${option}`);
    // Aqui você implementará a navegação para as outras telas
  };

  // Função para remover Pokémon da party
  const handleRemoveFromParty = (pokemonId: number) => {
    setParty(prevParty => 
      prevParty.filter(pokemon => pokemon.id !== pokemonId)
    );
    
    const removedPokemon = party.find(p => p.id === pokemonId);
    if (removedPokemon) {
      Alert.alert('Removido', `${removedPokemon.name} foi removido da sua party!`);
    }
  };

  // Simula carregamento dos dados da party do banco de dados
  useEffect(() => {
    // TODO: Implementar busca dos dados reais da party do usuário
  }, []);

  return (
    <View style={styles.container}>
      <PokeHeader title="PokeParty" onMenuSelect={handleMenuSelect} />
      
      <View style={[styles.content, { height: contentHeight }]}>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <PartyPokemons 
            party={party}
            onRemoveFromParty={handleRemoveFromParty}
          />
        </ScrollView>
      </View>
    </View>
  );
};