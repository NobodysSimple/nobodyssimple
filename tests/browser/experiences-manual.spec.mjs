import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {EXPERIENCE_GUIDES} from '../../ns-experiences-guide-data.mjs';
const ids=EXPERIENCE_GUIDES.map(x=>x.id);
const enter=async(page,id)=>{
 await page.goto('/index.html#problem/'+id);
 await expect(page.locator('.ns-mood h1')).toBeVisible();
};
test('all sixteen unusual-experience pages render individual safety-first guides',async({page})=>{
 for(const id of ids){
  await enter(page,id);
  const guide=EXPERIENCE_GUIDES.find(x=>x.id===id);
  await expect(page.locator('.ns-mood h1')).toHaveText(guide.title);
  await expect(page.locator('.ns-mood-route-list button')).toHaveCount(4);
  await expect(page.locator('.ns-mood-read>p')).toHaveCount(8);
  await expect(page.locator('.ns-mood-safety')).toBeVisible();
  await expect(page.locator('[data-mood-why-body]')).toBeHidden();
  await expect(page.locator('.ns-judge-back a').first()).toHaveAttribute('href','#navigate/atlas/experiences');
 }
});
test('journals are free written, teach a skill and provide optional relevant action ideas',async({page})=>{
 await enter(page,'voices');
 await page.locator('[data-mood-open="share"]').click();
 await expect(page.locator('[data-mood-answer]')).toBeVisible();
 await expect(page.locator('.ns-judge-practice')).toContainText('Something to notice');
 await page.locator('[data-mood-answer]').fill('I would like someone to listen respectfully');
 await page.locator('[data-mood-next]').click();
 await page.locator('[data-mood-next]').click();
 await page.locator('[data-mood-idea]').click();
 const dialog=page.locator('[data-mood-ideas]');
 await expect(dialog).toBeVisible();
 await expect(dialog.locator('ul li')).toHaveCount(24);
 await expect(dialog.locator('section,h2,fieldset')).toHaveCount(0);
 await dialog.locator('[data-mood-ideas-close]').click();
 await expect(dialog).toBeHidden();
 await expect(page.locator('[data-mood-screen] input[type=radio]')).toHaveCount(0);
});
test('Understand Why exposes 16 topic-specific worked examples and an editable map',async({page})=>{
 await enter(page,'derealisation');
 await page.locator('[data-mood-why-toggle]').click();
 await page.locator('[data-mood-why-browse]').click();
 await expect(page.locator('[data-mood-why-count]')).toContainText('16 matching examples');
 await expect(page.locator('[data-mood-why-results] button')).toHaveCount(10);
 await page.locator('[data-mood-why-more]').click();
 await expect(page.locator('[data-mood-why-results] button')).toHaveCount(16);
 await page.locator('[data-mood-why-results] button').last().click();
 await expect(page.locator('[data-mood-why-graph] li')).toHaveCount(10);
 await page.locator('[data-mood-why-own]').click();
 await page.locator('[data-mood-why-answer]').fill('My room felt distant after poor sleep');
 await page.locator('[data-mood-why-finish]').click();
 await expect(page.locator('[data-mood-why-self]')).toContainText('My room felt distant');
});
test('safety messages are visible before optional self-help for withdrawal and high-energy experiences',async({page})=>{
 await enter(page,'withdrawal-worries');
 await expect(page.locator('.ns-mood-safety')).toContainText('emergency');
 await expect(page.locator('.ns-mood-safety')).toContainText('abruptly');
 await enter(page,'mania');
 await expect(page.locator('.ns-mood-safety')).toContainText('urgent');
 await enter(page,'grandiose-beliefs');
 await expect(page.locator('.ns-mood-safety')).toContainText('Do not test');
});
test('unusual perception guide uses accessible focus and contrast on mobile',async({page})=>{
 await enter(page,'voices');
 await page.locator('[data-mood-open="map"]').click();
 const axe=await new AxeBuilder({page}).include('.ns-mood').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(axe.violations.filter(v=>['serious','critical'].includes(v.impact)).map(v=>v.id)).toEqual([]);
});
