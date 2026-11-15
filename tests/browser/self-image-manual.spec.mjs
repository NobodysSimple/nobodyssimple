import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {IMAGE_GUIDES,IMAGE_GUIDE_GROUPS} from '../../ns-self-image-guide-data.mjs';
const groupFor=id=>Object.keys(IMAGE_GUIDE_GROUPS).find(g=>IMAGE_GUIDE_GROUPS[g].includes(id));
const open=async(page,id)=>{await page.goto('/index.html#problem/'+id);await expect(page.locator('.ns-mood h1')).toBeVisible();};

test('all 49 identity, LGBTQIA+ and appearance topics render their individual ten-paragraph manuals',async({page})=>{
 for(const g of IMAGE_GUIDES){
  await open(page,g.id);
  await expect(page.locator('.ns-mood h1')).toHaveText(g.title);
  await expect(page.locator('.ns-mood-read > p')).toHaveCount(10);
  await expect(page.locator('.ns-mood-route-list button')).toHaveCount(4);
  await expect(page.locator('.ns-judge-back a').first()).toHaveAttribute('href','#navigate/area/identity/'+groupFor(g.id));
 }
});
test('original identity journal opens with the topic-specific question',async({page})=>{
 await open(page,'self-worth');
 await page.locator('[data-mood-open="path-0"]').click();
 await expect(page.locator('[data-mood-screen]')).toContainText('What recent event made you feel less worthy of care or respect?');
 await expect(page.locator('[data-mood-answer]')).toBeVisible();
});
test('sensitive identity journals never offer browser storage of answers',async({page})=>{
 await open(page,'coming-out-decision');
 await expect(page.locator('.ns-mood-saved')).toContainText('does not save');
 await page.locator('[data-mood-open="path-0"]').click();
 await page.locator('[data-mood-answer]').fill('Private test information');
 for(let i=0;i<3;i++)await page.locator('[data-mood-next]').click();
 await expect(page.locator('[data-mood-save]')).toHaveCount(0);
 await expect(page.locator('[data-mood-save-status]')).toContainText('not stored');
});
test('gender exploration and body dysmorphia retain individual safety guidance',async({page})=>{
 for(const [id,text] of [['gender-dysphoria','clinical'],['body-dysmorphic-concerns','CBT'],['identity-privacy-safety','privacy']]){
  await open(page,id);await expect(page.locator('.ns-mood-safety')).toContainText(new RegExp(text,'i'));
 }
});
test('Understand Why shows the 16 topic-specific examples',async({page})=>{
 await open(page,'appearance-bullying');
 await page.locator('[data-mood-why-toggle]').click();
 await page.locator('[data-mood-why-browse]').click();
 await expect(page.locator('[data-mood-why-count]')).toContainText('16 matching examples');
 await page.locator('[data-mood-why-more]').click();
 await expect(page.locator('[data-mood-why-results] button')).toHaveCount(16);
 await expect(page.locator('[data-mood-why-results]')).toContainText('Classmates');
});
test('identity manual has no serious or critical automated accessibility violations',async({page})=>{
 await open(page,'who-am-i');
 await page.locator('[data-mood-open="path-0"]').click();
 const a=await new AxeBuilder({page}).include('.ns-mood').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(a.violations.filter(x=>['serious','critical'].includes(x.impact)).map(x=>x.id)).toEqual([]);
});
