// configs/documentConfigs.ts
import type { FormData } from '../types.ts';
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
  {
    value: 'contrato_honorarios',
    label: 'Contrato de Honorários Advocatícios',
    fields: [
        { id: 'contratante', label: 'Contratante (Cliente)', placeholder: 'Ex: José da Silva' },
        { id: 'contratado', label: 'Contratado (Advogado/Escritório)', placeholder: 'Ex: Nome do Advogado ou Escritório de Advocacia' },
        { id: 'oab', label: 'Nº OAB do Advogado', placeholder: 'Ex: OAB/SP 123.456' },
        { id: 'objeto', label: 'Objeto do Contrato', placeholder: 'Ex: Propositura de Ação de Alimentos' },
        { id: 'valor_honorarios', label: 'Valor dos Honorários', placeholder: 'Ex: R$ 3.000,00 mais 20% sobre o êxito' },
        { id: 'foro', label: 'Foro de Eleição', placeholder: 'Ex: Foro da Comarca de São Paulo - SP' },
        { id: 'localData', label: 'Local e Data', placeholder: 'Ex: São Paulo, 01 de Janeiro de 2024' },
    ],
    promptLabel: 'Detalhes sobre a forma de pagamento e cláusulas específicas',
    promptPlaceholder: 'Ex: Pagamento de R$1.000,00 de entrada e o restante em 4 parcelas. Os honorários de êxito incidirão sobre o valor da condenação. Prever multa de 2% em caso de atraso. Cláusula de confidencialidade...',
    systemInstruction: 'Você é um advogado especialista em contratos de honorários. Gere as cláusulas principais com base nos detalhes fornecidos. A resposta DEVE ser um objeto JSON com os campos "clausula_pagamento", "clausula_rescisao", "clausula_riscos".',
    responseSchema: {
        type: Type.OBJECT,
        properties: {
            clausula_pagamento: { type: Type.STRING, description: "Detalha a forma, as datas e as condições de pagamento dos honorários, incluindo parcelamentos e honorários de sucumbência e de êxito." },
            clausula_rescisao: { type: Type.STRING, description: "Estabelece as condições para a rescisão do contrato por qualquer uma das partes, e as penalidades ou honorários devidos em tal caso." },
            clausula_riscos: { type: Type.STRING, description: "Esclarece que a contratação é de meio e não de resultado, e informa sobre os custos processuais." },
        },
        required: ["clausula_pagamento", "clausula_rescisao", "clausula_riscos"],
    },
    formatOutput: (data) => `
CONTRATO DE HONORÁRIOS ADVOCATÍCIOS

CONTRATANTE: ${data.contratante || '[Nome do Cliente]'}, [qualificação completa].

CONTRATADO: ${data.contratado || '[Nome do Advogado/Escritório]'}, com inscrição na OAB sob o nº ${data.oab || '[OAB/UF XXXXX]'}, com escritório em [Endereço do Escritório].

As partes acima qualificadas celebram o presente Contrato de Honorários Advocatícios, que se regerá pelas seguintes cláusulas:

CLÁUSULA 1ª - DO OBJETO
O presente contrato tem como objeto a prestação de serviços advocatícios para ${data.objeto || '[Descrever o objeto, ex: a propositura de Ação...]'}.

CLÁUSULA 2ª - DOS HONORÁRIOS E DA FORMA DE PAGAMENTO
A título de honorários, o CONTRATANTE pagará ao CONTRATADO o valor de ${data.valor_honorarios || '[Valor dos Honorários]'}.
${data.clausula_pagamento || '[A forma de pagamento será gerada aqui]'}

CLÁUSULA 3ª - DOS RISCOS E CUSTAS
${data.clausula_riscos || '[A cláusula de riscos e custas será gerada aqui]'}

CLÁUSULA 4ª - DA RESCISÃO
${data.clausula_rescisao || '[A cláusula de rescisão será gerada aqui]'}

CLÁUSULA 5ª - DO FORO
Fica eleito o foro da Comarca de ${data.foro || '[Foro de Eleição]'} para dirimir quaisquer litígios oriundos deste contrato.

E, por estarem justos e contratados, assinam o presente instrumento em 2 (duas) vias.

${data.localData || '[Local], [Data]'}

___________________________________
${data.contratante || '[Contratante]'}

___________________________________
${data.contratado || '[Contratado]'}
    `.trim(),
  },
  {
    value: 'contrato_aluguel',
    label: 'Contrato de Aluguel Residencial',
    fields: [
        { id: 'locador', label: 'Locador(a)', placeholder: 'Ex: Maria Oliveira' },
        { id: 'locatario', label: 'Locatário(a)', placeholder: 'Ex: Pedro Costa' },
        { id: 'imovel_endereco', label: 'Endereço Completo do Imóvel', placeholder: 'Ex: Rua das Flores, 123, Apto 45, São Paulo - SP' },
        { id: 'valor_aluguel', label: 'Valor do Aluguel (R$)', placeholder: 'Ex: R$ 2.500,00' },
        { id: 'prazo_meses', label: 'Prazo da Locação (em meses)', placeholder: 'Ex: 30' },
        { id: 'garantia', label: 'Tipo de Garantia', placeholder: 'Ex: Fiador, Depósito Caução de 3 meses, Seguro Fiança' },
        { id: 'foro', label: 'Foro de Eleição', placeholder: 'Ex: Foro da Comarca de São Paulo - SP' },
        { id: 'localData', label: 'Local e Data', placeholder: 'Ex: São Paulo, 01 de Janeiro de 2024' },
    ],
    promptLabel: 'Descreva as obrigações, a garantia e outras cláusulas',
    promptPlaceholder: 'Ex: O locatário é responsável pelo pagamento de IPTU e condomínio. A garantia é um depósito caução de 3 meses. Vistoria anexa. Multa por rescisão antecipada de 3 aluguéis proporcionais...',
    systemInstruction: 'Você é um especialista em direito imobiliário. Gere as cláusulas principais para um contrato de aluguel residencial. A resposta DEVE ser um objeto JSON com os campos "clausula_objeto", "clausula_obrigacoes", "clausula_garantia", "clausula_rescisao".',
    responseSchema: {
        type: Type.OBJECT,
        properties: {
            clausula_objeto: { type: Type.STRING, description: "Descreve o imóvel locado e o prazo da locação." },
            clausula_obrigacoes: { type: Type.STRING, description: "Lista as obrigações do locador e do locatário, incluindo pagamento de aluguel, encargos e manutenção." },
            clausula_garantia: { type: Type.STRING, description: "Detalha a modalidade de garantia prestada para a locação." },
            clausula_rescisao: { type: Type.STRING, description: "Define as condições e multas para a rescisão antecipada do contrato." },
        },
        required: ["clausula_objeto", "clausula_obrigacoes", "clausula_garantia", "clausula_rescisao"],
    },
    formatOutput: (data) => `
CONTRATO DE LOCAÇÃO DE IMÓVEL RESIDENCIAL

LOCADOR(A): ${data.locador || '[Nome do Locador]'}, [qualificação completa].

LOCATÁRIO(A): ${data.locatario || '[Nome do Locatário]'}, [qualificação completa].

As partes acima identificadas têm, entre si, justo e acertado o presente Contrato de Locação Residencial, regido pela Lei nº 8.245/91, mediante as cláusulas e condições seguintes.

CLÁUSULA 1ª - DO OBJETO E PRAZO
O objeto deste contrato é a locação do imóvel residencial sito à ${data.imovel_endereco || '[Endereço do Imóvel]'}.
${data.clausula_objeto || '[A cláusula de objeto e prazo será gerada aqui]'}

CLÁUSULA 2ª - DO ALUGUEL E OBRIGAÇÕES
O aluguel mensal é de R$ ${data.valor_aluguel || '0,00'}, a ser pago até o 5º dia útil de cada mês.
${data.clausula_obrigacoes || '[A cláusula de obrigações será gerada aqui]'}

CLÁUSULA 3ª - DA GARANTIA
A presente locação é garantida por meio de ${data.garantia || '[Tipo de Garantia]'}.
${data.clausula_garantia || '[A cláusula de garantia será gerada aqui]'}

CLÁUSULA 4ª - DA RESCISÃO
${data.clausula_rescisao || '[A cláusula de rescisão será gerada aqui]'}

CLÁUSULA 5ª - DO FORO
Fica eleito o foro da Comarca de ${data.foro || '[Foro de Eleição]'} para dirimir quaisquer dúvidas oriundas do presente contrato.

E por estarem assim justos e contratados, assinam o presente em 2 (duas) vias de igual teor e forma.

${data.localData || '[Local], [Data]'}

___________________________________
${data.locador || '[Locador]'}

___________________________________
${data.locatario || '[Locatário]'}
    `.trim(),
  },
  {
    value: 'acordo_extrajudicial',
    label: 'Acordo Extrajudicial',
    fields: [
        { id: 'transigente1', label: 'Primeiro(a) Transigente', placeholder: 'Ex: Empresa ABC Ltda.' },
        { id: 'transigente2', label: 'Segundo(a) Transigente', placeholder: 'Ex: Carlos Pereira' },
        { id: 'objeto_acordo', label: 'Objeto do Acordo', placeholder: 'Ex: Dívida referente à nota fiscal nº 123' },
        { id: 'valor_acordo', label: 'Valor Total do Acordo (R$)', placeholder: 'Ex: 5000,00' },
        { id: 'foro', label: 'Foro de Eleição', placeholder: 'Ex: Foro da Comarca de Belo Horizonte - MG' },
        { id: 'localData', label: 'Local e Data', placeholder: 'Ex: Belo Horizonte, 01 de Janeiro de 2024' },
    ],
    promptLabel: 'Descreva os termos do acordo, forma de pagamento e quitação',
    promptPlaceholder: 'Ex: O Segundo Transigente pagará R$ 5.000,00 em 5 parcelas mensais de R$ 1.000,00, via PIX. O pagamento dará plena, geral e irrevogável quitação a todas as obrigações decorrentes do evento X...',
    systemInstruction: 'Você é um advogado mediador redigindo um acordo. Gere as cláusulas do acordo para prevenir futuro litígio. A resposta DEVE ser um objeto JSON com os campos "clausula_termos", "clausula_pagamento", "clausula_quitacao", "clausula_penal".',
    responseSchema: {
        type: Type.OBJECT,
        properties: {
            clausula_termos: { type: Type.STRING, description: "Descreve os termos e concessões mútuas das partes para resolver a pendência." },
            clausula_pagamento: { type: Type.STRING, description: "Detalha o valor, a forma, as datas e os dados para a realização do pagamento acordado." },
            clausula_quitacao: { type: Type.STRING, description: "Estabelece que, com o cumprimento do acordo, as partes dão mútua e irrevogável quitação, renunciando a futuras reclamações sobre o objeto." },
            clausula_penal: { type: Type.STRING, description: "Define uma multa ou penalidade em caso de descumprimento de qualquer cláusula do acordo." },
        },
        required: ["clausula_termos", "clausula_pagamento", "clausula_quitacao", "clausula_penal"],
    },
    formatOutput: (data) => `
INSTRUMENTO PARTICULAR DE TRANSAÇÃO EXTRAJUDICIAL

PRIMEIRO(A) TRANSIGENTE: ${data.transigente1 || '[Nome do Primeiro Transigente]'}, [qualificação completa].

SEGUNDO(A) TRANSIGENTE: ${data.transigente2 || '[Nome do Segundo Transigente]'}, [qualificação completa].

As partes acima, de comum acordo, resolvem transacionar para prevenir litígio sobre ${data.objeto_acordo || '[Objeto do Acordo]'}, nos seguintes termos:

CLÁUSULA PRIMEIRA - DOS TERMOS DO ACORDO
${data.clausula_termos || '[Os termos do acordo serão gerados aqui]'}

CLÁUSULA SEGUNDA - DO PAGAMENTO
Para a quitação do objeto deste acordo, as partes ajustam o valor total de R$ ${data.valor_acordo || '0,00'}.
${data.clausula_pagamento || '[A forma de pagamento será gerada aqui]'}

CLÁUSULA TERCEIRA - DA QUITAÇÃO
${data.clausula_quitacao || '[A cláusula de quitação será gerada aqui]'}

CLÁUSULA QUARTA - DA CLÁUSULA PENAL
${data.clausula_penal || '[A cláusula penal por descumprimento será gerada aqui]'}

CLÁUSULA QUINTA - DO FORO
As partes elegem o foro da Comarca de ${data.foro || '[Foro de Eleição]'} para dirimir quaisquer questões relativas a este instrumento.

E, por estarem justas e acordadas, assinam o presente em 2 (duas) vias de igual teor e forma.

${data.localData || '[Local], [Data]'}

___________________________________
${data.transigente1 || '[Primeiro Transigente]'}

___________________________________
${data.transigente2 || '[Segundo Transigente]'}
    `.trim(),
  },
];
