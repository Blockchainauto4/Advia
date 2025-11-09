import React from 'react';
import { DecimoTerceiroCalculator } from '../calculators/index';
import { CalculatorIcon, CurrencyDollarIcon, CalendarDaysIcon } from '../components/Icons';

export const DecimoTerceiroPage: React.FC = () => {
    return (
        <main className="flex-grow bg-slate-50 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 flex items-center justify-center flex-wrap">
                        <CalculatorIcon className="w-8 h-8 sm:w-10 sm:h-10 mr-3 text-indigo-600" />
                        Calculadora de Décimo Terceiro
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Calcule o valor exato da sua gratificação natalina, incluindo os descontos de INSS e Imposto de Renda, de forma simples, rápida e atualizada para 2024.
                    </p>
                </div>

                {/* Calculator Card */}
                <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-xl mb-12 border border-slate-100">
                    <DecimoTerceiroCalculator />
                </div>

                {/* Educational Content Section */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 prose prose-indigo lg:prose-lg max-w-none">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Tudo sobre o 13º Salário</h2>
                        
                        {/* Key Dates Highlights */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose mb-10">
                            <div className="flex items-start p-4 bg-green-50 rounded-lg border border-green-100">
                                <div className="bg-green-100 p-3 rounded-full mr-4 flex-shrink-0">
                                    <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-green-900 mb-1 text-lg">Primeira Parcela</h3>
                                    <p className="text-sm text-green-800">Deve ser paga entre 1º de fevereiro e <strong>30 de novembro</strong>. Corresponde a 50% do salário bruto, sem descontos.</p>
                                </div>
                            </div>
                            <div className="flex items-start p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="bg-blue-100 p-3 rounded-full mr-4 flex-shrink-0">
                                    <CalendarDaysIcon className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-blue-900 mb-1 text-lg">Segunda Parcela</h3>
                                    <p className="text-sm text-blue-800">Deve ser paga até <strong>20 de dezembro</strong>. É o saldo restante, onde incidem os descontos de INSS e IRRF sobre o valor total.</p>
                                </div>
                            </div>
                        </div>

                        <h3>Quem tem direito?</h3>
                        <p>Todo trabalhador com carteira assinada (regime CLT), sejam trabalhadores domésticos, rurais, urbanos ou avulsos. Aposentados e pensionistas do INSS também têm direito ao benefício.</p>
                        <p>Para ter direito ao valor integral, é necessário ter trabalhado os 12 meses do ano. Caso contrário, o valor será <strong>proporcional</strong> aos meses trabalhados. Considera-se "mês trabalhado" a fração igual ou superior a 15 dias de trabalho no mesmo mês.</p>

                        <h3>Como é feito o cálculo base?</h3>
                        <p>A base de cálculo é o salário bruto devido em dezembro (ou no mês da rescisão). A fórmula básica para o valor integral é simples: o próprio salário bruto.</p>
                        <p>Para o valor proporcional, a conta é: <code>(Salário Bruto ÷ 12) × Meses Trabalhados</code>.</p>
                        
                        <h4>O que mais entra no cálculo?</h4>
                        <ul>
                            <li><strong>Médias:</strong> Valores variáveis como horas extras, adicional noturno, comissões e adicionais de periculosidade ou insalubridade integram a base de cálculo através de médias anuais.</li>
                            <li><strong>Descontos:</strong> O INSS e o Imposto de Renda Retido na Fonte (IRRF) são calculados sobre o valor total do benefício e descontados integralmente na segunda parcela.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
};