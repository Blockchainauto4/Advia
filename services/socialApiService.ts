// services/socialApiService.ts
import type { SocialPost } from '../types';

// ATENÇÃO: Este é um serviço de simulação.
// A integração real com APIs de redes sociais (TikTok, Instagram, etc.)
// DEVE ser feita em um backend seguro para proteger chaves de API e tokens.

const SOCIAL_CONNECTIONS_KEY = 'advocaciaai_social_connections';
const TIKTOK_CONNECTION_KEY = 'advocaciaai_tiktok_connection';

export const socialApiService = {
    /**
     * Retorna uma lista de IDs de plataformas conectadas.
     */
    getConnectedPlatforms: (): string[] => {
        const connectionsJson = localStorage.getItem(SOCIAL_CONNECTIONS_KEY);
        return connectionsJson ? JSON.parse(connectionsJson) : [];
    },

    /**
     * Simula a conexão com uma plataforma social.
     * @param platformId - O ID da plataforma (ex: 'tiktok').
     */
    connectPlatform: (platformId: string): Promise<void> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const connected = socialApiService.getConnectedPlatforms();
                if (!connected.includes(platformId)) {
                    connected.push(platformId);
                    localStorage.setItem(SOCIAL_CONNECTIONS_KEY, JSON.stringify(connected));
                }
                resolve();
            }, 1000); // Simula uma requisição de rede
        });
    },

    /**
     * Simula a desconexão de uma plataforma social.
     * @param platformId - O ID da plataforma a ser desconectada.
     */
    disconnectPlatform: (platformId: string): Promise<void> => {
        return new Promise(resolve => {
            setTimeout(() => {
                let connected = socialApiService.getConnectedPlatforms();
                connected = connected.filter(p => p !== platformId);
                localStorage.setItem(SOCIAL_CONNECTIONS_KEY, JSON.stringify(connected));
                resolve();
            }, 500);
        });
    },

    // --- TikTok Specific Simulations ---

    getTikTokConnection: (): { open_id: string; display_name: string; avatar_url: string } | null => {
        const connectionJson = localStorage.getItem(TIKTOK_CONNECTION_KEY);
        return connectionJson ? JSON.parse(connectionJson) : null;
    },
    
    connectToTikTok: (): Promise<{ open_id: string; display_name: string; avatar_url: string }> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const mockConnection = {
                    open_id: 'advocaciaai-user-123',
                    display_name: 'AdvocaciaAI User',
                    avatar_url: 'https://i.pravatar.cc/150?u=tiktok'
                };
                localStorage.setItem(TIKTOK_CONNECTION_KEY, JSON.stringify(mockConnection));
                resolve(mockConnection);
            }, 1000);
        });
    },

    disconnectFromTikTok: (): Promise<void> => {
        return new Promise(resolve => {
            setTimeout(() => {
                localStorage.removeItem(TIKTOK_CONNECTION_KEY);
                resolve();
            }, 500);
        });
    },

    postToTikTok: (post: SocialPost): Promise<{ share_url: string }> => {
         console.log('[SIMULATION] Posting to TikTok:', post);
         return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() < 0.1) { // 10% chance of failure
                    reject(new Error('API do TikTok simulou uma falha. Tente novamente.'));
                } else {
                    resolve({ share_url: `https://www.tiktok.com/@advocacia.ai/video/${Date.now()}` });
                }
            }, 2500);
        });
    }
};