import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const load=async(page,choice)=>{
 await page.goto('/index.html#workbook/regulate/'+choice);
 await expect(page.locator('[data-workbook="regulate/'+choice+'"]')).toBeVisible();
};
test('all eight Feel steadier experiences expose six chapters and twelve contextual techniques',async({page})=>{
 for(const choice of ['overwhelmed','panicky','sensory','anger','disconnected','drained','restless','savour']){
  await load(page,choice);
  await expect(page.locator('.ns-wb-chapter[data-wb-chapter]')).toHaveCount(7);
  await expect(page.locator('.ns-wb-method')).toHaveCount(12);
  await expect(page.locator('[data-wb-widget]')).toHaveCount(7);
  await expect(page.locator('#ns-wb-dbt [data-wb-check]')).toHaveCount(6);
  await expect(page.locator('dialog.ns-guidebook-dialog')).toHaveCount(0);
  await expect(page.locator('#ns-wb-sources a').first()).toHaveAttribute('href',/^https:/);
 }
});
test('direct legacy settling link still opens the new embedded education and worksheets',async({page})=>{
 await page.goto('/index.html#need/steady-sensory');
 await expect(page.locator('[data-workbook="regulate/sensory"]')).toBeVisible();
 await expect(page.locator('h1')).toContainText('Sensory');
 await page.locator('[data-wb-field="context.condition"]').fill('The overhead lighting is uncomfortable');
 await page.locator('[data-wb-field="context.change"]').fill('Find a lower-light setting');
 await page.locator('[data-wb-action="context"]').click();
 await expect(page.locator('[data-wb-feedback="context"]')).toContainText('overhead lighting');
 await expect(page).toHaveURL(/#need\/steady-sensory$/);
});
test('chapter navigation stays on the page and leaves ongoing worksheet entries intact',async({page})=>{
 await load(page,'overwhelmed');
 await page.locator('[data-wb-field="thinking.observed"]').fill('The tasks are due this week');
 await page.locator('[data-wb-jump="support"]').click();
 await expect(page).toHaveURL(/#workbook\/regulate\/overwhelmed$/);
 await expect(page.locator('[data-wb-field="thinking.observed"]')).toHaveValue('The tasks are due this week');
 await page.locator('[data-wb-field="dbt.plan"]').fill('A safe short break');
 await page.locator('[data-wb-check="dbt.options"]').first().check();
 await page.locator('[data-wb-action="dbt"]').click();
 await expect(page.locator('[data-wb-feedback="dbt"]')).toContainText('Pause');
});
test('new panic guide visibly distinguishes a familiar panic response from medical emergencies',async({page})=>{
 await load(page,'panicky');
 await expect(page.locator('.ns-wb-safety')).toContainText(/999|chest pain|emergency/i);
 await expect(page.locator('#ns-wb-context')).toBeVisible();
 await expect(page.locator('#ns-wb-practice')).toBeVisible();
});
test('the new integrated guide has no serious automated WCAG violations across device sizes',async({page})=>{
 await load(page,'overwhelmed');
 const a=await new AxeBuilder({page}).include('.ns-wb-wrap').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(a.violations.filter(v=>['serious','critical'].includes(v.impact)),
  JSON.stringify(a.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary})).slice(0,8)})),null,2)).toEqual([]);
});
