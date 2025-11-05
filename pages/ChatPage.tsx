import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { ChatMessage, Conversation } from '../types';
import { assistants } from '../configs/assistantsConfig';
import { getChatStream } from '../services/geminiService';
import { chatHistoryService } from '../services/chatHistoryService';
import { Sidebar } from '../components/chat/Sidebar';
import { ChatWindow } from '../components/chat/ChatWindow';

export const ChatPage: React.FC = () => {
  const [assistantId, setAssistantId] = useState<string>('geral');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const currentAssistant = useMemo(() => {
    return assistants.find(a => a.id === assistantId);
  }, [assistantId]);

  // Load conversations when assistant changes
  useEffect(() => {
    const savedConversations = chatHistoryService.getConversationsForAssistant(assistantId);
    setConversations(savedConversations);
    // Start a new chat by default when switching assistants
    handleNewConversation(); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assistantId]);

  const handleSelectAssistant = (id: string) => {
    setAssistantId(id);
  };
  
  const handleNewConversation = () => {
    setActiveConversationId(null);
    setChatHistory([]);
    setError(null);
    setCurrentMessage('');
  };

  const handleLoadConversation = useCallback((id: string) => {
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      setActiveConversationId(id);
      setChatHistory(conversation.messages);
      setError(null);
    }
  }, [conversations]);

  const handleDeleteConversation = useCallback((id: string) => {
    chatHistoryService.deleteConversation(assistantId, id);
    const updatedConversations = conversations.filter(c => c.id !== id);
    setConversations(updatedConversations);
    // If the active conversation was deleted, start a new one
    if (activeConversationId === id) {
      handleNewConversation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assistantId, conversations, activeConversationId]);


  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !currentAssistant) return;

    const userMessageContent = currentMessage.trim();
    const newUserMessage: ChatMessage = { role: 'user', content: userMessageContent };
    const newChatHistory = [...chatHistory, newUserMessage];
    
    setChatHistory(newChatHistory);
    setCurrentMessage('');
    setIsLoading(true);
    setError(null);
    
    let conversationId = activeConversationId;

    // If it's a new conversation, create and save it first
    if (!conversationId) {
        const newConversation: Conversation = {
            id: Date.now().toString(),
            title: userMessageContent.substring(0, 40) + (userMessageContent.length > 40 ? '...' : ''),
            messages: newChatHistory,
        };
        chatHistoryService.saveConversation(assistantId, newConversation);
        conversationId = newConversation.id;
        setActiveConversationId(conversationId);
        setConversations(prev => [newConversation, ...prev]);
    } else {
        // Update messages for existing conversation
        chatHistoryService.updateConversationMessages(assistantId, conversationId, newChatHistory);
        setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, messages: newChatHistory } : c));
    }
    
    const historyForApi = newChatHistory.slice(0, -1).map(msg => ({
        role: msg.role as 'user' | 'model',
        parts: [{ text: msg.content }],
    }));

    try {
        const stream = getChatStream(historyForApi, userMessageContent, currentAssistant.systemInstruction);
        let firstChunk = true;
        let fullResponse = '';
        let finalMessages: ChatMessage[] = [];

        for await (const chunk of stream) {
            fullResponse += chunk;
            const updatedMessages = [...newChatHistory];

            if (firstChunk) {
                updatedMessages.push({ role: 'model', content: fullResponse });
                firstChunk = false;
            } else {
                updatedMessages[updatedMessages.length - 1] = { role: 'model', content: fullResponse };
            }
            
            setChatHistory(updatedMessages);
            finalMessages = updatedMessages;
        }
        
        // Final update to localStorage after stream completes
        if(conversationId) {
             chatHistoryService.updateConversationMessages(assistantId, conversationId, finalMessages);
             setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, messages: finalMessages } : c));
        }

    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.';
        setError(`Erro: ${errorMessage}`);
        const errorResponse: ChatMessage = { role: 'model', content: `Desculpe, ocorreu um erro: ${errorMessage}` };
        const finalMessages = [...newChatHistory, errorResponse];
        setChatHistory(finalMessages);
         if(conversationId) {
             chatHistoryService.updateConversationMessages(assistantId, conversationId, finalMessages);
             setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, messages: finalMessages } : c));
        }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-grow h-full overflow-hidden">
        <Sidebar 
            selectedAssistantId={assistantId}
            onSelectAssistant={handleSelectAssistant}
            conversations={conversations}
            activeConversationId={activeConversationId}
            onLoadConversation={handleLoadConversation}
            onDeleteConversation={handleDeleteConversation}
            onNewConversation={handleNewConversation}
        />
        <ChatWindow
            assistant={currentAssistant}
            messages={chatHistory}
            currentMessage={currentMessage}
            onCurrentMessageChange={setCurrentMessage}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
        />
    </main>
  );
}