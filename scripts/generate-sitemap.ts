import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Since we are running this script from the root, we can import directly.
// We need to adjust the path to go from /scripts back to the root and then to /configs
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Helper to dynamically import TS files
async function importModule(modulePath: string) {
    const absolutePath = path.resolve(projectRoot, modulePath);
    try {
        const module = await import(absolutePath);
        return module;
    } catch (error) {
        console.error(`Error importing module at ${absolutePath}:`, error);
        throw error;
    }
}


async function generateSitemap() {
    const { blogPosts } = await importModule('./configs/blogPosts.ts');
    const { calculatorCategories } = await importModule('./configs/calculatorConfigs.ts');

    const baseUrl = 'https://advocaciaai.com.br';
    const today = new Date().toISOString().split('T')[0];

    const staticPages = [
        '#/home',
        '#/chat',
        '#/documentos',
        '#/calculadoras',
        '#/consultas',
        '#/marketing',
        '#/conversor',
        '#/seguranca',
        '#/planos',
        '#/auth',
        '#/quem-somos',
        '#/blog',
        '#/contato',
        '#/termos',
        '#/privacidade',
        '#/reembolso',
    ];

    const sitemapEntries = staticPages.map(page => ({
        loc: `${baseUrl}/${page}`,
        lastmod: today,
        changefreq: 'weekly',
        priority: page === '#/home' ? '1.0' : '0.8',
    }));

    // Blog posts
    blogPosts.forEach((post: { id: string; }) => {
        sitemapEntries.push({
            loc: `${baseUrl}/#/blog/${post.id}`,
            lastmod: today,
            changefreq: 'monthly',
            priority: '0.7',
        });
    });

    // Calculator categories
    calculatorCategories.forEach((category: { id: string; }) => {
        sitemapEntries.push({
            loc: `${baseUrl}/#/calculadoras/${category.id}`,
            lastmod: today,
            changefreq: 'monthly',
            priority: '0.6',
        });
    });

    const sitemapXml = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapEntries
    .map(entry => `
    <url>
      <loc>${entry.loc}</loc>
      <lastmod>${entry.lastmod}</lastmod>
      <changefreq>${entry.changefreq}</changefreq>
      <priority>${entry.priority}</priority>
    </url>
  `)
    .join('')}
</urlset>
    `.trim();

    const publicDir = path.resolve(projectRoot, 'public');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir);
    }
    
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml);
    console.log('✅ Sitemap gerado com sucesso em public/sitemap.xml');
}

generateSitemap().catch(e => console.error('Falha ao gerar sitemap:', e));
