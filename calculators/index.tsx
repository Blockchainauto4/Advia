import React, { useState, useEffect } from 'react';
// Fix: Remove .tsx extension from imports.
import { TrashIcon, SparklesIcon, PlusIcon, UserGroupIcon } from '../components/Icons';
import { consultarPlacaVeiculo, analisarDadosVeiculo } from '../services/geminiService';


const TAX_CONFIG_2024 = {
    inss: [
        { teto: 1412.00, aliquota: 0.075, deducao: 0 },
        { teto: 2666.68, aliquota: 0.09, deducao: 21.18 },
        { teto: 4000.03, aliquota: 0.12, deducao: 101.18 },
        { teto: 7786.02, aliquota: 0.14, deducao: 181.18 },
    ],
    tetoINSS: 7786.02,
    tetoContribuicaoINSS: 908.85,
    irrf: [
        { teto: 2259.20, aliquota: 0, parcela: 0 },
        { teto: 2826.65, aliquota: 0.075, parcela: 169.44 },
        { teto: 3751.05, aliquota: 0.15, parcela: 381.44 },
        { teto: 4664.68, aliquota: 0.225, parcela: 662.77 },
        { teto: Infinity, aliquota: 0.275, parcela: 896.00 },
    ],
    deducaoDependenteIRRF: 189.59,
};


// --- UPDATED CALCULATOR for Net Salary (CLT) ---
export const SalarioLiquidoCalculator = () => {
    const [salarioBruto, setSalarioBruto] = useState('');
    const [dependentes, setDependentes] = useState('0');
    const [resultado, setResultado] = useState<{
        salarioBruto: number;
        descontoINSS: number;
        baseCalculoIRRF: number;
        descontoIRRF: number;
        salarioLiquido: number;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const handleCalculate = () => {
        setError(null);
        setResultado(null);

        const salario = parseFloat(salarioBruto);
        const numDependentes = parseInt(dependentes) || 0;

        if (isNaN(salario) || salario < 0) {
            setError('Por favor, insira um salário bruto válido.');
            return;
        }

        // 1. Cálculo do INSS
        let descontoINSS = 0;
        const baseCalculoINSS = salario > TAX_CONFIG_2024.tetoINSS ? TAX_CONFIG_2024.tetoINSS : salario;
        
        if (salario > TAX_CONFIG_2024.tetoINSS) {
            descontoINSS = TAX_CONFIG_2024.tetoContribuicaoINSS;
        } else {
            const faixaINSS = TAX_CONFIG_2024.inss.find(f => baseCalculoINSS <= f.teto);
            if (faixaINSS) {
                descontoINSS = (baseCalculoINSS * faixaINSS.aliquota) - faixaINSS.deducao;
            }
        }
        descontoINSS = parseFloat(descontoINSS.toFixed(2));

        // 2. Cálculo do IRRF
        const deducaoDependentes = numDependentes * TAX_CONFIG_2024.deducaoDependenteIRRF;
        const baseCalculoIRRF = salario - descontoINSS - deducaoDependentes;

        let descontoIRRF = 0;
        if (baseCalculoIRRF > 0) {
            const faixaIRRF = TAX_CONFIG_2024.irrf.find(f => baseCalculoIRRF <= f.teto);
            if (faixaIRRF && faixaIRRF.aliquota > 0) {
                descontoIRRF = (baseCalculoIRRF * faixaIRRF.aliquota) - faixaIRRF.parcela;
            }
        }
        descontoIRRF = parseFloat(Math.max(0, descontoIRRF).toFixed(2));
        
        // 3. Cálculo do Salário Líquido
        const salarioLiquido = salario - descontoINSS - descontoIRRF;
        
        setResultado({
            salarioBruto: salario,
            descontoINSS,
            baseCalculoIRRF,
            descontoIRRF,
            salarioLiquido,
        });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="salarioBrutoCLT" className="block text-sm font-medium text-gray-700 mb-1">Salário Bruto Mensal (R$)</label>
                    <input
                        type="number"
                        id="salarioBrutoCLT"
                        value={salarioBruto}
                        onChange={e => setSalarioBruto(e.target.value)}
                        placeholder="Ex: 5000"
                        className="w-full px-3 py-2 text-gray-900 bg-slate-50 border border-slate-300 rounded-md shadow-sm"
                    />
                </div>
                 <div>
                    <label htmlFor="dependentesIRRF" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <UserGroupIcon className="w-4 h-4 mr-1 text-slate-500" />
                        Nº de Dependentes (IRRF)
                    </label>
                    <input
                        type="number"
                        id="dependentesIRRF"
                        value={dependentes}
                        onChange={e => setDependentes(e.target.value)}
                        min="0"
                        className="w-full px-3 py-2 text-gray-900 bg-slate-50 border border-slate-300 rounded-md shadow-sm"
                    />
                </div>
            </div>
            <button
                onClick={handleCalculate}
                className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Calcular Salário Líquido
            </button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Extrato do Cálculo:</h4>
                    <ul className="space-y-1 text-sm">
                        <li className="flex justify-between items-center p-2 bg-white rounded-md border">
                            <span className="text-slate-600">Salário Bruto</span>
                            <span className="font-bold text-green-700">{formatCurrency(resultado.salarioBruto)}</span>
                        </li>
                        <li className="flex justify-between items-center p-2 bg-white rounded-md border">
                            <span className="text-slate-600">Desconto INSS</span>
                            <span className="font-bold text-red-600">(-) {formatCurrency(resultado.descontoINSS)}</span>
                        </li>
                         <li className="flex justify-between items-center p-2 bg-white rounded-md border">
                            <span className="text-slate-600">Desconto IRRF</span>
                            <span className="font-bold text-red-600">(-) {formatCurrency(resultado.descontoIRRF)}</span>
                        </li>
                        <li className="flex justify-between items-center p-3 bg-indigo-100 rounded-md border-t-2 border-indigo-300 mt-2">
                            <span className="font-bold text-indigo-800">Salário Líquido</span>
                            <span className="font-extrabold text-xl text-indigo-800">{formatCurrency(resultado.salarioLiquido)}</span>
                        </li>
                    </ul>
                     <div className="text-xs text-slate-500 pt-2">
                        Alíquota Efetiva Total: <strong>{((resultado.descontoINSS + resultado.descontoIRRF) / resultado.salarioBruto * 100).toFixed(2)}%</strong>
                    </div>
                </div>
            )}
            <p className="text-xs text-slate-500 text-center italic mt-4">
                <strong>Atenção:</strong> Cálculo baseado nas tabelas de INSS e IRRF de 2024. Não inclui outros descontos (ex: vale-transporte, plano de saúde) ou benefícios (ex: vale-alimentação).
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


// --- NEW CALCULATOR for Contribution Time ---
export const TempoDeContribuicaoCalculator = () => {
    const [periodos, setPeriodos] = useState([{ inicio: '', fim: '' }]);
    const [resultado, setResultado] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handlePeriodoChange = (index: number, field: 'inicio' | 'fim', value: string) => {
        const novosPeriodos = [...periodos];
        novosPeriodos[index][field] = value;
        setPeriodos(novosPeriodos);
    };

    const addPeriodo = () => {
        setPeriodos([...periodos, { inicio: '', fim: '' }]);
    };

    const removePeriodo = (index: number) => {
        const novosPeriodos = periodos.filter((_, i) => i !== index);
        setPeriodos(novosPeriodos);
    };

    const handleCalculate = () => {
        setError(null);
        let totalDias = 0;
        for (const periodo of periodos) {
            if (!periodo.inicio || !periodo.fim) {
                setError('Preencha todas as datas de início e fim.');
                return;
            }
            const dataInicio = new Date(periodo.inicio);
            const dataFim = new Date(periodo.fim);
            if (dataFim < dataInicio) {
                setError(`A data final (${periodo.fim}) não pode ser anterior à data inicial (${periodo.inicio}).`);
                return;
            }
            const diffTime = Math.abs(dataFim.getTime() - dataInicio.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 for inclusive
            totalDias += diffDays;
        }

        const anos = Math.floor(totalDias / 365);
        const diasRestantes = totalDias % 365;
        const meses = Math.floor(diasRestantes / 30);
        const dias = diasRestantes % 30;

        setResultado(`${anos} anos, ${meses} meses e ${dias} dias`);
    };

    return (
        <div className="space-y-6">
            {periodos.map((p, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                    <div className="flex-grow grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs font-medium text-gray-700">Data de Início</label>
                            <input type="date" value={p.inicio} onChange={e => handlePeriodoChange(index, 'inicio', e.target.value)} className="w-full px-2 py-1 text-sm bg-slate-50 border-slate-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">Data de Fim</label>
                            <input type="date" value={p.fim} onChange={e => handlePeriodoChange(index, 'fim', e.target.value)} className="w-full px-2 py-1 text-sm bg-slate-50 border-slate-300 rounded-md" />
                        </div>
                    </div>
                    <button onClick={() => removePeriodo(index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full" aria-label="Remover período"><TrashIcon className="w-5 h-5"/></button>
                </div>
            ))}
            <button onClick={addPeriodo} className="w-full flex items-center justify-center text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-md transition-colors">
                <PlusIcon className="w-5 h-5 mr-2" />
                Adicionar Período
            </button>
            <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">
                Calcular Tempo Total
            </button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                    <h4 className="text-lg font-semibold text-gray-700">Tempo Total de Contribuição:</h4>
                    <p className="font-bold text-indigo-700 text-2xl mt-2">{resultado}</p>
                </div>
            )}
             <p className="text-xs text-slate-500 text-center italic mt-4">
                <strong>Atenção:</strong> Este cálculo é uma estimativa e não considera regras específicas de contagem de tempo (ex: atividades especiais). Para fins de aposentadoria, consulte sempre o extrato do CNIS e um advogado especialista.
            </p>
        </div>
    );
};

// --- NEW CALCULATOR for Procedural Deadlines ---
export const PrazosProcessuaisCalculator = () => {
    const [dataInicio, setDataInicio] = useState('');
    const [dias, setDias] = useState('15');
    const [tipoPrazo, setTipoPrazo] = useState('uteis');
    const [resultado, setResultado] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const feriadosNacionais = [ // 2024 for example
        '2024-01-01', '2024-03-29', '2024-04-21', '2024-05-01',
        '2024-09-07', '2024-10-12', '2024-11-02', '2024-11-15',
        '2024-11-20', '2024-12-25'
    ];

    const handleCalculate = () => {
        setError(null);
        if (!dataInicio || !dias || parseInt(dias) <= 0) {
            setError('Preencha a data de início e o número de dias do prazo.');
            return;
        }
        
        let dataFinal = new Date(dataInicio + 'T12:00:00Z'); // Avoid timezone issues
        const prazoDias = parseInt(dias);
        
        if (tipoPrazo === 'corridos') {
            dataFinal.setDate(dataFinal.getDate() + prazoDias);
        } else { // úteis
            let diasContados = 0;
            while(diasContados < prazoDias) {
                dataFinal.setDate(dataFinal.getDate() + 1);
                const diaDaSemana = dataFinal.getDay();
                const isFeriado = feriadosNacionais.includes(dataFinal.toISOString().split('T')[0]);
                if (diaDaSemana !== 0 && diaDaSemana !== 6 && !isFeriado) {
                    diasContados++;
                }
            }
        }
        
        setResultado(dataFinal.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="dataInicioPrazo" className="block text-sm font-medium text-gray-700 mb-1">Data de Início do Prazo</label>
                    <input type="date" id="dataInicioPrazo" value={dataInicio} onChange={e => setDataInicio(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-md" />
                </div>
                 <div>
                    <label htmlFor="diasPrazo" className="block text-sm font-medium text-gray-700 mb-1">Prazo em Dias</label>
                    <input type="number" id="diasPrazo" value={dias} onChange={e => setDias(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-md" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Contagem</label>
                <div className="flex space-x-4">
                    <label className="flex items-center"><input type="radio" value="uteis" checked={tipoPrazo === 'uteis'} onChange={() => setTipoPrazo('uteis')} className="h-4 w-4 text-indigo-600"/> <span className="ml-2">Dias Úteis</span></label>
                    <label className="flex items-center"><input type="radio" value="corridos" checked={tipoPrazo === 'corridos'} onChange={() => setTipoPrazo('corridos')} className="h-4 w-4 text-indigo-600"/> <span className="ml-2">Dias Corridos</span></label>
                </div>
            </div>
            <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">Calcular Data Final</button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                    <h4 className="text-lg font-semibold text-gray-700">O prazo se encerrará em:</h4>
                    <p className="font-bold text-indigo-700 text-2xl mt-2">{resultado}</p>
                </div>
            )}
             <p className="text-xs text-slate-500 text-center italic mt-4">
                <strong>Atenção:</strong> A calculadora considera apenas feriados nacionais fixos de 2024. Feriados locais, estaduais ou pontos facultativos não são considerados. Verifique sempre o calendário do tribunal competente.
            </p>
        </div>
    );
};

// --- NEW CALCULATOR for Interest Calculation ---
export const JurosCalculator = () => {
    const [principal, setPrincipal] = useState('');
    const [taxa, setTaxa] = useState('');
    const [periodo, setPeriodo] = useState('');
    const [tipoJuros, setTipoJuros] = useState('simples');
    const [resultado, setResultado] = useState<{ montante: number, jurosTotal: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const handleCalculate = () => {
        setError(null);
        const p = parseFloat(principal);
        const r = parseFloat(taxa) / 100;
        const t = parseInt(periodo);
        if (isNaN(p) || isNaN(r) || isNaN(t) || p < 0 || r < 0 || t < 0) {
            setError('Preencha todos os campos com valores válidos.');
            return;
        }

        let montante = 0;
        if (tipoJuros === 'simples') {
            montante = p * (1 + r * t);
        } else { // composto
            montante = p * Math.pow((1 + r), t);
        }
        const jurosTotal = montante - p;
        setResultado({ montante, jurosTotal });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="principal" className="block text-sm font-medium text-gray-700 mb-1">Valor Principal (R$)</label>
                    <input type="number" id="principal" value={principal} onChange={e => setPrincipal(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-md" />
                </div>
                <div>
                    <label htmlFor="taxa" className="block text-sm font-medium text-gray-700 mb-1">Taxa de Juros (% a.m.)</label>
                    <input type="number" id="taxa" value={taxa} onChange={e => setTaxa(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-md" />
                </div>
                <div>
                    <label htmlFor="periodo" className="block text-sm font-medium text-gray-700 mb-1">Período (meses)</label>
                    <input type="number" id="periodo" value={periodo} onChange={e => setPeriodo(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-md" />
                </div>
            </div>
            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Juros</label>
                <div className="flex space-x-4">
                    <label className="flex items-center"><input type="radio" value="simples" checked={tipoJuros === 'simples'} onChange={() => setTipoJuros('simples')} className="h-4 w-4 text-indigo-600"/> <span className="ml-2">Juros Simples</span></label>
                    <label className="flex items-center"><input type="radio" value="composto" checked={tipoJuros === 'composto'} onChange={() => setTipoJuros('composto')} className="h-4 w-4 text-indigo-600"/> <span className="ml-2">Juros Compostos</span></label>
                </div>
            </div>
            <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">Calcular</button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white p-3 rounded-md border">
                        <div className="text-sm text-slate-500">Juros Total</div>
                        <div className="font-bold text-red-600 text-lg">{formatCurrency(resultado.jurosTotal)}</div>
                    </div>
                    <div className="bg-white p-3 rounded-md border">
                        <div className="text-sm text-slate-500">Montante Final</div>
                        <div className="font-bold text-green-700 text-lg">{formatCurrency(resultado.montante)}</div>
                    </div>
                </div>
            )}
             <p className="text-xs text-slate-500 text-center italic mt-4">
                <strong>Atenção:</strong> Esta é uma calculadora financeira genérica. Para cálculos judiciais, verifique os índices de correção e taxas de juros aplicáveis ao caso específico, conforme determinação legal ou contratual.
            </p>
        </div>
    );
};

// --- NEW CALCULATOR for Sentence Progression ---
export const ProgressaoRegimeCalculator = () => {
    const [anos, setAnos] = useState('');
    const [meses, setMeses] = useState('');
    const [dias, setDias] = useState('');
    const [porcentagem, setPorcentagem] = useState('16');
    const [dataInicio, setDataInicio] = useState('');
    const [resultado, setResultado] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        setError(null);
        const a = parseInt(anos) || 0;
        const m = parseInt(meses) || 0;
        const d = parseInt(dias) || 0;
        const p = parseFloat(porcentagem);

        if ((a + m + d) <= 0 || !dataInicio) {
            setError('Preencha a pena total e a data de início do cumprimento.');
            return;
        }

        const totalDiasPena = (a * 365) + (m * 30) + d;
        const diasParaProgredir = Math.ceil(totalDiasPena * (p / 100));
        
        let dataResultado = new Date(dataInicio + 'T12:00:00Z');
        dataResultado.setDate(dataResultado.getDate() + diasParaProgredir - 1); // -1 as start date is day 1

        setResultado(dataResultado.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }));
    };

    return (
        <div className="space-y-6">
            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Pena Total</label>
                <div className="grid grid-cols-3 gap-2">
                    <input type="number" placeholder="Anos" value={anos} onChange={e => setAnos(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-md" />
                    <input type="number" placeholder="Meses" value={meses} onChange={e => setMeses(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-md" />
                    <input type="number" placeholder="Dias" value={dias} onChange={e => setDias(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-md" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="dataInicioPena" className="block text-sm font-medium text-gray-700 mb-1">Início do Cumprimento</label>
                    <input type="date" id="dataInicioPena" value={dataInicio} onChange={e => setDataInicio(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-md" />
                </div>
                <div>
                    <label htmlFor="porcentagem" className="block text-sm font-medium text-gray-700 mb-1">Fração/Porcentagem</label>
                    <select id="porcentagem" value={porcentagem} onChange={e => setPorcentagem(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-md">
                        <option value="16">16% (Primário, sem violência)</option>
                        <option value="20">20% (Reincidente, sem violência)</option>
                        <option value="25">25% (Primário, com violência)</option>
                        <option value="30">30% (Reincidente, com violência)</option>
                        <option value="40">40% (Primário, hediondo)</option>
                        <option value="50">50% (Hediondo com morte)</option>
                        <option value="60">60% (Reincidente, hediondo)</option>
                        <option value="70">70% (Reincidente, hediondo com morte)</option>
                    </select>
                </div>
            </div>
            <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">Calcular Progressão</button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                    <h4 className="text-lg font-semibold text-gray-700">Data Provável para Progressão de Regime:</h4>
                    <p className="font-bold text-indigo-700 text-2xl mt-2">{resultado}</p>
                </div>
            )}
             <p className="text-xs text-slate-500 text-center italic mt-4">
                <strong>Atenção:</strong> O cálculo não considera remição de pena ou outras variáveis. A data é uma estimativa. A análise final para a progressão de regime é de competência do Juízo da Execução Penal.
            </p>
        </div>
    );
};

// --- NEW CALCULATOR for ITBI ---
export const ITBICalculator = () => {
    const [valorImovel, setValorImovel] = useState('');
    const [aliquota, setAliquota] = useState('3'); // Default for many cities like São Paulo
    const [resultado, setResultado] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const handleCalculate = () => {
        setError(null);
        const valor = parseFloat(valorImovel);
        const aliq = parseFloat(aliquota);

        if (isNaN(valor) || isNaN(aliq) || valor <= 0 || aliq <= 0) {
            setError('Por favor, insira valores válidos para o imóvel e a alíquota.');
            return;
        }

        const itbi = (valor * aliq) / 100;
        setResultado(itbi);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="valorImovel" className="block text-sm font-medium text-gray-700 mb-1">Valor do Imóvel (R$)</label>
                    <input
                        type="number"
                        id="valorImovel"
                        value={valorImovel}
                        onChange={e => setValorImovel(e.target.value)}
                        placeholder="Ex: 500000"
                        className="w-full px-3 py-2 text-gray-900 bg-slate-50 border border-slate-300 rounded-md shadow-sm"
                    />
                </div>
                <div>
                    <label htmlFor="aliquotaItbi" className="block text-sm font-medium text-gray-700 mb-1">Alíquota do ITBI (%)</label>
                    <input
                        type="number"
                        id="aliquotaItbi"
                        value={aliquota}
                        onChange={e => setAliquota(e.target.value)}
                        placeholder="Ex: 3"
                        className="w-full px-3 py-2 text-gray-900 bg-slate-50 border border-slate-300 rounded-md shadow-sm"
                    />
                </div>
            </div>
            <button
                onClick={handleCalculate}
                className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Calcular ITBI
            </button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado !== null && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                    <h4 className="text-lg font-semibold text-gray-700">Valor Estimado do ITBI:</h4>
                    <p className="font-bold text-indigo-700 text-2xl mt-2">{formatCurrency(resultado)}</p>
                </div>
            )}
            <p className="text-xs text-slate-500 text-center italic mt-4">
                <strong>Atenção:</strong> A alíquota do ITBI é definida por legislação municipal e pode variar. Verifique a alíquota vigente no município onde o imóvel está localizado. Este cálculo é uma estimativa.
            </p>
        </div>
    );
};

// --- NEW CALCULATOR for Rent Adjustment ---
export const ReajusteAluguelCalculator = () => {
    const [valorAtual, setValorAtual] = useState('');
    const [variacao, setVariacao] = useState('');
    const [resultado, setResultado] = useState<{ novoValor: number; aumento: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const handleCalculate = () => {
        setError(null);
        const valor = parseFloat(valorAtual);
        const vari = parseFloat(variacao);

        if (isNaN(valor) || isNaN(vari) || valor <= 0) {
            setError('Por favor, insira valores válidos para o aluguel e a variação do índice.');
            return;
        }

        const novoValor = valor * (1 + vari / 100);
        const aumento = novoValor - valor;
        setResultado({ novoValor, aumento });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="valorAtualAluguel" className="block text-sm font-medium text-gray-700 mb-1">Valor Atual do Aluguel (R$)</label>
                    <input
                        type="number"
                        id="valorAtualAluguel"
                        value={valorAtual}
                        onChange={e => setValorAtual(e.target.value)}
                        placeholder="Ex: 1500"
                        className="w-full px-3 py-2 text-gray-900 bg-slate-50 border border-slate-300 rounded-md"
                    />
                </div>
                <div>
                    <label htmlFor="variacaoIndice" className="block text-sm font-medium text-gray-700 mb-1">Variação Anual do Índice (%)</label>
                    <input
                        type="number"
                        id="variacaoIndice"
                        value={variacao}
                        onChange={e => setVariacao(e.target.value)}
                        placeholder="Ex: 4.26 (para IPCA) ou -3.18 (para IGP-M)"
                        className="w-full px-3 py-2 text-gray-900 bg-slate-50 border border-slate-300 rounded-md"
                    />
                </div>
            </div>
            <button
                onClick={handleCalculate}
                className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700"
            >
                Calcular Reajuste
            </button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado !== null && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                    <div className="bg-white p-3 rounded-md border">
                        <div className="text-sm text-slate-500">Acréscimo Mensal</div>
                        <div className={`font-bold text-lg ${resultado.aumento >= 0 ? 'text-red-600' : 'text-green-700'}`}>
                            {formatCurrency(resultado.aumento)}
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-md border">
                        <div className="text-sm text-slate-500">Novo Valor do Aluguel</div>
                        <div className="font-bold text-indigo-700 text-lg">{formatCurrency(resultado.novoValor)}</div>
                    </div>
                </div>
            )}
            <p className="text-xs text-slate-500 text-center italic mt-4">
                <strong>Atenção:</strong> O índice de reajuste (geralmente IGP-M ou IPCA) deve estar previsto no contrato de locação. Verifique o índice e o valor acumulado nos últimos 12 meses em fontes oficiais (como o site do IBGE ou FGV) para um cálculo preciso.
            </p>
        </div>
    );
};

// --- NEW CALCULATOR for Vacation Pay ---
export const FeriasCalculator = () => {
    const [salarioBruto, setSalarioBruto] = useState('');
    const [diasFerias, setDiasFerias] = useState('30');
    const [venderFerias, setVenderFerias] = useState(false);
    const [resultado, setResultado] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const handleCalculate = () => {
        setError(null);
        setResultado(null);
        const salario = parseFloat(salarioBruto);
        const dias = parseInt(diasFerias);

        if (isNaN(salario) || salario <= 0 || isNaN(dias) || dias <= 0 || dias > 30) {
            setError('Por favor, insira valores válidos. O salário deve ser positivo e os dias de férias entre 1 e 30.');
            return;
        }

        const valorFerias = (salario / 30) * dias;
        const tercoConstitucional = valorFerias / 3;
        
        let abonoPecuniario = 0;
        let tercoSobreAbono = 0;
        if (venderFerias) {
            abonoPecuniario = (salario / 30) * 10;
            tercoSobreAbono = abonoPecuniario / 3;
        }
        
        const baseCalculoINSS = valorFerias + tercoConstitucional;
        let descontoINSS = 0;
        if (baseCalculoINSS > TAX_CONFIG_2024.tetoINSS) {
            descontoINSS = TAX_CONFIG_2024.tetoContribuicaoINSS;
        } else {
            const faixaINSS = TAX_CONFIG_2024.inss.find(f => baseCalculoINSS <= f.teto);
            if (faixaINSS) {
                descontoINSS = (baseCalculoINSS * faixaINSS.aliquota) - faixaINSS.deducao;
            }
        }
        descontoINSS = parseFloat(descontoINSS.toFixed(2));

        const baseCalculoIRRF = baseCalculoINSS - descontoINSS;
        let descontoIRRF = 0;
        const faixaIRRF = TAX_CONFIG_2024.irrf.find(f => baseCalculoIRRF <= f.teto);
        if (faixaIRRF && faixaIRRF.aliquota > 0) {
            descontoIRRF = (baseCalculoIRRF * faixaIRRF.aliquota) - faixaIRRF.parcela;
        }
        descontoIRRF = parseFloat(Math.max(0, descontoIRRF).toFixed(2));

        const totalBruto = valorFerias + tercoConstitucional + abonoPecuniario + tercoSobreAbono;
        const totalLiquido = totalBruto - descontoINSS - descontoIRRF;

        setResultado({
            valorFerias,
            tercoConstitucional,
            abonoPecuniario,
            tercoSobreAbono,
            totalBruto,
            descontoINSS,
            descontoIRRF,
            totalLiquido
        });
    };
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salário Bruto Mensal (R$)</label>
                    <input type="number" value={salarioBruto} onChange={e => setSalarioBruto(e.target.value)} placeholder="Ex: 3000" className="w-full p-2 border rounded-md bg-slate-50 border-slate-300"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dias de Férias</label>
                    <input type="number" value={diasFerias} onChange={e => setDiasFerias(e.target.value)} max="30" min="1" className="w-full p-2 border rounded-md bg-slate-50 border-slate-300"/>
                </div>
            </div>
            <div className="flex items-center">
                <input type="checkbox" id="venderFerias" checked={venderFerias} onChange={e => setVenderFerias(e.target.checked)} className="h-4 w-4 text-indigo-600 rounded"/>
                <label htmlFor="venderFerias" className="ml-2 block text-sm text-gray-900">Vender 10 dias de férias (Abono Pecuniário)?</label>
            </div>
            <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">Calcular Férias</button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Demonstrativo de Férias:</h4>
                     <ul className="space-y-1 text-sm">
                        <li className="flex justify-between p-2 bg-white rounded-md border"><span className="text-slate-600">Férias Brutas</span><span className="font-bold text-green-700">{formatCurrency(resultado.valorFerias)}</span></li>
                        <li className="flex justify-between p-2 bg-white rounded-md border"><span className="text-slate-600">Terço Constitucional</span><span className="font-bold text-green-700">{formatCurrency(resultado.tercoConstitucional)}</span></li>
                        {venderFerias && <>
                        <li className="flex justify-between p-2 bg-white rounded-md border"><span className="text-slate-600">Abono Pecuniário (10 dias)</span><span className="font-bold text-green-700">{formatCurrency(resultado.abonoPecuniario)}</span></li>
                        <li className="flex justify-between p-2 bg-white rounded-md border"><span className="text-slate-600">1/3 sobre Abono</span><span className="font-bold text-green-700">{formatCurrency(resultado.tercoSobreAbono)}</span></li>
                        </>}
                        <li className="flex justify-between p-2 border-t mt-1 pt-2"><span className="text-slate-600 font-semibold">Total Bruto</span><span className="font-bold text-green-700">{formatCurrency(resultado.totalBruto)}</span></li>
                        <li className="flex justify-between p-2 bg-white rounded-md border"><span className="text-slate-600">Desconto INSS</span><span className="font-bold text-red-600">(-) {formatCurrency(resultado.descontoINSS)}</span></li>
                        <li className="flex justify-between p-2 bg-white rounded-md border"><span className="text-slate-600">Desconto IRRF</span><span className="font-bold text-red-600">(-) {formatCurrency(resultado.descontoIRRF)}</span></li>
                         <li className="flex justify-between items-center p-3 bg-indigo-100 rounded-md border-t-2 border-indigo-300 mt-2">
                            <span className="font-bold text-indigo-800">Valor Líquido a Receber</span>
                            <span className="font-extrabold text-xl text-indigo-800">{formatCurrency(resultado.totalLiquido)}</span>
                        </li>
                    </ul>
                </div>
            )}
            <p className="text-xs text-slate-500 text-center italic mt-4">Cálculo estimado. Não inclui adiantamentos, médias de horas extras ou outros adicionais.</p>
        </div>
    );
};

// --- NEW CALCULATOR for 13th Salary ---
export const DecimoTerceiroCalculator = () => {
    const [salarioBruto, setSalarioBruto] = useState('');
    const [mesesTrabalhados, setMesesTrabalhados] = useState('12');
    const [resultado, setResultado] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    const handleCalculate = () => {
        setError(null);
        setResultado(null);
        const salario = parseFloat(salarioBruto);
        const meses = parseInt(mesesTrabalhados);

        if (isNaN(salario) || salario <= 0 || isNaN(meses) || meses < 1 || meses > 12) {
            setError('Por favor, insira valores válidos. Salário deve ser positivo e meses entre 1 e 12.');
            return;
        }

        const decimoTerceiroBruto = (salario / 12) * meses;

        const baseCalculoINSS = decimoTerceiroBruto > TAX_CONFIG_2024.tetoINSS ? TAX_CONFIG_2024.tetoINSS : decimoTerceiroBruto;
        let descontoINSS = 0;
         if (decimoTerceiroBruto > TAX_CONFIG_2024.tetoINSS) {
            descontoINSS = TAX_CONFIG_2024.tetoContribuicaoINSS;
        } else {
            const faixaINSS = TAX_CONFIG_2024.inss.find(f => baseCalculoINSS <= f.teto);
            if (faixaINSS) {
                descontoINSS = (baseCalculoINSS * faixaINSS.aliquota) - faixaINSS.deducao;
            }
        }
        descontoINSS = parseFloat(descontoINSS.toFixed(2));
        
        const baseCalculoIRRF = decimoTerceiroBruto - descontoINSS;
        let descontoIRRF = 0;
        const faixaIRRF = TAX_CONFIG_2024.irrf.find(f => baseCalculoIRRF <= f.teto);
        if (faixaIRRF && faixaIRRF.aliquota > 0) {
            descontoIRRF = (baseCalculoIRRF * faixaIRRF.aliquota) - faixaIRRF.parcela;
        }
        descontoIRRF = parseFloat(Math.max(0, descontoIRRF).toFixed(2));
        
        const decimoTerceiroLiquido = decimoTerceiroBruto - descontoINSS - descontoIRRF;

        setResultado({ decimoTerceiroBruto, descontoINSS, descontoIRRF, decimoTerceiroLiquido });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salário Bruto Mensal (R$)</label>
                    <input type="number" value={salarioBruto} onChange={e => setSalarioBruto(e.target.value)} placeholder="Ex: 3000" className="w-full p-2 border rounded-md bg-slate-50 border-slate-300"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meses Trabalhados no Ano</label>
                    <input type="number" value={mesesTrabalhados} onChange={e => setMesesTrabalhados(e.target.value)} max="12" min="1" className="w-full p-2 border rounded-md bg-slate-50 border-slate-300"/>
                </div>
            </div>
             <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">Calcular 13º Salário</button>
             {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
             {resultado && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                     <h4 className="text-lg font-semibold text-gray-800 mb-3">Demonstrativo do 13º:</h4>
                     <ul className="space-y-1 text-sm">
                        <li className="flex justify-between p-2 bg-white rounded-md border"><span className="text-slate-600">13º Salário Bruto</span><span className="font-bold text-green-700">{formatCurrency(resultado.decimoTerceiroBruto)}</span></li>
                        <li className="flex justify-between p-2 bg-white rounded-md border"><span className="text-slate-600">Desconto INSS</span><span className="font-bold text-red-600">(-) {formatCurrency(resultado.descontoINSS)}</span></li>
                        <li className="flex justify-between p-2 bg-white rounded-md border"><span className="text-slate-600">Desconto IRRF</span><span className="font-bold text-red-600">(-) {formatCurrency(resultado.descontoIRRF)}</span></li>
                         <li className="flex justify-between items-center p-3 bg-indigo-100 rounded-md border-t-2 border-indigo-300 mt-2">
                            <span className="font-bold text-indigo-800">Valor Líquido a Receber</span>
                            <span className="font-extrabold text-xl text-indigo-800">{formatCurrency(resultado.decimoTerceiroLiquido)}</span>
                        </li>
                    </ul>
                </div>
            )}
             <p className="text-xs text-slate-500 text-center italic mt-4">Cálculo estimado. Considera-se mês trabalhado a fração igual ou superior a 15 dias. Não inclui médias de variáveis.</p>
        </div>
    );
};


// --- NEW CALCULATOR for Proportional Rent ---
export const AluguelProporcionalCalculator = () => {
    const [valorAluguel, setValorAluguel] = useState('');
    const [diasOcupados, setDiasOcupados] = useState('');
    const [resultado, setResultado] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    const handleCalculate = () => {
        setError(null);
        setResultado(null);
        const valor = parseFloat(valorAluguel);
        const dias = parseInt(diasOcupados);

        if (isNaN(valor) || valor <= 0 || isNaN(dias) || dias < 0 || dias > 31) {
            setError('Por favor, insira valores válidos. O aluguel deve ser positivo e os dias entre 0 e 31.');
            return;
        }

        const valorDiario = valor / 30; // Convenção de mercado
        const valorProporcional = valorDiario * dias;

        setResultado(valorProporcional);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor Mensal do Aluguel (R$)</label>
                    <input type="number" value={valorAluguel} onChange={e => setValorAluguel(e.target.value)} placeholder="Ex: 2000" className="w-full p-2 border rounded-md bg-slate-50 border-slate-300"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dias de Ocupação no Mês</label>
                    <input type="number" value={diasOcupados} onChange={e => setDiasOcupados(e.target.value)} max="31" min="0" placeholder="Ex: 15" className="w-full p-2 border rounded-md bg-slate-50 border-slate-300"/>
                </div>
            </div>
             <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">Calcular Aluguel Proporcional</button>
             {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
             {resultado !== null && (
                 <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                    <h4 className="text-lg font-semibold text-gray-700">Valor Proporcional a Pagar:</h4>
                    <p className="font-bold text-indigo-700 text-2xl mt-2">{formatCurrency(resultado)}</p>
                </div>
            )}
             <p className="text-xs text-slate-500 text-center italic mt-4">Cálculo baseado na convenção comercial de 30 dias por mês. Condomínio e outras taxas não estão inclusos.</p>
        </div>
    );
};