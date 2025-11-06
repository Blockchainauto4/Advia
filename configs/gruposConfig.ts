// configs/gruposConfig.ts

export interface WhatsAppGroup {
  name: string;
  description: string;
  link: string;
}

export interface StateGroups {
  stateName: string;
  uf: string;
  groups: WhatsAppGroup[];
}

export const gruposPorEstado: StateGroups[] = [
  {
    stateName: 'São Paulo',
    uf: 'SP',
    groups: [
      { name: 'Advocacia SP - Geral', description: 'Grupo geral para advogados de todo o estado de São Paulo.', link: 'https://chat.whatsapp.com/placeholder' },
      { name: 'Direito Digital SP', description: 'Discussões sobre Direito Digital, LGPD e tecnologia.', link: 'https://chat.whatsapp.com/placeholder2' },
      { name: 'Jovem Advocacia - São Paulo', description: 'Grupo focado nos desafios e oportunidades para advogados em início de carreira em SP.', link: 'https://chat.whatsapp.com/placeholder3' },
    ],
  },
  {
    stateName: 'Rio de Janeiro',
    uf: 'RJ',
    groups: [
        { name: 'Advogados RJ - Debates', description: 'Grupo para debates jurídicos e troca de experiências entre advogados do Rio de Janeiro.', link: 'https://chat.whatsapp.com/placeholder4' },
        { name: 'Direito Imobiliário RJ', description: 'Focado em discussões sobre o mercado e a legislação imobiliária no Rio.', link: 'https://chat.whatsapp.com/placeholder5' },
    ],
  },
   {
    stateName: 'Minas Gerais',
    uf: 'MG',
    groups: [
        { name: 'Advocacia Mineira', description: 'Networking e discussões gerais para a advocacia de Minas Gerais.', link: 'https://chat.whatsapp.com/placeholder6' },
        { name: 'Direito Previdenciário MG', description: 'Especialistas e estudantes de Direito Previdenciário em MG.', link: 'https://chat.whatsapp.com/placeholder7' },
    ],
  },
   {
    stateName: 'Bahia',
    uf: 'BA',
    groups: [
        { name: 'Advogados(as) da Bahia', description: 'Grupo para advogados e advogadas de todo o estado da Bahia.', link: 'https://chat.whatsapp.com/placeholder8' },
    ],
  },
  {
    stateName: 'Paraná',
    uf: 'PR',
    groups: [
        { name: 'Direito Trabalhista - Paraná', description: 'Grupo de discussão sobre temas do Direito do Trabalho no estado do Paraná.', link: 'https://chat.whatsapp.com/placeholder9' },
    ],
  },
  {
    stateName: 'Rio Grande do Sul',
    uf: 'RS',
    groups: [
        { name: 'Advocacia Gaúcha', description: 'Conexões e debates para advogados do Rio Grande do Sul.', link: 'https://chat.whatsapp.com/placeholder10' },
    ],
  },
  {
    stateName: 'Pernambuco',
    uf: 'PE',
    groups: [], // Exemplo de estado sem grupos cadastrados
  },
   {
    stateName: 'Ceará',
    uf: 'CE',
    groups: [
        { name: 'Advocacia Cearense - Geral', description: 'Grupo geral para profissionais do Ceará.', link: 'https://chat.whatsapp.com/placeholder11' },
    ],
  },
   {
    stateName: 'Distrito Federal',
    uf: 'DF',
    groups: [
        { name: 'Direito Administrativo DF', description: 'Discussões focadas em Direito Administrativo e concursos na capital federal.', link: 'https://chat.whatsapp.com/placeholder12' },
        { name: 'Advogados de Brasília', description: 'Grupo de networking para advogados atuantes no Distrito Federal.', link: 'https://chat.whatsapp.com/placeholder13' },
    ],
  },
  // Adicione outros estados conforme necessário
];
