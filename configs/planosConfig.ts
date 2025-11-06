// FIX: Import Plan type from the central types file.
import type { Plan } from '../types';

export const planos: Plan[] = [
  {
    id: 'basico_mensal',
    name: 'Plano Básico',
    price: 40,
    description: 'Ideal para estudantes e advogados em início de carreira.',
    features: [
      'Acesso ao Chat IA para consultas básicas',
      'Gerador de Documentos (até 5 por mês)',
      'Acesso a todas as Calculadoras Jurídicas',
      'Suporte via Email',
    ],
    highlight: false,
    trialDays: 3,
  },
  {
    id: 'profissional_mensal',
    name: 'Plano Profissional',
    price: 80,
    description: 'A melhor opção para advogados autônomos e pequenos escritórios.',
    features: [
      'Acesso Ilimitado ao Chat IA',
      'Gerador de Documentos (até 20 por mês)',
      'Acesso a todas as Calculadoras Jurídicas',
      'Futuros recursos avançados de IA',
      'Suporte Prioritário via Email',
    ],
    highlight: true,
    trialDays: 3,
  },
  {
    id: 'premium_mensal',
    name: 'Plano Premium',
    price: 150,
    description: 'Para escritórios que precisam de acesso irrestrito e suporte dedicado.',
    features: [
      'Acesso Ilimitado ao Chat IA',
      'Gerador de Documentos Ilimitado',
      'Acesso a todas as Calculadoras Jurídicas',
      'Futuros recursos avançados de IA',
      'Acesso antecipado a novas funcionalidades',
      'Suporte Dedicado (Chat e Telefone)',
    ],
    highlight: false,
    trialDays: 3,
  },
];
