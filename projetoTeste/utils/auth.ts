import { saveUserToStorage, getUserByEmail } from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interface for user data
export interface User {
  id?: number;
  nome: string;
  idade: number;
  nickname: string;
  email: string;
  senha: string;
}

// Storage key for current user
const CURRENT_USER_STORAGE_KEY = 'pokedex_current_user';

// Simple hash function (for demo purposes - use proper hashing in production)
const hashPassword = (password: string): string => {
  // In production, use bcrypt or similar
  return btoa(password); // Base64 encoding as simple hash
};

const verifyPassword = (password: string, hash: string): boolean => {
  return btoa(password) === hash;
};

// Save user to database
export const saveUser = async (user: User): Promise<void> => {
  try {
    const hashedPassword = hashPassword(user.senha);

    await saveUserToStorage({
      nome: user.nome,
      idade: user.idade,
      nickname: user.nickname,
      email: user.email,
      senha_hash: hashedPassword,
    });
  } catch (error) {
    console.error('Error saving user:', error);
    throw new Error('Failed to save user');
  }
};

// Authenticate user
export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const result = await getUserByEmail(email);

    if (!result) {
      return null;
    }

    const isValidPassword = verifyPassword(password, result.senha_hash);

    if (!isValidPassword) {
      return null;
    }

    // Return user data without password
    return {
      id: result.id,
      nome: result.nome,
      idade: result.idade,
      nickname: result.nickname,
      email: result.email,
      senha: '', // Don't return password
    };
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw new Error('Authentication failed');
  }
};

// Save current user session
export const saveCurrentUser = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving current user:', error);
    throw new Error('Failed to save current user');
  }
};

// Get current user session
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userJson = await AsyncStorage.getItem(CURRENT_USER_STORAGE_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Clear current user session (logout)
export const clearCurrentUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing current user:', error);
    throw new Error('Failed to clear current user');
  }
};
