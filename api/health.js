// Fonction serverless Vercel : GET /api/health
// Repond 200 et indique si la cle Groq est configuree, sans jamais la montrer.
// Utilise par la surveillance (UptimeRobot) et par "npm run check".

import { modelList } from './chat.js';

function body() {
  const models = modelList();
  return JSON.stringify({
    status: 'ok',
    groqKey: Boolean(process.env.GROQ_API_KEY),
    model: models[0],
    fallbacks: models.length - 1,
    time: new Date().toISOString(),
  });
}

const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };

export function GET() {
  return new Response(body(), { status: 200, headers });
}

export function HEAD() {
  return new Response(null, { status: 200, headers });
}
