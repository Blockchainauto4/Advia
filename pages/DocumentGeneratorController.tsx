import React, { useState, useMemo } from 'react';
import { DocumentGeneratorPage } from './DocumentGeneratorPage.tsx';
import { documentConfigs } from '../configs/documentConfigs.ts';
import type { FormData, User } from '../types.ts';
import { useToast } from '../App.tsx';
import { generateDocument } from '../services/geminiService.ts';
import { jsPDF } from 'jspdf';

interface DocumentGeneratorControllerProps {
    user: User | null;
}

export const DocumentGeneratorController: React.FC<DocumentGeneratorControllerProps> = ({ user }) => {
    const [docType, setDocType] = useState(documentConfigs[0].value);
    const [prompt, setPrompt] = useState('');
    const [formData, setFormData] = useState<FormData>({});
    const [generatedData, setGeneratedData] = useState<FormData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const showToast = useToast();

    const currentConfig = useMemo(() => documentConfigs.find(d => d.value === docType) || documentConfigs[0], [docType]);
    const isInitialState = !generatedData && !isLoading && !error;
    const isAllowed = !!user;

    const handleDocTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDocType(e.target.value);
        // Reset everything on type change
        handleClear();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerate = async () => {
        if (!prompt.trim() || !docType) {
            setError("Por favor, selecione um tipo de documento e descreva a consulta.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedData(null);

        try {
            const stream = generateDocument(prompt, currentConfig.systemInstruction, currentConfig.responseSchema);
            let jsonString = '';
            for await (const chunk of stream) {
                jsonString += chunk;
            }
            
            const parsedData = JSON.parse(jsonString.trim().replace(/^```json\n|```$/g, ''));
            setGeneratedData(parsedData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
            setGeneratedData(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setPrompt('');
        setFormData({});
        setGeneratedData(null);
        setError(null);
        setIsLoading(false);
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    const formattedDocumentText = useMemo(() => {
        if (!currentConfig || (!generatedData && !formData)) {
            return 'Selecione um tipo de documento para começar.';
        }
        const combinedData = { ...formData, ...generatedData };
        return currentConfig.formatOutput(combinedData);
    }, [currentConfig, formData, generatedData]);

    const handleCopy = () => {
        navigator.clipboard.writeText(formattedDocumentText);
        showToast({ type: 'success', message: 'Documento copiado para a área de transferência!' });
    };

    const handleSaveDraft = () => {
        showToast({ type: 'info', message: 'Funcionalidade de salvar rascunho em desenvolvimento.' });
    };

    const handleExportPDF = () => {
        try {
            const doc = new jsPDF();
            // Basic text splitting to handle multiple pages
            const splitText = doc.splitTextToSize(formattedDocumentText, 180);
            doc.text(splitText, 10, 10);
            doc.save(`${currentConfig.label.replace(/\s/g, '_')}.pdf`);
            showToast({ type: 'success', message: 'PDF exportado com sucesso!' });
        } catch (e) {
            showToast({ type: 'error', message: 'Falha ao exportar PDF.' });
            console.error(e);
        }
    };
    
    const handleSpeak = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }
        
        const utterance = new SpeechSynthesisUtterance(formattedDocumentText);
        utterance.lang = 'pt-BR';
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => {
            setIsSpeaking(false);
            showToast({ type: 'error', message: 'Não foi possível reproduzir o áudio.' });
        };
        
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
    };

    return (
        <DocumentGeneratorPage
            isAllowed={isAllowed}
            docType={docType}
            handleDocTypeChange={handleDocTypeChange}
            prompt={prompt}
            setPrompt={setPrompt}
            formData={formData}
            handleInputChange={handleInputChange}
            currentConfig={currentConfig}
            handleGenerate={handleGenerate}
            isLoading={isLoading}
            error={error}
            isInitialState={isInitialState}
            formattedDocumentText={formattedDocumentText}
            handleCopy={handleCopy}
            handleClear={handleClear}
            handleSaveDraft={handleSaveDraft}
            handleExportPDF={handleExportPDF}
            handleSpeak={handleSpeak}
            isSpeaking={isSpeaking}
        />
    );
};