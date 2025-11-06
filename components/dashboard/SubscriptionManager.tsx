import React from 'react';
import type { User } from '../../types';

interface SubscriptionManagerProps {
    user: User;
}

export const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ user }) => {

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Minha Assinatura</h2>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <p className="font-semibold text-gray-800">Plano Atual</p>
                        <p className="text-2xl font-bold text-indigo-600">Acesso Gratuito</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">Ativo</span>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                    Você possui acesso completo a todas as ferramentas da AdvocaciaAI. Aproveite para explorar o chat, gerar documentos e utilizar nossas calculadoras.
                </p>
                <div className="mt-6 border-t pt-6">
                     <h3 className="text-base font-semibold text-gray-700">Gerenciamento de Pagamentos</h3>
                     <p className="text-sm text-gray-500 mt-2">
                         Em breve, implementaremos nosso sistema de pagamentos via <strong>Mercado Pago Checkout Pro</strong>. Você poderá gerenciar suas futuras assinaturas e métodos de pagamento com total segurança diretamente por aqui.
                     </p>
                     <button disabled className="mt-4 w-full sm:w-auto bg-slate-300 text-slate-500 font-bold py-2 px-4 rounded-md cursor-not-allowed">
                        Gerenciar Assinatura (em breve)
                    </button>
                </div>
            </div>
        </div>
    );
};