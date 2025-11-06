// services/whatsappCampaignService.ts
import type { Campaign } from '../types.ts';

// ATENÇÃO: Este é um serviço de simulação.
// A integração real com a API do WhatsApp Business DEVE ser feita em um backend seguro.

const CAMPAIGNS_KEY = 'advocaciaai_whatsapp_campaigns';

const getCampaigns = (): Campaign[] => {
    try {
        const campaignsJson = localStorage.getItem(CAMPAIGNS_KEY);
        return campaignsJson ? JSON.parse(campaignsJson) : [];
    } catch (e) {
        console.error("Failed to parse WhatsApp campaigns from localStorage", e);
        return [];
    }
};

const saveCampaigns = (campaigns: Campaign[]): void => {
    try {
        localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
    } catch (e) {
        console.error("Failed to save WhatsApp campaigns to localStorage", e);
    }
};


export const whatsappCampaignService = {
    getCampaigns: (): Promise<Campaign[]> => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(getCampaigns());
            }, 300);
        });
    },

    createCampaign: (name: string, messageTemplate: string, recipientCount: number, scheduledAt?: string): Promise<Campaign> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const newCampaign: Campaign = {
                    id: Date.now().toString(),
                    name,
                    messageTemplate,
                    recipientCount,
                    status: 'draft',
                    createdAt: new Date().toISOString(),
                    scheduledAt,
                };
                const campaigns = getCampaigns();
                campaigns.unshift(newCampaign);
                saveCampaigns(campaigns);
                resolve(newCampaign);
            }, 500);
        });
    },

    sendCampaign: (campaignId: string): Promise<Campaign> => {
        return new Promise((resolve, reject) => {
            const campaigns = getCampaigns();
            const campaignIndex = campaigns.findIndex(c => c.id === campaignId);

            if (campaignIndex === -1) {
                return reject(new Error('Campanha não encontrada.'));
            }

            // Start sending
            campaigns[campaignIndex].status = 'sending';
            saveCampaigns(campaigns);

            // Simulate sending process
            setTimeout(() => {
                const currentCampaigns = getCampaigns();
                const currentCampaignIndex = currentCampaigns.findIndex(c => c.id === campaignId);
                if (currentCampaignIndex !== -1) {
                    const didFail = Math.random() < 0.1; // 10% chance of failure
                    currentCampaigns[currentCampaignIndex].status = didFail ? 'failed' : 'sent';
                    saveCampaigns(currentCampaigns);
                    if (didFail) {
                        reject(new Error('Falha simulada no envio da campanha.'));
                    } else {
                        resolve(currentCampaigns[currentCampaignIndex]);
                    }
                }
            }, 3000);
        });
    },

    deleteCampaign: (campaignId: string): Promise<void> => {
        return new Promise(resolve => {
            setTimeout(() => {
                let campaigns = getCampaigns();
                campaigns = campaigns.filter(c => c.id !== campaignId);
                saveCampaigns(campaigns);
                resolve();
            }, 300);
        });
    }
};