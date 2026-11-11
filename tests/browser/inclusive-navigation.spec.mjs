import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const entrance='/index.html#navigate/learn';
test('seven starting points lead into six calm topic themes rather than 518 cards',async({page})=>{
 await page.goto('/index.html#navigate');
 await expect(page.locator('.ns-needs-mode')).toHaveCount(7);
 await page.goto(entrance);
 await expect(page.getByRole('heading',{name:'What feels closest?'})).toBeVisible();
 await expect(page.locator('[data-needs-theme]')).toHaveCount(6);
 await expect(page.locator('[data-needs-featured-list] > .ns-needs-choice')).toHaveCount(6);
 await expect(page.locator('[data-needs-topic-panel]')).toBeHidden();
 await expect(page.locator('[data-needs-topic-list] > .ns-needs-choice')).toHaveCount(0);
 const accessibility=await new AxeBuilder({page}).include('.ns-needs').analyze();
 expect(accessibility.violations).toEqual([]);
});
test('browse themes, then narrower domain buttons, with no more than 24 cards initially',async({page})=>{
 await page.goto(entrance);
 const health=page.locator('[data-needs-theme="health"]');
 await health.click();
 await expect(health).toHaveAttribute('aria-expanded','true');
 await expect(page.locator('[data-needs-topic-panel]')).toBeVisible();
 await expect(page.locator('[data-needs-topic-list] > .ns-needs-choice').first()).toBeVisible();
 expect(await page.locator('[data-needs-topic-list] > .ns-needs-choice').count()).toBeLessThanOrEqual(24);
 await page.locator('[data-needs-area="neuro"]').click();
 await expect(page.locator('[data-needs-area="neuro"]')).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('[data-needs-topic-list]')).not.toContainText('Hunger');
 await page.locator('[data-needs-back-themes]').click();
 await expect(page.locator('[data-needs-topic-panel]')).toBeHidden();
 await expect(page.locator('[data-needs-theme]')).toHaveCount(6);
});
test('search across all themes still finds identity, disability, racism and health topics',async({page})=>{
 await page.goto(entrance);
 const filter=page.locator('[data-needs-choice-filter]');
 for(const [term,title] of [['racial discrimination','I am experiencing racism'],
 ['dyspraxia','Coordination or motor planning is difficult for me'],
 ['perimenopause','Menopause or perimenopause is affecting my life'],
 ['LGBTQIA+','I am exploring my gender identity']]){
  await filter.fill(term);
  await expect(page.locator('[data-needs-topic-panel]')).toBeVisible();
  await expect(page.locator('[data-needs-topic-list]')).toContainText(title);
 }
 await filter.fill('racial discrimination');
 await page.getByRole('link',{name:/I am experiencing racism/}).click();
 await expect(page).toHaveURL(/#workbook-topic\\/racial-discrimination$/);
 await expect(page.locator('.ns-pick-understand')).toBeVisible();
 await expect(page.locator('.ns-pick-editorial-status')).toContainText('Editorial overview');
});
test('safety-sensitive topics still show support before activities',async({page})=>{
 await page.goto('/index.html#workbook-topic/sexual-coercion');
 await expect(page.getByRole('heading',{name:'Safety and support before a worksheet'})).toBeVisible();
 await expect(page.locator('[data-pick-field]')).toHaveCount(0);
 await expect(page.locator('[data-pick-open]')).toHaveCount(0);
 await expect(page.locator('.ns-pick-care-actions a[href="#need/support-safety"]')).toBeVisible();
});
test('other starting points retain relevant cross-listed themes and direct suggestions',async({page})=>{
 await page.goto('/index.html#navigate/understand');
 await expect(page.locator('[data-needs-theme="health"]')).toBeVisible();
 await page.locator('[data-needs-choice-filter]').fill('adhd');
 await expect(page.locator('[data-needs-topic-list]')).toContainText('ADHD');
 await page.goto('/index.html#navigate/relate');
 await expect(page.locator('[data-needs-theme="people"]')).toBeVisible();
 await page.locator('[data-needs-choice-filter]').fill('parentification');
 await expect(page.locator('[data-needs-topic-list]')).toContainText('parent');
 await expect(page.locator('[data-needs-topic-list] a[href="#workbook-topic/parentification"]')).toHaveCount(1);
});
test('old Atlas URLs redirect into the current themed navigator',async({page})=>{
 await page.goto('/index.html#navigate/atlas/area/neuro');
 await expect(page).toHaveURL(/#navigate\\/learn$/);
 await expect(page.locator('[data-needs-theme="health"]')).toBeVisible();
});
