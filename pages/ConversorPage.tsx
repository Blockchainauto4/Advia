import React, { useState } from 'react';
import { SparklesIcon, DocumentArrowUpIcon, ArrowPathIcon, ClipboardIcon, ArrowDownTrayIcon } from '../components/Icons';
import { useToast } from '../AppContext';
import { AccessControlOverlay } from '../components/AccessControlOverlay';
import type { User } from '../types';
import { Part } from '@google/genai';
import { convertFileContent } from '../services/geminiService';

interface ConversorPageProps {
    user: User | null;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // Remove the "data:mime/type;base64," prefix
            resolve(result.split(',')[1]);
        };
        reader.onerror = error => reject(error);
    });
};

export const ConversorPage: React.FC<ConversorPageProps> = ({ user }) => {
    const [file, setFile] = useState<File | null>(null);
    const [outputFormat, setOutputFormat] = useState<'txt' | 'docx'>('docx');
    const [isLoading, setIsLoading] = useState(false);
    const [resultText, setResultText] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const showToast = useToast();
    const isAllowed = !!user;

    const handleFileChange = (files: FileList | null) => {
        if (files && files.length > 0) {
            const selectedFile = files[0];
            if (selectedFile.type !== 'application/pdf') {
                showToast({ type: 'error', message: 'Por favor, selecione um arquivo PDF.' });
                return;
            }
            setFile(selectedFile);
            setResultText(null);
            setError(null);
        }
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        handleFileChange(e.dataTransfer.files);
    };

    const removeFile = () => {
        setFile(null);
        setResultText(null);
        setError(null);
    };

    const handleConvert = async () => {
        if (!file) {
            showToast({ type: 'error', message: 'Nenhum arquivo selecionado.' });
            return;
        }
        setIsLoading(true);
        setError(null);
        setResultText(null);

        try {
            const base64Data = await fileToBase64(file);
            const filePart: Part = {
                inlineData: {
                    mimeType: file.type,
                    data: base64Data,
                }
            };

            const convertedText = await convertFileContent(filePart, outputFormat);
            setResultText(convertedText);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Falha na conversão.';
            setError(errorMessage);
            showToast({ type: 'error', message: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (resultText) {
            navigator.clipboard.writeText(resultText);
            showToast({ type: 'success', message: 'Texto copiado para a área de transferência!' });
        }
    };
    
    const handleDownloadTxt = () => {
        if (resultText) {
            const blob = new Blob([resultText], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const originalName = file?.name.replace(/\.[^/.]+$/, "") || 'documento';
            link.download = `${originalName}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    };


    return (
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Conversor de Documentos com IA</h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">Converta seus arquivos PDF para texto simples ou texto formatado para Word.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
                <AccessControlOverlay isAllowed={isAllowed} featureName="Conversor de Documentos">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Side: Upload and Options */}
                        <div className="space-y-6">
                            {!file ? (
                                <div 
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                                    onClick={() => document.getElementById('file-upload')?.click()}
                                >
                                    <DocumentArrowUpIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                    <p className="font-semibold text-slate-700">Arraste e solte seu arquivo PDF aqui</p>
                                    <p className="text-sm text-slate-500 mt-1">ou clique para selecionar</p>
                                    <input id="file-upload" type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileChange(e.target.files)} />
                                </div>
                            ) : (
                                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 text-center">
                                    <p className="font-semibold text-slate-800 break-all">{file.name}</p>
                                    <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                                    <button onClick={removeFile} className="mt-3 text-xs text-red-600 hover:underline font-semibold">Remover arquivo</button>
                                </div>
                            )}

                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Converter para:</label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input type="radio" value="docx" checked={outputFormat === 'docx'} onChange={() => setOutputFormat('docx')} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"/>
                                        <span className="ml-2 text-sm text-gray-700">Texto para Word (.docx)</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" value="txt" checked={outputFormat === 'txt'} onChange={() => setOutputFormat('txt')} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"/>
                                        <span className="ml-2 text-sm text-gray-700">Texto Simples (.txt)</span>
                                    </label>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleConvert}
                                disabled={!file || isLoading}
                                className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex justify-center items-center"
                            >
                                {isLoading ? (
                                    <>
                                        <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" /> Convertendo...
                                    </>
                                ) : (
                                    <>
                                        <SparklesIcon className="w-5 h-5 mr-2" /> Converter Arquivo
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Right Side: Output */}
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-slate-800">Resultado</h3>
                                {resultText && (
                                    <div className="flex items-center space-x-2">
                                        <button onClick={handleCopy} title="Copiar" className="p-1 text-slate-500 hover:bg-slate-200 rounded-md"><ClipboardIcon className="w-4 h-4" /></button>
                                        {outputFormat === 'txt' && (
                                             <button onClick={handleDownloadTxt} title="Baixar .txt" className="p-1 text-slate-500 hover:bg-slate-200 rounded-md"><ArrowDownTrayIcon className="w-4 h-4" /></button>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="flex-grow bg-white border rounded-md p-2 h-64 overflow-y-auto">
                                {isLoading && <div className="text-center text-slate-500 pt-16">Processando...</div>}
                                {error && <div className="text-sm text-red-600 p-2">{error}</div>}
                                {resultText && (
                                    <pre className="whitespace-pre-wrap text-sm font-sans text-gray-800">{resultText}</pre>
                                )}
                                {!isLoading && !error && !resultText && (
                                     <div className="text-center text-slate-400 pt-16">O conteúdo convertido aparecerá aqui.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </AccessControlOverlay>
            </div>
        </main>
    );
};