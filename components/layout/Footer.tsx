import React from 'react';
import { TwitterIcon, LinkedInIcon } from '../Icons';
import { useNavigation } from '../../App';

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => {
  const { navigate } = useNavigation();
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(href);
  };
  return (
    <a href={href} onClick={handleClick} className="hover:text-indigo-400 transition-colors text-left">{children}</a>
  );
};

export const Footer: React.FC = () => {
    
    return (
        <footer className="bg-slate-800 text-gray-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">advocaciaai.com.br</h3>
                        <p className="text-sm">Potencializando o direito com inteligência artificial.</p>
                        <p className="text-sm mt-2"><strong>Contato:</strong> (11) 93204-6970</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Navegação</h3>
                        <ul className="space-y-2 text-sm">
                            <li><FooterLink href="#/chat">Chat IA</FooterLink></li>
                            <li><FooterLink href="#/quem-somos">Quem Somos</FooterLink></li>
                            <li><FooterLink href="#/contato">Contato</FooterLink></li>
                            <li><FooterLink href="#/blog">Blog</FooterLink></li>
                        </ul>
                    </div>
                    <div>
                         <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm">
                            <li><FooterLink href="#/termos">Termos de Serviço</FooterLink></li>
                            <li><FooterLink href="#/privacidade">Política de Privacidade</FooterLink></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Siga-nos</h3>
                        <div className="flex space-x-4">
                            <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-indigo-400"><TwitterIcon className="h-6 w-6" /></a>
                            <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-indigo-400"><LinkedInIcon className="h-6 w-6" /></a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-700 pt-6 text-center text-xs text-slate-400">
                    <p className="mb-2 italic"><strong>AVISO IMPORTANTE:</strong> As informações e ferramentas disponibilizadas neste site, incluindo respostas do chat de IA e documentos gerados, são para fins meramente informativos e educacionais. Elas não constituem aconselhamento jurídico, parecer, ou consulta de qualquer natureza. O uso das ferramentas não estabelece uma relação advogado-cliente. Para decisões importantes, consulte sempre um advogado qualificado e devidamente registrado na OAB.</p>
                    <p>&copy; {new Date().getFullYear()} advocaciaai.com.br. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
};