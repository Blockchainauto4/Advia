
import React from 'react';
import { SparklesIcon, DocumentArrowUpIcon } from '../components/Icons';

export const ConversorPage = () => (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto text-center">
            <div className="flex justify-center items-center gap-4 mb-6">
                 <DocumentArrowUpIcon className="w-12 h-12 text-indigo-300" />
                 <SparklesIcon className="w-16 h-16 text-indigo-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Conversor de Arquivos em Construção</h1>
            <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
                Em breve, você poderá converter seus arquivos PDF para Word, Word para PDF, e muito mais, diretamente em nossa plataforma e com a ajuda da IA para otimizações.
            </p>
             <div className="mt-8 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="font-semibold text-slate-800">Fique Atento!</h3>
                <p className="text-sm text-slate-600">Estamos trabalhando para trazer essa funcionalidade poderosa para você.</p>
            </div>
        </div>
    </main>
);
