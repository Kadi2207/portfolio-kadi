// Referencement : adresse du site, balises de partage, sitemap, robots et icones.
//
// Utilisation :
//   npm run seo                              garde l'adresse actuelle
//   npm run seo -- https://kadi-bagayoko.fr  change l'adresse partout (domaine final)
//
// Le script reecrit le bloc entre <!-- seo:start --> et <!-- seo:end --> dans index.html
// (title, description, canonical, Open Graph, Twitter, icones, JSON-LD), puis sitemap.xml
// et robots.txt. Il genere aussi og.jpg (1200x630) et les icones a partir de img/kadi.webp.

import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const INDEX = path.join(ROOT, 'index.html');
const DEFAULT_URL = 'https://kadidiatou-bagayoko.vercel.app'; // adresse Vercel actuelle, remplacee par le domaine final

// Titre et description : FR affiches par defaut et repris par les balises de partage (Open Graph, Twitter),
// EN appliques par app.js quand on bascule la langue.
const NAME = 'Kadidiatou Bagayoko';
const TEXT = {
  fr: {
    title: 'Kadidiatou Bagayoko | Data & IA | Portfolio',
    description: "Portfolio de Kadidiatou Bagayoko, étudiante en Data & Intelligence Artificielle à l'ECE Paris. Projets en Python, SQL, machine learning, analyse de données et IA générative. Disponible pour une alternance Data & IA.",
  },
  en: {
    title: 'Kadidiatou Bagayoko | Data & AI | Portfolio',
    description: 'Portfolio of Kadidiatou Bagayoko, Data & Artificial Intelligence student at ECE Paris. Projects in Python, SQL, machine learning, data analysis and generative AI. Available for a Data & AI apprenticeship.',
  },
};

const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

let html = fs.readFileSync(INDEX, 'utf8');
const current = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
let url = (process.argv[2] || current || DEFAULT_URL).trim().replace(/\/+$/, '');
if (!/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}$/i.test(url)) {
  console.error(`Adresse invalide : ${url}. Exemple : npm run seo -- https://kadi-bagayoko.fr`);
  process.exit(1);
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Kadidiatou Ibrahima Bagayoko',
  alternateName: NAME,
  url: url + '/',
  image: url + '/og.jpg',
  email: 'mailto:kadibaga22@gmail.com',
  jobTitle: "Étudiante Data & Intelligence Artificielle, en recherche d'alternance",
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'ECE Paris' },
  address: { '@type': 'PostalAddress', addressLocality: 'Paris', addressRegion: 'Île-de-France', addressCountry: 'FR' },
  knowsAbout: ['Data analysis', 'Machine Learning', 'NLP', 'Python', 'Flask', 'Intelligence artificielle'],
  sameAs: ['https://www.linkedin.com/in/kadi-bagayoko', 'https://github.com/Kadi2207'],
};

const block = `<!-- seo:start (genere par npm run seo, ne pas modifier a la main) -->
<title data-en-content="${esc(TEXT.en.title)}">${esc(TEXT.fr.title)}</title>
<meta name="description" content="${esc(TEXT.fr.description)}" data-en-content="${esc(TEXT.en.description)}">
<link rel="canonical" href="${url}/">
<meta property="og:type" content="website">
<meta property="og:url" content="${url}/">
<meta property="og:site_name" content="${esc(NAME)}">
<meta property="og:locale" content="fr_FR"><meta property="og:locale:alternate" content="en_US">
<meta property="og:title" content="${esc(TEXT.fr.title)}">
<meta property="og:description" content="${esc(TEXT.fr.description)}">
<meta property="og:image" content="${url}/og.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(NAME)}, Data &amp; IA">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(TEXT.fr.title)}">
<meta name="twitter:description" content="${esc(TEXT.fr.description)}">
<meta name="twitter:image" content="${url}/og.jpg">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="theme-color" content="#1e3a5f">
<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>
<!-- seo:end -->`;

const re = /<!-- seo:start[\s\S]*?<!-- seo:end -->/;
if (!re.test(html)) {
  console.error('Bloc <!-- seo:start --> ... <!-- seo:end --> introuvable dans index.html.');
  process.exit(1);
}
html = html.replace(re, block);
fs.writeFileSync(INDEX, html);

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${url}/</loc><lastmod>${today}</lastmod></url>
</urlset>
`);
fs.writeFileSync(path.join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${url}/sitemap.xml\n`);

// Icones : un K or sur fond marine, comme l'ancien favicon
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#1e3a5f"/><text x="32" y="44" font-size="36" text-anchor="middle" font-family="Georgia,serif" fill="#e3b24a">K</text></svg>`;
fs.writeFileSync(path.join(ROOT, 'favicon.svg'), iconSvg + '\n');
await sharp(Buffer.from(iconSvg), { density: 300 }).resize(32, 32).png().toFile(path.join(ROOT, 'favicon-32.png'));
// apple-touch-icon : carre plein (iOS arrondit lui-meme)
const appleSvg = iconSvg.replace('rx="14"', 'rx="0"');
await sharp(Buffer.from(appleSvg), { density: 600 }).resize(180, 180).png().toFile(path.join(ROOT, 'apple-touch-icon.png'));

// Image de partage 1200x630 : photo a droite, nom et accroche a gauche
const photo = await sharp(path.join(ROOT, 'img', 'kadi.webp')).resize(630, 630, { fit: 'cover' }).toBuffer();
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#1e3a5f"/>
  <rect x="72" y="150" width="64" height="5" fill="#e3b24a"/>
  <text x="72" y="240" font-family="Georgia,serif" font-size="48" font-weight="700" fill="#ffffff">Kadidiatou</text>
  <text x="72" y="298" font-family="Georgia,serif" font-size="48" font-weight="700" fill="#ffffff">Ibrahima Bagayoko</text>
  <text x="72" y="380" font-family="Arial,sans-serif" font-size="30" fill="#e3b24a">Data &amp; Intelligence Artificielle</text>
  <text x="72" y="430" font-family="Arial,sans-serif" font-size="26" fill="#f6f1e8">ECE Paris | Alternance Data &amp; IA</text>
</svg>`;
await sharp(Buffer.from(ogSvg)).composite([{ input: photo, left: 570, top: 0 }]).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(ROOT, 'og.jpg'));

console.log(`Adresse du site : ${url}/`);
console.log('index.html (bloc seo), sitemap.xml, robots.txt, og.jpg, favicon.svg, favicon-32.png, apple-touch-icon.png ecrits.');
