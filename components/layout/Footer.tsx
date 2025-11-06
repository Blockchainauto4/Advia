import React from 'react';
// Fix: Remove .tsx extension from imports.
import { TwitterIcon, LinkedInIcon, SparklesIcon } from '../Icons';
import { useNavigation } from '../../App';

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => {
  const { navigate } = useNavigation();
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(href);
  };
  return (
    <li>
        <a href={href} onClick={handleClick} className="hover:text-indigo-400 transition-colors text-slate-300">
            {children}
        </a>
    </li>
  );
};

export const Footer: React.FC = () => {
    
    return (
        <footer className="bg-slate-900 text-slate-400">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Coluna 1: Logo e Social */}
                    <div className="md:col-span-2 lg:col-span-1">
                        <div className="flex items-center space-x-2 mb-4">
                            <SparklesIcon className="h-8 w-8 text-indigo-400" />
                            <span className="text-xl tracking-tight">
                                <span className="font-semibold text-white">Advocacia</span>
                                <span className="font-bold text-indigo-400">Ai</span>
                            </span>
                        </div>
                        <p className="text-sm max-w-xs">
                            Potencializando o direito com inteligência artificial para otimizar a rotina de advogados.
                        </p>
                        <div className="flex space-x-4 mt-6">
                            <a href="https://twitter.com/advocaciaai" aria-label="Twitter" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400"><TwitterIcon className="h-6 w-6" /></a>
                            <a href="https://linkedin.com/company/advocaciaai" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400"><LinkedInIcon className="h-6 w-6" /></a>
                        </div>
                    </div>

                    {/* Coluna 2: Ferramentas */}
                    <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Ferramentas</h3>
                        <ul className="space-y-3 text-sm">
                            <FooterLink href="#/chat">Chat IA</FooterLink>
                            <FooterLink href="#/documentos">Gerador de Documentos</FooterLink>
                            <FooterLink href="#/calculadoras">Calculadoras Jurídicas</FooterLink>
                            <FooterLink href="#/consultas">Consultas Públicas</FooterLink>
                            <FooterLink href="#/marketing">Marketing Jurídico IA</FooterLink>
                        </ul>
                    </div>

                    {/* Coluna 3: Empresa */}
                    <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Empresa</h3>
                        <ul className="space-y-3 text-sm">
                            <FooterLink href="#/quem-somos">Quem Somos</FooterLink>
                            <FooterLink href="#/blog">Blog</FooterLink>
                            <FooterLink href="#/contato">Contato</FooterLink>
                            <FooterLink href="#/planos">Planos</FooterLink>
                        </ul>
                    </div>
                    
                    {/* Coluna 4: Legal */}
                    <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Legal</h3>
                        <ul className="space-y-3 text-sm">
                            <FooterLink href="#/termos">Termos de Serviço</FooterLink>
                            <FooterLink href="#/privacidade">Política de Privacidade</FooterLink>
                            <FooterLink href="#/reembolso">Política de Reembolso</FooterLink>
                             <li className="mt-4">
                                <p className="text-sm text-slate-300"><strong>Contato:</strong></p>
                                <a href="tel:+5511932046970" className="text-sm hover:text-indigo-400">(11) 93204-6970</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-slate-800 pt-8">
                    <p className="text-xs text-slate-500 text-center mb-4 italic max-w-4xl mx-auto">
                        <strong>AVISO IMPORTANTE:</strong> As informações e ferramentas disponibilizadas neste site, incluindo respostas do chat de IA e documentos gerados, são para fins meramente informativos e educacionais. Elas não constituem aconselhamento jurídico, parecer, ou consulta de qualquer natureza. O uso das ferramentas não estabelece uma relação advogado-cliente. Para decisões importantes, consulte sempre um advogado qualificado e devidamente registrado na OAB.
                    </p>
                    <p className="text-sm text-slate-500 text-center">
                        &copy; {new Date().getFullYear()} advocaciaai.com.br. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
};
