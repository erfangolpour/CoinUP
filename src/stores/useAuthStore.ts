import type { User } from "@/types/auth";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLogin: boolean;
	users: Array<User & { password: string }>;
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

	// Favorites management
	toggleFavorite: (coinId: string) => void;
	getFavorites: () => string[];
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
	persist(
		(set, get) => ({
			// Initial state
			user: null,
			isAuthenticated: false,
			isLogin: true,
			users: [],

			// Actions
			setIsLogin: (isLogin: boolean) => set({ isLogin }),

			login: async (email: string, password: string) => {
				try {
					// Simulate API delay
					await new Promise((resolve) => setTimeout(resolve, 1000));

					const { users } = get();
					const user = users.find((u) => u.email === email);
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

					const { users } = get();
					// Check if user already exists
					const existingUser = users.find((u) => u.email === email);
					if (existingUser) {
						throw new Error("User already exists");
					}

					const newUser: User & { password: string } = {
						id: Date.now().toString(),
						email,
						name,
						password,
						createdAt: new Date(),
						favorites: [],
					};

					const updatedUsers = [...users, newUser];
					const { password: _, ...userWithoutPassword } = newUser;

					set({
						user: userWithoutPassword,
						isAuthenticated: true,
						users: updatedUsers,
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
				const { user, users } = get();
				if (user) {
					// Remove from user database
					const updatedUsers = users.filter((u) => u.id !== user.id);

					// Clear from store
					set({
						user: null,
						isAuthenticated: false,
						users: updatedUsers,
					});
				}
			},

			// Favorites management
			toggleFavorite: (coinId: string) => {
				const { user, users } = get();
				if (!user) return;

				// Update user's favorites
				const updatedUsers = users.map((u) => {
					if (u.id === user.id) {
						const newFavorites = u.favorites.includes(coinId)
							? u.favorites.filter((id) => id !== coinId)
							: [...u.favorites, coinId];
						return { ...u, favorites: newFavorites };
					}
					return u;
				});

				// Update current user state
				const updatedUser = { ...user };
				if (updatedUser.favorites.includes(coinId)) {
					updatedUser.favorites = updatedUser.favorites.filter(
						(id) => id !== coinId,
					);
				} else {
					updatedUser.favorites = [...updatedUser.favorites, coinId];
				}

				set({
					user: updatedUser,
					users: updatedUsers,
				});
			},

			getFavorites: () => {
				const { user } = get();
				return user?.favorites || [];
			},
		}),
		{
			name: "auth-storage",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				user: state.user,
				isAuthenticated: state.isAuthenticated,
				users: state.users,
			}),
		},
	),
);
