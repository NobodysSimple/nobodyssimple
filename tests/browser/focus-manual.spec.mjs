import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {FOCUS_GUIDES} from '../../ns-focus-guide-data.mjs';

async function open(page,id){
 await page.goto('/index.html#problem/'+id);
 await expect(page.locator('.ns-mood h1')).toBeVisible();
}
test('all eleven attention, learning and habits topics open their dedicated manuals',async({page})=>{
 for(const g of FOCUS_GUIDES){
  await open(page,g.id);
  await expect(page.locator('.ns-mood h1')).toHaveText(g.title);
  await expect(page.locator('.ns-mood-read > p')).toHaveCount(8);
  await expect(page.locator('.ns-mood-route-list button')).toHaveCount(4);
  await expect(page.locator('.ns-judge-back a').first()).toHaveAttribute('href','#navigate/atlas/focus');
  await expect(page.locator('[data-mood-why-body]')).toBeHidden();
 }
});
test('learning journal uses free writing with 24 optional evidence-based actions',async({page})=>{
 await open(page,'learning-block');
 await page.locator('[data-mood-open="retrieve"]').click();
 await expect(page.locator('[data-mood-answer]')).toBeVisible();
 await page.locator('[data-mood-answer]').fill('I can recognise the word but cannot retrieve it.');
 for(let i=0;i<3;i++)await page.locator('[data-mood-next]').click();
 await page.locator('[data-mood-idea]').click();
 const ideas=page.locator('[data-mood-ideas]');
 await expect(ideas).toBeVisible();
 await expect(ideas.locator('li')).toHaveCount(24);
 await ideas.locator('[data-mood-ideas-close]').click();
 await expect(ideas).toBeHidden();
 await expect(page.locator('[data-mood-screen] input[type=radio]')).toHaveCount(0);
});
test('optional Understand Why shows 16 specific examples and can start a personal map',async({page})=>{
 await open(page,'time-blindness');
 await page.locator('[data-mood-why-toggle]').click();
 await page.locator('[data-mood-why-browse]').click();
 await expect(page.locator('[data-mood-why-count]')).toContainText('16 matching examples');
 await page.locator('[data-mood-why-more]').click();
 await expect(page.locator('[data-mood-why-results] button')).toHaveCount(16);
 await page.locator('[data-mood-why-results] button').first().click();
 await expect(page.locator('[data-mood-why-graph] li')).toHaveCount(10);
 await page.locator('[data-mood-why-own]').click();
 await page.locator('[data-mood-why-answer]').fill('I left too late for my appointment.');
 await page.locator('[data-mood-why-finish]').click();
 await expect(page.locator('[data-mood-why-self]')).toContainText('I left too late for my appointment.');
});
test('memory warning is prominent and journal passes serious automated accessibility checks',async({page})=>{
 await open(page,'memory');
 await expect(page.locator('.ns-mood-safety')).toContainText('Sudden confusion');
 await page.locator('[data-mood-open="cue"]').click();
 const audit=await new AxeBuilder({page}).include('.ns-mood').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(audit.violations.filter(x=>['serious','critical'].includes(x.impact)).map(x=>x.id)).toEqual([]);
});
