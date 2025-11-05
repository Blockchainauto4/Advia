import React from 'react';

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
  icon: React.FC<{className: string}>;
  systemInstruction: string;
}

export interface FormData {
  [key: string]: string;
}

export interface User {
  name: string;
  email: string;
  subscription?: {
    planId: string;
    trialEnds: string; // ISO string date
  }
}