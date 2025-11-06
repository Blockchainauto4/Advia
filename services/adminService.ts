// services/adminService.ts
import type { User } from '../types.ts';
import { authService } from './authService.ts'; // Assuming authService has a way to get all users

// This is a simulated admin service. In a real application, this would
// interact with a secure backend API with admin privileges.

const getSimulatedUsers = (): User[] => {
    // In a real app, this would be a secure API call.
    // Here we piggy-back on the authService's localStorage for simulation.
    // This is NOT secure and for demo purposes only.
    const usersJson = localStorage.getItem('advocaciaai_users');
    return usersJson ? JSON.parse(usersJson) : [];
};

export const adminService = {
  getDashboardStats: async (): Promise<{ userCount: number; activeSubscriptions: number; documentsGenerated: number }> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const users = getSimulatedUsers();
        resolve({
          userCount: users.length,
          activeSubscriptions: users.filter(u => u.subscription.status === 'active').length,
          documentsGenerated: 1357, // Mock data
        });
      }, 500);
    });
  },

  getAllUsers: async (): Promise<User[]> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(getSimulatedUsers());
      }, 500);
    });
  },

  updateUserSubscription: async (userId: string, planId: string | null): Promise<User | undefined> => {
     return new Promise(resolve => {
        setTimeout(() => {
            const users = getSimulatedUsers();
            const userIndex = users.findIndex(u => u.id === userId);
            if (userIndex !== -1) {
                users[userIndex].subscription = {
                    planId: planId,
                    status: planId ? 'active' : 'inactive',
                    endDate: null,
                };
                // This is a simplified update. In a real app, you would save all users back.
                // For this simulation, we'll just resolve with the updated user.
                resolve(users[userIndex]);
            } else {
                resolve(undefined);
            }
        }, 500);
    });
  },
};
