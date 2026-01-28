import { defineConfig } from "vite";// Vite configuration function to define project settings
import react from "@vitejs/plugin-react-swc"; // Vite plugin to support React with SWC compiler for faster builds
import path from "path"; // Node.js module to handle and transform file paths
import { componentTagger } from "lovable-tagger"; // Plugin to tag React components for easier identification in the DOM

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({ // Export Vite configuration based on the current mode (development or production)
  server: { // Development server configuration
    port: 5173, 
    hmr: { // Hot Module Replacement configuration use for live reloading during development
      overlay: false, // Disable the error overlay in the browser
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean), // Use React plugin and conditionally add componentTagger in development mode not in production
  resolve: { 
    alias: { // Path alias configuration
      "@": path.resolve(__dirname, "./src"), // Alias "@" to the "src" directory for easier imports
    },
  },
}));


//Its a Vite configuration file used to serve a React frontend quickly, manage plugins,
//control the development server, and allow for clean imports.