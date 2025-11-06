import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import { UsersIcon, DocumentTextIcon, CreditCardIcon, SparklesIcon, UserCircleIcon } from '../components/Icons';

// --- Reusable Components ---

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
        <div className="bg-indigo-100 text-indigo-600 rounded-full p-3">
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const ChartPlaceholder: React.FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>
        <div className="bg-slate-50 border border-slate-200 rounded-md h-64 flex items-center justify-center text-slate-400">
            {children || <p>Gráfico em desenvolvimento</p>}
        </div>
    </div>
);

// --- Main Admin Dashboard Component ---

export const AdminDashboardPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        docsGenerated: 0,
        dailyActive: 0,
    });

    useEffect(() => {
        // Fetch real user data
        const allUsers = authService.getAllUsers();
        setUsers(allUsers);

        // Simulate other stats
        setStats({
            totalUsers: allUsers.length,
            activeUsers: allUsers.length, // Since all are free users now
            docsGenerated: 147, // Mock data
            dailyActive: 23, // Mock data
        });
    }, []);

    return (
        <main className="flex-grow bg-slate-100 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Painel Administrativo</h1>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Total de Usuários" value={stats.totalUsers.toString()} icon={<UsersIcon className="w-6 h-6" />} />
                    <StatCard title="Usuários Ativos" value={stats.activeUsers.toString()} icon={<CreditCardIcon className="w-6 h-6" />} />
                    <StatCard title="Documentos Gerados" value={stats.docsGenerated.toString()} icon={<DocumentTextIcon className="w-6 h-6" />} />
                    <StatCard title="Ativos Hoje (DAU)" value={stats.dailyActive.toString()} icon={<SparklesIcon className="w-6 h-6" />} />
                </div>

                {/* Charts and User Table */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <ChartPlaceholder title="Crescimento de Usuários" />
                    </div>
                    <div className="lg:col-span-1">
                         <ChartPlaceholder title="Uso de Ferramentas" />
                    </div>
                    <div className="lg:col-span-3">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                             <h3 className="text-lg font-semibold text-slate-800 mb-4">Usuários Recentes</h3>
                             <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-slate-500">
                                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Nome</th>
                                            <th scope="col" className="px-6 py-3">Email</th>
                                            <th scope="col" className="px-6 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.slice(0, 5).map(user => ( // Show first 5 users
                                            <tr key={user.email} className="bg-white border-b hover:bg-slate-50">
                                                <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap flex items-center">
                                                    {user.photoUrl ? <img src={user.photoUrl} className="w-8 h-8 rounded-full mr-3" alt={user.name}/> : <UserCircleIcon className="w-8 h-8 text-slate-300 mr-3" />}
                                                    {user.name}
                                                </th>
                                                <td className="px-6 py-4">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'}`}>
                                                        {user.role === 'admin' ? 'Admin' : 'Ativo'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};