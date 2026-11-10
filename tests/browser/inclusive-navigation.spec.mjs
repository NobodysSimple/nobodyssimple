import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const atlas='/index.html#navigate/atlas';

test('expanded atlas has discoverable categories, manageable pagination and searchable specific experiences',async({page})=>{
 await page.goto(atlas);
 await expect(page.getByRole('heading',{name:'Explore an experience or difficulty'})).toBeVisible();
 await expect(page.locator('[data-needs-match-count]')).toContainText('518 topics');
 await expect(page.locator('[data-needs-topic-results] .ns-needs-topic')).toHaveCount(48);
 await expect(page.locator('[data-needs-more]')).toBeVisible();
 await page.locator('[data-needs-domain="lgbtq"]').click();
 await expect(page.locator('[data-needs-match-count]')).toContainText('24 topics');
 await expect(page.locator('[data-needs-domain-select]')).toHaveValue('lgbtq');
 await expect(page.getByText('I am exploring my gender identity')).toBeVisible();
 await page.locator('[data-needs-domain="neuro"]').click();
 await expect(page.getByText('I want to understand ADHD experiences')).toBeVisible();
 await page.locator('[data-needs-domain-select]').selectOption('culture');
 await expect(page.getByText('I am experiencing racism')).toBeVisible();
 const accessibility=await new AxeBuilder({page}).include('.ns-needs').analyze();
 expect(accessibility.violations).toEqual([]);
});

test('search preserves full catalogue, opens a race experience and presents practical context instead of individual blame',async({page})=>{
 await page.goto(atlas);
 await page.locator('[data-needs-search]').fill('racial discrimination');
 await expect(page.getByText('I am experiencing racism')).toBeVisible();
 await page.getByRole('link',{name:/I am experiencing racism/}).click();
 await expect(page).toHaveURL(/#workbook-topic\/racial-discrimination$/);
 await expect(page.getByText('I am experiencing racism').first()).toBeVisible();
 await expect(page.locator('.ns-pick-understand')).toBeVisible();
 await expect(page.locator('.ns-pick-editorial-status')).toContainText('Editorial overview');
 await page.locator('.ns-pick-deeper summary').click();
 await expect(page.getByText('Conditions and influences worth checking')).toBeVisible();
});

test('health and neurodivergent topics can be searched by familiar terms and reached directly',async({page})=>{
 await page.goto(atlas);
 await page.locator('[data-needs-search]').fill('dyspraxia');
 await expect(page.getByText('Coordination or motor planning is difficult for me')).toBeVisible();
 await page.locator('[data-needs-search]').fill('perimenopause');
 await expect(page.getByText('Menopause or perimenopause is affecting my life')).toBeVisible();
 await page.locator('[data-needs-search]').fill('LGBTQIA+');
 await expect(page.getByText('I am exploring my gender identity')).toBeVisible();
});

test('current sexual coercion offers safety support before any personal exercise',async({page})=>{
 await page.goto('/index.html#workbook-topic/sexual-coercion');
 await expect(page.getByRole('heading',{name:'Safety and support before a worksheet'})).toBeVisible();
 await expect(page.locator('[data-pick-field]')).toHaveCount(0);
 await expect(page.locator('[data-pick-open]')).toHaveCount(0);
 await expect(page.locator('.ns-pick-care-actions a[href="#need/support-safety"]')).toBeVisible();
});


test('the first What would help screen displays inclusive topic areas and opens a filtered atlas',async({page})=>{
 await page.goto('/index.html#navigate');
 await expect(page.getByRole('heading',{name:'What would help you right now?'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Explore a topic or experience'})).toBeVisible();
 await expect(page.locator('a[href="#navigate/atlas/area/culture"]')).toBeVisible();
 await expect(page.locator('a[href="#navigate/atlas/area/lgbtq"]')).toBeVisible();
 await expect(page.locator('a[href="#navigate/atlas/area/neuro"]')).toBeVisible();
 await page.locator('a[href="#navigate/atlas/area/neuro"]').click();
 await expect(page).toHaveURL(/#navigate\/atlas\/area\/neuro$/);
 await expect(page.locator('[data-needs-domain-select]')).toHaveValue('neuro');
 await expect(page.getByText('I want to understand ADHD experiences')).toBeVisible();
});
