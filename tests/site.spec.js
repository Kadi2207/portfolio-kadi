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
  await expect(page).toHaveTitle(/Data & IA/);
  await page.locator('[data-act="lang"]').first().click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page).toHaveTitle(/Data & AI/);
  await expect(page.locator('#contact .section-title')).toHaveText('Available now');
  await page.locator('[data-act="lang"]').first().click();
  await expect(page.locator('#contact .section-title')).toHaveText('Disponible dès maintenant');
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

test('les 8 certifications s\'ouvrent', async ({ page }) => {
  await page.goto('/');
  const roots = page.locator('.gf-root[data-cert]');
  await expect(roots).toHaveCount(8);
  for (let i = 0; i < 8; i++) {
    const root = roots.nth(i);
    await root.scrollIntoViewIfNeeded();
    await root.locator('.gf-hit').click();
    const modal = page.locator('#certModal');
    await expect(modal).toHaveClass(/open/);
    await expect(page.locator('#cModalName')).not.toBeEmpty();
    // image du certificat chargee (ou PDF officiel en secours)
    await expect.poll(() => page.evaluate(() => {
      const im = document.getElementById('cModalImg'), fr = document.getElementById('cModalIframe');
      return (im.style.display === 'block' && im.complete && im.naturalWidth > 0) || fr.style.display === 'block';
    })).toBe(true);
    await page.keyboard.press('Escape');
    await expect(modal).not.toHaveClass(/open/);
  }
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
