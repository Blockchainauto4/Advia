import React, { useState } from 'react';
import type { User } from '../types';
import { useNavigation } from '../App';
import { UserCircleIcon, CreditCardIcon, Cog6ToothIcon } from '../components/Icons';
import { ProfileSettings } from '../components/dashboard/ProfileSettings';
import { SubscriptionManager } from '../components/dashboard/SubscriptionManager';
import { AccountSettings } from '../components/dashboard/AccountSettings';

type DashboardTab = 'profile' | 'subscription' | 'settings';

interface DashboardPageProps {
  user: User;
  onUserUpdate: (updatedUser: User) => void;
  onLogout: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ user, onUserUpdate, onLogout }) => {
    const [activeTab, setActiveTab] = useState<DashboardTab>('profile');
    const { navigate } = useNavigation();

    const renderContent = () => {
        switch(activeTab) {
            case 'profile':
                return <ProfileSettings user={user} onUserUpdate={onUserUpdate} />;
            case 'subscription':
                return <SubscriptionManager user={user} />;
            case 'settings':
                return <AccountSettings user={user} onLogout={onLogout} />;
            default:
                return <ProfileSettings user={user} onUserUpdate={onUserUpdate} />;
        }
    }

    return (
        <main className="flex-grow bg-slate-100 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Painel do Usuário</h1>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <aside className="md:col-span-1">
                        <div className="bg-white p-4 rounded-lg shadow-lg">
                            <ul className="space-y-1">
                                <DashboardNavLink
                                    label="Meu Perfil"
                                    icon={<UserCircleIcon className="w-5 h-5 mr-3" />}
                                    isActive={activeTab === 'profile'}
                                    onClick={() => setActiveTab('profile')}
                                />
                                <DashboardNavLink
                                    label="Minha Assinatura"
                                    icon={<CreditCardIcon className="w-5 h-5 mr-3" />}
                                    isActive={activeTab === 'subscription'}
                                    onClick={() => setActiveTab('subscription')}
                                />
                                <DashboardNavLink
                                    label="Configurações"
                                    icon={<Cog6ToothIcon className="w-5 h-5 mr-3" />}
                                    isActive={activeTab === 'settings'}
                                    onClick={() => setActiveTab('settings')}
                                />
                            </ul>
                        </div>
                    </aside>
                    {/* Content */}
                    <div className="md:col-span-3">
                        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

const DashboardNavLink: React.FC<{ label: string; icon: React.ReactNode; isActive: boolean; onClick: () => void; }> = ({ label, icon, isActive, onClick }) => (
    <li>
        <button
            onClick={onClick}
            className={`w-full flex items-center p-3 rounded-md text-sm font-medium transition-colors ${
                isActive ? 'bg-indigo-100 text-indigo-700' : 'text-slate-700 hover:bg-slate-100'
            }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    </li>
);