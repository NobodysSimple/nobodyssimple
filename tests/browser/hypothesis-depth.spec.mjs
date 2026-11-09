import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const open=async page=>{
 await page.goto('/index.html#hypothesis');
 await expect(page.locator('[data-hypothesis-generator]')).toBeVisible();
};
async function answerOne(page,prefer='probably'){
 const first=page.locator('[data-hypo-answer]').first();
 const id=await first.getAttribute('data-hypo-question');
 await page.locator('[data-hypo-answer="'+(id==='unsafe'||id==='medical-sleep'?'no':prefer)+'"]').click();
 return id;
}
test('shaving-legs example gets a nuanced presentation pathway, not an imposed identity label',async({page})=>{
 await open(page);
 await page.locator('[data-hypo-description]').fill('I like shaving my legs, but I am unsure what that says about me as a man');
 await page.locator('[data-hypo-from-description]').click();
 await expect(page.locator('#ns-hypo-question')).toContainText('grooming');
 await expect(page.locator('.ns-hypo-progress')).toContainText('No fixed question limit');
 await page.locator('[data-hypo-answer="yes"]').click();
 let seen=0;
 for(let i=0;i<17;i++){
  await expect(page.locator('#ns-hypo-question')).toBeVisible();
  await answerOne(page,i%2?'probably':'yes');
  seen++;
 }
 await expect(page.locator('.ns-hypo-progress')).toContainText('Question 19');
 await page.locator('[data-hypo-results]').first().click();
 await expect(page.locator('.ns-hypo-graph')).toBeVisible();
 await expect(page.locator('.ns-hypo-graph-branches .ns-hypo-graph-node').first()).toBeVisible();
 await expect(page.locator('.ns-hypo-graph-node[data-hypo-node="presenting"]')).toContainText('shaving my legs');
 await expect(page.locator('.ns-hypo-pattern')).toContainText('cannot establish gender identity');
 const pageText=await page.locator('.ns-hypo-graph').innerText();
 expect(pageText).not.toMatch(/you are (transgender|gay|bisexual)|a (hidden|childhood) wound/i);
});
test('a graph node can be challenged, rewritten and selectively re-investigated',async({page})=>{
 await open(page);
 await page.locator('[data-hypo-track="identity"]').click();
 for(let i=0;i<10;i++)await answerOne(page,i%3?'probably':'no');
 await page.locator('[data-hypo-results]').first().click();
 const branches=page.locator('.ns-hypo-graph-branches [data-hypo-node]');
 await expect(branches).toHaveCount(3);
 const id=await branches.first().getAttribute('data-hypo-node');
 await branches.first().click();
 await expect(page.locator('.ns-hypo-node-editor')).toBeVisible();
 await expect(page.locator('.ns-hypo-node-editor .ns-hypo-node-evidence')).toBeVisible();
 await page.locator('[data-hypo-node-verdict="no-fit"]').click();
 await expect(page.locator('[data-hypo-node="'+id+'"]')).toBeVisible();
 await expect(page.locator('[data-hypo-node-verdict="no-fit"]')).toHaveAttribute('aria-pressed','true');
 await page.locator('[data-hypo-node-text]').fill('This is a better description of my experience');
 await page.locator('[data-hypo-node-save="'+id+'"]').click();
 await expect(page.locator('[data-hypo-node="'+id+'"]')).toContainText('This is a better description');
 await page.locator('[data-hypo-node-investigate="'+id+'"]').click();
 await expect(page.locator('#ns-hypo-question')).toBeVisible();
 await expect(page.locator('.ns-hypo-progress')).toContainText('Question 11');
});
test('all previous answers can be revised and the formulation rebuilt',async({page})=>{
 await open(page);
 await page.locator('[data-hypo-track="overthinking"]').click();
 for(let i=0;i<9;i++)await answerOne(page,i%2?'probably':'yes');
 await page.locator('[data-hypo-results]').first().click();
 await page.locator('.ns-hypo-answer-history summary').click();
 await expect(page.locator('.ns-hypo-history-item')).toHaveCount(9);
 const first=page.locator('.ns-hypo-history-item').first();
 const questionId=await first.locator('select').getAttribute('data-hypo-answer-edit');
 await first.locator('select').selectOption('no');
 await first.locator('button').click();
 await expect(page.locator('.ns-hypo-graph')).toBeVisible();
 await page.locator('.ns-hypo-answer-history summary').click();
 await expect(page.locator('[data-hypo-answer-edit="'+questionId+'"]')).toHaveValue('no');
 await page.locator('[data-hypo-more]').click();
 await expect(page.locator('#ns-hypo-question')).toBeVisible();
});
test('graph is still provisional when the user says unsure to every question',async({page})=>{
 await open(page);
 await page.locator('[data-hypo-track="identity"]').click();
 for(let i=0;i<11;i++)await answerOne(page,'unsure');
 await page.locator('[data-hypo-results]').first().click();
 await expect(page.locator('.ns-hypo-result-hero')).toContainText('cannot establish one cause');
 await expect(page.locator('.ns-hypo-graph-node.ns-hypo-status-unknown').first()).toBeVisible();
 await expect(page.locator('.ns-hypo-graph')).toContainText('needs more information');
 await expect(page.locator('.ns-hypo-graph')).not.toContainText('90%');
});
test('graph nodes and revision controls fit desktop/mobile and meet critical accessibility checks',async({page})=>{
 await open(page);
 await page.locator('[data-hypo-track="identity"]').click();
 for(let i=0;i<9;i++)await answerOne(page,i%3?'probably-not':'probably');
 await page.locator('[data-hypo-results]').first().click();
 const audit=async context=>{
  const metrics=await page.locator('.ns-hypo-shell').evaluate(el=>({
   width:el.clientWidth,scroll:el.scrollWidth,left:el.getBoundingClientRect().left,
   right:el.getBoundingClientRect().right,viewport:innerWidth
  }));
  expect(metrics.scroll,context).toBeLessThanOrEqual(metrics.width+2);
  expect(metrics.left,context).toBeGreaterThanOrEqual(-2);
  expect(metrics.right,context).toBeLessThanOrEqual(metrics.viewport+2);
  const axe=await new AxeBuilder({page}).include('.ns-hypo-shell')
   .withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  const serious=axe.violations.filter(x=>['serious','critical'].includes(x.impact));
  expect(serious,JSON.stringify({context,serious:serious.map(x=>({
   id:x.id,impact:x.impact,nodes:x.nodes.map(n=>({target:n.target,summary:n.failureSummary})).slice(0,6)
  }))},null,2)).toEqual([]);
 };
 await audit('formulation map');
 await page.locator('[data-hypo-node="need"]').click();
 await expect(page.locator('[data-hypo-node-text]')).toBeVisible();
 await audit('node revision controls');
});
