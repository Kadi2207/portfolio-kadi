// Tests automatiques du site : npm test
// Le serveur local (scripts/dev.mjs) est lance automatiquement, avec les memes en-tetes que Vercel.
import { defineConfig, devices } from '@playwright/test';

const PORT = 8092;

export default defineConfig({
  testDir: 'tests',
  timeout: 30000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: `http://localhost:${PORT}`, ...devices['Desktop Chrome'] },
  webServer: {
    command: 'node scripts/dev.mjs',
    url: `http://localhost:${PORT}/api/health`,
    reuseExistingServer: false,
    timeout: 30000,
    // Questions libres fermees comme en production ; aucune vraie cle n'est utilisee par les tests.
    env: { PORT: String(PORT), CHAT_FREE_ENABLED: 'false', GROQ_API_KEY: 'test-sans-cle' },
  },
});
