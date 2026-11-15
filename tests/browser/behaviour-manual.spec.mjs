import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {BEHAVIOUR_GUIDES} from '../../ns-behaviour-guide-data.mjs';

async function open(page,id){
 await page.goto('/index.html#problem/'+id);
 await expect(page.locator('.ns-mood h1')).toBeVisible();
}

test('all nineteen Habits impulses and compulsions catalogue topics open dedicated guides',async({page})=>{
 for(const g of BEHAVIOUR_GUIDES){
  await open(page,g.id);
  await expect(page.locator('.ns-mood h1')).toHaveText(g.title);
  await expect(page.locator('.ns-mood-read > p')).toHaveCount(10);
  await expect(page.locator('.ns-mood-route-list button')).toHaveCount(4);
  await expect(page.locator('.ns-judge-back a').first()).toHaveAttribute('href','#navigate/atlas/behaviour');
  await expect(page.locator('[data-mood-why-body]')).toBeHidden();
 }
});

test('the gambling journal offers topic-specific questions and optional ideas',async({page})=>{
 await open(page,'gambling-harms');
 await page.locator('[data-mood-open="protect"]').click();
 await expect(page.locator('[data-mood-answer]')).toBeVisible();
 await expect(page.locator('[data-mood-screen]')).toContainText('Which payment or commitment');
 await page.locator('[data-mood-answer]').fill('My essential payment next week.');
 for(let i=0;i<3;i++)await page.locator('[data-mood-next]').click();
 await page.locator('[data-mood-idea]').click();
 await expect(page.locator('[data-mood-ideas] li')).toHaveCount(24);
});

test('Understand Why has 16 genuinely contextual examples',async({page})=>{
 await open(page,'rigidity-and-change');
 await page.locator('[data-mood-why-toggle]').click();
 await page.locator('[data-mood-why-browse]').click();
 await expect(page.locator('[data-mood-why-count]')).toContainText('16 matching examples');
 await page.locator('[data-mood-why-more]').click();
 await expect(page.locator('[data-mood-why-results] button')).toHaveCount(16);
 await page.locator('[data-mood-why-results] button').first().click();
 await expect(page.locator('[data-mood-why-graph] li')).toHaveCount(10);
});

test('compulsion-sensitive pages show relevant safety information',async({page})=>{
 for(const [id,needle] of [
  ['gambling-harms','Gambling-related debt'],
  ['compulsive-exercise','injury'],
  ['compulsive-sexual-behaviour','Consensual'],
  ['urges-under-stress','withdrawal']
 ]){
  await open(page,id);
  await expect(page.locator('.ns-mood-safety')).toContainText(new RegExp(needle,'i'));
 }
});

test('one newly authored manual has no serious or critical automated WCAG violations',async({page})=>{
 await open(page,'compulsive-reassurance');
 await page.locator('[data-mood-open="first"]').click();
 const result=await new AxeBuilder({page}).include('.ns-mood').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(result.violations.filter(v=>['serious','critical'].includes(v.impact)).map(v=>v.id)).toEqual([]);
});
