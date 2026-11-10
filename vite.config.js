import { defineConfig } from 'vite';
import { handleTutorRequest } from './server/tutor-handler.js';

export default defineConfig({
  server: {
    host: true,
    port: 5173
  },
  worker: {
    format: 'es'
  },
  plugins: [{
    name: 'codepath-ai-tutor-endpoint',
    configureServer(server) {
      server.middlewares.use('/api/tutor', (req, res, next) => {
        if (!req.url || req.url === '/') return handleTutorRequest(req, res);
        return next();
      });
    }
  }]
});
