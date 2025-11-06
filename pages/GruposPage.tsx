import React, { useState } from 'react';
import { gruposPorEstado } from '../configs/gruposConfig.ts';
import { WhatsAppIcon, ChevronDownIcon } from '../components/Icons.tsx';

export const GruposPage: React.FC = () => {
    const [openState, setOpenState] = useState<string | null>(null);

    const toggleState = (uf: string) => {
        if (openState === uf) {
            setOpenState(null);
        } else {
            setOpenState(uf);
        }
    };

    return (
        <main className="flex-grow bg-slate-100 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Grupos de Networking no WhatsApp</h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Conecte-se com advogados de todo o Brasil. Participe de discussões, troque experiências e fortaleça sua rede de contatos.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
                    <div className="space-y-2">
                        {gruposPorEstado.map((estado) => (
                            <div key={estado.uf} className="border-b last:border-b-0">
                                <button
                                    onClick={() => toggleState(estado.uf)}
                                    className="w-full flex justify-between items-center p-4 text-left font-semibold text-lg text-gray-800 hover:bg-slate-50"
                                    aria-expanded={openState === estado.uf}
                                >
                                    <span>{estado.stateName} ({estado.uf})</span>
                                    <ChevronDownIcon
                                        className={`w-6 h-6 text-gray-500 transition-transform ${
                                            openState === estado.uf ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>
                                {openState === estado.uf && (
                                    <div className="p-4 bg-slate-50">
                                        {estado.groups.length > 0 ? (
                                            <div className="space-y-4">
                                                {estado.groups.map((group, index) => (
                                                    <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded-md border shadow-sm">
                                                        <div className="flex items-start mb-3 sm:mb-0">
                                                            <WhatsAppIcon className="w-8 h-8 text-green-500 mr-4 flex-shrink-0 mt-1" />
                                                            <div>
                                                                <h3 className="font-bold text-gray-900">{group.name}</h3>
                                                                <p className="text-sm text-gray-600">{group.description}</p>
                                                            </div>
                                                        </div>
                                                        <a
                                                            href={group.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex-shrink-0 bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 transition-colors text-sm"
                                                        >
                                                            Entrar no Grupo
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500 text-center">Nenhum grupo cadastrado para este estado no momento.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="max-w-4xl mx-auto mt-8 text-center">
                     <p className="text-xs text-slate-500 italic">
                        <strong>Aviso Importante:</strong> Os grupos de WhatsApp listados são criados e administrados por terceiros. A AdvocaciaAI não tem controle sobre o conteúdo ou os participantes desses grupos e não se responsabiliza por quaisquer informações ou interações que ocorram neles. Participe com discernimento e respeite as regras de cada comunidade.
                    </p>
                </div>
            </div>
        </main>
    );
};
