import React from 'react';
import { BriefcaseIcon, ScaleIcon, CalculatorIcon, GavelIcon, CarIcon, HomeIcon } from '../components/Icons';
import { 
    SimplesNacionalCalculator, HorasExtrasCalculator, RescisaoContratualCalculator, LiquidacaoVerbasCalculator,
    PrazosCPCCalculator, PrazosFazendaPublicaCalculator, PrazosPenaisCalculator, PrazosCLTCalculator, PrazosJECCalculator,
    HonorariosSucumbenciaCalculator, PensaoAlimenticiaCalculator, ProgressaoRegimeCalculator, RemicaoPenaCalculator, DanosMoraisCalculator,
    CorrecaoMonetariaCalculator, MultaJurosCalculator, ParcelamentoFinanciamentoCalculator,
    AposentadoriaIdadeUrbanaCalculator, TempoContribuicaoCalculator, RMICalculator, FatorPrevidenciarioCalculator, PensaoPorMorteCalculator, AuxilioBeneficioIncapacidadeCalculator, BPCLOASCalculator, AtrasadosBeneficioCalculator,
    SimulacaoAposentadoriaCompleta, AposentadoriaTempoContribuicaoCalculator, AposentadoriaInvalidezCalculator, AposentadoriaEspecialCalculator, ContribuicoesRetroativasCalculator, IndenizacaoTempoContribuicaoCalculator,
    DPVATCalculator, SuspensaoCassacaoCNHCalculator, MultasTransitoCalculator, PontuacaoCNHCalculator, PerdaTotalVeiculoCalculator, AtualizacaoIPVACalculator, RestituicaoIPVACalculator,
    DanosMateriaisCalculator, LucrosCessantesCalculator, CorrecaoValorImovelCalculator, AtrasoEntregaImovelCalculator, DescontoINSSCalculator, PlacaVeiculoCalculator, SeguroVeiculoCalculator
} from '../calculators';

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
      { id: 'rescisao', name: 'Cálculo de Rescisão Contratual', description: 'Simule os valores de uma rescisão (sem justa causa, pedido de demissão, etc).', component: RescisaoContratualCalculator },
      { id: 'horas-extras', name: 'Cálculo de Horas Extras e DSR', description: 'Calcule o valor das horas extras com 50% e 100% e seu reflexo no DSR.', component: HorasExtrasCalculator },
      { id: 'desconto-inss', name: 'Cálculo de Desconto do INSS', description: 'Calcule o valor do desconto do INSS com base na tabela progressiva.', component: DescontoINSSCalculator },
      { id: 'liquidacao-verbas', name: 'Liquidação Rápida de Verbas', description: 'Some diversas rubricas para obter um valor bruto total de forma rápida.', component: LiquidacaoVerbasCalculator },
    ],
  },
  {
    id: 'previdenciario',
    title: 'Previdenciário',
    description: 'Ferramentas para simular aposentadorias, tempo de contribuição e valor de benefícios.',
    icon: React.createElement(HomeIcon, { className: "w-8 h-8" }),
    calculators: [
      { id: 'tempo-contribuicao', name: 'Cálculo de Tempo de Contribuição', description: 'Some múltiplos períodos para determinar o tempo total de contribuição.', component: TempoContribuicaoCalculator },
      { id: 'aposentadoria-idade', name: 'Verificação de Aposentadoria por Idade', description: 'Confira se os requisitos de idade e tempo para aposentadoria urbana foram atingidos.', component: AposentadoriaIdadeUrbanaCalculator },
      { id: 'rmi', name: 'Cálculo de Renda Mensal Inicial (RMI)', description: 'Estime o valor inicial da aposentadoria com base na média dos salários e tempo de contribuição.', component: RMICalculator },
      { id: 'atrasados', name: 'Cálculo de Benefícios em Atraso', description: 'Calcule o valor devido de benefícios não pagos, com correção e juros.', component: AtrasadosBeneficioCalculator },
      { id: 'bpc-loas', name: 'Análise de Renda para BPC/LOAS', description: 'Verifique se a renda familiar per capita atende ao critério para o benefício.', component: BPCLOASCalculator },
      { id: 'pensao-morte', name: 'Cálculo de Pensão por Morte', description: 'Estime o valor da pensão com base no benefício do falecido e número de dependentes.', component: PensaoPorMorteCalculator },
      { id: 'auxilio-incapacidade', name: 'Cálculo de Auxílio por Incapacidade', description: 'Calcule o valor do benefício limitado pela média dos últimos 12 salários.', component: AuxilioBeneficioIncapacidadeCalculator },
      { id: 'fator-previdenciario', name: 'Cálculo do Fator Previdenciário', description: 'Calcule o fator usado em algumas regras de transição de aposentadoria.', component: FatorPrevidenciarioCalculator },
      { id: 'simulacao-completa', name: 'Simulação Completa de Aposentadoria', description: 'Análise detalhada de todas as regras e cálculo de RMI (Recomendado uso do Meu INSS).', component: SimulacaoAposentadoriaCompleta },
    ],
  },
  {
    id: 'processual',
    title: 'Processual',
    description: 'Contagem de prazos em dias úteis ou corridos, conforme o código aplicável.',
    icon: React.createElement(GavelIcon, { className: "w-8 h-8" }),
    calculators: [
      { id: 'prazos-cpc', name: 'Contagem de Prazos (CPC)', description: 'Calcule prazos processuais em dias úteis, considerando o recesso forense.', component: PrazosCPCCalculator },
      { id: 'prazos-clt', name: 'Contagem de Prazos (CLT)', description: 'Calcule prazos trabalhistas em dias úteis, conforme a CLT.', component: PrazosCLTCalculator },
      { id: 'prazos-jec', name: 'Contagem de Prazos (Juizados Especiais)', description: 'Calcule prazos dos Juizados Especiais Cíveis (dias úteis).', component: PrazosJECCalculator },
      { id: 'prazos-penais', name: 'Contagem de Prazos (Processo Penal)', description: 'Calcule prazos processuais penais em dias corridos, conforme o CPP.', component: PrazosPenaisCalculator },
      { id: 'prazos-fazenda', name: 'Contagem de Prazos (Fazenda Pública)', description: 'Calcule prazos em dobro para a Fazenda Pública, em dias úteis.', component: PrazosFazendaPublicaCalculator },
    ],
  },
  {
    id: 'civel-tributario',
    title: 'Cível e Tributário',
    description: 'Cálculos de honorários, pensão, correções monetárias, juros e impostos.',
    icon: React.createElement(ScaleIcon, { className: "w-8 h-8" }),
    calculators: [
      { id: 'correcao-monetaria', name: 'Correção Monetária e Juros', description: 'Atualize valores com índice de correção e juros simples ou compostos.', component: CorrecaoMonetariaCalculator },
      { id: 'multa-juros', name: 'Multa e Juros por Atraso', description: 'Calcule o valor atualizado de uma dívida com multa e juros de mora.', component: MultaJurosCalculator },
      { id: 'honorarios', name: 'Honorários de Sucumbência', description: 'Calcule o valor dos honorários com base no valor da causa ou condenação.', component: HonorariosSucumbenciaCalculator },
      { id: 'pensao-alimenticia', name: 'Pensão Alimentícia (Estimativa)', description: 'Estime o valor da pensão com base na renda e percentual comum.', component: PensaoAlimenticiaCalculator },
      { id: 'simples-nacional', name: 'Simples Nacional (Anexo III)', description: 'Calcule o valor do imposto mensal para empresas de serviços (advocacia).', component: SimplesNacionalCalculator },
      { id: 'danos-materiais', name: 'Soma de Danos Materiais', description: 'Some todos os prejuízos e despesas para obter o valor total da indenização.', component: DanosMateriaisCalculator },
      { id: 'lucros-cessantes', name: 'Cálculo de Lucros Cessantes', description: 'Estime o valor que se deixou de ganhar devido a um evento danoso.', component: LucrosCessantesCalculator },
      { id: 'parcelamento', name: 'Parcelamento (Price e SAC)', description: 'Simule financiamentos e veja a evolução do saldo devedor.', component: ParcelamentoFinanciamentoCalculator },
    ],
  },
  {
    id: 'penal',
    title: 'Execução Penal',
    description: 'Cálculos de progressão de regime e remição de pena.',
    icon: React.createElement(GavelIcon, { className: "w-8 h-8" }),
    calculators: [
        { id: 'progressao-regime', name: 'Cálculo de Progressão de Regime', description: 'Estime a data em que o apenado terá direito a progredir de regime.', component: ProgressaoRegimeCalculator },
        { id: 'remicao-pena', name: 'Cálculo de Remição de Pena', description: 'Calcule quantos dias serão remidos da pena por trabalho ou estudo.', component: RemicaoPenaCalculator },
    ]
  },
  {
    id: 'transito-seguros',
    title: 'Trânsito e Seguros',
    description: 'Ferramentas para infrações de trânsito, seguros de veículos e IPVA.',
    icon: React.createElement(CarIcon, { className: "w-8 h-8" }),
    calculators: [
      { id: 'consulta-placa', name: 'Consulta de Placa Veicular', description: 'Consulte a situação da vistoria e receba análise jurídica da IA.', component: PlacaVeiculoCalculator },
      { id: 'pontuacao-cnh', name: 'Pontuação da CNH', description: 'Some as infrações e verifique o limite de pontos para suspensão.', component: PontuacaoCNHCalculator },
      { id: 'multas-transito', name: 'Atualização de Multas de Trânsito', description: 'Estime o valor de multas pagas com atraso, incluindo juros e correção.', component: MultasTransitoCalculator },
      { id: 'seguro-veiculo', name: 'Estimativa de Seguro Veicular', description: 'Simule o valor aproximado do seguro com base no valor e idade do veículo.', component: SeguroVeiculoCalculator },
      { id: 'ipva-atrasado', name: 'Atualização de IPVA Atrasado', description: 'Calcule o valor de um IPVA pago fora do prazo, com multa e juros.', component: AtualizacaoIPVACalculator },
      { id: 'restituicao-ipva', name: 'Restituição de IPVA (Sinistro)', description: 'Calcule o valor a ser restituído em caso de perda total por roubo ou furto.', component: RestituicaoIPVACalculator },
      { id: 'perda-total', name: 'Indenização por Perda Total', description: 'Calcule o valor da indenização do seguro com base na FIPE e apólice.', component: PerdaTotalVeiculoCalculator },
    ],
  }
];