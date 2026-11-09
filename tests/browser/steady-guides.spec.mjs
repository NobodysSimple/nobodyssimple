import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const load=async(page,choice)=>{
 await page.goto('/index.html#workbook/regulate/'+choice);
 await expect(page.locator('[data-workbook="regulate/'+choice+'"]')).toBeVisible();
};
test('eight Feel steadier guides each offer twelve tailored source interventions plus varied alternatives',async({page})=>{
 for(const choice of ['overwhelmed','panicky','sensory','anger','disconnected','drained','restless','savour']){
  await load(page,choice);
  expect(await page.locator('[data-pick-card]').count()).toBeGreaterThanOrEqual(20);
  await expect(page.locator('[data-pick-card^="source-"]')).toHaveCount(12);
  await expect(page.locator('.ns-pick-definition')).toBeVisible();
  await expect(page.locator('.ns-pick-chooser')).toBeVisible();
  await expect(page.locator('[data-pick-selected] .ns-pick-empty')).toBeVisible();
  await expect(page.locator('[data-pick-field]')).toHaveCount(0);
  await expect(page.locator('.ns-wb-chapter')).toHaveCount(0);
 }
});
test('direct legacy settling link displays the one-task chooser and a genuine adjustment worksheet',async({page})=>{
 await page.goto('/index.html#need/steady-sensory');
 await expect(page.locator('[data-workbook="regulate/sensory"]')).toBeVisible();
 await page.locator('[data-pick-open="source-context-0"]').click();
 await expect(page.locator('dialog[data-pick-dialog]')).toBeVisible();
 await page.locator('[data-pick-choose="source-context-0"]').click();
 await page.locator('[data-pick-field="condition"]').fill('The overhead lighting is uncomfortable');
 await page.locator('[data-pick-field="choice"]').fill('Find a lower-light setting');
 await page.locator('[data-pick-review]').click();
 await expect(page.locator('[data-pick-output]')).toContainText('overhead lighting');
 await expect(page).toHaveURL(/#need\/steady-sensory$/);
});
test('Feel steadier retains DBT-informed options as voluntary cards, not compulsory steps',async({page})=>{
 await load(page,'overwhelmed');
 await page.locator('[data-pick-filter="regulation"]').click();
 await expect(page.locator('[data-pick-card]')).toHaveCount(3);
 const first=page.locator('[data-pick-open]').first();
 const id=await first.getAttribute('data-pick-open');
 await first.click();
 await expect(page.locator('dialog[data-pick-dialog]')).toContainText('DBT-informed');
 await page.locator('[data-pick-choose="'+id+'"]').click();
 await expect(page.locator('[data-pick-field="cue"]')).toBeVisible();
 await expect(page.locator('[data-pick-field="condition"]')).toHaveCount(0);
});
test('panic guide keeps medical cautions visible before choosing any intervention',async({page})=>{
 await load(page,'panicky');
 await expect(page.locator('.ns-pick-cautions')).toContainText(/999|chest pain|emergency/i);
 await expect(page.locator('[data-pick-selected] .ns-pick-empty')).toBeVisible();
});
test('the new card selector and preview dialog avoid serious automated accessibility findings',async({page})=>{
 await load(page,'overwhelmed');
 let audit=await new AxeBuilder({page}).include('.ns-pick-wrap').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(audit.violations.filter(v=>['serious','critical'].includes(v.impact)),
  JSON.stringify(audit.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary})).slice(0,6)})),null,2)).toEqual([]);
 await page.locator('[data-pick-open="source-context-0"]').click();
 audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(audit.violations.filter(v=>['serious','critical'].includes(v.impact)),
  JSON.stringify(audit.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary})).slice(0,6)})),null,2)).toEqual([]);
});
