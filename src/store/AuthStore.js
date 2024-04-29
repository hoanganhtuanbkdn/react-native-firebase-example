import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create(
  persist(
    (set) => ({
      isLogged: false,
      profile: {},
      loginSuccess: (newProfile) => set((state) => ({ profile: newProfile, isLogged: true })),
      logout: () => set((state) => ({ newProfile: {}, isLogged: false })),
      setProfile: (newProfile) => set((state) => ({ profile: newProfile })),
    }),
    {
      name: 'auth-storage', // unique name
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
