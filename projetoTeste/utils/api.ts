// PokeAPI Base URL
const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

// Interfaces for PokeAPI responses
export interface PokeApiPokemonListItem {
  name: string;
  url: string;
}

export interface PokeApiPokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokeApiPokemonListItem[];
}

export interface PokeApiPokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokeApiPokemonSprites {
  front_default: string;
  other: {
    'official-artwork': {
      front_default: string;
    };
  };
}

export interface PokeApiPokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokeApiPokemon {
  id: number;
  name: string;
  sprites: PokeApiPokemonSprites;
  types: PokeApiPokemonType[];
  weight: number;
  height: number;
  stats: PokeApiPokemonStat[];
}

export interface PokeApiPokemonSpecies {
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
    };
    version: {
      name: string;
    };
  }>;
  generation: {
    name: string;
  };
  evolution_chain: {
    url: string;
  };
}

export interface PokeApiEvolutionChain {
  chain: {
    species: {
      name: string;
    };
    evolves_to: Array<{
      species: {
        name: string;
      };
      evolves_to: Array<{
        species: {
          name: string;
        };
      }>;
    }>;
  };
}

export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

// Our app's Pokemon interfaces
export interface PokemonBasic {
  id: number;
  name: string;
  types: string[];
  image: string;
}

export interface PokemonDetails extends PokemonBasic {
  description: string;
  generation: string;
  weaknesses: string[];
  weight: number;
  height: number;
  evolution: string[];
  involution: string[];
  stats: PokemonStats;
}

// Fetch list of Pokemon with pagination
export const fetchPokemonList = async (offset: number = 0, limit: number = 20): Promise<PokemonBasic[]> => {
  try {
    const response = await fetch(`${POKEAPI_BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: PokeApiPokemonListResponse = await response.json();

    // Get detailed info for each Pokemon
    const pokemonDetails = await Promise.all(
      data.results.map(async (pokemon) => {
        const pokemonResponse = await fetch(pokemon.url);
        if (!pokemonResponse.ok) {
          throw new Error(`Failed to fetch Pokemon details for ${pokemon.name}`);
        }
        const pokemonData: PokeApiPokemon = await pokemonResponse.json();

        return {
          id: pokemonData.id,
          name: pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1),
          types: pokemonData.types.map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)),
          image: pokemonData.sprites.other?.['official-artwork']?.front_default ||
                 pokemonData.sprites.front_default ||
                 '',
        };
      })
    );

    return pokemonDetails;
  } catch (error) {
    console.error('Error fetching Pokemon list:', error);
    throw error;
  }
};

// Fetch detailed Pokemon information
export const fetchPokemonDetails = async (id: number): Promise<PokemonDetails> => {
  try {
    // Fetch basic Pokemon data
    const pokemonResponse = await fetch(`${POKEAPI_BASE_URL}/pokemon/${id}`);
    if (!pokemonResponse.ok) {
      throw new Error(`HTTP error! status: ${pokemonResponse.status}`);
    }
    const pokemonData: PokeApiPokemon = await pokemonResponse.json();

    // Fetch species data for description and generation
    const speciesResponse = await fetch(`${POKEAPI_BASE_URL}/pokemon-species/${id}`);
    if (!speciesResponse.ok) {
      throw new Error(`Failed to fetch species data for Pokemon ${id}`);
    }
    const speciesData: PokeApiPokemonSpecies = await speciesResponse.json();

    // Get English flavor text
    const englishFlavorText = speciesData.flavor_text_entries.find(
      entry => entry.language.name === 'en'
    )?.flavor_text.replace(/\f/g, ' ') || 'No description available.';

    // Calculate weaknesses (simplified - in a real app you'd fetch type effectiveness)
    const weaknesses = calculateWeaknesses(pokemonData.types.map(t => t.type.name));

    // Fetch evolution chain
    const evolutionResponse = await fetch(speciesData.evolution_chain.url);
    if (!evolutionResponse.ok) {
      throw new Error(`Failed to fetch evolution chain`);
    }
    const evolutionData: PokeApiEvolutionChain = await evolutionResponse.json();

    // Extract evolution and involution data
    const { evolution, involution } = extractEvolutionData(evolutionData, pokemonData.name.toLowerCase());

    // Extract stats
    const stats: PokemonStats = {
      hp: pokemonData.stats.find(s => s.stat.name === 'hp')?.base_stat || 0,
      attack: pokemonData.stats.find(s => s.stat.name === 'attack')?.base_stat || 0,
      defense: pokemonData.stats.find(s => s.stat.name === 'defense')?.base_stat || 0,
      specialAttack: pokemonData.stats.find(s => s.stat.name === 'special-attack')?.base_stat || 0,
      specialDefense: pokemonData.stats.find(s => s.stat.name === 'special-defense')?.base_stat || 0,
      speed: pokemonData.stats.find(s => s.stat.name === 'speed')?.base_stat || 0,
    };

    return {
      id: pokemonData.id,
      name: pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1),
      types: pokemonData.types.map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)),
      image: pokemonData.sprites.other?.['official-artwork']?.front_default ||
             pokemonData.sprites.front_default ||
             '',
      description: englishFlavorText,
      generation: formatGeneration(speciesData.generation.name),
      weaknesses,
      weight: pokemonData.weight / 10, // Convert to kg
      height: pokemonData.height / 10, // Convert to meters
      evolution,
      involution,
      stats,
    };
  } catch (error) {
    console.error(`Error fetching Pokemon details for ID ${id}:`, error);
    throw error;
  }
};

// Helper function to calculate weaknesses (simplified version)
export const calculateWeaknesses = (types: string[]): string[] => {
  const typeWeaknesses: { [key: string]: string[] } = {
    normal: ['fighting'],
    fire: ['water', 'ground', 'rock'],
    water: ['electric', 'grass'],
    electric: ['ground'],
    grass: ['fire', 'ice', 'poison', 'flying', 'bug'],
    ice: ['fire', 'fighting', 'rock', 'steel'],
    fighting: ['flying', 'psychic', 'fairy'],
    poison: ['ground', 'psychic'],
    ground: ['water', 'grass', 'ice'],
    flying: ['electric', 'ice', 'rock'],
    psychic: ['bug', 'ghost', 'dark'],
    bug: ['fire', 'flying', 'rock'],
    rock: ['water', 'grass', 'fighting', 'ground', 'steel'],
    ghost: ['ghost', 'dark'],
    dragon: ['ice', 'dragon', 'fairy'],
    dark: ['fighting', 'bug', 'fairy'],
    steel: ['fire', 'fighting', 'ground'],
    fairy: ['poison', 'steel'],
  };

  const weaknesses = new Set<string>();
  types.forEach(type => {
    const typeWeakness = typeWeaknesses[type.toLowerCase()];
    if (typeWeakness) {
      typeWeakness.forEach(weakness => weaknesses.add(weakness.charAt(0).toUpperCase() + weakness.slice(1)));
    }
  });

  return Array.from(weaknesses);
};

// Helper function to extract evolution and involution data
const extractEvolutionData = (evolutionData: PokeApiEvolutionChain, currentPokemonName: string) => {
  const evolution: string[] = [];
  const involution: string[] = [];

  const chain = evolutionData.chain;

  // Check if current pokemon is the base form
  if (chain.species.name === currentPokemonName) {
    // This is the base form, so evolution is the next forms
    chain.evolves_to.forEach(evo => {
      evolution.push(evo.species.name.charAt(0).toUpperCase() + evo.species.name.slice(1));
      evo.evolves_to.forEach(finalEvo => {
        evolution.push(finalEvo.species.name.charAt(0).toUpperCase() + finalEvo.species.name.slice(1));
      });
    });
  } else {
    // Check if it's the middle evolution
    let isMiddle = false;
    chain.evolves_to.forEach(evo => {
      if (evo.species.name === currentPokemonName) {
        isMiddle = true;
        // Base form is involution
        involution.push(chain.species.name.charAt(0).toUpperCase() + chain.species.name.slice(1));
        // Next evolutions
        evo.evolves_to.forEach(finalEvo => {
          evolution.push(finalEvo.species.name.charAt(0).toUpperCase() + finalEvo.species.name.slice(1));
        });
      }
    });

    if (!isMiddle) {
      // Check if it's the final evolution
      chain.evolves_to.forEach(evo => {
        evo.evolves_to.forEach(finalEvo => {
          if (finalEvo.species.name === currentPokemonName) {
            // Base and middle forms are involution
            involution.push(chain.species.name.charAt(0).toUpperCase() + chain.species.name.slice(1));
            involution.push(evo.species.name.charAt(0).toUpperCase() + evo.species.name.slice(1));
          }
        });
      });
    }
  }

  return { evolution, involution };
};

// Helper function to format generation name
const formatGeneration = (generation: string): string => {
  const generationMap: { [key: string]: string } = {
    'generation-i': 'Geração I',
    'generation-ii': 'Geração II',
    'generation-iii': 'Geração III',
    'generation-iv': 'Geração IV',
    'generation-v': 'Geração V',
    'generation-vi': 'Geração VI',
    'generation-vii': 'Geração VII',
    'generation-viii': 'Geração VIII',
    'generation-ix': 'Geração IX',
  };

  return generationMap[generation] || generation;
};
