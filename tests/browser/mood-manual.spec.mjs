import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ids=['anxiety','low-mood','anger','overwhelm','guilt-shame','self-criticism',
'emotional-numbness','panic','anhedonia','irritability','hopelessness','mood-shifts',
'sudden-distress','self-blame','shame-after-sex','panic-experiences'];
const load=async(page,id)=>{
 await page.goto('/index.html#problem/'+id);
 await expect(page.locator('.ns-mood h1')).toBeVisible();
};
test('all sixteen feelings and mood guides open without changing their topic identity',async({page})=>{
 for(const id of ids){
  await load(page,id);
  await expect(page.locator('.ns-mood-route-list button')).toHaveCount(4);
  await expect(page.locator('.ns-mood-read>p')).toHaveCount(8);
  await expect(page.locator('.ns-mood-why')).toBeVisible();
  await expect(page.locator('[data-mood-why-body]')).toBeHidden();
 }
});
test('free-writing journals expose a topic-specific idea list and preserve typed answers',async({page})=>{
 await load(page,'low-mood');
 await page.locator('[data-mood-open="activity"]').click();
 await expect(page.locator('[data-mood-answer]')).toBeVisible();
 await page.locator('[data-mood-answer]').fill('Try five minutes of drawing');
 await expect(page.locator('[data-mood-screen] input[type="radio"]')).toHaveCount(0);
 await page.locator('[data-mood-next]').click();
 await page.locator('[data-mood-next]').click();
 await page.locator('[data-mood-answer]').fill('Begin by drawing only one shape');
 await page.locator('[data-mood-idea]').click();
 const dialog=page.locator('[data-mood-ideas]');
 await expect(dialog).toBeVisible();
 expect(await dialog.locator('li').count()).toBeGreaterThanOrEqual(22);
 await expect(dialog.locator('h2,section,fieldset')).toHaveCount(0);
 await dialog.locator('[data-mood-ideas-close]').click();
 await expect(dialog).toBeHidden();
 await expect(page.locator('[data-mood-answer]')).toHaveValue('Begin by drawing only one shape');
});
test('Understand Why is a collapsed, searchable topic-specific map',async({page})=>{
 await load(page,'anger');
 await page.locator('[data-mood-why-toggle]').click();
 await page.locator('[data-mood-why-browse]').click();
 await expect(page.locator('[data-mood-why-results] button')).toHaveCount(8);
 await page.locator('[data-mood-why-results] button').first().click();
 await expect(page.locator('[data-mood-why-graph] li')).toHaveCount(10);
 await expect(page.locator('[data-mood-why-title]')).not.toBeEmpty();
 await page.locator('[data-mood-why-own]').click();
 await expect(page.locator('[data-mood-why-answer]')).toBeVisible();
 await page.locator('[data-mood-why-answer]').fill('I was interrupted repeatedly');
 await page.locator('[data-mood-why-finish]').click();
 await expect(page.locator('[data-mood-why-self]')).toContainText('I was interrupted repeatedly');
});
test('fear-of-judgement flagship remains unchanged by new topic routes',async({page})=>{
 await page.goto('/index.html#problem/social-anxiety');
 await expect(page.locator('.ns-judge h1')).toHaveText('Fear of being judged by others');
 await expect(page.locator('.ns-mood')).toHaveCount(0);
});
test('mobile view of a feelings and mood guide has no serious automated WCAG issues',async({page})=>{
 await load(page,'overwhelm');
 await page.locator('[data-mood-open="sensory"]').click();
 const violations=(await new AxeBuilder({page}).include('.ns-mood').withTags(['wcag2a','wcag2aa','wcag21aa','wcag21a']).analyze()).violations;
 expect(violations.filter(x=>['serious','critical'].includes(x.impact)).map(x=>x.id)).toEqual([]);
});
