import React, { useState } from 'react';
import { authService } from '../services/authService';
import { SparklesIcon, GoogleIcon, FacebookIcon, LinkedInIcon } from '../components/Icons';
import type { User } from '../types';
import { useToast } from '../App';


interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isRegistering) {
        if (!name) throw new Error('O campo nome é obrigatório.');
        await authService.register(name, email, password);
        // Após o registro, alterna para a tela de login para que o usuário entre
        setIsRegistering(false);
        showToast({type: 'success', message: 'Cadastro realizado com sucesso! Faça o login.'});
      } else {
        const user = await authService.login(email, password);
        onLoginSuccess(user);
        // O redirecionamento é feito pelo App.tsx
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    setError(null);

    // --- NOTA DE IMPLEMENTAÇÃO ---
    // A lógica abaixo é uma SIMULAÇÃO para fins de demonstração.
    // Em uma aplicação real, a autenticação social (OAuth2) deve ser implementada.
    // Isso geralmente envolve:
    // 1. Usar uma biblioteca de cliente (ex: @react-oauth/google).
    // 2. Chamar o popup de login da rede social.
    // 3. Receber um token ou código de autorização.
    // 4. Enviar esse código para um backend seguro, que o trocará por um token de acesso
    //    usando o Client ID e o Client Secret (que NUNCA devem estar no frontend).
    // 5. O backend valida o usuário, cria uma sessão e retorna para o frontend.

    // As chaves (Client IDs) foram preparadas no arquivo vercel.json e devem ser
    // configuradas como Environment Variables no painel da Vercel.
    // Ex: process.env.GOOGLE_CLIENT_ID, process.env.FACEBOOK_APP_ID

    console.log(`[SIMULAÇÃO] Iniciando login com ${provider}.`);
    console.log(`[SIMULAÇÃO] Em um app real, usaríamos a chave para ${provider}, se configurada.`);

    // Simulação de criação/login de usuário
    const mockEmail = `${provider.toLowerCase()}-user@advocacia.ai`;
    const mockPassword = 'mockPassword123'; // Senha simulada para o serviço
    const mockName = `Usuário ${provider}`;

    try {
      // Tenta fazer o login primeiro.
      const user = await authService.login(mockEmail, mockPassword);
      onLoginSuccess(user);
    } catch (loginError) {
      try {
        // Se o login falhou, assume que o usuário precisa ser registrado.
        await authService.register(mockName, mockEmail, mockPassword);
        const newUser = await authService.login(mockEmail, mockPassword);
        onLoginSuccess(newUser);
      } catch (registerError) {
         setError(registerError instanceof Error ? registerError.message : 'Erro na simulação de login social.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
            <SparklesIcon className="w-12 h-12 text-indigo-500 mx-auto mb-2" />
            <h2 className="text-2xl font-bold text-gray-900">
              {isRegistering ? 'Crie sua Conta' : 'Acesse sua Conta'}
            </h2>
            <p className="text-sm text-slate-600">
                {isRegistering ? 'Junte-se a nós para otimizar sua advocacia.' : 'Bem-vindo(a) de volta!'}
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full px-3 py-2 text-gray-900 bg-slate-50 border rounded-md" required />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full px-3 py-2 text-gray-900 bg-slate-50 border rounded-md" required />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
            <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full px-3 py-2 text-gray-900 bg-slate-50 border rounded-md" required />
          </div>
          
          {error && <p className="text-sm text-red-600 bg-red-100 p-2 rounded-md">{error}</p>}

          <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex justify-center items-center">
             {isLoading ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : (isRegistering ? 'Cadastrar' : 'Entrar')}
          </button>
        </form>
        
        <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-slate-300"></div>
            <span className="flex-shrink mx-4 text-slate-500 text-sm">OU</span>
            <div className="flex-grow border-t border-slate-300"></div>
        </div>

        <div className="space-y-3">
            <button type="button" onClick={() => handleSocialLogin('Google')} disabled={isLoading} className="w-full inline-flex items-center justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                <GoogleIcon className="w-5 h-5 mr-2" />
                <span>Entrar com Google</span>
            </button>
             <button type="button" onClick={() => handleSocialLogin('Facebook')} disabled={isLoading} className="w-full inline-flex items-center justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                <FacebookIcon className="w-5 h-5 mr-2 text-[#1877F2]" />
                <span>Entrar com Facebook</span>
            </button>
             <button type="button" onClick={() => handleSocialLogin('LinkedIn')} disabled={isLoading} className="w-full inline-flex items-center justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                <LinkedInIcon className="w-5 h-5 mr-2 text-[#0A66C2]" />
                <span>Entrar com LinkedIn</span>
            </button>
        </div>

        <div className="text-center mt-6">
          <button onClick={() => { setIsRegistering(!isRegistering); setError(null); }} className="text-sm text-indigo-600 hover:underline">
            {isRegistering ? 'Já tem uma conta? Faça login' : 'Não tem uma conta? Cadastre-se'}
          </button>
        </div>
      </div>
    </main>
  );
};