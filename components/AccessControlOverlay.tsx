
import React from 'react';
import { LockClosedIcon } from './Icons';
import { useNavigation } from '../App';

interface AccessControlOverlayProps {
    isAllowed: boolean;
    children: React.ReactNode;
    featureName: string;
}

export const AccessControlOverlay: React.FC<AccessControlOverlayProps> = ({ isAllowed, children, featureName }) => {
    const { navigate } = useNavigation();

    if (isAllowed) {
        return <>{children}</>;
    }

    return (
        <div className="relative">
            <div className="blur-sm pointer-events-none">
                {children}
            </div>
            <div className="absolute inset-0 bg-slate-200 bg-opacity-70 flex flex-col items-center justify-center text-center p-8 rounded-lg">
                <LockClosedIcon className="w-12 h-12 text-slate-500 mb-4" />
                <h3 className="text-xl font-bold text-slate-800">Recurso Premium</h3>
                <p className="text-slate-600 mt-2 mb-6">
                    O acesso à funcionalidade de <strong>{featureName}</strong> está disponível apenas para assinantes.
                </p>
                <button
                    onClick={() => navigate('#/planos')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                    Ver Planos
                </button>
            </div>
        </div>
    );
};
