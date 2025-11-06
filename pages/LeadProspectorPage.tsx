import React, { useState, useEffect, useCallback } from 'react';
import type { User, Lead, LeadStatus } from '../types';
import { useToast } from '../App';
import { findLeadsOnGoogleMaps } from '../services/geminiService';
import { leadService } from '../services/leadService';
import { AccessControlOverlay } from '../components/AccessControlOverlay';
import { MagnifyingGlassIcon, MapIcon, TrashIcon, PaperAirplaneIcon, PlusCircleIcon } from '../components/Icons';
import { WhatsAppProposalModal } from '../components/prospecting/WhatsAppProposalModal';

interface LeadProspectorPageProps {
    user: User | null;
}

export const LeadProspectorPage: React.FC<LeadProspectorPageProps> = ({ user }) => {
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [foundLeads, setFoundLeads] = useState<Lead[]>([]);
    const [managedLeads, setManagedLeads] = useState<Lead[]>([]);
    const [selectedLeadForProposal, setSelectedLeadForProposal] = useState<Lead | null>(null);
    const [serviceDescription, setServiceDescription] = useState('Consultoria jurídica completa para [área de atuação].');
    
    const showToast = useToast();
    const isAllowed = !!user;

    useEffect(() => {
        // Get user's location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            () => {
                showToast({ type: 'error', message: 'Não foi possível obter sua localização. A busca pode ser menos precisa.' });
                // Fallback location (São Paulo)
                setLocation({ latitude: -23.55052, longitude: -46.633308 });
            }
        );
        // Load existing leads from local storage
        setManagedLeads(leadService.getLeads());
    }, [showToast]);

    const handleSearch = async () => {
        if (!query.trim()) {
            showToast({ type: 'error', message: 'Por favor, digite o que você está procurando.' });
            return;
        }
        if (!location) {
            showToast({ type: 'error', message: 'Aguardando localização para iniciar a busca.' });
            return;
        }
        setIsLoading(true);
        setFoundLeads([]);
        try {
            const leads = await findLeadsOnGoogleMaps(query, location);
            setFoundLeads(leads);
            showToast({ type: 'success', message: `${leads.length} leads encontrados.` });
        } catch (error) {
            showToast({ type: 'error', message: error instanceof Error ? error.message : 'Falha ao buscar leads.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddLead = (lead: Lead) => {
        const addedLead = leadService.addLead(lead);
        if (addedLead) {
            setManagedLeads(prev => [addedLead, ...prev]);
            showToast({ type: 'success', message: `${lead.name} adicionado à sua lista.` });
        } else {
            showToast({ type: 'info', message: `${lead.name} já está na sua lista.` });
        }
    };

    const handleRemoveLead = (leadId: string) => {
        const updatedLeads = leadService.removeLead(leadId);
        setManagedLeads(updatedLeads);
        showToast({ type: 'info', message: 'Lead removido.' });
    };

    const handleUpdateStatus = (leadId: string, status: LeadStatus) => {
        const updatedLeads = leadService.updateLeadStatus(leadId, status);
        setManagedLeads(updatedLeads);
    };

    return (
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Prospecção de Leads com IA</h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">Encontre clientes potenciais usando a busca do Google Maps e gere propostas personalizadas com a IA.</p>
            </div>

            <AccessControlOverlay isAllowed={isAllowed} featureName="Prospecção de Leads">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Search Panel */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><MagnifyingGlassIcon className="w-6 h-6 mr-2 text-indigo-600"/> Buscar Novos Leads</h2>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Ex: escritórios de arquitetura, restaurantes, etc."
                                className="w-full p-2 border rounded-md"
                            />
                            <button onClick={handleSearch} disabled={isLoading || !location} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">
                                {isLoading ? 'Buscando...' : 'Buscar'}
                            </button>
                        </div>
                        <div className="mt-4 bg-slate-50 p-4 rounded-lg border min-h-[300px] max-h-96 overflow-y-auto">
                             {isLoading && <p className="text-center text-slate-500">Buscando leads...</p>}
                             {!isLoading && foundLeads.length === 0 && <p className="text-center text-slate-500 pt-16">Os resultados da busca aparecerão aqui.</p>}
                             <ul className="space-y-3">
                                {foundLeads.map(lead => (
                                    <li key={lead.id} className="bg-white p-3 rounded-md border flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-sm">{lead.name}</p>
                                            <p className="text-xs text-slate-500">{lead.address}</p>
                                        </div>
                                        <button onClick={() => handleAddLead(lead)} title="Adicionar à lista" className="p-2 text-green-500 hover:bg-green-100 rounded-full"><PlusCircleIcon className="w-6 h-6"/></button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {/* Managed Leads Panel */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                         <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><MapIcon className="w-6 h-6 mr-2 text-indigo-600"/> Meus Leads</h2>
                         <div className="bg-slate-50 p-4 rounded-lg border min-h-[400px] max-h-[460px] overflow-y-auto">
                            {managedLeads.length === 0 && <p className="text-center text-slate-500 pt-16">Você ainda não adicionou nenhum lead.</p>}
                            <ul className="space-y-3">
                                {managedLeads.map(lead => (
                                    <LeadCard 
                                        key={lead.id} 
                                        lead={lead} 
                                        onStatusChange={handleUpdateStatus} 
                                        onDelete={handleRemoveLead}
                                        onPropose={() => setSelectedLeadForProposal(lead)}
                                    />
                                ))}
                            </ul>
                         </div>
                    </div>
                </div>
            </AccessControlOverlay>
            
            {selectedLeadForProposal && (
                <WhatsAppProposalModal
                    lead={selectedLeadForProposal}
                    serviceDescription={serviceDescription}
                    setServiceDescription={setServiceDescription}
                    isOpen={!!selectedLeadForProposal}
                    onClose={() => setSelectedLeadForProposal(null)}
                />
            )}
        </main>
    );
};

// --- Lead Card Component ---
const LeadCard: React.FC<{
    lead: Lead;
    onStatusChange: (id: string, status: LeadStatus) => void;
    onDelete: (id: string) => void;
    onPropose: () => void;
}> = ({ lead, onStatusChange, onDelete, onPropose }) => {
    const statuses: LeadStatus[] = ['Novo', 'Contatado', 'Qualificado', 'Perdido'];
    const statusColors: Record<LeadStatus, string> = {
        'Novo': 'bg-blue-100 text-blue-800',
        'Contatado': 'bg-yellow-100 text-yellow-800',
        'Qualificado': 'bg-green-100 text-green-800',
        'Perdido': 'bg-red-100 text-red-800',
    };
    
    return (
        <li className="bg-white p-3 rounded-md border shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-gray-800">{lead.name}</p>
                    <p className="text-xs text-slate-500">{lead.address}</p>
                </div>
                 <div className="flex items-center gap-1">
                     <select 
                        value={lead.status} 
                        onChange={e => onStatusChange(lead.id, e.target.value as LeadStatus)}
                        className={`text-xs p-1 border-0 rounded ${statusColors[lead.status]}`}
                    >
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button onClick={() => onDelete(lead.id)} className="text-slate-400 hover:text-red-500 p-1"><TrashIcon className="w-4 h-4"/></button>
                 </div>
            </div>
             <div className="mt-2 pt-2 border-t flex justify-between items-center">
                <div className="text-xs text-slate-400 truncate pr-2">
                    {lead.phone && <span>{lead.phone} {lead.website && '|'} </span>}
                    {lead.website && <a href={lead.website} target="_blank" rel="noopener noreferrer" className="hover:underline">Website</a>}
                </div>
                <button onClick={onPropose} className="flex-shrink-0 flex items-center text-sm bg-green-500 text-white font-semibold px-3 py-1 rounded-md hover:bg-green-600">
                    <PaperAirplaneIcon className="w-4 h-4 mr-1"/> Proposta
                </button>
            </div>
        </li>
    );
};
