import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Learn is a dedicated page directly under Feed in sidebar and mobile navigation',async({page})=>{
 await page.goto('/index.html#learn');
 await expect(page.locator('.ns-courses-hub')).toBeVisible();
 await expect(page.locator('#ns-courses-title')).toHaveText('Learn');
 const links=page.locator('.app-nav-primary a');
 await expect(links.nth(3)).toHaveAttribute('href','#discussion');
 await expect(links.nth(4)).toHaveAttribute('href','#learn');
 await expect(links.nth(4)).toHaveAttribute('aria-current','page');
 await expect(page.locator('.app-bottom-nav a').last()).toHaveAttribute('href','#learn');
 await expect(page.locator('.ns-courses-feature')).toBeVisible();
 await expect(page.locator('.ns-course-card')).toHaveCount(10);
 await expect(page.locator('.ns-courses-availability')).toContainText('not lessons you can start yet');
 await expect(page.locator('.ns-learn-path,.ns-lesson,.learn-door-debates,.learn-door-crash')).toHaveCount(0);
});
test('Learn visual cards use real large images and all planned content is visibly labelled',async({page})=>{
 await page.goto('/index.html#learn');
 const art=page.locator('.ns-course-card__landscape');
 await expect(art).toHaveCount(10);
 const imagesLoaded=await art.evaluateAll(nodes=>nodes.every(img=>img.complete&&img.naturalWidth>0));
 expect(imagesLoaded).toBe(true);
 await expect(page.locator('.ns-courses-feature__visual')).toBeVisible();
 await expect(page.locator('.ns-course-card__status')).toHaveCount(10);
 await expect(page.getByText('Start course',{exact:true})).toHaveCount(0);
});
test('Browse courses opens the same clean Courses view, never the old full curriculum',async({page})=>{
 await page.goto('/index.html#learn');
 await page.locator('.ns-courses-button').click();
 await expect(page).toHaveURL(/#learn\/courses$/);
 await expect(page.locator('#ns-course-catalogue-title')).toHaveText('Courses');
 await expect(page.locator('.ns-course-card')).toHaveCount(10);
 await expect(page.getByText('Four quarters')).toHaveCount(0);
 await expect(page.getByText('Crash Courses')).toHaveCount(0);
 await page.goto('/index.html#library/courses');
 await expect(page).toHaveURL(/#learn\/courses$/);
});
test('Old demo and themed path links retire into the Learn course hub',async({page})=>{
 for(const obsolete of ['#learn/path/forest','#learn/lesson/observation-or-story','#learn/crash','#learn/debates','#library/debates']){
  await page.goto('/index.html'+obsolete);
  await expect(page).toHaveURL(/#learn$/);
  await expect(page.locator('.ns-courses-hub')).toBeVisible();
 }
});
test('Learn remains readable on mobile, with five main destinations and no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/index.html#learn');
 await expect(page.locator('.ns-courses-hub')).toBeVisible();
 await expect(page.locator('.app-bottom-nav a')).toHaveCount(5);
 await expect(page.locator('.ns-courses-feature')).toBeVisible();
 await expect(page.locator('.ns-course-card')).toHaveCount(10);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+3)).toBe(false);
});
test('Existing published blog link remains functional and uses the notebook template',async({page})=>{
 await page.goto('/index.html#post/c045368d-ce46-416f-8ce7-5245e0e30199');
 await expect(page.locator('.ns-blog-notebook')).toBeVisible();
 await expect(page.locator('.ns-courses-hub')).toHaveCount(0);
});
test('Learn course hub contains no serious or critical automated accessibility violations',async({page})=>{
 await page.goto('/index.html#learn');
 const results=await new AxeBuilder({page}).include('.ns-courses-hub').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(results.violations.filter(item=>['serious','critical'].includes(item.impact)),JSON.stringify(results.violations,null,2)).toEqual([]);
});
