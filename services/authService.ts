// services/authService.ts
import type { User } from '../types';

// ATENÇÃO: Este é um serviço de simulação.
// Em uma aplicação real, a autenticação deve ser feita em um backend seguro.
// As senhas NUNCA devem ser armazenadas no localStorage.

const USERS_KEY = 'advocaciaai_users';
const CURRENT_USER_KEY = 'advocaciaai_current_user';

const getUsers = (): User[] => {
  const usersJson = localStorage.getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const authService = {
  register: (name: string, email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getUsers();
        if (users.some(user => user.email === email)) {
          reject(new Error('Este e-mail já está cadastrado.'));
          return;
        }
        // Em um app real, a senha seria hasheada no backend.
        // Aqui, apenas os dados não sensíveis são salvos.
        const newUser: User = { name, email };
        users.push(newUser);
        saveUsers(users);
        resolve(newUser);
      }, 500);
    });
  },

  login: (email: string, password: string): Promise<User> => {
     return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = getUsers();
            const user = users.find(u => u.email === email);
            // Simula a verificação de senha. Em um app real, isso seria feito no backend.
            if (user) {
                localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
                resolve(user);
            } else {
                reject(new Error('E-mail ou senha inválidos.'));
            }
        }, 500);
     });
  },

  logout: (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  },

  updateUserSubscription: (email: string, planId: string, trialDays: number): User | null => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex === -1) return null;

    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + trialDays);

    const updatedUser: User = {
        ...users[userIndex],
        subscription: {
            planId,
            trialEnds: trialEndDate.toISOString(),
        }
    };
    
    users[userIndex] = updatedUser;
    saveUsers(users);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    
    return updatedUser;
  }
};