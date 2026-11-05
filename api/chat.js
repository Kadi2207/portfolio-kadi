// Fonction serverless Vercel : POST /api/chat
// Le navigateur envoie { lang, message, history } ; le serveur ajoute la base de connaissances,
// appelle Groq avec la cle GROQ_API_KEY (variable d'environnement, jamais envoyee au navigateur)
// et renvoie { reply, model }.
//
// Variables d'environnement :
//   GROQ_API_KEY     obligatoire, la cle Groq
//   GROQ_MODEL       facultatif, modele principal (defaut : openai/gpt-oss-120b)
//   GROQ_MODELS      facultatif, modeles de secours separes par des virgules
//   ALLOWED_ORIGINS  facultatif, domaines autorises separes par des virgules (ex. https://kadi-bagayoko.fr)
//
// Aucun contenu de message ni aucune adresse IP n'est ecrit dans les logs.

import { KB_FR, KB_EN } from './_lib/knowledge.js';
import { CANNED } from './_lib/canned.js';

// GROQ_BASE_URL sert uniquement aux tests locaux (faux serveur Groq) ; ignoree en production.
const GROQ_URL = (process.env.VERCEL_ENV !== 'production' && process.env.GROQ_BASE_URL) || 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'openai/gpt-oss-120b';

const LIMITS = { bodyBytes: 32000, message: 1000, historyItems: 6, historyItem: 4000, historyTotal: 12000, reply: 6000 };
const RATE = { perIp: 20, global: 300, windowMs: 10 * 60 * 1000 };
const ATTEMPT_TIMEOUT_MS = 12000; // par modele
const DEADLINE_MS = 25000;        // pour toute la requete

/* ---------- configuration ---------- */
// Questions libres : fermees par defaut. Mettre CHAT_FREE_ENABLED=true sur Vercel pour les rouvrir.
export function chatFreeEnabled() {
  return String(process.env.CHAT_FREE_ENABLED || '').trim().toLowerCase() === 'true';
}
const FREE_OFF_MESSAGE = {
  fr: 'Les questions libres sont désactivées. Utilisez les questions suggérées ou écrivez à kadibaga22@gmail.com.',
  en: 'Free questions are disabled. Use the suggested questions or write to kadibaga22@gmail.com.',
};

export function modelList() {
  const list = [process.env.GROQ_MODEL || DEFAULT_MODEL, ...(process.env.GROQ_MODELS || '').split(',')]
    .map(s => s.trim())
    .filter(s => /^[\w.\/:-]{1,80}$/.test(s));
  return [...new Set(list)].slice(0, 5);
}

function systemPrompt(lang) {
  const head = lang === 'fr'
    ? "\n\nRÉPONSES DE RÉFÉRENCE (validées par Kadidiatou). Si la question correspond à l'un de ces sujets, reprends ces informations fidèlement, sans rien ajouter ni contredire, en raccourcissant si la question est plus étroite :\n"
    : '\n\nREFERENCE ANSWERS (validated by Kadidiatou). If the question matches one of these topics, reuse this information faithfully, adding or contradicting nothing, shortening it if the question is narrower:\n';
  return (lang === 'fr' ? KB_FR : KB_EN) + head + Object.values(CANNED[lang]).join('\n\n---\n\n');
}

/* ---------- reponses HTTP ---------- */
function json(status, body, origin, extra = {}) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...extra,
  };
  if (origin) { headers['Access-Control-Allow-Origin'] = origin; headers['Vary'] = 'Origin'; }
  return new Response(JSON.stringify(body), { status, headers });
}

/* ---------- CORS : seulement le site lui-meme et les domaines autorises ---------- */
function checkOrigin(request) {
  const origin = request.headers.get('origin');
  if (!origin) return { ok: true, origin: null }; // appel sans navigateur (le limiteur s'applique quand meme)
  const host = request.headers.get('host') || '';
  const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim().replace(/\/$/, '')).filter(Boolean);
  if (host) allowed.push('https://' + host);
  if (/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host)) allowed.push('http://' + host);
  return allowed.includes(origin) ? { ok: true, origin } : { ok: false, origin: null };
}

/* ---------- limite de debit (memoire de l'instance) ---------- */
const hits = new Map();
let globalHits = [];
function rateLimit(ip, now) {
  const since = now - RATE.windowMs;
  globalHits = globalHits.filter(t => t > since);
  const list = (hits.get(ip) || []).filter(t => t > since);
  if (list.length >= RATE.perIp) return Math.ceil((list[0] + RATE.windowMs - now) / 1000);
  if (globalHits.length >= RATE.global) return Math.ceil((globalHits[0] + RATE.windowMs - now) / 1000);
  list.push(now); globalHits.push(now); hits.set(ip, list);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some(t => t > since)) hits.delete(k);
  return 0;
}
function clientIp(request) {
  const fwd = request.headers.get('x-forwarded-for') || '';
  return fwd.split(',')[0].trim() || request.headers.get('x-real-ip') || 'inconnue';
}

/* ---------- validation stricte ---------- */
const clean = s => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
function validate(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  if (Object.keys(body).some(k => !['lang', 'message', 'history'].includes(k))) return null;
  if (body.lang !== 'fr' && body.lang !== 'en') return null;
  if (typeof body.message !== 'string') return null;
  const message = clean(body.message);
  if (!message || message.length > LIMITS.message) return null;
  const history = body.history === undefined ? [] : body.history;
  if (!Array.isArray(history) || history.length > LIMITS.historyItems) return null;
  let total = 0;
  const hist = [];
  for (const h of history) {
    if (!h || typeof h !== 'object' || Array.isArray(h)) return null;
    if (Object.keys(h).length !== 2 || !['user', 'assistant'].includes(h.role) || typeof h.content !== 'string') return null;
    const content = clean(h.content);
    if (!content || content.length > LIMITS.historyItem) return null;
    total += content.length;
    hist.push({ role: h.role, content });
  }
  if (total > LIMITS.historyTotal) return null;
  return { lang: body.lang, message, history: hist };
}

/* ---------- appel Groq avec modeles de secours ---------- */
// 404 (modele inconnu), 429 (quota), 5xx (panne) et 400 (modele retire ou parametre refuse par CE modele,
// la requete ayant deja ete validee) : on passe au modele suivant. 401/403 (cle) : inutile d'insister.
const FALLBACK_STATUS = s => s === 400 || s === 404 || s === 429 || s >= 500;
// Certains modeles "raisonnants" peuvent renvoyer leur raisonnement entre balises <think> : jamais montre au visiteur.
const stripThinking = s => s.replace(/<think>[\s\S]*?(<\/think>|$)/gi, '').trim();

async function askGroq(messages, deadline) {
  let last = 'unavailable';
  for (const model of modelList()) {
    const left = deadline - Date.now();
    if (left < 1500) return { error: 'timeout' };
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), Math.min(ATTEMPT_TIMEOUT_MS, left));
    try {
      const payload = { model, messages, temperature: 0.2, max_tokens: 1200 };
      if (/^openai\/gpt-oss/.test(model)) payload.reasoning_effort = 'low';
      const res = await fetch(GROQ_URL, {
        method: 'POST',
        signal: ctl.signal,
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.GROQ_API_KEY },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json().catch(() => null);
        const content = data?.choices?.[0]?.message?.content;
        const reply = typeof content === 'string' ? stripThinking(content) : '';
        if (reply) return { reply: reply.slice(0, LIMITS.reply), model };
        console.warn(`[chat] reponse vide du modele ${model}, essai du suivant`);
        last = 'unavailable';
        continue;
      }
      let code = '';
      if (res.status === 400) code = String((await res.json().catch(() => null))?.error?.code || '');
      else await res.body?.cancel().catch(() => {});
      console.warn(`[chat] modele ${model} : HTTP ${res.status}${code ? ' ' + code : ''}`);
      if (res.status === 401 || res.status === 403) return { error: 'unavailable' }; // cle invalide : inutile d'insister
      if (FALLBACK_STATUS(res.status)) { last = res.status === 429 ? 'busy' : 'unavailable'; continue; }
      return { error: 'unavailable' };
    } catch (e) {
      console.warn(`[chat] modele ${model} : ${e.name === 'AbortError' ? 'delai depasse' : 'erreur reseau'}`);
      last = e.name === 'AbortError' ? 'timeout' : 'unavailable';
    } finally {
      clearTimeout(timer);
    }
  }
  return { error: last };
}

/* ---------- points d'entree ---------- */
export function OPTIONS(request) {
  const { ok, origin } = checkOrigin(request);
  if (!ok) return new Response(null, { status: 403 });
  return new Response(null, {
    status: 204,
    headers: { 'Access-Control-Allow-Origin': origin || '', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '600', Vary: 'Origin' },
  });
}

export async function POST(request) {
  const deadline = Date.now() + DEADLINE_MS;
  try {
    const { ok, origin } = checkOrigin(request);
    if (!ok) return json(403, { error: 'forbidden' }, null);

    if (!(request.headers.get('content-type') || '').toLowerCase().startsWith('application/json')) return json(415, { error: 'bad_request' }, origin);
    const len = Number(request.headers.get('content-length') || 0);
    if (len > LIMITS.bodyBytes) return json(413, { error: 'too_large' }, origin);

    const wait = rateLimit(clientIp(request), Date.now());
    if (wait) return json(429, { error: 'rate_limited' }, origin, { 'Retry-After': String(wait) });

    const raw = await request.text();
    if (Buffer.byteLength(raw) > LIMITS.bodyBytes) return json(413, { error: 'too_large' }, origin);
    let body;
    try { body = JSON.parse(raw); } catch { return json(400, { error: 'bad_request' }, origin); }
    const input = validate(body);
    if (!input) return json(400, { error: 'bad_request' }, origin);

    // Interrupteur : questions libres fermees tant que CHAT_FREE_ENABLED ne vaut pas "true" (meme en appel direct).
    if (!chatFreeEnabled()) return json(503, { error: 'disabled', message: FREE_OFF_MESSAGE[input.lang] }, origin);

    if (!process.env.GROQ_API_KEY) {
      console.warn('[chat] GROQ_API_KEY absente');
      return json(503, { error: 'unavailable' }, origin);
    }

    const messages = [{ role: 'system', content: systemPrompt(input.lang) }, ...input.history, { role: 'user', content: input.message }];
    const out = await askGroq(messages, deadline);
    if (out.reply) return json(200, { reply: out.reply, model: out.model }, origin);
    const status = out.error === 'busy' ? 429 : out.error === 'timeout' ? 504 : 503;
    return json(status, { error: out.error }, origin, status === 429 ? { 'Retry-After': '60' } : {});
  } catch {
    console.error('[chat] erreur interne');
    return json(500, { error: 'unavailable' }, null);
  }
}
