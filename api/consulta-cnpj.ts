// api/consulta-cnpj.ts
// Esta função serverless executa no backend da Vercel.
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const cnpjParam = req.query.cnpj;
    const cnpj = Array.isArray(cnpjParam) ? cnpjParam[0] : cnpjParam;

    if (!cnpj || typeof cnpj !== 'string' || !/^\d{14}$/.test(cnpj.replace(/\D/g, ''))) {
        return res.status(400).json({ message: 'CNPJ inválido fornecido.' });
    }
    
    const cleanCnpj = cnpj.replace(/\D/g, '');

    try {
        // Chama a API pública BrasilAPI do lado do servidor
        const fetchResponse = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);
        
        if (fetchResponse.status === 404) {
             return res.status(404).json({ message: 'CNPJ não encontrado.' });
        }
        if (!fetchResponse.ok) {
            throw new Error(`O serviço de CNPJ retornou o status: ${fetchResponse.status}`);
        }
        
        const data = await fetchResponse.json();
        
        // Adiciona caching para otimizar
        res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
        return res.status(200).json(data);

    } catch (error) {
        console.error('[API_CNPJ_ERROR]', error);
        const message = error instanceof Error ? error.message : 'Erro interno no servidor ao consultar CNPJ.';
        return res.status(500).json({ message });
    }
}