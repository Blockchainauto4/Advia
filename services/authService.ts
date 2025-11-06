// services/authService.ts
import type { User } from '../types.ts';

// ATENÇÃO: Este é um serviço de simulação.
// Em uma aplicação real, a autenticação deve ser feita em um backend seguro.
// As senhas NUNCA devem ser armazenadas no localStorage.

const USERS_KEY = 'advocaciaai_users';
const CURRENT_USER_KEY = 'advocaciaai_current_user';
const ADMIN_EMAIL = 'admin@advocaciaai.com.br';

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
        const role = email.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'user';
        const newUser: User = { name, email, role };
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
                // Garante que a role seja definida para usuários existentes no login para consistência
                if (!user.role) {
                  user.role = user.email.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'user';
                  saveUsers(users);
                }
                localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
                resolve(user);
            } else {
                reject(new Error('E-mail ou senha inválidos.'));
            }
        }, 500);
     });
  },

  requestPasswordReset: (email: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = getUsers();
        const userExists = users.some(u => u.email === email);
        console.log(`[SIMULAÇÃO] Solicitação de redefinição de senha para ${email}. Usuário existe: ${userExists}. Um e-mail seria enviado se o usuário existir.`);
        // Resolve em ambos os casos para não revelar se um e-mail está cadastrado.
        resolve();
      }, 750);
    });
  },

  logout: (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  },
  
  getAllUsers: (): User[] => {
      return getUsers();
  },

  updateUserDetails: (email: string, details: Partial<Pick<User, 'name' | 'photoUrl'>>): User | null => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex === -1) return null;

    const updatedUser = { ...users[userIndex], ...details };
    
    users[userIndex] = updatedUser;
    saveUsers(users);

    const currentUser = authService.getCurrentUser();
    if(currentUser && currentUser.email === email) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    }
    
    return updatedUser;
  },
  
  deleteUser: (email: string): Promise<void> => {
      return new Promise((resolve) => {
          setTimeout(() => {
              let users = getUsers();
              users = users.filter(u => u.email !== email);
              saveUsers(users);
              
              const currentUser = authService.getCurrentUser();
              if(currentUser && currentUser.email === email) {
                  authService.logout();
              }
              resolve();
          }, 500);
      });
  }
};
