import React, { useState, useEffect } from 'react';
import { DocumentGeneratorPage } from './DocumentGeneratorPage';
import { documentConfigs } from '../configs/documentConfigs';
import { generateDocument } from '../services/geminiService';
import type { FormData } from '../types';
import { useToast } from '../App';


export const DocumentGeneratorController: React.FC = () => {
    const [docType, setDocType] = useState<string>('');
    const [prompt, setPrompt] = useState<string>('');
    const [formData, setFormData] = useState<FormData>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedData, setGeneratedData] = useState<FormData | null>(null);
    const [isInitialState, setIsInitialState] = useState<boolean>(true);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const showToast = useToast();

    const currentConfig = documentConfigs.find(d => d.value === docType) || documentConfigs[0];

    useEffect(() => {
        // Reset form when docType changes
        setPrompt('');
        setFormData({});
        setGeneratedData(null);
        setError(null);
        setIsInitialState(true);
    }, [docType]);

    const handleDocTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDocType(e.target.value);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerate = async () => {
        if (!docType || !prompt.trim()) {
            setError('Por favor, selecione um tipo de documento e descreva a sua solicitação.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedData(null);
        setIsInitialState(false);

        try {
            const stream = generateDocument(prompt, currentConfig.systemInstruction, currentConfig.responseSchema);
            let jsonString = '';
            for await (const chunk of stream) {
                jsonString += chunk;
            }

            // A Gemini API pode retornar o JSON dentro de um bloco de código markdown.
            const cleanedJsonString = jsonString.replace(/^```json\n|```$/g, '');
            const parsedData = JSON.parse(cleanedJsonString);
            setGeneratedData(parsedData);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Falha ao processar a resposta da IA. Verifique o formato do JSON.';
            setError(`Erro: ${errorMessage}`);
            showToast({ type: 'error', message: 'Erro ao gerar documento.' });
        } finally {
            setIsLoading(false);
        }
    };

    const formattedDocumentText = generatedData
        ? currentConfig.formatOutput({ ...formData, ...generatedData })
        : currentConfig.formatOutput(formData);

    const handleClear = () => {
        setDocType('');
        setPrompt('');
        setFormData({});
        setGeneratedData(null);
        setError(null);
        setIsInitialState(true);
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };
    
    const handleCopy = () => {
        if (isInitialState || isLoading) return;
        navigator.clipboard.writeText(formattedDocumentText);
        showToast({ type: 'success', message: 'Copiado para a área de transferência!' });
    };
    
    const handleSaveDraft = () => {
        if (isInitialState || isLoading) return;
        showToast({ type: 'info', message: 'Rascunho salvo! (simulado)' });
    };
    
    const handleExportPDF = () => {
        showToast({ type: 'info', message: 'Exportar PDF em desenvolvimento.' });
    };
    
    const handleSpeak = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        } else if (!isInitialState && !isLoading) {
            const utterance = new SpeechSynthesisUtterance(formattedDocumentText);
            utterance.lang = 'pt-BR';
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
            setIsSpeaking(true);
        }
    };

    return (
        <DocumentGeneratorPage
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