import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {HABIT_GUIDES} from '../../ns-habit-guide-data.mjs';
async function open(page,id){
 await page.goto('/index.html#problem/'+id);
 await expect(page.locator('.ns-mood h1')).toBeVisible();
}
test('all fifteen Habits impulses and compulsions topics open original field guides',async({page})=>{
 for(const g of HABIT_GUIDES){
  await open(page,g.id);
  await expect(page.locator('.ns-mood h1')).toHaveText(g.title);
  await expect(page.locator('.ns-mood-read > p')).toHaveCount(8);
  await expect(page.locator('.ns-mood-route-list button')).toHaveCount(4);
  await expect(page.locator('.ns-judge-back a').first()).toHaveAttribute('href','#navigate/atlas/act');
  await expect(page.locator('[data-mood-why-body]')).toBeHidden();
 }
});
test('guided journal provides free-writing and a contextual optional ideas list',async({page})=>{
 await open(page,'compulsive-buying');
 await page.locator('[data-mood-open="before"]').click();
 await expect(page.locator('[data-mood-answer]')).toBeVisible();
 await page.locator('[data-mood-answer]').fill('Buying things after feeling anxious at work.');
 for(let i=0;i<3;i++)await page.locator('[data-mood-next]').click();
 await page.locator('[data-mood-idea]').click();
 const ideas=page.locator('[data-mood-ideas]');
 await expect(ideas).toBeVisible();
 await expect(ideas.locator('li')).toHaveCount(24);
 await ideas.locator('[data-mood-ideas-close]').click();
 await expect(ideas).toBeHidden();
 await expect(page.locator('[data-mood-screen] input[type=radio]')).toHaveCount(0);
});
test('Understand Why is hidden at first and provides sixteen browsable situations',async({page})=>{
 await open(page,'workaholism');
 await page.locator('[data-mood-why-toggle]').click();
 await page.locator('[data-mood-why-browse]').click();
 await expect(page.locator('[data-mood-why-count]')).toContainText('16 matching examples');
 await page.locator('[data-mood-why-more]').click();
 await expect(page.locator('[data-mood-why-results] button')).toHaveCount(16);
 await page.locator('[data-mood-why-results] button').first().click();
 await expect(page.locator('[data-mood-why-graph] li')).toHaveCount(10);
});
test('high-risk topics retain explicit safety advice before the journals',async({page})=>{
 for(const [id,needle] of [['risky-sex','coercion'],['energy-action','post-exertional'],['risk-taking','risk']]){
  await open(page,id);
  await expect(page.locator('.ns-mood-safety')).toContainText(new RegExp(needle,'i'));
 }
});
test('a journal page has no serious or critical automated WCAG violations',async({page})=>{
 await open(page,'procrastination');
 await page.locator('[data-mood-open="begin"]').click();
 const audit=await new AxeBuilder({page}).include('.ns-mood').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(audit.violations.filter(v=>['serious','critical'].includes(v.impact)).map(v=>v.id)).toEqual([]);
});
