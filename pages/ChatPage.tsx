
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sidebar } from '../components/chat/Sidebar';
import { ChatWindow } from '../components/chat/ChatWindow';
import { assistants } from '../configs/assistantsConfig';
import { getChatStream } from '../services/geminiService';
import { chatHistoryService } from '../services/chatHistoryService';
import type { ChatMessage, Conversation } from '../types';
import { GenerateContentRequest } from '@google/genai';

export const ChatPage: React.FC = () => {
    const [selectedAssistantId, setSelectedAssistantId] = useState<string>(assistants[0].id);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const activeAssistant = useMemo(() => assistants.find(a => a.id === selectedAssistantId), [selectedAssistantId]);

    const loadConversations = useCallback(() => {
        const convos = chatHistoryService.getConversationsForAssistant(selectedAssistantId);
        setConversations(convos);
    }, [selectedAssistantId]);

    useEffect(() => {
        loadConversations();
        // Reset view when assistant changes
        setMessages([]);
        setActiveConversationId(null);
    }, [selectedAssistantId, loadConversations]);

    const handleNewConversation = () => {
        setActiveConversationId(null);
        setMessages([]);
        setCurrentMessage('');
    };
    
    const handleSelectAssistant = (id: string) => {
        if(id !== selectedAssistantId) {
            setSelectedAssistantId(id);
        }
    };

    const handleLoadConversation = (id: string) => {
        const conversation = conversations.find(c => c.id === id);
        if (conversation) {
            setActiveConversationId(id);
            setMessages(conversation.messages);
        }
    };
    
    const handleDeleteConversation = (id: string) => {
        chatHistoryService.deleteConversation(selectedAssistantId, id);
        if(activeConversationId === id) {
            handleNewConversation();
        }
        loadConversations();
    };

    const handleSendMessage = async () => {
        if (!currentMessage.trim() || isLoading || !activeAssistant) return;

        const userMessage: ChatMessage = { role: 'user', content: currentMessage };
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
                    const lastMessage = prev[prev.length - 1];
                    lastMessage.content = responseContent;
                    return [...prev.slice(0, -1), lastMessage];
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

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            setMessages(prev => [...prev, { role: 'model', content: `Error: ${errorMessage}` }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex-grow flex h-[calc(100vh-8rem)]">
            <Sidebar 
                selectedAssistantId={selectedAssistantId}
                onSelectAssistant={handleSelectAssistant}
                conversations={conversations}
                activeConversationId={activeConversationId}
                onLoadConversation={handleLoadConversation}
                onDeleteConversation={handleDeleteConversation}
                onNewConversation={handleNewConversation}
            />
            <ChatWindow
                assistant={activeAssistant}
                messages={messages}
                currentMessage={currentMessage}
                onCurrentMessageChange={setCurrentMessage}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
            />
        </div>
    );
};
