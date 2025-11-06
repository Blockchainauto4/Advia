import React, { useState } from 'react';
import { consultarCep, consultarCnpj } from '../services/geminiService';

const LoadingButtonContent: React.FC<{text: string}> = ({ text }) => (
    <>
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {text}
    </>
);

const ResultItem: React.FC<{ label: string; value: string | number | undefined }> = ({ label, value }) => (
    value ? (
        <div className="bg-white p-2 rounded-md border text-sm">
            <span className="block text-xs text-slate-500">{label}</span>
            <span className="font-bold">{value}</span>
        </div>
    ) : null
);

// --- NEW COMPONENT for CEP Consultation ---
export const CepConsultor = () => {
    const [cep, setCep] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resultado, setResultado] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value.replace(/\D/g, '');
        if (input.length <= 8) {
            let formattedCep = input;
            if (input.length > 5) {
                formattedCep = `${input.slice(0, 5)}-${input.slice(5)}`;
            }
            setCep(formattedCep);
        }
    };
    
    const handleConsultar = async () => {
        if (!cep || cep.replace(/\D/g, '').length !== 8) {
            setError('Por favor, insira um CEP válido com 8 dígitos.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResultado(null);

        try {
            const data = await consultarCep(cep);
            setResultado(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                <input 
                    type="text" 
                    id="cep" 
                    value={cep} 
                    onChange={handleCepChange}
                    maxLength={9}
                    placeholder="00000-000" 
                    className="w-full px-3 py-2 text-gray-900 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            <button 
                onClick={handleConsultar} 
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isLoading ? <LoadingButtonContent text="Consultando..." /> : 'Consultar CEP'}
            </button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            
            {resultado && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                    <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Endereço Encontrado</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                       <ResultItem label="Logradouro" value={resultado.street} />
                       <ResultItem label="Bairro" value={resultado.neighborhood} />
                       <ResultItem label="Cidade" value={resultado.city} />
                       <ResultItem label="Estado" value={resultado.state} />
                       <ResultItem label="CEP" value={resultado.cep} />
                       <ResultItem label="DDD" value={resultado.ddd} />
                    </div>
                </div>
            )}
        </div>
    );
};

// --- NEW COMPONENT for CNPJ Consultation ---
export const CnpjConsultor = () => {
    const [cnpj, setCnpj] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resultado, setResultado] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

     const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value.replace(/\D/g, '');
        if (input.length <= 14) {
            let formattedCnpj = input;
            if (input.length > 2) formattedCnpj = `${input.slice(0, 2)}.${input.slice(2)}`;
            if (input.length > 5) formattedCnpj = `${formattedCnpj.slice(0, 6)}.${formattedCnpj.slice(6)}`;
            if (input.length > 8) formattedCnpj = `${formattedCnpj.slice(0, 10)}/${formattedCnpj.slice(10)}`;
            if (input.length > 12) formattedCnpj = `${formattedCnpj.slice(0, 15)}-${formattedCnpj.slice(15)}`;
            setCnpj(formattedCnpj);
        }
    };

    const handleConsultar = async () => {
        if (!cnpj || cnpj.replace(/\D/g, '').length !== 14) {
            setError('Por favor, insira um CNPJ válido com 14 dígitos.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResultado(null);

        try {
            const data = await consultarCnpj(cnpj);
            setResultado(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                <input 
                    type="text" 
                    id="cnpj" 
                    value={cnpj} 
                    onChange={handleCnpjChange}
                    maxLength={18}
                    placeholder="00.000.000/0000-00" 
                    className="w-full px-3 py-2 text-gray-900 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            <button 
                onClick={handleConsultar} 
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isLoading ? <LoadingButtonContent text="Consultando..." /> : 'Consultar CNPJ'}
            </button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            
            {resultado && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">Dados da Empresa</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                           <ResultItem label="Razão Social" value={resultado.razao_social} />
                           <ResultItem label="Nome Fantasia" value={resultado.nome_fantasia} />
                           <ResultItem label="CNPJ" value={resultado.cnpj} />
                           <ResultItem label="Situação Cadastral" value={resultado.descricao_situacao_cadastral} />
                           <ResultItem label="Data de Abertura" value={resultado.data_inicio_atividade} />
                           <ResultItem label="Natureza Jurídica" value={resultado.natureza_juridica} />
                        </div>
                    </div>
                     <div>
                        <h4 className="text-md font-semibold text-gray-700 border-b pb-1 mb-2">Endereço</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                           <ResultItem label="Logradouro" value={`${resultado.logradouro}, ${resultado.numero}`} />
                           <ResultItem label="Bairro" value={resultado.bairro} />
                           <ResultItem label="CEP" value={resultado.cep} />
                           <ResultItem label="Município" value={resultado.municipio} />
                           <ResultItem label="UF" value={resultado.uf} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
