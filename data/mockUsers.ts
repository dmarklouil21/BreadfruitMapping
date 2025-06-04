// data/mockUsers.ts
import { User } from '@/types';  // Direct file reference
export const mockUsers: User[] = [
  { 
    id: '1', 
    name: 'Mortred', 
    username: '', 
    email: 'admin@ctu.edu', 
    role: 'admin', 
    image: '', 
    dateJoined: '2023-01-15', 
    token: ''
  },
  { 
    id: '2', 
    name: 'Yaphets', 
    username: '', 
    email: 'researcher@ctu.edu', 
    role: 'researcher', 
    image: '', 
    dateJoined: '2023-03-22', 
    token: ''
  },
  { 
    id: '3', 
    name: 'Nortrom', 
    username: '', 
    email: 'viewer@ctu.edu', 
    role: 'viewer', 
    image: '', 
    dateJoined: '2023-05-10', 
    token: ''
  },
];