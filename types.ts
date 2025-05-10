export type Tree = {
    id: string;
    location: string;
    diameter: number;
    dateTracked: string;
    fruitStatus?: 'ripe' | 'unripe' | 'none';
    coordinates: {
      latitude: number;
      longitude: number;
    };
    image?: string;
  };
  
  export type User = {
    id: string;
    username: string;
    email: string;
    token: string;
    role?: 'researcher' | 'admin' | 'viewer';
  };
  
  export type AuthContextType = {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
  };
  
  export type CameraCapturedData = {
    uri: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    height?: number;
    diameter?: number;
    timestamp: Date;
  };
  
  export type Notification = {
    id: string;
    type: 'harvest' | 'alert' | 'system';
    message: string;
    date: Date;
    read: boolean;
  };
  
  // API Response Types
  export type ApiResponse<T> = {
    data?: T;
    error?: string;
    status: number;
  };
  
  export type TreeListResponse = ApiResponse<{
    trees: Tree[];
    total: number;
    page: number;
    pageSize: number;
  }>;