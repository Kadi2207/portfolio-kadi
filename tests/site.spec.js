// Tests du portfolio (Playwright). Lancer : npm test
import { test, expect } from '@playwright/test';

const MAX_PAGE_BYTES = 1.5 * 1024 * 1024; // seuil fixe en partie 2

// Fait defiler toute la page pour declencher les chargements differes et les animations d'apparition.
async function scrollAll(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); }
    scrollTo(0, 0);
  });
}

test('le site charge sans erreur console', async ({ page }) => {
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  await scrollAll(page);
  await page.waitForTimeout(500);
  expect(errors).toEqual([]);
});

test('les deux langues basculent (textes, lang, titre)', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await expect(page).toHaveTitle('Kadidiatou Bagayoko | Data & IA | Portfolio');
  const desc = page.locator('meta[name="description"]');
  await expect(desc).toHaveAttribute('content', /^Portfolio de Kadidiatou Bagayoko, étudiante en Data & Intelligence Artificielle/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Kadidiatou Bagayoko | Data & IA | Portfolio');
  await page.locator('[data-act="lang"]').first().click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page).toHaveTitle('Kadidiatou Bagayoko | Data & AI | Portfolio');
  await expect(desc).toHaveAttribute('content', /^Portfolio of Kadidiatou Bagayoko, Data & Artificial Intelligence student/);
  await expect(page.locator('#contact .section-title')).toHaveText('Available now');
  await expect(page.locator('#collaborer h2')).toHaveText('I turn data into levers for decision-making and business needs into Data & AI solutions.');
  await expect(page.locator('#collaborer a[href="#contact"]')).toHaveText('Get in touch');
  await page.locator('[data-act="lang"]').first().click();
  await expect(page.locator('#contact .section-title')).toHaveText('Disponible dès maintenant');
  await expect(page.locator('#collaborer h2')).toHaveText('Je transforme les données en leviers de décision et les besoins métier en solutions Data & IA.');
  await expect(page.locator('#collaborer a[href="#contact"]')).toHaveText('Me contacter');
});

test('le bandeau Collaborer est juste avant Competences et mene a Contact', async ({ page }) => {
  await page.goto('/');
  expect(await page.evaluate(() => document.getElementById('competences').previousElementSibling.id)).toBe('collaborer');
  const btn = page.locator('#collaborer a[href="#contact"]');
  await btn.scrollIntoViewIfNeeded();
  await btn.click();
  await expect(page).toHaveURL(/#contact$/);
  // Contact est en bas de page : on verifie que son titre est bien a l'ecran apres le defilement
  await expect.poll(() => page.evaluate(() => { const r = document.querySelector('#contact .section-title').getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; })).toBe(true);
});

const STATS_FR = ['8,91 M£', '397 884', '82,5 %'];
const STATS_EN = ['£8.91M', '397,884', '82.5%'];
const statTexts = page => page.locator('.stat-value[data-count]').allTextContents();

test('compteurs du hero : valeurs finales sans JavaScript (aucun 0)', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/');
  expect(await statTexts(page)).toEqual(STATS_FR);
  await ctx.close();
});

test('compteurs du hero : aucun decompte en prefers-reduced-motion, valeurs EN apres bascule', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (let i = 0; i < 4; i++) { expect(await statTexts(page)).toEqual(STATS_FR); await page.waitForTimeout(150); }
  await page.locator('[data-act="lang"]').first().click();
  expect(await statTexts(page)).toEqual(STATS_EN);
});

test('compteurs du hero : avec animation, ils finissent sur la valeur exacte', async ({ page }) => {
  await page.goto('/');
  await expect.poll(() => statTexts(page), { timeout: 4000 }).toEqual(STATS_FR);
});

test('les deux themes basculent', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'light');
  const sw = page.locator('[data-act="theme"]').first();
  await sw.click();
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await expect(sw).toHaveAttribute('aria-checked', 'true');
  await sw.click();
  await expect(html).toHaveAttribute('data-theme', 'light');
});

test('les 8 certifications s\'ouvrent au clic et au clavier, image chargee et lien nouvel onglet valide', async ({ page, request }) => {
  await page.goto('/');
  const roots = page.locator('.gf-root[data-cert]');
  await expect(roots).toHaveCount(8);
  const modal = page.locator('#certModal'), tab = page.locator('#cModalTab'), link = page.locator('#cModalLink');
  for (let i = 0; i < 8; i++) {
    const hit = roots.nth(i).locator('.gf-hit');
    await hit.scrollIntoViewIfNeeded();
    for (const how of ['clic', 'clavier']) {
      if (how === 'clic') await hit.click(); else { await hit.focus(); await page.keyboard.press('Enter'); }
      await expect(modal).toHaveClass(/open/);
      await expect(page.locator('#cModalName')).not.toBeEmpty();
      // image du certificat chargee (pas de PDF en secours : toutes les images existent)
      await expect.poll(() => page.evaluate(() => { const im = document.getElementById('cModalImg'); return im.style.display === 'block' && im.complete && im.naturalWidth > 0; })).toBe(true);
      // "Ouvrir dans un nouvel onglet" : visible, nouvel onglet, fichier existant
      await expect(tab).toBeVisible();
      await expect(tab).toHaveText('Ouvrir dans un nouvel onglet');
      await expect(tab).toHaveAttribute('target', '_blank');
      expect((await request.get(await tab.getAttribute('href'))).status()).toBe(200);
      // aucun lien qui ne mene nulle part
      const href = await link.getAttribute('href');
      if (await link.isVisible()) expect(href).toMatch(/^https:\/\//); else expect(href).toBeNull();
      await page.keyboard.press('Escape');
      await expect(modal).not.toHaveClass(/open/);
    }
  }
  expect(await page.locator('a[href="#"]').count()).toBe(0);
});

// Fiches detaillees des projets : phrase d'introduction puis puces (intitule en gras), FR et EN
const SHEETS = {
  tcim: { n: 6, fr: ['Chez Skills4Mind, Kadidiatou a coordonné', 'Classification intelligente', 'Distinction'], en: ['At Skills4Mind, Kadidiatou coordinated', 'Smart classification', 'Distinction'] },
  ecommerce: { n: 7, fr: ['Dashboard interactif (Streamlit et Plotly)', 'Données', 'Limites'], en: ['Interactive dashboard (Streamlit and Plotly)', 'Data', 'Limits'] },
};
for (const [key, s] of Object.entries(SHEETS)) {
  test(`fiche detaillee du projet ${key} : introduction et puces en FR et EN`, async ({ page }) => {
    await page.goto('/');
    const card = page.locator(`.project-card[data-key="${key}"]`), modal = page.locator('#projectModal');
    const points = page.locator('#projPoints > li');
    for (const lang of ['fr', 'en']) {
      if (lang === 'en') await page.locator('[data-act="lang"]').first().click();
      await card.scrollIntoViewIfNeeded();
      await card.click();
      await expect(modal).toHaveClass(/open/);
      await expect(page.locator('#projDesc')).toContainText(s[lang][0]);
      await expect(points).toHaveCount(s.n);
      await expect(points.first().locator('strong')).toHaveText(s[lang][1]);
      await expect(points.last().locator('strong')).toHaveText(s[lang][2]);
      await page.keyboard.press('Escape');
      await expect(modal).not.toHaveClass(/open/);
    }
  });
}

test('aucun element Embedding Lab sur le site (decision reportee a la fin du projet)', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.project-card')).toHaveCount(4);
  expect(await page.evaluate(() => Object.keys(projectData).some(k => /embed/i.test(k)))).toBe(false);
  await expect(page.locator('a[href*="semantic-agent-engine"]')).toHaveCount(0);
  expect(await page.locator('main').innerText()).not.toMatch(/Embedding Lab/i);
});

test('les 4 badges Prise de parole ouvrent leur photo', async ({ page }) => {
  await page.goto('/');
  const badges = page.locator('.lan .lan-badge');
  await expect(badges).toHaveCount(4);
  for (let i = 0; i < 4; i++) {
    await badges.nth(i).scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await badges.nth(i).click();
    await expect(page.locator('#gLight')).toHaveClass(/open/);
    await expect.poll(() => page.evaluate(() => { const im = document.getElementById('gLightImg'); return im.complete && im.naturalWidth > 0; })).toBe(true);
    await page.keyboard.press('Escape');
    await expect(page.locator('#gLight')).not.toHaveClass(/open/);
  }
});

for (const width of [360, 390, 1280]) {
  test(`badges Prise de parole : photo entiere (contain) dans un cadre carre commun a ${width} px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.locator('.lan-rail').scrollIntoViewIfNeeded();
    await expect.poll(() => page.evaluate(() => [...document.querySelectorAll('.lan-photo')].every(p => p.style.backgroundImage))).toBe(true);
    // taille de mise en page (offsetWidth/Height) : le balancement des badges ne compte pas
    const photos = await page.locator('.lan-photo').evaluateAll(els => els.map(p => ({ size: getComputedStyle(p).backgroundSize, bg: getComputedStyle(p).backgroundColor, ratio: p.offsetWidth / p.offsetHeight, h: p.offsetHeight })));
    expect(photos).toHaveLength(4);
    for (const p of photos) { expect(p.size).toBe('contain'); expect(Math.abs(p.ratio - 1)).toBeLessThan(0.02); }
    expect(new Set(photos.map(p => p.h)).size).toBe(1);
    // bandes : variable de fond du site (var(--surface-soft)), coherente dans les deux themes
    for (const theme of ['light', 'dark']) {
      await page.evaluate(t => document.documentElement.setAttribute('data-theme', t), theme);
      const [bg, token] = await page.evaluate(() => { const d = document.createElement('div'); d.style.backgroundColor = 'var(--surface-soft)'; document.body.append(d); const t = getComputedStyle(d).backgroundColor; d.remove(); return [getComputedStyle(document.querySelector('.lan-photo')).backgroundColor, t]; });
      expect(bg, theme).toBe(token);
    }
  });
}

test('la galerie ouvre ses images', async ({ page }) => {
  await page.goto('/');
  await page.locator('#gStage').scrollIntoViewIfNeeded();
  const active = page.locator('#gStage .g-item.is-active');
  await expect(active).toBeVisible();
  await active.click();
  await expect(page.locator('#gLight')).toHaveClass(/open/);
  await expect.poll(() => page.evaluate(() => { const im = document.getElementById('gLightImg'); return im.complete && im.naturalWidth > 0; })).toBe(true);
  await page.keyboard.press('Escape');
  // navigation au clavier : la fleche change la photo active
  const activeIndex = () => page.evaluate(() => [...document.querySelectorAll('#gStage .g-item')].findIndex(e => e.classList.contains('is-active')));
  const count = await page.locator('#gStage .g-item').count();
  const before = await activeIndex();
  await page.locator('#gStage').focus();
  await page.keyboard.press(before < count - 1 ? 'ArrowRight' : 'ArrowLeft');
  await expect.poll(activeIndex).not.toBe(before);
});

for (const theme of ['light', 'dark']) {
  test(`visionneuse : bouton fermer au clavier, Echap et clic sur le fond a 390 px (${theme})`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: theme });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    const light = page.locator('#gLight'), close = page.locator('#gLight .g-light-close');

    // Ouvre une photo (galerie ou badge) et verifie la croix : visible, dans l'ecran, focus dessus
    async function openAndCheck(open) {
      await open();
      await expect(light).toHaveClass(/open/);
      await expect(close).toBeVisible();
      const b = await close.boundingBox();
      expect(b.x).toBeGreaterThanOrEqual(0);
      expect(b.y).toBeGreaterThanOrEqual(0);
      expect(b.x + b.width).toBeLessThanOrEqual(390);
      expect(b.width).toBeGreaterThanOrEqual(44);
      await expect(close).toBeFocused();
      await expect(close).toHaveAttribute('aria-label', 'Fermer');
    }
    const openGallery = async () => {
      await page.locator('#gStage').scrollIntoViewIfNeeded();
      await page.locator('#gStage .g-item.is-active').click();
    };
    const badge = page.locator('.lan .lan-badge').first();
    const openBadge = async () => {
      await badge.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await badge.click();
    };

    // 1. Entree sur la croix ferme et rend le focus au badge
    await openAndCheck(openBadge);
    await page.keyboard.press('Enter');
    await expect(light).not.toHaveClass(/open/);
    await expect(badge).toBeFocused();

    // 2. Echap ferme
    await openAndCheck(openGallery);
    await page.keyboard.press('Escape');
    await expect(light).not.toHaveClass(/open/);

    // 3. Clic sur le fond (coin bas gauche, hors image) ferme
    await openAndCheck(openGallery);
    await page.mouse.click(4, 840);
    await expect(light).not.toHaveClass(/open/);

    // 4. Clic souris sur la croix ferme
    await openAndCheck(openBadge);
    await close.click();
    await expect(light).not.toHaveClass(/open/);
  });
}

test('chatbot : reponse predefinie sans reseau et bouton email FR/EN', async ({ page }) => {
  let apiCalls = 0;
  await page.route('**/api/**', r => { apiCalls++; return r.abort(); });
  await page.goto('/');
  await page.locator('[data-act="chat-open"]').first().click();
  await expect(page.locator('#chatModal')).toHaveClass(/open/);
  await expect(page.locator('#chatInput')).toHaveCount(0);
  await expect(page.locator('.suggestions-row > *')).toHaveCount(10);
  const mail = page.locator('#chatMail');
  await expect(mail).toBeVisible();
  expect(decodeURIComponent(await mail.getAttribute('href'))).toContain('mailto:kadibaga22@gmail.com?subject=Question depuis votre portfolio');
  await page.locator('.suggestions-row > *').first().click();
  await expect(page.locator('#chatMessages .msg.bot').last()).toContainText('Kadidiatou', { timeout: 3000 });
  expect(apiCalls).toBe(0);
  await page.keyboard.press('Escape');
  await expect(page.locator('#chatModal')).not.toHaveClass(/open/);
  await page.locator('[data-act="lang"]').first().click();
  expect(decodeURIComponent(await mail.getAttribute('href'))).toContain('subject=Question from your portfolio');
});

test('chatbot : bouton FR | EN, messages re-rendus sans reseau, choix garde pour la session', async ({ page }) => {
  let apiCalls = 0;
  await page.route('**/api/**', r => { apiCalls++; return r.abort(); });
  await page.goto('/');
  await page.locator('[data-act="chat-open"]').first().click();
  const fr = page.locator('[data-act="chat-lang"][data-lang="fr"]'), en = page.locator('[data-act="chat-lang"][data-lang="en"]');
  await expect(fr).toHaveAttribute('aria-pressed', 'true');
  await expect(en).toHaveAttribute('aria-pressed', 'false');
  // cibles tactiles d'au moins 44 px
  for (const b of [fr, en]) { const r = await b.boundingBox(); expect(r.width).toBeGreaterThanOrEqual(44); expect(r.height).toBeGreaterThanOrEqual(44); }
  await page.locator('.suggestions-row > *', { hasText: 'Pourquoi la recruter ?' }).click();
  const answer = page.locator('#chatMessages .msg.bot').last();
  await expect(answer).toContainText('Major de promotion', { timeout: 3000 });
  // au clavier : Tab jusqu'au bouton EN puis Entree
  await en.focus();
  await page.keyboard.press('Enter');
  await expect(en).toHaveAttribute('aria-pressed', 'true');
  await expect(fr).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.chat-panel')).toHaveAttribute('lang', 'en');
  await expect(page.locator('#chatMessages .msg.user').last()).toHaveText('Why hire her?');
  await expect(answer).toContainText('Top of the B2 class');
  await expect(page.locator('#chatMessages .msg.bot').first()).toContainText("Hello! I'm Kadidiatou's virtual assistant");
  await expect(page.locator('.suggestions-row > *').first()).toHaveText('Profile overview');
  await expect(page.locator('#chatTitle')).toHaveText("Kadidiatou's Assistant");
  await expect(page.locator('[data-act="chat-close"]')).toHaveAttribute('aria-label', 'Close');
  expect(decodeURIComponent(await page.locator('#chatMail').getAttribute('href'))).toContain('subject=Question from your portfolio');
  // le site reste en francais, et changer la langue du site ne change plus celle du chat
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await page.keyboard.press('Escape');
  await page.locator('[data-act="lang"]').first().click();
  await page.locator('[data-act="lang"]').first().click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await expect(en).toHaveAttribute('aria-pressed', 'true');
  await expect(answer).toContainText('Top of the B2 class');
  // retour en francais : tout est re-rendu
  await page.locator('[data-act="chat-open"]').first().click();
  await fr.click();
  await expect(answer).toContainText('Major de promotion');
  await expect(page.locator('#chatMessages .msg.user').last()).toHaveText('Pourquoi la recruter ?');
  // choix memorise pour la session
  await en.click();
  await page.reload();
  await expect(page.locator('[data-act="chat-lang"][data-lang="en"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.suggestions-row > *').first()).toHaveText('Profile overview');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  expect(apiCalls).toBe(0);
});

test('chatbot : les 10 questions suggerees dans l\'ordre (FR puis EN), sans Consulat', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-act="chat-open"]').first().click();
  const chips = page.locator('.suggestions-row > *');
  await expect(chips).toHaveText(['Présentation du profil', 'Pourquoi la recruter ?', 'Parle-moi de ses expériences', 'Son projet TCIM ?', 'A-t-elle dirigé une équipe ?', 'Ses compétences en IA ?', 'Son projet e-commerce ?', 'Est-elle disponible ?', 'Distinctions et engagement ?', 'Sa formation ?']);
  await page.locator('[data-act="chat-lang"][data-lang="en"]').click();
  await expect(chips).toHaveText(['Profile overview', 'Why hire her?', 'Tell me about her experience', 'Her TCIM project?', 'Has she led a team?', 'Her AI skills?', 'Her e-commerce project?', 'Is she available?', 'Awards and engagement?', 'Her education?']);
  expect(await page.evaluate(() => Object.keys(CANNED.fr).concat(Object.keys(CANNED.en)).includes('consulat'))).toBe(false);
  await chips.first().click();
  await expect(page.locator('#chatMessages .msg.bot').last()).toContainText('works at the intersection of business, data and AI', { timeout: 3000 });
});

test('chatbot : Distinctions en 5 lignes (titre en gras, sans puce) et Sa formation sans Bac+5, FR et EN', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-act="chat-open"]').first().click();
  await page.locator('.suggestions-row > *', { hasText: 'Distinctions et engagement ?' }).click();
  const answer = page.locator('#chatMessages .msg.bot').last();
  await expect(answer.locator('p')).toHaveCount(5, { timeout: 3000 });
  await expect(answer.locator('li')).toHaveCount(0);
  await expect(answer.locator('p strong').first()).toHaveText('Major de promotion B2');
  await expect(answer.locator('p').first()).toContainText('19/20 de moyenne');
  await page.locator('[data-act="chat-lang"][data-lang="en"]').click();
  await expect(answer.locator('p strong').last()).toHaveText('ECE Ambassador');
  await page.locator('.suggestions-row > *', { hasText: 'Her education?' }).click();
  const edu = page.locator('#chatMessages .msg.bot').last();
  await expect(edu).toContainText('advanced English (C1)', { timeout: 3000 });
  await expect(edu).not.toContainText('Bac+5');
});

test('chatbot : sans choix dans le chat, la langue du site entraine celle du chat', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-act="chat-open"]').first().click();
  await page.locator('.suggestions-row > *', { hasText: 'Pourquoi la recruter ?' }).click();
  const answer = page.locator('#chatMessages .msg.bot').last();
  await expect(answer).toContainText('Major de promotion', { timeout: 3000 });
  await page.keyboard.press('Escape');
  await page.locator('[data-act="lang"]').first().click();
  await expect(page.locator('[data-act="chat-lang"][data-lang="en"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.chat-panel')).toHaveAttribute('lang', 'en');
  await expect(answer).toContainText('Top of the B2 class');
  await expect(page.locator('#chatMessages .msg.user').last()).toHaveText('Why hire her?');
});

for (const vp of [{ width: 1366, height: 768 }, { width: 390, height: 844 }, { width: 360, height: 640 }]) {
  test(`chatbot : panneau entierement visible a ${vp.width}x${vp.height}`, async ({ page }) => {
    await page.setViewportSize(vp);
    await page.goto('/');
    await page.locator('[data-act="chat-open"]').first().click();
    const box = await page.locator('.chat-panel').boundingBox();
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.y + box.height).toBeLessThanOrEqual(vp.height);
    expect(box.x + box.width).toBeLessThanOrEqual(vp.width);
    const mail = await page.locator('#chatMail').boundingBox();
    expect(mail.y + mail.height).toBeLessThanOrEqual(box.y + box.height);
  });
}

for (const theme of ['light', 'dark']) {
  test(`chatbot : fleche de defilement des questions suggerees a 360 px (${theme})`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.emulateMedia({ colorScheme: theme });
    await page.goto('/');
    await page.locator('[data-act="chat-open"]').first().click();
    const row = page.locator('#suggestionsRow'), more = page.locator('#suggMore');
    await expect(more).toBeVisible();
    await expect(more).toHaveAttribute('aria-label', 'Voir plus de questions');
    // au clavier : Entree fait defiler
    await more.focus();
    await page.keyboard.press('Enter');
    await expect.poll(() => row.evaluate(r => r.scrollTop)).toBeGreaterThan(0);
    // a la souris jusqu'en fin de course : la fleche disparait
    for (let i = 0; i < 10 && await more.isVisible(); i++) await more.click();
    await expect(more).toBeHidden();
    expect(await row.evaluate(r => r.scrollTop + r.clientHeight >= r.scrollHeight - 1)).toBe(true);
    // en remontant, elle revient
    await row.evaluate(r => { r.scrollTop = 0; });
    await expect(more).toBeVisible();
  });
}

test('chatbot : reponse libre via /api/chat simule (questions libres rouvertes)', async ({ page }) => {
  // Simule CHAT_FREE=true dans app.js et une reponse du serveur
  await page.route('**/app.js', async r => {
    const res = await r.fetch();
    await r.fulfill({ response: res, body: (await res.text()).replace('const CHAT_FREE=false;', 'const CHAT_FREE=true;') });
  });
  let sent = null;
  await page.route('**/api/chat', r => { sent = r.request().postDataJSON(); return r.fulfill({ json: { reply: 'Réponse **simulée** du serveur.' } }); });
  await page.goto('/');
  await page.locator('[data-act="chat-open"]').first().click();
  await expect(page.locator('#chatMail')).toHaveCount(0);
  await page.locator('#chatInput').fill('Quel est son niveau en SQL ?');
  await page.keyboard.press('Enter');
  await expect(page.locator('#chatMessages .msg.bot').last()).toContainText('Réponse simulée du serveur.');
  expect(sent).toMatchObject({ lang: 'fr', message: 'Quel est son niveau en SQL ?' });
});

test('/api/chat refuse les questions libres quand CHAT_FREE_ENABLED est faux (appel direct)', async ({ request }) => {
  const r = await request.post('/api/chat', { data: { lang: 'en', message: 'Hello' }, headers: { Origin: 'http://localhost:8092' } });
  expect(r.status()).toBe(503);
  expect(await r.json()).toMatchObject({ error: 'disabled' });
  const h = await (await request.get('/api/health')).json();
  expect(h.chatFree).toBe(false);
});

for (const theme of ['light', 'dark']) {
  test(`aucun debordement horizontal a 390 px (${theme})`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: theme });
    await page.goto('/');
    await scrollAll(page);
    const [sw, cw] = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
    expect(sw).toBeLessThanOrEqual(cw);
  });
}

test(`poids de la page au chargement sous ${MAX_PAGE_BYTES / 1048576} Mo`, async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  // octets recus (page + ressources), mesures par le navigateur
  const total = await page.evaluate(() => performance.getEntriesByType('navigation').concat(performance.getEntriesByType('resource'))
    .reduce((s, e) => s + (e.encodedBodySize || e.transferSize || 0), 0));
  expect(total).toBeGreaterThan(50 * 1024);
  expect(total).toBeLessThan(MAX_PAGE_BYTES);
  console.log(`poids au chargement : ${(total / 1024).toFixed(0)} Ko`);
});
