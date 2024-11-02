// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
// 	plugins: [react()],
// 	server: {
// 		port: 3000, // You can set the port where the development server runs (optional)
// 	},
// 	build: {
// 		outDir: "dist", // This specifies where Vite will output the built files
// 	},
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	server: {
		port: 5000, // Frontend runs on port 5000
		proxy: {
			"/api": {
				target: "http://localhost:3000", // Backend runs on port 3000
				changeOrigin: true,
			},
		},
	},
	build: {
		outDir: "dist",
	},
});
