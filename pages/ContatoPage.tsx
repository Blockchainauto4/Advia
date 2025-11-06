import React from 'react';
import { useToast, useNavigation } from '../App.tsx';

export const ContatoPage: React.FC = () => {
    const showToast = useToast();
    const { navigate } = useNavigation();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        showToast({ type: 'success', message: 'Mensagem enviada com sucesso!' });
        e.currentTarget.reset(); // Limpa o formulário
    };

    return (
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Entre em Contato</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
                            <input type="text" id="name" name="name" className="mt-1 block w-full px-3 py-2 text-gray-900 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500" placeholder="Seu nome completo" required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" id="email" name="email" className="mt-1 block w-full px-3 py-2 text-gray-900 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500" placeholder="seu@email.com" required />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensagem</label>
                            <textarea id="message" name="message" rows={4} className="mt-1 block w-full px-3 py-2 text-gray-900 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500" placeholder="Sua mensagem..." required></textarea>
                        </div>
                        <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Enviar Mensagem
                        </button>
                    </form>
                    <div className="text-gray-700 space-y-4">
                        <div>
                            <h3 className="text-xl font-semibold text-indigo-700 mb-2">Informações Adicionais</h3>
                            <p className="mb-2"><strong>Email para Suporte:</strong> suporte@advocaciaai.com.br</p>
                            <p className="mb-2"><strong>WhatsApp:</strong> (11) 93204-6970</p>
                            <p>Estamos disponíveis para responder suas perguntas e ouvir suas sugestões. Sua opinião é muito importante para nós!</p>
                        </div>
                         <div>
                            <h3 className="text-xl font-semibold text-indigo-700 mb-2">Navegação</h3>
                            <ul className="list-disc list-inside">
                                <li><a href="#/quem-somos" onClick={(e) => { e.preventDefault(); navigate('#/quem-somos'); }} className="text-indigo-600 hover:underline">Sobre Nós</a></li>
                                <li><a href="#/planos" onClick={(e) => { e.preventDefault(); navigate('#/planos'); }} className="text-indigo-600 hover:underline">Nossos Planos</a></li>
                                <li><a href="#/termos" onClick={(e) => { e.preventDefault(); navigate('#/termos'); }} className="text-indigo-600 hover:underline">Termos de Serviço</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};