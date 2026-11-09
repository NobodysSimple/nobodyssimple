import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const open=async(page,track)=>{
 await page.goto('/index.html#hypothesis');
 await page.locator('[data-hypo-track="'+track+'"]').click();
 await page.locator('[data-hypo-drill-skip]').click();
 await expect(page.locator('[data-hypo-invest-start]')).toBeVisible();
 await page.locator('[data-hypo-invest-start]').click();
};
const pick=async(page,value)=>{
 const current=page.locator('.ns-hypo-functional #ns-hypo-question');
 await expect(current).toBeVisible();
 await page.locator('[data-hypo-invest-answer="'+value+'"]').click();
};
test('finds actual father-related circumstance, coping pattern and observed consequences; challenges links',async({page})=>{
 await open(page,'relationships');
 for(const id of ['father','narcissistic','dismissal','criticism','anger','unfair','withdraw',
  'avoid','relief','returns','too_little','high','power','safer_people','feel_emotion',
  'autonomy','not_choose','circumstances','boundary'])await pick(page,id);
 await expect(page.locator('.ns-hypo-functional')).toHaveCount(0);
 const graph=page.locator('.ns-hypo-graph');
 await expect(graph).toContainText('I describe my dad as narcissistic');
 await expect(graph).toContainText('He dismisses or belittles what I say');
 await expect(graph).toContainText('I withdrew, became quiet or left');
 await expect(graph).toContainText('I feel some relief or safety');
 await expect(graph).toContainText('Not enough opportunity for sleep');
 const links=page.locator('.ns-hypo-causal-link');
 await expect(links.first()).toBeVisible();
 await expect(links.first()).toContainText('HYPOTHESIS, NOT ESTABLISHED');
 await expect(links.first()).toContainText('Possible trigger');
 await links.first().locator('[data-hypo-link-verdict="no-fit"]').click();
 await expect(links.first().locator('[data-hypo-link-verdict="no-fit"]')).toHaveAttribute('aria-pressed','true');
 const audit=await new AxeBuilder({page}).include('.ns-hypo-shell')
  .withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(audit.violations.filter(v=>['serious','critical'].includes(v.impact)).map(v=>v.id)).toEqual([]);
});
test('real intimidation ends investigation with safety guidance, not an explanation of the father',async({page})=>{
 await open(page,'relationships');
 for(const id of ['father','controlling','intimidation'])await pick(page,id);
 await expect(page.locator('.ns-hypo-safety-page')).toBeVisible();
 await expect(page.locator('.ns-hypo-safety-page')).toContainText('safety');
 await expect(page.locator('.ns-hypo-graph')).toHaveCount(0);
});
test('sleep, external circumstances, alternatives and values can be checked without any textarea',async({page})=>{
 await open(page,'procrastination');
 await expect(page.locator('.ns-hypo-functional')).toBeVisible();
 await pick(page,'uncertainty');
 await pick(page,'shame');
 await pick(page,'inadequate');
 await pick(page,'delay');
 await pick(page,'analyse');
 await pick(page,'relief');
 await pick(page,'returns');
 await pick(page,'difficulty');
 await pick(page,'some');
 await pick(page,'expectations');
 await pick(page,'clarity');
 await pick(page,'no_cost');
 await pick(page,'competence');
 await pick(page,'comfort');
 await pick(page,'skills');
 await pick(page,'information');
 await expect(page.locator('.ns-hypo-result-hero')).toBeVisible();
 await expect(page.locator('.ns-hypo-graph')).toContainText('Difficulty falling or staying asleep');
 await expect(page.locator('.ns-hypo-causal-links')).toContainText('Sleep and capacity');
});
