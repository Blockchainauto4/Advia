import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';

import { Header } from './components/layout/Header.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { ChatPage } from './pages/ChatPage.tsx';
import { DocumentGeneratorController } from './pages/DocumentGeneratorController.tsx';
import { CalculadorasHubPage } from './pages/CalculadorasHubPage.tsx';
import { CalculatorCategoryPage } from './pages/CalculatorCategoryPage.tsx';
import { ConsultasPage } from './pages/ConsultasPage.tsx';
import { MarketingPage } from './pages/MarketingPage.tsx';
import { ConversorPage } from './pages/ConversorPage.tsx';
import { SafetyCameraPage } from './pages/SafetyCameraPage.tsx';
import { PlanosPage } from './pages/PlanosPage.tsx';
import { AuthPage } from './pages/AuthPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { QuemSomosPage } from './pages/QuemSomosPage.tsx';
import { BlogPage } from './pages/BlogPage.tsx';
import { BlogPostPage } from './pages/BlogPostPage.tsx'; // Import the new component
import { ContatoPage } from './pages/ContatoPage.tsx';
import { TermosPage } from './pages/TermosPage.tsx';
import { PrivacidadePage } from './pages/PrivacidadePage.tsx';
import { PoliticaReembolsoPage } from './pages/PoliticaReembolsoPage.tsx';

import { Toast } from './components/Toast.tsx';
import { WhatsAppWidget } from './components/WhatsAppWidget.tsx';

import { authService } from './services/authService.ts';
import type { User } from './types.ts';

// --- CONTEXTS ---

type ToastInfo = { type: 'success' | 'error' | 'info'; message: string } | null;
type NavigationContextType = { navigate: (path: string) => void };

const NavigationContext = createContext<NavigationContextType | null>(null);
const ToastContext = createContext<((toast: ToastInfo) => void) | null>(null);

export const useNavigation = () => useContext(NavigationContext)!;
export const useToast = () => useContext(ToastContext)!;

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(authService.getCurrentUser());
    const [currentPage, setCurrentPage] = useState('#/home');
    const [toast, setToast] = useState<ToastInfo>(null);

    const navigate = useCallback((path: string) => {
        window.scrollTo(0, 0); // Scroll to top on every navigation.
        setCurrentPage(path);
    }, []);

    const handleLoginSuccess = (loggedInUser: User) => {
        setUser(loggedInUser);
        setToast({ type: 'success', message: `Bem-vindo(a), ${loggedInUser.name.split(' ')[0]}!` });
        navigate('#/chat');
    };
    
    const handleUserUpdate = (updatedUser: User) => {
        setUser(updatedUser);
    };

    const handleLogout = () => {
        authService.logout();
        setUser(null);
        setToast({ type: 'info', message: 'Você saiu da sua conta.' });
        navigate('#/home');
    };

    const renderPage = () => {
        const [page, subpage] = currentPage.replace('#/', '').split('/');
        
        switch (page) {
            case 'chat': return <ChatPage key={user ? user.email : 'guest'} />;
            case 'documentos': return <DocumentGeneratorController user={user} />;
            case 'calculadoras':
                return subpage ? <CalculatorCategoryPage categoryId={subpage} user={user} /> : <CalculadorasHubPage />;
            case 'consultas': return <ConsultasPage user={user} />;
            case 'marketing': return <MarketingPage user={user} />;
            case 'conversor': return <ConversorPage user={user} />;
            case 'seguranca': return <SafetyCameraPage user={user} />;
            case 'planos': return <PlanosPage user={user} />;
            case 'auth': return <AuthPage onLoginSuccess={handleLoginSuccess} />;
            case 'dashboard': return user ? <DashboardPage user={user} onUserUpdate={handleUserUpdate} onLogout={handleLogout} /> : <HomePage />;
            case 'quem-somos': return <QuemSomosPage />;
            case 'blog':
                return subpage ? <BlogPostPage slug={subpage} /> : <BlogPage />; // Updated blog routing
            case 'contato': return <ContatoPage />;
            case 'termos': return <TermosPage />;
            case 'privacidade': return <PrivacidadePage />;
            case 'reembolso': return <PoliticaReembolsoPage />;
            case 'home':
            default:
                return <HomePage />;
        }
    };

    return (
        <NavigationContext.Provider value={{ navigate }}>
            <ToastContext.Provider value={setToast}>
                <div className="flex flex-col min-h-screen bg-slate-50">
                    <Header currentPage={currentPage} user={user} onLogout={handleLogout} />
                    {renderPage()}
                    <Footer />
                    {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
                    <WhatsAppWidget />
                </div>
            </ToastContext.Provider>
        </NavigationContext.Provider>
    );
};

export default App;