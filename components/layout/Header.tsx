// components/layout/Header.tsx
import React, { useState } from 'react';
// Fix: Remove .ts extension from imports.
import type { User } from '../../types';
import { useNavigation } from '../../App';
import { SparklesIcon, Bars3Icon, XMarkIcon } from '../Icons';

interface HeaderProps {
    user: User | null;
    onLogout: () => void;
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isMobile?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { navigate } = useNavigation();

    const NavLink: React.FC<NavLinkProps> = ({ href, children, isMobile = false }) => {
        const handleClick = (e: React.MouseEvent) => {
            e.preventDefault();
            setIsMobileMenuOpen(false);
            navigate(href);
        };
        const mobileClass = "block py-2 px-3 text-base font-medium rounded-md";
        const desktopClass = "text-sm font-semibold leading-6";
        const baseClass = "transition-colors";
        const activeClass = "bg-indigo-700 text-white";
        const inactiveClass = isMobile ? "text-gray-300 hover:bg-gray-700 hover:text-white" : "text-slate-200 hover:text-white";
        
        // A simple way to check for active link
        const isActive = window.location.hash === href;

        return (
            <a href={href} onClick={handleClick} className={`${baseClass} ${isMobile ? mobileClass : desktopClass} ${isActive ? activeClass : inactiveClass}`}>
                {children}
            </a>
        );
    };

    return (
        <header className="bg-slate-900 sticky top-0 z-30">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <a href="#/home" onClick={(e) => { e.preventDefault(); navigate('#/home'); }} className="flex-shrink-0 flex items-center space-x-2">
                            <SparklesIcon className="h-8 w-8 text-indigo-400" />
                            <span className="text-xl tracking-tight">
                                <span className="font-semibold text-white">Advocacia</span>
                                <span className="font-bold text-indigo-400">Ai</span>
                            </span>
                        </a>
                        <div className="hidden md:ml-10 md:flex md:items-baseline md:space-x-4">
                            <NavLink href="#/chat">Chat IA</NavLink>
                            <NavLink href="#/documentos">Documentos</NavLink>
                            <NavLink href="#/calculadoras">Calculadoras</NavLink>
                             <NavLink href="#/marketing">Marketing</NavLink>
                            <NavLink href="#/planos">Planos</NavLink>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        {user ? (
                            <div className="ml-4 flex items-center md:ml-6 space-x-4">
                               <NavLink href="#/dashboard">Painel</NavLink>
                                <button onClick={onLogout} className="text-sm font-semibold text-slate-200 hover:text-white">Sair</button>
                            </div>
                        ) : (
                            <div className="space-x-4">
                                <NavLink href="#/auth">Entrar</NavLink>
                                <a href="#/auth" onClick={(e) => { e.preventDefault(); navigate('#/auth'); }} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md text-sm">
                                    Cadastre-se Grátis
                                </a>
                            </div>
                        )}
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                            <span className="sr-only">Abrir menu</span>
                            {isMobileMenuOpen ? <XMarkIcon className="block h-6 w-6" /> : <Bars3Icon className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {isMobileMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <NavLink href="#/chat" isMobile>Chat IA</NavLink>
                        <NavLink href="#/documentos" isMobile>Documentos</NavLink>
                        <NavLink href="#/calculadoras" isMobile>Calculadoras</NavLink>
                        <NavLink href="#/marketing" isMobile>Marketing</NavLink>
                        <NavLink href="#/planos" isMobile>Planos</NavLink>
                    </div>
                    <div className="pt-4 pb-3 border-t border-gray-700">
                        {user ? (
                            <div className="px-2 space-y-1">
                                <NavLink href="#/dashboard" isMobile>Painel</NavLink>
                                <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); setIsMobileMenuOpen(false); }} className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">Sair</a>
                            </div>
                        ) : (
                             <div className="px-2 space-y-1">
                                <NavLink href="#/auth" isMobile>Entrar / Cadastrar</NavLink>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};
