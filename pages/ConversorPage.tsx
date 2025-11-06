import React, { useState, useCallback } from 'react';
import type { User } from '../types.ts';
import { useToast } from '../App.tsx';
import { AccessControlOverlay } from '../components/AccessControlOverlay.tsx';
import { analyzeDocumentContent } from '../services/geminiService.ts';
import {
    SparklesIcon,
    ArrowUpTrayIcon,
    TrashIcon,
    DocumentDuplicateIcon,
    LanguageIcon,
    ListBulletIcon,
    UserGroupIcon
} from '../components/Icons.tsx';

// Define a type for our analysis actions
type AnalysisAction = 'extract' | 'summarize' | 'key-points' | 'identify-parts' | 'translate';

const actionsConfig: { id: AnalysisAction; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>>; description: string; requiresLanguage?: boolean }[] = [
    { id: 'summarize', label: 'Resumir', icon: SparklesIcon, description: 'Cria um resumo conciso do conteúdo do arquivo.' },
    { id: 'key-points', label: 'Pontos-Chave', icon: ListBulletIcon, description: 'Extrai os principais argumentos ou tópicos em formato de lista.' },
    { id: 'identify-parts', label: 'Identificar Dados', icon: UserGroupIcon, description: 'Encontra nomes de pessoas/empresas, datas e valores.' },
    { id: 'translate', label: 'Traduzir', icon: LanguageIcon, description: 'Traduz o texto para Inglês ou Espanhol.', requiresLanguage: true },
    { id: 'extract', label: 'Extrair Texto', icon: DocumentDuplicateIcon, description: 'Extrai o texto completo para uso em editores (Word, TXT).' },
];

const ConversorPage: React.FC<{ user: User | null }> = ({ user }) => {
    const isAllowed = !!user;
    const [file, setFile] = useState<File | null>(null);
    const [fileContent, setFileContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any | null>(null);
    const [selectedAction, setSelectedAction] = useState<AnalysisAction | null>(null);
    const [targetLanguage, setTargetLanguage] = useState<'en' | 'es'>('en');
    const [error, setError] = useState<string | null>(null);
    const showToast = useToast();

    const readFileContent = (inputFile: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            // For now, we only support .txt files for simplicity
            if (inputFile.type === 'text/plain') {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.onerror = (e) => reject(new Error('Falha ao ler o arquivo.'));
                reader.readAsText(inputFile);
            } else {
                 reject(new Error('Formato de arquivo não suportado. Por favor, envie um arquivo .txt.'));
            }
        });
    };

    const handleFileChange = async (files: FileList | null) => {
        if (files && files[0]) {
            const selectedFile = files[0];
            handleClear(); // Clear previous state
            setIsLoading(true);
            try {
                const content = await readFileContent(selectedFile);
                setFile(selectedFile);
                setFileContent(content);
                showToast({ type: 'success', message: 'Arquivo carregado com sucesso!' });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro desconhecido');
                showToast({ type: 'error', message: err instanceof Error ? err.message : 'Erro ao processar arquivo.' });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleClear = () => {
        setFile(null);
        setFileContent('');
        setAnalysisResult(null);
        setSelectedAction(null);
        setError(null);
    };

    const handleAnalyze = async (action: AnalysisAction) => {
        if (!fileContent) {
            showToast({ type: 'error', message: 'Carregue um arquivo primeiro.' });
            return;
        }
        
        setSelectedAction(action);
        setIsLoading(true);
        setAnalysisResult(null);
        setError(null);

        try {
            const result = await analyzeDocumentContent(action, fileContent, targetLanguage);
            setAnalysisResult(result);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Falha na análise do documento.';
            setError(errorMessage);
            showToast({ type: 'error', message: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    const renderResult = () => {
        if (!analysisResult || !selectedAction) return null;

        switch (selectedAction) {
            case 'extract':
                return <pre className="whitespace-pre-wrap font-sans">{analysisResult.extractedText}</pre>;
            case 'summarize':
                return <p>{analysisResult.summary}</p>;
            case 'key-points':
                return (
                    <ul className="list-disc list-inside space-y-2">
                        {analysisResult.keyPoints.map((point: string, index: number) => <li key={index}>{point}</li>)}
                    </ul>
                );
            case 'identify-parts':
                return (
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold">Partes Identificadas:</h4>
                            <p>{analysisResult.parties?.join(', ') || 'Nenhuma'}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold">Datas Identificadas:</h4>
                            <p>{analysisResult.dates?.join(', ') || 'Nenhuma'}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold">Valores Identificados:</h4>
                            <p>{analysisResult.values?.join(', ') || 'Nenhum'}</p>
                        </div>
                    </div>
                );
            case 'translate':
                return <p>{analysisResult.translatedText}</p>;
            default:
                return <p>Resultado da análise aparecerá aqui.</p>;
        }
    };

    return (
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Central de Análise de Documentos com IA</h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">Extraia, resuma, traduza e analise informações de seus arquivos de texto de forma inteligente.</p>
            </div>
            
            <AccessControlOverlay isAllowed={isAllowed} featureName="Central de Análise de Documentos">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Upload & Actions */}
                    <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">1. Envie seu Arquivo</h2>
                             <div 
                                className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => { e.preventDefault(); handleFileChange(e.dataTransfer.files); }}
                                onClick={() => document.getElementById('file-upload')?.click()}
                            >
                                <ArrowUpTrayIcon className="w-12 h-12 mx-auto text-slate-400 mb-2" />
                                <p className="text-slate-600">Arraste e solte seu arquivo aqui, ou clique para selecionar.</p>
                                <p className="text-xs text-slate-400 mt-1">Apenas arquivos .txt são suportados no momento.</p>
                                <input id="file-upload" type="file" accept=".txt" className="hidden" onChange={(e) => handleFileChange(e.target.files)} />
                            </div>
                            {file && (
                                <div className="mt-4 bg-slate-100 p-3 rounded-md flex justify-between items-center text-sm">
                                    <span className="font-medium text-slate-700 truncate">{file.name}</span>
                                    <button onClick={handleClear} className="p-1 text-red-500 hover:bg-red-100 rounded-full">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        {fileContent && (
                             <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4">2. Escolha uma Ação</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {actionsConfig.map(action => (
                                        <button 
                                            key={action.id}
                                            onClick={() => handleAnalyze(action.id)}
                                            disabled={isLoading && selectedAction === action.id}
                                            className="p-4 border rounded-lg text-center hover:shadow-lg hover:border-indigo-400 transition-all disabled:opacity-50 disabled:cursor-wait flex flex-col items-center justify-center space-y-2"
                                        >
                                            <action.icon className="w-8 h-8 text-indigo-600" />
                                            <span className="font-semibold text-sm">{action.label}</span>
                                        </button>
                                    ))}
                                </div>
                                 <div className="mt-4 flex items-center gap-4 bg-slate-100 p-3 rounded-md">
                                    <label htmlFor="language-select" className="text-sm font-medium">Idioma para tradução:</label>
                                    <select 
                                        id="language-select"
                                        value={targetLanguage}
                                        onChange={(e) => setTargetLanguage(e.target.value as 'en' | 'es')}
                                        className="p-1 border rounded-md bg-white"
                                    >
                                        <option value="en">Inglês</option>
                                        <option value="es">Espanhol</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Result */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Resultado da Análise</h2>
                        <div className="bg-slate-50 border border-slate-200 rounded-md p-4 min-h-[400px] overflow-y-auto">
                           {isLoading && (
                               <div className="text-center text-slate-500 pt-16">
                                    <svg className="animate-spin h-8 w-8 text-indigo-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                   <p>Analisando... A IA está trabalhando no seu documento.</p>
                               </div>
                           )}
                           {!isLoading && error && <div className="text-red-600 bg-red-100 p-3 rounded-md">{error}</div>}
                           {!isLoading && !error && analysisResult && renderResult()}
                           {!isLoading && !error && !analysisResult && (
                               <div className="text-center text-slate-500 pt-16">
                                   <p>O resultado da sua análise aparecerá aqui.</p>
                               </div>
                           )}
                        </div>
                    </div>
                </div>
            </AccessControlOverlay>
        </main>
    );
};

export default ConversorPage;
