import React from 'react';
import {
    SimplesNacionalCalculator, HorasExtrasCalculator, RescisaoContratualCalculator, PrazosCPCCalculator,
    PrazosFazendaPublicaCalculator, PrazosPenaisCalculator, PrazosCLTCalculator, PrazosJECCalculator,
    CorrecaoMonetariaCalculator, MultaJurosCalculator, HonorariosSucumbenciaCalculator, PensaoAlimenticiaCalculator,
    ProgressaoRegimeCalculator, RemicaoPenaCalculator, TempoContribuicaoCalculator, AposentadoriaIdadeUrbanaCalculator,
    AposentadoriaTempoContribuicaoCalculator, AposentadoriaInvalidezCalculator, AposentadoriaEspecialCalculator,
    ContribuicoesRetroativasCalculator, IndenizacaoTempoContribuicaoCalculator, RMICalculator, FatorPrevidenciarioCalculator,
    PensaoPorMorteCalculator, AuxilioBeneficioIncapacidadeCalculator, BPCLOASCalculator, AtrasadosBeneficioCalculator,
    DPVATCalculator, SuspensaoCassacaoCNHCalculator, MultasTransitoCalculator, PontuacaoCNHCalculator,
    PerdaTotalVeiculoCalculator, AtualizacaoIPVACalculator, RestituicaoIPVACalculator, DanosMateriaisCalculator,
    LucrosCessantesCalculator, DanosMoraisCalculator, LiquidacaoVerbasCalculator, CorrecaoValorImovelCalculator,
    ParcelamentoFinanciamentoCalculator, AtrasoEntregaImovelCalculator
} from '../calculators';

import {
    CalculatorIcon, BriefcaseIcon, ClockIcon, DocumentTextIcon, ScaleIcon, UsersIcon, GavelIcon,
    ShieldCheckIcon, CarIcon, HomeIcon
} from '../components/Icons';

export interface Calculator {
  id: string;
  name: string;
  component: React.FC;
}

export interface CalculatorCategory {
    id: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    calculators: Calculator[];
}

export const calculatorCategories: CalculatorCategory[] = [
    {
        id: 'tributario',
        // FIX: Replaced JSX with React.createElement for use in a .ts file
        icon: React.createElement(CalculatorIcon, { className: "w-8 h-8" }),
        title: "Tributário e Fiscal",
        description: "Simples Nacional, IRPF, Lucro Presumido e mais.",
        calculators: [
            { id: 'simples-nacional', name: 'Simples Nacional', component: SimplesNacionalCalculator },
        ]
    },
    {
        id: 'trabalhista',
        // FIX: Replaced JSX with React.createElement for use in a .ts file
        icon: React.createElement(BriefcaseIcon, { className: "w-8 h-8" }),
        title: "Trabalhista",
        description: "Rescisão, horas extras, férias, FGTS e outros.",
        calculators: [
            { id: 'rescisao-contratual', name: 'Cálculo de Rescisão', component: RescisaoContratualCalculator },
            { id: 'horas-extras', name: 'Horas Extras', component: HorasExtrasCalculator },
            { id: 'liquidacao-verbas', name: 'Liquidação de Verbas', component: LiquidacaoVerbasCalculator },
        ]
    },
    {
        id: 'prazos',
        // FIX: Replaced JSX with React.createElement for use in a .ts file
        icon: React.createElement(ClockIcon, { className: "w-8 h-8" }),
        title: "Prazos Processuais",
        description: "Contagem de prazos do CPC, CLT, CPP e mais.",
        calculators: [
            { id: 'cpc-2015', name: 'Prazos CPC/2015', component: PrazosCPCCalculator },
            { id: 'fazenda-publica', name: 'Fazenda Pública', component: PrazosFazendaPublicaCalculator },
            { id: 'jec', name: 'Juizado Especial', component: PrazosJECCalculator },
            { id: 'clt', name: 'Prazos Trabalhistas (CLT)', component: PrazosCLTCalculator },
            { id: 'cpp', name: 'Prazos Penais (CPP)', component: PrazosPenaisCalculator },
        ]
    },
    {
        id: 'juros-correcao',
        icon: React.createElement(DocumentTextIcon, { className: "w-8 h-8" }),
        title: "Juros e Correção Monetária",
        description: "Correção, juros, multas e parcelamentos (Price e SAC).",
        calculators: [
            { id: 'correcao-monetaria', name: 'Correção e Juros', component: CorrecaoMonetariaCalculator },
            { id: 'multa-juros', name: 'Multa e Juros de Mora', component: MultaJurosCalculator },
            { id: 'parcelamento-financiamento', name: 'Parcelamento (Price e SAC)', component: ParcelamentoFinanciamentoCalculator },
        ]
    },
    {
        id: 'indenizacoes',
        icon: React.createElement(ScaleIcon, { className: "w-8 h-8" }),
        title: "Indenizações e Danos",
        description: "Calcule danos materiais, lucros cessantes e entenda os danos morais.",
        calculators: [
            { id: 'danos-materiais', name: 'Danos Materiais', component: DanosMateriaisCalculator },
            { id: 'lucros-cessantes', name: 'Lucros Cessantes', component: LucrosCessantesCalculator },
            { id: 'danos-morais', name: 'Danos Morais', component: DanosMoraisCalculator },
        ]
    },
    {
        id: 'imobiliario',
        icon: React.createElement(HomeIcon, { className: "w-8 h-8" }),
        title: "Direito Imobiliário",
        description: "Correção de valores, atraso na entrega, aluguéis, ITBI e mais.",
        calculators: [
            { id: 'correcao-valor-imovel', name: 'Correção Monetária de Imóvel', component: CorrecaoValorImovelCalculator },
            { id: 'atraso-entrega-imovel', name: 'Atraso na Entrega de Imóvel', component: AtrasoEntregaImovelCalculator },
        ]
    },
    {
        id: 'honorarios',
        // FIX: Replaced JSX with React.createElement for use in a .ts file
        icon: React.createElement(ScaleIcon, { className: "w-8 h-8" }),
        title: "Honorários e Custas",
        description: "Sucumbência, tabela OAB, custas judiciais.",
        calculators: [
            { id: 'sucumbencia', name: 'Honorários de Sucumbência', component: HonorariosSucumbenciaCalculator },
        ]
    },
    {
        id: 'familia',
        // FIX: Replaced JSX with React.createElement for use in a .ts file
        icon: React.createElement(UsersIcon, { className: "w-8 h-8" }),
        title: "Família e Sucessões",
        description: "Pensão alimentícia, partilha de bens e herança.",
        calculators: [
            { id: 'pensao-alimenticia', name: 'Pensão Alimentícia', component: PensaoAlimenticiaCalculator },
        ]
    },
    {
        id: 'penal',
        // FIX: Replaced JSX with React.createElement for use in a .ts file
        icon: React.createElement(GavelIcon, { className: "w-8 h-8" }),
        title: "Penal e Execução Penal",
        description: "Progressão de regime, prescrição e remição.",
        calculators: [
            { id: 'progressao-regime', name: 'Progressão de Regime', component: ProgressaoRegimeCalculator },
            { id: 'remicao-pena', name: 'Remição de Pena', component: RemicaoPenaCalculator },
        ]
    },
     {
        id: 'transito',
        // FIX: Replaced JSX with React.createElement for use in a .ts file
        icon: React.createElement(CarIcon, { className: "w-8 h-8" }),
        title: "Trânsito e Seguros",
        description: "Multas, pontuação CNH, IPVA e indenizações.",
        calculators: [
            { id: 'pontuacao-cnh', name: 'Pontuação da CNH', component: PontuacaoCNHCalculator },
            { id: 'multas-transito', name: 'Multas em Atraso', component: MultasTransitoCalculator },
            { id: 'atualizacao-ipva', name: 'Atualização de IPVA', component: AtualizacaoIPVACalculator },
            { id: 'perda-total', name: 'Indenização Perda Total', component: PerdaTotalVeiculoCalculator },
            { id: 'restituicao-ipva', name: 'Restituição de IPVA', component: RestituicaoIPVACalculator },
            { id: 'dpvat', name: 'Indenização DPVAT', component: DPVATCalculator },
            { id: 'suspensao-cnh', name: 'Suspensão/Cassação CNH', component: SuspensaoCassacaoCNHCalculator },
        ]
    },
    {
        id: 'previdenciario',
        // FIX: Replaced JSX with React.createElement for use in a .ts file
        icon: React.createElement(ShieldCheckIcon, { className: "w-8 h-8" }),
        title: "Previdenciário e INSS",
        description: "Tempo de contribuição, RMI e fator previdenciário.",
        calculators: [
            { id: 'tempo-contribuicao', name: 'Tempo de Contribuição', component: TempoContribuicaoCalculator },
            { id: 'aposentadoria-idade', name: 'Aposentadoria por Idade', component: AposentadoriaIdadeUrbanaCalculator },
            { id: 'rmi', name: 'Cálculo de RMI', component: RMICalculator },
            { id: 'fator-previdenciario', name: 'Fator Previdenciário', component: FatorPrevidenciarioCalculator },
            { id: 'pensao-morte', name: 'Pensão por Morte', component: PensaoPorMorteCalculator },
            { id: 'auxilio-incapacidade', name: 'Auxílio por Incapacidade', component: AuxilioBeneficioIncapacidadeCalculator },
            { id: 'bpc-loas', name: 'Análise BPC/LOAS', component: BPCLOASCalculator },
            { id: 'atrasados', name: 'Atrasados de Benefício', component: AtrasadosBeneficioCalculator },
            { id: 'aposentadoria-tempo', name: 'Aposentadoria por Tempo', component: AposentadoriaTempoContribuicaoCalculator },
            { id: 'aposentadoria-invalidez', name: 'Aposentadoria por Incapacidade', component: AposentadoriaInvalidezCalculator },
            { id: 'aposentadoria-especial', name: 'Aposentadoria Especial', component: AposentadoriaEspecialCalculator },
            { id: 'contribuicoes-retroativas', name: 'Contribuições Retroativas', component: ContribuicoesRetroativasCalculator },
            { id: 'indenizacao-tempo', name: 'Indenização de Tempo', component: IndenizacaoTempoContribuicaoCalculator },
        ]
    },
];