import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { FormData } from './types';
import { generateDocumentContent } from './services/geminiService';
// import { initiatePayment } from './services/mercadoPagoService'; // Payment temporarily disabled
import { documentConfigs, DocumentConfig } from './documentConfigs';

// --- ICONS ---
const SparklesIcon: React.FC<{className: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.863 2.863l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.863 2.863l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.863-2.863l-2.846-.813a.75.75 0 010-1.442l2.846.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036a6.75 6.75 0 005.156 5.156l1.036.258a.75.75 0 010 1.456l-1.036.258a6.75 6.75 0 00-5.156 5.156l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a6.75 6.75 0 00-5.156-5.156l-1.036-.258a.75.75 0 010-1.456l1.036-.258a6.75 6.75 0 005.156-5.156l.258-1.036A.75.75 0 0118 1.5z" clipRule="evenodd" />
  </svg>
);
const ClipboardIcon: React.FC<{className: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M10.5 3A2.25 2.25 0 008.25 5.25v2.25a.75.75 0 001.5 0V5.25a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v2.25a.75.75 0 001.5 0V5.25A2.25 2.25 0 0013.5 3h-3z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M6 6.75A3.75 3.75 0 002.25 10.5v7.5A3.75 3.75 0 006 21.75h12A3.75 3.75 0 0021.75 18v-7.5A3.75 3.75 0 0018 6.75h-2.25a.75.75 0 000 1.5H18a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25-2.25H6a2.25 2.25 0 01-2.25-2.25v-7.5A2.25 2.25 0 016 8.25h2.25a.75.75 0 000-1.5H6z" clipRule="evenodd" />
  </svg>
);
const TrashIcon: React.FC<{className: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.006a.75.75 0 01-.749.658h-7.5a.75.75 0 01-.749-.658L5.168 6.648l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.9h1.368c1.603 0 2.816 1.336 2.816 2.9zM5.25 6.382l1.005 13.006A2.25 2.25 0 008.5 21.75h7.5a2.25 2.25 0 002.245-2.362L18.75 6.382a.75.75 0 00-.74-.682H6a.75.75 0 00-.75.682z" clipRule="evenodd" />
  </svg>
);
const ArrowDownTrayIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
    </svg>
);
const SaveIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M3 3.75A1.75 1.75 0 014.75 2h10.5l4 4v12.5A1.75 1.75 0 0117.25 22H4.75A1.75 1.75 0 013 20.25V3.75zM8 8.75a.75.75 0 01.75-.75h6.5a.75.75 0 010 1.5h-6.5a.75.75 0 01-.75-.75zm0 3a.75.75 0 01.75-.75h3.5a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75z" clipRule="evenodd" />
    </svg>
);
const SpeakerWaveIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.348 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
        <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
    </svg>
);
const StopIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
    </svg>
);
const MenuIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);
const XIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const TwitterIcon: React.FC<{className: string}> = ({className}) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.22-1.95-.55v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.94.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.5 20.33 8.79c0-.19 0-.38-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
    </svg>
);
const LinkedInIcon: React.FC<{className: string}> = ({className}) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);

// --- UI COMPONENTS ---
const SkeletonLoader = () => (
  <div className="animate-pulse space-y-5 p-2">
    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
    <div className="h-3 bg-slate-200 rounded w-3/4"></div>
    <div className="space-y-3 pt-4">
        <div className="h-3 bg-slate-200 rounded w-full"></div>
        <div className="h-3 bg-slate-200 rounded w-full"></div>
        <div className="h-3 bg-slate-200 rounded w-5/6"></div>
    </div>
    <div className="space-y-3 pt-4">
        <div className="h-3 bg-slate-200 rounded w-full"></div>
        <div className="h-3 bg-slate-200 rounded w-full"></div>
    </div>
  </div>
);

const EmptyStateMessage = () => (
  <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 p-4">
    <SparklesIcon className="w-16 h-16 mb-4 text-slate-300" />
    <h3 className="text-lg font-semibold text-slate-600">Seu documento aparecerá aqui</h3>
    <p className="text-sm">Preencha os campos à esquerda e clique em "Gerar" para criar seu documento com a ajuda da IA.</p>
  </div>
);

// --- PAGE COMPONENTS ---
const QuemSomosPage = () => (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 border-b pb-4">Sobre a AdvocaciaAI</h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
                <section>
                    <h3 className="text-2xl font-semibold text-indigo-700 mb-2">Nossa Missão</h3>
                    <p>Nossa missão é democratizar o acesso a documentos jurídicos de alta qualidade, capacitando advogados, estudantes e profissionais do direito com ferramentas de inteligência artificial de ponta. Acreditamos que a tecnologia pode otimizar o trabalho jurídico, permitindo que os profissionais se concentrem em estratégias e no atendimento ao cliente, em vez de tarefas repetitivas.</p>
                </section>
                <section>
                    <h3 className="text-2xl font-semibold text-indigo-700 mb-2">Nossa Visão</h3>
                    <p>Almejamos ser a principal plataforma de inteligência artificial para o setor jurídico no Brasil, reconhecida pela precisão, confiabilidade e inovação. Queremos transformar a maneira como os documentos legais são elaborados, tornando o processo mais rápido, eficiente e acessível para todos.</p>
                </section>
                <section>
                    <h3 className="text-2xl font-semibold text-indigo-700 mb-2">Nossos Valores</h3>
                    <ul className="list-disc list-inside space-y-2">
                        <li><strong>Excelência:</strong> Comprometemo-nos com a mais alta qualidade em nossos modelos de IA e na experiência do usuário.</li>
                        <li><strong>Inovação:</strong> Estamos em constante busca por novas tecnologias e métodos para aprimorar nossos serviços.</li>
                        <li><strong>Segurança:</strong> Priorizamos a segurança e a confidencialidade dos dados de nossos usuários.</li>
                        <li><strong>Acessibilidade:</strong> Trabalhamos para que nossas ferramentas sejam fáceis de usar e acessíveis a todos os profissionais do direito.</li>
                    </ul>
                </section>
            </div>
        </div>
    </main>
);

const BlogPage = () => (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nosso Blog</h2>
            <p className="text-gray-700 leading-relaxed">Em breve, compartilharemos artigos, notícias e dicas sobre a intersecção entre direito e tecnologia. Fique atento às novidades e insights que podem transformar sua prática jurídica.</p>
            <SparklesIcon className="w-16 h-16 mx-auto text-indigo-500 mt-6" />
        </div>
    </main>
);

const ContatoPage = () => (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Entre em Contato</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <form className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
                        <input type="text" id="name" name="name" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Seu nome completo" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email" name="email" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="seu@email.com" />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensagem</label>
                        <textarea id="message" name="message" rows={4} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Sua mensagem..."></textarea>
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Enviar Mensagem
                    </button>
                </form>
                <div className="text-gray-700">
                    <h3 className="text-xl font-semibold text-indigo-700 mb-3">Informações de Contato</h3>
                    <p className="mb-2"><strong>Email:</strong> contato@advocaciaai.com.br</p>
                    <p className="mb-2"><strong>Telefone:</strong> (XX) XXXX-XXXX</p>
                    <p>Estamos disponíveis para responder suas perguntas e ouvir suas sugestões. Sua opinião é muito importante para nós!</p>
                </div>
            </div>
        </div>
    </main>
);

const NavLink: React.FC<{
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
    isMobile?: boolean;
}> = ({ onClick, isActive, children, isMobile }) => (
    <button
        onClick={onClick}
        className={`transition-colors duration-300 ${isMobile ? 'block text-left w-full px-4 py-2 text-lg' : 'px-3 py-2 rounded-md text-sm font-medium'} ${isActive ? 'bg-slate-700 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}
    >
        {children}
    </button>
);


const Header: React.FC<{ setPage: (page: string) => void; currentPage: string }> = ({ setPage, currentPage }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleNavClick = (page: string) => {
        setPage(page);
        setIsMenuOpen(false);
    };

    return (
        <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <button onClick={() => handleNavClick('home')} className="flex items-center space-x-2">
                            <SparklesIcon className="h-8 w-8 text-indigo-400" />
                            <span className="text-xl font-bold tracking-tight">advocaciaai.com.br</span>
                        </button>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <NavLink onClick={() => handleNavClick('home')} isActive={currentPage === 'home'}>Gerador IA</NavLink>
                            <NavLink onClick={() => handleNavClick('quem-somos')} isActive={currentPage === 'quem-somos'}>Quem Somos</NavLink>
                            <NavLink onClick={() => handleNavClick('blog')} isActive={currentPage === 'blog'}>Blog</NavLink>
                            <NavLink onClick={() => handleNavClick('contato')} isActive={currentPage === 'contato'}>Contato</NavLink>
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white"
                        >
                            <span className="sr-only">Abrir menu</span>
                            {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <NavLink onClick={() => handleNavClick('home')} isActive={currentPage === 'home'} isMobile>Gerador IA</NavLink>
                        <NavLink onClick={() => handleNavClick('quem-somos')} isActive={currentPage === 'quem-somos'} isMobile>Quem Somos</NavLink>
                        <NavLink onClick={() => handleNavClick('blog')} isActive={currentPage === 'blog'} isMobile>Blog</NavLink>
                        <NavLink onClick={() => handleNavClick('contato')} isActive={currentPage === 'contato'} isMobile>Contato</NavLink>
                    </div>
                </div>
            )}
        </header>
    );
};


const Footer = ({ setPage }: { setPage: (page: string) => void }) => {
    const handlePlaceholderClick = (linkName: string) => {
        alert(`${linkName} - Página ou link em construção.`);
    };
    
    return (
        <footer className="bg-slate-800 text-gray-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">advocaciaai.com.br</h3>
                        <p className="text-sm">Potencializando o direito com inteligência artificial.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Navegação</h3>
                        <ul className="space-y-2 text-sm">
                            <li><button onClick={() => setPage('home')} className="hover:text-indigo-400 transition-colors">Gerador IA</button></li>
                            <li><button onClick={() => setPage('quem-somos')} className="hover:text-indigo-400 transition-colors">Quem Somos</button></li>
                            <li><button onClick={() => setPage('blog')} className="hover:text-indigo-400 transition-colors">Blog</button></li>
                            <li><button onClick={() => setPage('contato')} className="hover:text-indigo-400 transition-colors">Contato</button></li>
                        </ul>
                    </div>
                    <div>
                         <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm">
                            <li><button onClick={() => handlePlaceholderClick('Termos de Serviço')} className="hover:text-indigo-400 transition-colors text-left">Termos de Serviço</button></li>
                            <li><button onClick={() => handlePlaceholderClick('Política de Privacidade')} className="hover:text-indigo-400 transition-colors text-left">Política de Privacidade</button></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Siga-nos</h3>
                        <div className="flex space-x-4">
                            <button onClick={() => handlePlaceholderClick('Twitter')} aria-label="Twitter" className="text-gray-400 hover:text-indigo-400"><TwitterIcon className="h-6 w-6" /></button>
                            <button onClick={() => handlePlaceholderClick('LinkedIn')} aria-label="LinkedIn" className="text-gray-400 hover:text-indigo-400"><LinkedInIcon className="h-6 w-6" /></button>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} advocaciaai.com.br. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

// --- MAIN APP COMPONENT ---

interface InputFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, id, value, onChange, placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-800 mb-1">{label}</label>
    <input
      type="text"
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
      required
    />
  </div>
);

export default function App() {
  const [page, setPage] = useState('home');
  const [docType, setDocType] = useState<string>(documentConfigs[1].value);
  const [prompt, setPrompt] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialState, setIsInitialState] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const currentConfig = useMemo(() => {
    return documentConfigs.find(d => d.value === docType) || documentConfigs[0];
  }, [docType]);

  const getInitialFormData = useCallback((config: DocumentConfig) => {
    const initialData: FormData = {};
    config.fields.forEach(field => {
        initialData[field.id] = '';
    });
    return initialData;
  }, []);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('legalDocumentData');
      if (savedData) {
        const { savedDocType, savedFormData, savedPrompt } = JSON.parse(savedData);
        const config = documentConfigs.find(d => d.value === savedDocType);
        if (config && savedPrompt) { // Only load if there is saved data
          setDocType(savedDocType);
          const initialData = getInitialFormData(config);
          const loadedData = { ...initialData, ...(savedFormData || {}) };
          setFormData(loadedData);
          setPrompt(savedPrompt || '');
          setIsInitialState(false);
        } else {
           setFormData(getInitialFormData(currentConfig));
        }
      } else {
        setFormData(getInitialFormData(currentConfig));
      }
    } catch (err) {
      console.error("Failed to load data from localStorage", err);
      localStorage.removeItem('legalDocumentData');
      setFormData(getInitialFormData(currentConfig));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      const dataToSave = {
        savedDocType: docType,
        savedFormData: formData,
        savedPrompt: prompt,
      };
      localStorage.setItem('legalDocumentData', JSON.stringify(dataToSave));
    } catch (err) {
      console.error("Failed to save data to localStorage", err);
    }
  }, [formData, prompt, docType]);
  
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [docType, page]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const handleDocTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDocType = e.target.value;
    const newConfig = documentConfigs.find(d => d.value === newDocType) || documentConfigs[0];
    setDocType(newDocType);
    setPrompt('');
    setFormData(getInitialFormData(newConfig));
    setError(null);
    setIsInitialState(true);
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError(`Por favor, preencha a descrição para gerar o documento.`);
      return;
    }
    if (!currentConfig || !currentConfig.systemInstruction) {
      setError("Tipo de documento inválido ou não selecionado.");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await generateDocumentContent(prompt, currentConfig.systemInstruction, currentConfig.responseSchema);
      setFormData(prev => ({
        ...prev,
        ...result,
      }));
      setIsInitialState(false);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  };

  const formattedDocumentText = useMemo(() => {
    return currentConfig.formatOutput(formData);
  }, [formData, currentConfig]);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedDocumentText).then(() => {
      setCopySuccess('Copiado para a área de transferência!');
      setTimeout(() => setCopySuccess(''), 2000);
    }, () => {
      setCopySuccess('Falha ao copiar.');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  const handleClear = () => {
    setFormData(getInitialFormData(currentConfig));
    setPrompt('');
    setError(null);
    localStorage.removeItem('legalDocumentData');
    setIsInitialState(true);
     if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSaveDraft = () => {
    try {
      const dataToSave = {
        savedDocType: docType,
        savedFormData: formData,
        savedPrompt: prompt,
      };
      localStorage.setItem('legalDocumentData', JSON.stringify(dataToSave));
      setSaveSuccess('Rascunho salvo!');
      setTimeout(() => setSaveSuccess(''), 2000);
    } catch (err) {
      console.error("Failed to save draft to localStorage", err);
      setSaveSuccess('Falha ao salvar.');
      setTimeout(() => setSaveSuccess(''), 2000);
    }
  };

  const handleExportPDF = () => {
    const { jsPDF } = (window as any).jspdf;
    if (!jsPDF) {
      setError("Não foi possível carregar a biblioteca PDF. Tente recarregar a página.");
      return;
    }
    try {
      const doc = new jsPDF();
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(11);
      const margin = 15;
      const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
      const lines = doc.splitTextToSize(formattedDocumentText, maxWidth);
      doc.text(lines, margin, margin);
      doc.save(`${docType || 'documento'}.pdf`);
    } catch (err) {
      setError("Ocorreu um erro ao gerar o PDF.");
      console.error("PDF generation error:", err);
    }
  };
  
  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
        setError("Seu navegador não suporta a leitura de texto.");
        return;
    }
    if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    } else {
        const utterance = new SpeechSynthesisUtterance(formattedDocumentText);
        utterance.lang = 'pt-BR';
        utterance.onend = () => {
            setIsSpeaking(false);
        };
        utterance.onerror = (event) => {
            setIsSpeaking(false);
            console.error("Speech synthesis error:", event.error);
            setError("Ocorreu um erro ao tentar ler o texto.");
        };
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
    }
  };

  const renderPage = () => {
    switch(page) {
      case 'quem-somos':
        return <QuemSomosPage />;
      case 'blog':
        return <BlogPage />;
      case 'contato':
        return <ContatoPage />;
      case 'home':
      default:
        return (
           <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Dados do Documento</h2>
                
                <div>
                  <label htmlFor="doc-type-select" className="block text-sm font-medium text-gray-800 mb-1">
                    Tipo de Documento
                  </label>
                  <select
                    id="doc-type-select"
                    value={docType}
                    onChange={handleDocTypeChange}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                  >
                    {documentConfigs.map((doc) => (
                      <option key={doc.value} value={doc.value}>
                        {doc.label}
                      </option>
                    ))}
                  </select>
                </div>

                {docType && (
                  <>
                    <div>
                      <label htmlFor="prompt" className="block text-sm font-medium text-gray-800 mb-1">
                        {currentConfig.promptLabel} <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="prompt"
                        name="prompt"
                        rows={6}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={currentConfig.promptPlaceholder}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {currentConfig.fields.map(field => (
                        <InputField 
                          key={field.id}
                          label={field.label} 
                          id={field.id} 
                          value={formData[field.id] || ''} 
                          onChange={handleInputChange} 
                          placeholder={field.placeholder} 
                        />
                      ))}
                    </div>

                    <button
                      onClick={handleGenerate}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processando...
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="w-5 h-5 mr-2" />
                          Gerar {currentConfig.label}
                        </>
                      )}
                    </button>
                    {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
                  </>
                )}
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg flex flex-col h-full min-h-[600px]">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-3 mb-4 gap-4">
                  <h2 className="text-xl font-semibold text-gray-800">Resultado</h2>
                  <div className="flex flex-wrap justify-end gap-2">
                    <button 
                        onClick={handleSpeak}
                        className={`flex items-center justify-center text-sm font-medium py-2 px-3 rounded-md transition duration-150 ${isSpeaking ? 'bg-red-200 hover:bg-red-300 text-red-800' : 'bg-violet-100 hover:bg-violet-200 text-violet-700'}`}
                        disabled={!formattedDocumentText.trim() || isLoading || isInitialState}
                        aria-label={isSpeaking ? "Parar leitura" : "Ouvir texto"}
                    >
                        {isSpeaking ? (
                            <>
                                <StopIcon className="w-4 h-4 mr-0 sm:mr-2" /><span className="hidden sm:inline">Parar</span>
                            </>
                        ) : (
                            <>
                                <SpeakerWaveIcon className="w-4 h-4 mr-0 sm:mr-2" /><span className="hidden sm:inline">Ouvir</span>
                            </>
                        )}
                    </button>
                    <button onClick={handleSaveDraft} disabled={isInitialState || isLoading} className="flex items-center justify-center text-sm bg-green-100 hover:bg-green-200 text-green-700 font-medium py-2 px-3 rounded-md transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Salvar rascunho">
                        <SaveIcon className="w-4 h-4 mr-0 sm:mr-2"/><span className="hidden sm:inline">Salvar</span>
                    </button>
                    <button onClick={handleExportPDF} disabled={isInitialState || isLoading} className="flex items-center justify-center text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-3 rounded-md transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Exportar para PDF">
                        <ArrowDownTrayIcon className="w-4 h-4 mr-0 sm:mr-2"/><span className="hidden sm:inline">PDF</span>
                    </button>
                    <button onClick={handleCopy} disabled={isInitialState || isLoading} className="flex items-center justify-center text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-3 rounded-md transition duration-150 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Copiar texto">
                      <ClipboardIcon className="w-4 h-4 mr-0 sm:mr-2"/><span className="hidden sm:inline">Copiar</span>
                    </button>
                     <button onClick={handleClear} disabled={isLoading} className="flex items-center justify-center text-sm bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-3 rounded-md transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Limpar formulário">
                      <TrashIcon className="w-4 h-4 mr-0 sm:mr-2"/><span className="hidden sm:inline">Limpar</span>
                    </button>
                  </div>
                </div>
                 <div className="relative flex-grow">
                    {(copySuccess || saveSuccess) && (
                      <div className="absolute top-0 right-0 text-sm text-green-600 bg-green-100 px-3 py-1 rounded-md transition-opacity duration-300 z-10">
                        {copySuccess || saveSuccess}
                      </div>
                    )}
                    <div className="bg-slate-50 p-4 rounded-md flex-grow overflow-y-auto border border-gray-200 h-full absolute inset-0">
                      {isLoading ? (
                          <SkeletonLoader />
                      ) : isInitialState ? (
                          <EmptyStateMessage />
                      ) : (
                          <pre className="whitespace-pre-wrap text-xs sm:text-sm font-sans text-gray-800">{formattedDocumentText}</pre>
                      )}
                    </div>
                 </div>
              </div>
            </div>
          </main>
        );
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
        <Header setPage={setPage} currentPage={page} />
        {renderPage()}
        <Footer setPage={setPage} />
    </div>
  );
}