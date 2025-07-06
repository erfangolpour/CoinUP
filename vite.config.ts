import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@src": path.resolve(__dirname, "./src"),
			"@api": path.resolve(__dirname, "./src/api"),
			"@components": path.resolve(__dirname, "./src/components"),
			"@config": path.resolve(__dirname, "./src/config"),
			"@hooks": path.resolve(__dirname, "./src/hooks"),
			"@stores": path.resolve(__dirname, "./src/stores"),
			"@types": path.resolve(__dirname, "./src/types"),
			"@utils": path.resolve(__dirname, "./src/utils"),
		},
	},
	server: {
		proxy: {
			"/api": {
				target: "https://api.coingecko.com",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
});
