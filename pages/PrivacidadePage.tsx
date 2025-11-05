import React from 'react';

export const PrivacidadePage = () => (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto prose lg:prose-xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Política de Privacidade</h1>
            <p className="text-sm text-gray-500">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

            <h2>1. Coleta de Informações</h2>
            <p>Coletamos informações que você nos fornece diretamente, como quando você cria uma conta (nome, e-mail) ou entra em contato conosco. Também podemos coletar informações de uso da plataforma de forma anônima para melhorar nossos serviços.</p>

            <h2>2. Uso das Informações</h2>
            <p>Utilizamos as informações coletadas para:</p>
            <ul>
                <li>Fornecer, operar e manter nossa Plataforma;</li>
                <li>Melhorar, personalizar e expandir nossa Plataforma;</li>
                <li>Entender e analisar como você usa nossa Plataforma;</li>
                <li>Comunicar com você, seja diretamente ou através de um de nossos parceiros, inclusive para atendimento ao cliente, para fornecer atualizações e outras informações relacionadas à Plataforma, e para fins de marketing e promocionais.</li>
            </ul>

            <h2>3. Compartilhamento de Informações</h2>
            <p>Não compartilhamos suas informações pessoais com terceiros, exceto quando necessário para cumprir a lei, proteger nossos direitos ou fornecer nossos serviços (por exemplo, com provedores de infraestrutura de nuvem).</p>

            <h2>4. Segurança</h2>
            <p>Implementamos medidas de segurança para proteger suas informações. No entanto, nenhum sistema de segurança é impenetrável e não podemos garantir a segurança absoluta de suas informações.</p>

            <h2>5. Seus Direitos</h2>
            <p>Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Para exercer esses direitos, entre em contato conosco.</p>

            <h2>6. Cookies</h2>
            <p>Utilizamos cookies para operar e administrar nossa Plataforma e melhorar sua experiência. Você pode configurar seu navegador para recusar cookies, mas isso pode limitar o uso de algumas funcionalidades.</p>
        </div>
    </main>
);