// AppContext.tsx
import { createContext, useContext } from 'react';
import type { ToastMessage, NavigationContextType } from './types';

export const NavigationContext = createContext<NavigationContextType | null>(null);
export const ToastContext = createContext<(toast: Omit<ToastMessage, 'id'>) => void>(() => {});

export const useNavigation = (): NavigationContextType => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useNavigation must be used within a NavigationProvider. Make sure your component is wrapped in the App tree.');
    }
    return context;
};

export const useToast = () => useContext(ToastContext);
