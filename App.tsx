

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';

import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
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
import { DashboardPage } from './pages/DashboardPage';
import { QuemSomosPage } from './pages/QuemSomosPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage'; // Import the new component
import { ContatoPage } from './pages/ContatoPage';
import { TermosPage } from './pages/TermosPage';
import { PrivacidadePage } from './pages/PrivacidadePage';
import { PoliticaReembolsoPage } from './pages/PoliticaReembolsoPage';

import { Toast } from './components/Toast';
import { MercadoPagoCheckoutModal } from './components/MercadoPagoCheckoutModal';
import { PixCheckoutModal } from './components/PixCheckoutModal';
import { WhatsAppWidget } from './components/WhatsAppWidget';

import { authService } from './services/authService';
import type { User, Plan } from './types';
import { planos } from './configs/planosConfig';

// --- CONTEXTS ---

type ToastInfo = { type: 'success' | 'error' | 'info'; message: string } | null;
type NavigationContextType = { navigate: (path: string) => void };
type CheckoutContextType = {
    openCheckoutModal: (plan: Plan) => void;
    openPixCheckoutModal: (plan: Plan) => void;
};

const NavigationContext = createContext<NavigationContextType | null>(null);
const ToastContext = createContext<((toast: ToastInfo) => void) | null>(null);
const CheckoutContext = createContext<CheckoutContextType | null>(null);

export const useNavigation = () => useContext(NavigationContext)!;
export const useToast = () => useContext(ToastContext)!;
export const useCheckout = () => useContext(CheckoutContext)!;

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(authService.getCurrentUser());
    const [currentPage, setCurrentPage] = useState(window.location.hash || '#/home');
    const [toast, setToast] = useState<ToastInfo>(null);

    // Checkout Modal State
    const [checkoutPlan, setCheckoutPlan] = useState<Plan | null>(null);
    const [isCardModalOpen, setIsCardModalOpen] = useState(false);
    const [isPixModalOpen, setIsPixModalOpen] = useState(false);

    const navigate = useCallback((path: string) => {
        window.location.hash = path;
    }, []);

    useEffect(() => {
        const handleHashChange = () => {
            window.scrollTo(0, 0); // FIX: Scroll to top on every navigation.
            setCurrentPage(window.location.hash || '#/home');
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
    
    useEffect(() => {
      // On initial load or page refresh, if there's a hash, go to it.
      // Otherwise, redirect to home.
      if (!window.location.hash) {
          navigate('#/home');
      }
    }, [navigate]);

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
    
    const handlePaymentSuccess = (planId: string) => {
      if(user) {
        const plan = planos.find(p => p.id === planId);
        if(plan){
            const updatedUser = authService.updateUserSubscription(user.email, plan.id, plan.trialDays);
            setUser(updatedUser);
            setToast({ type: 'success', message: 'Assinatura ativada com sucesso!' });
        }
      }
      setIsCardModalOpen(false);
      setIsPixModalOpen(false);
      setCheckoutPlan(null);
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
            case 'conversor': return <ConversorPage />;
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

    const checkoutContextValue = {
        openCheckoutModal: (plan: Plan) => { setCheckoutPlan(plan); setIsCardModalOpen(true); },
        openPixCheckoutModal: (plan: Plan) => { setCheckoutPlan(plan); setIsPixModalOpen(true); },
    };

    return (
        <NavigationContext.Provider value={{ navigate }}>
            <ToastContext.Provider value={setToast}>
                <CheckoutContext.Provider value={checkoutContextValue}>
                    <div className="flex flex-col min-h-screen bg-slate-50">
                        <Header currentPage={currentPage} user={user} onLogout={handleLogout} />
                        {renderPage()}
                        <Footer />
                        {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
                        {isCardModalOpen && checkoutPlan && user && (
                            <MercadoPagoCheckoutModal
                                plan={checkoutPlan}
                                user={user}
                                isOpen={isCardModalOpen}
                                onClose={() => setIsCardModalOpen(false)}
                                onPaymentSuccess={handlePaymentSuccess}
                            />
                        )}
                        {isPixModalOpen && checkoutPlan && user && (
                            <PixCheckoutModal
                                plan={checkoutPlan}
                                user={user}
                                isOpen={isPixModalOpen}
                                onClose={() => setIsPixModalOpen(false)}
                                onPaymentSuccess={handlePaymentSuccess}
                            />
                        )}
                        <WhatsAppWidget />
                    </div>
                </CheckoutContext.Provider>
            </ToastContext.Provider>
        </NavigationContext.Provider>
    );
};

export default App;