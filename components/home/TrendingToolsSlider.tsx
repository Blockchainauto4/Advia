import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigation } from '../../App.tsx';
import { DocumentTextIcon, HomeIcon, ChatBubbleLeftRightIcon, SparklesIcon, ShareIcon, ChevronLeftIcon, ChevronRightIcon } from '../Icons.tsx';

const trendingTools = [
    {
        title: 'Petição Inicial com IA',
        description: 'Crie petições iniciais completas e bem fundamentadas em questão de minutos.',
        icon: <DocumentTextIcon className="w-10 h-10 text-indigo-600" />,
        ctaText: 'Criar Petição',
        link: '#/documentos',
    },
    {
        title: 'Cálculo de Tempo de Contribuição',
        description: 'Some múltiplos vínculos e descubra o tempo total de contribuição para aposentadoria.',
        icon: <HomeIcon className="w-10 h-10 text-indigo-600" />,
        ctaText: 'Calcular Agora',
        link: '#/calculadoras/previdenciario',
    },
    {
        title: 'Chat Jurídico Especializado',
        description: 'Tire dúvidas complexas com assistentes de IA treinados em áreas específicas do direito.',
        icon: <ChatBubbleLeftRightIcon className="w-10 h-10 text-indigo-600" />,
        ctaText: 'Consultar IA',
        link: '#/chat',
    },
    {
        title: 'Gerador de Contratos',
        description: 'Elabore contratos de prestação de serviços e outros tipos com cláusulas geradas por IA.',
        icon: <SparklesIcon className="w-10 h-10 text-indigo-600" />,
        ctaText: 'Gerar Contrato',
        link: '#/documentos',
    },
    {
        title: 'Marketing Jurídico com IA',
        description: 'Crie posts, calendários de conteúdo e vídeos para suas redes sociais.',
        icon: <ShareIcon className="w-10 h-10 text-indigo-600" />,
        ctaText: 'Criar Conteúdo',
        link: '#/marketing',
    },
];

export const TrendingToolsSlider: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { navigate } = useNavigation();
    // FIX: Use ReturnType<typeof setTimeout> for portability between environments (browser/Node.js).
    // This resolves the "Cannot find namespace 'NodeJS'" error in a browser-only context.
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const resetTimeout = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % trendingTools.length);
    }, []);

    useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(nextSlide, 5000); // Change slide every 5 seconds
        return () => resetTimeout();
    }, [currentIndex, nextSlide, resetTimeout]);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + trendingTools.length) % trendingTools.length);
    };
    
    const handleNavigation = (link: string) => {
        navigate(link);
    };

    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">Ferramentas em Alta</h2>
                    <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Descubra as funcionalidades mais procuradas por advogados como você.</p>
                </div>
                <div 
                    className="relative max-w-4xl mx-auto overflow-hidden rounded-lg shadow-xl"
                    onMouseEnter={resetTimeout}
                    onMouseLeave={() => { timeoutRef.current = setTimeout(nextSlide, 5000); }}
                >
                    <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                        {trendingTools.map((tool, index) => (
                            <div key={index} className="w-full flex-shrink-0 bg-white p-8 md:p-12">
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    <div className="flex-shrink-0 bg-indigo-100 rounded-full p-4">
                                        {tool.icon}
                                    </div>
                                    <div className="text-center md:text-left">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{tool.title}</h3>
                                        <p className="text-gray-600 mb-6">{tool.description}</p>
                                        <button 
                                            onClick={() => handleNavigation(tool.link)}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                                        >
                                            {tool.ctaText}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Buttons */}
                    <button onClick={prevSlide} className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/50 hover:bg-white/80 text-slate-700 p-2 rounded-full shadow-md transition-colors">
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <button onClick={nextSlide} className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/50 hover:bg-white/80 text-slate-700 p-2 rounded-full shadow-md transition-colors">
                        <ChevronRightIcon className="w-6 h-6" />
                    </button>
                    
                    {/* Dots Indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {trendingTools.map((_, index) => (
                             <button 
                                key={index} 
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full ${currentIndex === index ? 'bg-indigo-600' : 'bg-slate-300'} transition-colors`}
                                aria-label={`Ir para o slide ${index + 1}`}
                             />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};