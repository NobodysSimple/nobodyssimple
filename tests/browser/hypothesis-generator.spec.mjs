import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const open=async page=>{
 await page.goto('/index.html#hypothesis');
 await expect(page.locator('[data-hypothesis-generator]')).toBeVisible();
};
async function begin(page,id){
 await page.locator('[data-hypo-track="'+id+'"]').first().click();
 await expect(page.locator('#ns-hypo-question')).toBeVisible();
}
async function answer(page,n=4,answerId='probably'){
 for(let i=0;i<n;i++){
  const button=page.locator('[data-hypo-answer="'+answerId+'"]');
  if(!(await button.count()))break;
  await button.click();
 }
}
test('homepage shows Hypothesis Generator immediately below Nobody’s Simple Lifestyle',async({page})=>{
 await page.goto('/index.html#home');
 const lifestyle=page.locator('.ns-home-refined .ns-home-lifestyle');
 const hypothesis=page.locator('.ns-home-refined .ns-home-hypothesis');
 await expect(lifestyle).toBeVisible();
 await expect(hypothesis).toBeVisible();
 await expect(hypothesis).toContainText('Hypothesis Generator');
 await expect(hypothesis.locator('img')).toHaveAttribute('src','ns-character-thinking.webp');
 const order=await hypothesis.evaluate(el=>({
  current:[...el.parentElement.children].indexOf(el),
  lifestyle:[...el.parentElement.children].indexOf(el.parentElement.querySelector('.ns-home-lifestyle'))
 }));
 expect(order.current).toBe(order.lifestyle+1);
 await hypothesis.click();
 await expect(page).toHaveURL(/#hypothesis$/);
 await expect(page.locator('.ns-hypo-track')).toHaveCount(12);
});
test('Nobody asks a new adaptive question after each yes/no/maybe answer',async({page})=>{
 await open(page);
 await begin(page,'procrastination');
 await expect(page.locator('#ns-hypo-question')).toContainText('clear first step');
 await expect(page.locator('[data-hypo-answer]')).toHaveCount(5);
 await page.locator('[data-hypo-answer="no"]').click();
 await expect(page.locator('#ns-hypo-question')).not.toContainText('clear first step');
 await expect(page.locator('.ns-hypo-progress')).toContainText('Question 2');
 await page.locator('[data-hypo-answer="unsure"]').click();
 await expect(page.locator('.ns-hypo-progress')).toContainText('Question 3');
 await page.locator('[data-hypo-back]').click();
 await expect(page.locator('.ns-hypo-progress')).toContainText('Question 2');
 await expect(page.locator('img.ns-hypo-guide-art')).toBeVisible();
 await expect(page.locator('.ns-hypo-why summary')).toBeVisible();
 await page.locator('.ns-hypo-why summary').click();
 await expect(page.locator('.ns-hypo-why')).toContainText('compare possible processes');
});
test('after a few answers, results show alternatives, uncertainty, supporting and challenging evidence',async({page})=>{
 await open(page);
 await page.locator('[data-hypo-description]').fill('A report I keep delaying at work');
 await begin(page,'procrastination');
 await answer(page,4,'probably');
 await expect(page.locator('[data-hypo-results]')).toBeVisible();
 await page.locator('[data-hypo-results]').click();
 await expect(page.locator('.ns-hypo-result-hero')).toBeVisible();
 await expect(page.locator('.ns-hypo-result-card')).toHaveCount(3);
 await expect(page.locator('.ns-hypo-result-card').first()).toContainText('Possibility 1');
 await page.locator('.ns-hypo-full-evidence summary').click();
 await expect(page.locator('.ns-hypo-observations').first()).toBeVisible();
 await expect(page.locator('.ns-hypo-counters').first()).toBeVisible();
 await expect(page.locator('.ns-hypo-need').first()).toContainText('not something we have inferred');
 await expect(page.locator('.ns-hypo-graph')).toBeVisible();
 await expect(page.locator('.ns-hypo-graph-node').first()).toBeVisible();
 await expect(page.locator('.ns-hypo-transparency')).toContainText('probability');
 await expect(page.locator('.ns-hypo-final-buttons a[href="#workbook-topic/procrastination"]')).toHaveCount(1);
 const feedback=page.locator('.ns-hypo-result-card').first().locator('[data-hypo-feedback="no-fit"]');
 await feedback.click();
 await expect(page.locator('[data-hypo-feedback="no-fit"][aria-pressed="true"]')).toHaveCount(1);
 const [download]=await Promise.all([
  page.waitForEvent('download'),page.locator('[data-hypo-download]').click()
 ]);
 expect(download.suggestedFilename()).toMatch(/nobodys-simple-hypothesis-procrastination\.txt/);
});
test('overthinking has a different first question and can hand off to an existing workbook',async({page})=>{
 await open(page);
 await begin(page,'overthinking');
 await expect(page.locator('#ns-hypo-question')).toContainText('completely certain');
 await answer(page,3,'yes');
 await page.locator('[data-hypo-results]').click();
 await expect(page.locator('.ns-hypo-result-hero')).toBeVisible();
 await expect(page.locator('.ns-hypo-final-buttons a[href="#workbook-topic/rumination"]')).toHaveCount(1);
 await page.locator('.ns-hypo-final-buttons a[href="#workbook-topic/rumination"]').click();
 await expect(page.locator('[data-workbook="topic/rumination"]')).toBeVisible();
 await expect(page.locator('.ns-pick-chooser')).toBeVisible();
});
test('safety responses stop generic formulation and show appropriate support',async({page})=>{
 await open(page);
 await begin(page,'relationships');
 await expect(page.locator('#ns-hypo-question')).toContainText('retaliation');
 await page.locator('[data-hypo-answer="yes"]').click();
 await expect(page.locator('.ns-hypo-safety-page')).toBeVisible();
 await expect(page.locator('.ns-hypo-result-card')).toHaveCount(0);
 await expect(page.locator('.ns-hypo-safety-links')).toContainText('Confidential help');
 await page.locator('[data-hypo-back]').click();
 await expect(page.locator('#ns-hypo-question')).toContainText('retaliation');
 await page.locator('[data-hypo-answer="no"]').click();
 await expect(page.locator('.ns-hypo-safety-page')).toHaveCount(0);
});
test('personal answers and working formulations are not automatically retained across reloads',async({page})=>{
 await open(page);
 await page.locator('[data-hypo-description]').fill('A private concern');
 await begin(page,'fatigue');
 await page.locator('[data-hypo-answer="probably"]').click();
 await page.reload();
 await expect(page.locator('.ns-hypo-track-grid')).toBeVisible();
 await expect(page.locator('[data-hypo-description]')).toHaveValue('');
 await expect(page.locator('.ns-hypo-result-card')).toHaveCount(0);
});
test('atlas lookup does not assign an unrelated formulation when a topic is not supported',async({page})=>{
 await open(page);
 await page.locator('.ns-hypo-search summary').click();
 await page.locator('[data-hypo-search]').fill('insomnia');
 await expect(page.locator('.ns-hypo-topic')).toHaveCount(1);
 await expect(page.locator('[data-hypo-topic="insomnia"]')).toBeVisible();
 await page.locator('[data-hypo-topic="insomnia"]').click();
 await expect(page.locator('#ns-hypo-question')).toContainText('sleep');
});
test('mobile and desktop have no horizontal page overflow or serious accessibility violations',async({page})=>{
 await open(page);
 const audit=async label=>{
  const size=await page.locator('.ns-hypo-shell').evaluate(el=>({
   width:el.clientWidth,scroll:el.scrollWidth,
   left:el.getBoundingClientRect().left,right:el.getBoundingClientRect().right,viewport:innerWidth
  }));
  expect(size.scroll,label).toBeLessThanOrEqual(size.width+2);
  expect(size.left,label).toBeGreaterThanOrEqual(-2);
  expect(size.right,label).toBeLessThanOrEqual(size.viewport+2);
  const axe=await new AxeBuilder({page}).include('.ns-hypo-shell')
   .withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  const issues=axe.violations.filter(v=>['serious','critical'].includes(v.impact));
  expect(issues,JSON.stringify({label,issues:issues.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,html:n.html,summary:n.failureSummary})).slice(0,5)}))},null,2)).toEqual([]);
 };
 await audit('landing');
 await begin(page,'procrastination');
 await audit('question');
 await answer(page,4,'probably-not');
 await page.locator('[data-hypo-results]').click();
 await audit('results');
});
