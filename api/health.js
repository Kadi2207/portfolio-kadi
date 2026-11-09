// Fonction serverless Vercel : GET /api/health
// Repond 200 et indique l'etat du service (questions libres ouvertes ou non, cle Groq presente ou non),
// sans jamais montrer la cle ni le nom des modeles utilises.
// Utilise par la surveillance (UptimeRobot) et par "npm run check".

import { chatFreeEnabled } from './chat.js';

function body() {
  return JSON.stringify({
    status: 'ok',
    chatFree: chatFreeEnabled(),
    groqKey: Boolean(process.env.GROQ_API_KEY),
    time: new Date().toISOString(),
  });
}

const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };

export function GET() {
  return new Response(body(), { status: 200, headers });
}

export function HEAD() {
  return new Response(null, { status: 200, headers });
}
