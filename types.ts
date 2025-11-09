// types.ts
import React from 'react';

// User and Authentication
export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  subscription: {
    planId: string | null;
    status: 'active' | 'inactive' | 'trialing';
    endDate: string | null;
  };
}

// Subscription Plans
export interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  highlight: boolean;
  trialDays: number;
}

// Chat
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
  id: string;
  name: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  systemInstruction: string;
}

// Document Generator
export interface FormData {
  [key: string]: string;
}

// Marketing
export interface SocialPost {
  id: string;
  theme: string;
  platform: string;
  tone: string;
  status: 'draft' | 'published' | 'failed';
  title: string;
  script?: string;
  slides?: { title: string; body: string; imageSuggestion: string }[];
  articleBody?: string;
  visualSuggestions: string;
  hashtags: string[];
  videoUrl?: string;
  videoStatus?: 'idle' | 'generating' | 'ready' | 'failed';
  videoGenerationError?: string | null;
}

export interface Campaign {
    id: string;
    name: string;
    messageTemplate: string;
    recipientCount: number;
    status: 'draft' | 'sending' | 'sent' | 'failed';
    createdAt: string;
    scheduledAt?: string;
}

// SEO Analytics
export interface SeoData {
  authorityScore: number;
  organicTraffic: number;
  topKeywords: number;
  backlinks: number;
  aiVisibility: {
    visibility: number;
    mentions: number;
    citedPages: number;
  };
  trafficHistory: { month: string; traffic: number }[];
  topOrganicKeywords: { keyword: string; position: number; volume: string }[];
}

// Safety Camera
export interface SafetyEvent {
  type: 'plate' | 'infraction' | 'info';
  description: string;
  timestamp: string;
  frameDataUrl: string;
}

// Leads
export type LeadStatus = 'Novo' | 'Contatado' | 'Qualificado' | 'Perdido';

export interface Lead {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  website?: string;
  mapsUrl?: string;
  status: LeadStatus;
  createdAt: string;
}

// Contract Consultant
export interface GeneratedClause {
    id: string;
    type: string;
    text: string;
}

export interface NegotiationMessage {
    role: 'user' | 'model';
    content: string;
}

// Blog
export interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  content: React.ReactNode;
}

// App-level types
export interface ToastMessage {
  id?: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface NavigationContextType {
  navigate: (path: string) => void;
}