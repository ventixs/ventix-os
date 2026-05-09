/// <reference types="vitest" />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { federation } from '@module-federation/vite';

/**
 * Module Federation remote build for the Hello-MF plugin.
 * Implements ADR-0004 step 2 — produces a remoteEntry.js the shell loads
 * via @module-federation/enhanced runtime API.
 *
 * Shared singletons must mirror SHARED_SINGLETONS in the shell's MF init.
 */
export default defineConfig({
  // The plugin is served from /plugins/com.demo.hello-mf/ on the shell host.
  // `base` prefixes every asset URL the bundler emits so dynamic imports
  // (e.g. loadComponent: () => import('./home.component')) resolve correctly.
  base: '/plugins/com.demo.hello-mf/',
  build: {
    target: 'es2022',
    minify: false,
    cssCodeSplit: false,
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: { plugin: './src/plugin.ts' },
      output: {
        format: 'esm',
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
      },
    },
  },
  plugins: [
    angular({ tsconfig: './tsconfig.app.json' }),
    federation({
      name: 'com_demo_hello_mf', // MF requires safe identifiers (no dots/dashes)
      filename: 'remoteEntry.js',
      exposes: {
        './Plugin': './src/plugin.ts',
      },
      // @ventix/plugin-api is intentionally NOT shared: it is a types+shims
      // package (~200 lines of runtime) that we bundle into each plugin.
      // Sharing would require publishing it as a real ESM artifact first,
      // which is a Phase 1.5 follow-up.
      shared: {
        '@angular/core':   { singleton: true, requiredVersion: false },
        '@angular/common': { singleton: true, requiredVersion: false },
        '@angular/router': { singleton: true, requiredVersion: false },
        rxjs:              { singleton: true, requiredVersion: false },
      },
    }),
  ],
});
