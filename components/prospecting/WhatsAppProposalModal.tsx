import React, { useState, useEffect } from 'react';
import type { Lead } from '../../types';
import { useToast } from '../../App';
import { generateLeadProposal } from '../../services/geminiService';
import { XMarkIcon, SparklesIcon, WhatsAppIcon, ClipboardIcon } from '../Icons';

interface WhatsAppProposalModalProps {
  lead: Lead | null;
  serviceDescription: string;
  setServiceDescription: (desc: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppProposalModal: React.FC<WhatsAppProposalModalProps> = ({
  lead,
  serviceDescription,
  setServiceDescription,
  isOpen,
  onClose,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [proposal, setProposal] = useState('');
    const showToast = useToast();

    useEffect(() => {
        // Reset proposal when lead changes
        setProposal('');
    }, [lead]);

    if (!isOpen || !lead) return null;

    const handleGenerate = async () => {
        setIsLoading(true);
        setProposal('');
        try {
            const result = await generateLeadProposal(lead, serviceDescription);
            setProposal(result);
        } catch (error) {
            showToast({ type: 'error', message: error instanceof Error ? error.message : 'Falha ao gerar proposta.' });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopy = () => {
        if (!proposal) return;
        navigator.clipboard.writeText(proposal);
        showToast({ type: 'success', message: 'Proposta copiada!' });
    };

    const handleSendWhatsApp = () => {
        if (!proposal) return;
        const text = encodeURIComponent(proposal);
        const phone = lead.phone ? lead.phone.replace(/\D/g, '') : '';
        // Assuming Brazilian numbers, prepending country code 55 if not present.
        const fullPhone = phone.startsWith('55') ? phone : `55${phone}`;
        const url = `https://wa.me/${phone ? fullPhone : ''}?text=${text}`;
        window.open(url, '_blank');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-auto" role="dialog" aria-modal="true">
                <div className="relative p-6 sm:p-8">
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800">Gerar Proposta para WhatsApp</h2>
                    <p className="text-sm text-gray-600 mt-1">Lead: <span className="font-semibold">{lead.name}</span></p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        {/* Left Side: Inputs */}
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="service-desc" className="block text-sm font-medium text-gray-700">Descrição do Serviço/Oferta</label>
                                <textarea
                                    id="service-desc"
                                    value={serviceDescription}
                                    onChange={e => setServiceDescription(e.target.value)}
                                    rows={5}
                                    className="mt-1 w-full p-2 border rounded-md"
                                />
                            </div>
                            <button onClick={handleGenerate} disabled={isLoading} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex justify-center items-center">
                                {isLoading ? 'Gerando...' : <><SparklesIcon className="w-5 h-5 mr-2" /> Gerar Mensagem</>}
                            </button>
                        </div>
                        {/* Right Side: Output */}
                        <div className="bg-slate-50 p-4 rounded-lg border flex flex-col">
                            <h3 className="font-bold mb-2">Mensagem Gerada</h3>
                            <div className="flex-grow bg-white border rounded-md p-2 h-48 overflow-y-auto">
                                 {isLoading && <p className="text-center text-slate-500 pt-16">Aguarde...</p>}
                                 {proposal ? (
                                    <p className="whitespace-pre-wrap text-sm">{proposal}</p>
                                 ) : (
                                    !isLoading && <p className="text-center text-slate-400 pt-16">A proposta aparecerá aqui.</p>
                                 )}
                            </div>
                            <div className="mt-4 flex gap-2">
                                <button onClick={handleCopy} disabled={!proposal} className="flex-1 flex items-center justify-center gap-2 bg-slate-600 text-white font-semibold py-2 px-3 rounded-md hover:bg-slate-700 disabled:bg-slate-400">
                                    <ClipboardIcon className="w-4 h-4"/> Copiar
                                </button>
                                <button onClick={handleSendWhatsApp} disabled={!proposal} className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white font-semibold py-2 px-3 rounded-md hover:bg-green-600 disabled:bg-green-300">
                                    <WhatsAppIcon className="w-4 h-4"/> Enviar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
