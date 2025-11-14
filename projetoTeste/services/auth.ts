import { User } from '../types/database';
import { getUser, createUser, toggleFavorite as dbToggleFavorite, toggleParty as dbToggleParty, getUserById, getUserByEmail } from './database';

class AuthService {
  private currentUser: User | null = null;

  async login(email: string, password: string): Promise<User | null> {
    console.log('AuthService.login called with email:', email);
    try {
      console.log('Calling getUser...');
      const user = await getUser(email, password);
      console.log('getUser result:', user);
      if (user) {
        console.log('Login successful, setting currentUser');
        this.currentUser = user;
        return user;
      }
      console.log('Login failed: user not found');
      return null;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: Omit<User, 'id'> ): Promise<User> {
    console.log('AuthService.register called with userData:', userData);
    try {
      console.log('Checking if user already exists...');
      // Check if user already exists
      const existingUser = await getUserByEmail(userData.email);
      console.log('Existing user check result:', existingUser);
      if (existingUser) {
        console.log('User already exists, throwing error');
        throw new Error('User already exists');
      }

      console.log('Creating new user...');
      const newUser = await createUser(userData);
      console.log('New user created:', newUser);
      this.currentUser = newUser;
      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  logout(): void {
    this.currentUser = null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  // Add toggle functions
  async toggleFavorite(userId: number, pokemon: any): Promise<void> {
    return dbToggleFavorite(userId, pokemon);
  }

  async toggleParty(userId: number, pokemon: any): Promise<void> {
    return dbToggleParty(userId, pokemon);
  }
}

export const authService = new AuthService();

// Export functions for convenience
export const getCurrentUser = () => authService.getCurrentUser();
export const toggleFavorite = (userId: number, pokemon: any) => authService.toggleFavorite(userId, pokemon);
export const toggleParty = (userId: number, pokemon: any) => authService.toggleParty(userId, pokemon);
