import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {CONNECTION_GUIDES,CONNECTION_GROUPS} from '../../ns-connection-guide-data.mjs';

const groupFor=id=>CONNECTION_GROUPS.relate.includes(id)?'relate':CONNECTION_GROUPS.social.includes(id)?'social':'related';
const open=async(page,id)=>{
 await page.goto('/index.html#problem/'+id);
 await expect(page.locator('.ns-mood h1')).toBeVisible();
};

test('all 47 Relationships and connection topics open original manual pages',async({page})=>{
 for(const g of CONNECTION_GUIDES){
  await open(page,g.id);
  await expect(page.locator('.ns-mood h1')).toHaveText(g.title);
  await expect(page.locator('.ns-mood-read > p')).toHaveCount(10);
  await expect(page.locator('.ns-mood-route-list button')).toHaveCount(4);
  await expect(page.locator('.ns-judge-back a').first()).toHaveAttribute('href','#navigate/area/connection/'+groupFor(g.id));
  await expect(page.locator('[data-mood-why-body]')).toBeHidden();
 }
});

test('return links restore each of the three Relationships subsections',async({page})=>{
 for(const [section,count] of [['relate','22 topics'],['social','16 topics'],['related','9 topics']]){
  await page.goto('/index.html#navigate/area/connection/'+section);
  await expect(page.locator('.ns-needs')).toBeVisible();
  await expect(page.locator('.ns-needs-panel .ns-needs-filter-count')).toContainText(count);
 }
});

test('a boundaries journal opens with an authored question and 24 actionable ideas',async({page})=>{
 await open(page,'boundaries');
 await page.locator('[data-mood-open="no"]').click();
 await expect(page.locator('[data-mood-screen]')).toContainText('Which request do you keep accepting');
 await expect(page.locator('[data-mood-answer]')).toBeVisible();
 for(let i=0;i<3;i++)await page.locator('[data-mood-next]').click();
 await page.locator('[data-mood-idea]').click();
 await expect(page.locator('[data-mood-ideas] li')).toHaveCount(24);
});

test('Understand Why offers 16 contextual examples on distrust after trauma',async({page})=>{
 await open(page,'post-trauma-trust');
 await page.locator('[data-mood-why-toggle]').click();
 await page.locator('[data-mood-why-browse]').click();
 await expect(page.locator('[data-mood-why-count]')).toContainText('16 matching examples');
 await page.locator('[data-mood-why-more]').click();
 await expect(page.locator('[data-mood-why-results] button')).toHaveCount(16);
 await page.locator('[data-mood-why-results] button').first().click();
 await expect(page.locator('[data-mood-why-graph] li')).toHaveCount(10);
});

test('safety-sensitive pages display topic-specific caveats',async({page})=>{
 for(const [id,term] of [['control-harm','coercive'],['aggressive-urges','violence'],['relationship-submission','consent'],['end-of-life-caregiving','palliative']]){
  await open(page,id);
  await expect(page.locator('.ns-mood-safety')).toContainText(new RegExp(term,'i'));
 }
});

test('the interpersonal guide has no serious or critical automated accessibility violations',async({page})=>{
 await open(page,'people-pleasing');
 await page.locator('[data-mood-open="answer"]').click();
 const a=await new AxeBuilder({page}).include('.ns-mood').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(a.violations.filter(v=>['serious','critical'].includes(v.impact)).map(v=>v.id)).toEqual([]);
});
