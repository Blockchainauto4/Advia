import React from 'react';
// Fix: Remove .tsx extension from imports.
import { BriefcaseIcon, ScaleIcon, GavelIcon, HomeIcon, CarIcon } from '../components/Icons';
import { 
    DescontoINSSCalculator,
    TempoDeContribuicaoCalculator,
    PrazosProcessuaisCalculator,
    JurosCalculator,
    ProgressaoRegimeCalculator,
    PlacaVeiculoCalculator
} from '../calculators/index';

export interface Calculator {
  id: string;
  name: string;
  description: string;
  component: React.FC;
}

export interface CalculatorCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  calculators: Calculator[];
}

export const calculatorCategories: CalculatorCategory[] = [
  {
    id: 'trabalhista',
    title: 'Trabalhista',
    description: 'Cálculos essenciais de verbas rescisórias, horas extras, descontos e mais.',
    icon: React.createElement(BriefcaseIcon, { className: "w-8 h-8" }),
    calculators: [
      { id: 'desconto-inss', name: 'Cálculo de Desconto do INSS', description: 'Calcule o valor do desconto do INSS com base na tabela progressiva.', component: DescontoINSSCalculator },
    ],
  },
  {
    id: 'previdenciario',
    title: 'Previdenciário',
    description: 'Ferramentas para simular aposentadorias, tempo de contribuição e valor de benefícios.',
    icon: React.createElement(HomeIcon, { className: "w-8 h-8" }),
    calculators: [
        { id: 'tempo-contribuicao', name: 'Cálculo de Tempo de Contribuição', description: 'Some diferentes períodos de trabalho para saber seu tempo total de contribuição.', component: TempoDeContribuicaoCalculator },
    ],
  },
  {
    id: 'processual',
    title: 'Processual',
    description: 'Contagem de prazos em dias úteis ou corridos, conforme o código aplicável.',
    icon: React.createElement(GavelIcon, { className: "w-8 h-8" }),
    calculators: [
        { id: 'prazos-processuais', name: 'Contagem de Prazos Processuais', description: 'Calcule a data final de um prazo em dias úteis ou corridos, considerando feriados nacionais.', component: PrazosProcessuaisCalculator },
    ],
  },
  {
    id: 'civel-financeiro',
    title: 'Cível / Financeiro',
    description: 'Cálculos de juros, multas e outras obrigações financeiras.',
    icon: React.createElement(ScaleIcon, { className: "w-8 h-8" }),
    calculators: [
        { id: 'juros', name: 'Cálculo de Juros Simples e Compostos', description: 'Calcule juros simples e compostos sobre um valor principal.', component: JurosCalculator },
    ],
  },
  {
    id: 'penal',
    title: 'Execução Penal',
    description: 'Ferramentas para cálculo de progressão de regime e outros benefícios.',
    icon: React.createElement(GavelIcon, { className: "w-8 h-8" }),
    calculators: [
        { id: 'progressao-regime', name: 'Cálculo de Progressão de Regime', description: 'Estime a data provável para a progressão de regime com base na pena e fração.', component: ProgressaoRegimeCalculator },
    ],
  },
  {
    id: 'transito',
    title: 'Trânsito',
    description: 'Consultas e cálculos relacionados a veículos e legislação de trânsito.',
    icon: React.createElement(CarIcon, { className: "w-8 h-8" }),
    calculators: [
        { id: 'placa-veiculo', name: 'Consulta de Placa Veicular com Análise IA', description: 'Consulte dados de veículos e receba uma análise jurídica automatizada.', component: PlacaVeiculoCalculator },
    ],
  },
];