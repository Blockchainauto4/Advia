// Fix: Remove .ts extension from import.
import type { FormData } from '../types';
// Fix: Import `Type` enum for schema definitions.
import { Type } from '@google/genai';

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
      // Fix: Use `Type` enum.
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
        // Fix: Use `Type` enum.
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
        // Fix: Use `Type` enum.
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
        // Fix: Use `Type` enum.
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
  {
    value: 'contrato_compra_venda_imovel',
    label: 'Contrato de Compra e Venda de Imóvel',
    fields: [
        { id: 'vendedor', label: 'Vendedor(es)', placeholder: 'Ex: Carlos Pereira e Maria Pereira' },
        { id: 'comprador', label: 'Comprador(es)', placeholder: 'Ex: Ana Souza' },
        { id: 'imovel_endereco', label: 'Endereço do Imóvel', placeholder: 'Rua das Flores, 123, Bairro, Cidade-UF, CEP' },
        { id: 'imovel_matricula', label: 'Matrícula do Imóvel', placeholder: 'Nº 98.765 do 1º Cartório de Registro de Imóveis' },
        { id: 'valor_total', label: 'Valor Total da Venda', placeholder: 'R$ 500.000,00 (quinhentos mil reais)' },
        { id: 'forma_pagamento', label: 'Forma de Pagamento', placeholder: 'Sinal de R$ 50.000,00 e o restante na escritura.' },
        { id: 'localData', label: 'Local e Data', placeholder: 'Ex: Rio de Janeiro, 01 de Janeiro de 2024' },
    ],
    promptLabel: 'Descreva detalhes adicionais da transação',
    promptPlaceholder: 'Ex: O imóvel será entregue livre de quaisquer ônus ou dívidas. A posse será transferida ao comprador na data da assinatura da escritura pública. Em caso de desistência, a multa será de 10% do valor do contrato...',
    systemInstruction: `Você é um advogado especialista em direito imobiliário. Elabore as cláusulas para um contrato de compra e venda de imóvel. A resposta DEVE ser um objeto JSON com os campos "objeto", "preco_pagamento", "posse", "obrigacoes_vendedor", "obrigacoes_comprador", "clausula_penal".`,
    responseSchema: {
        type: Type.OBJECT,
        properties: {
          objeto: { type: Type.STRING, description: "Descrição detalhada do imóvel, incluindo endereço e matrícula." },
          preco_pagamento: { type: Type.STRING, description: "Valor total do negócio e a forma como será pago (sinal, parcelas, financiamento, etc.)." },
          posse: { type: Type.STRING, description: "Define quando o comprador receberá a posse do imóvel (na assinatura, na quitação, etc.)." },
          obrigacoes_vendedor: { type: Type.STRING, description: "Responsabilidades do vendedor, como entregar o imóvel livre de dívidas e apresentar certidões." },
          obrigacoes_comprador: { type: Type.STRING, description: "Responsabilidades do comprador, como realizar os pagamentos nas datas e arcar com custos de transferência." },
          clausula_penal: { type: Type.STRING, description: "Define a multa e as consequências em caso de descumprimento do contrato por qualquer uma das partes." },
        },
        required: ["objeto", "preco_pagamento", "posse", "obrigacoes_vendedor", "obrigacoes_comprador", "clausula_penal"],
    },
    formatOutput: (data) => `
INSTRUMENTO PARTICULAR DE COMPROMISSO DE COMPRA E VENDA DE IMÓVEL

VENDEDOR(ES): ${data.vendedor || '[Nome do Vendedor]'}, [qualificação completa].

COMPRADOR(ES): ${data.comprador || '[Nome do Comprador]'}, [qualificação completa].

Pelo presente instrumento, as partes têm entre si justo e contratado o compromisso de compra e venda do imóvel a seguir descrito, mediante as seguintes cláusulas e condições:

CLÁUSULA 1ª - DO OBJETO
${data.objeto || '[O objeto do contrato será gerado aqui, contendo a descrição do imóvel.]'}
PARÁGRAFO ÚNICO: O imóvel objeto do presente contrato encontra-se registrado sob a Matrícula nº ${data.imovel_matricula || '[Matrícula]'}, no competente Cartório de Registro de Imóveis.

CLÁUSULA 2ª - DO PREÇO E DA FORMA DE PAGAMENTO
O preço total da presente transação é de ${data.valor_total || '[Valor Total]'}.
${data.preco_pagamento || '[A forma de pagamento detalhada será gerada aqui.]'}

CLÁUSULA 3ª - DA POSSE
${data.posse || '[As condições da transferência de posse serão geradas aqui.]'}

CLÁUSULA 4ª - DAS OBRIGAÇÕES DO VENDEDOR
${data.obrigacoes_vendedor || '[As obrigações do vendedor serão geradas aqui.]'}

CLÁUSULA 5ª - DAS OBRIGAÇÕES DO COMPRADOR
${data.obrigacoes_comprador || '[As obrigações do comprador serão geradas aqui.]'}

CLÁUSULA 6ª - DA CLÁUSULA PENAL
${data.clausula_penal || '[A multa por descumprimento será gerada aqui.]'}

CLÁUSULA 7ª - DO FORO
Fica eleito o foro da situação do imóvel para dirimir quaisquer dúvidas oriundas do presente contrato.

E por estarem justos e contratados, assinam o presente em 2 (duas) vias de igual teor e forma.

${data.localData || '[Local], [Data]'}

___________________________________
${data.vendedor || '[Vendedor(es)]'}

___________________________________
${data.comprador || '[Comprador(es)]'}
    `.trim(),
  },
  {
    value: 'contrato_locacao_residencial',
    label: 'Contrato de Locação Residencial',
    fields: [
        { id: 'locador', label: 'Locador(a)', placeholder: 'Ex: Joana Martins' },
        { id: 'locatario', label: 'Locatário(a)', placeholder: 'Ex: Pedro Costa' },
        { id: 'imovel_endereco', label: 'Endereço do Imóvel', placeholder: 'Av. Brasil, 456, Apto 101, Cidade-UF' },
        { id: 'valor_aluguel', label: 'Valor do Aluguel (R$)', placeholder: 'Ex: R$ 2.500,00' },
        { id: 'prazo_locacao', label: 'Prazo da Locação (meses)', placeholder: 'Ex: 30' },
        { id: 'garantia', label: 'Garantia', placeholder: 'Ex: Caução de 3 meses, Fiador, Seguro Fiança' },
        { id: 'localData', label: 'Local e Data', placeholder: 'Ex: Belo Horizonte, 01 de Janeiro de 2024' },
    ],
    promptLabel: 'Descreva detalhes adicionais da locação',
    promptPlaceholder: 'Ex: O imóvel é para fins estritamente residenciais. O IPTU será pago pelo locador. O reajuste será anual pelo IPCA. Multa por rescisão antecipada de 3 aluguéis...',
    systemInstruction: `Você é um advogado especialista em direito imobiliário. Elabore as cláusulas para um contrato de locação residencial com base na Lei do Inquilinato (Lei 8.245/91). A resposta DEVE ser um objeto JSON com os campos "objeto", "prazo_vigencia", "valor_reajuste", "obrigacoes_locador", "obrigacoes_locatario", "garantia".`,
    responseSchema: {
        type: Type.OBJECT,
        properties: {
          objeto: { type: Type.STRING, description: "Descrição do imóvel locado e a finalidade da locação." },
          prazo_vigencia: { type: Type.STRING, description: "Define o prazo de duração do contrato e as condições de renovação ou término." },
          valor_reajuste: { type: Type.STRING, description: "Valor do aluguel, data de vencimento, forma de pagamento e o índice de reajuste anual." },
          obrigacoes_locador: { type: Type.STRING, description: "Deveres do proprietário, como entregar o imóvel em condições de uso e pagar taxas extraordinárias." },
          obrigacoes_locatario: { type: Type.STRING, description: "Deveres do inquilino, como pagar o aluguel em dia, zelar pelo imóvel e pagar despesas ordinárias." },
          garantia: { type: Type.STRING, description: "Detalha a modalidade de garantia escolhida para a locação (caução, fiador, seguro fiança, etc.)." },
        },
        required: ["objeto", "prazo_vigencia", "valor_reajuste", "obrigacoes_locador", "obrigacoes_locatario", "garantia"],
    },
    formatOutput: (data) => `
CONTRATO DE LOCAÇÃO RESIDENCIAL

LOCADOR(A): ${data.locador || '[Nome do Locador]'}, [qualificação completa].

LOCATÁRIO(A): ${data.locatario || '[Nome do Locatário]'}, [qualificação completa].

As partes acima qualificadas, pelo presente instrumento, ajustam a locação do imóvel abaixo descrito, que se regerá pela Lei nº 8.245/91 e pelas seguintes cláusulas e condições:

CLÁUSULA 1ª - DO OBJETO DA LOCAÇÃO
${data.objeto || '[O objeto do contrato será gerado aqui, descrevendo o imóvel.]'}

CLÁUSULA 2ª - DO PRAZO DE VIGÊNCIA
O prazo da presente locação é de ${data.prazo_locacao || '[Prazo]'} meses.
${data.prazo_vigencia || '[As condições de vigência, início e término serão geradas aqui.]'}

CLÁUSULA 3ª - DO VALOR DO ALUGUEL E REAJUSTE
O valor mensal do aluguel é de ${data.valor_aluguel || '[Valor do Aluguel]'}.
${data.valor_reajuste || '[As condições de pagamento e reajuste anual serão geradas aqui.]'}

CLÁUSULA 4ª - DAS OBRIGAÇÕES DO LOCADOR
${data.obrigacoes_locador || '[As obrigações do locador serão geradas aqui.]'}

CLÁUSULA 5ª - DAS OBRIGAÇÕES DO LOCATÁRIO
${data.obrigacoes_locatario || '[As obrigações do locatário serão geradas aqui.]'}

CLÁUSULA 6ª - DA GARANTIA
A presente locação é garantida por meio de ${data.garantia || '[Tipo de Garantia]'}.
${data.garantia_details || '[Os detalhes da garantia serão gerados aqui.]'}

CLÁUSULA 7ª - DO FORO
Fica eleito o foro da situação do imóvel para dirimir quaisquer dúvidas oriundas do presente contrato.

E por estarem justos e contratados, assinam o presente em 2 (duas) vias de igual teor e forma.

${data.localData || '[Local], [Data]'}

___________________________________
${data.locador || '[Locador(a)]'}

___________________________________
${data.locatario || '[Locatário(a)]'}
    `.trim(),
  },
];