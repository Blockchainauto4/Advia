import React, { useState } from 'react';
import type { User } from '../../types';
import { useToast, useNavigation } from '../../AppContext';
import { authService } from '../../services/authService';

interface AccountSettingsProps {
    user: User;
    onLogout: () => void;
}

export const AccountSettings: React.FC<AccountSettingsProps> = ({ user, onLogout }) => {
    const showToast = useToast();
    const { navigate } = useNavigation();
    const [isDeleting, setIsDeleting] = useState(false);

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulação, pois não armazenamos senhas
        showToast({ type: 'success', message: 'Senha alterada com sucesso! (Simulação)' });
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível e todos os seus dados serão perdidos.')) {
            setIsDeleting(true);
            try {
                await authService.deleteUser(user.email);
                showToast({ type: 'info', message: 'Sua conta foi excluída.' });
                onLogout(); // onLogout already navigates to home
            } catch (error) {
                 showToast({ type: 'error', message: 'Não foi possível excluir a conta.' });
                 setIsDeleting(false);
            }
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Configurações da Conta</h2>
            
            {/* Change Password */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Alterar Senha</h3>
                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Senha Atual</label>
                        <input type="password" placeholder="********" className="mt-1 block w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nova Senha</label>
                        <input type="password" placeholder="********" className="mt-1 block w-full p-2 border rounded-md" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
                        <input type="password" placeholder="********" className="mt-1 block w-full p-2 border rounded-md" />
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="bg-indigo-600 text-white font-medium py-2 px-4 rounded-md hover:bg-indigo-700">
                            Alterar Senha
                        </button>
                    </div>
                </form>
            </div>

            {/* Danger Zone */}
            <div>
                <h3 className="text-lg font-semibold text-red-700 mb-4 border-b border-red-200 pb-2">Zona de Perigo</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
                    <div>
                        <p className="font-semibold text-red-800">Excluir Conta</p>
                        <p className="text-sm text-red-700">Esta ação é permanente e não pode ser desfeita.</p>
                    </div>
                    <button onClick={handleDeleteAccount} disabled={isDeleting} className="bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-red-400">
                        {isDeleting ? 'Excluindo...' : 'Excluir Minha Conta'}
                    </button>
                </div>
            </div>
        </div>
    );
};