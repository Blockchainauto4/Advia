import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sidebar } from '../components/chat/Sidebar.tsx';
import { ChatWindow } from '../components/chat/ChatWindow.tsx';
import { assistants } from '../configs/assistantsConfig.ts';
import { getChatStream, generateFollowUpSuggestions } from '../services/geminiService.ts';
import { chatHistoryService } from '../services/chatHistoryService.ts';
import type { ChatMessage, Conversation } from '../types.ts';
import { GenerateContentRequest } from '@google/genai';
import { Bars3Icon } from '../components/Icons.tsx';

export const ChatPage: React.FC = () => {
    const [selectedAssistantId, setSelectedAssistantId] = useState<string>(assistants[0].id);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const activeAssistant = useMemo(() => assistants.find(a => a.id === selectedAssistantId), [selectedAssistantId]);

    const loadConversations = useCallback(() => {
        const convos = chatHistoryService.getConversationsForAssistant(selectedAssistantId);
        setConversations(convos);
    }, [selectedAssistantId]);

    useEffect(() => {
        loadConversations();
        setMessages([]);
        setActiveConversationId(null);
    }, [selectedAssistantId, loadConversations]);

    const handleNewConversation = () => {
        setActiveConversationId(null);
        setMessages([]);
        setCurrentMessage('');
        setSuggestions([]);
        setIsMobileSidebarOpen(false);
    };
    
    const handleSelectAssistant = (id: string) => {
        if(id !== selectedAssistantId) {
            setSelectedAssistantId(id);
        }
        setIsMobileSidebarOpen(false);
    };

    const handleLoadConversation = (id: string) => {
        const conversation = conversations.find(c => c.id === id);
        if (conversation) {
            setActiveConversationId(id);
            setMessages(conversation.messages);
            setSuggestions([]);
        }
        setIsMobileSidebarOpen(false);
    };
    
    const handleDeleteConversation = (id: string) => {
        chatHistoryService.deleteConversation(selectedAssistantId, id);
        if(activeConversationId === id) {
            handleNewConversation();
        }
        loadConversations();
    };

    const sendMessage = async (messageContent: string) => {
        if (!messageContent.trim() || isLoading || !activeAssistant) return;

        setSuggestions([]);
        const userMessage: ChatMessage = { role: 'user', content: messageContent };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setCurrentMessage('');
        setIsLoading(true);

        const history: GenerateContentRequest['contents'] = newMessages.slice(0, -1).map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }],
        }));

        try {
            const stream = getChatStream(history, userMessage.content, activeAssistant.systemInstruction);
            let responseContent = '';

            setMessages(prev => [...prev, { role: 'model', content: '' }]);

            for await (const chunk of stream) {
                responseContent += chunk;
                setMessages(prev => {
                    const lastIndex = prev.length - 1;
                    if (lastIndex < 0 || prev[lastIndex].role !== 'model') return prev;
                    const updatedLastMessage = { ...prev[lastIndex], content: responseContent };
                    return [...prev.slice(0, lastIndex), updatedLastMessage];
                });
            }
            
            const finalMessages = [...newMessages, { role: 'model', content: responseContent }];

            if (activeConversationId) {
                chatHistoryService.updateConversationMessages(selectedAssistantId, activeConversationId, finalMessages);
            } else {
                const newConversation: Conversation = {
                    id: Date.now().toString(),
                    title: newMessages[0].content.substring(0, 40) + '...',
                    messages: finalMessages,
                };
                chatHistoryService.saveConversation(selectedAssistantId, newConversation);
                setActiveConversationId(newConversation.id);
            }
            loadConversations();
            
            const finalHistoryForSuggestions: GenerateContentRequest['contents'] = finalMessages.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.content }],
            }));
            const followUps = await generateFollowUpSuggestions(finalHistoryForSuggestions, activeAssistant.systemInstruction);
            setSuggestions(followUps);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            setMessages(prev => {
                const lastIndex = prev.length - 1;
                if (lastIndex >= 0 && prev[lastIndex].role === 'model' && prev[lastIndex].content === '') {
                    const updatedLastMessage = { ...prev[lastIndex], content: `Error: ${errorMessage}` };
                    return [...prev.slice(0, lastIndex), updatedLastMessage];
                }
                return [...prev, { role: 'model', content: `Error: ${errorMessage}` }];
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSendFromInput = () => {
        sendMessage(currentMessage);
    };

    const handleSuggestionClick = (suggestion: string) => {
        sendMessage(suggestion);
    };
    
    return (
        <div className="flex-grow flex h-[calc(100vh-4rem)]">
            <Sidebar 
                selectedAssistantId={selectedAssistantId}
                onSelectAssistant={handleSelectAssistant}
                conversations={conversations}
                activeConversationId={activeConversationId}
                onLoadConversation={handleLoadConversation}
                onDeleteConversation={handleDeleteConversation}
                onNewConversation={handleNewConversation}
                isMobileOpen={isMobileSidebarOpen}
                onClose={() => setIsMobileSidebarOpen(false)}
            />
            <div className="flex-grow flex flex-col bg-white">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-2 border-b bg-white z-10">
                    <button onClick={() => setIsMobileSidebarOpen(true)} aria-label="Abrir menu">
                        <Bars3Icon className="w-6 h-6 text-slate-600" />
                    </button>
                    <h1 className="font-semibold text-slate-800 truncate">
                        {activeAssistant?.name || 'Chat AI'}
                    </h1>
                    <div className="w-6" /> {/* Spacer to balance the title */}
                </header>
                <ChatWindow
                    assistant={activeAssistant}
                    messages={messages}
                    currentMessage={currentMessage}
                    onCurrentMessageChange={setCurrentMessage}
                    onSendMessage={handleSendFromInput}
                    isLoading={isLoading}
                    suggestions={suggestions}
                    onSuggestionClick={handleSuggestionClick}
                />
            </div>
        </div>
    );
};