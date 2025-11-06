// services/gruposService.ts
import { gruposPorEstado as initialGrupos } from '../configs/gruposConfig';
import type { StateGroups } from '../types';

const GRUPOS_KEY = 'advocaciaai_whatsapp_groups';

const getFromStorage = (): StateGroups[] | null => {
    try {
        const data = localStorage.getItem(GRUPOS_KEY);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error("Failed to parse groups from localStorage", e);
        return null;
    }
};

const saveToStorage = (data: StateGroups[]): void => {
    try {
        localStorage.setItem(GRUPOS_KEY, JSON.stringify(data));
    } catch (e) {
        console.error("Failed to save groups to localStorage", e);
    }
};

export const gruposService = {
    getGruposPorEstado: (): Promise<StateGroups[]> => {
        return new Promise(resolve => {
            setTimeout(() => {
                let data = getFromStorage();
                if (!data) {
                    // Seed with initial data if nothing is in storage
                    data = initialGrupos;
                    saveToStorage(data);
                }
                resolve(data);
            }, 200); // Simulate async fetch
        });
    },

    saveGruposPorEstado: (data: StateGroups[]): Promise<void> => {
        return new Promise(resolve => {
            setTimeout(() => {
                saveToStorage(data);
                resolve();
            }, 200); // Simulate async save
        });
    }
};