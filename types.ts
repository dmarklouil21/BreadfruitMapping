export type User = {
  uid: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  status: string;
  joined: string;
};

export type Tree = {
  treeID: string;
  city: string;
  barangay: string;
  diameter: number;
  dateTracked: string;
  fruitStatus: 'ripe' | 'unripe' | 'none';
  coordinates: {
    latitude: number;
    longitude: number;
  };
  image?: string;
  status: string;
  trackedBy: string; 
};

export type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  initialized: boolean;
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