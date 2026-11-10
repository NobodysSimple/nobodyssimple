import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const entrance='/index.html#navigate/learn';

test('all topic choices are identical cards inside the existing starting point',async({page})=>{
 await page.goto(entrance);
 await expect(page.getByRole('heading',{name:'What feels closest?'})).toBeVisible();
 await expect(page.locator('.ns-needs-choices')).toHaveCount(1);
 await expect(page.locator('.ns-needs-choices > .ns-needs-choice')).toHaveCount(518);
 await expect(page.locator('[href="#workbook-topic/racial-discrimination"]')).toBeVisible();
 await expect(page.locator('[href="#workbook-topic/adhd-understanding"]')).toBeVisible();
 await expect(page.locator('.ns-needs-related,.ns-needs-area-grid,.ns-needs-area-details,[data-needs-domain-select],[data-needs-more]')).toHaveCount(0);
 const accessibility=await new AxeBuilder({page}).include('.ns-needs').analyze();
 expect(accessibility.violations).toEqual([]);
});

test('in-place filter finds a topic and its card opens the existing field guide',async({page})=>{
 await page.goto(entrance);
 await page.locator('[data-needs-choice-filter]').fill('racial discrimination');
 await expect(page.locator('.ns-needs-choices > .ns-needs-choice:visible')).toHaveCount(1);
 await page.getByRole('link',{name:/I am experiencing racism/}).click();
 await expect(page).toHaveURL(/#workbook-topic\/racial-discrimination$/);
 await expect(page.getByText('I am experiencing racism').first()).toBeVisible();
 await expect(page.locator('.ns-pick-understand')).toBeVisible();
 await expect(page.locator('.ns-pick-editorial-status')).toContainText('Editorial overview');
 await page.locator('.ns-pick-deeper summary').click();
 await expect(page.getByText('Conditions and influences worth checking')).toBeVisible();
});

test('search, identity, disability and health topics remain discoverable in the same grid',async({page})=>{
 await page.goto(entrance);
 const filter=page.locator('[data-needs-choice-filter]');
 await filter.fill('dyspraxia');
 await expect(page.getByText('Coordination or motor planning is difficult for me')).toBeVisible();
 await filter.fill('perimenopause');
 await expect(page.getByText('Menopause or perimenopause is affecting my life')).toBeVisible();
 await filter.fill('LGBTQIA+');
 await expect(page.getByText('I am exploring my gender identity')).toBeVisible();
 await filter.fill('');
 await expect(page.locator('.ns-needs-choice:visible')).toHaveCount(518);
});

test('current sexual coercion offers safety support before any personal exercise',async({page})=>{
 await page.goto('/index.html#workbook-topic/sexual-coercion');
 await expect(page.getByRole('heading',{name:'Safety and support before a worksheet'})).toBeVisible();
 await expect(page.locator('[data-pick-field]')).toHaveCount(0);
 await expect(page.locator('[data-pick-open]')).toHaveCount(0);
 await expect(page.locator('.ns-pick-care-actions a[href="#need/support-safety"]')).toBeVisible();
});

test('starting points cross-list their relevant topics without category detours',async({page})=>{
 await page.goto('/index.html#navigate');
 await expect(page.getByRole('heading',{name:'What would help you right now?'})).toBeVisible();
 await expect(page.locator('.ns-needs-mode')).toHaveCount(7);

 await page.getByRole('link',{name:/Understand myself/}).click();
 await expect(page).toHaveURL(/#navigate\/understand$/);
 await expect(page.locator('.ns-needs-choices')).toHaveCount(1);
 await expect(page.locator('.ns-needs-choices > a.ns-needs-choice[href="#workbook-topic/adhd-understanding"]')).toBeVisible();

 await page.goto('/index.html#navigate/relate');
 await expect(page.locator('.ns-needs-choices > a.ns-needs-choice[href="#workbook-topic/parentification"]')).toBeVisible();
 await expect(page.locator('.ns-needs-choices > a.ns-needs-choice[href="#workbook-topic/racial-discrimination"]')).toBeVisible();
 await expect(page.locator('.ns-needs-related,.ns-needs-area-grid,.ns-needs-area-details')).toHaveCount(0);
});

test('old atlas links return to the unified mode rather than a separate search page',async({page})=>{
 await page.goto('/index.html#navigate/atlas/area/neuro');
 await expect(page).toHaveURL(/#navigate\/learn$/);
 await expect(page.getByRole('heading',{name:'What feels closest?'})).toBeVisible();
});
