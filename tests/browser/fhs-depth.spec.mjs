import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {FHS_GUIDES,FHS_GUIDE_GROUPS} from '../../ns-fhs-guide-data.mjs';
const domainFor=id=>Object.keys(FHS_GUIDE_GROUPS).find(k=>FHS_GUIDE_GROUPS[k].includes(id));
const urlFor=domain=>domain==='family'||domain==='harm'?'#navigate/area/family/'+domain:'#navigate/area/society/'+domain;
const open=async(page,id)=>{await page.goto('/index.html#problem/'+id);await expect(page.locator('.ns-mood h1')).toBeVisible();};

test('all 74 family, harm, inequality and environment guides open as ten-paragraph manuals',async({page})=>{
 for(const g of FHS_GUIDES){
  await open(page,g.id);
  await expect(page.locator('.ns-mood h1')).toHaveText(g.title);
  await expect(page.locator('.ns-mood-read > p')).toHaveCount(10);
  await expect(page.locator('.ns-mood-route-list button')).toHaveCount(4);
  await expect(page.locator('.ns-judge-back a').first()).toHaveAttribute('href',urlFor(domainFor(g.id)));
 }
});

test('real-life journal question and contextual example appear for emotional neglect',async({page})=>{
 await open(page,'emotional-neglect');
 await page.locator('[data-mood-open="path-0"]').click();
 await expect(page.locator('[data-mood-screen]')).toContainText('You came home upset and were told to get on with it');
 await expect(page.locator('[data-mood-answer]')).toBeVisible();
});

test('harm journals keep disclosures on the page without exposing save controls',async({page})=>{
 await open(page,'stalking');
 await expect(page.locator('.ns-mood-saved')).toContainText('does not save');
 await page.locator('[data-mood-open="path-0"]').click();
 await page.locator('[data-mood-answer]').fill('A private test answer');
 for(let i=0;i<3;i++)await page.locator('[data-mood-next]').click();
 await expect(page.locator('[data-mood-save]')).toHaveCount(0);
 await expect(page.locator('[data-mood-save-status]')).toContainText('not stored');
});

test('poverty and structural inequality guide has its own practical worked situations',async({page})=>{
 await open(page,'food-insecurity');
 await page.locator('[data-mood-why-toggle]').click();
 await page.locator('[data-mood-why-browse]').click();
 await expect(page.locator('[data-mood-why-count]')).toContainText('16 matching examples');
 await page.locator('[data-mood-why-more]').click();
 await expect(page.locator('[data-mood-why-results] button')).toHaveCount(16);
 await expect(page.locator('[data-mood-why-results]')).toContainText('children in the household');
});

test('a family guide has no serious or critical automated accessibility issues',async({page})=>{
 await open(page,'parentification');
 await page.locator('[data-mood-open="path-0"]').click();
 const a=await new AxeBuilder({page}).include('.ns-mood').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(a.violations.filter(v=>['serious','critical'].includes(v.impact)).map(v=>v.id)).toEqual([]);
});
