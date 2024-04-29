import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useUserStore = create(
  persist(
    (set) => ({
      age: 1,
      seconds: 0,
      eventShowed: [],
      lastLoggedInAt: '',
      increaseAge: () => set((state) => ({ age: state.age + 1 })),
      setEventShowed: (newEvent) => set((state) => ({ eventShowed: [newEvent, ...eventShowed] })),
      setAge: (age) => set((state) => ({ age })),
      setSeconds: (newAge) => set((state) => ({ seconds: newAge })),
      setLastLoggedIn: (newDate) => set((state) => ({ lastLoggedInAt: newDate })),
      reset: () => set((state) => ({ age: 1, seconds: 0, eventShowed: [] })),
    }),
    {
      name: 'user-storage', // unique name
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
