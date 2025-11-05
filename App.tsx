import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/Toast';
import { ChatPage } from './pages/ChatPage';
import { DocumentGeneratorController } from './pages/DocumentGeneratorController';
import { CalculadorasHubPage } from './pages/CalculadorasHubPage';
import { CalculatorCategoryPage } from './pages/CalculatorCategoryPage';
import { calculatorCategories } from './configs/calculatorConfigs';
import { PlanosPage } from './pages/PlanosPage';
import { AuthPage } from './pages/AuthPage';
import { QuemSomosPage } from './pages/QuemSomosPage';
import { BlogPage } from './pages/BlogPage';
import { ContatoPage } from './pages/ContatoPage';
import { TermosPage } from './pages/TermosPage';
import { PrivacidadePage } from './pages/PrivacidadePage';
import { MercadoPagoCheckoutModal } from './components/MercadoPagoCheckoutModal';
import { authService } from './services/authService';
import type { User } from './types';
import type { Plan } from './configs/planosConfig';

// Toast Context
type ToastMessage = { type: 'success' | 'error' | 'info'; message: string } | null;
const ToastContext = createContext<(message: ToastMessage) => void>(() => {});
export const useToast = () => useContext(ToastContext);

// Checkout Context
interface CheckoutContextType {
  openCheckoutModal: (plan: Plan) => void;
}
const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);
export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) throw new Error("useCheckout must be used within a CheckoutProvider");
  return context;
};

// Navigation Context
interface NavigationContextType {
  navigate: (path: string) => void;
}
const NavigationContext = createContext<NavigationContextType | undefined>(undefined);
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error("useNavigation must be used within a NavigationProvider");
  return context;
};

const AppContent: React.FC<{ user: User | null; setUser: (user: User | null) => void; onLogout: () => void; }> = ({ user, setUser, onLogout }) => {
  const [location, setLocation] = useState(window.location.hash || '#/chat');

  const navigate = useCallback((path: string) => {
    setLocation(path);
    try {
      if (window.location.hash !== path) {
        window.history.pushState(null, '', path);
      }
    } catch (e) {
      console.warn("Could not update URL hash:", e);
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setLocation(window.location.hash || '#/chat');
    };
    window.addEventListener('popstate', handlePopState);
    
    const handleHashChange = () => {
        setLocation(window.location.hash || '#/chat');
    };
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
        window.removeEventListener('popstate', handlePopState);
        window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  
  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    navigate('#/chat');
  };

  const handleLogoutWithNavigation = () => {
    onLogout();
    navigate('#/chat');
  };

  const renderPage = () => {
    const path = location.replace('#/', '').split('/');
    const page = path[0];

    if (page === 'auth') return <AuthPage onLoginSuccess={handleLoginSuccess} />;
    if (page === 'chat') return <ChatPage />;
    if (page === 'documentos') return <DocumentGeneratorController />;
    if (page === 'calculadoras') {
      if (path[1]) {
         const category = calculatorCategories.find(c => c.id === path[1]);
         return category ? <CalculatorCategoryPage category={category} /> : <CalculadorasHubPage />;
      }
      return <CalculadorasHubPage />;
    }
    if (page === 'planos') return <PlanosPage user={user} />;
    if (page === 'quem-somos') return <QuemSomosPage />;
    if (page === 'blog') return <BlogPage />;
    if (page === 'contato') return <ContatoPage />;
    if (page === 'termos') return <TermosPage />;
    if (page === 'privacidade') return <PrivacidadePage />;
    
    return <ChatPage />;
  };

  return (
    <NavigationContext.Provider value={{ navigate }}>
      <div className="flex flex-col min-h-screen bg-slate-100 font-sans">
        <Header currentPage={location} user={user} onLogout={handleLogoutWithNavigation} />
        <div className="flex-grow">
          {renderPage()}
        </div>
        <Footer />
      </div>
    </NavigationContext.Provider>
  );
};

// Main App component with providers
export default function App() {
  const [toast, setToast] = useState<ToastMessage>(null);
  const [user, setUser] = useState<User | null>(null);

  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  const showToast = useCallback((message: ToastMessage) => {
    setToast(message);
    if (message) {
      setTimeout(() => setToast(null), 3000);
    }
  }, []);

  const openCheckoutModal = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };
  
  const handleSubscriptionSuccess = (planId: string) => {
    if (user) {
        const updatedUser = authService.updateUserSubscription(user.email, planId, selectedPlan?.trialDays || 0);
        setUser(updatedUser);
        setIsCheckoutOpen(false);
        showToast({ type: 'success', message: 'Assinatura ativada com sucesso!' });
    }
  };

  return (
    <ToastContext.Provider value={showToast}>
      <CheckoutContext.Provider value={{ openCheckoutModal }}>
        <AppContent user={user} setUser={setUser} onLogout={handleLogout} />
        {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
        {isCheckoutOpen && selectedPlan && user && (
          <MercadoPagoCheckoutModal
            plan={selectedPlan}
            user={user}
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            onPaymentSuccess={handleSubscriptionSuccess}
          />
        )}
      </CheckoutContext.Provider>
    </ToastContext.Provider>
  );
}