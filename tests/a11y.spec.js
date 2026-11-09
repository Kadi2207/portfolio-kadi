// Accessibilite automatique (axe-core), volontairement limitee pour rester fiable :
// regles WCAG 2.0 et 2.1, niveaux A et AA, impact "serious" ou "critical" seulement,
// sur la page et le chat ouvert, a 360 et 1280 px, en clair et en sombre (FR), plus une passe EN a 1280 px en clair.
// Mouvement reduit active : aucune animation en cours pendant l'analyse (resultats stables).
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
// Aucune regle exclue a ce jour. Les deux faux positifs releves par l'audit ne font pas partie de ces niveaux :
// target-size (puces de galerie, zone cliquable reelle elargie par ::after) est une regle WCAG 2.2,
// heading-order est une "bonne pratique". Si une regle doit un jour etre exclue, l'ajouter ici avec sa raison.
const EXCLUDED = [];

async function audit(page) {
  const r = await new AxeBuilder({ page }).withTags(TAGS).disableRules(EXCLUDED).analyze();
  return r.violations
    .filter(v => v.impact === 'serious' || v.impact === 'critical')
    .map(v => `${v.id} (${v.impact}) : ${v.nodes.slice(0, 3).map(n => n.target.join(' ')).join(' ; ')}`);
}

const RUNS = [[360, 'light', 'fr'], [360, 'dark', 'fr'], [1280, 'light', 'fr'], [1280, 'dark', 'fr'], [1280, 'light', 'en']];

for (const [width, theme, lang] of RUNS) {
  test(`axe : page et chat sans violation grave (${width} px, ${theme}, ${lang.toUpperCase()})`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
    await page.goto('/');
    // charge les contenus differes (images, badges, galerie)
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); } scrollTo(0, 0); });
    if (lang === 'en') await page.locator('[data-act="lang"]').first().click();
    await page.waitForTimeout(300);
    expect(await audit(page), 'page').toEqual([]);
    await page.evaluate(() => openChat());
    await expect(page.locator('#chatModal')).toHaveClass(/open/);
    await page.waitForTimeout(300);
    expect(await audit(page), 'chat ouvert').toEqual([]);
  });
}
