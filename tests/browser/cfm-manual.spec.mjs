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
 await expect(page.locator('[data-mood-ideas] li')).toHaveCount(12);
});
test('practical popup gives direct useful advice rather than repeated lead-in formulas',async({page})=>{
 await open(page,'existential-anxiety');
 await page.locator('[data-mood-open="map"]').click();
 for(let i=0;i<3;i++)await page.locator('[data-mood-next]').click();
 await page.locator('[data-mood-idea]').click();
 const suggestions=page.locator('[data-mood-ideas] li');
 await expect(suggestions).toHaveCount(12);
 await expect(suggestions.first()).toContainText('When panic rises');
 await expect(page.locator('[data-mood-ideas]')).not.toContainText('Consider whether this is relevant to your situation');
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
test('all Culture Faith Migration guides omit the extra Conditions box',async({page})=>{
 for(const id of ['racial-discrimination','culture-shock','losing-faith','asylum-stress']){
  await open(page,id);
  await expect(page.locator('.ns-mood-cycle')).toHaveCount(0);
  await expect(page.getByText('Conditions that may matter here',{exact:true})).toHaveCount(0);
 }
});
test('the browser matches the reference format with short searchable situation cards and clear group labels',async({page})=>{
 await open(page,'culture-shock');
 await page.locator('[data-mood-why-toggle]').click();
 await page.locator('[data-mood-why-browse]').click();
 await expect(page.locator('[data-mood-why-count]')).toContainText('16 matching examples');
 await expect(page.locator('[data-mood-why-results] button')).toHaveCount(10);
 await expect(page.locator('[data-mood-why-results] button').first()).toContainText('A greeting I thought was polite seemed rude');
 await page.locator('[data-mood-why-search]').fill('appointment');
 await expect(page.locator('[data-mood-why-count]')).toContainText('0 matching examples');
 await page.locator('[data-mood-why-search]').fill('book a service');
 await expect(page.locator('[data-mood-why-count]')).toContainText('1 matching example');
 await expect(page.locator('[data-mood-why-results] button')).toHaveCount(1);
 await page.locator('[data-mood-why-search]').fill('');
 await page.locator('[data-mood-why-more]').click();
 await expect(page.locator('[data-mood-why-results] button')).toHaveCount(16);
 await expect(page.locator('[data-mood-why-results] button strong').first()).not.toContainText('You can arrive somewhere exciting and still feel strangely incompetent');
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
