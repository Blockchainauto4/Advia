// services/authService.ts
import type { User } from '../types.ts';

const USERS_KEY = 'advocaciaai_users';
const CURRENT_USER_KEY = 'advocaciaai_current_user';

const getUsers = (): User[] => {
    try {
        const usersJson = localStorage.getItem(USERS_KEY);
        return usersJson ? JSON.parse(usersJson) : [];
    } catch (e) {
        return [];
    }
};

const saveUsers = (users: User[]): void => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const authService = {
    register: (name: string, email: string, password_unused: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = getUsers();
                if (users.some(u => u.email === email)) {
                    return reject(new Error('Um usuário com este e-mail já existe.'));
                }
                const newUser: User = {
                    id: Date.now().toString(),
                    name,
                    email,
                    subscription: {
                        planId: 'free_trial',
                        status: 'active',
                        endDate: null,
                    },
                };
                users.push(newUser);
                saveUsers(users);
                resolve();
            }, 500);
        });
    },

    login: (email: string, password_unused: string): Promise<User> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = getUsers();
                const user = users.find(u => u.email === email);
                if (user) {
                    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
                    resolve(user);
                } else {
                    reject(new Error('Credenciais inválidas.'));
                }
            }, 500);
        });
    },

    logout: (): void => {
        localStorage.removeItem(CURRENT_USER_KEY);
    },

    getCurrentUser: (): User | null => {
        try {
            const userJson = localStorage.getItem(CURRENT_USER_KEY);
            return userJson ? JSON.parse(userJson) : null;
        } catch (e) {
            return null;
        }
    },

    updateUserDetails: (email: string, details: Partial<User>): User | null => {
        const users = getUsers();
        const userIndex = users.findIndex(u => u.email === email);
        if (userIndex > -1) {
            const updatedUser = { ...users[userIndex], ...details };
            users[userIndex] = updatedUser;
            saveUsers(users);

            // Also update current user if they are logged in
            const currentUser = authService.getCurrentUser();
            if (currentUser && currentUser.email === email) {
                localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
            }
            return updatedUser;
        }
        return null;
    },

    requestPasswordReset: (email: string): Promise<void> => {
        return new Promise((resolve) => {
            console.log(`[SIMULAÇÃO] Enviando link de recuperação de senha para: ${email}`);
            setTimeout(resolve, 1000);
        });
    },

    deleteUser: (email: string): Promise<void> => {
        return new Promise(resolve => {
            setTimeout(() => {
                let users = getUsers();
                users = users.filter(u => u.email !== email);
                saveUsers(users);
                authService.logout();
                resolve();
            }, 500);
        });
    },
};
