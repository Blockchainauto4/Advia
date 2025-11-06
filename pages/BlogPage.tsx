import React from 'react';
import { blogPosts } from '../configs/blogPosts.ts';
import { useNavigation } from '../App.tsx';
import { UserCircleIcon, CalendarDaysIcon } from '../components/Icons.tsx';

export const BlogPage: React.FC = () => {
    const { navigate } = useNavigation();

    return (
        <main className="flex-grow bg-slate-100 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Blog AdvocaciaAI</h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Artigos, insights e novidades sobre a intersecção entre Direito, tecnologia e Inteligência Artificial.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-10">
                    {blogPosts.map((post) => (
                        <article key={post.id} className="bg-white p-8 rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                                <a 
                                    href={`#/blog/${post.id}`} 
                                    onClick={(e) => { e.preventDefault(); navigate(`#/blog/${post.id}`); }}
                                    className="hover:text-indigo-600 transition-colors"
                                >
                                    {post.title}
                                </a>
                            </h2>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                                <div className="flex items-center">
                                    <UserCircleIcon className="w-4 h-4 mr-1.5" />
                                    <span>{post.author}</span>
                                </div>
                                <div className="flex items-center">
                                    <CalendarDaysIcon className="w-4 h-4 mr-1.5" />
                                    <time dateTime={new Date(post.date).toISOString()}>{new Date(post.date).toLocaleDateString('pt-BR')}</time>
                                </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-6">{post.excerpt}</p>
                            <a 
                                href={`#/blog/${post.id}`} 
                                onClick={(e) => { e.preventDefault(); navigate(`#/blog/${post.id}`); }}
                                className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                            >
                                Ler mais &rarr;
                            </a>
                        </article>
                    ))}
                </div>
            </div>
        </main>
    );
};