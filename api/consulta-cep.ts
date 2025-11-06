// api/consulta-cep.ts
// Esta função serverless executa no backend da Vercel.

export default async function handler(req, res) {
  // Extrai o parâmetro 'cep' da URL da requisição
  const { cep } = req.query;

  // Validação básica do CEP
  if (!cep || typeof cep !== 'string' || !/^\d{8}$/.test(cep.replace(/\D/g, ''))) {
      return res.status(400).json({ message: 'CEP inválido fornecido.' });
  }
  
  const cleanCep = cep.replace(/\D/g, '');

  try {
      // Chama a API externa (ViaCEP) do lado do servidor
      const fetchResponse = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      
      if (!fetchResponse.ok) {
          throw new Error(`O serviço de CEP retornou o status: ${fetchResponse.status}`);
      }
      
      const data = await fetchResponse.json();

      // Se a API do ViaCEP retornar um erro, repassamos como 404
      if (data.erro) {
          return res.status(404).json({ message: 'CEP não encontrado.' });
      }
      
      // Mapeia os dados para o formato esperado pelo frontend
      const mappedData = {
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf,
          cep: data.cep,
          ddd: data.ddd
      };

      // Adiciona caching para otimizar chamadas repetidas
      res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
      return res.status(200).json(mappedData);

  } catch (error) {
      console.error('[API_CEP_ERROR]', error);
      return res.status(500).json({ message: error.message || 'Erro interno no servidor ao consultar CEP.' });
  }
}
