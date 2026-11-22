import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

const root = __dirname;

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        home: resolve(root, 'index.html'),
        servicios: resolve(root, 'servicios/index.html'),
        articulos: resolve(root, 'articulos/index.html'),
        formacion: resolve(root, 'formacion/index.html'),
        angel: resolve(root, 'angel-chialvo/index.html'),
        contacto: resolve(root, 'contacto/index.html'),
        articulo: resolve(root, 'articulo/cambio-de-paradigma/index.html'),
      },
      output: {
        // Publish-ready layout: one folder per file type.
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name].js',
        assetFileNames: (info) => {
          const name = info.names?.[0] ?? info.name ?? '';
          if (/\.css$/i.test(name)) return 'css/[name][extname]';
          if (/\.(woff2?|ttf|otf|eot)$/i.test(name)) return 'fonts/[name][extname]';
          if (/\.(png|jpe?g|gif|svg|webp|avif|ico)$/i.test(name)) return 'images/[name][extname]';
          return 'assets/[name][extname]';
        },
      },
    },
  },
});
