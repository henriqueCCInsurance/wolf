import { supabase } from '@/lib/supabase';
import { DatabaseService } from '@/services/database';
import { User, LoginCredentials } from '@/types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Login failed');
    }

    // Get the user profile from our users table
    const user = await DatabaseService.getCurrentUser();
    if (!user) {
      throw new Error('User profile not found');
    }

    return user;
  }

  async signUp(email: string, password: string, name: string, role: 'salesperson' | 'admin' = 'salesperson'): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Sign up failed');
    }

    // The user profile is automatically created by the trigger
    // Wait a moment then get the profile
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = await DatabaseService.getCurrentUser();
    if (!user) {
      throw new Error('User profile creation failed');
    }

    return user;
  }

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      return await DatabaseService.getCurrentUser();
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async updateUserSettings(userId: string, settings: Partial<User['settings']>): Promise<User> {
    return await DatabaseService.updateUserProfile(userId, { settings });
  }

  async getAllUsers(): Promise<User[]> {
    // Only allow admins to get all users
    const currentUser = await this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    return await DatabaseService.getAllUsers();
  }

  async createUser(_userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    // This would typically be done through the admin panel
    // For now, we'll use signUp with admin privileges
    throw new Error('User creation through admin panel not implemented yet');
  }

  async deleteUser(_userId: string): Promise<void> {
    // Only allow admins to delete users
    const currentUser = await this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    // Note: This would need to be implemented with proper cascade handling
    throw new Error('User deletion not implemented yet');
  }

  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  async signInWithGoogle(): Promise<User> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    // The user will be redirected to Google OAuth
    // After successful auth, they'll be redirected back with the user data
    throw new Error('Redirecting to Google OAuth...');
  }

  async signInWithGitHub(): Promise<User> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    // The user will be redirected to GitHub OAuth
    throw new Error('Redirecting to GitHub OAuth...');
  }

  // Listen for auth state changes
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const user = await DatabaseService.getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    });
  }

  // Helper method to check permissions
  hasPermission(user: User | null, permission: 'admin' | 'manage-users' | 'view-reports'): boolean {
    if (!user) return false;
    
    switch (permission) {
      case 'admin':
      case 'manage-users':
      case 'view-reports':
        return user.role === 'admin';
      default:
        return false;
    }
  }
}

export const authService = new AuthService();
export default authService;