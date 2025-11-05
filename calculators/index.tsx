import React, { useState, useEffect } from 'react';
import { TrashIcon } from '../components/Icons';

// --- CALCULATOR COMPONENTS ---

export const SimplesNacionalCalculator = () => {
    const [faturamentoMensal, setFaturamentoMensal] = useState('');
    const [faturamentoAnual, setFaturamentoAnual] = useState('');
    const [resultado, setResultado] = useState<{ aliquotaEfetiva: number | null; valorDoImposto: number | null; } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const anexoIII = [
        { faixa: 1, ate: 180000, aliquota: 0.06, deduzir: 0 },
        { faixa: 2, ate: 360000, aliquota: 0.112, deduzir: 9360 },
        { faixa: 3, ate: 720000, aliquota: 0.135, deduzir: 17640 },
        { faixa: 4, ate: 1800000, aliquota: 0.16, deduzir: 35640 },
        { faixa: 5, ate: 3600000, aliquota: 0.21, deduzir: 125640 },
        { faixa: 6, ate: 4800000, aliquota: 0.33, deduzir: 648000 },
    ];

    const handleCalculate = () => {
        setError(null);
        setResultado(null);

        const rbt12 = parseFloat(faturamentoAnual);
        const receitaMensal = parseFloat(faturamentoMensal);

        if (isNaN(rbt12) || isNaN(receitaMensal) || rbt12 <= 0 || receitaMensal < 0) {
            setError('Por favor, insira valores numéricos válidos e positivos.');
            return;
        }

        if (rbt12 > 4800000) {
            setError('O faturamento anual (RBT12) não pode exceder R$ 4.800.000,00 para o Simples Nacional.');
            return;
        }

        const faixa = anexoIII.find(f => rbt12 <= f.ate);
        if (!faixa) {
             setError('Não foi possível encontrar a faixa de tributação para o valor informado.');
             return;
        }

        const aliquotaEfetiva = ((rbt12 * faixa.aliquota) - faixa.deduzir) / rbt12;
        const valorDoImposto = receitaMensal * aliquotaEfetiva;
        
        setResultado({ aliquotaEfetiva, valorDoImposto });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="faturamentoMensal" className="block text-sm font-medium text-gray-700 mb-1">Faturamento Bruto Mensal (R$)</label>
                    <input type="number" id="faturamentoMensal" value={faturamentoMensal} onChange={e => setFaturamentoMensal(e.target.value)} placeholder="Ex: 5000" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
                 <div>
                    <label htmlFor="faturamentoAnual" className="block text-sm font-medium text-gray-700 mb-1">Receita Bruta últimos 12 meses (R$)</label>
                    <input type="number" id="faturamentoAnual" value={faturamentoAnual} onChange={e => setFaturamentoAnual(e.target.value)} placeholder="Ex: 60000" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
            </div>
             <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Calcular
            </button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Resultado Estimado:</h4>
                    <div className="space-y-2">
                         <div className="flex justify-between">
                            <span className="text-gray-600">Alíquota Efetiva:</span>
                            <span className="font-bold text-indigo-700">{(resultado.aliquotaEfetiva * 100).toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-lg">Valor do Imposto (DAS):</span>
                            <span className="font-bold text-indigo-700 text-xl">{resultado.valorDoImposto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                    </div>
                </div>
            )}
             <p className="text-xs text-slate-500 text-center italic mt-4">
                <strong>Atenção:</strong> Este é um cálculo simplificado e serve apenas para fins de estimativa. Fatores como a folha de pagamento (Fator "r") podem alterar o anexo de tributação. Consulte sempre um contador profissional.
            </p>
        </div>
    );
};

export const HorasExtrasCalculator = () => {
    const [salarioBruto, setSalarioBruto] = useState('');
    const [cargaHoraria, setCargaHoraria] = useState('220');
    const [horas50, setHoras50] = useState('');
    const [horas100, setHoras100] = useState('');
    const [diasUteis, setDiasUteis] = useState('');
    const [domingosFeriados, setDomingosFeriados] = useState('');

    const [resultado, setResultado] = useState<{
        valorHoraNormal: number;
        totalValorHorasExtras: number;
        dsrSobreHorasExtras: number;
        totalBruto: number;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        setError(null);
        setResultado(null);

        const inputs = {
            salario: parseFloat(salarioBruto),
            carga: parseInt(cargaHoraria, 10),
            h50: parseFloat(horas50 || '0'),
            h100: parseFloat(horas100 || '0'),
            uteis: parseInt(diasUteis, 10),
            dsrDias: parseInt(domingosFeriados, 10),
        };

        if (Object.values(inputs).some(v => isNaN(v)) || inputs.salario <= 0 || inputs.carga <= 0 || inputs.uteis <= 0 || inputs.dsrDias < 0) {
            setError('Por favor, preencha todos os campos com valores numéricos válidos e positivos.');
            return;
        }

        const valorHoraNormal = inputs.salario / inputs.carga;
        const valorHoraExtra50 = valorHoraNormal * 1.5;
        const valorHoraExtra100 = valorHoraNormal * 2.0;

        const totalHorasExtras50 = inputs.h50 * valorHoraExtra50;
        const totalHorasExtras100 = inputs.h100 * valorHoraExtra100;
        
        const totalValorHorasExtras = totalHorasExtras50 + totalHorasExtras100;

        const dsrSobreHorasExtras = (totalValorHorasExtras / inputs.uteis) * inputs.dsrDias;
        
        const totalBruto = totalValorHorasExtras + dsrSobreHorasExtras;

        setResultado({
            valorHoraNormal,
            totalValorHorasExtras,
            dsrSobreHorasExtras,
            totalBruto
        });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="salarioBruto" className="block text-sm font-medium text-gray-700 mb-1">Salário Bruto Mensal (R$)</label>
                    <input type="number" id="salarioBruto" value={salarioBruto} onChange={e => setSalarioBruto(e.target.value)} placeholder="Ex: 2500" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
                 <div>
                    <label htmlFor="cargaHoraria" className="block text-sm font-medium text-gray-700 mb-1">Carga Horária Mensal</label>
                    <input type="number" id="cargaHoraria" value={cargaHoraria} onChange={e => setCargaHoraria(e.target.value)} placeholder="Ex: 220" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
                 <div>
                    <label htmlFor="horas50" className="block text-sm font-medium text-gray-700 mb-1">Horas extras com 50%</label>
                    <input type="number" id="horas50" value={horas50} onChange={e => setHoras50(e.target.value)} placeholder="Ex: 10" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
                 <div>
                    <label htmlFor="horas100" className="block text-sm font-medium text-gray-700 mb-1">Horas extras com 100%</label>
                    <input type="number" id="horas100" value={horas100} onChange={e => setHoras100(e.target.value)} placeholder="Ex: 2" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
                 <div>
                    <label htmlFor="diasUteis" className="block text-sm font-medium text-gray-700 mb-1">Dias úteis no mês</label>
                    <input type="number" id="diasUteis" value={diasUteis} onChange={e => setDiasUteis(e.target.value)} placeholder="Ex: 22" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
                 <div>
                    <label htmlFor="domingosFeriados" className="block text-sm font-medium text-gray-700 mb-1">Domingos e feriados</label>
                    <input type="number" id="domingosFeriados" value={domingosFeriados} onChange={e => setDomingosFeriados(e.target.value)} placeholder="Ex: 8" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
            </div>
             <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Calcular
            </button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Resultado Estimado:</h4>
                    <div className="space-y-2">
                         <div className="flex justify-between">
                            <span className="text-gray-600">Valor da hora normal:</span>
                            <span className="font-bold text-gray-800">{resultado.valorHoraNormal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total em horas extras:</span>
                            <span className="font-bold text-gray-800">{resultado.totalValorHorasExtras.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Reflexo no DSR:</span>
                            <span className="font-bold text-gray-800">{resultado.dsrSobreHorasExtras.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                         <hr className="my-2 border-slate-300"/>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-lg">Total Bruto a Receber:</span>
                            <span className="font-bold text-indigo-700 text-xl">{resultado.totalBruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                    </div>
                </div>
            )}
             <p className="text-xs text-slate-500 text-center italic mt-4">
                <strong>Atenção:</strong> Este cálculo é uma estimativa. Não inclui descontos de INSS, IRRF ou outros adicionais (noturno, periculosidade, etc.). Consulte sempre um profissional.
            </p>
        </div>
    );
};

export const RescisaoContratualCalculator = () => {
    const [salarioBruto, setSalarioBruto] = useState('');
    const [dataAdmissao, setDataAdmissao] = useState('');
    const [dataDemissao, setDataDemissao] = useState('');
    const [motivo, setMotivo] = useState('sem_justa_causa');
    const [avisoPrevio, setAvisoPrevio] = useState('indenizado');
    const [temFeriasVencidas, setTemFeriasVencidas] = useState(false);
    const [saldoFgts, setSaldoFgts] = useState('');
    const [resultado, setResultado] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    const calcularINSS = (base: number) => {
        if (base <= 0) return 0;
        const faixas = [
            { teto: 1412.00, aliquota: 0.075, deducao: 0 },
            { teto: 2666.68, aliquota: 0.09, deducao: 21.18 },
            { teto: 4000.03, aliquota: 0.12, deducao: 101.18 },
            { teto: 7786.02, aliquota: 0.14, deducao: 181.18 },
        ];
        const tetoContribuicao = 908.85;
        if (base > faixas[3].teto) return tetoContribuicao;
        const faixaAplicavel = faixas.find(f => base <= f.teto);
        if (faixaAplicavel) {
            return (base * faixaAplicavel.aliquota) - faixaAplicavel.deducao;
        }
        return tetoContribuicao; // Should not happen if base <= teto
    };

    const handleCalculate = () => {
        setError(null);
        setResultado(null);
        
        const salario = parseFloat(salarioBruto);
        const fgts = parseFloat(saldoFgts);

        if (isNaN(salario) || salario <= 0 || !dataAdmissao || !dataDemissao || (motivo === 'sem_justa_causa' && isNaN(fgts))) {
            setError('Preencha todos os campos obrigatórios com valores válidos.');
            return;
        }

        const admissao = new Date(dataAdmissao + 'T00:00:00');
        const demissao = new Date(dataDemissao + 'T00:00:00');

        if (admissao >= demissao) {
            setError('A data de demissão deve ser posterior à data de admissão.');
            return;
        }

        const diasTrabalhadosMes = demissao.getDate();
        const saldoDeSalario = (salario / 30) * diasTrabalhadosMes;
        
        const mesesTrabalhadosAno = demissao.getMonth() + (diasTrabalhadosMes > 14 ? 1 : 0);
        const decimoTerceiro = (salario / 12) * mesesTrabalhadosAno;

        const umDia = 24 * 60 * 60 * 1000;
        const diffDias = Math.round(Math.abs((admissao.getTime() - demissao.getTime()) / umDia));
        const mesesContrato = Math.floor(diffDias / 30);
        const mesesAquisitivos = (mesesContrato % 12) + ( (diffDias % 30) > 14 ? 1 : 0);
        
        const feriasProporcionais = (salario / 12) * mesesAquisitivos;
        const umTercoFeriasProporcionais = feriasProporcionais / 3;

        let verbas = { saldoDeSalario, decimoTerceiro, feriasProporcionais, umTercoFeriasProporcionais, feriasVencidas: 0, umTercoFeriasVencidas: 0, avisoPrevio: 0, multaFgts: 0 };
        let deducoes = { inss: 0, inss13: 0, avisoPrevioDesconto: 0 };
        
        deducoes.inss = calcularINSS(saldoDeSalario);
        deducoes.inss13 = calcularINSS(decimoTerceiro);

        if (temFeriasVencidas) {
            verbas.feriasVencidas = salario;
            verbas.umTercoFeriasVencidas = salario / 3;
        }

        if (motivo === 'sem_justa_causa') {
            if (avisoPrevio === 'indenizado') verbas.avisoPrevio = salario;
            verbas.multaFgts = fgts * 0.4;
        } else if (motivo === 'pedido_demissao') {
            if (avisoPrevio !== 'trabalhado') deducoes.avisoPrevioDesconto = salario;
            verbas.multaFgts = 0;
        } else if (motivo === 'justa_causa') {
             verbas = { saldoDeSalario, decimoTerceiro: 0, feriasProporcionais: 0, umTercoFeriasProporcionais: 0, feriasVencidas: temFeriasVencidas ? salario : 0, umTercoFeriasVencidas: temFeriasVencidas ? salario/3: 0, avisoPrevio: 0, multaFgts: 0 };
             deducoes.inss13 = 0;
        }

        const totalVerbas = Object.values(verbas).reduce((a, b) => a + b, 0);
        const totalDeducoes = Object.values(deducoes).reduce((a, b) => a + b, 0);
        const totalLiquido = totalVerbas - totalDeducoes;

        setResultado({ ...verbas, ...deducoes, totalVerbas, totalDeducoes, totalLiquido });
    };

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Último Salário Bruto (R$)</label>
                    <input type="number" value={salarioBruto} onChange={e => setSalarioBruto(e.target.value)} placeholder="Ex: 3000" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Saldo FGTS para multa (R$)</label>
                    <input type="number" value={saldoFgts} onChange={e => setSaldoFgts(e.target.value)} placeholder="Ex: 5000" disabled={motivo !== 'sem_justa_causa'} className="w-full px-3 py-2 bg-slate-50 border rounded-md disabled:bg-slate-200"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Admissão</label>
                    <input type="date" value={dataAdmissao} onChange={e => setDataAdmissao(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Demissão</label>
                    <input type="date" value={dataDemissao} onChange={e => setDataDemissao(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Motivo da Rescisão</label>
                    <select value={motivo} onChange={e => setMotivo(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-md">
                        <option value="sem_justa_causa">Demissão sem justa causa</option>
                        <option value="pedido_demissao">Pedido de demissão</option>
                        <option value="justa_causa">Demissão por justa causa</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Aviso Prévio</label>
                    <select value={avisoPrevio} onChange={e => setAvisoPrevio(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-md">
                        <option value="indenizado">Indenizado</option>
                        <option value="trabalhado">Trabalhado</option>
                        <option value="dispensado">Dispensado</option>
                    </select>
                </div>
                 <div className="sm:col-span-2 flex items-center">
                    <input type="checkbox" id="feriasVencidas" checked={temFeriasVencidas} onChange={e => setTemFeriasVencidas(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                    <label htmlFor="feriasVencidas" className="ml-2 block text-sm text-gray-900">Possui férias vencidas (não gozadas)?</label>
                </div>
            </div>
            <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">Calcular</button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado && (
                <div className="bg-slate-50 p-4 rounded-lg border">
                    <h4 className="text-lg font-semibold text-gray-700 mb-3">Resultado da Rescisão:</h4>
                    <div className="space-y-4">
                        <div>
                            <h5 className="font-semibold text-gray-600">Verbas Rescisórias</h5>
                            <ul className="text-sm text-gray-800 space-y-1 mt-1 pl-2">
                                <li className="flex justify-between"><span>Saldo de Salário:</span> <span>{formatCurrency(resultado.saldoDeSalario)}</span></li>
                                {resultado.avisoPrevio > 0 && <li className="flex justify-between"><span>Aviso Prévio Indenizado:</span> <span>{formatCurrency(resultado.avisoPrevio)}</span></li>}
                                {resultado.decimoTerceiro > 0 && <li className="flex justify-between"><span>13º Salário Proporcional:</span> <span>{formatCurrency(resultado.decimoTerceiro)}</span></li>}
                                {resultado.feriasVencidas > 0 && <li className="flex justify-between"><span>Férias Vencidas + 1/3:</span> <span>{formatCurrency(resultado.feriasVencidas + resultado.umTercoFeriasVencidas)}</span></li>}
                                {resultado.feriasProporcionais > 0 && <li className="flex justify-between"><span>Férias Proporcionais + 1/3:</span> <span>{formatCurrency(resultado.feriasProporcionais + resultado.umTercoFeriasProporcionais)}</span></li>}
                                {resultado.multaFgts > 0 && <li className="flex justify-between"><span>Multa 40% FGTS:</span> <span>{formatCurrency(resultado.multaFgts)}</span></li>}
                                <li className="flex justify-between font-bold border-t pt-1 mt-1"><span>Total de Verbas:</span> <span>{formatCurrency(resultado.totalVerbas)}</span></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-semibold text-gray-600">Deduções</h5>
                             <ul className="text-sm text-red-700 space-y-1 mt-1 pl-2">
                                {resultado.inss > 0 && <li className="flex justify-between"><span>INSS sobre Saldo de Salário:</span> <span>- {formatCurrency(resultado.inss)}</span></li>}
                                {resultado.inss13 > 0 && <li className="flex justify-between"><span>INSS sobre 13º Salário:</span> <span>- {formatCurrency(resultado.inss13)}</span></li>}
                                {resultado.avisoPrevioDesconto > 0 && <li className="flex justify-between"><span>Aviso Prévio (Pedido de Demissão):</span> <span>- {formatCurrency(resultado.avisoPrevioDesconto)}</span></li>}
                                <li className="flex justify-between font-bold border-t pt-1 mt-1"><span>Total de Deduções:</span> <span>- {formatCurrency(resultado.totalDeducoes)}</span></li>
                            </ul>
                        </div>
                        <div className="flex justify-between items-center bg-white p-3 rounded-md border text-lg">
                            <span className="font-bold text-gray-800">Total Líquido a Receber:</span>
                            <span className="font-bold text-indigo-700">{formatCurrency(resultado.totalLiquido)}</span>
                        </div>
                    </div>
                     <p className="text-xs text-slate-500 text-center italic mt-4">
                        <strong>Atenção:</strong> Cálculo estimado. Não inclui IRRF e outras variáveis. Consulte sempre um profissional.
                    </p>
                </div>
            )}
        </div>
    );
};

export const PrazosCPCCalculator = () => {
    const [startDate, setStartDate] = useState('');
    const [days, setDays] = useState('');
    const [resultDate, setResultDate] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        setError(null);
        setResultDate(null);

        // Adiciona T00:00:00 para evitar problemas de fuso horário
        const initialDate = new Date(startDate + 'T00:00:00');
        const prazoEmDias = parseInt(days, 10);

        if (!startDate || isNaN(initialDate.getTime())) {
            setError('Por favor, insira uma data de início válida.');
            return;
        }

        if (isNaN(prazoEmDias) || prazoEmDias <= 0) {
            setError('Por favor, insira um número de dias válido e positivo.');
            return;
        }

        let diasUteisContados = 0;
        let dataAtual = new Date(initialDate.getTime());

        while (diasUteisContados < prazoEmDias) {
            dataAtual.setDate(dataAtual.getDate() + 1);
            
            const diaDaSemana = dataAtual.getDay();
            const mes = dataAtual.getMonth(); // 0 = Janeiro, 11 = Dezembro
            const diaDoMes = dataAtual.getDate();

            // Pula fins de semana (Sábado = 6, Domingo = 0)
            if (diaDaSemana === 0 || diaDaSemana === 6) {
                continue;
            }
            
            // Pula recesso forense (20 de Dezembro a 20 de Janeiro) - Art. 220 CPC
            if ((mes === 11 && diaDoMes >= 20) || (mes === 0 && diaDoMes <= 20)) {
                continue;
            }

            diasUteisContados++;
        }
        
        setResultDate(dataAtual.toLocaleDateString('pt-BR', {timeZone: 'UTC'}));
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Data de Início (ou da publicação)</label>
                    <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
                 <div>
                    <label htmlFor="prazoDias" className="block text-sm font-medium text-gray-700 mb-1">Prazo em Dias Úteis</label>
                    <input type="number" id="prazoDias" value={days} onChange={e => setDays(e.target.value)} placeholder="Ex: 15" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
            </div>
             <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Calcular Prazo Final
            </button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultDate && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                    <h4 className="text-lg font-semibold text-gray-700 mb-1">Data Final do Prazo:</h4>
                    <p className="font-bold text-indigo-700 text-2xl">{resultDate}</p>
                </div>
            )}
             <p className="text-xs text-slate-500 text-center italic mt-4">
                <strong>Atenção:</strong> O cálculo considera dias úteis e o recesso forense (20/12 a 20/01) conforme o CPC/2015. Feriados locais, nacionais e alterações de expediente não são considerados. Verifique sempre o calendário do seu tribunal.
            </p>
        </div>
    );
};

export const PrazosFazendaPublicaCalculator = () => {
    const [startDate, setStartDate] = useState('');
    const [days, setDays] = useState('');
    const [resultDate, setResultDate] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        setError(null);
        setResultDate(null);

        const initialDate = new Date(startDate + 'T00:00:00');
        const prazoOriginalEmDias = parseInt(days, 10);

        if (!startDate || isNaN(initialDate.getTime())) {
            setError('Por favor, insira uma data de início válida.');
            return;
        }

        if (isNaN(prazoOriginalEmDias) || prazoOriginalEmDias <= 0) {
            setError('Por favor, insira um número de dias válido e positivo.');
            return;
        }

        const prazoEmDias = prazoOriginalEmDias * 2; // Dobra o prazo

        let diasUteisContados = 0;
        let dataAtual = new Date(initialDate.getTime());

        while (diasUteisContados < prazoEmDias) {
            dataAtual.setDate(dataAtual.getDate() + 1);
            
            const diaDaSemana = dataAtual.getDay();
            const mes = dataAtual.getMonth();
            const diaDoMes = dataAtual.getDate();

            if (diaDaSemana === 0 || diaDaSemana === 6) { // Pula fins de semana
                continue;
            }
            
            if ((mes === 11 && diaDoMes >= 20) || (mes === 0 && diaDoMes <= 20)) { // Pula recesso
                continue;
            }

            diasUteisContados++;
        }
        
        setResultDate(dataAtual.toLocaleDateString('pt-BR', {timeZone: 'UTC'}));
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="startDateFP" className="block text-sm font-medium text-gray-700 mb-1">Data de Início (publicação)</label>
                    <input type="date" id="startDateFP" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
                 <div>
                    <label htmlFor="prazoDiasFP" className="block text-sm font-medium text-gray-700 mb-1">Prazo em Dias (sem dobrar)</label>
                    <input type="number" id="prazoDiasFP" value={days} onChange={e => setDays(e.target.value)} placeholder="Ex: 15" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
            </div>
             <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Calcular Prazo Final
            </button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultDate && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                    <h4 className="text-lg font-semibold text-gray-700 mb-1">Data Final do Prazo:</h4>
                    <p className="font-bold text-indigo-700 text-2xl">{resultDate}</p>
                    {days && !isNaN(parseInt(days)) && parseInt(days) > 0 &&
                        <p className="text-xs text-slate-600 mt-1">(Prazo original de {days} dias, calculado em dobro: {parseInt(days) * 2} dias úteis)</p>
                    }
                </div>
            )}
             <p className="text-xs text-slate-500 text-center italic mt-4">
                <strong>Atenção:</strong> O cálculo aplica automaticamente o <strong>prazo em dobro</strong> (Art. 183, CPC). Considera dias úteis e o recesso forense. Feriados e suspensões de expediente devem ser verificados no calendário do tribunal.
            </p>
        </div>
    );
};

export const PrazosPenaisCalculator = () => {
    const [startDate, setStartDate] = useState('');
    const [days, setDays] = useState('');
    const [resultDate, setResultDate] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        setError(null);
        setResultDate(null);

        const initialDate = new Date(startDate + 'T00:00:00');
        const prazoEmDias = parseInt(days, 10);

        if (!startDate || isNaN(initialDate.getTime())) {
            setError('Por favor, insira uma data de início válida.');
            return;
        }

        if (isNaN(prazoEmDias) || prazoEmDias <= 0) {
            setError('Por favor, insira um número de dias válido e positivo.');
            return;
        }

        const dataFinal = new Date(initialDate.getTime());
        // No processo penal, a contagem é em dias corridos.
        // Art. 798. Todos os prazos correrão em cartório e serão contínuos e peremptórios, não se interrompendo por férias, domingo ou dia feriado.
        // § 1o Não se computará no prazo o dia do começo, incluindo-se, porém, o do vencimento.
        // Adicionar o número de dias diretamente à data de início/ciência cumpre essa regra.
        dataFinal.setDate(dataFinal.getDate() + prazoEmDias);
        
        setResultDate(dataFinal.toLocaleDateString('pt-BR', {timeZone: 'UTC'}));
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="startDateCPP" className="block text-sm font-medium text-gray-700 mb-1">Data de Início (intimação/ciência)</label>
                    <input type="date" id="startDateCPP" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
                 <div>
                    <label htmlFor="prazoDiasCPP" className="block text-sm font-medium text-gray-700 mb-1">Prazo em Dias Corridos</label>
                    <input type="number" id="prazoDiasCPP" value={days} onChange={e => setDays(e.target.value)} placeholder="Ex: 5" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
            </div>
             <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Calcular Prazo Final
            </button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultDate && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                    <h4 className="text-lg font-semibold text-gray-700 mb-1">Data Final do Prazo:</h4>
                    <p className="font-bold text-indigo-700 text-2xl">{resultDate}</p>
                </div>
            )}
             <p className="text-xs text-slate-500 text-center italic mt-4">
                <strong>Atenção:</strong> Prazos penais são contados em <strong>dias corridos</strong>, incluindo fins de semana e feriados (Art. 798, CPP). O dia do começo é excluído e o do vencimento é incluído. Se o vencimento cair em dia não útil, prorroga-se para o próximo dia útil (regra não calculada aqui). Verifique sempre o expediente forense.
            </p>
        </div>
    );
};

export const PrazosCLTCalculator = () => {
    const [startDate, setStartDate] = useState('');
    const [days, setDays] = useState('');
    const [resultDate, setResultDate] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        setError(null);
        setResultDate(null);

        const initialDate = new Date(startDate + 'T00:00:00');
        const prazoEmDias = parseInt(days, 10);

        if (!startDate || isNaN(initialDate.getTime())) {
            setError('Por favor, insira uma data de início válida.');
            return;
        }

        if (isNaN(prazoEmDias) || prazoEmDias <= 0) {
            setError('Por favor, insira um número de dias válido e positivo.');
            return;
        }

        let diasUteisContados = 0;
        let dataAtual = new Date(initialDate.getTime());

        while (diasUteisContados < prazoEmDias) {
            dataAtual.setDate(dataAtual.getDate() + 1);
            
            const diaDaSemana = dataAtual.getDay();
            const mes = dataAtual.getMonth(); // 0 = Janeiro, 11 = Dezembro
            const diaDoMes = dataAtual.getDate();

            // Pula fins de semana (Sábado = 6, Domingo = 0)
            if (diaDaSemana === 0 || diaDaSemana === 6) {
                continue;
            }
            
            // Pula recesso (20 de Dezembro a 20 de Janeiro) - Art. 775-A da CLT
            if ((mes === 11 && diaDoMes >= 20) || (mes === 0 && diaDoMes <= 20)) {
                continue;
            }

            diasUteisContados++;
        }
        
        setResultDate(dataAtual.toLocaleDateString('pt-BR', {timeZone: 'UTC'}));
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="startDateCLT" className="block text-sm font-medium text-gray-700 mb-1">Data de Início (ciência/notificação)</label>
                    <input type="date" id="startDateCLT" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
                 <div>
                    <label htmlFor="prazoDiasCLT" className="block text-sm font-medium text-gray-700 mb-1">Prazo em Dias Úteis</label>
                    <input type="number" id="prazoDiasCLT" value={days} onChange={e => setDays(e.target.value)} placeholder="Ex: 8" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
            </div>
             <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Calcular Prazo Final
            </button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultDate && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                    <h4 className="text-lg font-semibold text-gray-700 mb-1">Data Final do Prazo:</h4>
                    <p className="font-bold text-indigo-700 text-2xl">{resultDate}</p>
                </div>
            )}
             <p className="text-xs text-slate-500 text-center italic mt-4">
                <strong>Atenção:</strong> O cálculo considera dias úteis e o recesso da justiça do trabalho (20/12 a 20/01), conforme Art. 775 da CLT. Feriados locais, nacionais e alterações de expediente não são considerados. Verifique sempre o calendário do seu TRT.
            </p>
        </div>
    );
};

export const PrazosJECCalculator = () => {
    const [startDate, setStartDate] = useState('');
    const [days, setDays] = useState('');
    const [resultDate, setResultDate] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        setError(null);
        setResultDate(null);

        const initialDate = new Date(startDate + 'T00:00:00');
        const prazoEmDias = parseInt(days, 10);

        if (!startDate || isNaN(initialDate.getTime())) {
            setError('Por favor, insira uma data de início válida.');
            return;
        }

        if (isNaN(prazoEmDias) || prazoEmDias <= 0) {
            setError('Por favor, insira um número de dias válido e positivo.');
            return;
        }

        let diasUteisContados = 0;
        let dataAtual = new Date(initialDate.getTime());

        while (diasUteisContados < prazoEmDias) {
            dataAtual.setDate(dataAtual.getDate() + 1);
            
            const diaDaSemana = dataAtual.getDay();
            const mes = dataAtual.getMonth(); // 0 = Janeiro, 11 = Dezembro
            const diaDoMes = dataAtual.getDate();

            // Pula fins de semana (Sábado = 6, Domingo = 0)
            if (diaDaSemana === 0 || diaDaSemana === 6) {
                continue;
            }
            
            // Pula recesso forense (20 de Dezembro a 20 de Janeiro)
            if ((mes === 11 && diaDoMes >= 20) || (mes === 0 && diaDoMes <= 20)) {
                continue;
            }

            diasUteisContados++;
        }
        
        setResultDate(dataAtual.toLocaleDateString('pt-BR', {timeZone: 'UTC'}));
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="startDateJEC" className="block text-sm font-medium text-gray-700 mb-1">Data de Início (ciência)</label>
                    <input type="date" id="startDateJEC" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
                 <div>
                    <label htmlFor="prazoDiasJEC" className="block text-sm font-medium text-gray-700 mb-1">Prazo em Dias Úteis</label>
                    <input type="number" id="prazoDiasJEC" value={days} onChange={e => setDays(e.target.value)} placeholder="Ex: 10" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
            </div>
             <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Calcular Prazo Final
            </button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultDate && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                    <h4 className="text-lg font-semibold text-gray-700 mb-1">Data Final do Prazo:</h4>
                    <p className="font-bold text-indigo-700 text-2xl">{resultDate}</p>
                </div>
            )}
             <p className="text-xs text-slate-500 text-center italic mt-4">
                <strong>Atenção:</strong> O cálculo considera <strong>dias úteis</strong>, conforme Enunciado 165 do FONAJE, e o recesso forense (20/12 a 20/01). Feriados locais e suspensões de expediente devem ser verificados no calendário do tribunal.
            </p>
        </div>
    );
};

export const CorrecaoMonetariaCalculator = () => {
    const [valorOriginal, setValorOriginal] = useState('');
    const [dataInicial, setDataInicial] = useState('');
    const [dataFinal, setDataFinal] = useState('');
    const [indiceCorrecao, setIndiceCorrecao] = useState('');
    const [taxaJuros, setTaxaJuros] = useState('1'); // Padrão 1% a.m.
    const [tipoJuros, setTipoJuros] = useState('simples');

    const [resultado, setResultado] = useState<{
        valorCorrigido: number;
        valorJuros: number;
        valorTotal: number;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        setError(null);
        setResultado(null);

        const valor = parseFloat(valorOriginal);
        const indiceMensal = parseFloat(indiceCorrecao) / 100;
        const jurosMensal = parseFloat(taxaJuros) / 100;

        if (isNaN(valor) || valor <= 0 || isNaN(indiceMensal) || indiceMensal < 0 || isNaN(jurosMensal) || jurosMensal < 0 || !dataInicial || !dataFinal) {
            setError('Preencha todos os campos com valores válidos.');
            return;
        }

        const dInicial = new Date(dataInicial + 'T00:00:00');
        const dFinal = new Date(dataFinal + 'T00:00:00');

        if (dInicial >= dFinal) {
            setError('A data final deve ser posterior à data inicial.');
            return;
        }

        const meses = (dFinal.getFullYear() - dInicial.getFullYear()) * 12 + (dFinal.getMonth() - dInicial.getMonth());
        
        if (meses < 0) {
             setError('Ocorreu um erro no cálculo dos meses. Verifique as datas.');
             return;
        }

        // 1. Corrigir o valor principal
        const valorCorrigido = valor * Math.pow((1 + indiceMensal), meses);

        // 2. Calcular juros sobre o valor CORRIGIDO
        let totalJuros = 0;
        if (tipoJuros === 'simples') {
            totalJuros = valorCorrigido * jurosMensal * meses;
        } else { // compostos
            totalJuros = valorCorrigido * (Math.pow((1 + jurosMensal), meses) - 1);
        }

        // 3. Valor total é o valor corrigido + juros
        const valorTotal = valorCorrigido + totalJuros;

        setResultado({
            valorCorrigido: valorCorrigido,
            valorJuros: totalJuros,
            valorTotal,
        });
    };

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor Original (R$)</label>
                    <input type="number" value={valorOriginal} onChange={e => setValorOriginal(e.target.value)} placeholder="Ex: 1000" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Índice de Correção Mensal (%)</label>
                    <input type="number" value={indiceCorrecao} onChange={e => setIndiceCorrecao(e.target.value)} placeholder="Ex: 0.5" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
                    <input type="date" value={dataInicial} onChange={e => setDataInicial(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
                    <input type="date" value={dataFinal} onChange={e => setDataFinal(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Taxa de Juros Mensal (%)</label>
                    <input type="number" value={taxaJuros} onChange={e => setTaxaJuros(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Juros</label>
                    <select value={tipoJuros} onChange={e => setTipoJuros(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-md">
                        <option value="simples">Juros Simples</option>
                        <option value="compostos">Juros Compostos</option>
                    </select>
                </div>
            </div>
            <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">Calcular</button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado && (
                <div className="bg-slate-50 p-4 rounded-lg border">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Resultado do Cálculo:</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Principal Corrigido:</span>
                            <span className="font-bold text-gray-800">{formatCurrency(resultado.valorCorrigido)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Valor dos Juros:</span>
                            <span className="font-bold text-gray-800">{formatCurrency(resultado.valorJuros)}</span>
                        </div>
                        <hr className="my-2 border-slate-300"/>
                        <div className="flex justify-between items-center text-lg">
                            <span className="font-bold text-gray-800">Valor Total Devido:</span>
                            <span className="font-bold text-indigo-700">{formatCurrency(resultado.valorTotal)}</span>
                        </div>
                    </div>
                </div>
            )}
            <p className="text-xs text-slate-500 text-center italic mt-4">
                <strong>Atenção:</strong> Este cálculo é uma estimativa. Os juros foram calculados sobre o valor principal já corrigido monetariamente. Para obter o valor exato, utilize os índices oficiais (IGP-M, IPCA, etc.) e consulte a legislação aplicável ou um contador.
            </p>
        </div>
    );
};

export const MultaJurosCalculator = () => {
    const [valorOriginal, setValorOriginal] = useState('');
    const [dataVencimento, setDataVencimento] = useState('');
    const [dataPagamento, setDataPagamento] = useState('');
    const [percentualMulta, setPercentualMulta] = useState('2');
    const [percentualJuros, setPercentualJuros] = useState('1');

    const [resultado, setResultado] = useState<{
        valorMulta: number;
        valorJuros: number;
        valorTotal: number;
        diasAtraso: number;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const handleCalculate = () => {
        setError(null);
        setResultado(null);

        const valor = parseFloat(valorOriginal);
        const multaPerc = parseFloat(percentualMulta) / 100;
        const jurosPerc = parseFloat(percentualJuros) / 100;

        if (isNaN(valor) || valor <= 0 || isNaN(multaPerc) || isNaN(jurosPerc) || !dataVencimento || !dataPagamento) {
            setError('Preencha todos os campos com valores válidos.');
            return;
        }

        const dVencimento = new Date(dataVencimento + 'T00:00:00');
        const dPagamento = new Date(dataPagamento + 'T00:00:00');

        if (dPagamento <= dVencimento) {
            setResultado({ valorMulta: 0, valorJuros: 0, valorTotal: valor, diasAtraso: 0 });
            return;
        }

        const umDia = 1000 * 60 * 60 * 24;
        const diasAtraso = Math.floor((dPagamento.getTime() - dVencimento.getTime()) / umDia);

        const valorMulta = valor * multaPerc;
        const valorJuros = (valor * (jurosPerc / 30)) * diasAtraso; // Juros simples pro rata die

        const valorTotal = valor + valorMulta + valorJuros;

        setResultado({
            valorMulta,
            valorJuros,
            valorTotal,
            diasAtraso
        });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor Original (R$)</label>
                    <input type="number" value={valorOriginal} onChange={e => setValorOriginal(e.target.value)} placeholder="Ex: 1000" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Percentual da Multa (%)</label>
                    <input type="number" value={percentualMulta} onChange={e => setPercentualMulta(e.target.value)} placeholder="Ex: 2" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento</label>
                    <input type="date" value={dataVencimento} onChange={e => setDataVencimento(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Pagamento</label>
                    <input type="date" value={dataPagamento} onChange={e => setDataPagamento(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                 <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Taxa de Juros Mensal (%)</label>
                    <input type="number" value={percentualJuros} onChange={e => setPercentualJuros(e.target.value)} placeholder="Ex: 1" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
            </div>
            <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">Calcular Valor Atualizado</button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado && (
                <div className="bg-slate-50 p-4 rounded-lg border">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Resultado do Cálculo:</h4>
                     <p className="text-sm text-slate-600 mb-3 text-center">Atraso de {resultado.diasAtraso} dia(s).</p>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Valor Original:</span>
                            <span className="font-medium text-gray-800">{formatCurrency(parseFloat(valorOriginal))}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Multa por Atraso:</span>
                            <span className="font-medium text-gray-800">{formatCurrency(resultado.valorMulta)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Juros de Mora:</span>
                            <span className="font-medium text-gray-800">{formatCurrency(resultado.valorJuros)}</span>
                        </div>
                        <hr className="my-2 border-slate-300"/>
                        <div className="flex justify-between items-center text-lg">
                            <span className="font-bold text-gray-800">Valor Total para Pagamento:</span>
                            <span className="font-bold text-indigo-700">{formatCurrency(resultado.valorTotal)}</span>
                        </div>
                    </div>
                </div>
            )}
            <p className="text-xs text-slate-500 text-center italic mt-4">
                <strong>Atenção:</strong> Este cálculo é uma estimativa. Verifique sempre as cláusulas contratuais. Os juros de mora são calculados de forma simples e diária (pro rata die).
            </p>
        </div>
    );
};

export const ParcelamentoFinanciamentoCalculator = () => {
    const [valorFinanciado, setValorFinanciado] = useState('');
    const [numParcelas, setNumParcelas] = useState('');
    const [taxaJuros, setTaxaJuros] = useState('');
    const [tipoAmortizacao, setTipoAmortizacao] = useState('price');
    const [resultado, setResultado] = useState<{
        resumo: { valorParcela?: string; totalPago: number; totalJuros: number; };
        parcelas: any[];
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const handleCalculate = () => {
        setError(null);
        setResultado(null);

        const PV = parseFloat(valorFinanciado);
        const n = parseInt(numParcelas, 10);
        const i = parseFloat(taxaJuros) / 100;

        if (isNaN(PV) || PV <= 0 || isNaN(n) || n <= 0 || isNaN(i) || i <= 0) {
            setError('Preencha todos os campos com valores numéricos positivos.');
            return;
        }

        let parcelas = [];
        let saldoDevedor = PV;
        let totalJuros = 0;

        if (tipoAmortizacao === 'price') {
            const fator = (Math.pow(1 + i, n) * i) / (Math.pow(1 + i, n) - 1);
            const PMT = PV * fator;

            for (let j = 1; j <= n; j++) {
                const juros = saldoDevedor * i;
                const amortizacao = PMT - juros;
                saldoDevedor -= amortizacao;
                totalJuros += juros;
                parcelas.push({ n: j, parcela: PMT, juros, amortizacao, saldoDevedor: Math.abs(saldoDevedor) });
            }
             setResultado({
                resumo: { valorParcela: formatCurrency(PMT), totalPago: PMT * n, totalJuros },
                parcelas
            });

        } else { // SAC
            const amortizacao = PV / n;
            let totalPago = 0;
            for (let j = 1; j <= n; j++) {
                const juros = saldoDevedor * i;
                const parcela = amortizacao + juros;
                saldoDevedor -= amortizacao;
                totalJuros += juros;
                totalPago += parcela;
                parcelas.push({ n: j, parcela, juros, amortizacao, saldoDevedor: Math.abs(saldoDevedor) });
            }
             setResultado({
                resumo: { valorParcela: `${formatCurrency(parcelas[0].parcela)} (1ª) a ${formatCurrency(parcelas[n-1].parcela)} (última)`, totalPago, totalJuros },
                parcelas
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor do Financiamento (R$)</label>
                    <input type="number" value={valorFinanciado} onChange={e => setValorFinanciado(e.target.value)} placeholder="Ex: 100000" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Taxa de Juros Mensal (%)</label>
                    <input type="number" value={taxaJuros} onChange={e => setTaxaJuros(e.target.value)} placeholder="Ex: 0.8" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número de Parcelas</label>
                    <input type="number" value={numParcelas} onChange={e => setNumParcelas(e.target.value)} placeholder="Ex: 360" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sistema de Amortização</label>
                    <select value={tipoAmortizacao} onChange={e => setTipoAmortizacao(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-md">
                        <option value="price">Tabela Price (Parcelas Fixas)</option>
                        <option value="sac">Tabela SAC (Parcelas Decrescentes)</option>
                    </select>
                </div>
            </div>
            <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">Calcular Financiamento</button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado && (
                <div className="bg-slate-50 p-4 rounded-lg border">
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">Resumo do Financiamento</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-center">
                        <div className="bg-white p-3 rounded-md border"><div className="text-sm text-slate-500">Valor da Parcela</div><div className="font-bold text-indigo-700 text-lg">{resultado.resumo.valorParcela}</div></div>
                        <div className="bg-white p-3 rounded-md border"><div className="text-sm text-slate-500">Total de Juros</div><div className="font-bold text-red-600 text-lg">{formatCurrency(resultado.resumo.totalJuros)}</div></div>
                        <div className="bg-white p-3 rounded-md border"><div className="text-sm text-slate-500">Total Pago</div><div className="font-bold text-gray-800 text-lg">{formatCurrency(resultado.resumo.totalPago)}</div></div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-200 sticky top-0">
                                <tr>
                                    <th className="p-2">Nº</th>
                                    <th className="p-2">Parcela</th>
                                    <th className="p-2">Juros</th>
                                    <th className="p-2">Amortização</th>
                                    <th className="p-2">Saldo Devedor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resultado.parcelas.map(p => (
                                    <tr key={p.n} className="border-b">
                                        <td className="p-2">{p.n}</td>
                                        <td className="p-2 font-semibold">{formatCurrency(p.parcela)}</td>
                                        <td className="p-2 text-red-600">{formatCurrency(p.juros)}</td>
                                        <td className="p-2 text-green-700">{formatCurrency(p.amortizacao)}</td>
                                        <td className="p-2">{formatCurrency(p.saldoDevedor)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
             <p className="text-xs text-slate-500 text-center italic mt-4"><strong>Atenção:</strong> Simulação de caráter informativo. Não inclui seguros, taxas administrativas ou IOF. As condições reais podem variar. Consulte sua instituição financeira.</p>
        </div>
    );
};


export const HonorariosSucumbenciaCalculator = () => {
    const [valorCausa, setValorCausa] = useState('');
    const [percentual, setPercentual] = useState('10');
    const [resultado, setResultado] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        setError(null);
        setResultado(null);

        const valor = parseFloat(valorCausa);
        const perc = parseFloat(percentual);

        if (isNaN(valor) || valor <= 0 || isNaN(perc) || perc < 0) {
            setError('Por favor, insira valores numéricos válidos e positivos.');
            return;
        }

        const valorHonorarios = (valor * perc) / 100;
        setResultado(valorHonorarios);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="valorCausa" className="block text-sm font-medium text-gray-700 mb-1">Valor da Causa / Condenação (R$)</label>
                    <input type="number" id="valorCausa" value={valorCausa} onChange={e => setValorCausa(e.target.value)} placeholder="Ex: 50000" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
                 <div>
                    <label htmlFor="percentual" className="block text-sm font-medium text-gray-700 mb-1">Percentual de Honorários (%)</label>
                    <input type="number" id="percentual" value={percentual} onChange={e => setPercentual(e.target.value)} placeholder="Ex: 10" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
            </div>
             <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Calcular Honorários
            </button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado !== null && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                    <h4 className="text-lg font-semibold text-gray-700 mb-1">Valor dos Honorários:</h4>
                    <p className="font-bold text-indigo-700 text-2xl">
                        {resultado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                </div>
            )}
             <p className="text-xs text-slate-500 text-center italic mt-4">
                <strong>Atenção:</strong> Cálculo baseado no Art. 85 do CPC (geralmente entre 10% e 20%). Não considera fixação por equidade, sucumbência recíproca ou outras complexidades. Consulte a decisão judicial.
            </p>
        </div>
    );
};

export const PensaoAlimenticiaCalculator = () => {
    const [rendaLiquida, setRendaLiquida] = useState('');
    const [percentual, setPercentual] = useState('30');
    const [outrasDespesas, setOutrasDespesas] = useState('');
    const [resultado, setResultado] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        setError(null);
        setResultado(null);

        const renda = parseFloat(rendaLiquida);
        const perc = parseFloat(percentual);
        const despesas = parseFloat(outrasDespesas || '0');

        if (isNaN(renda) || renda < 0 || isNaN(perc) || perc < 0 || isNaN(despesas)) {
            setError('Por favor, insira valores numéricos válidos. Renda e percentual são obrigatórios.');
            return;
        }

        const valorBase = (renda * perc) / 100;
        const valorFinal = Math.max(0, valorBase - despesas); // Garante que não seja negativo
        setResultado(valorFinal);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Renda Líquida Mensal do Alimentante (R$)</label>
                    <input type="number" value={rendaLiquida} onChange={e => setRendaLiquida(e.target.value)} placeholder="Ex: 5000" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Percentual Sugerido (%)</label>
                    <input type="number" value={percentual} onChange={e => setPercentual(e.target.value)} placeholder="Ex: 30" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Outras despesas já pagas pelo alimentante (R$)</label>
                    <input type="number" value={outrasDespesas} onChange={e => setOutrasDespesas(e.target.value)} placeholder="Ex: Plano de saúde, escola" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
            </div>
             <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Calcular Estimativa
            </button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado !== null && (
                <div className="bg-slate-50 p-4 rounded-lg border text-center">
                    <h4 className="text-lg font-semibold text-gray-700 mb-1">Valor Mensal Estimado da Pensão:</h4>
                    <p className="font-bold text-indigo-700 text-2xl">
                        {resultado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                </div>
            )}
             <p className="text-xs text-slate-500 text-center italic mt-4">
                <strong>Atenção:</strong> Este é um valor <strong>estimado</strong>. A decisão final é sempre do juiz, que analisa o binômio necessidade (da criança) x possibilidade (do alimentante). Este cálculo não tem validade legal e serve apenas como referência.
            </p>
        </div>
    );
};

export const ProgressaoRegimeCalculator = () => {
    const [anos, setAnos] = useState('');
    const [meses, setMeses] = useState('');
    const [dias, setDias] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [percentual, setPercentual] = useState('16');
    const [resultado, setResultado] = useState<{
        totalPenaDias: number;
        diasParaProgredir: number;
        dataProgressao: string;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        setError(null);
        setResultado(null);

        const penaAnos = parseInt(anos || '0', 10);
        const penaMeses = parseInt(meses || '0', 10);
        const penaDias = parseInt(dias || '0', 10);
        const perc = parseInt(percentual, 10);

        if (isNaN(penaAnos) || isNaN(penaMeses) || isNaN(penaDias) || !dataInicio || isNaN(perc)) {
            setError('Por favor, preencha a pena, a data de início e selecione um percentual.');
            return;
        }
        
        const totalPenaEmDias = (penaAnos * 365) + (penaMeses * 30) + penaDias;

        if (totalPenaEmDias <= 0) {
            setError('A pena total deve ser maior que zero.');
            return;
        }

        const diasNecessarios = Math.ceil(totalPenaEmDias * (perc / 100));
        
        const dataInicial = new Date(dataInicio + 'T00:00:00');
        if (isNaN(dataInicial.getTime())) {
            setError('Data de início inválida.');
            return;
        }

        const dataFinal = new Date(dataInicial.getTime());
        // Subtrai 1 dia para que a contagem comece no dia da prisão
        dataFinal.setDate(dataFinal.getDate() + diasNecessarios - 1); 

        setResultado({
            totalPenaDias: totalPenaEmDias,
            diasParaProgredir: diasNecessarios,
            dataProgressao: dataFinal.toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
        });
    };

    const percentualOptions = [
        { value: '16', label: '16% - Primário, crime s/ violência ou grave ameaça' },
        { value: '20', label: '20% - Reincidente, crime s/ violência ou grave ameaça' },
        { value: '25', label: '25% - Primário, crime c/ violência ou grave ameaça' },
        { value: '30', label: '30% - Reincidente, crime c/ violência ou grave ameaça' },
        { value: '40', label: '40% - Primário, crime hediondo ou equiparado' },
        { value: '50', label: '50% - Vários crimes hediondos ou com resultado morte (Primário)' },
        { value: '60', label: '60% - Reincidente, crime hediondo ou equiparado' },
        { value: '70', label: '70% - Reincidente, crime hediondo com resultado morte' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pena Total</label>
                <div className="grid grid-cols-3 gap-2">
                    <input type="number" value={anos} onChange={e => setAnos(e.target.value)} placeholder="Anos" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                    <input type="number" value={meses} onChange={e => setMeses(e.target.value)} placeholder="Meses" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                    <input type="number" value={dias} onChange={e => setDias(e.target.value)} placeholder="Dias" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data do Início da Pena</label>
                    <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Percentual para Progressão</label>
                    <select value={percentual} onChange={e => setPercentual(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-md text-sm">
                        {percentualOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>
            </div>
             <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">
                Calcular Data
            </button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado && (
                <div className="bg-slate-50 p-4 rounded-lg border">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Resultado Estimado:</h4>
                     <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Pena total em dias:</span> <span className="font-medium">{resultado.totalPenaDias} dias</span></div>
                        <div className="flex justify-between"><span>Tempo a cumprir para progredir:</span> <span className="font-medium">{resultado.diasParaProgredir} dias</span></div>
                    </div>
                    <div className="bg-white p-3 rounded-md border text-center mt-3">
                        <h5 className="text-md font-semibold text-gray-700 mb-1">Data Provável para Progressão:</h5>
                        <p className="font-bold text-indigo-700 text-xl">{resultado.dataProgressao}</p>
                    </div>
                </div>
            )}
            <p className="text-xs text-slate-500 text-center italic mt-4">
                <strong>Atenção:</strong> Este cálculo é uma estimativa. Não considera remição de pena (por trabalho ou estudo), faltas graves, detração ou outras decisões que possam alterar o cálculo. Verifique sempre o atestado de pena.
            </p>
        </div>
    );
};

export const RemicaoPenaCalculator = () => {
    const [diasTrabalhados, setDiasTrabalhados] = useState('');
    const [horasEstudo, setHorasEstudo] = useState('');
    const [resultado, setResultado] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        setError(null);
        setResultado(null);

        const diasTrab = parseInt(diasTrabalhados || '0', 10);
        const horasEst = parseInt(horasEstudo || '0', 10);

        if (isNaN(diasTrab) || isNaN(horasEst) || diasTrab < 0 || horasEst < 0) {
            setError('Por favor, insira valores numéricos válidos e não negativos.');
            return;
        }

        const remicaoTrabalho = Math.floor(diasTrab / 3);
        const remicaoEstudo = Math.floor(horasEst / 12);
        
        const totalRemido = remicaoTrabalho + remicaoEstudo;
        setResultado(totalRemido);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="diasTrabalhados" className="block text-sm font-medium text-gray-700 mb-1">Total de Dias Trabalhados</label>
                    <input type="number" id="diasTrabalhados" value={diasTrabalhados} onChange={e => setDiasTrabalhados(e.target.value)} placeholder="Ex: 180" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
                <div>
                    <label htmlFor="horasEstudo" className="block text-sm font-medium text-gray-700 mb-1">Total de Horas de Estudo</label>
                    <input type="number" id="horasEstudo" value={horasEstudo} onChange={e => setHorasEstudo(e.target.value)} placeholder="Ex: 120" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
            </div>
            <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Calcular Dias Remidos
            </button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado !== null && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                    <h4 className="text-lg font-semibold text-gray-700 mb-1">Total de Dias a Remir da Pena:</h4>
                    <p className="font-bold text-indigo-700 text-2xl">{resultado} dias</p>
                </div>
            )}
            <div className="text-xs text-slate-500 text-center italic mt-4 space-y-1">
                <p><strong>Base de Cálculo (Art. 126, LEP):</strong></p>
                <p><strong>Trabalho:</strong> 1 dia de pena remido a cada 3 dias de trabalho.</p>
                <p><strong>Estudo:</strong> 1 dia de pena remido a cada 12 horas de frequência escolar, divididas em, no mínimo, 3 dias.</p>
                <p><strong>Atenção:</strong> Este cálculo é uma estimativa. A aprovação da remição depende de decisão judicial. Consulte sempre o atestado de pena.</p>
            </div>
        </div>
    );
};

export const TempoContribuicaoCalculator = () => {
    type Period = { id: number; start: string; end: string };
    const [periods, setPeriods] = useState<Period[]>([{ id: Date.now(), start: '', end: '' }]);
    const [resultado, setResultado] = useState<{ anos: number; meses: number; dias: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAddPeriod = () => {
        setPeriods([...periods, { id: Date.now(), start: '', end: '' }]);
    };

    const handleRemovePeriod = (idToRemove: number) => {
        if (periods.length > 1) {
            setPeriods(periods.filter(p => p.id !== idToRemove));
        }
    };

    const handlePeriodChange = (id: number, field: 'start' | 'end', value: string) => {
        setPeriods(periods.map(p => (p.id === id ? { ...p, [field]: value } : p)));
    };

    const handleCalculate = () => {
        setError(null);
        setResultado(null);
        let totalDays = 0;

        for (const period of periods) {
            if (!period.start || !period.end) {
                setError('Por favor, preencha as datas de início e fim para todos os períodos.');
                return;
            }
            const startDate = new Date(period.start + 'T00:00:00');
            const endDate = new Date(period.end + 'T00:00:00');

            if (startDate > endDate) {
                setError(`A data de fim (${endDate.toLocaleDateString('pt-BR')}) deve ser posterior à data de início (${startDate.toLocaleDateString('pt-BR')}).`);
                return;
            }

            const diffTime = endDate.getTime() - startDate.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
            totalDays += diffDays;
        }

        const anos = Math.floor(totalDays / 365);
        const diasRestantesAnos = totalDays % 365;
        const meses = Math.floor(diasRestantesAnos / 30);
        const dias = diasRestantesAnos % 30;

        setResultado({ anos, meses, dias });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Períodos de Contribuição</label>
                {periods.map((period, index) => (
                    <div key={period.id} className="flex items-center gap-2 p-2 rounded-md bg-slate-50 border">
                        <div className="grid grid-cols-2 gap-2 flex-grow">
                             <input type="date" value={period.start} onChange={e => handlePeriodChange(period.id, 'start', e.target.value)} className="w-full px-2 py-1 bg-white border rounded-md text-sm"/>
                             <input type="date" value={period.end} onChange={e => handlePeriodChange(period.id, 'end', e.target.value)} className="w-full px-2 py-1 bg-white border rounded-md text-sm"/>
                        </div>
                        <button onClick={() => handleRemovePeriod(period.id)} disabled={periods.length === 1} className="p-1.5 text-red-500 hover:bg-red-100 rounded-md disabled:text-gray-300 disabled:hover:bg-transparent">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                <button onClick={handleAddPeriod} className="w-full text-sm text-indigo-600 font-medium py-2 px-4 rounded-md hover:bg-indigo-50 border border-dashed border-indigo-300">
                    + Adicionar Período
                </button>
            </div>
            <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">Calcular Tempo Total</button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado && (
                <div className="bg-slate-50 p-4 rounded-lg border text-center">
                    <h4 className="text-lg font-semibold text-gray-700 mb-1">Tempo Total de Contribuição:</h4>
                    <p className="font-bold text-indigo-700 text-2xl">
                        {resultado.anos} anos, {resultado.meses} meses e {resultado.dias} dias
                    </p>
                </div>
            )}
            <p className="text-xs text-slate-500 text-center italic mt-4">
                <strong>Atenção:</strong> Este é um cálculo estimado. Para fins oficiais, utilize sempre o extrato do CNIS. O cálculo não considera conversões de tempo especial ou rural.
            </p>
        </div>
    );
};

// --- PREVIDENCIARIO CALCULATORS ---

export const CalculadoraComplexaPlaceholder: React.FC<{ title: string; message: string }> = ({ title, message }) => (
    <div className="space-y-6">
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
            <div className="flex">
                <div className="py-1"><svg className="fill-current h-6 w-6 text-amber-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM9 5v6h2V5H9zm0 8v2h2v-2H9z"/></svg></div>
                <div>
                    <p className="font-bold">Cálculo Complexo</p>
                    <p className="text-sm">{message}</p>
                </div>
            </div>
        </div>
    </div>
);

export const AposentadoriaIdadeUrbanaCalculator = () => {
    const [genero, setGenero] = useState('homem');
    const [dataNascimento, setDataNascimento] = useState('');
    const [tempoContribuicao, setTempoContribuicao] = useState('');
    const [resultado, setResultado] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        setError(null);
        setResultado(null);

        if (!dataNascimento || !tempoContribuicao) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        const contribuicaoAnos = parseInt(tempoContribuicao, 10);
        const nascimento = new Date(dataNascimento + 'T00:00:00');
        const hoje = new Date();
        
        if (isNaN(contribuicaoAnos) || contribuicaoAnos < 0 || isNaN(nascimento.getTime())) {
            setError('Valores inválidos. Verifique os dados inseridos.');
            return;
        }

        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const m = hoje.getMonth() - nascimento.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }

        const idadeMinima = genero === 'homem' ? 65 : 62;
        const contribuicaoMinima = 15;

        const faltaIdade = Math.max(0, idadeMinima - idade);
        const faltaContribuicao = Math.max(0, contribuicaoMinima - contribuicaoAnos);

        if (faltaIdade === 0 && faltaContribuicao === 0) {
            setResultado('Parabéns! Você já preenche os requisitos de idade e tempo de contribuição para a aposentadoria por idade urbana.');
        } else {
            let res = 'Você ainda não preenche os requisitos. Faltam:';
            if (faltaIdade > 0) res += `\n- ${faltaIdade} ano(s) de idade.`;
            if (faltaContribuicao > 0) res += `\n- ${faltaContribuicao} ano(s) de contribuição.`;
            setResultado(res);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gênero</label>
                    <select value={genero} onChange={e => setGenero(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-md">
                        <option value="homem">Masculino</option>
                        <option value="mulher">Feminino</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tempo de Contribuição (anos)</label>
                    <input type="number" value={tempoContribuicao} onChange={e => setTempoContribuicao(e.target.value)} placeholder="Ex: 20" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                    <input type="date" value={dataNascimento} onChange={e => setDataNascimento(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
            </div>
            <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">Verificar Elegibilidade</button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado && (
                <div className="bg-slate-50 p-4 rounded-lg border">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Resultado da Análise:</h4>
                    <pre className="whitespace-pre-wrap text-sm font-sans text-gray-800">{resultado}</pre>
                </div>
            )}
            <p className="text-xs text-slate-500 text-center italic mt-4"><strong>Atenção:</strong> Este cálculo considera a regra geral pós-Reforma da Previdência (EC 103/2019). Não abrange regras de transição ou direitos adquiridos. Consulte um profissional.</p>
        </div>
    );
};

export const AposentadoriaTempoContribuicaoCalculator = () => <CalculadoraComplexaPlaceholder title="Aposentadoria por Tempo de Contribuição" message="Este cálculo é complexo devido às regras de transição da Reforma da Previdência (2019) e sistemas de pontos. Recomenda-se uma análise detalhada por um profissional." />;
export const AposentadoriaInvalidezCalculator = () => <CalculadoraComplexaPlaceholder title="Aposentadoria por Incapacidade Permanente" message="A concessão deste benefício depende de perícia médica do INSS. O cálculo do valor varia conforme a causa da incapacidade (acidentária ou não). Consulte um profissional para uma análise detalhada." />;
export const AposentadoriaEspecialCalculator = () => <CalculadoraComplexaPlaceholder title="Aposentadoria Especial" message="Este cálculo envolve a análise de PPP (Perfil Profissiográfico Previdenciário) e a conversão de tempo especial em comum, com regras que variam muito. É essencial a consulta a um especialista." />;
export const ContribuicoesRetroativasCalculator = () => <CalculadoraComplexaPlaceholder title="Cálculo de Contribuições Retroativas (GPS)" message="Calcular contribuições em atraso envolve juros, multas e a aplicação de índices corretos, variando para contribuintes individuais e facultativos. A orientação de um contador ou advogado é fundamental." />;
export const IndenizacaoTempoContribuicaoCalculator = () => <CalculadoraComplexaPlaceholder title="Cálculo de Indenização de Tempo" message="A indenização de períodos não contribuídos (como tempo rural antigo) é um processo complexo que requer análise do INSS e cálculos específicos. Recomenda-se assessoria profissional." />;

export const RMICalculator = () => {
    const [salarioBeneficio, setSalarioBeneficio] = useState('');
    const [anosContribuicao, setAnosContribuicao] = useState('');
    const [genero, setGenero] = useState('homem');
    const [resultado, setResultado] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        setError(null);
        setResultado(null);
        
        const sb = parseFloat(salarioBeneficio);
        const anos = parseInt(anosContribuicao, 10);
        
        if (isNaN(sb) || sb <= 0 || isNaN(anos) || anos < 0) {
            setError('Preencha os campos com valores válidos.');
            return;
        }

        const tempoMinimo = genero === 'homem' ? 20 : 15;
        let coeficiente = 0.60;
        
        if (anos > tempoMinimo) {
            coeficiente += (anos - tempoMinimo) * 0.02;
        }
        
        coeficiente = Math.min(1.0, coeficiente); // Limita a 100%
        const rmi = sb * coeficiente;
        
        setResultado(rmi);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Média dos Salários (SB)</label>
                    <input type="number" value={salarioBeneficio} onChange={e => setSalarioBeneficio(e.target.value)} placeholder="Ex: 3500" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Anos de Contribuição</label>
                    <input type="number" value={anosContribuicao} onChange={e => setAnosContribuicao(e.target.value)} placeholder="Ex: 25" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gênero</label>
                    <select value={genero} onChange={e => setGenero(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-md">
                        <option value="homem">Masculino</option>
                        <option value="mulher">Feminino</option>
                    </select>
                </div>
            </div>
            <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">Calcular RMI</button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado !== null && (
                <div className="bg-slate-50 p-4 rounded-lg border text-center">
                    <h4 className="text-lg font-semibold text-gray-700 mb-1">Valor Estimado da RMI:</h4>
                    <p className="font-bold text-indigo-700 text-2xl">{resultado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
            )}
            <p className="text-xs text-slate-500 text-center italic mt-4"><strong>Atenção:</strong> Cálculo baseado na regra geral pós-reforma (60% + 2% por ano que exceder 20/15 anos). Não se aplica a todas as regras de transição, direito adquirido ou aposentadorias especiais. O valor final é limitado ao teto do INSS.</p>
        </div>
    );
};

export const FatorPrevidenciarioCalculator = () => {
    const [idadeAnos, setIdadeAnos] = useState('');
    const [tempoContribuicaoAnos, setTempoContribuicaoAnos] = useState('');
    const [expectativaSobrevida, setExpectativaSobrevida] = useState('');
    const [resultado, setResultado] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        setError(null);
        setResultado(null);
        
        const idade = parseInt(idadeAnos, 10);
        const tc = parseInt(tempoContribuicaoAnos, 10);
        const es = parseFloat(expectativaSobrevida);
        
        if (isNaN(idade) || isNaN(tc) || isNaN(es) || idade <= 0 || tc <= 0 || es <= 0) {
            setError('Preencha todos os campos com valores numéricos válidos.');
            return;
        }

        const aliquota = 0.31;
        const fator = (tc * aliquota / es) * (1 + (idade + tc * aliquota) / 100);

        setResultado(fator);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Idade (anos)</label>
                    <input type="number" value={idadeAnos} onChange={e => setIdadeAnos(e.target.value)} placeholder="Ex: 55" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tempo de Contribuição (anos)</label>
                    <input type="number" value={tempoContribuicaoAnos} onChange={e => setTempoContribuicaoAnos(e.target.value)} placeholder="Ex: 35" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expectativa de Sobrevida</label>
                    <input type="number" value={expectativaSobrevida} onChange={e => setExpectativaSobrevida(e.target.value)} placeholder="Consulte a Tábua do IBGE" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
            </div>
            <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">Calcular Fator</button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado !== null && (
                <div className="bg-slate-50 p-4 rounded-lg border text-center">
                    <h4 className="text-lg font-semibold text-gray-700 mb-1">Fator Previdenciário Calculado:</h4>
                    <p className="font-bold text-indigo-700 text-2xl">{resultado.toFixed(4)}</p>
                </div>
            )}
            <p className="text-xs text-slate-500 text-center italic mt-4"><strong>Atenção:</strong> O Fator Previdenciário é aplicado principalmente para quem se aposentou pelas regras de transição com pedágio. A expectativa de sobrevida deve ser consultada na tábua de mortalidade do IBGE vigente na data da aposentadoria.</p>
        </div>
    );
};

export const PensaoPorMorteCalculator = () => {
    const [valorBeneficio, setValorBeneficio] = useState('');
    const [numDependentes, setNumDependentes] = useState('1');
    const [resultado, setResultado] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        setError(null);
        setResultado(null);
        
        const valor = parseFloat(valorBeneficio);
        const dependentes = parseInt(numDependentes, 10);
        
        if (isNaN(valor) || valor <= 0 || isNaN(dependentes) || dependentes < 1) {
            setError('Preencha os campos com valores válidos. Pelo menos 1 dependente é necessário.');
            return;
        }

        const cotaFamiliar = 0.50;
        const cotaDependentes = dependentes * 0.10;
        const coeficiente = Math.min(1.0, cotaFamiliar + cotaDependentes);
        
        const valorPensao = valor * coeficiente;
        
        setResultado(valorPensao);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor da Aposentadoria do Falecido (R$)</label>
                    <input type="number" value={valorBeneficio} onChange={e => setValorBeneficio(e.target.value)} placeholder="Ex: 4000" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nº de Dependentes</label>
                    <input type="number" value={numDependentes} onChange={e => setNumDependentes(e.target.value)} placeholder="Ex: 2" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
            </div>
            <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">Calcular Pensão</button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado !== null && (
                <div className="bg-slate-50 p-4 rounded-lg border text-center">
                    <h4 className="text-lg font-semibold text-gray-700 mb-1">Valor Mensal Estimado da Pensão:</h4>
                    <p className="font-bold text-indigo-700 text-2xl">{resultado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
            )}
            <p className="text-xs text-slate-500 text-center italic mt-4"><strong>Atenção:</strong> Cálculo pela regra geral pós-reforma (50% + 10% por dependente, até 100%). Se o falecido não era aposentado, o cálculo é sobre o valor da aposentadoria por incapacidade a que teria direito. O valor final não pode ser inferior a 1 salário mínimo.</p>
        </div>
    );
};

export const AuxilioBeneficioIncapacidadeCalculator = () => {
    const [mediaSalarios, setMediaSalarios] = useState('');
    const [mediaUltimos12, setMediaUltimos12] = useState('');
    const [resultado, setResultado] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        setError(null);
        setResultado(null);
        
        const mediaTotal = parseFloat(mediaSalarios);
        const media12 = parseFloat(mediaUltimos12);
        
        if (isNaN(mediaTotal) || mediaTotal <= 0 || isNaN(media12) || media12 <= 0) {
            setError('Preencha ambos os campos com valores válidos.');
            return;
        }

        const valorBase = mediaTotal * 0.91;
        const valorFinal = Math.min(valorBase, media12);
        
        setResultado(valorFinal);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Média de todos os salários (R$)</label>
                    <input type="number" value={mediaSalarios} onChange={e => setMediaSalarios(e.target.value)} placeholder="Ex: 3000" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Média dos últimos 12 salários (R$)</label>
                    <input type="number" value={mediaUltimos12} onChange={e => setMediaUltimos12(e.target.value)} placeholder="Ex: 3200" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
            </div>
            <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">Calcular Auxílio</button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado !== null && (
                <div className="bg-slate-50 p-4 rounded-lg border text-center">
                    <h4 className="text-lg font-semibold text-gray-700 mb-1">Valor Mensal Estimado do Benefício:</h4>
                    <p className="font-bold text-indigo-700 text-2xl">{resultado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
            )}
            <p className="text-xs text-slate-500 text-center italic mt-4"><strong>Atenção:</strong> O valor corresponde a 91% da média de todos os salários de contribuição, limitado à média dos últimos 12 salários. A concessão depende de perícia médica do INSS. O auxílio-acidente corresponde a 50% do salário de benefício e não tem essa limitação.</p>
        </div>
    );
};

export const BPCLOASCalculator = () => {
    const [rendaTotal, setRendaTotal] = useState('');
    const [numPessoas, setNumPessoas] = useState('');
    const [resultado, setResultado] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const SALARIO_MINIMO_ATUAL = 1412.00; // Valor para 2024 - deve ser atualizado anualmente

    const handleCalculate = () => {
        setError(null);
        setResultado(null);
        
        const renda = parseFloat(rendaTotal);
        const pessoas = parseInt(numPessoas, 10);
        
        if (isNaN(renda) || renda < 0 || isNaN(pessoas) || pessoas < 1) {
            setError('Preencha os campos com valores válidos.');
            return;
        }

        const rendaPerCapita = renda / pessoas;
        const limite = SALARIO_MINIMO_ATUAL / 4;

        let res = `Renda familiar per capita: ${rendaPerCapita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
        res += `\nLimite para elegibilidade: ${limite.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} (1/4 do salário mínimo)`;

        if (rendaPerCapita < limite) {
            res += '\n\nO critério de renda parece ter sido atendido. A concessão ainda depende da avaliação social e de outros requisitos (idade ou deficiência).';
        } else {
            res += '\n\nO critério de renda parece NÃO ter sido atendido. Em alguns casos, a justiça pode flexibilizar este critério.';
        }
        setResultado(res);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Renda Total da Família (R$)</label>
                    <input type="number" value={rendaTotal} onChange={e => setRendaTotal(e.target.value)} placeholder="Soma de todos os ganhos" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nº de Pessoas na Família</label>
                    <input type="number" value={numPessoas} onChange={e => setNumPessoas(e.target.value)} placeholder="Ex: 4" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
            </div>
            <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">Analisar Renda</button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado && (
                <div className="bg-slate-50 p-4 rounded-lg border">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Resultado da Análise:</h4>
                    <pre className="whitespace-pre-wrap text-sm font-sans text-gray-800">{resultado}</pre>
                </div>
            )}
            <p className="text-xs text-slate-500 text-center italic mt-4"><strong>Atenção:</strong> Esta é uma análise preliminar do critério de renda. A elegibilidade ao BPC/LOAS (no valor de 1 salário mínimo) também requer que o solicitante seja idoso (65+ anos) ou pessoa com deficiência de longa duração. A aprovação final depende de avaliação do INSS.</p>
        </div>
    );
};

export const AtrasadosBeneficioCalculator = () => {
    const [valorMensal, setValorMensal] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [resultado, setResultado] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        setError(null);
        setResultado(null);

        const valor = parseFloat(valorMensal);
        if (isNaN(valor) || valor <= 0 || !dataInicio || !dataFim) {
            setError('Preencha todos os campos com valores válidos.');
            return;
        }

        const dInicial = new Date(dataInicio + 'T00:00:00');
        const dFinal = new Date(dataFim + 'T00:00:00');

        if (dInicial >= dFinal) {
            setError('A data final deve ser posterior à data inicial.');
            return;
        }

        const meses = (dFinal.getFullYear() - dInicial.getFullYear()) * 12 + (dFinal.getMonth() - dInicial.getMonth());
        
        if (meses < 0) {
            setError('Ocorreu um erro no cálculo dos meses. Verifique as datas.');
            return;
        }

        const principal = valor * meses;
        // Simplificação: juros e correção não foram aplicados para esta estimativa
        const total = principal;

        setResultado({ principal, total, meses });
    };

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor Mensal do Benefício (R$)</label>
                    <input type="number" value={valorMensal} onChange={e => setValorMensal(e.target.value)} placeholder="Ex: 1500" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nº de Meses em Atraso</label>
                    <input type="text" value={resultado ? resultado.meses : ''} readOnly className="w-full px-3 py-2 bg-slate-200 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início do Atraso</label>
                    <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Final do Atraso</label>
                    <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
            </div>
            <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">Calcular Atrasados</button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado && (
                <div className="bg-slate-50 p-4 rounded-lg border">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Valor Estimado:</h4>
                    <div className="flex justify-between items-center text-lg">
                        <span className="font-bold text-gray-800">Total Devido (sem juros/correção):</span>
                        <span className="font-bold text-indigo-700">{formatCurrency(resultado.total)}</span>
                    </div>
                </div>
            )}
            <p className="text-xs text-slate-500 text-center italic mt-4">
                <strong>Atenção:</strong> Este cálculo é uma estimativa do valor principal. O valor final pago pelo INSS ou pela Justiça incluirá juros e correção monetária, que não foram aplicados nesta ferramenta simplificada.
            </p>
        </div>
    );
};

// --- TRANSITO & SEGUROS CALCULATORS ---
export const DPVATCalculator = () => <CalculadoraComplexaPlaceholder title="Indenização DPVAT / SPVAT" message="O DPVAT foi substituído pelo SPVAT em 2024, sob gestão da Caixa Econômica Federal. Os valores de indenização são fixos e definidos por lei, dependendo do tipo de dano (morte, invalidez permanente). A solicitação deve ser feita diretamente à Caixa. Consulte um profissional para orientação sobre o processo." />;
export const SuspensaoCassacaoCNHCalculator = () => <CalculadoraComplexaPlaceholder title="Suspensão e Cassação de CNH" message="A suspensão ou cassação da CNH depende do acúmulo de pontos, de infrações específicas (mandatórias) e do histórico do condutor. A análise requer a verificação detalhada do extrato de pontuação e das notificações recebidas. Recomenda-se assessoria jurídica especializada." />;

export const MultasTransitoCalculator = () => {
    const [valorOriginal, setValorOriginal] = useState('');
    const [dataVencimento, setDataVencimento] = useState('');
    const [dataPagamento, setDataPagamento] = useState('');
    const [resultado, setResultado] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const handleCalculate = () => {
        setError(null);
        setResultado(null);

        const valor = parseFloat(valorOriginal);

        if (isNaN(valor) || valor <= 0 || !dataVencimento || !dataPagamento) {
            setError('Preencha todos os campos com valores válidos.');
            return;
        }

        const dVencimento = new Date(dataVencimento + 'T00:00:00');
        const dPagamento = new Date(dataPagamento + 'T00:00:00');

        if (dPagamento <= dVencimento) {
            setResultado({ valorMulta: 0, valorJuros: 0, valorTotal: valor });
            return;
        }

        // Simplificação: Multa de 20% + Juros de 1% a.m. (pro rata die)
        const valorMulta = valor * 0.20;
        const umDia = 1000 * 60 * 60 * 24;
        const diasAtraso = Math.floor((dPagamento.getTime() - dVencimento.getTime()) / umDia);
        const valorJuros = (valor * (0.01 / 30)) * diasAtraso; 

        const valorTotal = valor + valorMulta + valorJuros;
        setResultado({ valorMulta, valorJuros, valorTotal });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor Original da Multa (R$)</label>
                    <input type="number" value={valorOriginal} onChange={e => setValorOriginal(e.target.value)} placeholder="Ex: 293.47" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div></div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento</label>
                    <input type="date" value={dataVencimento} onChange={e => setDataVencimento(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Pagamento</label>
                    <input type="date" value={dataPagamento} onChange={e => setDataPagamento(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
            </div>
            <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">Calcular Valor Atualizado</button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado && (
                <div className="bg-slate-50 p-4 rounded-lg border">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Resultado do Cálculo:</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between"><span>Valor Original:</span><span className="font-medium">{formatCurrency(parseFloat(valorOriginal))}</span></div>
                        <div className="flex justify-between"><span>Multa (20%):</span><span className="font-medium">{formatCurrency(resultado.valorMulta)}</span></div>
                        <div className="flex justify-between"><span>Juros de Mora (SELIC):</span><span className="font-medium">{formatCurrency(resultado.valorJuros)}</span></div>
                        <hr className="my-2 border-slate-300"/>
                        <div className="flex justify-between items-center text-lg"><span className="font-bold">Valor Total a Pagar:</span><span className="font-bold text-indigo-700">{formatCurrency(resultado.valorTotal)}</span></div>
                    </div>
                </div>
            )}
            <p className="text-xs text-slate-500 text-center italic mt-4"><strong>Atenção:</strong> Cálculo estimado. Os juros de mora oficiais são baseados na taxa SELIC (Art. 284 CTB). Esta calculadora usa uma aproximação de 1% a.m. para fins de simulação.</p>
        </div>
    );
};

export const PontuacaoCNHCalculator = () => {
    const [leves, setLeves] = useState('');
    const [medias, setMedias] = useState('');
    const [graves, setGraves] = useState('');
    const [gravissimas, setGravissimas] = useState('');
    const [resultado, setResultado] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        setError(null);
        setResultado(null);

        const nLeves = parseInt(leves || '0');
        const nMedias = parseInt(medias || '0');
        const nGraves = parseInt(graves || '0');
        const nGravissimas = parseInt(gravissimas || '0');

        if ([nLeves, nMedias, nGraves, nGravissimas].some(isNaN)) {
            setError('Por favor, insira apenas números.');
            return;
        }

        const totalPontos = (nLeves * 3) + (nMedias * 4) + (nGraves * 5) + (nGravissimas * 7);
        let limite = 40;
        let alerta = '';

        if (nGravissimas >= 2) {
            limite = 20;
        } else if (nGravissimas === 1) {
            limite = 30;
        }

        if (totalPontos >= limite) {
            alerta = `Atenção! Com ${totalPontos} pontos e ${nGravissimas} infração(ões) gravíssima(s), você atingiu ou ultrapassou o limite de ${limite} pontos para suspensão.`;
        } else {
            alerta = `Você está com ${totalPontos} pontos. Seu limite atual é de ${limite} pontos. Faltam ${limite - totalPontos} pontos para atingir o limite.`;
        }

        setResultado({ totalPontos, alerta });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Leves (3 pts)</label>
                    <input type="number" value={leves} onChange={e => setLeves(e.target.value)} placeholder="0" className="w-full text-center px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Médias (4 pts)</label>
                    <input type="number" value={medias} onChange={e => setMedias(e.target.value)} placeholder="0" className="w-full text-center px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Graves (5 pts)</label>
                    <input type="number" value={graves} onChange={e => setGraves(e.target.value)} placeholder="0" className="w-full text-center px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gravíssimas (7 pts)</label>
                    <input type="number" value={gravissimas} onChange={e => setGravissimas(e.target.value)} placeholder="0" className="w-full text-center px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
            </div>
            <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">Calcular Pontuação</button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado && (
                <div className={`p-4 rounded-lg border ${resultado.totalPontos >= 20 ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2 text-center">Resultado:</h4>
                    <p className="font-bold text-indigo-700 text-4xl text-center mb-3">{resultado.totalPontos} <span className="text-2xl">pontos</span></p>
                    <p className="text-sm text-center text-gray-800">{resultado.alerta}</p>
                </div>
            )}
            <p className="text-xs text-slate-500 text-center italic mt-4"><strong>Atenção:</strong> Este cálculo não considera infrações mandatórias (que suspendem a CNH por si só) nem as regras específicas para condutores profissionais (EAR). Consulte sempre o extrato oficial do DETRAN.</p>
        </div>
    );
};

export const PerdaTotalVeiculoCalculator = () => {
    const [valorFIPE, setValorFIPE] = useState('');
    const [percentualApolice, setPercentualApolice] = useState('100');
    const [resultado, setResultado] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        setError(null);
        setResultado(null);
        const fipe = parseFloat(valorFIPE);
        const perc = parseFloat(percentualApolice);

        if (isNaN(fipe) || fipe <= 0 || isNaN(perc) || perc <= 0) {
            setError('Por favor, insira valores válidos.');
            return;
        }

        const indenizacao = fipe * (perc / 100);
        setResultado(indenizacao);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor da Tabela FIPE (R$)</label>
                    <input type="number" value={valorFIPE} onChange={e => setValorFIPE(e.target.value)} placeholder="Ex: 85000" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Percentual da Apólice (%)</label>
                    <input type="number" value={percentualApolice} onChange={e => setPercentualApolice(e.target.value)} placeholder="Ex: 100" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
            </div>
            <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">Calcular Indenização</button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado !== null && (
                <div className="bg-slate-50 p-4 rounded-lg border text-center">
                    <h4 className="text-lg font-semibold text-gray-700 mb-1">Valor Estimado da Indenização:</h4>
                    <p className="font-bold text-indigo-700 text-2xl">{resultado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
            )}
            <p className="text-xs text-slate-500 text-center italic mt-4"><strong>Atenção:</strong> O valor final pode sofrer dedução de franquia (se aplicável), débitos do veículo (IPVA, multas) e salvado. Consulte sempre as condições gerais da sua apólice de seguro.</p>
        </div>
    );
};

export const AtualizacaoIPVACalculator = () => {
    const [valorOriginal, setValorOriginal] = useState('');
    const [dataVencimento, setDataVencimento] = useState('');
    const [dataPagamento, setDataPagamento] = useState('');
    const [resultado, setResultado] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const handleCalculate = () => {
        setError(null);
        setResultado(null);

        const valor = parseFloat(valorOriginal);
        if (isNaN(valor) || valor <= 0 || !dataVencimento || !dataPagamento) {
            setError('Preencha todos os campos com valores válidos.');
            return;
        }

        const dVencimento = new Date(dataVencimento + 'T00:00:00');
        const dPagamento = new Date(dataPagamento + 'T00:00:00');

        if (dPagamento <= dVencimento) {
            setResultado({ valorMulta: 0, valorJuros: 0, valorTotal: valor });
            return;
        }

        const umDia = 1000 * 60 * 60 * 24;
        const diasAtraso = Math.floor((dPagamento.getTime() - dVencimento.getTime()) / umDia);
        // Regra SP: 0,33% ao dia (limitado a 20%) + juros SELIC. Simplificando:
        const multaDiaria = valor * 0.0033;
        const valorMulta = Math.min(multaDiaria * diasAtraso, valor * 0.20);
        const valorJuros = (valor * (0.01 / 30)) * diasAtraso; // Simulação SELIC

        const valorTotal = valor + valorMulta + valorJuros;
        setResultado({ valorMulta, valorJuros, valorTotal });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Valor Original do IPVA (R$)</label><input type="number" value={valorOriginal} onChange={e => setValorOriginal(e.target.value)} placeholder="Ex: 2500" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/></div>
                <div></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento</label><input type="date" value={dataVencimento} onChange={e => setDataVencimento(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-md"/></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Data de Pagamento</label><input type="date" value={dataPagamento} onChange={e => setDataPagamento(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-md"/></div>
            </div>
            <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">Calcular Valor Atualizado</button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado && (
                <div className="bg-slate-50 p-4 rounded-lg border">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Resultado do Cálculo:</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between"><span>Valor Original:</span><span className="font-medium">{formatCurrency(parseFloat(valorOriginal))}</span></div>
                        <div className="flex justify-between"><span>Multa por Atraso:</span><span className="font-medium">{formatCurrency(resultado.valorMulta)}</span></div>
                        <div className="flex justify-between"><span>Juros de Mora:</span><span className="font-medium">{formatCurrency(resultado.valorJuros)}</span></div>
                        <hr className="my-2 border-slate-300"/>
                        <div className="flex justify-between items-center text-lg"><span className="font-bold">Valor Total a Pagar:</span><span className="font-bold text-indigo-700">{formatCurrency(resultado.valorTotal)}</span></div>
                    </div>
                </div>
            )}
            <p className="text-xs text-slate-500 text-center italic mt-4"><strong>Atenção:</strong> As regras de multa e juros para IPVA atrasado variam por estado. Este cálculo é uma simulação baseada em regras comuns (multa diária limitada a 20% + juros SELIC) e pode não refletir o valor exato do seu débito. Consulte o site da Secretaria da Fazenda do seu estado.</p>
        </div>
    );
};

export const RestituicaoIPVACalculator = () => {
    const [valorIPVA, setValorIPVA] = useState('');
    const [dataSinistro, setDataSinistro] = useState('');
    const [resultado, setResultado] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        setError(null);
        setResultado(null);
        const ipvaAnual = parseFloat(valorIPVA);

        if (isNaN(ipvaAnual) || ipvaAnual <= 0 || !dataSinistro) {
            setError('Por favor, insira valores válidos.');
            return;
        }
        
        const data = new Date(dataSinistro + 'T00:00:00');
        const mesSinistro = data.getMonth() + 1; // 1 = Janeiro, 12 = Dezembro
        const mesesRestantes = 12 - mesSinistro;
        
        if (mesesRestantes < 0) {
            setError('O ano do sinistro parece ser inválido.');
            return;
        }

        const valorRestituicao = (ipvaAnual / 12) * mesesRestantes;
        setResultado(valorRestituicao);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor Anual do IPVA Pago (R$)</label>
                    <input type="number" value={valorIPVA} onChange={e => setValorIPVA(e.target.value)} placeholder="Ex: 2000" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data do Sinistro (B.O.)</label>
                    <input type="date" value={dataSinistro} onChange={e => setDataSinistro(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
            </div>
            <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">Calcular Restituição</button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado !== null && (
                <div className="bg-slate-50 p-4 rounded-lg border text-center">
                    <h4 className="text-lg font-semibold text-gray-700 mb-1">Valor Estimado da Restituição:</h4>
                    <p className="font-bold text-indigo-700 text-2xl">{resultado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
            )}
            <p className="text-xs text-slate-500 text-center italic mt-4"><strong>Atenção:</strong> Cálculo proporcional aos meses restantes do ano após o evento. A restituição não é automática e deve ser solicitada à Secretaria da Fazenda do seu estado, que pode ter regras específicas. O valor é uma estimativa.</p>
        </div>
    );
};

export const DanosMateriaisCalculator = () => {
    type Item = { id: number; description: string; value: string };
    const [items, setItems] = useState<Item[]>([{ id: Date.now(), description: '', value: '' }]);
    const [total, setTotal] = useState<number>(0);

    const handleAddItem = () => {
        setItems([...items, { id: Date.now(), description: '', value: '' }]);
    };

    const handleRemoveItem = (idToRemove: number) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== idToRemove));
        }
    };

    const handleItemChange = (id: number, field: 'description' | 'value', fieldValue: string) => {
        setItems(items.map(item => (item.id === id ? { ...item, [field]: fieldValue } : item)));
    };

    const calculateTotal = () => {
        const totalValue = items.reduce((sum, item) => {
            const value = parseFloat(item.value);
            return sum + (isNaN(value) ? 0 : value);
        }, 0);
        setTotal(totalValue);
    };
    
    useEffect(() => {
        calculateTotal();
    }, [items]);

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Itens e Despesas</label>
                {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 p-2 rounded-md bg-slate-50 border">
                        <div className="grid grid-cols-2 gap-2 flex-grow">
                             <input type="text" value={item.description} onChange={e => handleItemChange(item.id, 'description', e.target.value)} placeholder="Descrição (ex: conserto, nota fiscal)" className="w-full px-2 py-1 bg-white border rounded-md text-sm"/>
                             <input type="number" value={item.value} onChange={e => handleItemChange(item.id, 'value', e.target.value)} placeholder="Valor R$" className="w-full px-2 py-1 bg-white border rounded-md text-sm"/>
                        </div>
                        <button onClick={() => handleRemoveItem(item.id)} disabled={items.length === 1} className="p-1.5 text-red-500 hover:bg-red-100 rounded-md disabled:text-gray-300 disabled:hover:bg-transparent" aria-label="Remover item">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                <button onClick={handleAddItem} className="w-full text-sm text-indigo-600 font-medium py-2 px-4 rounded-md hover:bg-indigo-50 border border-dashed border-indigo-300">
                    + Adicionar Item
                </button>
            </div>
            {total > 0 && (
                <div className="bg-slate-50 p-4 rounded-lg border text-center">
                    <h4 className="text-lg font-semibold text-gray-700 mb-1">Total dos Danos Materiais:</h4>
                    <p className="font-bold text-indigo-700 text-2xl">
                        {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                </div>
            )}
            <p className="text-xs text-slate-500 text-center italic mt-4">
                <strong>Atenção:</strong> Some todos os prejuízos materiais que podem ser comprovados com notas fiscais, recibos, orçamentos, etc. Este cálculo é uma simples soma dos valores inseridos.
            </p>
        </div>
    );
};


export const LucrosCessantesCalculator = () => {
    const [rendaMediaMensal, setRendaMediaMensal] = useState('');
    const [mesesParado, setMesesParado] = useState('');
    const [resultado, setResultado] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        setError(null);
        setResultado(null);

        const renda = parseFloat(rendaMediaMensal);
        const meses = parseInt(mesesParado, 10);

        if (isNaN(renda) || renda <= 0 || isNaN(meses) || meses <= 0) {
            setError('Por favor, insira valores numéricos válidos e positivos para ambos os campos.');
            return;
        }

        const valorTotal = renda * meses;
        setResultado(valorTotal);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="rendaMediaMensal" className="block text-sm font-medium text-gray-700 mb-1">Renda Média Mensal (R$)</label>
                    <input type="number" id="rendaMediaMensal" value={rendaMediaMensal} onChange={e => setRendaMediaMensal(e.target.value)} placeholder="O que deixou de ganhar" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label htmlFor="mesesParado" className="block text-sm font-medium text-gray-700 mb-1">Meses de Paralisação</label>
                    <input type="number" id="mesesParado" value={mesesParado} onChange={e => setMesesParado(e.target.value)} placeholder="Tempo que ficou sem trabalhar" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
            </div>
            <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">
                Calcular Lucros Cessantes
            </button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado !== null && (
                <div className="bg-slate-50 p-4 rounded-lg border text-center">
                    <h4 className="text-lg font-semibold text-gray-700 mb-1">Valor Estimado dos Lucros Cessantes:</h4>
                    <p className="font-bold text-indigo-700 text-2xl">
                        {resultado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                </div>
            )}
            <p className="text-xs text-slate-500 text-center italic mt-4">
                <strong>Atenção:</strong> Este cálculo é uma estimativa simplificada. A comprovação dos lucros cessantes em um processo judicial exige provas robustas da renda que se deixou de auferir. Consulte um advogado.
            </p>
        </div>
    );
};

export const LiquidacaoVerbasCalculator = () => {
    type Rubrica = { id: number; description: string; value: string };
    const [rubricas, setRubricas] = useState<Rubrica[]>([{ id: Date.now(), description: 'Salário-base', value: '' }]);
    const [total, setTotal] = useState<number>(0);

    const handleAddRubrica = () => {
        setRubricas([...rubricas, { id: Date.now(), description: '', value: '' }]);
    };

    const handleRemoveRubrica = (idToRemove: number) => {
        if (rubricas.length > 1) {
            setRubricas(rubricas.filter(r => r.id !== idToRemove));
        }
    };

    const handleRubricaChange = (id: number, field: 'description' | 'value', fieldValue: string) => {
        setRubricas(rubricas.map(r => (r.id === id ? { ...r, [field]: fieldValue } : r)));
    };
    
    useEffect(() => {
        const totalValue = rubricas.reduce((sum, item) => {
            const value = parseFloat(item.value);
            return sum + (isNaN(value) ? 0 : value);
        }, 0);
        setTotal(totalValue);
    }, [rubricas]);

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Verbas Trabalhistas</label>
                {rubricas.map((rubrica) => (
                    <div key={rubrica.id} className="flex items-center gap-2 p-2 rounded-md bg-slate-50 border">
                        <div className="grid grid-cols-2 gap-2 flex-grow">
                             <input type="text" value={rubrica.description} onChange={e => handleRubricaChange(rubrica.id, 'description', e.target.value)} placeholder="Descrição da verba (ex: Hora extra 50%)" className="w-full px-2 py-1 bg-white border rounded-md text-sm"/>
                             <input type="number" value={rubrica.value} onChange={e => handleRubricaChange(rubrica.id, 'value', e.target.value)} placeholder="Valor R$" className="w-full px-2 py-1 bg-white border rounded-md text-sm"/>
                        </div>
                        <button onClick={() => handleRemoveRubrica(rubrica.id)} disabled={rubricas.length === 1} className="p-1.5 text-red-500 hover:bg-red-100 rounded-md disabled:text-gray-300 disabled:hover:bg-transparent" aria-label="Remover verba">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                <button onClick={handleAddRubrica} className="w-full text-sm text-indigo-600 font-medium py-2 px-4 rounded-md hover:bg-indigo-50 border border-dashed border-indigo-300">
                    + Adicionar Verba
                </button>
            </div>
            {total > 0 && (
                <div className="bg-slate-50 p-4 rounded-lg border text-center">
                    <h4 className="text-lg font-semibold text-gray-700 mb-1">Total Bruto das Verbas:</h4>
                    <p className="font-bold text-indigo-700 text-2xl">
                        {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                </div>
            )}
            <p className="text-xs text-slate-500 text-center italic mt-4">
                <strong>Atenção:</strong> Esta ferramenta realiza uma soma simples dos valores inseridos. O cálculo não inclui reflexos (ex: DSR sobre horas extras) nem deduções obrigatórias (INSS, IRRF). Para um cálculo completo e preciso, consulte um advogado ou contador.
            </p>
        </div>
    );
};

export const DanosMoraisCalculator = () => <CalculadoraComplexaPlaceholder title="Indenização por Danos Morais" message="O valor do dano moral é definido pelo juiz, que analisa a gravidade do caso, a condição econômica das partes e os precedentes. Não há uma fórmula matemática, mas sim uma análise subjetiva para compensar o sofrimento e punir o ofensor. Use esta seção para entender os critérios, não para calcular um valor exato." />;

export const CorrecaoValorImovelCalculator = () => {
    const [valorOriginal, setValorOriginal] = useState('');
    const [dataInicial, setDataInicial] = useState('');
    const [dataFinal, setDataFinal] = useState('');
    const [indiceCorrecao, setIndiceCorrecao] = useState('');
    
    const [resultado, setResultado] = useState<{ valorCorrigido: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        setError(null);
        setResultado(null);

        const valor = parseFloat(valorOriginal);
        const indiceMensal = parseFloat(indiceCorrecao) / 100;

        if (isNaN(valor) || valor <= 0 || isNaN(indiceMensal) || indiceMensal < 0 || !dataInicial || !dataFinal) {
            setError('Preencha todos os campos com valores válidos.');
            return;
        }

        const dInicial = new Date(dataInicial + 'T00:00:00');
        const dFinal = new Date(dataFinal + 'T00:00:00');

        if (dInicial >= dFinal) {
            setError('A data final deve ser posterior à data inicial.');
            return;
        }

        const meses = (dFinal.getFullYear() - dInicial.getFullYear()) * 12 + (dFinal.getMonth() - dInicial.getMonth());
        
        if (meses < 0) {
             setError('Ocorreu um erro no cálculo dos meses. Verifique as datas.');
             return;
        }

        const valorCorrigido = valor * Math.pow((1 + indiceMensal), meses);

        setResultado({ valorCorrigido });
    };

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor Original do Imóvel (R$)</label>
                    <input type="number" value={valorOriginal} onChange={e => setValorOriginal(e.target.value)} placeholder="Ex: 500000" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Índice Mensal (INCC, IPCA, etc. %)</label>
                    <input type="number" value={indiceCorrecao} onChange={e => setIndiceCorrecao(e.target.value)} placeholder="Ex: 0.8" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial do Contrato</label>
                    <input type="date" value={dataInicial} onChange={e => setDataInicial(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Final para Correção</label>
                    <input type="date" value={dataFinal} onChange={e => setDataFinal(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
            </div>
            <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">Calcular Valor Corrigido</button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado && (
                <div className="bg-slate-50 p-4 rounded-lg border text-center">
                    <h4 className="text-lg font-semibold text-gray-700 mb-1">Valor do Imóvel Corrigido:</h4>
                    <p className="font-bold text-indigo-700 text-2xl">{formatCurrency(resultado.valorCorrigido)}</p>
                </div>
            )}
            <p className="text-xs text-slate-500 text-center italic mt-4">
                <strong>Atenção:</strong> Este cálculo é uma estimativa. Utilize o índice de correção monetária previsto em seu contrato (ex: INCC para imóveis na planta, IGPM ou IPCA para contratos de aluguel ou venda). Consulte sempre as fontes oficiais dos índices.
            </p>
        </div>
    );
};

export const AtrasoEntregaImovelCalculator = () => {
    const [valorImovel, setValorImovel] = useState('');
    const [dataPrevista, setDataPrevista] = useState('');
    const [dataEfetiva, setDataEfetiva] = useState('');
    const [percentualMulta, setPercentualMulta] = useState('0.5');
    const [aluguelMensal, setAluguelMensal] = useState('');

    const [resultado, setResultado] = useState<{
        mesesAtraso: number;
        diasAtraso: number;
        valorMulta: number;
        valorIndenizacao: number;
        valorTotal: number;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const handleCalculate = () => {
        setError(null);
        setResultado(null);

        const vImovel = parseFloat(valorImovel);
        const pMulta = parseFloat(percentualMulta) / 100;
        const vAluguel = parseFloat(aluguelMensal || '0');

        if (isNaN(vImovel) || vImovel <= 0 || isNaN(pMulta) || pMulta < 0 || isNaN(vAluguel) || vAluguel < 0 || !dataPrevista || !dataEfetiva) {
            setError('Preencha os campos obrigatórios com valores válidos.');
            return;
        }

        const dPrevista = new Date(dataPrevista + 'T00:00:00');
        const dEfetiva = new Date(dataEfetiva + 'T00:00:00');

        if (dEfetiva <= dPrevista) {
            setResultado({ mesesAtraso: 0, diasAtraso: 0, valorMulta: 0, valorIndenizacao: 0, valorTotal: 0 });
            return;
        }

        const umDia = 1000 * 60 * 60 * 24;
        const diasDeAtrasoTotal = Math.floor((dEfetiva.getTime() - dPrevista.getTime()) / umDia);
        const mesesFracionados = diasDeAtrasoTotal / 30.44; // Média de dias no mês para o cálculo

        const displayMeses = Math.floor(diasDeAtrasoTotal / 30.44);
        const displayDias = Math.round(diasDeAtrasoTotal % 30.44);

        const valorMultaCalc = vImovel * pMulta * mesesFracionados;
        const valorIndenizacaoCalc = vAluguel * mesesFracionados;
        const valorTotalCalc = valorMultaCalc + valorIndenizacaoCalc;

        setResultado({
            mesesAtraso: displayMeses,
            diasAtraso: displayDias,
            valorMulta: valorMultaCalc,
            valorIndenizacao: valorIndenizacaoCalc,
            valorTotal: valorTotalCalc,
        });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor do Imóvel (R$)</label>
                    <input type="number" value={valorImovel} onChange={e => setValorImovel(e.target.value)} placeholder="Ex: 500000" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Multa Contratual (% a.m.)</label>
                    <input type="number" value={percentualMulta} onChange={e => setPercentualMulta(e.target.value)} placeholder="Ex: 0.5" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Prevista de Entrega</label>
                    <input type="date" value={dataPrevista} onChange={e => setDataPrevista(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Efetiva da Entrega</label>
                    <input type="date" value={dataEfetiva} onChange={e => setDataEfetiva(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Aluguel Mensal Pago no Período (R$)</label>
                    <input type="number" value={aluguelMensal} onChange={e => setAluguelMensal(e.target.value)} placeholder="Opcional: para lucros cessantes" className="w-full px-3 py-2 bg-slate-50 border rounded-md"/>
                </div>
            </div>
            <button onClick={handleCalculate} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">Calcular Indenização</button>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {resultado && (
                <div className="bg-slate-50 p-4 rounded-lg border">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Resultado Estimado:</h4>
                    <p className="text-sm text-slate-600 mb-3 text-center">Atraso total de <strong>{resultado.mesesAtraso}</strong> meses e <strong>{resultado.diasAtraso}</strong> dia(s).</p>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Valor da Multa Contratual:</span>
                            <span className="font-bold text-gray-800">{formatCurrency(resultado.valorMulta)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Indenização (Aluguel):</span>
                            <span className="font-bold text-gray-800">{formatCurrency(resultado.valorIndenizacao)}</span>
                        </div>
                        <hr className="my-2 border-slate-300"/>
                        <div className="flex justify-between items-center text-lg">
                            <span className="font-bold text-gray-800">Valor Total a Receber:</span>
                            <span className="font-bold text-indigo-700">{formatCurrency(resultado.valorTotal)}</span>
                        </div>
                    </div>
                </div>
            )}
            <p className="text-xs text-slate-500 text-center italic mt-4">
                <strong>Atenção:</strong> Este cálculo é uma estimativa. A possibilidade de cumular a multa contratual com lucros cessantes (aluguel) é tema de debate jurídico (Temas 970 e 971 do STJ). Este cálculo não inclui juros ou correção monetária. Consulte sempre um advogado.
            </p>
        </div>
    );
};