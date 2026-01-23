import { defineConfig } from "vitest/config"; // Vitest configuration file
import react from "@vitejs/plugin-react-swc"; // React plugin for Vite using SWC for fast compilation and rendering and Remind JSX format
import path from "path"; // Node.js module for handling and transforming file paths

export default defineConfig({ // Export Vitest configuration
  plugins: [react()],
  test: { 
    environment: "jsdom", // Simulate a browser environment for testing React components
    globals: true, // Enable global variables like 'describe', "expect" and 'it' for writing tests rather then import them in each file
    setupFiles: ["./src/test/setup.ts"], // Specify setup file to run before tests
    include: ["src/**/*.{test,spec}.{ts,tsx,js.jsx}"],// Specify test file patterns to include which files to consider as test files
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") }, // Set up path aliasing for cleaner imports
  },
});


//Its a Vitest configuration file used for setting up the testing environment for React components,
//including test files, and managing path aliasing. It uses the React plugin for Vite with SWC for fast compilation and rendering,
//and configures Vitest to simulate a browser environment using jsdom. by run command "vitest"