import React, { useState } from 'react';
import type { User } from '../../types';
import { authService } from '../../services/authService';
import { useToast } from '../../App';
import { UserCircleIcon } from '../Icons';

interface ProfileSettingsProps {
    user: User;
    onUserUpdate: (updatedUser: User) => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onUserUpdate }) => {
    const [name, setName] = useState(user.name);
    const [photo, setPhoto] = useState<string | null>(user.photoUrl || null);
    const [isLoading, setIsLoading] = useState(false);
    const showToast = useToast();

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = async () => {
        setIsLoading(true);
        try {
            const updatedDetails: Partial<User> = { name };
            if (photo) {
                updatedDetails.photoUrl = photo;
            }
            const updatedUser = authService.updateUserDetails(user.email, updatedDetails);
            if (updatedUser) {
                onUserUpdate(updatedUser);
                showToast({ type: 'success', message: 'Perfil atualizado com sucesso!' });
            } else {
                throw new Error('Usuário não encontrado.');
            }
        } catch (error) {
            showToast({ type: 'error', message: error instanceof Error ? error.message : 'Falha ao atualizar perfil.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Meu Perfil</h2>
            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    {photo ? (
                        <img src={photo} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
                    ) : (
                        <UserCircleIcon className="w-20 h-20 text-slate-300" />
                    )}
                    <div>
                        <label htmlFor="photo-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Alterar Foto
                        </label>
                        <input id="photo-upload" name="photo-upload" type="file" className="sr-only" accept="image/*" onChange={handlePhotoChange} />
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF até 2MB.</p>
                    </div>
                </div>

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" value={user.email} disabled className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm text-gray-500" />
                </div>

                <div className="flex justify-end">
                    <button onClick={handleSaveChanges} disabled={isLoading} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">
                        {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </div>
        </div>
    );
};