
// components/layout/Header.tsx
import React, { useState, useCallback } from 'react';
// Fix: Remove .ts extension from imports.
import type { User } from '../../types';
import { useNavigation } from '../../AppContext';
import { SparklesIcon, Bars3Icon, XMarkIcon } from '../Icons';

interface HeaderProps {
    user: User | null;
    onLogout: () => void;
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isMobile?: boolean;
  navigate: (path: string) => void;
  closeMenu: () => void;
  currentHash: string;
}

// Optimized NavLink component with React.memo to prevent unnecessary re-renders
const NavLink: React.FC<NavLinkProps> = React.memo(({ href, children, isMobile = false, navigate, closeMenu, currentHash }) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        closeMenu();
        navigate(href);
    };
    const mobileClass = "block py-2 px-3 text-base font-medium rounded-md";
    const desktopClass = "text-sm font-semibold leading-6";
    const baseClass = "transition-colors";
    const activeClass = "bg-indigo-700 text-white";
    const inactiveClass = isMobile ? "text-gray-300 hover:bg-gray-700 hover:text-white" : "text-slate-200 hover:text-white";
    
    // Robust check for hash in case window.location access is restricted
    let isActive = false;
    try {
         isActive = currentHash === href;
    } catch (e) {
        // Fallback if currentHash passed down is problematic, though it should be safe as a prop
    }

    return (
        <a href={href} onClick={handleClick} className={`${baseClass} ${isMobile ? mobileClass : desktopClass} ${isActive ? activeClass : inactiveClass}`}>
            {children}
        </a>
    );
});

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { navigate } = useNavigation();
    
    // Safely get current hash for active state
    let currentHash = '#/home';
    try {
        currentHash = window.location.hash;
    } catch (e) {
        // Fallback
    }

    const closeMenu = useCallback(() => setIsMobileMenuOpen(false), []);

    const renderNavLink = (href: string, children: React.ReactNode, isMobile = false) => (
        <NavLink 
            href={href} 
            isMobile={isMobile} 
            navigate={navigate} 
            closeMenu={closeMenu}
            currentHash={currentHash}
        >
            {children}
        </NavLink>
    );

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
                            {renderNavLink("#/chat", "Chat IA")}
                            {renderNavLink("#/documentos", "Documentos")}
                            {renderNavLink("#/calculadoras", "Calculadoras")}
                            {renderNavLink("#/prospeccao", "Prospecção")}
                            {renderNavLink("#/marketing", "Marketing")}
                            {renderNavLink("#/planos", "Planos")}
                        </div>
                    </div>
                    <div className="hidden md:block">
                        {user ? (
                            <div className="ml-4 flex items-center md:ml-6 space-x-4">
                               {renderNavLink("#/dashboard", "Painel")}
                               <button onClick={onLogout} className="text-sm font-semibold text-slate-200 hover:text-white transition-colors">Sair</button>
                            </div>
                        ) : (
                            <div className="space-x-4 flex items-center">
                                {renderNavLink("#/auth", "Entrar")}
                                <a href="#/auth" onClick={(e) => { e.preventDefault(); navigate('#/auth'); }} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md text-sm transition-transform hover:scale-105">
                                    Cadastre-se Grátis
                                </a>
                            </div>
                        )}
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-label="Menu principal">
                            {isMobileMenuOpen ? <XMarkIcon className="block h-6 w-6" /> : <Bars3Icon className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu with smooth transition */}
            <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-800">
                    {renderNavLink("#/chat", "Chat IA", true)}
                    {renderNavLink("#/documentos", "Documentos", true)}
                    {renderNavLink("#/calculadoras", "Calculadoras", true)}
                    {renderNavLink("#/prospeccao", "Prospecção", true)}
                    {renderNavLink("#/marketing", "Marketing", true)}
                    {renderNavLink("#/planos", "Planos", true)}
                </div>
                <div className="pt-4 pb-3 border-t border-slate-700 bg-slate-800">
                    {user ? (
                        <div className="px-2 space-y-1">
                            {renderNavLink("#/dashboard", "Painel", true)}
                            <button onClick={() => { onLogout(); closeMenu(); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">Sair</button>
                        </div>
                    ) : (
                         <div className="px-2 space-y-1">
                            {renderNavLink("#/auth", "Entrar / Cadastrar", true)}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
