// src/store/useAuthStore.ts
import { create } from 'zustand';

type AuthState = {
  isLoggedIn: boolean;
  isGuest: boolean;
  email: string | null;
  profileImage: string | null;
  login: (email: string, profileImage: string) => void;
  continueAsGuest: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  isGuest: false,
  email: null,
  profileImage: null,
  login: (email: string, profileImage: string) => {
    set({ isLoggedIn: true, isGuest: false, email, profileImage });
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('email', email);
    localStorage.setItem('profileImage', profileImage);
  },
  continueAsGuest: () => {
    set({ isLoggedIn: false, isGuest: true, email: null, profileImage: null });
    localStorage.setItem('isGuest', 'true');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('email');
    localStorage.removeItem('profileImage');
  },
  logout: () => {
    set({ isLoggedIn: false, isGuest: false, email: null, profileImage: null });
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('email');
    localStorage.removeItem('profileImage');
  },
}));
