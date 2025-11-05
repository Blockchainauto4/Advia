import React from 'react';
import { CheckIcon, SparklesIcon } from '../components/Icons';
import { planos, Plan } from '../configs/planosConfig';
import { useCheckout, useNavigation } from '../App';
import type { User } from '../types';
import { useToast } from '../App';

interface PlanosPageProps {
  user: User | null;
}

export const PlanosPage: React.FC<PlanosPageProps> = ({ user }) => {
  const { openCheckoutModal } = useCheckout();
  const showToast = useToast();
  const { navigate } = useNavigation();

  const handleSubscription = (plan: Plan) => {
    if (!user) {
      showToast({ type: 'info', message: 'Faça login para iniciar o teste.' });
      navigate('#/auth');
      return;
    }
    if (user.subscription) {
      showToast({ type: 'info', message: 'Você já possui uma assinatura ativa.' });
      return;
    }
    openCheckoutModal(plan);
  };

  const userPlan = user?.subscription ? planos.find(p => p.id === user.subscription.planId) : null;

  return (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {userPlan ? (
         <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
            <SparklesIcon className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Você é um assinante {userPlan.name}!</h1>
            <p className="text-gray-600">
                Seu período de teste termina em: <strong>{new Date(user.subscription.trialEnds).toLocaleDateString('pt-BR')}</strong>.
            </p>
             <p className="mt-4 text-sm text-slate-500">Explore todas as funcionalidades que preparamos para você.</p>
        </div>
      ) : (
        <>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Planos Flexíveis para Potencializar sua Advocacia</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Escolha o plano anual com desconto e tenha acesso a ferramentas de IA de ponta.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {planos.map(plan => (
              <div 
                key={plan.id}
                className={`bg-white rounded-lg shadow-lg p-8 flex flex-col h-full relative ${plan.highlight ? 'border-2 border-indigo-500 transform lg:scale-105' : 'border'}`}
              >
                {plan.highlight && (
                  <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase self-center absolute -top-4">Mais Popular</span>
                )}
                <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">{plan.name}</h3>
                <p className="text-gray-500 text-center mb-6 h-12">{plan.description}</p>
                
                <div className="text-center mb-6">
                  <span className="text-lg font-bold text-indigo-600">Teste grátis por {plan.trialDays} dias</span>
                  <br />
                  <span className="text-5xl font-extrabold text-gray-900">
                    R${(plan.price / 12).toFixed(0)}
                  </span>
                  <span className="text-lg font-medium text-gray-500">/mês</span>
                  <p className="text-sm font-semibold text-gray-700 mt-1">
                    Após o teste, pague R${plan.price.toLocaleString('pt-BR')} por ano
                  </p>
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscription(plan)}
                  className={`w-full font-bold py-3 px-6 rounded-lg transition-colors text-lg ${
                    plan.highlight 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                    : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                  }`}
                >
                  Iniciar Teste Gratuito
                </button>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12 text-sm text-slate-600">
              <p>Dúvidas? <a href="#/contato" onClick={(e) => { e.preventDefault(); navigate('#/contato'); }} className="text-indigo-600 font-medium hover:underline">Fale conosco</a>.</p>
          </div>
        </>
      )}
    </main>
  );
};