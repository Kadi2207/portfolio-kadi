// Tests tactiles (Playwright, emulation Chromium iPhone 13 et Pixel 7 : hasTouch, isMobile).
// Un tap ne doit deplacer aucun element de plus de 1 px (effets de survol reserves a la souris).
import { test, expect, devices } from '@playwright/test';

const strip = ({ defaultBrowserType, ...d }) => d;
const PROFILES = { 'iPhone 13': strip(devices['iPhone 13']), 'Pixel 7': strip(devices['Pixel 7']) };
const RUNS = [[360, 'light'], [390, 'dark'], [412, 'light']];

// [libelle, selecteur, preparation]
const TARGETS = [
  ['hero : Discuter avec mon IA', '.hero-btns .btn-or'],
  ['hero : LinkedIn', '.hero-btns .btn-secondary'],
  ['apercu du chat', '.chatbot-preview'],
  ['carte projet', '.project-card'],
  ['carte experience', '.exp-card'],
  ['dossier de certification', '.gf-root[data-cert] .gf-hit'],
  ['fleche de la galerie', '.g-arrow'],
  ['bouton Me contacter', '.cta-band .btn-primary'],
  ['etiquette de competence', '.skill-tag'],
  ['bouton email du contact', '.contact-btns .btn-white'],
  ['bouton de theme', '.theme-switch', 'menu'],
  ['suggestion du chat', '.suggestions-row .suggestion', 'chat'],
  ['bouton FR | EN du chat', '[data-act="chat-lang"][data-lang="en"]', 'chat'],
];

async function prepare(page) {
  // aucun depart du site (liens externes, mailto, ancres) : les etats :hover et :active s'appliquent quand meme
  await page.addInitScript(() => addEventListener('click', e => { const a = e.target.closest && e.target.closest('a[href]'); if (a) e.preventDefault(); }, true));
  await page.goto('/');
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); } scrollTo(0, 0); });
}
const docBox = loc => loc.evaluate(el => { const r = el.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height }; });
const gap = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y), Math.abs(a.w - b.w), Math.abs(a.h - b.h));

// Mesure la boite avant le tap (element immobile), juste apres et 300 ms apres ; renvoie le deplacement maximal.
async function tapShift(page, loc) {
  await loc.evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  let before = await docBox(loc);
  for (let k = 0; k < 30; k++) { await page.waitForTimeout(150); const b = await docBox(loc); const still = gap(b, before) < 0.5; before = b; if (still && k > 1) break; }
  await loc.tap({ force: true });
  const now = await docBox(loc);
  await page.waitForTimeout(300);
  const later = await docBox(loc);
  return Math.max(gap(before, now), gap(before, later));
}
async function reset(page) {
  await page.keyboard.press('Escape');
  await page.evaluate(() => { document.querySelectorAll('.modal-overlay.open,.g-light.open').forEach(m => m.classList.remove('open')); document.getElementById('navmenu').classList.remove('open'); });
}

for (const [name, device] of Object.entries(PROFILES)) {
  test.describe(`tactile ${name}`, () => {
    test.use({ ...device, hasTouch: true, isMobile: true });
    for (const [width, theme] of RUNS) {
      test(`aucun element ne bouge de plus de 1 px apres un tap (${width} px, ${theme})`, async ({ page }) => {
        test.setTimeout(90000);
        await page.setViewportSize({ width, height: device.viewport.height });
        await page.emulateMedia({ colorScheme: theme });
        await prepare(page);
        const moved = [];
        for (const [label, sel, prep] of TARGETS) {
          await reset(page);
          if (prep === 'menu') { await page.evaluate(() => document.getElementById('navmenu').classList.add('open')); await page.waitForTimeout(450); }
          if (prep === 'chat') { await page.evaluate(() => openChat()); await page.waitForTimeout(300); }
          const loc = page.locator(sel).first();
          await expect(loc, label).toBeVisible();
          const d = await tapShift(page, loc);
          if (d > 1) moved.push(`${label} : ${d.toFixed(1)} px`);
        }
        expect(moved).toEqual([]);
      });
    }
    test('badges du rail : un tap ne les deplace pas (mouvement reduit, sans balancement)', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await prepare(page);
      const badges = page.locator('.lan-badge');
      for (let i = 0; i < 4; i++) {
        await reset(page);
        const d = await tapShift(page, badges.nth(i));
        expect(d, `badge ${i + 1}`).toBeLessThanOrEqual(1);
      }
    });
  });
}
