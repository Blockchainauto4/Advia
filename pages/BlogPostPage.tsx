import React, { useEffect } from 'react';
import { useNavigation } from '../AppContext';
import { blogPosts } from '../configs/blogPosts';
import { UserCircleIcon, CalendarDaysIcon, ArrowLeftOnRectangleIcon } from '../components/Icons';

interface BlogPostPageProps {
  slug: string;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug }) => {
    const { navigate } = useNavigation();
    const post = blogPosts.find(p => p.id === slug);

    useEffect(() => {
        if (post) {
            document.title = `${post.title} | AdvocaciaAI Blog`;
        } else {
            document.title = 'Artigo não encontrado | AdvocaciaAI Blog';
        }
        // Reset title on unmount
        return () => {
             document.title = 'AdvocaciaAI: Seu Assistente Jurídico com IA';
        }
    }, [post]);

    if (!post) {
        return (
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <h1 className="text-3xl font-bold text-red-600">Artigo não encontrado</h1>
                <p className="text-slate-600 mt-2">O artigo que você está procurando não existe ou foi movido.</p>
                <button onClick={() => navigate('#/blog')} className="mt-8 bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">
                    Voltar para o Blog
                </button>
            </main>
        );
    }

    return (
        <main className="flex-grow bg-white py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <button onClick={() => navigate('#/blog')} className="flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 mb-8">
                        <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2 transform rotate-180" />
                        Voltar para o Blog
                    </button>
                    
                    <article>
                        <header className="mb-8">
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{post.title}</h1>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <UserCircleIcon className="w-5 h-5 mr-2 text-gray-400" />
                                    <span>{post.author}</span>
                                </div>
                                <div className="flex items-center">
                                    <CalendarDaysIcon className="w-5 h-5 mr-2 text-gray-400" />
                                    <time dateTime={new Date(post.date).toISOString()}>{new Date(post.date).toLocaleDateString('pt-BR')}</time>
                                </div>
                            </div>
                        </header>
                        
                        <div className="prose prose-indigo lg:prose-lg max-w-none">
                            {post.content}
                        </div>
                    </article>
                </div>
            </div>
        </main>
    );
};