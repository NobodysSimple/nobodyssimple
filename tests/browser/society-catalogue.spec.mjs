import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {DIGITAL_GUIDES} from '../../ns-digital-guide-data.mjs';

const open=async(page,id,route='problem')=>{
 await page.goto('/index.html#'+route+'/'+id);
 await expect(page.locator('.ns-mood h1')).toBeVisible();
};
test('all sixteen digital subjects use a dedicated, original guide rather than generic atlas fallback',async({page})=>{
 for(const guide of DIGITAL_GUIDES){
  await open(page,guide.id,'workbook-topic');
  await expect(page.locator('.ns-mood h1')).toHaveText(guide.title);
  await expect(page.locator('.ns-mood-read > p')).toHaveCount(10);
  await expect(page.locator('.ns-mood-route-list button')).toHaveCount(4);
  await expect(page.locator('.ns-judge-back a').first()).toHaveAttribute('href','#navigate/area/society/digital');
 }
});
test('all three Society subcatalogues expose the exact number of original topics',async({page})=>{
 for(const [section,count] of [['inequality',22],['digital',16],['environment',11]]){
  await page.goto('/index.html#navigate/area/society/'+section);
  await expect(page.locator('.ns-needs-panel')).toBeVisible();
  await expect(page.locator('.ns-needs-panel .ns-needs-filter-count')).toContainText(count+' topics');
 }
});
test('online privacy manual opens an individually tailored journal with optional practical ideas',async({page})=>{
 await open(page,'online-privacy');
 await page.locator('[data-mood-open="path-1"]').click();
 await expect(page.locator('[data-mood-screen]')).toContainText('An ex-partner mentions');
 await expect(page.locator('[data-mood-answer]')).toBeVisible();
 await page.locator('[data-mood-answer]').fill('I want to protect my accounts without warning the person.');
 for(let i=0;i<3;i++)await page.locator('[data-mood-next]').click();
 await page.locator('[data-mood-idea]').click();
 await expect(page.locator('[data-mood-ideas] li')).toHaveCount(24);
 expect(await page.evaluate(()=>localStorage.getItem('ns-mood-manual-online-privacy-v1'))).toBeNull();
});
test('income insecurity and digital coercion prioritise real-world safety',async({page})=>{
 for(const [id,term] of [['food-insecurity','food'],['homelessness-insecurity','housing'],
    ['nonconsensual-digital-sharing','intimate'],['online-radicalisation-concern','threat']]){
  await open(page,id);
  await expect(page.locator('.ns-mood-safety')).toContainText(new RegExp(term,'i'));
 }
});
test('updated non-clinical digital field guide meets automated accessibility checks',async({page})=>{
 await open(page,'problematic-gaming');
 await page.locator('[data-mood-open="path-0"]').click();
 const result=await new AxeBuilder({page}).include('.ns-mood').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(result.violations.filter(v=>['serious','critical'].includes(v.impact)).map(v=>v.id)).toEqual([]);
});
