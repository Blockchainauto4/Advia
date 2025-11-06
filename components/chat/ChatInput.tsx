import React, { useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '../Icons.tsx';

interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend, isLoading }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [value]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <div className="bg-white border-t border-slate-200 p-4">
            <div className="relative">
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Digite sua pergunta aqui... (Shift+Enter para nova linha)"
                    rows={1}
                    disabled={isLoading}
                    className="w-full bg-slate-100 border-slate-300 rounded-lg p-3 pr-12 text-sm text-slate-900 resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-slate-200"
                    style={{ maxHeight: '150px' }}
                />
                <button
                    onClick={onSend}
                    disabled={isLoading || !value.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
                    aria-label="Enviar mensagem"
                >
                    <PaperAirplaneIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};