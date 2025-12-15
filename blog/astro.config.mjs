import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: 'static',
  site: 'https://your-domain.com', // Update this for production
  vite: {
    ssr: {
      noExternal: ['@tanstack/react-query'],
    },
  },
});

