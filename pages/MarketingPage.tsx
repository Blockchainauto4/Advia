import React, { useState, useEffect, useCallback } from 'react';
import type { SocialPost, User } from '../types';
import { useToast } from '../App';
import { generateContentCalendar, generateSocialMediaPost, generateVideoFromPost } from '../services/geminiService';
import { socialApiService } from '../services/socialApiService';
import { marketingHistoryService } from '../services/marketingHistoryService';
import { AccessControlOverlay } from '../components/AccessControlOverlay';
import { SparklesIcon, CalendarDaysIcon, DocumentTextIcon, ClockIcon, TikTokIcon, ShareIcon, TrashIcon, VideoCameraIcon, ArrowPathIcon } from '../components/Icons';

type Tab = 'calendar' | 'post' | 'history';

interface MarketingPageProps {
    user: User | null;
}

const platforms = ['Instagram (Feed)', 'Instagram (Carrossel)', 'TikTok / Reels', 'LinkedIn', 'Blog Article'];
const tones = ['Formal', 'Informativo', 'Acessível', 'Persuasivo', 'Empático'];

// --- Main Component ---
export const MarketingPage: React.FC<MarketingPageProps> = ({ user }) => {
    const [activeTab, setActiveTab] = useState<Tab>('post');
    const isAllowed = !!user?.subscription;

    return (
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Marketing Jurídico com IA</h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">Crie calendários, posts e até vídeos para suas redes sociais. Engaje seu público e atraia novos clientes.</p>
            </div>
            
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-4 sm:space-x-8" aria-label="Tabs">
                        <TabButton id="post" activeTab={activeTab} setActiveTab={setActiveTab} icon={<DocumentTextIcon className="w-5 h-5 mr-2" />}>Gerar Post</TabButton>
                        <TabButton id="calendar" activeTab={activeTab} setActiveTab={setActiveTab} icon={<CalendarDaysIcon className="w-5 h-5 mr-2" />}>Calendário de Conteúdo</TabButton>
                        <TabButton id="history" activeTab={activeTab} setActiveTab={setActiveTab} icon={<ClockIcon className="w-5 h-5 mr-2" />}>Histórico</TabButton>
                    </nav>
                </div>

                <div>
                    <AccessControlOverlay isAllowed={isAllowed} featureName="Marketing Jurídico com IA">
                        {activeTab === 'post' && <PostGenerator />}
                        {activeTab === 'calendar' && <CalendarGenerator />}
                        {activeTab === 'history' && <HistoryViewer />}
                    </AccessControlOverlay>
                </div>
            </div>
        </main>
    );
};


// --- Tab Components ---

const TabButton: React.FC<{id: Tab, activeTab: Tab, setActiveTab: (t: Tab) => void, children: React.ReactNode, icon: React.ReactNode}> = 
    ({id, activeTab, setActiveTab, children, icon}) => (
    <button
        onClick={() => setActiveTab(id)}
        className={`${
            activeTab === id
            ? 'border-indigo-500 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
    >
        {icon} {children}
    </button>
);

const PostGenerator = () => {
    const [theme, setTheme] = useState('');
    const [platform, setPlatform] = useState(platforms[0]);
    const [tone, setTone] = useState(tones[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedPost, setGeneratedPost] = useState<SocialPost | null>(null);
    const showToast = useToast();

    const handleGenerate = async () => {
        if (!theme.trim()) {
            showToast({ type: 'error', message: 'Por favor, insira um tema para o post.' });
            return;
        }
        setIsLoading(true);
        setGeneratedPost(null);
        try {
            const postData = await generateSocialMediaPost(theme, platform, tone);
            const newPost: SocialPost = {
                id: `post_${Date.now()}`,
                theme,
                platform,
                tone,
                status: 'draft',
                ...postData,
                title: postData.title || 'Título não gerado',
                visualSuggestions: postData.visualSuggestions || '',
                hashtags: postData.hashtags || [],
            };
            setGeneratedPost(newPost);
            marketingHistoryService.savePost(newPost);
        } catch (error) {
            showToast({ type: 'error', message: error instanceof Error ? error.message : 'Falha ao gerar post.' });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
                 <div>
                    <label htmlFor="theme" className="block text-sm font-medium text-gray-700">Tema do Post</label>
                    <input type="text" id="theme" value={theme} onChange={e => setTheme(e.target.value)} placeholder="Ex: A importância do contrato de aluguel" className="mt-1 w-full p-2 border rounded-md"/>
                </div>
                <div>
                    <label htmlFor="platform" className="block text-sm font-medium text-gray-700">Plataforma</label>
                    <select id="platform" value={platform} onChange={e => setPlatform(e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white">
                        {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="tone" className="block text-sm font-medium text-gray-700">Tom de Voz</label>
                    <select id="tone" value={tone} onChange={e => setTone(e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white">
                         {tones.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <button onClick={handleGenerate} disabled={isLoading} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex justify-center items-center">
                    {isLoading ? 'Gerando...' : <><SparklesIcon className="w-5 h-5 mr-2" /> Gerar Post</>}
                </button>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border min-h-[300px]">
                {isLoading && <LoadingSpinner text="A IA está criando seu post..." />}
                {generatedPost && <PostDisplay post={generatedPost} setPost={setGeneratedPost}/>}
                {!isLoading && !generatedPost && <div className="text-center text-slate-500 pt-16">Seu post aparecerá aqui.</div>}
            </div>
        </div>
    );
};

const CalendarGenerator = () => {
    // Implementation for Calendar Generator
    const [areaAtuacao, setAreaAtuacao] = useState('Direito de Família');
    const [duracao, setDuracao] = useState('7');
    const [isLoading, setIsLoading] = useState(false);
    const [calendario, setCalendario] = useState<any[] | null>(null);
    const showToast = useToast();

     const handleGenerate = async () => {
        setIsLoading(true);
        setCalendario(null);
        try {
            const result = await generateContentCalendar(areaAtuacao, duracao);
            setCalendario(result.calendario);
        } catch (error) {
            showToast({ type: 'error', message: error instanceof Error ? error.message : 'Falha ao gerar calendário.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="area" className="block text-sm font-medium text-gray-700">Sua Área de Atuação</label>
                    <input type="text" id="area" value={areaAtuacao} onChange={e => setAreaAtuacao(e.target.value)} className="mt-1 w-full p-2 border rounded-md"/>
                </div>
                 <div>
                    <label htmlFor="duracao" className="block text-sm font-medium text-gray-700">Duração (dias)</label>
                    <input type="number" id="duracao" value={duracao} onChange={e => setDuracao(e.target.value)} className="mt-1 w-full p-2 border rounded-md"/>
                </div>
                <div className="self-end">
                    <button onClick={handleGenerate} disabled={isLoading} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex justify-center items-center">
                        {isLoading ? 'Gerando...' : <><SparklesIcon className="w-5 h-5 mr-2" /> Gerar Calendário</>}
                    </button>
                </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border min-h-[300px]">
                {isLoading && <LoadingSpinner text="A IA está planejando seu conteúdo..." />}
                {calendario && (
                    <div className="max-h-96 overflow-y-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-200 sticky top-0">
                                <tr>
                                    <th className="p-2 text-left">Dia</th>
                                    <th className="p-2 text-left">Tema</th>
                                    <th className="p-2 text-left">Formato</th>
                                    <th className="p-2 text-left">CTA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {calendario.map(item => (
                                    <tr key={item.dia} className="border-b">
                                        <td className="p-2 font-bold">{item.dia}</td>
                                        <td className="p-2">{item.tema}</td>
                                        <td className="p-2">{item.formato}</td>
                                        <td className="p-2">{item.cta}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                 {!isLoading && !calendario && <div className="text-center text-slate-500 pt-16">Seu calendário de conteúdo aparecerá aqui.</div>}
            </div>
        </div>
    );
};

const HistoryViewer = () => {
    const [history, setHistory] = useState<SocialPost[]>([]);
    const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);

    const loadHistory = useCallback(() => {
        const posts = marketingHistoryService.getHistory();
        setHistory(posts);
        if (posts.length > 0 && !selectedPost) {
            setSelectedPost(posts[0]);
        } else if (posts.length === 0) {
            setSelectedPost(null);
        }
    }, [selectedPost]);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);
    
    const handleDelete = (id: string) => {
        const newHistory = history.filter(p => p.id !== id);
        marketingHistoryService.saveHistory(newHistory);
        setHistory(newHistory);
        if(selectedPost?.id === id){
            setSelectedPost(newHistory[0] || null);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[500px]">
            <div className="lg:col-span-1 bg-slate-50 p-4 rounded-lg border">
                <h3 className="font-bold mb-2">Posts Gerados</h3>
                {history.length === 0 && <p className="text-sm text-slate-500">Nenhum post no histórico.</p>}
                <ul className="space-y-2 max-h-96 overflow-y-auto">
                    {history.map(post => (
                        <li key={post.id}>
                            <button onClick={() => setSelectedPost(post)} className={`w-full text-left p-2 rounded-md ${selectedPost?.id === post.id ? 'bg-indigo-100' : 'hover:bg-slate-200'}`}>
                                <p className="font-semibold truncate text-sm">{post.title}</p>
                                <p className="text-xs text-slate-500">{post.platform} - {post.tone}</p>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="lg:col-span-2 bg-slate-50 p-4 rounded-lg border">
                 {selectedPost ? <PostDisplay post={selectedPost} setPost={setSelectedPost} onDelete={handleDelete}/> : <div className="text-center text-slate-500 pt-16">Selecione um post para visualizar.</div>}
            </div>
        </div>
    );
};

// --- Helper Components ---
const LoadingSpinner: React.FC<{text: string}> = ({ text }) => (
    <div className="flex flex-col items-center justify-center h-full text-slate-500">
        <svg className="animate-spin h-8 w-8 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <p>{text}</p>
    </div>
);

const PostDisplay: React.FC<{post: SocialPost; setPost: (post: SocialPost) => void; onDelete?: (id: string) => void}> = ({post, setPost, onDelete}) => {
    const [doubt, setDoubt] = useState('');
    const [videoStatus, setVideoStatus] = useState(post.videoStatus || 'idle');
    const [videoUrl, setVideoUrl] = useState(post.videoUrl);
    const showToast = useToast();

    // New state for VEO API key selection
    const [isApiKeySelected, setIsApiKeySelected] = useState(false);
    const [isCheckingApiKey, setIsCheckingApiKey] = useState(true);

    useEffect(() => {
        const checkKey = async () => {
            if (post && post.platform.includes('TikTok')) {
                setIsCheckingApiKey(true);
                try {
                    if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
                        const hasKey = await window.aistudio.hasSelectedApiKey();
                        setIsApiKeySelected(hasKey);
                    } else {
                        console.warn("aistudio API not found.");
                        setIsApiKeySelected(false);
                    }
                } catch (e) {
                    console.error("Error checking for API key:", e);
                    setIsApiKeySelected(false);
                } finally {
                    setIsCheckingApiKey(false);
                }
            } else {
                setIsCheckingApiKey(false);
            }
        };
        checkKey();
    }, [post]);

    const handleSelectKey = async () => {
        try {
            await window.aistudio.openSelectKey();
            setIsApiKeySelected(true);
            showToast({ type: 'info', message: 'Chave API selecionada. Tente gerar o vídeo novamente.' });
        } catch (e) {
            console.error("Error opening select key dialog:", e);
            showToast({ type: 'error', message: 'Não foi possível abrir a seleção de chave API.' });
        }
    };

    const handleGenerateVideo = async () => {
        if(!post.script || !doubt) {
            showToast({ type: 'error', message: 'Roteiro e Dúvida são necessários para gerar o vídeo.' });
            return;
        }
        setVideoStatus('generating');
        const updatedPost = { ...post, videoStatus: 'generating' as const, videoGenerationError: null };
        setPost(updatedPost);

        try {
            const url = await generateVideoFromPost(post, doubt, (statusMsg) => {
                 setPost({ ...updatedPost, videoGenerationError: statusMsg });
            });
            setVideoUrl(url);
            setVideoStatus('ready');
            const finalPost = {...post, videoUrl: url, videoStatus: 'ready' as const};
            setPost(finalPost);
            marketingHistoryService.savePost(finalPost);
            showToast({ type: 'success', message: 'Vídeo gerado com sucesso!' });
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : "Erro desconhecido";
            
            if (errorMsg === "API_KEY_INVALID" || errorMsg.includes('Requested entity was not found')) {
                showToast({ type: 'error', message: 'Sua chave API é inválida ou foi revogada. Por favor, selecione outra.' });
                setIsApiKeySelected(false);
            } else if (errorMsg === "API_KEY_NOT_SELECTED") {
                 showToast({ type: 'error', message: 'Por favor, selecione uma chave API para gerar vídeos.' });
                 setIsApiKeySelected(false);
            } else {
                showToast({ type: 'error', message: `Falha na geração do vídeo. Tente novamente.` });
            }

            setVideoStatus('failed');
            const failedPost = {...post, videoStatus: 'failed' as const, videoGenerationError: "Falha na geração. Verifique sua chave API e tente novamente."};
            setPost(failedPost);
            marketingHistoryService.savePost(failedPost);
        }
    }
    
    return (
        <div className="space-y-4 h-full flex flex-col">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg">{post.title}</h3>
                    <div className="text-xs space-x-2">
                        <span className="bg-slate-200 px-2 py-0.5 rounded-full">{post.platform}</span>
                        <span className="bg-slate-200 px-2 py-0.5 rounded-full">{post.tone}</span>
                    </div>
                </div>
                 {onDelete && <button onClick={() => onDelete(post.id)} className="text-red-500 p-1 hover:bg-red-100 rounded-full"><TrashIcon className="w-4 h-4"/></button>}
            </div>
            
            <div className="text-sm space-y-4 flex-grow overflow-y-auto pr-2">
                {post.script && <div><h4 className="font-semibold">Roteiro/Texto:</h4><p className="whitespace-pre-wrap">{post.script}</p></div>}
                {post.slides && (
                    <div>
                        <h4 className="font-semibold mb-1">Slides do Carrossel:</h4>
                        <div className="space-y-2">
                        {post.slides.map((slide, i) => (
                            <div key={i} className="bg-white border p-2 rounded">
                                <p className="font-bold">{slide.title}</p>
                                <p>{slide.body}</p>
                                <p className="text-xs text-slate-500 italic mt-1">Sugestão de Imagem: {slide.imageSuggestion}</p>
                            </div>
                        ))}
                        </div>
                    </div>
                )}
                {post.articleBody && <div><h4 className="font-semibold">Corpo do Artigo:</h4><p className="whitespace-pre-wrap">{post.articleBody}</p></div>}
                
                <div><h4 className="font-semibold">Sugestões Visuais:</h4><p>{post.visualSuggestions}</p></div>
                <div><h4 className="font-semibold">Hashtags:</h4><p className="text-indigo-600">{post.hashtags.join(' ')}</p></div>
            </div>
            
            {post.platform.includes('TikTok') && (
                 <div className="border-t pt-4 space-y-2">
                    <h4 className="font-semibold text-md flex items-center"><VideoCameraIcon className="w-5 h-5 mr-2 text-indigo-600" /> Gerar Vídeo para TikTok</h4>
                    {isCheckingApiKey ? (
                        <div className="text-center text-sm text-slate-500 p-4">Verificando chave API...</div>
                    ) : isApiKeySelected ? (
                        videoUrl ? (
                            <div>
                                <video src={videoUrl} controls className="w-full rounded-md" />
                                <button onClick={() => { setVideoUrl(undefined); setVideoStatus('idle'); }} className="text-sm text-indigo-600 mt-2 hover:underline">Gerar novo vídeo</button>
                            </div>
                        ) : (
                            <>
                                <input type="text" value={doubt} onChange={e => setDoubt(e.target.value)} placeholder="Digite a dúvida que inicia o vídeo" className="w-full text-sm p-2 border rounded-md"/>
                                <button onClick={handleGenerateVideo} disabled={videoStatus === 'generating'} className="w-full bg-rose-500 text-white text-sm font-bold py-2 px-4 rounded-md hover:bg-rose-600 disabled:bg-rose-300 flex justify-center items-center">
                                    {videoStatus === 'generating' ? 'Gerando...' : <><TikTokIcon className="w-4 h-4 mr-2" /> Gerar Vídeo</>}
                                </button>
                                {videoStatus === 'generating' && <p className="text-xs text-slate-500 text-center animate-pulse">{post.videoGenerationError || 'Iniciando geração...'}</p>}
                                {videoStatus === 'failed' && <p className="text-xs text-red-500 text-center">{post.videoGenerationError || "Falha na geração."}</p>}
                            </>
                        )
                    ) : (
                        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                            <p className="text-sm font-semibold text-amber-800">Ação Necessária</p>
                            <p className="text-xs text-amber-700 mt-1">Para gerar vídeos com o modelo Veo, você precisa selecionar uma chave API com um projeto que tenha faturamento habilitado.</p>
                            <p className="text-xs text-amber-700 mt-2">
                                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline">Saiba mais sobre faturamento</a>.
                            </p>
                            <button onClick={handleSelectKey} className="mt-4 w-full bg-amber-500 text-white text-sm font-bold py-2 px-4 rounded-md hover:bg-amber-600">
                                Selecionar Chave API
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};