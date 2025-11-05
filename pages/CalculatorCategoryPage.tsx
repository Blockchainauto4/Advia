import React from 'react';
import type { CalculatorCategory } from '../configs/calculatorConfigs';
import { useNavigation } from '../App';

export const CalculatorCategoryPage: React.FC<{ category: CalculatorCategory }> = ({ category }) => {
    const { navigate } = useNavigation();

    return (
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <a href="#/calculadoras" onClick={(e) => { e.preventDefault(); navigate('#/calculadoras'); }} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Voltar para Todas as Calculadoras
                </a>
            </div>
            <header className="text-center mb-12 border-b pb-8">
                <div className="inline-block bg-indigo-100 text-indigo-600 rounded-xl p-4 mb-4">{category.icon}</div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{category.title}</h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">{category.description}</p>
            </header>

            <div className="space-y-12 max-w-4xl mx-auto">
                {category.calculators.map(calc => {
                    const CalculatorComponent = calc.component;
                    return (
                        <section key={calc.id} id={calc.id} className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">{calc.name}</h2>
                            <CalculatorComponent />
                        </section>
                    );
                })}
            </div>
        </main>
    );
};