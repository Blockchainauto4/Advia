import React from 'react';
import { SparklesIcon, DocumentTextIcon, CalculatorIcon, ChatBubbleLeftRightIcon, ClockIcon, ShieldCheckIcon, ShareIcon, ScaleIcon } from '../components/Icons.tsx';
import { useNavigation } from '../App.tsx';
import { TrendingToolsSlider } from '../components/home/TrendingToolsSlider.tsx';

export const HomePage: React.FC = () => {
    const { navigate } = useNavigation();

    const testimonials = [
        {
            quote: "A AdvocaciaAI transformou minha rotina. O tempo que eu gastava em pesquisas e na elaboração de peças simples agora é usado em estratégia para meus clientes. É revolucionário.",
            name: "Dr. Ana Clara",
            title: "Advogada Cível",
            avatar: "https://i.pravatar.cc/150?u=ana-clara"
        },
        {
            quote: "Como advogado em início de carreira, as calculadoras e o gerador de documentos são indispensáveis. A plataforma me dá a segurança e a agilidade que eu preciso.",
            name: "Lucas Martins",
            title: "Advogado Trabalhista",
            avatar: "https://i.pravatar.cc/150?u=lucas-martins"
        },
        {
            quote: "O assistente de IA é incrível para tirar dúvidas rápidas e obter uma base sólida para casos complexos. A qualidade das respostas é impressionante.",
            name: "Sofia Ribeiro",
            title: "Advogada de Família",
            avatar: "https://i.pravatar.cc/150?u=sofia-ribeiro"
        }
    ];

    return (
        <main className="flex-grow">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white text-center py-20 px-4">
                <div className="container mx-auto max-w-4xl">
                    <SparklesIcon className="w-16 h-16 mx-auto text-indigo-400 mb-4" />
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                        A Revolução da IA na Advocacia Começa Agora
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
                        Crie peças, realize cálculos, analise documentos e otimize sua rotina com a plataforma de IA mais completa para advogados.
                    </p>
                    <button
                        onClick={() => navigate('#/chat')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
                    >
                        Explore as Ferramentas
                    </button>
                </div>
            </section>
            
             {/* Why Us Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Por que AdvocaciaAI?</h2>
                        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Nossa plataforma foi construída para atender as demandas reais do advogado moderno.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="text-center p-6">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mx-auto mb-4">
                                <ClockIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Eficiência Máxima</h3>
                            <p className="text-gray-600 text-sm">
                                Reduza horas de trabalho em minutos. Automatize tarefas repetitivas e foque no que realmente importa: a estratégia jurídica.
                            </p>
                        </div>
                        <div className="text-center p-6">
                             <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mx-auto mb-4">
                                <ShieldCheckIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Precisão e Qualidade</h3>
                            <p className="text-gray-600 text-sm">
                                Nossas IAs são treinadas com vasto material jurídico, garantindo respostas e documentos com alta acurácia e fundamentação.
                            </p>
                        </div>
                        <div className="text-center p-6">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mx-auto mb-4">
                                <SparklesIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Inovação Constante</h3>
                            <p className="text-gray-600 text-sm">
                                Estamos sempre à frente, incorporando as mais recentes tecnologias de IA para oferecer a você as melhores e mais novas ferramentas do mercado.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trending Tools Slider Section */}
            <TrendingToolsSlider />

            {/* Features Section */}
            <section className="py-20 bg-slate-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Ferramentas Essenciais para o Advogado Moderno</h2>
                        <p className="text-gray-600 mt-2">Tudo o que você precisa em um só lugar.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="bg-white p-8 rounded-lg shadow-lg text-center flex flex-col items-center hover:shadow-xl hover:-translate-y-1 transition-all">
                            <div className="bg-indigo-100 text-indigo-600 rounded-full p-4 mb-4">
                                <ChatBubbleLeftRightIcon className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Assistentes de IA</h3>
                            <p className="text-gray-600 text-sm mb-4 flex-grow">
                                Converse com IAs especializadas em Direito Cível, Penal, Trabalhista e mais. Obtenha respostas rápidas e fundamentadas.
                            </p>
                            <a href="#/chat" onClick={(e) => { e.preventDefault(); navigate('#/chat'); }} className="text-indigo-600 font-semibold hover:underline">
                                Ir para o Chat &rarr;
                            </a>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-lg text-center flex flex-col items-center hover:shadow-xl hover:-translate-y-1 transition-all">
                            <div className="bg-indigo-100 text-indigo-600 rounded-full p-4 mb-4">
                                <DocumentTextIcon className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Gerador de Documentos</h3>
                            <p className="text-gray-600 text-sm mb-4 flex-grow">
                                Crie petições, contratos e pareceres em minutos. Preencha os dados e deixe a IA redigir a peça jurídica completa para você.
                            </p>
                             <a href="#/documentos" onClick={(e) => { e.preventDefault(); navigate('#/documentos'); }} className="text-indigo-600 font-semibold hover:underline">
                                Criar Documento &rarr;
                            </a>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-lg text-center flex flex-col items-center hover:shadow-xl hover:-translate-y-1 transition-all">
                            <div className="bg-indigo-100 text-indigo-600 rounded-full p-4 mb-4">
                                <CalculatorIcon className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Calculadoras Jurídicas</h3>
                            <p className="text-gray-600 text-sm mb-4 flex-grow">
                                Realize cálculos de prazos, rescisões, juros, correções e muito mais com precisão e agilidade.
                            </p>
                            <a href="#/calculadoras" onClick={(e) => { e.preventDefault(); navigate('#/calculadoras'); }} className="text-indigo-600 font-semibold hover:underline">
                                Ver Calculadoras &rarr;
                            </a>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-lg text-center flex flex-col items-center hover:shadow-xl hover:-translate-y-1 transition-all">
                            <div className="bg-indigo-100 text-indigo-600 rounded-full p-4 mb-4">
                                <ShareIcon className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Marketing Jurídico com IA</h3>
                            <p className="text-gray-600 text-sm mb-4 flex-grow">
                                Crie posts, calendários de conteúdo e até vídeos para redes sociais. Engaje seu público e capte clientes de forma automatizada.
                            </p>
                            <a href="#/marketing" onClick={(e) => { e.preventDefault(); navigate('#/marketing'); }} className="text-indigo-600 font-semibold hover:underline">
                                Gerar Marketing &rarr;
                            </a>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-lg text-center flex flex-col items-center hover:shadow-xl hover:-translate-y-1 transition-all">
                            <div className="bg-indigo-100 text-indigo-600 rounded-full p-4 mb-4">
                                <ScaleIcon className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Consultas Públicas</h3>
                            <p className="text-gray-600 text-sm mb-4 flex-grow">
                                Consulte placas de veículos, CNPJ e CEP com análise jurídica da IA. Agilize suas verificações e obtenha insights valiosos.
                            </p>
                            <a href="#/consultas" onClick={(e) => { e.preventDefault(); navigate('#/consultas'); }} className="text-indigo-600 font-semibold hover:underline">
                                Fazer Consulta &rarr;
                            </a>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-lg text-center flex flex-col items-center hover:shadow-xl hover:-translate-y-1 transition-all">
                            <div className="bg-indigo-100 text-indigo-600 rounded-full p-4 mb-4">
                                <SparklesIcon className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Ferramentas Adicionais</h3>
                            <p className="text-gray-600 text-sm mb-4 flex-grow">
                                Utilize nosso Conversor de Documentos e a Câmera de Segurança com IA para aumentar ainda mais sua produtividade e segurança.
                            </p>
                            <a href="#/calculadoras" onClick={(e) => { e.preventDefault(); navigate('#/calculadoras'); }} className="text-indigo-600 font-semibold hover:underline">
                                Ver Todas &rarr;
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Testimonials Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">O que dizem nossos usuários</h2>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {testimonials.map((testimonial, index) => (
                             <div key={index} className="bg-slate-50 p-8 rounded-lg border border-slate-200">
                                <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
                                <div className="flex items-center">
                                    <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                                    <div>
                                        <p className="font-bold text-gray-800">{testimonial.name}</p>
                                        <p className="text-sm text-indigo-600">{testimonial.title}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="bg-slate-100 py-20 px-4">
                <div className="container mx-auto text-center max-w-3xl">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Pronto para Elevar sua Advocacia a um Novo Nível?</h2>
                    <p className="text-gray-600 mb-8">
                        Cadastre-se gratuitamente e descubra como a AdvocaciaAI pode ser sua maior aliada no dia a dia.
                    </p>
                    <a href="#/auth" onClick={(e) => { e.preventDefault(); navigate('#/auth'); }} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105">
                        Cadastre-se Gratuitamente
                    </a>
                </div>
            </section>
        </main>
    );
};
