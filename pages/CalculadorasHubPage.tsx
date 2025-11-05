import React from 'react';
import { SparklesIcon } from '../components/Icons';
import { calculatorCategories } from '../configs/calculatorConfigs';
import { useNavigation } from '../App';

export const CalculadorasHubPage: React.FC = () => {
    const { navigate } = useNavigation();
    
    return (
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Central de Calculadoras Jurídicas</h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">Ferramentas completas e precisas para otimizar sua rotina jurídica e garantir a agilidade que você precisa.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {calculatorCategories.map(category => (
                    <a
                        key={category.id}
                        href={`#/calculadoras/${category.id}`}
                        onClick={(e) => { e.preventDefault(); navigate(`#/calculadoras/${category.id}`); }}
                        className="bg-white p-6 rounded-lg shadow-lg text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start"
                    >
                        <div className="bg-indigo-100 text-indigo-600 rounded-lg p-3 mb-4">{category.icon}</div>
                        <h3 className="text-xl font-bold text-gray-800">{category.title}</h3>
                        <p className="text-sm text-gray-500 mt-1 flex-grow">{category.description}</p>
                        <span className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800">
                            Ver calculadoras &rarr;
                        </span>
                    </a>
                ))}
                 <div className="md:col-span-2 lg:col-span-3 bg-slate-100 p-8 rounded-lg text-center flex flex-col items-center justify-center">
                     <SparklesIcon className="w-12 h-12 text-indigo-500 mb-4" />
                    <h3 className="text-2xl font-bold text-slate-800">Um Ecossistema em Expansão</h3>
                    <p className="text-slate-600 mt-2 max-w-2xl">Estamos desenvolvendo dezenas de outras calculadoras, incluindo ferramentas para Direito Imobiliário, Consumidor e muito mais. Volte sempre para conferir as novidades!</p>
                </div>
            </div>
        </main>
    );
};