import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { User, FavoritePokemon, PartyPokemon } from '../types/database';

// Web storage fallback
class WebStorage {
  private static instance: WebStorage;
  private data: { [key: string]: any } = {};

  static getInstance(): WebStorage {
    if (!WebStorage.instance) {
      WebStorage.instance = new WebStorage();
      // Load from localStorage on initialization
      const stored = localStorage.getItem('pokedex_db');
      if (stored) {
        try {
          WebStorage.instance.data = JSON.parse(stored);
        } catch (e) {
          console.warn('Failed to parse stored data:', e);
          WebStorage.instance.data = {};
        }
      }
    }
    return WebStorage.instance;
  }

  private saveToStorage() {
    try {
      localStorage.setItem('pokedex_db', JSON.stringify(this.data));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }

  async execAsync(sql: string): Promise<void> {
    // Simple web storage doesn't support SQL, so we'll simulate basic operations
    console.log('Web storage: execAsync called with:', sql);
    // For web, we'll just mark as initialized
    this.data.initialized = true;
    this.saveToStorage();
  }

  async runAsync(sql: string, params: any[] = []): Promise<{ lastInsertRowId: number; changes: number }> {
    // Simulate INSERT operations for web
    if (sql.includes('INSERT INTO users')) {
      const userId = Date.now(); // Simple ID generation
      this.data.users = this.data.users || [];
      // For web storage, store password as-is (not hashed for simplicity)
      this.data.users.push({
        id: userId,
        nickname: params[0],
        nome: params[1],
        idade: parseInt(params[2]),
        email: params[3],
        senha: params[4], // Plain text for web storage
        profileImage: params[5] || ''
      });
      this.saveToStorage();
      return { lastInsertRowId: userId, changes: 1 };
    }
    if (sql.includes('INSERT OR REPLACE INTO favorites')) {
      this.data.favorites = this.data.favorites || [];
      const existingIndex = this.data.favorites.findIndex((f: any) => f.userId === params[0] && f.pokemonId === params[1]);
      const favorite = {
        userId: params[0],
        pokemonId: params[1],
        pokemonName: params[2],
        pokemonImage: params[3],
        pokemonTypes: params[4],
        pokemonWeaknesses: params[5]
      };
      if (existingIndex >= 0) {
        this.data.favorites[existingIndex] = favorite;
      } else {
        this.data.favorites.push(favorite);
      }
      this.saveToStorage();
      return { lastInsertRowId: 1, changes: 1 };
    }
    if (sql.includes('INSERT OR REPLACE INTO party')) {
      this.data.party = this.data.party || [];
      const existingIndex = this.data.party.findIndex((p: any) => p.userId === params[0] && p.pokemonId === params[1]);
      const partyItem = {
        userId: params[0],
        pokemonId: params[1],
        pokemonName: params[2],
        pokemonImage: params[3],
        pokemonTypes: params[4],
        pokemonWeaknesses: params[5]
      };
      if (existingIndex >= 0) {
        this.data.party[existingIndex] = partyItem;
      } else {
        this.data.party.push(partyItem);
      }
      this.saveToStorage();
      return { lastInsertRowId: 1, changes: 1 };
    }
    if (sql.includes('UPDATE users')) {
      this.data.users = this.data.users || [];
      const userIndex = this.data.users.findIndex((u: any) => u.id === params[params.length - 1]);
      if (userIndex >= 0) {
        // Update logic would go here
        this.saveToStorage();
      }
      return { lastInsertRowId: 1, changes: 1 };
    }
    if (sql.includes('DELETE FROM')) {
      if (sql.includes('favorites')) {
        this.data.favorites = this.data.favorites || [];
        this.data.favorites = this.data.favorites.filter((f: any) => !(f.userId === params[0] && f.pokemonId === params[1]));
        this.saveToStorage();
      } else if (sql.includes('party')) {
        this.data.party = this.data.party || [];
        this.data.party = this.data.party.filter((p: any) => !(p.userId === params[0] && p.pokemonId === params[1]));
        this.saveToStorage();
      }
      return { lastInsertRowId: 1, changes: 1 };
    }
    return { lastInsertRowId: 1, changes: 1 };
  }

  async getAllAsync<T>(sql: string, params: any[] = []): Promise<T[]> {
    // Simulate SELECT operations for web
    if (sql.includes('SELECT * FROM users WHERE email = ? AND senha = ?')) {
      this.data.users = this.data.users || [];
      const user = this.data.users.find((u: any) => u.email === params[0] && u.senha === params[1]);
      return user ? [user] : [];
    }
    if (sql.includes('SELECT * FROM users WHERE id = ?')) {
      this.data.users = this.data.users || [];
      const user = this.data.users.find((u: any) => u.id === params[0]);
      return user ? [user] : [];
    }
    if (sql.includes('SELECT * FROM favorites WHERE userId = ?')) {
      this.data.favorites = this.data.favorites || [];
      return this.data.favorites.filter((f: any) => f.userId === params[0]);
    }
    if (sql.includes('SELECT COUNT(*) as count FROM favorites WHERE userId = ? AND pokemonId = ?')) {
      this.data.favorites = this.data.favorites || [];
      const count = this.data.favorites.filter((f: any) => f.userId === params[0] && f.pokemonId === params[1]).length;
      return [{ count }] as T[];
    }
    if (sql.includes('SELECT * FROM party WHERE userId = ?')) {
      this.data.party = this.data.party || [];
      return this.data.party.filter((p: any) => p.userId === params[0]);
    }
    if (sql.includes('SELECT COUNT(*) as count FROM party WHERE userId = ? AND pokemonId = ?')) {
      this.data.party = this.data.party || [];
      const count = this.data.party.filter((p: any) => p.userId === params[0] && p.pokemonId === params[1]).length;
      return [{ count }] as T[];
    }
    return [];
  }
}

// Database instance
const db = Platform.OS === 'web' ? WebStorage.getInstance() : SQLite.openDatabaseSync('pokedex.db');

export const initDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.execAsync(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nickname TEXT UNIQUE NOT NULL,
        nome TEXT NOT NULL,
        idade INTEGER NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        profileImage TEXT
      );`
    ).then(() => {
      return db.execAsync(
        `CREATE TABLE IF NOT EXISTS favorites (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          pokemonId INTEGER NOT NULL,
          pokemonName TEXT NOT NULL,
          pokemonImage TEXT NOT NULL,
          pokemonTypes TEXT NOT NULL,
          pokemonWeaknesses TEXT NOT NULL,
          FOREIGN KEY (userId) REFERENCES users (id),
          UNIQUE(userId, pokemonId)
        );`
      );
    }).then(() => {
      return db.execAsync(
        `CREATE TABLE IF NOT EXISTS party (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          pokemonId INTEGER NOT NULL,
          pokemonName TEXT NOT NULL,
          pokemonImage TEXT NOT NULL,
          pokemonTypes TEXT NOT NULL,
          pokemonWeaknesses TEXT NOT NULL,
          FOREIGN KEY (userId) REFERENCES users (id),
          UNIQUE(userId, pokemonId)
        );`
      );
    }).then(() => {
      resolve();
    }).catch((error: any) => {
      console.error('Database initialization error:', error);
      reject(error);
    });
  });
};

// User operations
export const createUser = async (user: User): Promise<User> => {
  try {
    // For demo purposes, store passwords in plain text on both platforms
    const result = await db.runAsync(
      'INSERT INTO users (nickname, nome, idade, email, senha, profileImage) VALUES (?, ?, ?, ?, ?, ?)',
      [user.nickname, user.nome, user.idade, user.email, user.senha, user.profileImage || '']
    );
    return { ...user, id: result.lastInsertRowId };
  } catch (error: any) {
    throw error;
  }
};

export const getUser = async (email: string, senha: string): Promise<User | null> => {
  try {
    // For demo purposes, use plain text password comparison on both platforms
    const result = await db.getAllAsync<User>('SELECT * FROM users WHERE email = ? AND senha = ?', [email, senha]);
    return result.length > 0 ? result[0] : null;
  } catch (error: any) {
    throw error;
  }
};

export const getUserById = async (id: number): Promise<User | null> => {
  try {
    const result = await db.getAllAsync<User>('SELECT * FROM users WHERE id = ?', [id]);
    return result.length > 0 ? result[0] : null;
  } catch (error: any) {
    throw error;
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const result = await db.getAllAsync<User>('SELECT * FROM users WHERE email = ?', [email]);
    return result.length > 0 ? result[0] : null;
  } catch (error: any) {
    throw error;
  }
};

export const updateUser = async (id: number, updates: Partial<User>): Promise<void> => {
  try {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map(field => `${field} = ?`).join(', ');

    await db.runAsync(`UPDATE users SET ${setClause} WHERE id = ?`, [...values, id]);
  } catch (error: any) {
    throw error;
  }
};

// Favorites operations
export const addFavorite = async (favorite: FavoritePokemon): Promise<void> => {
  try {
    await db.runAsync(
      'INSERT OR REPLACE INTO favorites (userId, pokemonId, pokemonName, pokemonImage, pokemonTypes, pokemonWeaknesses) VALUES (?, ?, ?, ?, ?, ?)',
      [favorite.userId, favorite.pokemonId, favorite.pokemonName, favorite.pokemonImage, favorite.pokemonTypes, favorite.pokemonWeaknesses]
    );
  } catch (error: any) {
    throw error;
  }
};

export const removeFavorite = async (userId: number, pokemonId: number): Promise<void> => {
  try {
    await db.runAsync('DELETE FROM favorites WHERE userId = ? AND pokemonId = ?', [userId, pokemonId]);
  } catch (error: any) {
    throw error;
  }
};

export const getFavorites = async (userId: number): Promise<FavoritePokemon[]> => {
  try {
    const result = await db.getAllAsync<FavoritePokemon>('SELECT * FROM favorites WHERE userId = ?', [userId]);
    return result;
  } catch (error: any) {
    throw error;
  }
};

export const isFavorite = async (userId: number, pokemonId: number): Promise<boolean> => {
  try {
    const result = await db.getAllAsync<{ count: number }>('SELECT COUNT(*) as count FROM favorites WHERE userId = ? AND pokemonId = ?', [userId, pokemonId]);
    return result[0].count > 0;
  } catch (error: any) {
    throw error;
  }
};

// Party operations
export const addToParty = async (party: PartyPokemon): Promise<void> => {
  try {
    await db.runAsync(
      'INSERT OR REPLACE INTO party (userId, pokemonId, pokemonName, pokemonImage, pokemonTypes, pokemonWeaknesses) VALUES (?, ?, ?, ?, ?, ?)',
      [party.userId, party.pokemonId, party.pokemonName, party.pokemonImage, party.pokemonTypes, party.pokemonWeaknesses]
    );
  } catch (error: any) {
    throw error;
  }
};

export const removeFromParty = async (userId: number, pokemonId: number): Promise<void> => {
  try {
    await db.runAsync('DELETE FROM party WHERE userId = ? AND pokemonId = ?', [userId, pokemonId]);
  } catch (error: any) {
    throw error;
  }
};

export const getParty = async (userId: number): Promise<PartyPokemon[]> => {
  try {
    const result = await db.getAllAsync<PartyPokemon>('SELECT * FROM party WHERE userId = ?', [userId]);
    return result;
  } catch (error: any) {
    throw error;
  }
};

export const isInParty = async (userId: number, pokemonId: number): Promise<boolean> => {
  try {
    const result = await db.getAllAsync<{ count: number }>('SELECT COUNT(*) as count FROM party WHERE userId = ? AND pokemonId = ?', [userId, pokemonId]);
    return result[0].count > 0;
  } catch (error: any) {
    throw error;
  }
};

export const toggleFavorite = async (userId: number, pokemon: any): Promise<void> => {
  const isFav = await isFavorite(userId, pokemon.id);
  if (isFav) {
    await removeFavorite(userId, pokemon.id);
  } else {
    await addFavorite({
      userId,
      pokemonId: pokemon.id,
      pokemonName: pokemon.name,
      pokemonImage: pokemon.image,
      pokemonTypes: JSON.stringify(pokemon.types),
      pokemonWeaknesses: JSON.stringify([]), // We will calculate this later
    });
  }
};

export const toggleParty = async (userId: number, pokemon: any): Promise<void> => {
  const inParty = await isInParty(userId, pokemon.id);
  if (inParty) {
    await removeFromParty(userId, pokemon.id);
  } else {
    await addToParty({
      userId,
      pokemonId: pokemon.id,
      pokemonName: pokemon.name,
      pokemonImage: pokemon.image,
      pokemonTypes: JSON.stringify(pokemon.types),
      pokemonWeaknesses: JSON.stringify([]), // We will calculate this later
    });
  }
};

export const getUserFavorites = (userId: number): Promise<any[]> => {
  return getFavorites(userId);
};

export const getUserParty = (userId: number): Promise<any[]> => {
  return getParty(userId);
};
