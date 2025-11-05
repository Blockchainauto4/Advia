import React, { useState } from 'react';
import { SparklesIcon, ArrowLeftOnRectangleIcon, Bars3Icon, XMarkIcon } from '../Icons';
import type { User } from '../../types';
import { useNavigation } from '../../App';

interface HeaderProps {
    currentPage: string;
    user: User | null;
    onLogout: () => void;
}

const NavLink: React.FC<{ href: string; children: React.ReactNode; isActive: boolean; }> = ({ href, children, isActive }) => {
    const { navigate } = useNavigation();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigate(href);
    };

    return (
        <a
            href={href}
            onClick={handleClick}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                    ? 'bg-indigo-500 text-white'
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
            }`}
        >
            {children}
        </a>
    );
};


export const Header: React.FC<HeaderProps> = ({ currentPage, user, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { navigate } = useNavigation();
    
    const navItems = [
        { id: 'chat', label: 'Chat IA' },
        { id: 'documentos', label: 'Gerador de Documentos' },
        { id: 'calculadoras', label: 'Calculadoras' },
        { id: 'planos', label: user?.subscription ? 'Minha Assinatura' : 'Planos' },
        { id: 'quem-somos', label: 'Quem Somos' },
        { id: 'blog', label: 'Blog' },
    ];
    
    const isCurrentPage = (pageId: string) => {
        const pageName = currentPage.replace('#/', '').split('/')[0];
        return pageName === pageId;
    };
    
    const handleLinkClick = (href: string) => {
        navigate(href);
        if (isMenuOpen) {
            setIsMenuOpen(false);
        }
    };
    
    const handleLogoutClick = () => {
        onLogout(); // This now handles navigation via App.tsx
        if (isMenuOpen) {
            setIsMenuOpen(false);
        }
    };

    return (
        <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <a href="#/chat" className="flex-shrink-0 cursor-pointer" onClick={(e) => { e.preventDefault(); handleLinkClick('#/chat')}}>
                        <div className="flex items-center space-x-2">
                            <SparklesIcon className="h-8 w-8 text-indigo-400" />
                            <span className="text-xl tracking-tight">
                                <span className="font-semibold text-white">Advocacia</span>
                                <span className="font-bold text-indigo-400">Ai</span>
                            </span>
                        </div>
                    </a>
                    
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-4">
                        {navItems.map(item => (
                            <NavLink key={item.id} href={`#/${item.id}`} isActive={isCurrentPage(item.id)}>
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center border-l border-slate-700 ml-6 pl-6 space-x-4">
                         {user ? (
                            <>
                                <span className="text-sm text-slate-300">Olá, {user.name.split(' ')[0]}</span>
                                <button onClick={handleLogoutClick} className="flex items-center text-sm font-medium text-slate-300 hover:text-white transition-colors" title="Sair">
                                    <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                                </button>
                            </>
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
                         {navItems.map(item => (
                            <a
                                key={item.id}
                                href={`#/${item.id}`}
                                onClick={(e) => { e.preventDefault(); handleLinkClick(`#/${item.id}`); }}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${isCurrentPage(item.id) ? 'bg-indigo-500 text-white' : 'text-gray-300 hover:bg-slate-700'}`}
                            >
                                {item.label}
                            </a>
                        ))}
                        <div className="border-t border-slate-700 pt-4 mt-4 space-y-2">
                            {user ? (
                                <>
                                    <div className="px-3 text-slate-300">Olá, {user.name}</div>
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