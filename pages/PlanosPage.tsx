import React from 'react';
import { SparklesIcon } from '../components/Icons.tsx';
import type { User } from '../types.ts';
import { useNavigation } from '../App.tsx';

interface PlanosPageProps {
  user: User | null;
}

export const PlanosPage: React.FC<PlanosPageProps> = ({ user }) => {
  const { navigate } = useNavigation();

  return (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
      <div className="text-center bg-white p-12 rounded-lg shadow-lg max-w-2xl mx-auto">
        <SparklesIcon className="w-16 h-16 text-indigo-500 mx-auto mb-6" />
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Acesso Gratuito à Plataforma!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Boas notícias! Para celebrar nossa comunidade e incentivar a inovação na advocacia, estamos oferecendo <strong>acesso completo e gratuito</strong> a todas as ferramentas da AdvocaciaAI por tempo limitado.
        </p>
        {user ? (
          <div>
            <p className="text-green-700 font-semibold mb-6">Você já está logado e com acesso total liberado. Aproveite!</p>
            <button
              onClick={() => navigate('#/chat')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
            >
              Explorar Ferramentas
            </button>
          </div>
        ) : (
          <div>
            <p className="font-semibold mb-6">Crie sua conta gratuitamente para começar a usar.</p>
            <button
              onClick={() => navigate('#/auth')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
            >
              Cadastre-se Grátis
            </button>
          </div>
        )}
      </div>
    </main>
  );
};