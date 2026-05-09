/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: false,
    environment: 'node',
    include: ['src/**/*.spec.ts', 'src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reportsDirectory: '../../../coverage/libs/kernel/registry',
    },
  },
});
