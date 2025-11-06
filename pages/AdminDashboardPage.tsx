// pages/AdminDashboardPage.tsx
import React from 'react';

// This is a placeholder component.
// A full implementation would require fetching data from an adminService
// and displaying stats, user tables, etc.

export const AdminDashboardPage: React.FC = () => {
    return (
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Painel de Administração</h1>
                <p className="text-center text-gray-600">
                    Esta página está em desenvolvimento.
                </p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-100 p-6 rounded-lg text-center">
                        <h2 className="text-4xl font-bold text-indigo-600">123</h2>
                        <p className="text-slate-700 font-semibold">Usuários Ativos</p>
                    </div>
                     <div className="bg-slate-100 p-6 rounded-lg text-center">
                        <h2 className="text-4xl font-bold text-indigo-600">45</h2>
                        <p className="text-slate-700 font-semibold">Assinaturas Ativas</p>
                    </div>
                     <div className="bg-slate-100 p-6 rounded-lg text-center">
                        <h2 className="text-4xl font-bold text-indigo-600">1,204</h2>
                        <p className="text-slate-700 font-semibold">Documentos Gerados</p>
                    </div>
                </div>
            </div>
        </main>
    );
};
