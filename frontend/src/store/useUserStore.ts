import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'SELLER' | 'ADMIN';
}

interface UserState {
  user?: User;
  token?: string;
  setAuth: (user: User, token: string) => void;
  setUser: (user?: User) => void;
  hydrateToken: () => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: undefined,
  token: undefined,
  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
    set({ user, token });
  },
  setUser: (user) => set((state) => ({ ...state, user })),
  hydrateToken: () => {
    if (typeof window === 'undefined') {
      return;
    }

    const token = localStorage.getItem('token') || undefined;
    set((state) => ({ ...state, token }));
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    set({ user: undefined, token: undefined });
  }
}));

