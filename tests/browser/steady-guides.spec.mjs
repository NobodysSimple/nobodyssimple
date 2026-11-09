import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const go=async(page,route)=>{await page.goto('/index.html#'+route);await expect(page.locator('.ns-needs').first()).toBeVisible()};
test('simple non-diagnostic choice navigation and full guidebook keep the tool accessible',async({page})=>{
 await go(page,'navigate');
 await expect(page.getByRole('heading',{name:'What would help you right now?'})).toBeVisible();
 await expect(page.locator('.ns-needs textarea')).toHaveCount(0);
 await page.locator('.ns-needs a[href="#navigate/regulate"]').click();
 await expect(page.getByRole('heading',{name:'Feel steadier'})).toBeVisible();
 await page.locator('.ns-needs a[href="#need/steady-sensory"]').click();
 await expect(page.getByRole('heading',{name:'Adjust your sensory environment'})).toBeVisible();
 await page.locator('[data-guide-open]').click();
 const modal=page.locator('dialog.ns-guidebook-dialog');
 await expect(modal).toBeVisible();
 await expect(modal.locator('h2')).toContainText('Sensory overload');
 await expect(modal.locator('.ns-guidebook-lane')).toHaveCount(6);
 await expect(modal.locator('.ns-guidebook-method')).toHaveCount(12);
 // Contents navigate inside the dialog; they must not change the SPA hash or lose tool state.
 await modal.locator('[data-guide-jump="act"]').click();
 await expect(modal.locator('details[id$="-act"]')).toHaveAttribute('open','');
 await expect(page).toHaveURL(/#need\/steady-sensory$/);
 await expect(modal).toBeVisible();
 await modal.locator('.ns-guidebook-pick').first().click();
 await expect(modal).not.toBeVisible();
 await expect(page.locator('.ns-steady-pinned')).toBeVisible();
 await page.locator('a[href="#steady-tool/steady-sensory/quick-reset"]').click();
 await expect(page.locator('[data-guide-open]')).toBeVisible();
 await page.locator('[data-guide-open]').click();
 await expect(page.locator('.ns-guidebook-dialog')).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(page.locator('.ns-guidebook-dialog')).not.toBeVisible();
 await expect(page.locator('[data-guide-open]')).toBeFocused();
});
test('every Feel steadier branch opens its authored guide without a questionnaire',async({page})=>{
 for(const name of ['steady-overwhelm','steady-panic','steady-sensory','steady-anger','steady-disconnected','steady-depleted','steady-restless','savour-good']){
  await go(page,'need/'+name);
  await expect(page.locator('button[data-guide-open]')).toHaveCount(1);
  await page.locator('button[data-guide-open]').click();
  const modal=page.locator('dialog.ns-guidebook-dialog');
  await expect(modal).toBeVisible();
  await expect(modal.locator('.ns-guidebook-lane')).toHaveCount(6);
  await expect(modal.locator('.ns-guidebook-method')).toHaveCount(12);
  await expect(modal.locator('.ns-guidebook-sources a').first()).toHaveAttribute('href',/^https:/);
  await modal.locator('[data-guide-close]').click();
  await expect(modal).not.toBeVisible();
 }
});
test('mobile and desktop screens avoid horizontal overflow within the navigator and guidebook',async({page})=>{
 await go(page,'navigate');
 const h=await page.locator('.ns-needs').evaluate(el=>({scroll:el.scrollWidth,client:el.clientWidth}));
 expect(h.scroll).toBeLessThanOrEqual(h.client+2);
 await go(page,'need/steady-overwhelm');
 await page.locator('[data-guide-open]').click();
 const bounds=await page.locator('dialog.ns-guidebook-dialog').evaluate(el=>({x:el.getBoundingClientRect().x,right:el.getBoundingClientRect().right,viewport:innerWidth}));
 expect(bounds.x).toBeGreaterThanOrEqual(-2);
 expect(bounds.right).toBeLessThanOrEqual(bounds.viewport+2);
});
test('key screens have no serious/critical WCAG automated violations',async({page})=>{
 for(const route of ['navigate','navigate/regulate','need/steady-overwhelm']){
  await go(page,route);
  const results=await new AxeBuilder({page}).include('.ns-needs').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  expect(results.violations.filter(x=>['serious','critical'].includes(x.impact)),JSON.stringify(results.violations.map(x=>({id:x.id,impact:x.impact,nodes:x.nodes.length})),null,2)).toEqual([]);
 }
 await page.locator('[data-guide-open]').click();
 const results=await new AxeBuilder({page}).include('.ns-guidebook-dialog').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(results.violations.filter(x=>['serious','critical'].includes(x.impact)),JSON.stringify(results.violations.map(x=>({id:x.id,impact:x.impact,nodes:x.nodes.length})),null,2)).toEqual([]);
});
