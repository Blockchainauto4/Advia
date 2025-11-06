
import React from 'react';

export const PoliticaReembolsoPage = () => (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto prose lg:prose-xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Política de Cancelamento e Reembolso</h1>
            <p className="text-sm text-gray-500">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

            <p>Na AdvocaciaAI, nosso objetivo é oferecer ferramentas que transformem sua rotina jurídica. Queremos que você tenha a melhor experiência possível, e nossa política de cancelamento e reembolso foi criada para ser clara e justa.</p>

            <h2>1. Período de Teste Gratuito (Trial)</h2>
            <p>Oferecemos um período de teste gratuito para que você possa explorar todas as funcionalidades da nossa plataforma sem compromisso. A duração do teste é especificada na página de planos no momento da sua inscrição. Durante este período, você pode cancelar sua assinatura a qualquer momento sem nenhuma cobrança.</p>

            <h2>2. Cobrança e Assinaturas</h2>
            <p>Após o término do período de teste, sua assinatura será ativada e a cobrança será realizada de acordo com o plano (anual) e método de pagamento escolhido. A assinatura garante seu acesso contínuo à plataforma e suas funcionalidades premium durante todo o período contratado.</p>

            <h2>3. Política de Reembolso</h2>
            <p>Devido à natureza dos nossos serviços digitais e à disponibilização de um período de teste gratuito, nossa política geral é de <strong>não oferecer reembolsos</strong> para pagamentos de assinatura já processados.</p>
            <p>Ao realizar o pagamento após o período de teste, você concorda que a cobrança é final e não reembolsável. Seu acesso à plataforma continuará ativo até o final do ciclo de faturamento já pago, mesmo que você decida cancelar a renovação.</p>

            <h3>Garantia de Satisfação de 7 Dias</h3>
            <p>Entendemos que a adaptação a uma nova ferramenta leva tempo. Por isso, oferecemos uma <strong>garantia de satisfação de 7 dias</strong>. Se, por qualquer motivo, você não estiver satisfeito com a plataforma nos primeiros 7 (sete) dias após a primeira cobrança (logo após o fim do período de teste), você pode solicitar o reembolso integral do valor pago. Para isso, entre em contato com nosso suporte através do e-mail <strong>suporte@advocaciaai.com.br</strong> com o assunto "Solicitação de Reembolso - 7 Dias".</p>
            <p>Esta garantia é válida apenas para a <strong>primeira assinatura</strong> de um usuário e deve ser solicitada dentro do prazo estipulado.</p>
            

            <h2>4. Como Cancelar sua Assinatura</h2>
            <p>Você pode cancelar a renovação automática da sua assinatura a qualquer momento. O cancelamento impedirá cobranças futuras, mas seu acesso continuará ativo até o final do período já pago.</p>
            <p>Para solicitar o cancelamento da renovação, por favor, envie um e-mail para nossa equipe de suporte em <strong>suporte@advocaciaai.com.br</strong> com o assunto "Cancelamento de Assinatura".</p>

            <h2>5. Casos Excepcionais</h2>
            <p>Casos excepcionais, como cobranças duplicadas ou falhas técnicas comprovadas atribuíveis à nossa plataforma, serão analisados individualmente. Se você acredita que houve um erro em sua cobrança, por favor, entre em contato com nosso suporte para que possamos investigar.</p>
            
            <h2>6. Contato</h2>
            <p>Se você tiver alguma dúvida sobre esta Política de Cancelamento e Reembolso, entre em contato conosco através do e-mail <strong>suporte@advocaciaai.com.br</strong>.</p>
        </div>
    </main>
);
