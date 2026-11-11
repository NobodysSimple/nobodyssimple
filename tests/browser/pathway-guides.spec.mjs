import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const go=async(page,hash)=>{
 await page.goto('/index.html#'+hash);
 if(hash.startsWith('navigate/'))await expect(page.locator('.ns-needs')).toBeVisible();
 else await expect(page.locator('[data-workbook]')).toBeVisible();
};
async function pick(page,id){
 const button=page.locator('[data-pick-open="'+id+'"]').first();
 await button.click();
 const dialog=page.locator('dialog[data-pick-dialog]');
 await expect(dialog).toBeVisible();
 await expect(dialog.locator('#ns-pick-dialog-title')).not.toBeEmpty();
 await dialog.locator('[data-pick-choose="'+id+'"]').click();
 await expect(dialog).not.toBeVisible();
 await expect(page.locator('[data-pick-selected] .ns-pick-sheet-main')).toHaveCount(1);
 return page.locator('[data-pick-selected]');
}
test('all advice is compact until one intervention is selected, then tailored worksheet appears',async({page})=>{
 await go(page,'navigate/process');
 await page.locator('a[href="#workbook/process/grief"]').click();
 await expect(page.locator('h1')).toHaveText('I am dealing with grief or loss');
 await expect(page.locator('.ns-pick-definition')).not.toBeEmpty();
 await expect(page.locator('.ns-pick-cycle')).not.toBeEmpty();
 await expect(page.locator('.ns-pick-chooser')).toBeVisible();
 expect(await page.locator('[data-pick-card]').count()).toBeGreaterThanOrEqual(12);
 await expect(page.locator('[data-pick-selected] .ns-pick-empty')).toBeVisible();
 await expect(page.locator('[data-pick-field]')).toHaveCount(0);
 await expect(page.locator('.ns-wb-methods')).toHaveCount(0);
 await pick(page,'source-context-0');
 await expect(page.locator('[data-pick-field="condition"]')).toBeVisible();
 await expect(page.locator('[data-pick-field="choice"]')).toBeVisible();
 await expect(page.locator('[data-pick-field="thought"]')).toHaveCount(0);
 await page.locator('[data-pick-field="condition"]').fill('Too many demands this week');
 await page.locator('[data-pick-field="choice"]').fill('Ask for help with groceries');
 await page.locator('[data-pick-review]').click();
 await expect(page.locator('[data-pick-output]')).toContainText('Ask for help with groceries');
 await expect(page).toHaveURL(/#workbook\/process\/grief$/);
});
test('the chooser keeps methods together in family groups and has keyboard-accessible details',async({page})=>{
 await go(page,'workbook/act/environment');
 const groups=await page.locator('[data-pick-family]').evaluateAll(items=>items.map(x=>x.dataset.pickFamily));
 expect(groups.length).toBeGreaterThanOrEqual(5);
 expect(new Set(groups).size).toBe(groups.length);
 await expect(page.locator('[data-pick-family="regulation"] [data-pick-card]')).not.toHaveCount(0);
 const track=page.locator('[data-pick-track]');
 const before=await track.evaluate(x=>x.scrollLeft);
 await page.locator('[data-pick-direction="1"]').click();
 await expect.poll(()=>track.evaluate(x=>x.scrollLeft)).toBeGreaterThan(before);
 await page.locator('[data-pick-refine]').selectOption('light');
 await expect(page.locator('[data-pick-refine]')).toHaveValue('light');
 const count=await page.locator('[data-pick-card]').count();
 expect(count).toBeGreaterThan(0);
 const ids=await page.locator('[data-pick-card]').evaluateAll(items=>items.map(x=>x.dataset.pickCard));
 expect(ids).toContain('tiny-pause');
 await page.locator('[data-pick-open="tiny-pause"]').click();
 await expect(page.locator('dialog[data-pick-dialog]')).toBeVisible();
 await expect(page.locator('dialog ol li')).toHaveCount(3);
 await page.keyboard.press('Escape');
 await expect(page.locator('dialog[data-pick-dialog]')).not.toBeVisible();
 await expect(page.locator('[data-pick-open="tiny-pause"]')).toBeFocused();
 await expect(page.locator('[data-pick-field]')).toHaveCount(0);
});
test('switching intervention preserves distinct private drafts within this open page',async({page})=>{
 await go(page,'workbook/understand/pattern');
 await pick(page,'source-context-0');
 await page.locator('[data-pick-field="condition"]').fill('I have a noisy desk');
 await page.locator('[data-pick-field="choice"]').fill('Change my work area');
 await page.locator('[data-pick-filter="thinking"]').click();
 await pick(page,'source-thinking-0');
 await expect(page.locator('[data-pick-field="facts"]')).toBeVisible();
 await expect(page.locator('[data-pick-field="condition"]')).toHaveCount(0);
 await page.locator('[data-pick-field="facts"]').fill('I postponed the task');
 await page.locator('[data-pick-field="thought"]').fill('I can never finish anything');
 await page.locator('[data-pick-filter="all"]').click();
 await pick(page,'source-context-0');
 await expect(page.locator('[data-pick-field="condition"]')).toHaveValue('I have a noisy desk');
 await expect(page.locator('[data-pick-field="choice"]')).toHaveValue('Change my work area');
 await expect(page.locator('[data-pick-selected] .ns-pick-sheet-main')).toHaveCount(1);
 await page.reload();
 await expect(page.locator('[data-pick-selected] .ns-pick-empty')).toBeVisible();
});
test('procrastination topic has distinct psychological approaches and a behavioural task',async({page})=>{
 await go(page,'workbook-topic/procrastination');
 await expect(page.locator('.ns-pick-deeper')).toBeVisible();
 await page.locator('.ns-pick-deeper summary').click();
 await expect(page.locator('.ns-pick-mechanism').first()).toBeVisible();
 await page.locator('[data-pick-filter="action"]').click();
 const first=page.locator('[data-pick-open]').first();
 const id=await first.getAttribute('data-pick-open');
 await pick(page,id);
 await expect(page.locator('[data-pick-field="target"]')).toBeVisible();
 await expect(page.locator('[data-pick-field="step"]')).toBeVisible();
 await expect(page.locator('[data-pick-field="facts"]')).toHaveCount(0);
 await page.locator('[data-pick-field="target"]').fill('I am postponing a report');
 await page.locator('[data-pick-field="step"]').fill('Write the first heading');
 await page.locator('[data-pick-review]').click();
 await expect(page.locator('[data-pick-output]')).toContainText('Write the first heading');
});
test('longer-term and low-demand options have different worksheets rather than a relabelled form',async({page})=>{
 await go(page,'workbook/act/begin');
 await page.locator('[data-pick-filter="long"]').click();
 await expect(page.locator('[data-pick-open="plan-if-then"]')).toBeVisible();
 await pick(page,'plan-if-then');
 await expect(page.locator('[data-pick-field="cue"]')).toBeVisible();
 await expect(page.locator('[data-pick-field="fallback"]')).toBeVisible();
 await page.locator('[data-pick-filter="now"]').click();
 await pick(page,'tiny-pause');
 await expect(page.locator('[data-pick-field="permission"]')).toBeVisible();
 await expect(page.locator('[data-pick-field="cue"]')).toHaveCount(0);
});
test('named topic cards open their existing chooser directly from the starting point',async({page})=>{
 await go(page,'navigate/learn');
 await expect(page.locator('.ns-needs-choices')).toHaveCount(1);
 await page.locator('[data-needs-choice-filter]').fill('insomnia');
 await expect(page.locator('a[href="#workbook-topic/insomnia"]')).toBeVisible();
 await page.locator('a[href="#workbook-topic/insomnia"]').first().click();
 await expect(page.locator('[data-workbook="topic/insomnia"]')).toBeVisible();
 await expect(page.locator('.ns-pick-chooser')).toBeVisible();
 await expect(page.locator('[data-pick-selected] .ns-pick-empty')).toBeVisible();
});
test('safety-priority routes do not collect personal disclosures or suggest unsupervised interventions',async({page})=>{
 for(const route of ['workbook/relate/unsafe','workbook-topic/suicidal-thoughts']){
  await go(page,route);
  await expect(page.locator('.ns-pick-care-first')).toBeVisible();
  await expect(page.locator('[data-pick-card]')).toHaveCount(0);
  await expect(page.locator('[data-pick-field]')).toHaveCount(0);
  await expect(page.locator('.ns-pick-care-actions a').first()).toHaveAttribute('href','#need/support-safety');
 }
});
test('download and deliberate clear work only for the one selected worksheet',async({page})=>{
 await go(page,'workbook/process/feel');
 await pick(page,'tiny-pause');
 await page.locator('[data-pick-field="pressure"]').fill('My private thought');
 const [dl]=await Promise.all([
  page.waitForEvent('download'),page.locator('[data-pick-download]').click()
 ]);
 expect(dl.suggestedFilename()).toMatch(/nobodys-simple-process-feel-tiny-pause\.txt/);
 await page.locator('[data-pick-clear]').click();
 await expect(page.locator('[data-pick-clear]')).toContainText('Confirm clearing');
 await expect(page.locator('[data-pick-field="pressure"]')).toHaveValue('My private thought');
 await page.locator('[data-pick-clear]').click();
 await expect(page.locator('[data-pick-field="pressure"]')).toHaveValue('');
});
test('mobile experience is compact, has no page overflow and avoids serious automated accessibility issues',async({page})=>{
 for(const route of ['workbook/regulate/overwhelmed','workbook/process/feel','workbook/act/decision','workbook/learn/checking','workbook-topic/insomnia']){
  await go(page,route);
  const metrics=await page.locator('.ns-pick-wrap').evaluate(el=>({
   width:el.clientWidth,scroll:el.scrollWidth,left:el.getBoundingClientRect().left,
   right:el.getBoundingClientRect().right,viewport:innerWidth
  }));
  expect(metrics.scroll,route).toBeLessThanOrEqual(metrics.width+2);
  expect(metrics.left,route).toBeGreaterThanOrEqual(-2);
  expect(metrics.right,route).toBeLessThanOrEqual(metrics.viewport+2);
  const result=await new AxeBuilder({page}).include('.ns-pick-wrap').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  expect(result.violations.filter(x=>['serious','critical'].includes(x.impact)),
   JSON.stringify({route,violations:result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,html:n.html,summary:n.failureSummary})).slice(0,5)}))},null,2)).toEqual([]);
 }
});
