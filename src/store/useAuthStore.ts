// src/store/useAuthStore.ts
import { create } from 'zustand';

type AuthState = {
  isLoggedIn: boolean;
  isGuest: boolean;
  login: () => void;
  continueAsGuest: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  isGuest: false,
  login: () => {
    set({ isLoggedIn: true, isGuest: false });
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.removeItem('isGuest');
  },
  continueAsGuest: () => {
    set({ isLoggedIn: false, isGuest: true });
    localStorage.setItem('isGuest', 'true');
    localStorage.removeItem('isLoggedIn');
  },
  logout: () => {
    set({ isLoggedIn: false, isGuest: false });
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isGuest');
  },
}));
