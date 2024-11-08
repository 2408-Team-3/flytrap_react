import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [react(), dts()],
  resolve: {
    alias: {
      path: 'path-browserify', 
    },
  },
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'Flytrap',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        'react', // Exclude React from the bundle
      ],
      output: {
        globals: {
          react: 'React',
        },
      },
    },
  },
});
