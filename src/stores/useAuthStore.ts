import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface User {
	id: string;
	email: string;
	name: string;
	createdAt: Date;
}

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLogin: boolean;
}

interface AuthActions {
	login: (email: string, password: string) => Promise<boolean>;
	register: (
		name: string,
		email: string,
		password: string,
	) => Promise<boolean>;
	logout: () => void;
	deleteAccount: () => void;
	setIsLogin: (isLogin: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

// Mock user database (in real app, this would be handled by backend)
const mockUsers: Array<User & { password: string }> = [];

export const useAuthStore = create<AuthStore>()(
	persist(
		(set, get) => ({
			// Initial state
			user: null,
			isAuthenticated: false,
			isLogin: true,

			// Actions
			setIsLogin: (isLogin: boolean) => set({ isLogin }),

			login: async (email: string, password: string) => {
				try {
					// Simulate API delay
					await new Promise((resolve) => setTimeout(resolve, 1000));

					const user = mockUsers.find((u) => u.email === email);
					if (!user) {
						throw new Error("User not found");
					}

					if (user.password !== password) {
						throw new Error("Invalid password");
					}

					const { password: _, ...userWithoutPassword } = user;
					set({
						user: userWithoutPassword,
						isAuthenticated: true,
					});

					return true;
				} catch (error) {
					console.error("Login error:", error);
					return false;
				}
			},

			register: async (name: string, email: string, password: string) => {
				try {
					// Simulate API delay
					await new Promise((resolve) => setTimeout(resolve, 1000));

					// Check if user already exists
					const existingUser = mockUsers.find(
						(u) => u.email === email,
					);
					if (existingUser) {
						throw new Error("User already exists");
					}

					const newUser: User & { password: string } = {
						id: Date.now().toString(),
						email,
						name,
						password,
						createdAt: new Date(),
					};

					mockUsers.push(newUser);

					const { password: _, ...userWithoutPassword } = newUser;
					set({
						user: userWithoutPassword,
						isAuthenticated: true,
					});

					return true;
				} catch (error) {
					console.error("Registration error:", error);
					return false;
				}
			},

			logout: () => {
				set({
					user: null,
					isAuthenticated: false,
				});
			},

			deleteAccount: () => {
				const { user } = get();
				if (user) {
					// Remove from mock database
					const userIndex = mockUsers.findIndex(
						(u) => u.id === user.id,
					);
					if (userIndex !== -1) {
						mockUsers.splice(userIndex, 1);
					}

					// Clear from store
					set({
						user: null,
						isAuthenticated: false,
					});
				}
			},
		}),
		{
			name: "auth-storage",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				user: state.user,
				isAuthenticated: state.isAuthenticated,
			}),
		},
	),
);
