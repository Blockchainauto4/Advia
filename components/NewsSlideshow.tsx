import React, { useState, useEffect, useCallback } from 'react';
import type { NewsArticle } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

export const NewsSlideshow: React.FC = () => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNews = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/news-rss');
                if (!response.ok) {
                    throw new Error('Não foi possível carregar as notícias.');
                }
                const data: NewsArticle[] = await response.json();
                if (data.length === 0) {
                    // Don't show an error, just hide the component
                    setArticles([]);
                }
                setArticles(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchNews();
    }, []);

    const goToPrevious = useCallback(() => {
        if (articles.length === 0) return;
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? articles.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    }, [currentIndex, articles.length]);

    const goToNext = useCallback(() => {
        if (articles.length === 0) return;
        const isLastSlide = currentIndex === articles.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }, [currentIndex, articles.length]);

    useEffect(() => {
        if (articles.length > 1) {
            const timer = setTimeout(goToNext, 7000); // Change slide every 7 seconds
            return () => clearTimeout(timer);
        }
    }, [currentIndex, articles.length, goToNext]);

    if (isLoading) {
        return (
            <section className="bg-slate-50 py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500">
                    Carregando últimas notícias...
                </div>
            </section>
        );
    }

    if (error || articles.length === 0) {
        // Silently fail or hide if there's an error or no articles
        return null;
    }
    
    const currentArticle = articles[currentIndex];

    return (
        <section className="bg-slate-50 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                 <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Últimas Notícias do Mundo Jurídico</h2>
                <div className="relative max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-xl shadow-lg overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500"></div>
                     <button
                        onClick={goToPrevious}
                        className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 z-10 p-2 bg-white/50 hover:bg-white rounded-full shadow-md transition"
                        aria-label="Notícia anterior"
                    >
                        <ChevronLeftIcon className="w-6 h-6 text-slate-700" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 z-10 p-2 bg-white/50 hover:bg-white rounded-full shadow-md transition"
                        aria-label="Próxima notícia"
                    >
                        <ChevronRightIcon className="w-6 h-6 text-slate-700" />
                    </button>
                    
                    <div key={currentIndex} className="animate-fade-in">
                        <div className="text-center">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 leading-tight">
                                <a href={currentArticle.link} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">
                                    {currentArticle.title}
                                </a>
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-2xl mx-auto line-clamp-3">
                                {currentArticle.description}
                            </p>
                            <div className="text-xs text-gray-500">
                                <span>Fonte: {currentArticle.source}</span> &bull; <span>{new Date(currentArticle.pubDate).toLocaleDateString('pt-BR')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
             {/* Add keyframes for animation in style */}
            <style>{`
                .animate-fade-in {
                    animation: fadeIn 0.8s ease-in-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .line-clamp-3 {
                   overflow: hidden;
                   display: -webkit-box;
                   -webkit-box-orient: vertical;
                   -webkit-line-clamp: 3;
                }
            `}</style>
        </section>
    );
};
