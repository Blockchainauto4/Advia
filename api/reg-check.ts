// api/reg-check.ts
// Esta função serverless executa no backend da Vercel.
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const placaParam = req.query.placa;
    const placa = Array.isArray(placaParam) ? placaParam[0] : placaParam;
    
    // Usa a Environment Variable configurada na Vercel
    const username = process.env.REGCHECK_USERNAME;

    if (!username) {
        return res.status(500).json({ message: 'A chave de API para consulta de placa não está configurada no servidor.' });
    }
    if (!placa || typeof placa !== 'string' || placa.length < 7) {
        return res.status(400).json({ message: 'Placa inválida fornecida.' });
    }

    const requestUrl = `https://www.regcheck.org.uk/api/reg.asmx/CheckBrazil?RegistrationNumber=${encodeURIComponent(placa)}&username=${encodeURIComponent(username)}`;

    try {
        const fetchResponse = await fetch(requestUrl);
        if (!fetchResponse.ok) {
            throw new Error(`O serviço RegCheck retornou o status: ${fetchResponse.status}`);
        }
        const xmlString = await fetchResponse.text();

        // Retorna a resposta como XML, conforme esperado pelo frontend
        res.setHeader('Content-Type', 'application/xml');
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // Cache por 1 hora
        return res.status(200).send(xmlString);

    } catch (error) {
        console.error('[API_REGCHECK_ERROR]', error);
        // Retorna um erro em JSON para facilitar o tratamento no frontend
        const message = error instanceof Error ? error.message : 'Erro interno no servidor ao consultar a placa.';
        return res.status(500).json({ message });
    }
}