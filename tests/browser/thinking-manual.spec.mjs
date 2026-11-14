import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {THINK_GUIDES} from '../../ns-think-guide-data.mjs';
async function open(page,id){
 await page.goto('/index.html#problem/'+id);
 await expect(page.locator('.ns-mood h1')).toBeVisible();
}
test('all 17 Thoughts & worry guides open with their own article and journals',async({page})=>{
 for(const g of THINK_GUIDES){
  await open(page,g.id);
  await expect(page.locator('.ns-mood h1')).toHaveText(g.title);
  await expect(page.locator('.ns-mood-read > p')).toHaveCount(8);
  await expect(page.locator('.ns-mood-route-list button')).toHaveCount(4);
  await expect(page.locator('.ns-judge-back a').first()).toHaveAttribute('href','#navigate/atlas/think');
  await expect(page.locator('[data-mood-why-body]')).toBeHidden();
 }
});
test('real free-writing question produces a topic-specific optional list',async({page})=>{
 await open(page,'decision-paralysis');
 await page.locator('[data-mood-open="criteria"]').click();
 await expect(page.locator('[data-mood-answer]')).toBeVisible();
 await page.locator('[data-mood-answer]').fill('I need a clear set of two useful criteria.');
 for(let i=0;i<3;i++)await page.locator('[data-mood-next]').click();
 await page.locator('[data-mood-idea]').click();
 const dlg=page.locator('[data-mood-ideas]');
 await expect(dlg).toBeVisible();
 await expect(dlg.locator('li')).toHaveCount(24);
 await dlg.locator('[data-mood-ideas-close]').click();
 await expect(dlg).toBeHidden();
 await expect(page.locator('[data-mood-screen] input[type=radio]')).toHaveCount(0);
});
test('optional Understand Why has 16 situations and a 10-layer editable map',async({page})=>{
 await open(page,'ruminative-guilt');
 await page.locator('[data-mood-why-toggle]').click();
 await page.locator('[data-mood-why-browse]').click();
 await expect(page.locator('[data-mood-why-count]')).toContainText('16 matching examples');
 await page.locator('[data-mood-why-more]').click();
 await expect(page.locator('[data-mood-why-results] button')).toHaveCount(16);
 await page.locator('[data-mood-why-results] button').first().click();
 await expect(page.locator('[data-mood-why-graph] li')).toHaveCount(10);
 await page.locator('[data-mood-why-own]').click();
 await page.locator('[data-mood-why-answer]').fill('I regretted missing a call.');
 await page.locator('[data-mood-why-finish]').click();
 await expect(page.locator('[data-mood-why-self]')).toContainText('I regretted missing a call.');
});
test('thoughts support is readable and keyboard accessible without serious automated WCAG errors',async({page})=>{
 await open(page,'checking');
 await page.locator('[data-mood-open="difference"]').click();
 const axe=await new AxeBuilder({page}).include('.ns-mood').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(axe.violations.filter(x=>['serious','critical'].includes(x.impact)).map(x=>x.id)).toEqual([]);
});
