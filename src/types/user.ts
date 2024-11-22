export interface User {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'teacher' | 'admin';
  }
  // src/types/user.ts

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}
