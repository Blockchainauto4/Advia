import React, { useState } from 'react';
import type { User } from '../types.ts';
import { XMarkIcon, ClipboardIcon } from './Icons.tsx';
import { useToast } from '../App.tsx';

interface PixCheckoutModalProps {
  plan: any;
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (planId: string) => void;
}

const mockPixCode = '00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-4266554400005204000053039865802BR5925Bruno Audric B. Rizk6009SAO PAULO62070503***6304E2B2';

export const PixCheckoutModal: React.FC<PixCheckoutModalProps> = ({
  plan,
  user,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const showToast = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(mockPixCode);
    showToast({ type: 'success', message: 'Código Pix copiado!' });
  };
  
  const handleConfirmPayment = () => {
    setIsProcessing(true);
    // Simula a verificação do pagamento (webhook do backend)
    setTimeout(() => {
      onPaymentSuccess(plan.id);
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm mx-auto" role="dialog" aria-modal="true">
        <div className="relative p-6 sm:p-8">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <XMarkIcon className="w-6 h-6" />
            </button>
            <div className="text-center">
                <img src="https://logospng.org/download/pix/logo-pix-1024.png" alt="Pix" className="w-16 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">Pague com Pix</h2>
                <p className="text-sm text-gray-600 mt-1">Plano <span className="font-semibold">{plan.name}</span></p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 my-6 text-center">
                <p className="text-sm text-gray-700">Valor da primeira mensalidade:</p>
                <div className="mt-1">
                    <span className="text-3xl font-bold text-gray-800">{plan.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                 <p className="text-xs text-gray-500 mt-1">
                    Inclui {plan.trialDays} dias de teste gratuito.
                </p>
            </div>
            
            <div className="flex flex-col items-center">
                {/* Simulated QR Code */}
                <div className="p-3 bg-white border rounded-lg shadow-inner">
                    <svg width="180" height="180" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h50v50H0V0Zm12.5 12.5h25v25h-25v-25Z M200 0h50v50h-50V0Zm-25 12.5h-25v25h25v-25Z M0 200h50v50H0v-50Zm12.5-25h25v25h-25v-25Z M100 0h25v25h-25V0Z M75 25h25v25H75V25Z M50 50h25v25H50V50Z M25 75h25v25H25V75Z m125 0h25v25h-25V75Z m-25-25h25v25h-25V50Z m-25-25h25v25h-25V25Z m-50 75h25v25H50v-25Z M125 100h25v25h-25v-25Z m-25 25h25v25h-25v-25Z m25 25h25v25h-25v-25Z m25-100h25v25h-25V50Z M225 50h25v25h-25V50Z m-25 25h25v25h-25V75Z M225 100h25v25h-25v-25Z m-50 25h25v25h-25v-25Z M125 225h25v25h-25v-25Z M75 175h25v25H75v-25Z m25 25h25v25h-25v-25Z m-75 25h25v25H50v-25Z" fill="#333"/></svg>
                </div>
                <p className="text-sm text-slate-600 mt-3">1. Escaneie o código QR com seu app.</p>
                
                <div className="relative flex py-3 items-center w-full">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink mx-4 text-slate-400 text-xs">OU</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <p className="text-sm text-slate-600 mb-2">2. Copie o código e pague no seu app.</p>
                <div className="relative w-full">
                    <input type="text" readOnly value={mockPixCode} className="w-full text-xs bg-slate-100 border rounded-md p-2 pr-10 truncate"/>
                    <button onClick={handleCopy} className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:bg-slate-200 rounded-md">
                        <ClipboardIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="mt-8">
                <button 
                    onClick={handleConfirmPayment}
                    disabled={isProcessing}
                    className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-green-400 flex items-center justify-center"
                >
                    {isProcessing ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Verificando Pagamento...
                        </>
                    ) : (
                        `Já paguei, confirmar`
                    )}
                 </button>
            </div>
            
        </div>
      </div>
    </div>
  );
};
