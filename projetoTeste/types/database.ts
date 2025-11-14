export interface User {
  id?: number;
  nickname: string;
  nome: string;
  idade: string;
  email: string;
  senha: string;
  profileImage?: string;
}

export interface FavoritePokemon {
  id?: number;
  userId: number;
  pokemonId: number;
  pokemonName: string;
  pokemonImage: string;
  pokemonTypes: string; // JSON stringified array
  pokemonWeaknesses: string; // JSON stringified array
}

export interface PartyPokemon {
  id?: number;
  userId: number;
  pokemonId: number;
  pokemonName: string;
  pokemonImage: string;
  pokemonTypes: string; // JSON stringified array
  pokemonWeaknesses: string; // JSON stringified array
}

export interface PokemonApiResponse {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other?: {
      'official-artwork'?: {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  species: {
    url: string;
  };
}

export interface PokemonSpeciesResponse {
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
    };
  }>;
  generation: {
    name: string;
  };
}

export interface PokemonListResponse {
  results: Array<{
    name: string;
    url: string;
  }>;
  next: string | null;
  previous: string | null;
}
