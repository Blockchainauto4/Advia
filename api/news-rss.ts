// api/news-rss.ts

const staticNews = [
    {
      title: "Como a Inteligência Artificial Está Revolucionando a Advocacia",
      link: "#/blog/como-ia-revoluciona-advocacia",
      pubDate: new Date('2024-07-28').toISOString(),
      description: "Da automação de tarefas repetitivas à análise preditiva de decisões judiciais, a IA está remodelando a prática jurídica, aumentando a eficiência e abrindo novas possibilidades estratégicas.",
      source: "Blog AdvocaciaAI"
    },
    {
      title: "5 Dicas para Criar uma Petição Inicial Perfeita com a Ajuda da IA",
      link: "#/blog/5-dicas-peticao-inicial-com-ia",
      pubDate: new Date('2024-07-25').toISOString(),
      description: "A petição inicial é a peça mais importante de um processo, e a Inteligência Artificial pode ser sua grande aliada na elaboração. Saiba como extrair o máximo da tecnologia.",
      source: "Blog AdvocaciaAI"
    },
    {
      title: "Marketing Jurídico Digital: Use a IA para Atrair Mais Clientes",
      link: "#/blog/marketing-juridico-digital-com-ia",
      pubDate: new Date('2024-07-22').toISOString(),
      description: "No cenário atual, ter uma presença online forte é crucial. A IA surge como uma aliada poderosa para criar e gerenciar estratégias de marketing de conteúdo.",
      source: "Blog AdvocaciaAI"
    },
    {
      title: "STF decide sobre o uso de IA em processos judiciais",
      link: "#",
      pubDate: new Date().toISOString(),
      description: "O Supremo Tribunal Federal estabeleceu novas diretrizes para a utilização de inteligência artificial em tribunais, visando garantir a transparência e o direito à ampla defesa...",
      source: "Jornal Jurídico (Exemplo)"
    },
];

export default async function handler(req, res) {
  // A query with more relevant keywords for tech and law in Brazil
  const RSS_URL = 'https://news.google.com/rss/search?q=advocacia+tecnologia+direito+brasil&hl=pt-BR&gl=BR&ceid=BR:pt-BR';

  try {
    const fetchResponse = await fetch(RSS_URL, {
        headers: {
            'User-Agent': 'AdvocaciaAI News Fetcher/1.0',
        }
    });
    if (!fetchResponse.ok) {
      throw new Error(`Failed to fetch RSS feed: ${fetchResponse.status}`);
    }
    const xmlText = await fetchResponse.text();

    // Simple regex-based XML parser
    const items = xmlText.match(/<item>([\s\S]*?)<\/item>/g) || [];
    const articles = items.slice(0, 5).map(item => { // Limit to top 5 articles
      const title = item.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '';
      const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1] || '';
      const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || '';
      const description = item.match(/<description>([\s\S]*?)<\/description>/)?.[1] || '';
      const source = item.match(/<source.*?>(.*?)<\/source>/)?.[1] || 'Google News';
      
      // Clean up description HTML entities and tags
      const cleanedDescription = description
        .replace(/<[^>]+>/g, '') // Remove HTML tags
        .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'").replace(/&amp;/g, '&').replace(/&#39;/g, "'");
      
      return { title, link, pubDate, description: cleanedDescription, source };
    });

    if (articles.length === 0) {
        throw new Error("No articles parsed from the live feed.");
    }

    // Add caching header for Vercel
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // Cache for 1 hour
    res.status(200).json(articles);

  } catch (error) {
    console.error('[API_NEWS_RSS_ERROR]', error.message);
    // On any error, return the static news as a fallback to ensure the component always renders.
    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).json(staticNews);
  }
}