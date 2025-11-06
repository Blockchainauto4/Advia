import React from 'react';
import { PlacaVeiculoCalculator } from '../calculators';
import { CepConsultor, CnpjConsultor } from '../consultas';
import { CarIcon, MapPinIcon, BriefcaseIcon } from '../components/Icons';

export interface Consulta {
  id: string;
  name: string;
  description: string;
  component: React.FC;
  icon: React.ReactNode;
}

export const consultas: Consulta[] = [
    {
        id: 'placa-veiculo',
        name: 'Consulta de Placa Veicular',
        description: 'Consulte informações de vistoria de veículos em tempo real e receba uma análise jurídica da IA.',
        component: PlacaVeiculoCalculator,
        icon: React.createElement(CarIcon, { className: "w-8 h-8" })
    },
    {
        id: 'cep',
        name: 'Consulta de CEP',
        description: 'Busque endereços completos a partir de um Código de Endereçamento Postal (CEP).',
        component: CepConsultor,
        icon: React.createElement(MapPinIcon, { className: "w-8 h-8" })
    },
    {
        id: 'cnpj',
        name: 'Consulta de CNPJ',
        description: 'Obtenha dados cadastrais de Pessoas Jurídicas diretamente da Receita Federal.',
        component: CnpjConsultor,
        icon: React.createElement(BriefcaseIcon, { className: "w-8 h-8" })
    }
];
