import React from 'react';

export const TermosPage = () => (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto prose lg:prose-xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Termos de Serviço</h1>
            <p className="text-sm text-gray-500">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
            
            <h2>1. Aceitação dos Termos</h2>
            <p>Ao acessar e utilizar o site advocaciaai.com.br ("Plataforma"), você concorda em cumprir e estar vinculado a estes Termos de Serviço. Se você não concorda com estes termos, não deve usar nossa Plataforma.</p>

            <h2>2. Natureza dos Serviços</h2>
            <p>A Plataforma oferece ferramentas baseadas em inteligência artificial para auxiliar profissionais e estudantes de direito. Os serviços, incluindo o gerador de documentos e o chat IA, destinam-se a fins informativos e de auxílio, e <strong>não constituem aconselhamento jurídico</strong>. O uso das ferramentas não cria uma relação advogado-cliente.</p>

            <h2>3. Uso da Plataforma</h2>
            <p>Você concorda em usar a Plataforma apenas para fins legais e de acordo com estes Termos. Você é responsável por manter a confidencialidade de sua conta e senha.</p>
            
            <h2>4. Propriedade Intelectual</h2>
            <p>Todo o conteúdo da Plataforma, incluindo textos, gráficos, logos e software, é propriedade da advocaciaai.com.br ou de seus licenciadores e é protegido por leis de direitos autorais.</p>

            <h2>5. Isenção de Garantias e Limitação de Responsabilidade</h2>
            <p>A Plataforma é fornecida "como está", sem garantias de qualquer tipo. Não garantimos que as informações geradas pela IA sejam sempre precisas, completas ou atuais. A advocaciaai.com.br não será responsável por quaisquer danos diretos ou indiretos resultantes do uso ou da incapacidade de usar a Plataforma.</p>
            
            <h2>6. Modificações nos Termos</h2>
            <p>Reservamo-nos o direito de modificar estes Termos a qualquer momento. Notificaremos sobre alterações significativas, e o uso continuado da Plataforma após tais alterações constituirá sua aceitação dos novos termos.</p>
            
            <h2>7. Contato</h2>
            <p>Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco em contato@advocaciaai.com.br.</p>
        </div>
    </main>
);