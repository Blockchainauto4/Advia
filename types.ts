import React from 'react';

export interface User {
  name: string;
  email: string;
  photoUrl?: string;
  role?: 'admin' | 'user';
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
}

export interface Assistant {
  id:string;
  name: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  systemInstruction: string;
}

export type FormData = {
  [key: string]: string;
};

export interface SocialPost {
    id: string;
    theme: string;
    platform: string;
    tone: string;
    title: string;
    script?: string; // Optional for single posts
    slides?: { // Optional for carousel posts
        title: string;
        body: string;
        imageSuggestion: string;
    }[];
    articleBody?: string; // Optional for blog articles
    visualSuggestions: string;
    hashtags: string[];
    videoUrl?: string; // Optional field for generated video
    videoStatus?: 'idle' | 'generating' | 'ready' | 'failed';
    videoGenerationError?: string | null;
    status?: 'draft' | 'posting' | 'posted' | 'failed';
    statusMessage?: string; // For success (e.g., URL) or error messages
}

export interface SafetyEvent {
  type: 'plate' | 'infraction' | 'info';
  description: string;
  timestamp: string;
  frameDataUrl: string;
}

export type LeadStatus = 'Novo' | 'Contatado' | 'Qualificado' | 'Perdido';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: LeadStatus;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  content: React.ReactNode;
}

export interface Campaign {
  id: string;
  name: string;
  messageTemplate: string;
  status: 'draft' | 'sending' | 'sent' | 'failed';
  recipientCount: number;
  createdAt: string;
  scheduledAt?: string;
}
