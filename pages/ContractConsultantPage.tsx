import React, { useState } from 'react';
import type { User, GeneratedClause, NegotiationMessage } from '../types';
import { useToast } from '../AppContext';
import { analyzeServiceRisks, generateContractClause, simulateContractNegotiationStream } from '../services/geminiService';
import { AccessControlOverlay } from '../components/AccessControlOverlay';
import { SparklesIcon, ShieldExclamationIcon, ClipboardDocumentListIcon, ChatBubbleBottomCenterTextIcon, DocumentTextIcon, ArrowDownTrayIcon, TrashIcon, PlusIcon, PaperAirplaneIcon } from '../components/Icons';

interface ContractConsultantPageProps {
    user: User | null;
}

type Stage = 'analysis' | 'clauses' | 'assembly' | 'negotiation' | 'export';

const clauseTypes = ["Objeto do Contrato", "Obrigações da Contratada", "Obrigações da Contratante", "Preço e Forma de Pagamento", "Vigência e Prazo", "Rescisão e Multas", "Confidencialidade (NDA)", "Propriedade Intelectual", "Disposições Gerais", "Foro"];
const negotiatorPersonas = ["Advogado Agressivo", "Cliente Detalhista", "Startup Enxuta", "Grande Corporação Burocrática", "Negociador Colaborativo"];

export const ContractConsultantPage: React.FC<ContractConsultantPageProps> = ({ user }) => {
    const [stage, setStage] = useState<Stage>('analysis');
    const [serviceDescription, setServiceDescription] = useState('');
    const [riskAnalysisResult, setRiskAnalysisResult] = useState<{ risks: string[], questions: string[], suggestions: string[] } | null>(null);
    const [generatedClauses, setGeneratedClauses] = useState<GeneratedClause[]>([]);
    const [negotiationHistory, setNegotiationHistory] = useState<NegotiationMessage[]>([]);
    const [finalContractText, setFinalContractText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const showToast = useToast();
    const isAllowed = !!user;

    const handleAnalyze = async () => {
        if (!serviceDescription.trim()) {
            showToast({ type: 'error', message: 'Descreva o serviço para iniciar a análise.' });
            return;
        }
        setIsLoading(true);
        try {
            const result = await analyzeServiceRisks(serviceDescription);
            setRiskAnalysisResult(result);
            setStage('clauses');
        } catch (error) {
            showToast({ type: 'error', message: error instanceof Error ? error.message : 'Falha na análise.' });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleGenerateClause = async (clauseType: string) => {
        setIsLoading(true);
        try {
            const result = await generateContractClause(serviceDescription, clauseType);
            const newClause: GeneratedClause = {
                id: `clause_${Date.now()}`,
                type: clauseType,
                text: result.clauseText,
            };
            setGeneratedClauses(prev => [...prev, newClause]);
            showToast({type: 'success', message: `Cláusula de ${clauseType} adicionada!`});
        } catch (error) {
            showToast({ type: 'error', message: error instanceof Error ? error.message : 'Falha ao gerar cláusula.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAssembleContract = () => {
        const header = `CONTRATO DE PRESTAÇÃO DE SERVIÇOS\n\nPARTES:\n[Nome do Contratante], [Qualificação]\n[Nome da Contratada], [Qualificação]\n\n`;
        const body = generatedClauses.map(c => `CLÁUSULA - ${c.type.toUpperCase()}\n${c.text}`).join('\n\n');
        const footer = `\n\nE, por estarem justas e contratadas, assinam o presente instrumento.\n\n[Local], [Data]\n\n_________________________\n[Contratante]\n\n_________________________\n[Contratada]`;
        setFinalContractText(header + body + footer);
        setStage('negotiation');
    };
    
    const handleStartNegotiation = async (persona: string) => {
        setIsLoading(true);
        setNegotiationHistory([]);
        try {
            const stream = simulateContractNegotiationStream(finalContractText, persona);
            let responseContent = '';
            for await (const chunk of stream) {
                responseContent += chunk;
            }
            setNegotiationHistory([{ role: 'model', content: responseContent }]);
        } catch (error) {
            showToast({ type: 'error', message: error instanceof Error ? error.message : 'Falha ao iniciar simulação.' });
        } finally {
            setIsLoading(false);
        }
    };

    const StageContent = () => {
        switch(stage) {
            case 'analysis': return <AnalysisStage description={serviceDescription} setDescription={setServiceDescription} onAnalyze={handleAnalyze} isLoading={isLoading} />;
            case 'clauses': return <ClauseStage analysis={riskAnalysisResult} clauses={generatedClauses} onGenerate={handleGenerateClause} isLoading={isLoading} onNext={() => setStage('assembly')} />;
            case 'assembly': return <AssemblyStage clauses={generatedClauses} setClauses={setGeneratedClauses} onAssemble={handleAssembleContract} />;
            case 'negotiation': return <NegotiationStage contractText={finalContractText} history={negotiationHistory} onStart={handleStartNegotiation} isLoading={isLoading} onNext={() => setStage('export')} />;
            case 'export': return <ExportStage contractText={finalContractText} />;
        }
    };

    return (
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Consultor de Contratos com IA</h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">Crie contratos mais seguros com análise de risco, geração de cláusulas e simulação de negociação.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                 <AccessControlOverlay isAllowed={isAllowed} featureName="Consultor de Contratos">
                    <Stepper currentStage={stage} setStage={setStage} />
                    <div className="mt-8">
                        {StageContent()}
                    </div>
                 </AccessControlOverlay>
            </div>
        </main>
    );
};

// --- Stepper Component ---
const Stepper: React.FC<{currentStage: Stage, setStage: (s: Stage) => void}> = ({ currentStage, setStage }) => {
    const stages: {id: Stage, name: string, icon: React.FC<any>}[] = [
        { id: 'analysis', name: 'Análise de Risco', icon: ShieldExclamationIcon },
        { id: 'clauses', name: 'Geração de Cláusulas', icon: ClipboardDocumentListIcon },
        { id: 'assembly', name: 'Montagem', icon: DocumentTextIcon },
        { id: 'negotiation', name: 'Simular Negociação', icon: ChatBubbleBottomCenterTextIcon },
        { id: 'export', name: 'Exportar Contrato', icon: ArrowDownTrayIcon },
    ];
    const currentIndex = stages.findIndex(s => s.id === currentStage);

    return (
        <nav className="flex items-center justify-center" aria-label="Progress">
            {stages.map((s, index) => (
                <React.Fragment key={s.id}>
                    <button onClick={() => setStage(s.id)} className="flex flex-col items-center text-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${index <= currentIndex ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                            <s.icon className="w-6 h-6"/>
                        </div>
                        <p className={`text-xs mt-1 font-semibold ${index <= currentIndex ? 'text-indigo-600' : 'text-slate-500'}`}>{s.name}</p>
                    </button>
                    {index < stages.length - 1 && <div className={`flex-auto border-t-2 mx-4 ${index < currentIndex ? 'border-indigo-600' : 'border-slate-200'}`}></div>}
                </React.Fragment>
            ))}
        </nav>
    );
};

// --- Stage Components ---
const AnalysisStage: React.FC<{description: string, setDescription: (d: string) => void, onAnalyze: () => void, isLoading: boolean}> = ({description, setDescription, onAnalyze, isLoading}) => (
    <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Etapa 1: Análise de Risco</h2>
        <p className="text-slate-600 mb-6">Descreva detalhadamente o serviço que será prestado. A IA analisará o escopo para identificar riscos e pontos de melhoria antes de redigir o contrato.</p>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={6} placeholder="Ex: Criação de um website institucional para uma empresa de contabilidade, incluindo 5 páginas (home, sobre, serviços, blog, contato), formulário de contato e design responsivo..." className="w-full p-2 border rounded-md"/>
        <button onClick={onAnalyze} disabled={isLoading} className="mt-4 w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex justify-center items-center">
             {isLoading ? 'Analisando...' : <><ShieldExclamationIcon className="w-5 h-5 mr-2" /> Analisar Risco e Avançar</>}
        </button>
    </div>
);

const ClauseStage: React.FC<{analysis: any, clauses: GeneratedClause[], onGenerate: (type: string) => void, isLoading: boolean, onNext: () => void}> = ({analysis, clauses, onGenerate, isLoading, onNext}) => (
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4 bg-slate-50 p-4 rounded-lg border">
            <h3 className="font-bold">Análise de Risco da IA</h3>
            <div className="text-sm space-y-3 max-h-96 overflow-y-auto">
                <div><h4 className="font-semibold text-red-700">Riscos Potenciais:</h4><ul className="list-disc list-inside">{analysis.risks.map((r: string, i: number) => <li key={i}>{r}</li>)}</ul></div>
                <div><h4 className="font-semibold text-blue-700">Perguntas-chave:</h4><ul className="list-disc list-inside">{analysis.questions.map((q: string, i: number) => <li key={i}>{q}</li>)}</ul></div>
                <div><h4 className="font-semibold text-green-700">Cláusulas Sugeridas:</h4><ul className="list-disc list-inside">{analysis.suggestions.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul></div>
            </div>
        </div>
        <div className="lg:col-span-2 space-y-4">
             <h2 className="text-2xl font-bold text-gray-800">Etapa 2: Geração de Cláusulas</h2>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {clauseTypes.map(type => <button key={type} onClick={() => onGenerate(type)} disabled={isLoading} className="text-sm p-2 border rounded-md hover:bg-indigo-50 disabled:bg-slate-100">{type}</button>)}
             </div>
             <div>
                <h3 className="font-bold mb-2">Cláusulas Adicionadas: {clauses.length}</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto bg-slate-50 p-2 rounded-md border">
                    {clauses.map(c => <p key={c.id} className="text-sm p-1 bg-white border rounded">✓ {c.type}</p>)}
                </div>
             </div>
             <button onClick={onNext} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700">Avançar para Montagem</button>
        </div>
     </div>
);

const AssemblyStage: React.FC<{clauses: GeneratedClause[], setClauses: (c: GeneratedClause[]) => void, onAssemble: () => void}> = ({ clauses, setClauses, onAssemble }) => {
    const removeClause = (id: string) => {
        setClauses(clauses.filter(c => c.id !== id));
    };
    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Etapa 3: Montagem do Contrato</h2>
            <div className="space-y-3 bg-slate-50 p-4 rounded-lg border">
                {clauses.map(clause => (
                    <div key={clause.id} className="bg-white p-3 rounded-md border">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-indigo-700">{clause.type}</h4>
                            <button onClick={() => removeClause(clause.id)} className="text-red-500"><TrashIcon className="w-4 h-4"/></button>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{clause.text}</p>
                    </div>
                ))}
            </div>
            <button onClick={onAssemble} className="mt-6 w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700">Montar Contrato e Simular Negociação</button>
        </div>
    );
};

const NegotiationStage: React.FC<{contractText: string, history: NegotiationMessage[], onStart: (p: string) => void, isLoading: boolean, onNext: () => void}> = ({ contractText, history, onStart, isLoading, onNext }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
             <h2 className="text-2xl font-bold text-gray-800">Etapa 4: Simulação de Negociação</h2>
             <p className="text-sm text-slate-600">Prepare-se para a negociação. Escolha um perfil para a IA e veja quais pontos do seu contrato ela irá questionar.</p>
             <div className="space-y-2">
                {negotiatorPersonas.map(p => <button key={p} onClick={() => onStart(p)} disabled={isLoading} className="w-full text-left p-3 border rounded-md hover:bg-indigo-50 disabled:bg-slate-100">{p}</button>)}
             </div>
             <button onClick={onNext} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700">Finalizar e Exportar</button>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg border min-h-[400px] flex flex-col">
            <div className="flex-grow overflow-y-auto space-y-4">
                {isLoading && <div className="text-center text-slate-500 pt-16">Aguardando negociador...</div>}
                {history.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-sm p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white'}`}>
                           {msg.content}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 flex gap-2">
                <input type="text" placeholder="Sua resposta... (Funcionalidade em desenvolvimento)" disabled className="flex-grow p-2 border rounded-md" />
                <button disabled className="bg-indigo-300 text-white p-2 rounded-md"><PaperAirplaneIcon className="w-5 h-5"/></button>
            </div>
        </div>
    </div>
);

const ExportStage: React.FC<{contractText: string}> = ({ contractText }) => {
    const showToast = useToast();
    const handleDownload = () => {
        const blob = new Blob([contractText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `contrato_advocaciaai.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    const handleCopy = () => {
        navigator.clipboard.writeText(contractText);
        showToast({ type: 'success', message: 'Contrato copiado!' });
    };
    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Etapa 5: Contrato Final</h2>
            <div className="bg-slate-100 p-4 rounded-lg border h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm font-sans">{contractText}</pre>
            </div>
             <div className="mt-6 flex justify-center gap-4">
                 <button onClick={handleCopy} className="bg-slate-600 text-white font-bold py-2 px-6 rounded-md hover:bg-slate-700">Copiar Texto</button>
                <button onClick={handleDownload} className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-md hover:bg-indigo-700">Baixar .txt</button>
            </div>
        </div>
    );
};