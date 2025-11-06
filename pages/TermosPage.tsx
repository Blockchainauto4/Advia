

import React from 'react';
import { useNavigation } from '../App.tsx';

const InternalLink: React.FC<{href: string; children: React.ReactNode}> = ({ href, children }) => {
    const { navigate } = useNavigation();
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigate(href);
    }
    return <a href={href} onClick={handleClick}>{children}</a>;
}

export const TermosPage = () => (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto prose lg:prose-xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Termos de Serviço</h1>
            <p className="text-sm text-gray-500">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
            
            <h2>1. Aceitação dos Termos</h2>
            <p>Ao acessar e utilizar a plataforma AdvocaciaAI, disponível em advocaciaai.com.br ("Plataforma"), você ("Usuário") concorda em cumprir e estar vinculado a estes Termos de Serviço ("Termos"). Se você não concorda com estes termos, não deve usar nossa Plataforma.</p>

            <h2>2. Descrição dos Serviços</h2>
            <p>A Plataforma oferece ferramentas baseadas em inteligência artificial para auxiliar profissionais e estudantes de direito. Os serviços incluem, mas não se limitam a: assistentes de chat IA especializados, gerador de documentos jurídicos, calculadoras jurídicas e ferramentas de marketing de conteúdo ("Serviços").</p>
            <p><strong>IMPORTANTE:</strong> Os Serviços destinam-se a fins informativos e de auxílio, e <strong>não constituem aconselhamento, consultoria ou parecer jurídico</strong>. A utilização das ferramentas não estabelece uma relação advogado-cliente. O Usuário é inteiramente responsável pela revisão, verificação da precisão e adequação de todo o conteúdo gerado antes de qualquer uso prático ou profissional.</p>

            <h2>3. Contas de Usuário</h2>
            <p>Para acessar os recursos premium da Plataforma, o Usuário deve se registrar e manter uma conta ativa. O Usuário concorda em fornecer informações verdadeiras, precisas e completas. O Usuário é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrem em sua conta.</p>

            <h2>4. Assinaturas, Pagamentos e Faturamento</h2>
            <p>O acesso a determinados recursos da Plataforma requer uma assinatura paga. Oferecemos diferentes planos de assinatura, cujos detalhes e preços estão disponíveis em nossa <InternalLink href="#/planos">página de planos</InternalLink>.</p>
            <ul>
                <li><strong>Período de Teste:</strong> Podemos oferecer um período de teste gratuito. Após o término do teste, a assinatura será cobrada automaticamente, a menos que seja cancelada antes do final do período de teste.</li>
                <li><strong>Faturamento:</strong> As assinaturas são cobradas de forma anual. Ao fornecer um método de pagamento, você nos autoriza a cobrar o valor da assinatura aplicável.</li>
                <li><strong>Renovação Automática:</strong> Para pagamentos com cartão de crédito, sua assinatura será renovada automaticamente ao final de cada período, a menos que você cancele a renovação antes da data de vencimento.</li>
            </ul>

            <h2>5. Cancelamento e Reembolso</h2>
            <p>O Usuário pode cancelar a renovação de sua assinatura a qualquer momento. O acesso aos recursos premium continuará até o final do período já pago. Nossa política de reembolso é detalhada em nossa <InternalLink href="#/reembolso">Política de Cancelamento e Reembolso</InternalLink>, que é parte integrante destes Termos.</p>
            
            <h2>6. Uso Aceitável</h2>
            <p>O Usuário concorda em não usar a Plataforma para:</p>
            <ul>
                <li>Qualquer finalidade ilegal ou não autorizada.</li>
                <li>Transmitir qualquer conteúdo que seja difamatório, ofensivo ou que viole os direitos de terceiros.</li>
                <li>Tentar obter acesso não autorizado aos nossos sistemas ou redes.</li>
                <li>Compartilhar o acesso de sua conta com terceiros.</li>
            </ul>

            <h2>7. Propriedade Intelectual</h2>
            <p>A Plataforma, seu design, software, e todo o conteúdo (exceto o conteúdo gerado e finalizado pelo Usuário) são propriedade exclusiva da AdvocaciaAI e protegidos por leis de direitos autorais e propriedade intelectual. Concedemos ao Usuário uma licença limitada, não exclusiva e intransferível para usar os Serviços conforme estes Termos. O Usuário retém todos os direitos sobre o conteúdo final que cria, edita e finaliza utilizando as ferramentas da Plataforma, sendo de sua total responsabilidade o uso e a veracidade do mesmo.</p>

            <h2>8. Isenção de Garantias e Limitação de Responsabilidade</h2>
            <p>A PLATAFORMA É FORNECIDA "COMO ESTÁ" E "CONFORME DISPONÍVEL", SEM GARANTIAS DE QUALQUER TIPO. NÃO GARANTIMOS QUE O SERVIÇO SERÁ ININTERRUPTO, SEGURO OU LIVRE DE ERROS, NEM QUE AS INFORMAÇÕES GERADAS PELA IA SEJAM SEMPRE PRECISAS, COMPLETAS OU ATUAIS.</p>
            <p>EM NENHUMA HIPÓTESE A ADVOCACIAAI SERÁ RESPONSÁVEL POR QUAISQUER DANOS INDIRETOS, INCIDENTAIS, ESPECIAIS OU CONSEQUENTES, INCLUINDO PERDA DE LUCROS, DADOS OU BOA VONTADE, DECORRENTES DO USO OU DA INCAPACIDADE DE USAR A PLATAFORMA. NOSSA RESPONSABILIDADE TOTAL ESTÁ LIMITADA AO VALOR PAGO PELO USUÁRIO NOS ÚLTIMOS 12 MESES.</p>

            <h2>9. Política de Privacidade</h2>
            <p>A coleta e o uso de informações pessoais são regidos por nossa <InternalLink href="#/privacidade">Política de Privacidade</InternalLink>.</p>

            <h2>10. Lei Aplicável e Foro</h2>
            <p>Estes Termos serão regidos e interpretados de acordo com as leis da República Federativa do Brasil. Fica eleito o foro da Comarca de São Paulo, Estado de São Paulo, para dirimir quaisquer controvérsias oriundas destes Termos.</p>

            <h2>11. Modificações nos Termos</h2>
            <p>Reservamo-nos o direito de modificar estes Termos a qualquer momento. Notificaremos sobre alterações significativas por e-mail ou através de um aviso na Plataforma. O uso continuado da Plataforma após tais alterações constituirá sua aceitação dos novos termos.</p>
            
            <h2>12. Contato</h2>
            <p>Se você tiver alguma dúvida sobre estes Termos de Serviço, entre em contato conosco através do e-mail <strong>suporte@advocaciaai.com.br</strong>.</p>
        </div>
    </main>
);