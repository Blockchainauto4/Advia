import { Type } from "@google/genai";
import type { FormData } from './types';

export interface DocumentField {
  id: string;
  label: string;
  placeholder: string;
}

export interface DocumentConfig {
  value: string;
  label: string;
  fields: DocumentField[];
  promptLabel: string;
  promptPlaceholder: string;
  systemInstruction: string;
  responseSchema: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  formatOutput: (data: FormData) => string;
}

export const documentConfigs: DocumentConfig[] = [
  {
    value: '',
    label: 'Selecione o tipo de documento...',
    fields: [],
    promptLabel: '',
    promptPlaceholder: '',
    systemInstruction: '',
    responseSchema: {},
    formatOutput: () => 'Selecione um tipo de documento para começar.',
  },
  {
    value: 'parecer_juridico',
    label: 'Parecer Jurídico',
    fields: [
      { id: 'interessado', label: 'Interessado', placeholder: 'Ex: Empresa X S.A.' },
      { id: 'assunto', label: 'Assunto', placeholder: 'Ex: Legalidade de Taxa' },
      { id: 'localData', label: 'Local e Data', placeholder: 'Ex: São Paulo, 01 de Janeiro de 2024' },
      { id: 'advogado', label: 'Nome do Advogado(a)', placeholder: 'Ex: Dr(a). Nome Sobrenome' },
      { id: 'oab', label: 'Nº OAB', placeholder: 'Ex: OAB/SP 123.456' },
    ],
    promptLabel: 'Descreva a consulta para o parecer',
    promptPlaceholder: 'Ex: Discorra sobre a legalidade da cobrança de taxa de conveniência na venda de ingressos online para eventos, considerando o Código de Defesa do Consumidor.',
    systemInstruction: `Você é um assistente jurídico especialista em redigir pareceres. Sua resposta DEVE ser um objeto JSON válido com os campos "ementa", "relatorio", "fundamentacao" e "conclusao".`,
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        ementa: { type: Type.STRING, description: "Resumo conciso do parecer." },
        relatorio: { type: Type.STRING, description: "Descrição objetiva dos fatos." },
        fundamentacao: { type: Type.STRING, description: "Análise jurídica aprofundada." },
        conclusao: { type: Type.STRING, description: "Opinião final, clara e direta." },
      },
      required: ["ementa", "relatorio", "fundamentacao", "conclusao"],
    },
    formatOutput: (data) => `
PARECER JURÍDICO

INTERESSADO: ${data.interessado || '[Preencher Interessado]'}
ASSUNTO: ${data.assunto || '[Preencher Assunto]'}

I - EMENTA
${data.ementa || '[A Ementa será gerada aqui]'}

II - RELATÓRIO
${data.relatorio || '[O Relatório será gerado aqui]'}

III - FUNDAMENTAÇÃO
${data.fundamentacao || '[A Fundamentação será gerada aqui]'}

IV - CONCLUSÃO
${data.conclusao || '[A Conclusão será gerada aqui]'}

É o parecer.

${data.localData || '[Local], [Data]'}

___________________________________
${data.advogado || '[Nome do Advogado]'}
${data.oab || '[OAB/UF XXXXX]'}
    `.trim(),
  },
  {
    value: 'peticao_inicial',
    label: 'Petição Inicial',
    fields: [
        { id: 'comarca', label: 'Comarca', placeholder: 'Ex: Comarca de São Paulo - SP' },
        { id: 'requerente', label: 'Requerente', placeholder: 'Ex: João da Silva' },
        { id: 'requerido', label: 'Requerido', placeholder: 'Ex: Empresa Y Ltda.' },
        { id: 'causa', label: 'Valor da Causa', placeholder: 'Ex: R$ 5.000,00' },
        { id: 'localData', label: 'Local e Data', placeholder: 'Ex: São Paulo, 01 de Janeiro de 2024' },
        { id: 'advogado', label: 'Nome do Advogado(a)', placeholder: 'Ex: Dr(a). Nome Sobrenome' },
        { id: 'oab', label: 'Nº OAB', placeholder: 'Ex: OAB/SP 123.456' },
    ],
    promptLabel: 'Descreva os fatos e o direito do Requerente',
    promptPlaceholder: 'Ex: O Requerente comprou um produto da Requerida que apresentou defeito em uma semana. A Requerida se nega a trocar o produto, violando o Art. 18 do CDC...',
    systemInstruction: `Você é um advogado experiente elaborando uma petição inicial. Sua resposta DEVE ser um objeto JSON com os campos "fatos", "direito" e "pedidos".`,
    responseSchema: {
        type: Type.OBJECT,
        properties: {
          fatos: { type: Type.STRING, description: "Narra a sequência dos acontecimentos de forma clara e cronológica." },
          direito: { type: Type.STRING, description: "Apresenta os fundamentos jurídicos que amparam a pretensão do autor." },
          pedidos: { type: Type.STRING, description: "Lista de forma clara e específica o que se pede ao juízo (ex: citação do réu, procedência do pedido, condenação em custas)." },
        },
        required: ["fatos", "direito", "pedidos"],
    },
    formatOutput: (data) => `
EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA ___ VARA CÍVEL DA COMARCA DE ${data.comarca || '[Comarca]'}

${data.requerente || '[Nome do Requerente]'}, [qualificação completa], por seu advogado que esta subscreve, vem, respeitosamente, à presença de Vossa Excelência, propor a presente

AÇÃO DE [NOME DA AÇÃO]

em face de ${data.requerido || '[Nome do Requerido]'}, [qualificação completa], pelos fatos e fundamentos a seguir expostos.

I - DOS FATOS
${data.fatos || '[Os fatos serão gerados aqui]'}

II - DO DIREITO
${data.direito || '[O direito será gerado aqui]'}

III - DOS PEDIDOS
${data.pedidos || '[Os pedidos serão gerados aqui]'}

Dá-se à causa o valor de ${data.causa || '[Valor da Causa]'}.

Termos em que,
Pede deferimento.

${data.localData || '[Local], [Data]'}

___________________________________
${data.advogado || '[Nome do Advogado]'}
${data.oab || '[OAB/UF XXXXX]'}
    `.trim(),
  },
  {
    value: 'contestacao',
    label: 'Contestação',
    fields: [
        { id: 'processo', label: 'Nº do Processo', placeholder: 'Ex: 0001234-56.2024.8.26.0100' },
        { id: 'autor', label: 'Autor', placeholder: 'Ex: João da Silva' },
        { id: 'reu', label: 'Réu', placeholder: 'Ex: Empresa Y Ltda.' },
        { id: 'localData', label: 'Local e Data', placeholder: 'Ex: São Paulo, 01 de Janeiro de 2024' },
        { id: 'advogado', label: 'Nome do Advogado(a)', placeholder: 'Ex: Dr(a). Nome Sobrenome' },
        { id: 'oab', label: 'Nº OAB', placeholder: 'Ex: OAB/SP 123.456' },
    ],
    promptLabel: 'Descreva os argumentos de defesa do Réu',
    promptPlaceholder: 'Ex: O produto não apresentou defeito, mas sim mau uso pelo Autor, conforme laudo técnico anexo. Impugna-se o pedido de danos morais por ausência de ato ilícito...',
    systemInstruction: `Você é um advogado redigindo uma contestação. Sua resposta DEVE ser um objeto JSON com os campos "preliminares", "merito" e "requerimentos".`,
    responseSchema: {
        type: Type.OBJECT,
        properties: {
          preliminares: { type: Type.STRING, description: "Argumentos processuais que podem levar à extinção do processo sem análise do mérito (ex: inépcia da inicial, ilegitimidade de parte)." },
          merito: { type: Type.STRING, description: "Defesa central, rebatendo os fatos e fundamentos apresentados pelo autor e expondo as razões do réu." },
          requerimentos: { type: Type.STRING, description: "Pedidos feitos ao juiz (ex: acolhimento das preliminares, improcedência da ação, condenação do autor em sucumbência)." },
        },
        required: ["preliminares", "merito", "requerimentos"],
    },
    formatOutput: (data) => `
EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA ___ VARA CÍVEL DA COMARCA DE [Comarca]

Processo nº: ${data.processo || '[Nº do Processo]'}

${data.reu || '[Nome do Réu]'}, já qualificado nos autos da AÇÃO [NOME DA AÇÃO] que lhe move ${data.autor || '[Nome do Autor]'}, vem, por seu advogado, apresentar sua

CONTESTAÇÃO

pelos fatos e fundamentos que passa a expor.

I - DAS PRELIMINARES
${data.preliminares || '[As preliminares serão geradas aqui]'}

II - DO MÉRITO
${data.merito || '[A defesa de mérito será gerada aqui]'}

III - DOS REQUERIMENTOS
${data.requerimentos || '[Os requerimentos serão gerados aqui]'}

Termos em que,
Pede deferimento.

${data.localData || '[Local], [Data]'}

___________________________________
${data.advogado || '[Nome do Advogado]'}
${data.oab || '[OAB/UF XXXXX]'}
    `.trim(),
  },
  {
    value: 'contrato_servicos',
    label: 'Contrato de Prestação de Serviços',
    fields: [
        { id: 'contratante', label: 'Contratante', placeholder: 'Ex: Empresa ABC Ltda.' },
        { id: 'contratada', label: 'Contratada', placeholder: 'Ex: Profissional Independente MEI' },
        { id: 'valor', label: 'Valor do Contrato', placeholder: 'Ex: R$ 10.000,00' },
        { id: 'foro', label: 'Foro de Eleição', placeholder: 'Ex: Foro da Comarca de Curitiba - PR' },
        { id: 'localData', label: 'Local e Data', placeholder: 'Ex: Curitiba, 01 de Janeiro de 2024' },
    ],
    promptLabel: 'Descreva o objeto, as obrigações e o prazo do serviço',
    promptPlaceholder: 'Ex: Objeto: criação de um website institucional. Obrigações da Contratada: desenvolver o layout, programar as funcionalidades e entregar o site em 30 dias. Obrigações da Contratante: fornecer o conteúdo e aprovar o layout...',
    systemInstruction: `Você é um especialista em contratos. Gere o conteúdo para um contrato de prestação de serviços. A resposta DEVE ser um objeto JSON com os campos "objeto", "obrigacoes_contratada", "obrigacoes_contratante", "prazo_pagamento", "rescisao".`,
    responseSchema: {
        type: Type.OBJECT,
        properties: {
          objeto: { type: Type.STRING, description: "Descrição clara e detalhada dos serviços que serão prestados." },
          obrigacoes_contratada: { type: Type.STRING, description: "Lista das responsabilidades e deveres da parte que prestará o serviço." },
          obrigacoes_contratante: { type: Type.STRING, description: "Lista das responsabilidades e deveres da parte que está contratando o serviço." },
          prazo_pagamento: { type: Type.STRING, description: "Define o prazo, a forma e as condições de pagamento do valor acordado." },
          rescisao: { type: Type.STRING, description: "Estabelece as condições sob as quais o contrato pode ser encerrado por qualquer uma das partes, incluindo possíveis multas." },
        },
        required: ["objeto", "obrigacoes_contratada", "obrigacoes_contratante", "prazo_pagamento", "rescisao"],
    },
    formatOutput: (data) => `
CONTRATO DE PRESTAÇÃO DE SERVIÇOS

CONTRATANTE: ${data.contratante || '[Nome da Contratante]'}, [qualificação completa].

CONTRATADA: ${data.contratada || '[Nome da Contratada]'}, [qualificação completa].

As partes acima identificadas têm, entre si, justo e acertado o presente Contrato de Prestação de Serviços, que se regerá pelas cláusulas seguintes.

CLÁUSULA 1ª - DO OBJETO
${data.objeto || '[O objeto do contrato será gerado aqui]'}

CLÁUSULA 2ª - DAS OBRIGAÇÕES DA CONTRATADA
${data.obrigacoes_contratada || '[As obrigações da contratada serão geradas aqui]'}

CLÁUSULA 3ª - DAS OBRIGAÇÕES DA CONTRATANTE
${data.obrigacoes_contratante || '[As obrigações da contratante serão geradas aqui]'}

CLÁUSULA 4ª - DO PRAZO E DO PAGAMENTO
Pela prestação dos serviços, a CONTRATANTE pagará à CONTRATADA o valor de ${data.valor || '[Valor do Contrato]'}.
${data.prazo_pagamento || '[O prazo e a forma de pagamento serão gerados aqui]'}

CLÁUSULA 5ª - DA RESCISÃO
${data.rescisao || '[As condições de rescisão serão geradas aqui]'}

CLÁUSULA 6ª - DO FORO
Fica eleito o foro de ${data.foro || '[Foro de Eleição]'} para dirimir quaisquer controvérsias oriundas deste contrato.

E, por estarem assim justas e contratadas, assinam o presente instrumento em 2 (duas) vias de igual teor.

${data.localData || '[Local], [Data]'}


___________________________________
${data.contratante || '[Contratante]'}


___________________________________
${data.contratada || '[Contratada]'}
    `.trim(),
  },
];
