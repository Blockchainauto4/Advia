import React, { useState, useEffect } from 'react';
import { TrashIcon, SparklesIcon } from '../components/Icons.tsx';
import { consultarPlacaVeiculo, analisarDadosVeiculo } from '../services/geminiService.ts';


// --- NEW CALCULATOR for INSS Discount ---
export const DescontoINSSCalculator = () => {
    const [salarioBruto, setSalarioBruto] = useState('');
    const [resultado, setResultado] = useState<{
        descontoTotal: number;
        salarioLiquido: number;
        aliquotaEfetiva: number;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const faixasComDeducao = [
        { teto: 1412.00, aliquota: 0.075, deducao: 0 },
        { teto: 2666.68, aliquota: 0.09, deducao: 21.18 },
        { teto: 4000.03, aliquota: 0.12, deducao: 101.18 },
        { teto: 7786.02, aliquota: 0.14, deducao: 181.18 },
    ];
    const tetoINSS = 7786.02;
    const tetoContribuicao = 908.85;

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const handleCalculate = () => {
        setError(null);
        setResultado(null);

        const salario = parseFloat(salarioBruto);
        if (isNaN(salario) || salario < 0) {
            setError('Por favor, insira um salário bruto válido.');
            return;
        }

        let descontoFinal = 0;
        const baseCalculo = salario > tetoINSS ? tetoINSS : salario;
        
        if (salario > tetoINSS) {
            descontoFinal = tetoContribuicao;
        } else {
            const faixaAplicavel = faixasComDeducao.find(f => baseCalculo <= f.teto);
            if (faixaAplicavel) {
                descontoFinal = (baseCalculo * faixaAplicavel.aliquota) - faixaAplicavel.deducao;
            }
        }
        
        const salarioLiquido = salario - descontoFinal;
        const aliquotaEfetiva = salario > 0 ? (descontoFinal / salario) * 100 : 0;
        
        setResultado({
            descontoTotal: descontoFinal,
            salarioLiquido,
            aliquotaEfetiva,
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="salarioBrutoINSS" className="block text-sm font-medium text-gray-700 mb-1">Salário Bruto Mensal (R$)</label>
                <input
                    type="number"
                    id="salarioBrutoINSS"
                    value={salarioBruto}
                    onChange={e => setSalarioBruto(e.target.value)}
                    placeholder="Ex: 3000"
                    className="w-full px-3 py-2 text-gray-900 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            <button
                onClick={handleCalculate}
                className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Calcular Desconto
            </button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
                    <h4 className="text-lg font-semibold text-gray-700">Resultado do Cálculo:</h4>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div className="bg-white p-3 rounded-md border">
                            <div className="text-sm text-slate-500">Desconto INSS</div>
                            <div className="font-bold text-red-600 text-lg">{formatCurrency(resultado.descontoTotal)}</div>
                        </div>
                        <div className="bg-white p-3 rounded-md border">
                            <div className="text-sm text-slate-500">Salário Líquido (só INSS)</div>
                            <div className="font-bold text-green-700 text-lg">{formatCurrency(resultado.salarioLiquido)}</div>
                        </div>
                        <div className="bg-white p-3 rounded-md border">
                            <div className="text-sm text-slate-500">Alíquota Efetiva</div>
                            <div className="font-bold text-indigo-700 text-lg">{resultado.aliquotaEfetiva.toFixed(2)}%</div>
                        </div>
                    </div>
                </div>
            )}
            <p className="text-xs text-slate-500 text-center italic mt-4">
                <strong>Atenção:</strong> Cálculo baseado na tabela progressiva do INSS para 2024 (Portaria Interministerial MPS/MF Nº 2, de 11/01/2024). Não inclui descontos de Imposto de Renda (IRRF) ou outros benefícios/descontos. O valor é limitado ao teto de contribuição.
            </p>
        </div>
    );
};

// --- NEW CALCULATOR for Vehicle Plate Consultation ---
export const PlacaVeiculoCalculator = () => {
    const [placa, setPlaca] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resultado, setResultado] = useState<any[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [analiseJuridica, setAnaliseJuridica] = useState<{ pontosDeAtencao: string[]; sugestoesJuridicas: string[] } | null>(null);
    const [isAnaliseLoading, setIsAnaliseLoading] = useState(false);


    const handleCalculate = async () => {
        if (!placa || placa.replace(/[^a-zA-Z0-9]/g, '').length < 7) {
            setError('Por favor, insira uma placa válida com pelo menos 7 caracteres.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResultado(null);
        setAnaliseJuridica(null);

        try {
            const data = await consultarPlacaVeiculo(placa);
            setResultado(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        if (resultado && resultado.length > 0) {
            const performAnalysis = async () => {
                setIsAnaliseLoading(true);
                try {
                    const analysis = await analisarDadosVeiculo(resultado[0], placa); 
                    setAnaliseJuridica(analysis);
                } catch (err) {
                    setAnaliseJuridica({ 
                        pontosDeAtencao: ["Erro na análise."], 
                        sugestoesJuridicas: ["Não foi possível gerar a análise jurídica automatizada. Verifique os dados manualmente ou tente novamente."]
                    });
                } finally {
                    setIsAnaliseLoading(false);
                }
            };
            performAnalysis();
        }
    }, [resultado, placa]);
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label htmlFor="placa" className="block text-sm font-medium text-gray-700 mb-1">Placa do Veículo</label>
                    <input 
                        type="text" 
                        id="placa" 
                        value={placa} 
                        onChange={e => setPlaca(e.target.value.toUpperCase())} 
                        maxLength={7}
                        placeholder="ABC1D23" 
                        className="w-full px-3 py-2 text-gray-900 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>
            <button 
                onClick={handleCalculate} 
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Consultando...
                    </>
                ) : 'Consultar Placa'}
            </button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                    <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Dados do Veículo</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {Object.entries(resultado[0]).map(([key, value]) => (
                            <div key={key} className="bg-white p-2 rounded-md border text-sm">
                                <span className="block text-xs text-slate-500">{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</span>
                                <span className="font-bold">{String(value)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
             {isAnaliseLoading && (
                 <div className="flex items-center justify-center text-sm text-slate-500">
                    <SparklesIcon className="w-5 h-5 mr-2 animate-pulse text-indigo-500" />
                    Analisando com IA...
                 </div>
             )}
            {analiseJuridica && (
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 space-y-4">
                    <h4 className="text-lg font-semibold text-indigo-800 flex items-center"><SparklesIcon className="w-5 h-5 mr-2" /> Análise Jurídica da IA</h4>
                    <div>
                        <h5 className="font-bold text-sm text-gray-700">Pontos de Atenção:</h5>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mt-1">
                            {analiseJuridica.pontosDeAtencao.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                    </div>
                     <div>
                        <h5 className="font-bold text-sm text-gray-700">Sugestões e Próximos Passos:</h5>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mt-1">
                             {analiseJuridica.sugestoesJuridicas.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    </div>
                </div>
            )}
            <p className="text-xs text-slate-500 text-center italic mt-4">
                <strong>Atenção:</strong> A consulta retorna dados de vistoria e registro. Para débitos e multas, consulte o DETRAN do seu estado. A análise da IA é preliminar e não substitui a consulta a um advogado.
            </p>
        </div>
    );
};
