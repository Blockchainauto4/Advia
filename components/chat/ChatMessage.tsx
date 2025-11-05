import React from 'react';
import { SparklesIcon, UserCircleIcon } from '../Icons';
import { ChatMessage as ChatMessageType } from '../../types';

interface ChatMessageProps {
    message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isModel = message.role === 'model';

    return (
        <div className={`flex items-start gap-4 p-4 ${isModel ? 'bg-slate-50/50' : ''}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isModel ? 'bg-indigo-500 text-white' : 'bg-slate-300 text-slate-600'}`}>
                {isModel ? <SparklesIcon className="w-5 h-5" /> : <UserCircleIcon className="w-6 h-6" />}
            </div>
            <div className="flex-grow pt-0.5">
                <p className="font-bold text-sm text-slate-800 mb-1">{isModel ? 'Assistente AI' : 'Você'}</p>
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">
                    {message.content}
                </div>
            </div>
        </div>
    );
};
