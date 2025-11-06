import React from 'react';
import { SparklesIcon, LinkedInIcon } from '../components/Icons.tsx';

export const QuemSomosPage = () => (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <SparklesIcon className="w-16 h-16 mx-auto text-indigo-500 mb-4" />
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Nossa Missão</h1>
                <p className="text-lg text-gray-600">
                    Democratizar o acesso a ferramentas jurídicas de ponta, combinando a precisão do direito com o poder da inteligência artificial para otimizar a rotina de advogados e profissionais da área.
                </p>
            </div>

            <div className="border-t pt-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Fundador</h2>
                <div className="flex justify-center">
                    <div className="text-center flex flex-col items-center max-w-md">
                        <img className="w-32 h-32 rounded-full mx-auto mb-4 object-cover bg-slate-200" src="https://i.pravatar.cc/150?u=brunoaudric" alt="Foto de Bruno Audric Bittencourt Rizk" />
                        <h3 className="text-xl font-bold text-gray-800">Bruno Audric Bittencourt Rizk</h3>
                        <p className="text-indigo-600 font-semibold">Fundador & Idealizador</p>
                        <p className="text-sm text-gray-500 font-medium">OAB/UF 123.456</p>
                        <p className="text-sm text-gray-600 mt-2">
                            Visionário e empreendedor, Bruno é a força motriz por trás da AdvocaciaAI. Com uma profunda compreensão das necessidades do setor jurídico e uma paixão por inovação tecnológica, ele idealizou a plataforma para transformar a maneira como os profissionais do direito trabalham, tornando suas rotinas mais eficientes e estratégicas.
                        </p>
                        <div className="mt-4">
                            <a href="https://www.linkedin.com/in/brunoaudric" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-600 transition-colors">
                                <LinkedInIcon className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
);