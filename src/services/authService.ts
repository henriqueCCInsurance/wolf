import { userService } from '@/services/netlifyDb';
import { User, LoginCredentials } from '@/types';

// Beta access codes for early testers
const BETA_ACCESS_CODES = [
  'WOLF-BETA-2025',
  'CAMPBELL-EARLY',
  'SALES-CHAMPION',
  'GROWTH-PARTNER',
  'ELITE-SELLER'
];

// Simple authentication service with beta user support
class AuthService {
  private currentUser: User | null = null;
  private authListeners: Array<(user: User | null) => void> = [];

  // Demo users for testing
  private demoUsers = [
    { email: 'admin@campbellco.com', password: 'password123', name: 'Admin User', role: 'admin' as const },
    { email: 'john.smith@campbellco.com', password: 'password123', name: 'John Smith', role: 'salesperson' as const },
    { email: 'maria.garcia@campbellco.com', password: 'password123', name: 'Maria Garcia', role: 'salesperson' as const },
    { email: 'demo@example.com', password: 'demo', name: 'Demo User', role: 'salesperson' as const }
  ];

  async login(credentials: LoginCredentials): Promise<User> {
    // Check stored beta users first
    const storedUsers = JSON.parse(localStorage.getItem('wolf-den-users') || '[]');
    const storedUser = storedUsers.find((user: any) => 
      user.email === credentials.email && user.password === btoa(credentials.password)
    );
    
    if (storedUser) {
      // Create user object from stored credentials
      const user: User = {
        id: `beta-${storedUser.email}`,
        email: storedUser.email,
        name: storedUser.name,
        role: storedUser.role || 'salesperson',
        createdAt: new Date(storedUser.createdAt),
        settings: {
          theme: 'light' as const,
          notifications: true,
          autoSave: true,
          defaultCallObjectives: []
        }
      };
      
      this.currentUser = user;
      this.notifyAuthListeners(user);
      localStorage.setItem('wolf-den-user', JSON.stringify(user));
      
      return user;
    }
    
    // Check demo users as fallback
    const demoUser = this.demoUsers.find(user => 
      user.email === credentials.email && user.password === credentials.password
    );

    if (demoUser) {
      // Create or get user from database
      let user: User;
      try {
        const existingUser = await userService.findByEmail(credentials.email);
        if (existingUser) {
          user = existingUser;
          await userService.updateLastLogin(user.id);
        } else {
          user = await userService.create({
            email: demoUser.email,
            name: demoUser.name,
            role: demoUser.role
          });
        }
      } catch (dbError) {
        console.warn('Database unavailable, using demo user:', dbError);
        // Fallback to demo user if database is unavailable
        user = {
          id: `demo-${Date.now()}`,
          email: demoUser.email,
          name: demoUser.name,
          role: demoUser.role,
          createdAt: new Date(),
          settings: {
            theme: 'light' as const,
            notifications: true,
            autoSave: true,
            defaultCallObjectives: []
          }
        };
      }

      this.currentUser = user;
      this.notifyAuthListeners(user);
      
      // Store in localStorage for persistence
      localStorage.setItem('wolf-den-user', JSON.stringify(user));
      
      return user;
    }

    throw new Error('Invalid credentials');
  }

  async signUp(email: string, password: string, name: string, role: 'salesperson' | 'admin' = 'salesperson', betaCode?: string): Promise<User> {
    // Validate password strength
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    
    // Validate beta access code if provided
    if (betaCode && !BETA_ACCESS_CODES.includes(betaCode)) {
      throw new Error('Invalid beta access code');
    }

    try {
      // Check if user already exists
      const existingUser = await userService.findByEmail(email);
      if (existingUser) {
        throw new Error('An account with this email already exists');
      }

      // Create new user with hashed password (in production, use bcrypt)
      const hashedPassword = btoa(password); // Simple encoding for demo
      
      const user = await userService.create({
        email,
        name,
        role
      });

      // Store user credentials securely
      const userCredentials = {
        email,
        password: hashedPassword,
        name,
        role,
        isBetaTester: !!betaCode,
        createdAt: new Date().toISOString()
      };
      
      // Store in localStorage as backup (in production, use secure database)
      const existingUsers = JSON.parse(localStorage.getItem('wolf-den-users') || '[]');
      existingUsers.push(userCredentials);
      localStorage.setItem('wolf-den-users', JSON.stringify(existingUsers));

      // Log the user in automatically
      this.currentUser = user;
      this.notifyAuthListeners(user);
      localStorage.setItem('wolf-den-user', JSON.stringify(user));

      return user;
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        throw error;
      }
      
      console.warn('Database unavailable for signup:', error);
      
      // Enhanced fallback for beta users
      const user: User = {
        id: `beta-${Date.now()}`,
        email,
        name,
        role,
        createdAt: new Date(),
        settings: {
          theme: 'light' as const,
          notifications: true,
          autoSave: true,
          defaultCallObjectives: []
        }
      };

      // Store credentials for future login
      const hashedPassword = btoa(password);
      const userCredentials = {
        email,
        password: hashedPassword,
        name,
        role,
        isBetaTester: !!betaCode,
        createdAt: new Date().toISOString()
      };
      
      const existingUsers = JSON.parse(localStorage.getItem('wolf-den-users') || '[]');
      existingUsers.push(userCredentials);
      localStorage.setItem('wolf-den-users', JSON.stringify(existingUsers));
      
      // Log the user in
      this.currentUser = user;
      this.notifyAuthListeners(user);
      localStorage.setItem('wolf-den-user', JSON.stringify(user));
      
      return user;
    }
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem('wolf-den-user');
    this.notifyAuthListeners(null);
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Check localStorage for persisted user
    const storedUser = localStorage.getItem('wolf-den-user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUser = user;
        return user;
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('wolf-den-user');
      }
    }

    return null;
  }

  async updateUserSettings(_userId: string, settings: Partial<User['settings']>): Promise<User> {
    if (!this.currentUser) {
      throw new Error('Not authenticated');
    }

    const updatedUser = { 
      ...this.currentUser, 
      settings: { 
        theme: 'light' as const,
        notifications: true,
        autoSave: true,
        defaultCallObjectives: [],
        ...this.currentUser.settings, 
        ...settings 
      } 
    };
    this.currentUser = updatedUser;
    localStorage.setItem('wolf-den-user', JSON.stringify(updatedUser));
    this.notifyAuthListeners(updatedUser);
    
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    try {
      // Try to get users from database
      const users = await userService.findByEmail('') || [];
      return users;
    } catch (error) {
      console.warn('Database unavailable, returning demo users:', error);
      // Fallback to demo users
      return this.demoUsers.map(demoUser => ({
        id: `demo-${demoUser.email}`,
        email: demoUser.email,
        name: demoUser.name,
        role: demoUser.role,
        createdAt: new Date(),
        settings: {
          theme: 'light' as const,
          notifications: true,
          autoSave: true,
          defaultCallObjectives: []
        }
      }));
    }
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    try {
      return await userService.create(userData);
    } catch (error) {
      console.warn('Database unavailable for user creation:', error);
      throw new Error('User creation unavailable');
    }
  }

  async deleteUser(_userId: string): Promise<void> {
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    throw new Error('User deletion not implemented yet');
  }

  async resetPassword(email: string): Promise<void> {
    // In a real app, this would send a password reset email
    console.log('Password reset requested for:', email);
    
    // Check if email exists in demo users or stored users
    const storedUsers = JSON.parse(localStorage.getItem('wolf-den-users') || '[]');
    const demoUserExists = this.demoUsers.some(user => user.email === email);
    const storedUserExists = storedUsers.some((user: any) => user.email === email);
    
    if (!demoUserExists && !storedUserExists) {
      throw new Error('No account found with this email address');
    }
    
    // In demo mode, simulate a successful password reset
    // In production, this would send an actual reset email
    return Promise.resolve();
  }

  async updatePassword(_newPassword: string): Promise<void> {
    if (!this.currentUser) {
      throw new Error('Not authenticated');
    }
    // In demo mode, just log the password change
    console.log('Password update requested for:', this.currentUser.email);
  }

  // OAuth methods for compatibility (not functional in demo mode)
  async signInWithGoogle(): Promise<User> {
    throw new Error('OAuth not available in demo mode. Use demo credentials.');
  }

  async signInWithGitHub(): Promise<User> {
    throw new Error('OAuth not available in demo mode. Use demo credentials.');
  }

  async signInWithApple(): Promise<User> {
    throw new Error('OAuth not available in demo mode. Use demo credentials.');
  }

  // Auth state change listener
  onAuthStateChange(callback: (user: User | null) => void) {
    this.authListeners.push(callback);
    
    // Call immediately with current state
    callback(this.currentUser);
    
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            this.authListeners = this.authListeners.filter(listener => listener !== callback);
          }
        }
      }
    };
  }

  private notifyAuthListeners(user: User | null) {
    this.authListeners.forEach(callback => callback(user));
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