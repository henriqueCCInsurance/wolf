import { User, LoginCredentials } from '@/types';

// Mock users for development
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@campbellco.com',
    name: 'Sarah Johnson',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332ad04?w=100&h=100&fit=crop&crop=face',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date(),
    settings: {
      theme: 'light',
      notifications: true,
      autoSave: true,
      defaultCallObjectives: ['meeting-booked', 'follow-up']
    }
  },
  {
    id: '2',
    email: 'john.smith@campbellco.com',
    name: 'John Smith',
    role: 'salesperson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date(),
    settings: {
      theme: 'light',
      notifications: true,
      autoSave: true,
      defaultCallObjectives: ['meeting-booked', 'intelligence']
    }
  },
  {
    id: '3',
    email: 'maria.garcia@campbellco.com',
    name: 'Maria Garcia',
    role: 'salesperson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    createdAt: new Date('2024-02-01'),
    lastLogin: new Date(),
    settings: {
      theme: 'dark',
      notifications: false,
      autoSave: true,
      defaultCallObjectives: ['meeting-booked', 'referral']
    }
  },
  {
    id: '4',
    email: 'alex.chen@campbellco.com',
    name: 'Alex Chen',
    role: 'salesperson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    createdAt: new Date('2024-02-15'),
    lastLogin: new Date(),
    settings: {
      theme: 'light',
      notifications: true,
      autoSave: false,
      defaultCallObjectives: ['meeting-booked', 'follow-up', 'intelligence']
    }
  }
];

class AuthService {
  private currentUser: User | null = null;

  // Simulate API call delay
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async login(credentials: LoginCredentials): Promise<User> {
    await this.delay(1000); // Simulate API call

    // Mock authentication - in production, this would verify with backend
    const user = mockUsers.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Mock password validation (all passwords are "password123" for demo)
    if (credentials.password !== 'password123') {
      throw new Error('Invalid email or password');
    }

    // Update last login
    user.lastLogin = new Date();
    this.currentUser = user;
    
    // Store in localStorage for persistence
    localStorage.setItem('wolf_den_user', JSON.stringify(user));
    
    return user;
  }

  async logout(): Promise<void> {
    await this.delay(500);
    this.currentUser = null;
    localStorage.removeItem('wolf_den_user');
  }

  async getCurrentUser(): Promise<User | null> {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('wolf_den_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUser = user;
        return user;
      } catch (error) {
        localStorage.removeItem('wolf_den_user');
      }
    }
    return null;
  }

  async updateUserSettings(userId: string, settings: Partial<User['settings']>): Promise<User> {
    await this.delay(500);
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    mockUsers[userIndex].settings = { ...mockUsers[userIndex].settings!, ...settings };
    this.currentUser = mockUsers[userIndex];
    
    localStorage.setItem('wolf_den_user', JSON.stringify(this.currentUser));
    
    return this.currentUser;
  }

  async getAllUsers(): Promise<User[]> {
    await this.delay(800);
    return mockUsers.filter(u => u.role === 'salesperson');
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    await this.delay(1000);
    
    const newUser: User = {
      ...userData,
      id: (mockUsers.length + 1).toString(),
      createdAt: new Date(),
      settings: {
        theme: 'light',
        notifications: true,
        autoSave: true,
        defaultCallObjectives: ['meeting-booked']
      }
    };

    mockUsers.push(newUser);
    return newUser;
  }

  async deleteUser(userId: string): Promise<void> {
    await this.delay(500);
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    mockUsers.splice(userIndex, 1);
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