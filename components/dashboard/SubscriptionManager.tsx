import React from 'react';
import type { User } from '../../types';
import { useNavigation } from '../../App';
import { CheckCircleIcon } from '../Icons';

interface SubscriptionManagerProps {
    user: User;
}

export const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ user }) => {
    const { navigate } = useNavigation();

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Minha Assinatura</h2>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg text-center">
                <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-800">Você tem Acesso Total e Gratuito!</h3>
                <p className="text-sm text-green-700 mt-2">
                    Todas as funcionalidades da plataforma, incluindo o gerador de documentos, assistentes de IA e calculadoras, estão liberadas em sua conta.
                </p>
                <button 
                    onClick={() => navigate('#/chat')}
                    className="mt-6 bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700"
                >
                    Começar a Usar
                </button>
            </div>
        </div>
    );
};