import React from 'react';
import type { User, Plan } from '../../types';
import { planos } from '../../configs/planosConfig';
import { useCheckout, useNavigation } from '../../App';
import { CheckIcon, SparklesIcon } from '../Icons';

interface SubscriptionManagerProps {
    user: User;
}

export const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ user }) => {
    const { navigate } = useNavigation();
    const { openCheckoutModal } = useCheckout();
    
    const userPlan = user.subscription ? planos.find(p => p.id === user.subscription.planId) : null;
    const upgradePlans = planos.filter(p => userPlan ? p.price > userPlan.price : true);

    if (!userPlan) {
        return (
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Minha Assinatura</h2>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
                    <p className="text-slate-700">Você ainda não possui uma assinatura ativa.</p>
                    <p className="text-sm text-slate-500 mt-1">Desbloqueie todo o potencial da AdvocaciaAI.</p>
                    <button onClick={() => navigate('#/planos')} className="mt-4 bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">
                        Ver Planos
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Minha Assinatura</h2>
            
            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-semibold text-indigo-800">Seu Plano Atual: {userPlan.name}</h3>
                {user.subscription.trialEnds && (
                    <p className="text-sm text-indigo-700 mt-1">
                        Seu período de teste termina em: <strong>{new Date(user.subscription.trialEnds).toLocaleDateString('pt-BR')}</strong>.
                    </p>
                )}
            </div>

            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Fazer Upgrade</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {upgradePlans.length > 0 ? upgradePlans.map(plan => (
                        <div key={plan.id} className="border rounded-lg p-6 flex flex-col">
                            <h4 className="text-lg font-bold text-gray-800">{plan.name}</h4>
                             <div className="my-4">
                                <span className="text-4xl font-extrabold text-gray-900">
                                    R${plan.price.toLocaleString('pt-BR')}
                                </span>
                                <span className="text-md font-medium text-gray-500">/mês</span>
                            </div>
                            <ul className="space-y-2 mb-6 text-sm flex-grow">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-start">
                                    <CheckIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-1" />
                                    <span className="text-gray-600">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => openCheckoutModal(plan)} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">
                                Fazer Upgrade
                            </button>
                        </div>
                    )) : (
                         <div className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
                            <SparklesIcon className="w-10 h-10 text-indigo-500 mx-auto mb-2" />
                            <p className="text-slate-700 font-semibold">Você já está no nosso melhor plano!</p>
                            <p className="text-sm text-slate-500 mt-1">Agradecemos por ser um assinante Premium.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
