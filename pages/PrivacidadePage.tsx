import React from 'react';

export const PrivacidadePage = () => (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto prose lg:prose-xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Política de Privacidade</h1>
            <p className="text-sm text-gray-500">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

            <h2>1. Coleta de Informações</h2>
            <p>Coletamos informações que você nos fornece diretamente ao usar a AdvocaciaAI, como quando você cria uma conta (nome, e-mail) ou entra em contato conosco. Também podemos coletar informações de uso da plataforma de forma anônima para melhorar nossos serviços, como as funcionalidades mais utilizadas.</p>

            <h2>2. Uso das Informações</h2>
            <p>Utilizamos as informações coletadas para:</p>
            <ul>
                <li>Fornecer, operar e manter nossa Plataforma;</li>
                <li>Melhorar, personalizar e expandir nossa Plataforma;</li>
                <li>Entender e analisar como você usa nossa Plataforma;</li>
                <li>Desenvolver novos produtos, serviços e funcionalidades;</li>
                <li>Comunicar com você sobre sua conta, atualizações, e para fins de marketing e promocionais, sempre com a opção de cancelamento de assinatura.</li>
            </ul>

            <h2>3. Compartilhamento de Informações</h2>
            <p>A AdvocaciaAI não compartilha suas informações pessoais com terceiros para fins de marketing. Poderemos compartilhar informações com prestadores de serviços que nos ajudam a operar a plataforma (como provedores de nuvem), sob estritas obrigações de confidencialidade, ou se exigido por lei.</p>

            <h2>4. Segurança</h2>
            <p>Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações. No entanto, nenhum sistema de segurança é impenetrável e não podemos garantir a segurança absoluta de suas informações.</p>

            <h2>5. Seus Direitos de Proteção de Dados</h2>
            <p>De acordo com a LGPD, você tem o direito de acessar, corrigir, atualizar ou solicitar a exclusão de suas informações pessoais. Para exercer esses direitos, entre em contato conosco pelo e-mail <strong>suporte@advocaciaai.com.br</strong>.</p>

            <h2>6. Cookies</h2>
            <p>Utilizamos cookies essenciais para operar e administrar nossa Plataforma e melhorar sua experiência. Você pode configurar seu navegador para recusar cookies, mas isso pode limitar o uso de algumas funcionalidades.</p>
            
            <h2>7. Contato</h2>
            <p>Se tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco em <strong>suporte@advocaciaai.com.br</strong>.</p>
        </div>
    </main>
);