// services/mercadoPagoService.ts
// FIX: Import Plan type from the central types file.
import type { Plan, User } from '../types';

// ATENÇÃO: Este é um serviço de simulação.
// Em uma aplicação real, esta função faria uma chamada a um backend seguro (ex: uma Vercel Serverless Function)
// que usaria o Access Token (configurado como uma Environment Variable) para se comunicar com a API do Mercado Pago.
// O Access Token NUNCA deve ser exposto no frontend.

interface CreatePreferenceResponse {
  preferenceId: string;
}

export const mercadoPagoService = {
  createPreference: async (plan: Plan, user: User): Promise<CreatePreferenceResponse> => {
    console.log('[SIMULAÇÃO] Criando preferência de pagamento para o plano:', plan.name);

    // Aqui, o frontend enviaria os dados do plano/usuário para o seu backend.
    // Ex: const response = await fetch('/api/create-preference', { method: 'POST', body: JSON.stringify({ planId: plan.id, userEmail: user.email }) });
    // O backend, usando o Access Token secreto, criaria a preferência no Mercado Pago e retornaria o ID.

    return new Promise((resolve) => {
      setTimeout(() => {
        const mockPreferenceId = `pref_${Date.now()}`;
        console.log('[SIMULAÇÃO] Preferência criada com ID:', mockPreferenceId);
        resolve({ preferenceId: mockPreferenceId });
      }, 1500); // Simula a latência da rede para o backend
    });
  },
};
