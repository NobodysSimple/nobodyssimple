import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const go=async(page,hash)=>{
 await page.goto('/index.html#'+hash);
 if(hash.startsWith('navigate/'))await expect(page.locator('.ns-needs')).toBeVisible();
 else await expect(page.locator('[data-workbook]')).toBeVisible();
};
const chapters=page=>page.locator('.ns-wb-chapter[data-wb-chapter]');
test('processing guide integrates explanation, five practice tools and personal notes on the same page',async({page})=>{
 await go(page,'navigate/process');
 await page.locator('a[href="#workbook/process/grief"]').click();
 await expect(page.locator('h1')).toHaveText('I am dealing with grief or loss');
 await expect(chapters(page)).toHaveCount(6);
 await expect(page.locator('[data-wb-widget]')).toHaveCount(6);
 await expect(page.locator('.ns-wb-cycle')).toContainText('reminder');
 await expect(page.locator('.ns-wb-methods')).toHaveCount(5);
 await expect(page.locator('dialog.ns-guidebook-dialog')).toHaveCount(0);
 await page.locator('[data-wb-field="recognition.situation"]').fill('A private grief reflection');
 await page.locator('[data-wb-field="context.condition"]').fill('Too many demands this week');
 await page.locator('[data-wb-field="context.kind"]').selectOption('share');
 await page.locator('[data-wb-field="context.change"]').fill('Ask someone to handle groceries');
 await page.locator('[data-wb-action="context"]').click();
 await expect(page.locator('[data-wb-feedback="context"]')).toContainText('Too many demands this week');
 await page.locator('[data-wb-field="thinking.observed"]').fill('A recent reminder');
 await page.locator('[data-wb-field="thinking.interpretation"]').fill('I will never feel happy again');
 await page.locator('[data-wb-action="thinking"]').click();
 await expect(page.locator('[data-wb-feedback="thinking"]')).toContainText('separated');
 await page.locator('[data-wb-summary]').click();
 await expect(page.locator('[data-wb-summary-output]')).toContainText('Ask someone to handle groceries');
 await expect(page.locator('[data-wb-summary-output]')).toContainText('I will never feel happy again');
 await expect(page).toHaveURL(/#workbook\/process\/grief$/);
});
test('action and understand pages embed adjustable conditions and cognitive exercises alongside advice',async({page})=>{
 await go(page,'navigate/act');
 await page.locator('a[href="#workbook/act/environment"]').click();
 await expect(page.locator('.ns-wb-methods')).toHaveCount(5);
 await expect(page.locator('[data-wb-field="context.change"]')).toBeVisible();
 await expect(page.locator('#ns-wb-context .ns-wb-method')).toContainText('sensory');
 await page.locator('[data-wb-jump="thinking"]').click();
 await expect(page).toHaveURL(/#workbook\/act\/environment$/);
 await page.locator('[data-wb-field="thinking.observed"]').fill('The meeting room is loud');
 await page.locator('[data-wb-field="thinking.interpretation"]').fill('My response is a personal failure');
 await page.locator('[data-wb-field="thinking.alternative"]').fill('The sound may exceed my capacity');
 await page.locator('[data-wb-action="thinking"]').click();
 await expect(page.locator('[data-wb-feedback="thinking"]')).toContainText('evidence');
 await go(page,'workbook/understand/pattern');
 await expect(page.locator('.ns-wb-tool')).toHaveCount(6);
 await expect(page.locator('#ns-wb-recognition')).toContainText('A repeated pattern');
});
test('related original tool can open within its chapter without navigating away',async({page})=>{
 await go(page,'workbook/act/load');
 const el=page.locator('[data-wb-original="context"]');
 await el.locator('summary').click();
 await el.locator('button[data-wb-mount]').click();
 await expect(el.locator('[data-wb-tool-host] .tool-page')).toBeVisible();
 await expect(page).toHaveURL(/#workbook\/act\/load$/);
 await el.locator('button[data-wb-mount]').click();
 await expect(el.locator('[data-wb-tool-host]')).toBeEmpty();
 await expect(page.locator('[data-wb-widget="context"]')).toBeVisible();
});
test('relationship safety page prioritises support rather than unsupervised exercises',async({page})=>{
 await go(page,'navigate/relate');
 await page.locator('a[href="#workbook/relate/unsafe"]').click();
 await expect(page.locator('.ns-wb-care-first')).toBeVisible();
 await expect(page.locator('[data-wb-field]')).toHaveCount(0);
 await expect(page.locator('[data-wb-mount]')).toHaveCount(0);
 await page.locator('[data-wb-care="private"]').click();
 await expect(page.locator('[data-wb-care-result]')).toContainText('unmonitored');
 await expect(page.locator('.ns-wb-sources a').first()).toHaveAttribute('href',/^https:/);
});
test('named difficulty and atlas browsing lead to in-page psychology workbooks',async({page})=>{
 await go(page,'workbook/learn/checking');
 await expect(page.locator('.ns-wb-safety')).toContainText('exposure and response prevention');
 await expect(page.locator('#ns-wb-practice .ns-wb-tool')).toBeVisible();
 await go(page,'workbook/learn/browse');
 await expect(page.locator('[data-wb-search]')).toBeVisible();
 await expect(page.locator('[data-wb-topic-results] a')).toHaveCount(12);
 await page.locator('[data-wb-search]').fill('insomnia');
 await expect(page.locator('[data-wb-topic-results]')).toContainText('Insomnia');
 await page.locator('a[href="#workbook-topic/insomnia"]').first().click();
 await expect(page.locator('[data-workbook="topic/insomnia"]')).toBeVisible();
 await expect(page.locator('.ns-wb-tool')).toHaveCount(6);
});
test('uncertain entry points offer real exercises without compulsory diagnosis or submission',async({page})=>{
 await go(page,'navigate/unsure');
 await page.locator('a[href="#workbook/unsure/clarity"]').click();
 await expect(page.locator('#ns-wb-recognition')).toBeVisible();
 await page.locator('[data-wb-field="acceptance.value"]').selectOption('Autonomy');
 await page.locator('[data-wb-field="acceptance.direction"]').fill('Choose a comfortable next step');
 await page.locator('[data-wb-action="acceptance"]').click();
 await expect(page.locator('[data-wb-feedback="acceptance"]')).toContainText('Autonomy');
 await page.locator('[data-wb-summary]').click();
 await expect(page.locator('[data-wb-summary-output]')).toContainText('Choose a comfortable next step');
});
test('explicit download and two-step clear work without silent persistence',async({page})=>{
 await go(page,'workbook/process/feel');
 await page.locator('[data-wb-field="recognition.situation"]').fill('Sensitive notes');
 const [download]=await Promise.all([page.waitForEvent('download'),page.locator('[data-wb-download]').click()]);
 expect(download.suggestedFilename()).toMatch(/nobodys-simple-process-feel-notes\.txt/);
 await page.locator('[data-wb-clear]').click();
 await expect(page.locator('[data-wb-clear]')).toHaveText('Confirm clearing all notes');
 await expect(page.locator('[data-wb-field="recognition.situation"]')).toHaveValue('Sensitive notes');
 await page.locator('[data-wb-clear]').click();
 await expect(page.locator('[data-wb-field="recognition.situation"]')).toHaveValue('');
 await expect(page.locator('[data-wb-summary-output]')).toContainText('cleared');
});
test('workbook screens are readable on mobile and have no serious or critical WCAG findings',async({page})=>{
 for(const hash of ['workbook/regulate/overwhelmed','workbook/process/feel','workbook/act/decision','workbook/learn/checking','workbook-topic/insomnia']){
  await go(page,hash);
  const b=await page.locator('.ns-wb-wrap').evaluate(el=>({width:el.clientWidth,scroll:el.scrollWidth,x:el.getBoundingClientRect().x,right:el.getBoundingClientRect().right,viewport:innerWidth}));
  expect(b.scroll,hash).toBeLessThanOrEqual(b.width+2);
  expect(b.x,hash).toBeGreaterThanOrEqual(-2);
  expect(b.right,hash).toBeLessThanOrEqual(b.viewport+2);
  const axe=await new AxeBuilder({page}).include('.ns-wb-wrap').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  expect(axe.violations.filter(v=>['serious','critical'].includes(v.impact)),
   JSON.stringify({hash,violations:axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({html:n.html,target:n.target,summary:n.failureSummary})).slice(0,5)}))},null,2)).toEqual([]);
 }
});
