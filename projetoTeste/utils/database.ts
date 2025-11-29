import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interface for stored user data
export interface StoredUser {
  id?: number;
  nome: string;
  idade: number;
  nickname: string;
  email: string;
  senha_hash: string;
  created_at?: string;
}

// Interface for favorite Pokemon
export interface FavoritePokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  weaknesses: string[];
}

// Interface for party Pokemon
export interface PartyPokemon {
  id?: number; // position 1-6 for party position
  pokeid: number; // Pokemon ID (foreign key)
  name: string;
  image: string;
  types: string[];
  weaknesses: string[];
}

// Platform-specific database handling
let db: any = null;
if (Platform.OS !== 'web') {
  db = SQLite.openDatabaseSync('pokedex.db');
}

// Initialize database tables (only for native platforms)
export const initDatabase = async () => {
  if (Platform.OS === 'web') {
    // No initialization needed for web
    console.log('Using AsyncStorage for web platform');
    return;
  }

  try {
    // Create users table
    await db.runAsync(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL, idade INTEGER NOT NULL, nickname TEXT NOT NULL UNIQUE, email TEXT NOT NULL UNIQUE, senha_hash TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);

    // Create favorites table
    await db.runAsync(`CREATE TABLE IF NOT EXISTS favorites (id INTEGER PRIMARY KEY, name TEXT NOT NULL, image TEXT NOT NULL, types TEXT NOT NULL, weaknesses TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);

    // Create party table with proper schema
    await db.runAsync(`CREATE TABLE IF NOT EXISTS party (id INTEGER PRIMARY KEY, pokeid INTEGER NOT NULL, name TEXT NOT NULL, image TEXT NOT NULL, types TEXT NOT NULL, weaknesses TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);

    // Check if pokeid column exists, if not add it (for existing databases)
    try {
      await db.runAsync(`ALTER TABLE party ADD COLUMN pokeid INTEGER NOT NULL DEFAULT 0`);
    } catch (error) {
      // Column already exists, ignore error
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Get database instance (only for native platforms)
export const getDatabase = () => {
  if (Platform.OS === 'web') {
    throw new Error('Database not available on web platform');
  }
  return db;
};

// Storage key for users on web
const USERS_STORAGE_KEY = 'pokedex_users';

// Save user to storage (works on both platforms)
export const saveUserToStorage = async (user: Omit<StoredUser, 'id' | 'created_at'>): Promise<void> => {
  if (Platform.OS === 'web') {
    try {
      // Get existing users
      const existingUsersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const existingUsers: StoredUser[] = existingUsersJson ? JSON.parse(existingUsersJson) : [];

      // Check if user already exists
      const existingUserIndex = existingUsers.findIndex(u => u.email === user.email);
      if (existingUserIndex >= 0) {
        throw new Error('User already exists');
      }

      // Add new user
      const newUser: StoredUser = {
        ...user,
        id: Date.now(), // Simple ID generation
        created_at: new Date().toISOString(),
      };

      existingUsers.push(newUser);
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(existingUsers));
    } catch (error) {
      console.error('Error saving user to AsyncStorage:', error);
      throw error;
    }
  } else {
    // Use SQLite for native platforms
    try {
      await db.runAsync(
        'INSERT INTO users (nome, idade, nickname, email, senha_hash) VALUES (?, ?, ?, ?, ?)',
        [user.nome, user.idade, user.nickname, user.email, user.senha_hash]
      );
    } catch (error) {
      console.error('Error saving user to SQLite:', error);
      throw error;
    }
  }
};

// Get user by email (works on both platforms)
export const getUserByEmail = async (email: string): Promise<StoredUser | null> => {
  if (Platform.OS === 'web') {
    try {
      const existingUsersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const existingUsers: StoredUser[] = existingUsersJson ? JSON.parse(existingUsersJson) : [];

      return existingUsers.find(u => u.email === email) || null;
    } catch (error) {
      console.error('Error getting user from AsyncStorage:', error);
      throw error;
    }
  } else {
    // Use SQLite for native platforms
    try {
      const result = await db.getFirstAsync(
        'SELECT id, nome, idade, nickname, email, senha_hash, created_at FROM users WHERE email = ?',
        [email]
      ) as StoredUser | undefined;

      return result || null;
    } catch (error) {
      console.error('Error getting user from SQLite:', error);
      throw error;
    }
  }
};

// Storage key for favorites on web
const FAVORITES_STORAGE_KEY = 'pokedex_favorites';

// Storage key for party on web
const PARTY_STORAGE_KEY = 'pokedex_party';

// Save favorite Pokemon (works on both platforms)
export const saveFavoritePokemon = async (pokemon: FavoritePokemon): Promise<void> => {
  if (Platform.OS === 'web') {
    try {
      // Get existing favorites
      const existingFavoritesJson = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      const existingFavorites: FavoritePokemon[] = existingFavoritesJson ? JSON.parse(existingFavoritesJson) : [];

      // Check if already favorited
      const existingIndex = existingFavorites.findIndex(f => f.id === pokemon.id);
      if (existingIndex >= 0) {
        // Remove from favorites
        existingFavorites.splice(existingIndex, 1);
      } else {
        // Add to favorites
        existingFavorites.push(pokemon);
      }

      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(existingFavorites));
    } catch (error) {
      console.error('Error saving favorite to AsyncStorage:', error);
      throw error;
    }
  } else {
    // Use SQLite for native platforms
    try {
      // Check if already exists
      const existing = await db.getFirstAsync('SELECT id FROM favorites WHERE id = ?', [pokemon.id]);

      if (existing) {
        // Remove from favorites
        await db.runAsync('DELETE FROM favorites WHERE id = ?', [pokemon.id]);
      } else {
        // Add to favorites
        await db.runAsync(
          'INSERT INTO favorites (id, name, image, types, weaknesses) VALUES (?, ?, ?, ?, ?)',
          [pokemon.id, pokemon.name, pokemon.image, JSON.stringify(pokemon.types), JSON.stringify(pokemon.weaknesses)]
        );
      }
    } catch (error) {
      console.error('Error saving favorite to SQLite:', error);
      throw error;
    }
  }
};

// Get all favorite Pokemon (works on both platforms)
export const getFavoritePokemons = async (): Promise<FavoritePokemon[]> => {
  if (Platform.OS === 'web') {
    try {
      const favoritesJson = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      return favoritesJson ? JSON.parse(favoritesJson) : [];
    } catch (error) {
      console.error('Error getting favorites from AsyncStorage:', error);
      throw error;
    }
  } else {
    // Use SQLite for native platforms
    try {
      const result = await db.getAllAsync('SELECT id, name, image, types, weaknesses FROM favorites ORDER BY created_at DESC');
      return result.map((row: any) => ({
        id: row.id,
        name: row.name,
        image: row.image,
        types: JSON.parse(row.types),
        weaknesses: JSON.parse(row.weaknesses),
      }));
    } catch (error) {
      console.error('Error getting favorites from SQLite:', error);
      throw error;
    }
  }
};

// Remove favorite Pokemon (works on both platforms)
export const removeFavoritePokemon = async (pokemonId: number): Promise<void> => {
  if (Platform.OS === 'web') {
    try {
      const existingFavoritesJson = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      const existingFavorites: FavoritePokemon[] = existingFavoritesJson ? JSON.parse(existingFavoritesJson) : [];

      const updatedFavorites = existingFavorites.filter(f => f.id !== pokemonId);
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error removing favorite from AsyncStorage:', error);
      throw error;
    }
  } else {
    // Use SQLite for native platforms
    try {
      await db.runAsync('DELETE FROM favorites WHERE id = ?', [pokemonId]);
    } catch (error) {
      console.error('Error removing favorite from SQLite:', error);
      throw error;
    }
  }
};

// Save party Pokemon (works on both platforms)
export const savePartyPokemon = async (pokemon: Omit<PartyPokemon, 'id'>): Promise<void> => {
  if (Platform.OS === 'web') {
    try {
      // Get existing party
      const existingPartyJson = await AsyncStorage.getItem(PARTY_STORAGE_KEY);
      const existingParty: PartyPokemon[] = existingPartyJson ? JSON.parse(existingPartyJson) : [];

      // Check if party is full (max 6)
      if (existingParty.length >= 6) {
        throw new Error('Party is full. Maximum 6 Pokemon allowed.');
      }

      // Find the smallest available id (position) from 1 to 6
      const takenIds = new Set(existingParty.map(p => p.id));
      let availableId = 1;
      while (takenIds.has(availableId) && availableId <= 6) {
        availableId++;
      }
      if (availableId > 6) {
        throw new Error('Party is full. Maximum 6 Pokemon allowed.');
      }

      // Add to party (allow duplicates)
      const partyPokemon: PartyPokemon = {
        id: availableId,
        ...pokemon
      };
      existingParty.push(partyPokemon);
      await AsyncStorage.setItem(PARTY_STORAGE_KEY, JSON.stringify(existingParty));
    } catch (error) {
      console.error('Error saving party Pokemon to AsyncStorage:', error);
      throw error;
    }
  } else {
    // Use SQLite for native platforms
    try {
      // Get existing party to find available position
      const existingParty = await db.getAllAsync('SELECT id FROM party ORDER BY id ASC');
      const takenIds = new Set(existingParty.map((row: any) => row.id));

      // Find the smallest available id (position) from 1 to 6
      let availableId = 1;
      while (takenIds.has(availableId) && availableId <= 6) {
        availableId++;
      }
      if (availableId > 6) {
        throw new Error('Party is full. Maximum 6 Pokemon allowed.');
      }

      // Add to party (allow duplicates)
      await db.runAsync(
        'INSERT INTO party (id, pokeid, name, image, types, weaknesses) VALUES (?, ?, ?, ?, ?, ?)',
        [availableId, pokemon.pokeid, pokemon.name, pokemon.image, JSON.stringify(pokemon.types), JSON.stringify(pokemon.weaknesses)]
      );
    } catch (error) {
      console.error('Error saving party Pokemon to SQLite:', error);
      throw error;
    }
  }
};

// Get all party Pokemon (works on both platforms)
export const getPartyPokemons = async (): Promise<PartyPokemon[]> => {
  if (Platform.OS === 'web') {
    try {
      const partyJson = await AsyncStorage.getItem(PARTY_STORAGE_KEY);
      return partyJson ? JSON.parse(partyJson) : [];
    } catch (error) {
      console.error('Error getting party from AsyncStorage:', error);
      throw error;
    }
  } else {
    // Use SQLite for native platforms
    try {
      const result = await db.getAllAsync('SELECT id, pokeid, name, image, types, weaknesses FROM party ORDER BY id ASC');
      return result.map((row: any) => ({
        id: row.id,
        pokeid: row.pokeid,
        name: row.name,
        image: row.image,
        types: JSON.parse(row.types),
        weaknesses: JSON.parse(row.weaknesses),
      }));
    } catch (error) {
      console.error('Error getting party from SQLite:', error);
      throw error;
    }
  }
};

// Remove party Pokemon (works on both platforms)
export const removePartyPokemon = async (pokemonId: number): Promise<void> => {
  if (Platform.OS === 'web') {
    try {
      const existingPartyJson = await AsyncStorage.getItem(PARTY_STORAGE_KEY);
      const existingParty: PartyPokemon[] = existingPartyJson ? JSON.parse(existingPartyJson) : [];

      // Remove the pokemon and shift positions
      const updatedParty = existingParty
        .filter(p => p.id !== pokemonId)
        .map(p => ({
          ...p,
          id: p.id! > pokemonId ? p.id! - 1 : p.id
        }));

      await AsyncStorage.setItem(PARTY_STORAGE_KEY, JSON.stringify(updatedParty));
    } catch (error) {
      console.error('Error removing party Pokemon from AsyncStorage:', error);
      throw error;
    }
  } else {
    // Use SQLite for native platforms
    try {
      // Delete the pokemon
      await db.runAsync('DELETE FROM party WHERE id = ?', [pokemonId]);

      // Shift positions: update all ids greater than pokemonId by decrementing by 1
      await db.runAsync('UPDATE party SET id = id - 1 WHERE id > ?', [pokemonId]);
    } catch (error) {
      console.error('Error removing party Pokemon from SQLite:', error);
      throw error;
    }
  }
};

// Reset database (drop all tables and recreate)
export const resetDatabase = async () => {
  if (Platform.OS === 'web') {
    try {
      await AsyncStorage.removeItem(USERS_STORAGE_KEY);
      await AsyncStorage.removeItem(FAVORITES_STORAGE_KEY);
      await AsyncStorage.removeItem(PARTY_STORAGE_KEY);
      console.log('AsyncStorage cleared successfully');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
      throw error;
    }
  } else {
    try {
      // Drop all tables
      await db.runAsync('DROP TABLE IF EXISTS users');
      await db.runAsync('DROP TABLE IF EXISTS favorites');
      await db.runAsync('DROP TABLE IF EXISTS party');

      // Recreate tables
      await initDatabase();
      console.log('Database reset successfully');
    } catch (error) {
      console.error('Error resetting database:', error);
      throw error;
    }
  }
};

// Close database connection (optional, SQLite handles this automatically)
export const closeDatabase = () => {
  // SQLite handles connection closing automatically
};
