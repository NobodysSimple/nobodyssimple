import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('optional detailed interview adds exact observations to graph and export without a textbox',async({page})=>{
 await page.goto('/index.html#hypothesis');
 await page.locator('[data-hypo-track="identity"]').click();
 for(const id of ['IDENTITY-GROOMING','IDENTITY-GROOMING-SHAVING-LEGS','yes','mostly_enjoyable','personal_preference','mostly_private'])
  await page.locator('[data-hypo-drill-answer="'+id+'"]').click();
 await expect(page.locator('[data-hypo-fact-start]')).toBeVisible();
 await page.locator('[data-hypo-fact-start]').click();
 await expect(page.locator('.ns-hypo-case-specific')).toBeVisible();
 for(const choice of ['months_or_longer','some_days','none','one_setting','yes_clear','do_not_change']){
  await expect(page.locator('[data-hypo-fact-answer="'+choice+'"]')).toBeVisible();
  await page.locator('[data-hypo-fact-answer="'+choice+'"]').click();
 }
 await expect(page.locator('.ns-hypo-case-specific')).toHaveCount(0);
 for(let i=0;i<3;i++)await page.locator('[data-hypo-answer="unsure"]').click();
 await page.locator('[data-hypo-results]').click();
 const graph=page.locator('.ns-hypo-graph');
 await expect(graph).toContainText('shaving legs');
 await expect(graph).toContainText('For months or longer');
 await expect(graph).toContainText('Some days');
 await expect(graph).toContainText('Not at all');
 await expect(graph).toContainText('I do not want to change it');
 await expect(graph).toContainText('Yes, a clear difference');
 await expect(page.locator('[data-hypo-fact-start]')).toHaveCount(0);
 const scan=await new AxeBuilder({page}).include('.ns-hypo-shell')
  .withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 const serious=scan.violations.filter(v=>['critical','serious'].includes(v.impact));
 expect(serious,JSON.stringify(serious.map(v=>v.id))).toEqual([]);
});
test('optional factual investigation can be skipped and does not interfere with existing questioning',async({page})=>{
 await page.goto('/index.html#hypothesis');
 await page.locator('[data-hypo-track="procrastination"]').click();
 for(const id of ['TASKS-STUDY','TASKS-STUDY-STARTING-REVISION','yes','mostly_distressing','several','work_or_study'])
  await page.locator('[data-hypo-drill-answer="'+id+'"]').click();
 await page.locator('[data-hypo-fact-start]').click();
 await page.locator('[data-hypo-fact-answer="past_few_weeks"]').click();
 await page.locator('[data-hypo-fact-back]').click();
 await expect(page.locator('[data-hypo-fact-answer="past_few_weeks"]')).toBeVisible();
 await page.locator('[data-hypo-fact-stop]').click();
 await expect(page.locator('.ns-hypo-case-specific')).toHaveCount(0);
 await expect(page.locator('[data-hypo-answer]')).toHaveCount(5);
});
