// App.tsx
// Fix: Remove .tsx extension from imports.
import React, { useState, useEffect, useCallback, useContext, createContext } from 'react';
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
import { authService } from './services/authService';
import type { User, ToastMessage, NavigationContextType } from './types';

// Contexts
export const NavigationContext = createContext<NavigationContextType | null>(null);
export const ToastContext = createContext<(toast: Omit<ToastMessage, 'id'>) => void>(() => {});

export const useNavigation = () => useContext(NavigationContext)!;
export const useToast = () => useContext(ToastContext);


const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [currentPath, setCurrentPath] = useState(window.location.hash || '#/home');

    useEffect(() => {
        const loggedInUser = authService.getCurrentUser();
        if (loggedInUser) {
            setUser(loggedInUser);
        }

        const handleHashChange = () => {
            setCurrentPath(window.location.hash || '#/home');
            window.scrollTo(0, 0);
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
    
    const navigate = useCallback((path: string) => {
        window.location.hash = path;
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
        const [page, param, ...rest] = currentPath.substring(2).split('/');

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
                return <HomePage />; // Or a 404 page
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
