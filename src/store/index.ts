import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AppState } from '@/types';
import { getThemeFromStorage, setThemeInStorage, applyThemeToDocument } from '@/styles/theme';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

interface ThemeStore {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  initializeTheme: () => void;
}

interface AppStore extends AppState {
  setLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

// Auth Store
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user: User) => {
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false 
        });
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
        // Clear other stores if needed
        localStorage.removeItem('dashmonster-auth-storage');
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ 
            user: { 
              ...currentUser, 
              ...userData,
              updatedAt: new Date().toISOString()
            } 
          });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'dashmonster-auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Theme Store
export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'light',

      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        setThemeInStorage(newTheme);
        applyThemeToDocument(newTheme);
      },

      setTheme: (theme: 'light' | 'dark') => {
        set({ theme });
        setThemeInStorage(theme);
        applyThemeToDocument(theme);
      },

      initializeTheme: () => {
        const storedTheme = getThemeFromStorage();
        set({ theme: storedTheme });
        applyThemeToDocument(storedTheme);
      },
    }),
    {
      name: 'dashmonster-theme-storage',
      partialize: (state) => ({
        theme: state.theme,
      }),
    }
  )
);

// Combined App Store (if you prefer a single store)
export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      user: null,
      theme: 'light',
      isLoading: false,

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setUser: (user: User | null) => {
        set({ user });
      },

      setTheme: (theme: 'light' | 'dark') => {
        set({ theme });
        setThemeInStorage(theme);
        applyThemeToDocument(theme);
      },
    }),
    {
      name: 'dashmonster-app-storage',
      partialize: (state) => ({
        user: state.user,
        theme: state.theme,
      }),
    }
  )
);

// Utility functions for stores
export const useIsAdmin = () => {
  const user = useAuthStore((state) => state.user);
  return user?.role === 'Admin';
};

export const useIsAccountHolder = () => {
  const user = useAuthStore((state) => state.user);
  return user?.role === 'AccountHolder';
};

export const useIsBeneficiary = () => {
  const user = useAuthStore((state) => state.user);
  return user?.role === 'Beneficiary';
};

export const useIsOperator = () => {
  const user = useAuthStore((state) => state.user);
  return user?.role === 'Operator';
};

export const useUserRole = () => {
  const user = useAuthStore((state) => state.user);
  return user?.role;
};

export const useOrganizationId = () => {
  const user = useAuthStore((state) => state.user);
  return user?.organizationId;
};
