import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {CLINICAL_GUIDES} from '../../ns-clinical-guide-data.mjs';
const open=async(page,id)=>{
 await page.goto('/index.html#problem/'+id);
 await expect(page.locator('.ns-mood h1')).toBeVisible();
};
test('each of the 15 clinical catalogue topics opens its own complete guide',async({page})=>{
 for(const guide of CLINICAL_GUIDES){
  await open(page,guide.id);
  await expect(page.locator('.ns-mood h1')).toHaveText(guide.title);
  await expect(page.locator('.ns-mood-read > p')).toHaveCount(8);
  await expect(page.locator('.ns-mood-route-list button')).toHaveCount(4);
  await expect(page.locator('.ns-mood-safety')).toBeVisible();
  await expect(page.locator('[data-mood-why-body]')).toBeHidden();
  await expect(page.locator('.ns-judge-back a').first()).toHaveAttribute('href','#navigate/atlas/clinical');
 }
});
test('journals use open writing and reveal tailored optional lists',async({page})=>{
 await open(page,'access-mental-health-care');
 await page.locator('[data-mood-open="path"]').click();
 await expect(page.locator('[data-mood-answer]')).toBeVisible();
 await page.locator('[data-mood-answer]').fill('I was referred last month and have not received confirmation.');
 await page.locator('[data-mood-next]').click();
 await page.locator('[data-mood-next]').click();
 await page.locator('[data-mood-next]').click();
 await page.locator('[data-mood-idea]').click();
 const dlg=page.locator('[data-mood-ideas]');
 await expect(dlg).toBeVisible();
 await expect(dlg.locator('li')).toHaveCount(26);
 await expect(dlg.locator('h2,section,fieldset')).toHaveCount(0);
 await dlg.locator('[data-mood-ideas-close]').click();
 await expect(dlg).toBeHidden();
 await expect(page.locator('[data-mood-screen] input[type=radio]')).toHaveCount(0);
});
test('Understand Why presents 16 topic-specific examples and optional personal map',async({page})=>{
 await open(page,'mental-health-stigma');
 await page.locator('[data-mood-why-toggle]').click();
 await page.locator('[data-mood-why-browse]').click();
 await expect(page.locator('[data-mood-why-count]')).toContainText('16 matching examples');
 await expect(page.locator('[data-mood-why-results] button')).toHaveCount(10);
 await page.locator('[data-mood-why-more]').click();
 await expect(page.locator('[data-mood-why-results] button')).toHaveCount(16);
 await page.locator('[data-mood-why-results] button').first().click();
 await expect(page.locator('[data-mood-why-graph] li')).toHaveCount(10);
 await page.locator('[data-mood-why-own]').click();
 await page.locator('[data-mood-why-answer]').fill('My colleague made an insulting comment.');
 await page.locator('[data-mood-why-finish]').click();
 await expect(page.locator('[data-mood-why-self]')).toContainText('My colleague made an insulting comment.');
});
test('medical and high-risk safeguards appear before journals',async({page})=>{
 await open(page,'eating-recovery');
 await expect(page.locator('.ns-mood-safety')).toContainText('physical complications');
 await open(page,'medication-concerns-mental-health');
 await expect(page.locator('.ns-mood-safety')).toContainText('Do not stop');
 await open(page,'ocd-harm-fear');
 await expect(page.locator('.ns-mood-safety')).toContainText('actual intention');
 await open(page,'medical-uncertainty-distress');
 await expect(page.locator('.ns-mood-safety')).toContainText('Do not assume');
});
test('journal and underlying map pass serious WCAG checks',async({page})=>{
 await open(page,'therapy-difficulties');
 await page.locator('[data-mood-open="fit"]').click();
 const audit=await new AxeBuilder({page}).include('.ns-mood').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(audit.violations.filter(v=>['serious','critical'].includes(v.impact)).map(v=>v.id)).toEqual([]);
});
