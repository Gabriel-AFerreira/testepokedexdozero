import { PokemonApiResponse, PokemonSpeciesResponse, PokemonListResponse } from '../types/database';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const fetchPokemonList = async (offset: number = 0, limit: number = 151): Promise<PokemonListResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Pokemon list:', error);
    throw error;
  }
};

export const fetchPokemonDetails = async (id: number): Promise<PokemonApiResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching Pokemon details for ID ${id}:`, error);
    throw error;
  }
};

export const fetchPokemonSpecies = async (id: number): Promise<PokemonSpeciesResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon-species/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching Pokemon species for ID ${id}:`, error);
    throw error;
  }
};

export const searchPokemon = async (query: string): Promise<PokemonApiResponse | null> => {
  try {
    // Try to search by ID first
    const id = parseInt(query);
    if (!isNaN(id)) {
      return await fetchPokemonDetails(id);
    }

    // Search by name
    const response = await fetch(`${BASE_URL}/pokemon/${query.toLowerCase()}`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Error searching Pokemon with query "${query}":`, error);
    return null;
  }
};

// Helper function to get Pokemon weaknesses based on types
export const getPokemonWeaknesses = (types: string[]): string[] => {
  const typeWeaknesses: { [key: string]: string[] } = {
    'normal': ['fighting'],
    'fire': ['water', 'ground', 'rock'],
    'water': ['electric', 'grass'],
    'electric': ['ground'],
    'grass': ['fire', 'ice', 'poison', 'flying', 'bug'],
    'ice': ['fire', 'fighting', 'rock', 'steel'],
    'fighting': ['flying', 'psychic', 'fairy'],
    'poison': ['ground', 'psychic'],
    'ground': ['water', 'grass', 'ice'],
    'flying': ['electric', 'ice', 'rock'],
    'psychic': ['bug', 'ghost', 'dark'],
    'bug': ['fire', 'flying', 'rock'],
    'rock': ['water', 'grass', 'fighting', 'ground', 'steel'],
    'ghost': ['ghost', 'dark'],
    'dragon': ['ice', 'dragon', 'fairy'],
    'dark': ['fighting', 'bug', 'fairy'],
    'steel': ['fire', 'fighting', 'ground'],
    'fairy': ['poison', 'steel']
  };

  const weaknesses = new Set<string>();
  types.forEach(type => {
    const typeWeakness = typeWeaknesses[type.toLowerCase()];
    if (typeWeakness) {
      typeWeakness.forEach(weakness => weaknesses.add(weakness));
    }
  });

  return Array.from(weaknesses);
};
