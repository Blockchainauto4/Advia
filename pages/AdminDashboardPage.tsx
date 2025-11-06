import React, { useState, useEffect, useCallback } from 'react';
import type { User, WhatsAppGroup, StateGroups } from '../types';
import { authService } from '../services/authService';
import { gruposService } from '../services/gruposService';
import { useToast } from '../App';
import { UsersIcon, DocumentTextIcon, CreditCardIcon, SparklesIcon, UserCircleIcon, UserGroupIcon, TrashIcon, PlusIcon, ChevronDownIcon, SaveIcon } from '../components/Icons';

// --- Types ---
type AdminTab = 'overview' | 'users' | 'groups';

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


// --- Tab Content Components ---

const OverviewTab: React.FC = () => {
    const [stats, setStats] = useState({ totalUsers: 0, docsGenerated: 0, dailyActive: 0 });

    useEffect(() => {
        const allUsers = authService.getAllUsers();
        setStats({
            totalUsers: allUsers.length,
            docsGenerated: 147, // Mock data
            dailyActive: 23, // Mock data
        });
    }, []);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 <StatCard title="Total de Usuários" value={stats.totalUsers.toString()} icon={<UsersIcon className="w-6 h-6" />} />
                 <StatCard title="Documentos Gerados" value={stats.docsGenerated.toString()} icon={<DocumentTextIcon className="w-6 h-6" />} />
                 <StatCard title="Ativos Hoje (DAU)" value={stats.dailyActive.toString()} icon={<SparklesIcon className="w-6 h-6" />} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2"><ChartPlaceholder title="Crescimento de Usuários" /></div>
                <div className="lg:col-span-1"><ChartPlaceholder title="Uso de Ferramentas" /></div>
            </div>
        </div>
    );
};

const UsersTab: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    useEffect(() => {
        setUsers(authService.getAllUsers());
    }, []);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Gerenciar Usuários</h3>
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
                        {users.map(user => (
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
    );
};

const GroupsTab: React.FC = () => {
    const [grupos, setGrupos] = useState<StateGroups[]>([]);
    const [openState, setOpenState] = useState<string | null>(null);
    const showToast = useToast();

    useEffect(() => {
        gruposService.getGruposPorEstado().then(setGrupos);
    }, []);

    const handleGroupChange = (uf: string, groupIndex: number, field: keyof WhatsAppGroup, value: string) => {
        const newGrupos = [...grupos];
        const stateIndex = newGrupos.findIndex(s => s.uf === uf);
        if (stateIndex !== -1) {
            (newGrupos[stateIndex].groups[groupIndex] as any)[field] = value;
            setGrupos(newGrupos);
        }
    };
    
    const handleAddGroup = (uf: string) => {
        const newGrupos = [...grupos];
        const stateIndex = newGrupos.findIndex(s => s.uf === uf);
        if (stateIndex !== -1) {
            newGrupos[stateIndex].groups.push({ name: 'Novo Grupo', description: 'Descrição do novo grupo', link: '' });
            setGrupos(newGrupos);
            setOpenState(uf); // Ensure the accordion is open
        }
    };

    const handleDeleteGroup = (uf: string, groupIndex: number) => {
        if (window.confirm("Tem certeza que deseja excluir este grupo?")) {
            const newGrupos = [...grupos];
            const stateIndex = newGrupos.findIndex(s => s.uf === uf);
            if (stateIndex !== -1) {
                newGrupos[stateIndex].groups.splice(groupIndex, 1);
                setGrupos(newGrupos);
            }
        }
    };

    const handleSaveChanges = async () => {
        try {
            await gruposService.saveGruposPorEstado(grupos);
            showToast({ type: 'success', message: 'Grupos atualizados com sucesso!' });
        } catch (e) {
            showToast({ type: 'error', message: 'Falha ao salvar as alterações.' });
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-slate-800">Gerenciar Grupos de WhatsApp</h3>
                 <button onClick={handleSaveChanges} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 flex items-center">
                    <SaveIcon className="w-5 h-5 mr-2" /> Salvar Alterações
                </button>
            </div>
             <div className="space-y-2">
                {grupos.map(estado => (
                    <div key={estado.uf} className="border rounded-md">
                        <button onClick={() => setOpenState(openState === estado.uf ? null : estado.uf)} className="w-full flex justify-between items-center p-4 text-left font-semibold text-lg">
                            <span>{estado.stateName} ({estado.uf})</span>
                            <ChevronDownIcon className={`w-6 h-6 transition-transform ${openState === estado.uf ? 'rotate-180' : ''}`} />
                        </button>
                        {openState === estado.uf && (
                            <div className="p-4 bg-slate-50 border-t space-y-4">
                                {estado.groups.map((group, index) => (
                                    <div key={index} className="bg-white p-3 rounded border space-y-2 relative">
                                        <button onClick={() => handleDeleteGroup(estado.uf, index)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500">
                                            <TrashIcon className="w-5 h-5"/>
                                        </button>
                                        <div>
                                            <label className="text-xs font-medium">Nome</label>
                                            <input type="text" value={group.name} onChange={(e) => handleGroupChange(estado.uf, index, 'name', e.target.value)} className="w-full p-1 border rounded text-sm" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium">Descrição</label>
                                            <input type="text" value={group.description} onChange={(e) => handleGroupChange(estado.uf, index, 'description', e.target.value)} className="w-full p-1 border rounded text-sm" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium">Link do Convite</label>
                                            <input type="text" value={group.link} onChange={(e) => handleGroupChange(estado.uf, index, 'link', e.target.value)} className="w-full p-1 border rounded text-sm" />
                                        </div>
                                    </div>
                                ))}
                                <button onClick={() => handleAddGroup(estado.uf)} className="flex items-center text-sm bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-md hover:bg-slate-300">
                                    <PlusIcon className="w-5 h-5 mr-2" /> Adicionar Grupo a {estado.uf}
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- Main Admin Dashboard Component ---
export const AdminDashboardPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('overview');
    
    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <OverviewTab />;
            case 'users': return <UsersTab />;
            case 'groups': return <GroupsTab />;
            default: return <OverviewTab />;
        }
    };

    return (
        <main className="flex-grow bg-slate-100 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Painel Administrativo</h1>
                
                <div className="mb-6 border-b border-slate-300">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <TabButton id="overview" label="Visão Geral" icon={<SparklesIcon className="w-5 h-5 mr-2"/>} activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton id="users" label="Usuários" icon={<UsersIcon className="w-5 h-5 mr-2"/>} activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton id="groups" label="Gerenciar Grupos" icon={<UserGroupIcon className="w-5 h-5 mr-2"/>} activeTab={activeTab} setActiveTab={setActiveTab} />
                    </nav>
                </div>

                <div>{renderContent()}</div>
            </div>
        </main>
    );
};

// --- Helper Tab Component ---
const TabButton: React.FC<{id: AdminTab, label: string, icon: React.ReactNode, activeTab: AdminTab, setActiveTab: (tab: AdminTab) => void}> = 
({id, label, icon, activeTab, setActiveTab}) => (
    <button
        onClick={() => setActiveTab(id)}
        className={`${
            activeTab === id
            ? 'border-indigo-500 text-indigo-600'
            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
    >
        {icon} {label}
    </button>
);