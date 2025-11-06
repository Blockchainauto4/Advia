import React, { useState, useEffect } from 'react';
// Fix: Remove .tsx extension from imports.
import { TrashIcon, SparklesIcon, PlusIcon } from '../components/Icons';
import { consultarPlacaVeiculo, analisarDadosVeiculo } from '../services/geminiService';


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
