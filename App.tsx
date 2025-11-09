// App.tsx
// Fix: Remove .tsx extension from imports.
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/Toast';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { HomePage } from './pages/HomePage';
import { ChatPage } from './pages/ChatPage';
import { DocumentGeneratorController } from './pages/DocumentGeneratorController';
import { CalculadorasHubPage } from './pages/CalculadorasHubPage';
import { CalculatorCategoryPage } from './pages/CalculatorCategoryPage';
import { ConsultasPage } from './pages/ConsultasPage';
import { MarketingPage } from './pages/MarketingPage';
import { ConversorPage } from './pages/ConversorPage';
import { SafetyCameraPage } from './pages/SafetyCameraPage';
import { PlanosPage } from './pages/PlanosPage';
import { AuthPage } from './pages/AuthPage';
import { QuemSomosPage } from './pages/QuemSomosPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { ContatoPage } from './pages/ContatoPage';
import { TermosPage } from './pages/TermosPage';
import { PrivacidadePage } from './pages/PrivacidadePage';
import { PoliticaReembolsoPage } from './pages/PoliticaReembolsoPage';
import { DashboardPage } from './pages/DashboardPage';
import { LeadProspectorPage } from './pages/LeadProspectorPage';
import { ContractConsultantPage } from './pages/ContractConsultantPage';
import { DecimoTerceiroPage } from './pages/DecimoTerceiroPage';
import { authService } from './services/authService';
import type { User, ToastMessage } from './types';
import { NavigationContext, ToastContext } from './AppContext';


const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    // Initialize currentPath safely
    const getInitialPath = () => {
        try {
            return window.location.hash || '#/home';
        } catch (e) {
            return '#/home';
        }
    };
    const [currentPath, setCurrentPath] = useState(getInitialPath());

    useEffect(() => {
        const loggedInUser = authService.getCurrentUser();
        if (loggedInUser) {
            setUser(loggedInUser);
        }

        const handleHashChange = () => {
            try {
                setCurrentPath(window.location.hash || '#/home');
            } catch (e) {
                // Fallback if location.hash access fails
            }
            window.scrollTo(0, 0);
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
    
    const navigate = useCallback((path: string) => {
        // Optimistically update internal state first to ensure navigation happens
        // even if writing to location.hash is blocked by the environment.
        setCurrentPath(path);
        try {
            window.location.hash = path;
        } catch (e) {
            console.warn("Navigation hash update blocked by environment. Relying on internal state.", e);
        }
    }, []);

    const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
        const newToast = { ...toast, id: Date.now() };
        setToasts(prev => [...prev, newToast]);
    }, []);

    const handleLoginSuccess = (loggedInUser: User) => {
        setUser(loggedInUser);
        navigate('#/dashboard');
        showToast({ type: 'success', message: `Bem-vindo(a), ${loggedInUser.name}!` });
    };

    const handleLogout = () => {
        authService.logout();
        setUser(null);
        navigate('#/home');
        showToast({ type: 'info', message: 'Você foi desconectado.' });
    };

    const handleUserUpdate = (updatedUser: User) => {
        setUser(updatedUser);
    };

    const renderPage = () => {
        // Robustly handle potential errors if currentPath is somehow malformed
        const safePath = currentPath || '#/home';
        const pathParts = safePath.substring(2).split('/');
        const page = pathParts[0] || 'home';
        const param = pathParts[1];

        switch (page) {
            case '':
            case 'home':
                return <HomePage />;
            case 'chat':
                return <ChatPage />;
            case 'documentos':
                return <DocumentGeneratorController user={user} />;
            case 'calculadoras':
                 return param ? <CalculatorCategoryPage categoryId={param} user={user} /> : <CalculadorasHubPage />;
            case 'decimo-terceiro':
                 return <DecimoTerceiroPage />;
            case 'consultas':
                return <ConsultasPage user={user} />;
            case 'marketing':
                return <MarketingPage user={user} />;
            case 'conversor':
                 return <ConversorPage user={user} />;
            case 'seguranca':
                return <SafetyCameraPage user={user} />;
            case 'prospeccao':
                return <LeadProspectorPage user={user} />;
            case 'contratos':
                return <ContractConsultantPage user={user} />;
            case 'planos':
                return <PlanosPage user={user} />;
            case 'auth':
                return <AuthPage onLoginSuccess={handleLoginSuccess} />;
            case 'dashboard':
                return user ? <DashboardPage user={user} onUserUpdate={handleUserUpdate} onLogout={handleLogout} /> : <AuthPage onLoginSuccess={handleLoginSuccess} />;
            case 'quem-somos':
                return <QuemSomosPage />;
            case 'blog':
                return param ? <BlogPostPage slug={param} /> : <BlogPage />;
            case 'contato':
                return <ContatoPage />;
            case 'termos':
                return <TermosPage />;
            case 'privacidade':
                return <PrivacidadePage />;
            case 'reembolso':
                return <PoliticaReembolsoPage />;
            default:
                return <HomePage />;
        }
    };

    return (
        <NavigationContext.Provider value={{ navigate }}>
            <ToastContext.Provider value={showToast}>
                <div className="flex flex-col min-h-screen bg-slate-100 font-sans">
                    <Header user={user} onLogout={handleLogout} />
                    {renderPage()}
                    <Footer />
                    <WhatsAppWidget />
                    <div className="fixed top-0 right-0 p-4 space-y-2 z-[100]">
                         {toasts.map(toast => (
                            <Toast key={toast.id} type={toast.type} message={toast.message} onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} />
                        ))}
                    </div>
                </div>
            </ToastContext.Provider>
        </NavigationContext.Provider>
    );
};

export default App;