import React from 'react';
import { assistants } from '../../configs/assistantsConfig.ts';
import { PlusIcon, TrashIcon, XMarkIcon } from '../Icons.tsx';
import type { Conversation } from '../../types.ts';

interface SidebarProps {
    selectedAssistantId: string;
    onSelectAssistant: (id: string) => void;
    conversations: Conversation[];
    activeConversationId: string | null;
    onLoadConversation: (id: string) => void;
    onDeleteConversation: (id: string) => void;
    onNewConversation: () => void;
    isMobileOpen: boolean;
    onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    selectedAssistantId,
    onSelectAssistant,
    conversations,
    activeConversationId,
    onLoadConversation,
    onDeleteConversation,
    onNewConversation,
    isMobileOpen,
    onClose,
}) => {
    const handleDelete = (e: React.MouseEvent, conversationId: string) => {
        e.stopPropagation(); // Prevent onLoadConversation from firing
        if (window.confirm('Tem certeza que deseja apagar esta conversa?')) {
            onDeleteConversation(conversationId);
        }
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 md:hidden">
                <h2 className="text-lg font-semibold text-white">Menu</h2>
                <button onClick={onClose} aria-label="Fechar menu">
                    <XMarkIcon className="w-6 h-6 text-gray-300 hover:text-white" />
                </button>
            </div>
            <div className="p-4 pt-0 md:pt-4">
                 <button
                    onClick={onNewConversation}
                    className="w-full flex items-center justify-center text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors mb-6"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Nova Conversa
                </button>
            </div>
            <div className="flex-grow overflow-y-auto px-4">
                {/* History Section */}
                <h2 className="text-xs font-bold uppercase text-gray-400 mb-2 px-2">Histórico</h2>
                <nav className="mb-6">
                    <ul>
                        {conversations.map((convo) => {
                            const isActive = convo.id === activeConversationId;
                            return (
                                <li key={convo.id}>
                                    <button
                                        onClick={() => onLoadConversation(convo.id)}
                                        className={`w-full text-left flex items-center justify-between p-2 rounded-md text-sm my-1 group transition-colors ${
                                            isActive ? 'bg-slate-700 text-white' : 'hover:bg-slate-700/50'
                                        }`}
                                    >
                                        <span className="truncate pr-2">{convo.title}</span>
                                        <TrashIcon
                                            onClick={(e) => handleDelete(e, convo.id)}
                                            className="w-4 h-4 text-slate-500 flex-shrink-0 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
                                        />
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                     {conversations.length === 0 && (
                        <p className="text-xs text-slate-500 px-2">Nenhuma conversa salva.</p>
                    )}
                </nav>

                {/* Assistants Section */}
                <h2 className="text-xs font-bold uppercase text-gray-400 mb-2 px-2">Assistentes</h2>
                <nav>
                    <ul>
                        {assistants.map((assistant) => {
                            const Icon = assistant.icon;
                            const isAssistantActive = assistant.id === selectedAssistantId;
                            return (
                                <li key={assistant.id}>
                                    <button
                                        onClick={() => onSelectAssistant(assistant.id)}
                                        className={`w-full text-left flex items-center p-2 rounded-md text-sm my-1 transition-colors ${
                                            isAssistantActive ? 'bg-slate-600/50 text-white' : 'hover:bg-slate-700/50'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                                        <span>{assistant.name}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
            
            <div className="text-xs text-slate-500 text-center p-4">
                <p>&copy; {new Date().getFullYear()} advocaciaai.com.br</p>
            </div>
        </div>
    );
    
    return (
        <>
            {/* Mobile Sidebar */}
            <div
                className={`fixed inset-0 z-40 md:hidden transition-opacity ${
                    isMobileOpen ? 'bg-black bg-opacity-50' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
                aria-hidden="true"
            />
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 text-gray-300 transform transition-transform ease-in-out md:hidden ${
                    isMobileOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <SidebarContent />
            </aside>

            {/* Desktop Sidebar */}
            <aside className="w-64 bg-slate-800 text-gray-300 hidden md:flex">
                <SidebarContent />
            </aside>
        </>
    );
};
