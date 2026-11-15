import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {CFM_GUIDES_FULL,CFM_GROUPS} from '../../ns-cfm-manual-data.mjs';
const open=async(page,id)=>{
 await page.goto('/index.html#problem/'+id);
 await expect(page.locator('.ns-mood h1')).toBeVisible();
};
test('all 45 Culture Faith Migration entries open the existing field-guide experience',async({page})=>{
 for(const g of CFM_GUIDES_FULL){
  await open(page,g.id);
  await expect(page.locator('.ns-mood h1')).toHaveText(g.title);
  await expect(page.locator('.ns-mood-read>p')).toHaveCount(10);
  await expect(page.locator('.ns-mood-route-list button')).toHaveCount(4);
  await expect(page.locator('.ns-mood-why')).toBeVisible();
  await expect(page.locator('[data-mood-why-body]')).toBeHidden();
  await expect(page.locator('.ns-judge-back a').first()).toHaveAttribute('href','#navigate/area/culture/'+g.domain);
 }
});
test('each of three catalogue subgroups can be reached from its guide return link',async({page})=>{
 for(const [domain,count] of [['culture','19 topics'],['faith','13 topics'],['migration','13 topics']]){
  await page.goto('/index.html#navigate/area/culture/'+domain);
  await expect(page.locator('.ns-needs')).toBeVisible();
  await expect(page.locator('.ns-needs-panel .ns-needs-filter-count')).toContainText(count);
 }
});
test('religious scrupulosity offers tailored guided questions, optional ideas and a specific safety note',async({page})=>{
 await open(page,'fear-divine-punishment');
 await expect(page.locator('.ns-mood-safety')).toContainText('OCD');
 await page.locator('[data-mood-open="map"]').click();
 await expect(page.locator('[data-mood-screen]')).toContainText('What usually starts the fear');
 for(let i=0;i<3;i++)await page.locator('[data-mood-next]').click();
 await page.locator('[data-mood-idea]').click();
 await expect(page.locator('[data-mood-ideas] li')).toHaveCount(24);
});
test('asylum and exploitation do not offer local saving of sensitive journal responses',async({page})=>{
 for(const id of ['asylum-stress','migrant-work-exploitation']){
  await open(page,id);
  await expect(page.locator('.ns-mood-safety')).toBeVisible();
  await page.locator('[data-mood-open="map"]').click();
  for(let i=0;i<4;i++)await page.locator('[data-mood-next]').click();
  await expect(page.locator('[data-mood-save]')).toHaveCount(0);
  await expect(page.locator('[data-mood-screen]')).toContainText('not stored');
 }
});
test('deconversion Understand Why map has 16 examples and ten possible formulation layers',async({page})=>{
 await open(page,'losing-faith');
 await page.locator('[data-mood-why-toggle]').click();
 await page.locator('[data-mood-why-browse]').click();
 await expect(page.locator('[data-mood-why-count]')).toContainText('16 matching examples');
 await page.locator('[data-mood-why-more]').click();
 await expect(page.locator('[data-mood-why-results] button')).toHaveCount(16);
 await page.locator('[data-mood-why-results] button').first().click();
 await expect(page.locator('[data-mood-why-graph] li')).toHaveCount(10);
});
test('a culture guide has no serious or critical WCAG failures',async({page})=>{
 await open(page,'mixed-heritage');
 await page.locator('[data-mood-open="map"]').click();
 const result=await new AxeBuilder({page}).include('.ns-mood').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(result.violations.filter(x=>['serious','critical'].includes(x.impact)).map(x=>x.id)).toEqual([]);
});
