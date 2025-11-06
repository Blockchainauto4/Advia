import React, { useState, useEffect } from 'react';
import { TrashIcon, SparklesIcon, PlusIcon } from '../components/Icons.tsx';
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
            } else {
                 // Fallback for salaries above the highest bracket but below the ceiling
                 descontoFinal = (baseCalculo * 0.14) - 181.18;
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

// --- NEW CALCULATOR for Contribution Time ---
export const TempoDeContribuicaoCalculator = () => {
    const [periods, setPeriods] = useState([{ id: 1, start: '', end: '' }]);
    const [totalTime, setTotalTime] = useState<{ years: number; months: number; days: number } | null>(null);

    const addPeriod = () => {
        setPeriods([...periods, { id: Date.now(), start: '', end: '' }]);
    };

    const removePeriod = (id: number) => {
        setPeriods(periods.filter(p => p.id !== id));
    };

    const handlePeriodChange = (id: number, field: 'start' | 'end', value: string) => {
        setPeriods(periods.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const calculateTotalTime = () => {
        let totalDays = 0;
        for (const period of periods) {
            if (period.start && period.end) {
                const startDate = new Date(period.start);
                const endDate = new Date(period.end);
                
                // Adjust for timezone offset
                startDate.setMinutes(startDate.getMinutes() + startDate.getTimezoneOffset());
                endDate.setMinutes(endDate.getMinutes() + endDate.getTimezoneOffset());

                if (endDate >= startDate) {
                    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive of start and end date
                    totalDays += diffDays;
                }
            }
        }

        const years = Math.floor(totalDays / 365.25);
        const remainingDaysAfterYears = totalDays % 365.25;
        const months = Math.floor(remainingDaysAfterYears / 30.4375);
        const days = Math.round(remainingDaysAfterYears % 30.4375);

        setTotalTime({ years, months, days });
    };

    return (
        <div className="space-y-6">
            {periods.map((period, index) => (
                <div key={period.id} className="flex items-end gap-2 p-3 border rounded-md bg-slate-50">
                    <div className="flex-grow">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Data de Início</label>
                        <input type="date" value={period.start} onChange={e => handlePeriodChange(period.id, 'start', e.target.value)} className="w-full p-2 border rounded-md text-sm"/>
                    </div>
                    <div className="flex-grow">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Data de Fim</label>
                        <input type="date" value={period.end} onChange={e => handlePeriodChange(period.id, 'end', e.target.value)} className="w-full p-2 border rounded-md text-sm"/>
                    </div>
                    {periods.length > 1 && <button onClick={() => removePeriod(period.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-md"><TrashIcon className="w-5 h-5"/></button>}
                </div>
            ))}
            <button onClick={addPeriod} className="w-full flex items-center justify-center text-sm bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-md hover:bg-slate-300">
                <PlusIcon className="w-5 h-5 mr-2" /> Adicionar Período
            </button>
            <button onClick={calculateTotalTime} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">
                Calcular Tempo Total
            </button>
            {totalTime && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Tempo Total de Contribuição</h4>
                    <p className="text-2xl font-bold text-indigo-700">
                        {totalTime.years} anos, {totalTime.months} meses e {totalTime.days} dias
                    </p>
                </div>
            )}
            <p className="text-xs text-slate-500 text-center italic mt-4">
                <strong>Atenção:</strong> Este cálculo é uma estimativa. Fatores como atividades especiais ou períodos concomitantes podem alterar o resultado. Para um cálculo oficial, consulte o INSS.
            </p>
        </div>
    );
};


// --- NEW CALCULATOR for Late Contribution ---
export const ContribuicaoEmAtrasoCalculator = () => {
    const [competencia, setCompetencia] = useState('');
    const [valorContribuicao, setValorContribuicao] = useState('');
    const [dataPagamento, setDataPagamento] = useState(new Date().toISOString().split('T')[0]);
    const [resultado, setResultado] = useState<{ valorOriginal: number; multa: number; juros: number; total: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const handleCalculate = () => {
        setError(null);
        setResultado(null);
        
        const valor = parseFloat(valorContribuicao);
        if (isNaN(valor) || valor <= 0 || !competencia || !dataPagamento) {
            setError('Por favor, preencha todos os campos com valores válidos.');
            return;
        }

        const [ano, mes] = competencia.split('-').map(Number);
        const dataVencimento = new Date(ano, mes, 15); // Vencimento é dia 15 do mês seguinte à competência
        const dataPag = new Date(dataPagamento);
        dataPag.setMinutes(dataPag.getMinutes() + dataPag.getTimezoneOffset());


        if (dataPag <= dataVencimento) {
            setResultado({ valorOriginal: valor, multa: 0, juros: 0, total: valor });
            return;
        }

        // --- SIMULAÇÃO SIMPLIFICADA DE CÁLCULO ---
        // Multa: 0.33% por dia de atraso, limitada a 20%
        const diffTime = dataPag.getTime() - dataVencimento.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        let multaPercentual = diffDays * 0.0033;
        if (multaPercentual > 0.20) multaPercentual = 0.20;
        const multa = valor * multaPercentual;
        
        // Juros: SELIC acumulada (simplificado aqui como 1% ao mês de atraso)
        const mesesAtraso = (dataPag.getFullYear() - dataVencimento.getFullYear()) * 12 + (dataPag.getMonth() - dataVencimento.getMonth());
        const juros = valor * (mesesAtraso * 0.01); // Simplificação
        
        const total = valor + multa + juros;

        setResultado({ valorOriginal: valor, multa, juros, total });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="competencia" className="block text-sm font-medium text-gray-700 mb-1">Mês/Ano da Contribuição</label>
                    <input type="month" id="competencia" value={competencia} onChange={e => setCompetencia(e.target.value)} className="w-full p-2 border rounded-md"/>
                </div>
                <div>
                    <label htmlFor="valorContribuicao" className="block text-sm font-medium text-gray-700 mb-1">Salário de Contribuição (R$)</label>
                    <input type="number" id="valorContribuicao" value={valorContribuicao} onChange={e => setValorContribuicao(e.target.value)} placeholder="Ex: 2000" className="w-full p-2 border rounded-md"/>
                </div>
                 <div>
                    <label htmlFor="dataPagamento" className="block text-sm font-medium text-gray-700 mb-1">Data do Pagamento</label>
                    <input type="date" id="dataPagamento" value={dataPagamento} onChange={e => setDataPagamento(e.target.value)} className="w-full p-2 border rounded-md"/>
                </div>
            </div>
             <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">
                Calcular Acréscimos
            </button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
             {resultado && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
                    <h4 className="text-lg font-semibold text-gray-700">Valores Calculados:</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between p-2 bg-white rounded-md border"><span>Valor Original:</span> <strong>{formatCurrency(resultado.valorOriginal)}</strong></div>
                        <div className="flex justify-between p-2 bg-white rounded-md border"><span>Multa por Atraso:</span> <strong className="text-red-600">{formatCurrency(resultado.multa)}</strong></div>
                        <div className="flex justify-between p-2 bg-white rounded-md border"><span>Juros (SELIC - Simulado):</span> <strong className="text-red-600">{formatCurrency(resultado.juros)}</strong></div>
                        <div className="flex justify-between p-3 bg-indigo-100 rounded-md border border-indigo-200 text-base"><strong>Total a Pagar:</strong> <strong className="text-indigo-800">{formatCurrency(resultado.total)}</strong></div>
                    </div>
                </div>
            )}
             <p className="text-xs text-slate-500 text-center italic mt-4">
                <strong>Atenção:</strong> Este cálculo é uma simulação para fins didáticos. Os valores de juros (SELIC) e multas podem variar. Para emitir a guia oficial (GPS) com os valores exatos, acesse o site da Receita Federal ou do INSS.
            </p>
        </div>
    );
};

// --- NEW CALCULATOR for BPC/LOAS Eligibility ---
export const BpcLoasEligibilityChecker = () => {
    const [step, setStep] = useState(1);
    const [answers, setAnswers] = useState<{ [key: number]: boolean | null }>({
        1: null, // age >= 65
        2: null, // has disability
        3: null, // income <= 1/4 min wage
        4: null, // registered in CadUnico
        5: null, // receives other benefits
    });
    const [result, setResult] = useState<{ status: 'elegivel' | 'inelegivel' | 'analise'; message: string; details: string; } | null>(null);

    const MINIMUM_WAGE = 1412;
    const INCOME_LIMIT = MINIMUM_WAGE / 4;

    const handleAnswer = (step: number, answer: boolean) => {
        const newAnswers = { ...answers, [step]: answer };
        setAnswers(newAnswers);

        // Logic to determine next step or result
        if (step === 1) {
            if (answer) { // Age >= 65
                setStep(3); // Skip to income question
            } else {
                setStep(2); // Ask about disability
            }
        } else if (step === 2) {
            if (answer) { // Has disability
                setStep(3);
            } else {
                // Not 65+ AND no disability = ineligible
                setResult({
                    status: 'inelegivel',
                    message: 'Provavelmente Inelegível',
                    details: 'O BPC/LOAS é destinado a idosos com 65 anos ou mais ou a pessoas com deficiência de qualquer idade. Com base na sua resposta, o critério de idade ou deficiência não foi atendido.',
                });
            }
        } else if (step === 3) {
            if (answer) { // Income OK
                setStep(4);
            } else {
                setResult({
                    status: 'inelegivel',
                    message: 'Provavelmente Inelegível',
                    details: `O critério de renda familiar per capita não foi atendido. Para ser elegível, a renda por pessoa da família deve ser inferior a 1/4 do salário mínimo (aproximadamente ${INCOME_LIMIT.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}).`,
                });
            }
        } else if (step === 4) {
            if (answer) { // CadUnico OK
                setStep(5);
            } else {
                 setResult({
                    status: 'analise',
                    message: 'Requisito Pendente',
                    details: 'A inscrição no CadÚnico (Cadastro Único) é obrigatória para solicitar o BPC/LOAS. Você deve procurar o CRAS (Centro de Referência de Assistência Social) do seu município para realizar o cadastro antes de fazer o pedido no INSS.',
                });
            }
        } else if (step === 5) {
            if (answer) { // Receives other benefits
                setResult({
                    status: 'inelegivel',
                    message: 'Provavelmente Inelegível',
                    details: 'O BPC/LOAS não pode ser acumulado com a maioria dos outros benefícios da Seguridade Social, como aposentadorias e pensões. Se você já recebe outro benefício, provavelmente não é elegível.',
                });
            } else { // All criteria met
                setResult({
                    status: 'elegivel',
                    message: 'Provavelmente Elegível',
                    details: 'Com base nas suas respostas, você parece atender aos critérios básicos para o BPC/LOAS. O próximo passo é reunir a documentação e fazer o requerimento junto ao INSS. A deficiência, se for o caso, passará por perícia médica e social.',
                });
            }
        }
    };

    const handleReset = () => {
        setStep(1);
        setAnswers({ 1: null, 2: null, 3: null, 4: null, 5: null });
        setResult(null);
    };

    const questions: { [key: number]: string } = {
        1: 'A pessoa tem 65 anos de idade ou mais?',
        2: 'A pessoa possui alguma deficiência de longo prazo (física, mental, intelectual ou sensorial) que a impeça de participar plenamente na sociedade em igualdade de condições com as demais pessoas?',
        3: `A renda por pessoa do grupo familiar é igual ou inferior a 1/4 do salário mínimo? (Atualmente, inferior a ${INCOME_LIMIT.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})`,
        4: 'A pessoa e sua família estão inscritas no Cadastro Único (CadÚnico)?',
        5: 'A pessoa recebe algum outro benefício da Seguridade Social ou de outro regime, incluindo seguro-desemprego? (Exceto pensão especial de natureza indenizatória e remuneração de contrato de aprendizagem)',
    };

    const renderQuestion = (step: number) => {
        if (!questions[step]) return null;

        return (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                <p className="font-semibold text-gray-700 mb-4">{questions[step]}</p>
                <div className="flex justify-center gap-4">
                    <button onClick={() => handleAnswer(step, true)} className="bg-green-600 text-white font-bold py-2 px-8 rounded-md hover:bg-green-700">Sim</button>
                    <button onClick={() => handleAnswer(step, false)} className="bg-red-600 text-white font-bold py-2 px-8 rounded-md hover:bg-red-700">Não</button>
                </div>
            </div>
        );
    };

    const renderResult = () => {
        if (!result) return null;
        const colors = {
            elegivel: 'border-green-500 bg-green-50',
            inelegivel: 'border-red-500 bg-red-50',
            analise: 'border-amber-500 bg-amber-50',
        };
        const textColors = {
             elegivel: 'text-green-800',
            inelegivel: 'text-red-800',
            analise: 'text-amber-800',
        }

        return (
             <div className={`p-4 rounded-lg border-l-4 ${colors[result.status]}`}>
                <h4 className={`text-lg font-bold ${textColors[result.status]}`}>{result.message}</h4>
                <p className={`text-sm mt-2 ${textColors[result.status]}`}>{result.details}</p>
                <button onClick={handleReset} className="mt-4 bg-indigo-600 text-white font-semibold text-sm py-2 px-4 rounded-md hover:bg-indigo-700">
                    Fazer Nova Verificação
                </button>
            </div>
        )
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 text-center">Verificador de Elegibilidade BPC/LOAS</h3>
            
            {result ? renderResult() : renderQuestion(step)}
            
            <p className="text-xs text-slate-500 text-center italic mt-4">
                <strong>Atenção:</strong> Este é um verificador preliminar e não substitui a análise oficial do INSS. A elegibilidade depende de comprovação documental, e no caso de deficiência, de avaliação médica e social.
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