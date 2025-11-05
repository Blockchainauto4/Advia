import React from 'react';
import { SparklesIcon, ClockIcon } from '../components/Icons';

export const BlogPage = () => (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto text-center">
            <div className="flex justify-center items-center gap-4 mb-6">
                 <ClockIcon className="w-12 h-12 text-indigo-300" />
                 <SparklesIcon className="w-16 h-16 text-indigo-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Jurídico em Construção</h1>
            <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
                Estamos preparando um espaço com artigos, notícias e dicas sobre a intersecção entre direito e tecnologia. Volte em breve para conferir insights que podem transformar sua prática jurídica.
            </p>
             <div className="mt-8 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="font-semibold text-slate-800">Fique Atento!</h3>
                <p className="text-sm text-slate-600">O conteúdo está sendo cuidadosamente elaborado por nossos especialistas.</p>
            </div>
        </div>
    </main>
);