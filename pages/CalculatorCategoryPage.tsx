import React, { useState, useMemo } from 'react';
import { calculatorCategories } from '../configs/calculatorConfigs';
import type { Calculator } from '../configs/calculatorConfigs';
import { useNavigation } from '../AppContext';
import { ArrowLeftOnRectangleIcon } from '../components/Icons';
import { AccessControlOverlay } from '../components/AccessControlOverlay';
import type { User } from '../types';

interface CalculatorCategoryPageProps {
  categoryId: string;
  user: User | null;
}

export const CalculatorCategoryPage: React.FC<CalculatorCategoryPageProps> = ({ categoryId, user }) => {
    const { navigate } = useNavigation();
    const [selectedCalculator, setSelectedCalculator] = useState<Calculator | null>(null);
    
    const category = useMemo(() => calculatorCategories.find(c => c.id === categoryId), [categoryId]);

    const handleSelectCalculator = (calculator: Calculator) => {
        setSelectedCalculator(calculator);
        // Optional: scroll to calculator view on mobile
        const calculatorView = document.getElementById('calculator-view');
        if (calculatorView) {
            calculatorView.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (!category) {
        return (
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <h1 className="text-2xl font-bold text-red-600">Categoria não encontrada</h1>
                <p className="text-slate-600 mt-2">A categoria de calculadoras que você procurou não existe.</p>
                <button onClick={() => navigate('#/calculadoras')} className="mt-6 bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">
                    Voltar para a Central
                </button>
            </main>
        );
    }

    const isAllowed = !!user;

    return (
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <button onClick={() => navigate('#/calculadoras')} className="flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800">
                     <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2 transform rotate-180" />
                    Voltar para todas as categorias
                </button>
            </div>
            <div className="text-center mb-12">
                <div className="inline-block bg-indigo-100 text-indigo-600 rounded-lg p-4 mb-4">{category.icon}</div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{category.title}</h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">{category.description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Calculator List */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Calculadoras Disponíveis</h2>
                        <ul className="space-y-2">
                            {category.calculators.map(calc => (
                                <li key={calc.id}>
                                    <button
                                        onClick={() => handleSelectCalculator(calc)}
                                        className={`w-full text-left p-3 rounded-md transition-colors text-sm ${selectedCalculator?.id === calc.id ? 'bg-indigo-100 text-indigo-800 font-semibold' : 'hover:bg-slate-100 text-slate-700'}`}
                                    >
                                        {calc.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Column: Selected Calculator View */}
                <div id="calculator-view" className="lg:col-span-2">
                    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg min-h-[400px]">
                        {selectedCalculator ? (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCalculator.name}</h2>
                                <p className="text-sm text-gray-500 mb-6">{selectedCalculator.description}</p>
                                <AccessControlOverlay isAllowed={isAllowed} featureName={selectedCalculator.name}>
                                    <selectedCalculator.component />
                                </AccessControlOverlay>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                                <CalculatorIcon className="w-16 h-16 text-slate-300 mb-4" />
                                <p className="font-semibold">Selecione uma calculadora na lista ao lado para começar.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

// Dummy icon for the back button, since ArrowLeftIcon is not available.
const CalculatorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 3h.008v.008H8.25v-.008zm0 3h.008v.008H8.25v-.008zm3-6h.008v.008H11.25v-.008zm0 3h.008v.008H11.25v-.008zm0 3h.008v.008H11.25v-.008zm3-6h.008v.008H14.25v-.008zm0 3h.008v.008H14.25v-.008zM4.5 21V5.25A2.25 2.25 0 016.75 3h10.5a2.25 2.25 0 012.25 2.25V21h-15z" />
  </svg>
);