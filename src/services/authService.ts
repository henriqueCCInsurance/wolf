import { userService } from '@/services/netlifyDb';
import { User, LoginCredentials } from '@/types';
import { hashPassword, verifyPassword, generateSecureToken, generateCSRFToken, storeCSRFToken, validatePasswordStrength } from '@/utils/crypto';
import * as bcrypt from 'bcryptjs';

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

  // Demo users for testing - passwords will be hashed on first use
  private demoUsers = [
    { email: 'admin@campbellco.com', password: 'Admin@Demo2025!', name: 'Admin User', role: 'admin' as const },
    { email: 'john.smith@campbellco.com', password: 'JohnSmith@2025!', name: 'John Smith', role: 'salesperson' as const },
    { email: 'maria.garcia@campbellco.com', password: 'MariaGarcia@2025!', name: 'Maria Garcia', role: 'salesperson' as const },
    { email: 'demo@example.com', password: 'DemoUser@2025!', name: 'Demo User', role: 'salesperson' as const }
  ];
  
  // Track failed login attempts
  private failedAttempts: Map<string, { count: number; lastAttempt: Date }> = new Map();
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  async login(credentials: LoginCredentials): Promise<User> {
    // Check for account lockout
    const lockoutInfo = this.failedAttempts.get(credentials.email);
    if (lockoutInfo && lockoutInfo.count >= this.MAX_FAILED_ATTEMPTS) {
      const timeSinceLastAttempt = Date.now() - lockoutInfo.lastAttempt.getTime();
      if (timeSinceLastAttempt < this.LOCKOUT_DURATION) {
        const remainingTime = Math.ceil((this.LOCKOUT_DURATION - timeSinceLastAttempt) / 60000);
        throw new Error(`Account locked due to too many failed attempts. Try again in ${remainingTime} minutes.`);
      } else {
        // Reset failed attempts after lockout period
        this.failedAttempts.delete(credentials.email);
      }
    }
    
    // Generate and store CSRF token
    const csrfToken = generateCSRFToken();
    storeCSRFToken(csrfToken);
    
    // Check stored beta users first
    const storedUsers = JSON.parse(localStorage.getItem('wolf-den-users') || '[]');
    // Find user by email first
    const storedUser = storedUsers.find((user: any) => user.email === credentials.email);
    
    // Then verify password
    if (storedUser) {
      let isValidPassword = false;
      
      // Handle migration from btoa to proper hashing
      if (storedUser.password.includes(':')) {
        // Already hashed with our new system
        isValidPassword = await verifyPassword(credentials.password, storedUser.password);
      } else if (storedUser.password === btoa(credentials.password)) {
        // Legacy btoa password - migrate to secure hash
        isValidPassword = true;
        const hashedPassword = await hashPassword(credentials.password);
        
        // Update stored users with new hash
        const updatedUsers = storedUsers.map((u: any) => 
          u.email === storedUser.email ? { ...u, password: hashedPassword } : u
        );
        localStorage.setItem('wolf-den-users', JSON.stringify(updatedUsers));
        storedUser.password = hashedPassword;
      }
      
      if (!isValidPassword) {
        // Track failed login attempt
        const attempts = this.failedAttempts.get(credentials.email) || { count: 0, lastAttempt: new Date() };
        attempts.count++;
        attempts.lastAttempt = new Date();
        this.failedAttempts.set(credentials.email, attempts);
        
        throw new Error('Invalid credentials');
      }
      
      // Reset failed attempts on successful login
      this.failedAttempts.delete(credentials.email);
      
      // User found and password verified, create user object
      const user: User = {
        id: `beta-${storedUser.email}`,
        email: storedUser.email,
        name: storedUser.name,
        role: storedUser.role || 'salesperson',
        createdAt: storedUser.createdAt ? new Date(storedUser.createdAt) : new Date(),
        settings: {
          theme: 'light' as const,
          notifications: true,
          autoSave: true,
          defaultCallObjectives: []
        }
      };
      
      // Generate session token
      const sessionToken = generateSecureToken();
      
      this.currentUser = user;
      this.notifyAuthListeners(user);
      
      // Store user with session token instead of full object
      sessionStorage.setItem('wolf-den-session', JSON.stringify({
        userId: user.id,
        token: sessionToken,
        csrfToken,
        expiresAt: Date.now() + (8 * 60 * 60 * 1000) // 8 hours
      }));
      
      return user;
    }
    
    // Check demo users as fallback
    let demoUser = null;
    for (const demo of this.demoUsers) {
      if (demo.email === credentials.email && demo.password === credentials.password) {
        demoUser = demo;
        break;
      }
    }

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

      // Reset failed attempts on successful login
      this.failedAttempts.delete(credentials.email);
      
      this.currentUser = user;
      this.notifyAuthListeners(user);
      
      // Generate session token
      const sessionToken = generateSecureToken();
      
      // Store session info instead of full user object
      sessionStorage.setItem('wolf-den-session', JSON.stringify({
        userId: user.id,
        token: sessionToken,
        csrfToken,
        expiresAt: Date.now() + (8 * 60 * 60 * 1000) // 8 hours
      }));
      
      return user;
    }

    // Track failed login attempt
    const attempts = this.failedAttempts.get(credentials.email) || { count: 0, lastAttempt: new Date() };
    attempts.count++;
    attempts.lastAttempt = new Date();
    this.failedAttempts.set(credentials.email, attempts);
    
    throw new Error('Invalid credentials');
  }

  async signUp(email: string, password: string, name: string, role: 'salesperson' | 'admin' = 'salesperson', betaCode?: string): Promise<User> {
    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    
    if (!passwordValidation.isValid) {
      throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
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

      // Create new user with properly hashed password
      const hashedPassword = await hashPassword(password);
      
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

      // Generate session token and CSRF token
      const sessionToken = generateSecureToken();
      const csrfToken = generateCSRFToken();
      storeCSRFToken(csrfToken);
      
      // Log the user in automatically
      this.currentUser = user;
      this.notifyAuthListeners(user);
      
      // Store session info
      sessionStorage.setItem('wolf-den-session', JSON.stringify({
        userId: user.id,
        token: sessionToken,
        csrfToken,
        expiresAt: Date.now() + (8 * 60 * 60 * 1000) // 8 hours
      }));

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
      const hashedPassword = await hashPassword(password);
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
      
      // Generate session token and CSRF token
      const sessionToken = generateSecureToken();
      const csrfToken = generateCSRFToken();
      storeCSRFToken(csrfToken);
      
      // Log the user in
      this.currentUser = user;
      this.notifyAuthListeners(user);
      
      // Store session info
      sessionStorage.setItem('wolf-den-session', JSON.stringify({
        userId: user.id,
        token: sessionToken,
        csrfToken,
        expiresAt: Date.now() + (8 * 60 * 60 * 1000) // 8 hours
      }));
      
      return user;
    }
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    sessionStorage.removeItem('wolf-den-session');
    sessionStorage.removeItem('wolf-den-csrf-token');
    this.notifyAuthListeners(null);
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Check session storage for active session
    const sessionData = sessionStorage.getItem('wolf-den-session');
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        
        // Check if session is expired
        if (session.expiresAt < Date.now()) {
          sessionStorage.removeItem('wolf-den-session');
          sessionStorage.removeItem('wolf-den-csrf-token');
          return null;
        }
        
        // Retrieve user from stored users or database
        const storedUsers = JSON.parse(localStorage.getItem('wolf-den-users') || '[]');
        const userData = storedUsers.find((u: any) => `beta-${u.email}` === session.userId);
        
        if (userData) {
          const user: User = {
            id: session.userId,
            email: userData.email,
            name: userData.name,
            role: userData.role || 'salesperson',
            createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
            settings: {
              theme: 'light' as const,
              notifications: true,
              autoSave: true,
              defaultCallObjectives: []
            }
          };
          
          this.currentUser = user;
          return user;
        }
      } catch (error) {
        console.error('Error parsing session data:', error);
        sessionStorage.removeItem('wolf-den-session');
        sessionStorage.removeItem('wolf-den-csrf-token');
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
    
    // Update user in stored users
    const storedUsers = JSON.parse(localStorage.getItem('wolf-den-users') || '[]');
    const userIndex = storedUsers.findIndex((u: any) => `beta-${u.email}` === updatedUser.id);
    if (userIndex >= 0) {
      storedUsers[userIndex] = {
        ...storedUsers[userIndex],
        settings: updatedUser.settings
      };
      localStorage.setItem('wolf-den-users', JSON.stringify(storedUsers));
    }
    
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