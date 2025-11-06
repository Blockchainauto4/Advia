// services/mercadoPagoService.ts
import type { User } from '../types.ts';

// ATENÇÃO: Este é um serviço de simulação para o Mercado Pago Checkout Pro.
// Em uma aplicação real, esta função faria uma chamada a um backend seguro.
// O fluxo correto é:
// 1. O frontend solicita a criação de uma preferência de pagamento ao backend.
// 2. O backend, usando o Access Token (segredo), se comunica com a API do Mercado Pago.
// 3. A API do Mercado Pago retorna um objeto de preferência, que inclui uma URL de pagamento (`init_point`).
// 4. O backend retorna essa `init_point` para o frontend.
// 5. O frontend redireciona o usuário para a `init_point`, onde o pagamento é concluído de forma segura.
// O Access Token NUNCA deve ser exposto no frontend.

interface CreatePreferenceResponse {
  initPoint: string; // URL para redirecionar o usuário para o checkout
}

export const mercadoPagoService = {
  createPreference: async (plan: any, user: User): Promise<CreatePreferenceResponse> => {
    console.log('[SIMULAÇÃO] Criando preferência de pagamento para o plano:', plan.name);

    // Simula a chamada ao backend que retornaria a URL de checkout.
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockInitPoint = `https://www.mercadopago.com.br/sandbox/init-point/12345-abcdefg/pro`;
        console.log('[SIMULAÇÃO] Preferência criada com init_point:', mockInitPoint);
        resolve({ initPoint: mockInitPoint });
      }, 1500); // Simula a latência da rede para o backend
    });
  },
};