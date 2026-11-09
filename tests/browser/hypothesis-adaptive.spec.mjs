import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function start(page){
 await page.goto('/index.html#hypothesis');
 await page.locator('[data-hypo-start-words]').fill('I think my dad is a narcissist and he belittles me');
 await page.locator('[data-hypo-track="relationships"]').click();
 await page.locator('[data-hypo-drill-skip]').click();
 await page.locator('[data-hypo-invest-start]').click();
 await page.locator('[data-hypo-invest-answer="father"]').click();
 await page.locator('[data-hypo-invest-words]').fill('I think my dad is a narcissist');
 await page.locator('[data-hypo-invest-answer="narcissistic"]').click();
 await page.locator('[data-hypo-invest-words]').fill('He calls me dramatic whenever I disagree');
 await page.locator('[data-hypo-invest-answer="dismissal"]').click();
 await page.locator('[data-hypo-invest-stop]').click();
 await page.locator('[data-hypo-adaptive-start]').click();
}
test('preserves precise wording in graph and shows challengeable adaptive causal links',async({page})=>{
 await start(page);
 await expect(page.locator('.ns-hypo-adaptive #ns-hypo-question')).toContainText('behaviour continue');
 await page.locator('[data-hypo-adaptive-words]').fill('He belittles me even when I do not react');
 await page.locator('[data-hypo-adaptive-answer="persists"]').click();
 await page.locator('[data-hypo-adaptive-stop]').click();
 await expect(page.locator('.ns-hypo-graph')).toContainText('I think my dad is a narcissist and he belittles me');
 await expect(page.locator('.ns-hypo-graph')).toContainText('He calls me dramatic whenever I disagree');
 await expect(page.locator('.ns-hypo-graph')).toContainText('He belittles me even when I do not react');
 const link=page.locator('.ns-hypo-causal-link').filter({hasText:'Other person’s behaviour'});
 await expect(link).toBeVisible();
 await link.locator('[data-hypo-link-verdict="no-fit"]').click();
 await expect(link.locator('[data-hypo-link-verdict="no-fit"]')).toHaveAttribute('aria-pressed','true');
 const audit=await new AxeBuilder({page}).include('.ns-hypo-shell')
  .withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(audit.violations.filter(v=>['critical','serious'].includes(v.impact)).map(v=>v.id)).toEqual([]);
});
test('unsafe alternative does not continue causal analysis',async({page})=>{
 await start(page);
 await page.locator('[data-hypo-adaptive-answer="unsafe"]').click();
 await expect(page.locator('.ns-hypo-safety-page')).toBeVisible();
 await expect(page.locator('.ns-hypo-graph')).toHaveCount(0);
});
