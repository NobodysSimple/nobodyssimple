import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const entrance='/index.html#navigate/learn';
const modeIds=['regulate','process','understand','act','relate','learn','unsure'];

test('the starting point leads straight to eleven balanced themes, with no suggested-topic shortcuts',async({page})=>{
 await page.goto('/index.html#navigate');
 await expect(page.locator('.ns-needs-mode')).toHaveCount(7);
 for(const mode of modeIds){
  await page.goto('/index.html#navigate/'+mode);
  await expect(page.getByRole('heading',{name:'Explore by theme'})).toBeVisible();
  await expect(page.locator('[data-needs-theme]')).toHaveCount(11);
  await expect(page.locator('.ns-needs-featured,[data-needs-featured-list]')).toHaveCount(0);
  await expect(page.getByText('A few places to start')).toHaveCount(0);
  await expect(page.locator('[data-needs-topic-panel]')).toBeHidden();
  await expect(page.locator('[data-needs-topic-list] > .ns-needs-choice')).toHaveCount(0);
  const counts=await page.locator('[data-needs-theme] em').allTextContents();
  const values=counts.map(value=>Number(value.match(/\d+/)?.[0]));
  expect(values.every(n=>n>=42&&n<=50),mode).toBeTruthy();
  expect(values.reduce((a,b)=>a+b,0)).toBe(518);
 }
 const accessibility=await new AxeBuilder({page}).include('.ns-needs').analyze();
 expect(accessibility.violations).toEqual([]);
});

test('themes reveal only their own topics, with simple Show more paging and a clear return',async({page})=>{
 await page.goto(entrance);
 const button=page.locator('[data-needs-theme="access"]');
 await button.click();
 await expect(button).toHaveAttribute('aria-expanded','true');
 await expect(page.locator('[data-needs-topic-panel]')).toBeVisible();
 await expect(page.locator('[data-needs-theme-section]')).toBeHidden();
 await expect(page.locator('[data-needs-topic-list] > .ns-needs-choice')).toHaveCount(24);
 await expect(page.locator('[data-needs-topic-list]')).toContainText(/autis|adhd|disabil|access/i);
 await page.locator('[data-needs-more]').click();
 await expect(page.locator('[data-needs-topic-list] > .ns-needs-choice')).toHaveCount(42);
 await expect(page.locator('[data-needs-more]')).toBeHidden();
 await page.locator('[data-needs-back-themes]').click();
 await expect(page.locator('[data-needs-topic-panel]')).toBeHidden();
 await expect(page.locator('[data-needs-theme]')).toHaveCount(11);
});

test('search across every theme finds identity, disability, racism and health topics',async({page})=>{
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
 await expect(page).toHaveURL(/#workbook-topic\/racial-discrimination$/);
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
test('all starting points retain complete topic search while changing relevance order',async({page})=>{
 for(const mode of ['regulate','understand','relate']){
  await page.goto('/index.html#navigate/'+mode);
  await expect(page.locator('[data-needs-theme="connection"]')).toBeVisible();
  await page.locator('[data-needs-choice-filter]').fill('parentification');
  await expect(page.locator('[data-needs-topic-list] a[href="#workbook-topic/parentification"]')).toHaveCount(1);
  await page.locator('[data-needs-choice-filter]').fill('adhd');
  await expect(page.locator('[data-needs-topic-list]')).toContainText('ADHD');
 }
});
test('old Atlas links still redirect to the eleven-theme navigator',async({page})=>{
 await page.goto('/index.html#navigate/atlas/area/neuro');
 await expect(page).toHaveURL(/#navigate\/learn$/);
 await expect(page.locator('[data-needs-theme]')).toHaveCount(11);
});
