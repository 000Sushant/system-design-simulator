import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.spec.ts', 'functions/**/*.spec.{js,ts}'],
    globals: false,
  },
});
