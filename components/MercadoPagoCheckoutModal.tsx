import React, { useState } from 'react';
// FIX: Import Plan type from the central types file.
import type { Plan, User } from '../types';
import { CreditCardIcon, LockClosedIcon, XMarkIcon } from './Icons';
import { mercadoPagoService } from '../services/mercadoPagoService';
import { useToast } from '../App';


interface MercadoPagoCheckoutModalProps {
  plan: Plan;
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (planId: string) => void;
}

export const MercadoPagoCheckoutModal: React.FC<MercadoPagoCheckoutModalProps> = ({
  plan,
  user,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardName, setCardName] = useState(user.name);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const showToast = useToast();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!cardName.trim()) newErrors.cardName = 'O nome é obrigatório.';
    if (!/^\d{13,16}$/.test(cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Número de cartão inválido.';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) newErrors.cardExpiry = 'Formato de validade inválido (MM/AA).';
    if (!/^\d{3,4}$/.test(cardCVC)) newErrors.cardCVC = 'CVV inválido.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
        return;
    }

    setIsProcessing(true);
    
    try {
      // 1. Simula a chamada ao backend para criar a preferência de pagamento
      const { preferenceId } = await mercadoPagoService.createPreference(plan, user);

      // 2. Em um app real, aqui você usaria o SDK do Mercado Pago com o preferenceId
      // para renderizar o botão de pagamento ou redirecionar o usuário.
      // Ex: const mp = new MercadoPago('PUBLIC_KEY'); mp.checkout({ preference: { id: preferenceId } });
      console.log('[SIMULAÇÃO] Redirecionando para checkout do Mercado Pago com a preferência:', preferenceId);

      // 3. Simula o usuário completando o pagamento no site do Mercado Pago e sendo redirecionado de volta.
      setTimeout(() => {
        onPaymentSuccess(plan.id);
         // O fechamento do modal e o toast são tratados no App.tsx
      }, 2000); // Simula o tempo que o usuário leva para pagar

    } catch (error) {
       console.error("Erro ao simular a criação da preferência:", error);
       showToast({ type: 'error', message: 'Não foi possível iniciar o pagamento. Tente novamente.' });
       setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-auto" role="dialog" aria-modal="true">
        <div className="relative p-6 sm:p-8">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <XMarkIcon className="w-6 h-6" />
            </button>
            <div className="text-center">
                 <img src="https://logospng.org/download/mercado-pago/logo-mercado-pago-256.png" alt="Mercado Pago" className="w-32 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">Finalizar Assinatura</h2>
                <p className="text-sm text-gray-600 mt-1">Plano <span className="font-semibold">{plan.name}</span> para <span className="font-semibold">{user.email}</span></p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 my-6 text-center">
                <p className="text-gray-700">
                    Você está ativando um teste de <strong className="text-indigo-600">{plan.trialDays} dias</strong>.
                </p>
                <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-800">R$0,00</span>
                    <span className="text-gray-600"> a pagar hoje</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    Após o teste, a cobrança mensal de {plan.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} será efetuada.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">Nome no cartão</label>
                    <input type="text" id="cardName" value={cardName} onChange={e => setCardName(e.target.value)} className="mt-1 w-full p-2 border rounded-md" />
                    {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
                </div>
                <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Número do cartão</label>
                    <div className="relative">
                        <input type="text" id="cardNumber" value={cardNumber} onChange={e => setCardNumber(e.target.value)} className="mt-1 w-full p-2 border rounded-md pr-10" placeholder="0000 0000 0000 0000" />
                        <CreditCardIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </div>
                    {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700">Validade (MM/AA)</label>
                        <input type="text" id="cardExpiry" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} className="mt-1 w-full p-2 border rounded-md" placeholder="MM/AA" />
                        {errors.cardExpiry && <p className="text-red-500 text-xs mt-1">{errors.cardExpiry}</p>}
                    </div>
                     <div>
                        <label htmlFor="cardCVC" className="block text-sm font-medium text-gray-700">CVV</label>
                        <input type="text" id="cardCVC" value={cardCVC} onChange={e => setCardCVC(e.target.value)} className="mt-1 w-full p-2 border rounded-md" placeholder="123" />
                        {errors.cardCVC && <p className="text-red-500 text-xs mt-1">{errors.cardCVC}</p>}
                    </div>
                </div>
                 <button type="submit" disabled={isProcessing} className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300 flex justify-center items-center">
                    {isProcessing ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Processando...
                        </>
                    ) : (
                        `Pagar com segurança e iniciar teste`
                    )}
                 </button>
            </form>
            <p className="text-xs text-slate-500 text-center mt-4 flex items-center justify-center gap-1">
                 <LockClosedIcon className="w-3 h-3"/> Checkout seguro. Esta é uma transação simulada.
            </p>
        </div>
      </div>
    </div>
  );
};
