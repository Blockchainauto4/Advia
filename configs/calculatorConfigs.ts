import React from 'react';
import { BriefcaseIcon, ScaleIcon, CalculatorIcon, GavelIcon, CarIcon, HomeIcon } from '../components/Icons.tsx';
// FIX: Removed imports for calculator components that are not implemented.
// Only DescontoINSSCalculator and PlacaVeiculoCalculator are currently available.
import { 
    DescontoINSSCalculator,
    PlacaVeiculoCalculator,
    TempoDeContribuicaoCalculator,
    ContribuicaoEmAtrasoCalculator,
    BpcLoasEligibilityChecker
} from '../calculators/index.tsx';

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
    calculators: [],
  },
  {
    id: 'previdenciario',
    title: 'Previdenciário',
    description: 'Ferramentas para simular aposentadorias, tempo de contribuição e valor de benefícios.',
    icon: React.createElement(HomeIcon, { className: "w-8 h-8" }),
    calculators: [
      { id: 'desconto-inss', name: 'Cálculo de Desconto do INSS', description: 'Calcule o valor do desconto do INSS com base na tabela progressiva.', component: DescontoINSSCalculator },
      { id: 'tempo-contribuicao', name: 'Cálculo de Tempo de Contribuição', description: 'Some diferentes períodos para obter o tempo total de contribuição.', component: TempoDeContribuicaoCalculator },
      { id: 'contribuicao-atraso', name: 'Cálculo de Contribuição em Atraso', description: 'Simule os acréscimos de multa e juros para contribuições pagas fora do prazo.', component: ContribuicaoEmAtrasoCalculator },
      { id: 'bpc-loas', name: 'Verificador de Elegibilidade BPC/LOAS', description: 'Verifique se você atende aos critérios básicos para o Benefício de Prestação Continuada.', component: BpcLoasEligibilityChecker },
    ],
  },
  {
    id: 'processual',
    title: 'Processual',
    description: 'Contagem de prazos em dias úteis ou corridos, conforme o código aplicável.',
    icon: React.createElement(GavelIcon, { className: "w-8 h-8" }),
    calculators: [],
  },
  {
    id: 'civel-tributario',
    title: 'Cível e Tributário',
    description: 'Cálculos de honorários, pensão, correções monetárias, juros e impostos.',
    icon: React.createElement(ScaleIcon, { className: "w-8 h-8" }),
    calculators: [],
  },
  {
    id: 'penal',
    title: 'Execução Penal',
    description: 'Cálculos de progressão de regime e remição de pena.',
    icon: React.createElement(GavelIcon, { className: "w-8 h-8" }),
    calculators: []
  },
  {
    id: 'transito-seguros',
    title: 'Trânsito e Seguros',
    description: 'Ferramentas para infrações de trânsito, seguros de veículos e IPVA.',
    icon: React.createElement(CarIcon, { className: "w-8 h-8" }),
    calculators: [
      { id: 'consulta-placa', name: 'Consulta de Placa Veicular', description: 'Consulte a situação da vistoria e receba análise jurídica da IA.', component: PlacaVeiculoCalculator },
    ],
  }
];