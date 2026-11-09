// Genere les images optimisees du site et le manifeste images.json.
//
// Utilisation : depose la photo d'origine dans _originaux/images/ puis lance
//   npm run images
//
// Le script :
//   1. normalise les noms (minuscules, sans espace, "_" devient "-", sans double point) ;
//   2. produit un WebP (qualite 78, reduite si besoin pour rester sous 250 Ko)
//      a la bonne largeur selon le type d'image, plus une petite version (-sm)
//      pour les vignettes quand c'est utile ;
//   3. ecrit images.json, lu par le site pour savoir quelles images existent ;
//   4. met a jour les references fixes dans index.html (photo du hero, og:image).

import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, '_originaux', 'images');
const OUT = path.join(ROOT, 'img');
const MANIFEST = path.join(ROOT, 'images.json');
const INDEX = path.join(ROOT, 'index.html');

const QUALITY = 78;
const MIN_QUALITY = 50;
const MAX_BYTES = 250 * 1024;
const VERSION = 'v1'; // a changer pour forcer la regeneration de toutes les images

// Largeur maximale selon le type d'image. "sm" = vignette (cartes, dossiers, carrousel).
// box = la limite s'applique au plus grand cote (photos en portrait).
const RULES = [
  [/^kadi$/, { full: 800 }],
  [/^galerie-\d+$/, { full: 1600, sm: 900, box: true }],
  [/^parole-\d+(-\d+)?$/, { full: 1600, sm: 900, box: true }],
  [/^cert-/, { full: 1400, sm: 700, trim: true }],
  [/^(projet|boutique)-/, { full: 900 }],
  [/^recommandation-/, { full: 1400, sm: 400 }],
  [/.*/, { full: 1600 }],
];

const EXT = /\.(jpe?g|png|webp|tiff?)$/i;

function normalize(file) {
  return file
    .replace(EXT, '')
    .toLowerCase()
    .replace(/[_\s.]+/g, '-')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function encode(input, width, box) {
  let q = QUALITY;
  for (;;) {
    const { data, info } = await sharp(input)
      .resize(box ? { width, height: width, fit: 'inside', withoutEnlargement: true } : { width, withoutEnlargement: true })
      .webp({ quality: q, effort: 5 })
      .toBuffer({ resolveWithObject: true });
    if (data.length <= MAX_BYTES || q <= MIN_QUALITY) return { data, w: info.width, h: info.height, q };
    q -= 6;
  }
}

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error(`Dossier source introuvable : ${SRC}\nRien n'a ete modifie.`);
    process.exit(1);
  }
  const files = fs.readdirSync(SRC).filter(f => EXT.test(f)).sort();
  if (!files.length) {
    console.error(`Aucune image dans ${SRC}. Rien n'a ete modifie.`);
    process.exit(1);
  }

  const seen = new Map();
  for (const f of files) {
    const n = normalize(f);
    if (seen.has(n)) {
      console.error(`Deux fichiers donnent le meme nom "${n}" : ${seen.get(n)} et ${f}. Garde un seul des deux.`);
      process.exit(1);
    }
    seen.set(n, f);
  }

  const tmp = OUT + '.tmp';
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });

  const images = {};
  const rows = [];
  const warnings = [];
  let totalIn = 0, totalOut = 0;

  for (const [name, file] of [...seen.entries()].sort()) {
    const rule = RULES.find(([re]) => re.test(name))[1];
    const buf = fs.readFileSync(path.join(SRC, file));
    const hash = crypto.createHash('sha1').update(buf).update(JSON.stringify(rule) + QUALITY + VERSION).digest('hex').slice(0, 8);

    // Orientation EXIF appliquee ; marges blanches retirees pour les certificats (rien n'est coupe).
    let base = sharp(buf, { failOn: 'none' }).rotate();
    if (rule.trim) {
      try {
        base = sharp(await base.trim({ background: '#ffffff', threshold: 25 }).toBuffer());
      } catch {
        base = sharp(buf, { failOn: 'none' }).rotate();
      }
    }
    const baseBuf = await base.png().toBuffer();

    const full = await encode(baseBuf, rule.full, rule.box);
    fs.writeFileSync(path.join(tmp, `${name}.webp`), full.data);
    const entry = { src: `img/${name}.webp?v=${hash}`, w: full.w, h: full.h };
    let smInfo = '';
    if (rule.sm) {
      const sm = await encode(baseBuf, rule.sm, rule.box);
      fs.writeFileSync(path.join(tmp, `${name}-sm.webp`), sm.data);
      Object.assign(entry, { sm: `img/${name}-sm.webp?v=${hash}`, smw: sm.w, smh: sm.h });
      smInfo = `${(sm.data.length / 1024).toFixed(0)} Ko`;
      totalOut += sm.data.length;
    }
    images[name] = entry;
    totalIn += buf.length;
    totalOut += full.data.length;
    if (full.data.length > MAX_BYTES) warnings.push(`${name} depasse 250 Ko (${(full.data.length / 1024).toFixed(0)} Ko)`);
    rows.push([file, name, `${(buf.length / 1024).toFixed(0)} Ko`, `${(full.data.length / 1024).toFixed(0)} Ko`, `${full.w}x${full.h}`, `q${full.q}`, smInfo]);
  }

  // Remplacement atomique du dossier img/
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.renameSync(tmp, OUT);
  fs.writeFileSync(MANIFEST, JSON.stringify({ version: 1, images }, null, 2) + '\n');

  // Mise a jour des references fixes dans index.html : src, width et height.
  let html = fs.readFileSync(INDEX, 'utf8');
  const before = html;
  const missing = new Set();
  const ref = /img\/([a-z0-9-]+?)(-sm)?\.webp(\?v=[0-9a-f]+)?/g;
  const fix = s => s.replace(ref, (m, n, sm) => {
    const e = images[n];
    if (!e) { missing.add(n); return m; }
    return sm ? e.sm || m : e.src;
  });
  html = html.replace(/<img\b[^>]*>/g, tag => {
    const m = tag.match(/src="img\/([a-z0-9-]+?)(-sm)?\.webp/);
    if (!m || !images[m[1]]) return fix(tag);
    const e = images[m[1]];
    const [w, h] = m[2] ? [e.smw, e.smh] : [e.w, e.h];
    return fix(tag).replace(/\swidth="\d+"/, '').replace(/\sheight="\d+"/, '').replace(/^<img\b/, `<img width="${w}" height="${h}"`);
  });
  html = html.replace(/<meta\b[^>]*>/g, fix);
  if (html !== before) fs.writeFileSync(INDEX, html);

  console.table(rows.map(r => ({ source: r[0], nom: r[1], avant: r[2], apres: r[3], taille: r[4], qualite: r[5], vignette: r[6] })));
  console.log(`${rows.length} images : ${(totalIn / 1048576).toFixed(1)} Mo avant, ${(totalOut / 1048576).toFixed(2)} Mo apres (vignettes comprises).`);
  console.log(`images.json ecrit${html !== before ? ', index.html mis a jour' : ''}.`);
  for (const w of warnings) console.warn('Attention : ' + w);
  for (const n of missing) console.warn(`Attention : index.html reference img/${n}.webp qui n'existe pas.`);
}

main().catch(e => { console.error('Echec : ' + e.message); process.exit(1); });
