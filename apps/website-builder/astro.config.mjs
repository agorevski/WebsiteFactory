import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  integrations: [react()],
  server: {
    host: '0.0.0.0',
    port: 3434,
  },
});
