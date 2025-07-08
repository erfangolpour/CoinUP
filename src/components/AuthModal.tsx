import Clickable from "@components/common/Clickable";
import { useAuthStore } from "@stores/useAuthStore";
import { Eye, EyeOff, Lock, Mail, User, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface AuthModalProps {
	onClose: () => void;
}

interface FormData {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}

interface FormErrors {
	name?: string;
	email?: string;
	password?: string;
	confirmPassword?: string;
}

interface PasswordStrength {
	score: number;
	message: string;
	color: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
	const { login, register, isLogin, setIsLogin } = useAuthStore();
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [formData, setFormData] = useState<FormData>({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState<FormErrors>({});

	// Calculate password strength
	const calculatePasswordStrength = (password: string): PasswordStrength => {
		if (!password) return { score: 0, message: "", color: "" };

		let score = 0;
		const checks = [
			password.length >= 8,
			/[a-z]/.test(password),
			/[A-Z]/.test(password),
			/[0-9]/.test(password),
			/[^a-zA-Z0-9]/.test(password),
		];

		score = checks.filter(Boolean).length;

		if (score < 2) {
			return { score, message: "Very Weak", color: "bg-red-500" };
		} else if (score < 3) {
			return { score, message: "Weak", color: "bg-orange-500" };
		} else if (score < 4) {
			return { score, message: "Fair", color: "bg-yellow-500" };
		} else if (score < 5) {
			return { score, message: "Good", color: "bg-blue-500" };
		} else {
			return { score, message: "Strong", color: "bg-green-500" };
		}
	};

	const passwordStrength = calculatePasswordStrength(formData.password);

	// Validate form
	const validateForm = (): boolean => {
		const newErrors: FormErrors = {};

		if (!isLogin && !formData.name.trim()) {
			newErrors.name = "Name is required";
		}

		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Invalid email format";
		}

		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (!isLogin && formData.password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
		}

		if (!isLogin && formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		setIsLoading(true);

		try {
			let success = false;

			if (isLogin) {
				success = await login(formData.email, formData.password);
				if (success) {
					toast.success("Login successful!");
					onClose();
				} else {
					toast.error("Invalid email or password");
				}
			} else {
				success = await register(
					formData.name,
					formData.email,
					formData.password,
				);
				if (success) {
					toast.success("Account created successfully!");
					onClose();
				} else {
					toast.error("Email already exists");
				}
			}
		} catch (error) {
			toast.error("An error occurred. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	// Handle input changes
	const handleInputChange = (field: keyof FormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	// Reset form when modal opens/closes or mode changes
	useEffect(() => {
		setFormData({
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		});
		setErrors({});
	}, [isLogin]);

	// Handle escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};
		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [onClose]);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xl"
			onClick={onClose}
		>
			<motion.div
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.9, opacity: 0 }}
				transition={{
					type: "spring",
					damping: 20,
					stiffness: 300,
				}}
				className="glass-effect relative m-4 w-full max-w-md rounded-2xl p-6"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Close button */}
				<Clickable
					onClick={onClose}
					className="hover:bg-surface-700 absolute top-4 right-4 rounded-full p-2 transition-colors"
				>
					<X className="size-sm" />
				</Clickable>

				{/* Header */}
				<div className="mb-6 text-center">
					<h2 className="mb-2 text-2xl font-bold">
						{isLogin ? "Welcome Back" : "Create Account"}
					</h2>
					<p className="text-content-secondary">
						{isLogin
							? "Sign in to your account"
							: "Join CoinUP today"}
					</p>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Name field (register only) */}
					{!isLogin && (
						<div>
							<label className="mb-2 block text-sm font-medium">
								Name
							</label>
							<div className="relative">
								<User className="size-sm text-content-tertiary absolute top-1/2 left-3 -translate-y-1/2 transform" />
								<input
									type="text"
									value={formData.name}
									onChange={(e) =>
										handleInputChange(
											"name",
											e.target.value,
										)
									}
									className={`bg-surface-800/50 w-full rounded-xl border py-3 pr-4 pl-10 transition-all focus:ring-2 focus:outline-none ${
										errors.name
											? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
											: "border-surface-600 focus:border-primary-500 focus:ring-primary-500/20"
									}`}
									placeholder="Enter your name"
								/>
							</div>
							{errors.name && (
								<p className="mt-1 text-sm text-red-400">
									{errors.name}
								</p>
							)}
						</div>
					)}

					{/* Email field */}
					<div>
						<label className="mb-2 block text-sm font-medium">
							Email
						</label>
						<div className="relative">
							<Mail className="size-sm text-content-tertiary absolute top-1/2 left-3 -translate-y-1/2 transform" />
							<input
								type="text"
								value={formData.email}
								onChange={(e) =>
									handleInputChange("email", e.target.value)
								}
								className={`bg-surface-800/50 w-full rounded-xl border py-3 pr-4 pl-10 transition-all focus:ring-2 focus:outline-none ${
									errors.email
										? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
										: "border-surface-600 focus:border-primary-500 focus:ring-primary-500/20"
								}`}
								placeholder="Enter your email"
							/>
						</div>
						{errors.email && (
							<p className="mt-1 text-sm text-red-400">
								{errors.email}
							</p>
						)}
					</div>

					{/* Password field */}
					<div>
						<label className="mb-2 block text-sm font-medium">
							Password
						</label>
						<div className="relative">
							<Lock className="size-sm text-content-tertiary absolute top-1/2 left-3 -translate-y-1/2 transform" />
							<input
								type={showPassword ? "text" : "password"}
								value={formData.password}
								onChange={(e) =>
									handleInputChange(
										"password",
										e.target.value,
									)
								}
								className={`bg-surface-800/50 w-full rounded-xl border py-3 pr-12 pl-10 transition-all focus:ring-2 focus:outline-none ${
									errors.password
										? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
										: "border-surface-600 focus:border-primary-500 focus:ring-primary-500/20"
								}`}
								placeholder="Enter your password"
							/>
							<Clickable
								onClick={() => setShowPassword(!showPassword)}
								className="hover:bg-surface-700 absolute top-1/2 right-3 -translate-y-1/2 transform rounded p-1 transition-colors"
							>
								{showPassword ? (
									<EyeOff className="size-sm text-content-tertiary" />
								) : (
									<Eye className="size-sm text-content-tertiary" />
								)}
							</Clickable>
						</div>
						{errors.password && (
							<p className="mt-1 text-sm text-red-400">
								{errors.password}
							</p>
						)}

						{/* Password strength indicator (register only) */}
						{!isLogin && formData.password && (
							<div className="mt-2">
								<div className="mb-1 flex items-center justify-between text-sm">
									<span className="text-content-secondary">
										Password strength:
									</span>
									<span
										className={`font-medium ${
											passwordStrength.score >= 4
												? "text-green-400"
												: passwordStrength.score >= 3
													? "text-blue-400"
													: passwordStrength.score >=
														  2
														? "text-yellow-400"
														: "text-red-400"
										}`}
									>
										{passwordStrength.message}
									</span>
								</div>
								<div className="flex space-x-1">
									{[...Array(5)].map((_, i) => (
										<motion.div
											key={i}
											className={`h-2 flex-1 rounded-full ${
												i < passwordStrength.score
													? passwordStrength.color
													: "bg-surface-600"
											}`}
											initial={{ scaleX: 0 }}
											animate={{ scaleX: 1 }}
											transition={{
												delay: i * 0.1,
											}}
										/>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Confirm Password field (register only) */}
					{!isLogin && (
						<div>
							<label className="mb-2 block text-sm font-medium">
								Confirm Password
							</label>
							<div className="relative">
								<Lock className="size-sm text-content-tertiary absolute top-1/2 left-3 -translate-y-1/2 transform" />
								<input
									type={
										showConfirmPassword
											? "text"
											: "password"
									}
									value={formData.confirmPassword}
									onChange={(e) =>
										handleInputChange(
											"confirmPassword",
											e.target.value,
										)
									}
									className={`bg-surface-800/50 w-full rounded-xl border py-3 pr-12 pl-10 transition-all focus:ring-2 focus:outline-none ${
										errors.confirmPassword
											? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
											: "border-surface-600 focus:border-primary-500 focus:ring-primary-500/20"
									}`}
									placeholder="Confirm your password"
								/>
								<Clickable
									onClick={() =>
										setShowConfirmPassword(
											!showConfirmPassword,
										)
									}
									className="hover:bg-surface-700 absolute top-1/2 right-3 -translate-y-1/2 transform rounded p-1 transition-colors"
								>
									{showConfirmPassword ? (
										<EyeOff className="size-sm text-content-tertiary" />
									) : (
										<Eye className="size-sm text-content-tertiary" />
									)}
								</Clickable>
							</div>
							{errors.confirmPassword && (
								<p className="mt-1 text-sm text-red-400">
									{errors.confirmPassword}
								</p>
							)}
						</div>
					)}

					{/* Submit button */}
					<button
						type="submit"
						disabled={isLoading}
						className="btn-primary mt-6 w-full py-3 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isLoading ? (
							<motion.div
								className="size-sm rounded-full border-2 border-white/20 border-t-white"
								animate={{ rotate: 360 }}
								transition={{
									duration: 1,
									repeat: Infinity,
									ease: "linear",
								}}
							/>
						) : isLogin ? (
							"Sign In"
						) : (
							"Create Account"
						)}
					</button>
				</form>

				{/* Toggle between login/register */}
				<div className="text-sm-responsive mt-6 text-center">
					<p className="text-content-secondary">
						{isLogin
							? "Don't have an account?"
							: "Already have an account?"}
					</p>
					<Clickable
						onClick={() => setIsLogin(!isLogin)}
						className="text-primary-400 hover:text-primary-300 font-medium transition-colors focus:outline-none"
					>
						{isLogin ? "Sign up" : "Sign in"}
					</Clickable>
				</div>
			</motion.div>
		</motion.div>
	);
};

export default AuthModal;
