import React, { useEffect, useRef } from 'react';
import { ChatMessage as ChatMessageType, Assistant } from '../../types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatBubbleLeftRightIcon } from '../Icons';

interface ChatWindowProps {
    assistant: Assistant | undefined;
    messages: ChatMessageType[];
    currentMessage: string;
    onCurrentMessageChange: (message: string) => void;
    onSendMessage: () => void;
    isLoading: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
    assistant,
    messages,
    currentMessage,
    onCurrentMessageChange,
    onSendMessage,
    isLoading,
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages, isLoading]);

    return (
        <main className="flex-grow flex flex-col bg-white">
            <div className="flex-grow overflow-y-auto">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 p-8">
                        {assistant ? (
                            <>
                                <div className="bg-slate-200 rounded-full p-4 mb-4">
                                    <assistant.icon className="w-12 h-12 text-slate-600" />
                                </div>
                                <h1 className="text-2xl font-bold text-slate-800">Assistente de {assistant.name}</h1>
                                <p className="mt-2 max-w-md">{assistant.description}</p>
                            </>
                        ) : (
                             <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 p-8">
                                <ChatBubbleLeftRightIcon className="w-16 h-16 text-slate-400 mb-4" />
                                <h1 className="text-2xl font-bold text-slate-800">Selecione um Assistente</h1>
                                <p className="mt-2 max-w-md">Escolha um assistente na barra lateral para iniciar uma nova conversa.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        {messages.map((msg, index) => (
                            <ChatMessage key={index} message={msg} />
                        ))}
                         {isLoading && messages.length > 0 && messages[messages.length-1].role === 'user' && (
                             <div className="flex items-start gap-4 p-4 bg-slate-50/50">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-indigo-500 text-white">
                                    <assistant.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-grow pt-0.5">
                                    <p className="font-bold text-sm text-slate-800 mb-1">{assistant.name}</p>
                                    <div className="flex items-center space-x-1">
                                        <span className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            </div>
                         )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>
            <ChatInput
                value={currentMessage}
                onChange={onCurrentMessageChange}
                onSend={onSendMessage}
                isLoading={isLoading}
            />
        </main>
    );
};
