import {test,expect} from '@playwright/test';
// Feature retired from the live app; preserve legacy scenarios for possible future review.
test.skip(true,'Hypothesis Generator is retired from the application');
import AxeBuilder from '@axe-core/playwright';

async function investigate(page){
 await page.goto('/index.html#hypothesis');
 await page.locator('[data-hypo-start-words]').fill(
  'I describe my dad as narcissistic, and he calls me dramatic');
 await page.locator('[data-hypo-track="relationships"]').click();
 await page.locator('[data-hypo-drill-skip]').click();
 await page.locator('[data-hypo-invest-start]').click();
 for(const value of ['father','narcissistic','dismissal']){
  await page.locator('[data-hypo-invest-answer="'+value+'"]').click();
 }
 await page.locator('[data-hypo-invest-stop]').click();
 await page.locator('[data-hypo-adaptive-start]').click();
}
test('Stage 5 displays disconfirming evidence, exact words and explicit missing dimensions',async({page})=>{
 await investigate(page);
 await page.locator('[data-hypo-adaptive-words]').fill(
  'He still belittles me even when I do not react');
 await page.locator('[data-hypo-adaptive-answer="persists"]').click();
 await page.locator('[data-hypo-adaptive-stop]').click();
 const section=page.locator('.ns-hypo-evidence-review');
 await expect(section).toContainText('The person’s response alone may not maintain the problem');
 await expect(section).toContainText('Which contributing factors have we actually examined?');
 await section.locator('.ns-hypo-factor-review summary').click();
 await expect(section).toContainText('Not investigated yet');
 await section.locator('.ns-hypo-evidence-ledger summary').click();
 await expect(section).toContainText('He still belittles me even when I do not react');
 await expect(page.locator('.ns-hypo-graph')).toContainText(
  'I describe my dad as narcissistic, and he calls me dramatic');
 const audit=await new AxeBuilder({page}).include('.ns-hypo-evidence-review')
  .withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(audit.violations.filter(v=>['serious','critical'].includes(v.impact)).map(v=>v.id)).toEqual([]);
});
test('untrusted exact wording is rendered as text, not parsed as HTML',async({page})=>{
 await page.goto('/index.html#hypothesis');
 await page.locator('[data-hypo-start-words]').fill('<img src=x onerror=alert(1)>');
 await page.locator('[data-hypo-track="relationships"]').click();
 await page.locator('[data-hypo-drill-skip]').click();
 await page.locator('[data-hypo-invest-start]').click();
 await page.locator('[data-hypo-invest-stop]').click();
 await expect(page.locator('.ns-hypo-graph')).toContainText('<img src=x onerror=alert(1)>');
 await expect(page.locator('.ns-hypo-shell img[src="x"]')).toHaveCount(0);
});
