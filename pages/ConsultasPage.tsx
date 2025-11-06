
import React, { useState } from 'react';
import { consultas } from '../configs/consultasConfig';
import type { User } from '../types';
import { AccessControlOverlay } from '../components/AccessControlOverlay';
import { BriefcaseIcon } from '../components/Icons';

interface ConsultasPageProps {
    user: User | null;
}

export const ConsultasPage: React.FC<ConsultasPageProps> = ({ user }) => {
    const [selectedConsultaId, setSelectedConsultaId] = useState<string>(consultas[0].id);

    const selectedConsulta = consultas.find(c => c.id === selectedConsultaId);
    const isAllowed = !!user?.subscription;

    return (
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Central de Consultas Públicas</h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">Agilize suas verificações e obtenha dados públicos essenciais com a ajuda da IA para análises preliminares.</p>
            </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: List */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Tipos de Consulta</h2>
                        <ul className="space-y-2">
                            {consultas.map(consulta => (
                                <li key={consulta.id}>
                                    <button
                                        onClick={() => setSelectedConsultaId(consulta.id)}
                                        className={`w-full text-left p-4 rounded-md transition-colors flex items-center gap-4 ${selectedConsultaId === consulta.id ? 'bg-indigo-100 text-indigo-800 font-semibold' : 'hover:bg-slate-100 text-slate-700'}`}
                                    >
                                        <div className="text-indigo-600 flex-shrink-0">{consulta.icon}</div>
                                        <div>
                                            <span className="font-semibold">{consulta.name}</span>
                                            <p className="text-xs text-slate-500">{consulta.description}</p>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Column: View */}
                <div className="lg:col-span-2">
                     <AccessControlOverlay isAllowed={isAllowed} featureName={selectedConsulta?.name || 'Consultas Públicas'}>
                        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg min-h-[400px]">
                            {selectedConsulta ? (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedConsulta.name}</h2>
                                    <p className="text-sm text-gray-500 mb-6">{selectedConsulta.description}</p>
                                    <selectedConsulta.component />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                                    <BriefcaseIcon className="w-16 h-16 text-slate-300 mb-4" />
                                    <p className="font-semibold">Selecione uma consulta na lista para começar.</p>
                                </div>
                            )}
                        </div>
                     </AccessControlOverlay>
                </div>
            </div>
        </main>
    );
};
