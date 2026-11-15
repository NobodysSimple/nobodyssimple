import {test,expect} from '@playwright/test';

test('My Field Guide is an actual interactive open journal, not a static screenshot',async({page})=>{
 await page.goto('/index.html#guide');
 const root=page.locator('#main .ns-guide6[data-guide="list"]');
 await expect(root).toBeVisible();
 await expect(root.locator('.ns-guide6-journal__page')).toHaveCount(2);
 await expect(root.locator('.ns-guide6-journal__ring')).toHaveCount(8);
 await expect(root.locator('.ns-guide6-journal__tab')).toHaveCount(5);
 await expect(root.locator('.ns-guide6-collection')).toHaveCount(4);
 await expect(root.locator('.ns-guide6-records')).toBeVisible();
 await expect(root.locator('.ns-guide6-quick-card')).toHaveAttribute('href','#guide/urge-pause');
 await expect(root.locator('[data-guide-action="export"]')).toBeVisible();
 await expect(root.locator('.ns-guide6-primary').first()).toHaveAttribute('href','#guide/new');
 await expect(root.locator('.ns-guide6-empty')).toContainText('No entries here yet.');
 const panel=await root.locator('.ns-guide6-journal__book').evaluate(el=>getComputedStyle(el).display);
 expect(panel).toBe('grid');
 const sheet=await root.locator('.ns-guide6-journal__page--left').evaluate(el=>getComputedStyle(el).backgroundImage);
 expect(sheet).not.toBe('none');
});
test('Journal tabs open live collections, not fake page graphics',async({page})=>{
 await page.goto('/index.html#guide');
 await page.locator('.ns-guide6-journal__tab--patterns').click();
 await expect(page).toHaveURL(/#guide\/patterns$/);
 await expect(page.locator('.ns-guide6-journal__tab--patterns')).toHaveAttribute('aria-current','page');
 await expect(page.locator('.ns-guide6-collection--forest')).toHaveAttribute('aria-current','page');
 await expect(page.locator('#ns-guide6-records-title')).toContainText('Patterns I’ve noticed');
 await page.locator('.ns-guide6-journal__tab--overview').click();
 await expect(page).toHaveURL(/#guide$/);
});
test('Writing and explicitly saving a note still drives real Field Guide content',async({page})=>{
 await page.goto('/index.html#guide');
 await page.locator('.ns-guide6-hero__actions a[href="#guide/new"]').click();
 await expect(page).toHaveURL(/#guide\/new$/);
 await page.locator('#ns-guide6-title').fill('A small helpful observation');
 await page.locator('#ns-guide6-category').selectOption('helps');
 await page.locator('#ns-guide6-text').fill('Going outside for a few minutes helped today.');
 await page.locator('button[type="submit"]').click();
 await expect(page).toHaveURL(/#guide\/entry\//);
 await expect(page.locator('.ns-guide6-notebook__text')).toContainText('Going outside for a few minutes helped today.');
 await page.goto('/index.html#guide');
 await expect(page.locator('.ns-guide6-count')).toContainText('1 entry');
 await expect(page.locator('.ns-guide6-entry')).toContainText('A small helpful observation');
 await expect(page.locator('.ns-guide6-collection--meadow')).toContainText('1 entry');
});
test('Mobile Field Guide shows readable stacked pages and horizontally scrollable section tabs',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/index.html#guide');
 const root=page.locator('.ns-guide6-journal');
 await expect(root.locator('.ns-guide6-journal__page')).toHaveCount(2);
 await expect(root.locator('.ns-guide6-journal__tabs')).toBeVisible();
 await expect(root.locator('.ns-guide6-journal__binding')).toBeHidden();
 await expect(root.locator('.ns-guide6-collection')).toHaveCount(4);
 await expect(root.locator('.ns-guide6-quick-card')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(5);
});
test('Field Guide journal assets load and do not change the Learn or Blog page',async({page})=>{
 await page.goto('/index.html#guide');
 for(const name of ['paper-hills','mountain-stamp']){
  const res=await page.request.get('/field-guide-art/'+name+'.svg');
  expect(res.status(),name).toBe(200);
  expect(await res.text()).toContain('<svg');
 }
 await page.goto('/index.html#learn');
 await expect(page.locator('.ns-courses-hub')).toBeVisible();
 await expect(page.locator('.ns-guide6-journal')).toHaveCount(0);
 await page.goto('/index.html#post/c045368d-ce46-416f-8ce7-5245e0e30199');
 await expect(page.locator('.ns-blog-notebook')).toBeVisible();
 await expect(page.locator('.ns-guide6-journal')).toHaveCount(0);
});
