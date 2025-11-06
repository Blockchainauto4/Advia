import React, { useState, useRef, useEffect } from 'react';
import { SparklesIcon, ArrowLeftOnRectangleIcon, Bars3Icon, XMarkIcon, ChevronDownIcon, UserCircleIcon } from '../Icons.tsx';
import type { User } from '../../types.ts';
import { useNavigation } from '../../App.tsx';

interface NavItem {
    id: string;
    label: string;
    href: string;
    children?: NavItem[];
}

const navConfig: NavItem[] = [
    { id: 'chat', label: 'Chat IA', href: '#/chat' },
    { id: 'documentos', label: 'Gerador de Documentos', href: '#/documentos' },
    {
        id: 'ferramentas', label: 'Ferramentas', href: '#', children: [
            { id: 'calculadoras', label: 'Calculadoras Jurídicas', href: '#/calculadoras' },
            { id: 'consultas', label: 'Consultas Públicas', href: '#/consultas' },
            { id: 'marketing', label: 'Marketing Jurídico IA', href: '#/marketing' },
            { id: 'conversor', label: 'Conversor de Arquivos', href: '#/conversor' },
            { id: 'seguranca', label: 'Câmera de Segurança', href: '#/seguranca' },
        ]
    },
    { id: 'planos', label: 'Planos', href: '#/planos' },
    { id: 'quem-somos', label: 'Quem Somos', href: '#/quem-somos' },
    { id: 'blog', label: 'Blog', href: '#/blog' },
    { id: 'contato', label: 'Contato', href: '#/contato' },
];

const NavLink: React.FC<{ item: NavItem; isActive: boolean; isMobile?: boolean; onClick: () => void; }> = ({ item, isActive, isMobile, onClick }) => {
    return (
        <a
            href={item.href}
            onClick={(e) => { e.preventDefault(); onClick(); }}
            className={`block px-3 py-2 rounded-md font-medium transition-colors ${
                isMobile 
                ? `text-base ${isActive ? 'bg-indigo-500 text-white' : 'text-gray-300 hover:bg-slate-700'}`
                : `text-sm ${isActive ? 'bg-indigo-500 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`
            }`}
        >
            {item.label}
        </a>
    );
};

export const Header: React.FC<{ currentPage: string; user: User | null; onLogout: () => void; }> = ({ currentPage, user, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);
    const { navigate } = useNavigation();
    const toolsMenuRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const isCurrentPage = (pageId: string) => {
        const pageName = currentPage.replace('#/', '').split('/')[0];
        return pageName === pageId;
    };
    
    const handleLinkClick = (href: string) => {
        navigate(href);
        setIsMenuOpen(false);
        setIsToolsMenuOpen(false);
        setIsUserMenuOpen(false);
        setIsMobileToolsOpen(false);
    };
    
    const handleLogoutClick = () => {
        onLogout();
        setIsMenuOpen(false);
        setIsUserMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target as Node)) {
                setIsToolsMenuOpen(false);
            }
             if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const getPlanLabel = () => 'Planos';

    return (
        <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <a href="#/home" className="flex-shrink-0 cursor-pointer" onClick={(e) => { e.preventDefault(); handleLinkClick('#/home')}}>
                        <div className="flex items-center space-x-2">
                            <SparklesIcon className="h-8 w-8 text-indigo-400" />
                            <span className="text-xl tracking-tight">
                                <span className="font-semibold text-white">Advocacia</span>
                                <span className="font-bold text-indigo-400">Ai</span>
                            </span>
                        </div>
                    </a>
                    
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-2">
                        {navConfig.map(item => (
                            item.children ? (
                                <div key={item.id} className="relative" ref={toolsMenuRef}>
                                    <button
                                        onMouseEnter={() => setIsToolsMenuOpen(true)}
                                        onClick={() => setIsToolsMenuOpen(!isToolsMenuOpen)}
                                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                            item.children.some(child => isCurrentPage(child.id)) ? 'bg-indigo-500 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                                        }`}
                                    >
                                        <span>{item.label}</span>
                                        <ChevronDownIcon className={`w-4 h-4 ml-1 transition-transform ${isToolsMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {isToolsMenuOpen && (
                                        <div onMouseLeave={() => setIsToolsMenuOpen(false)} className="absolute mt-2 w-64 bg-slate-800 rounded-md shadow-lg py-1 z-20">
                                            {item.children.map(child => (
                                                 <a key={child.id} href={child.href} onClick={(e) => { e.preventDefault(); handleLinkClick(child.href); }} 
                                                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700">
                                                     {child.label}
                                                 </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <NavLink key={item.id} item={{...item, label: item.id === 'planos' ? getPlanLabel() : item.label }} isActive={isCurrentPage(item.id)} onClick={() => handleLinkClick(item.href)} />
                            )
                        ))}
                    </nav>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center border-l border-slate-700 ml-6 pl-6 space-x-4">
                         {user ? (
                            <div className="relative" ref={userMenuRef}>
                                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center space-x-2 text-sm text-slate-300 hover:text-white transition-colors">
                                    {user.photoUrl ? (
                                        <img src={user.photoUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                                    ) : (
                                        <UserCircleIcon className="w-8 h-8 text-slate-400" />
                                    )}
                                    <span>Olá, {user.name.split(' ')[0]}</span>
                                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                </button>
                                 {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg py-1 z-20">
                                        <a href="#/dashboard" onClick={(e) => { e.preventDefault(); handleLinkClick('#/dashboard'); }} className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700">Meu Painel</a>
                                        <button onClick={handleLogoutClick} className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700">Sair</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <a href="#/auth" onClick={(e) => { e.preventDefault(); handleLinkClick('#/auth'); }} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Entrar</a>
                                <a href="#/auth" onClick={(e) => { e.preventDefault(); handleLinkClick('#/auth'); }} className="text-sm font-medium bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors">Cadastre-se</a>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Abrir menu">
                            {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-slate-800">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                         {navConfig.map(item => (
                            item.children ? (
                                <div key={item.id}>
                                    <button onClick={() => setIsMobileToolsOpen(!isMobileToolsOpen)} className="w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700">
                                        <span>{item.label}</span>
                                        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isMobileToolsOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {isMobileToolsOpen && (
                                        <div className="pl-4 mt-1 space-y-1">
                                            {item.children.map(child => (
                                                <NavLink key={child.id} item={child} isActive={isCurrentPage(child.id)} isMobile onClick={() => handleLinkClick(child.href)} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                 <NavLink key={item.id} item={{...item, label: item.id === 'planos' ? getPlanLabel() : item.label }} isActive={isCurrentPage(item.id)} isMobile onClick={() => handleLinkClick(item.href)} />
                            )
                        ))}
                        <div className="border-t border-slate-700 pt-4 mt-4 space-y-2">
                            {user ? (
                                <>
                                    <a href="#/dashboard" onClick={(e) => {e.preventDefault(); handleLinkClick('#/dashboard')}} className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700">
                                        {user.photoUrl ? (
                                            <img src={user.photoUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover mr-3" />
                                        ) : (
                                            <UserCircleIcon className="w-8 h-8 text-slate-400 mr-3" />
                                        )}
                                        <span>Painel de {user.name.split(' ')[0]}</span>
                                    </a>
                                    <button onClick={handleLogoutClick} className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700">
                                        <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" />
                                        Sair
                                    </button>
                                </>
                            ) : (
                                <>
                                    <a href="#/auth" onClick={(e) => { e.preventDefault(); handleLinkClick('#/auth'); }} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700">Entrar</a>
                                    <a href="#/auth" onClick={(e) => { e.preventDefault(); handleLinkClick('#/auth'); }} className="block px-3 py-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700">Cadastre-se</a>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};