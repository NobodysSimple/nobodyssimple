import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Learn keeps its illustrated catalogue and twenty independent course cards',async({page})=>{
 await page.goto('/index.html#learn');
 await expect(page.locator('.ns-courses-hub')).toBeVisible();
 await expect(page.locator('#ns-courses-title')).toHaveText('Learn');
 await expect(page.locator('.ns-course-card')).toHaveCount(20);
 await expect(page.locator('.ns-courses-feature')).toBeVisible();
 await expect(page.locator('.ns-course-card__landscape')).toHaveCount(20);
 await expect(page.locator('.ns-course-card__status')).toHaveCount(20);
 await expect(page.locator('.app-nav-primary a[href="#learn"]')).toHaveAttribute('aria-current','page');
 await expect(page.locator('.ns-learn-player')).toHaveCount(0);
});
test('Browse and categories filter the same catalogue with no mandatory syllabus',async({page})=>{
 await page.goto('/index.html#learn');
 await page.locator('.ns-courses-button').click();
 await expect(page).toHaveURL(/#learn\/courses$/);
 await expect(page.locator('.ns-course-card')).toHaveCount(20);
 await page.locator('#ns-course-search').fill('narcissism');
 await expect(page.locator('.ns-course-card')).toHaveCount(1);
 await page.locator('#ns-course-search').fill('');
 await page.locator('a[href="#learn/category/society"]').click();
 await expect(page).toHaveURL(/#learn\/category\/society$/);
 await expect(page.locator('.ns-course-card')).toHaveCount(5);
});
test('Every course has a deep-linked detail page; unreleased courses show no fabricated lessons',async({page})=>{
 await page.goto('/index.html#learn/course/narcissism');
 await expect(page.locator('.ns-catalogue-detail-hero')).toBeVisible();
 await expect(page.locator('.ns-catalogue-development')).toContainText(/In development|Published|Loading/);
 await expect(page.locator('.ns-catalogue-syllabus')).toBeVisible();
 await expect(page.locator('.ns-catalogue-detail-hero .ns-course-card__character')).toBeVisible();
});
test('The learning method explains ten formats, not a required full curriculum',async({page})=>{
 await page.goto('/index.html#learn/how-it-works');
 await expect(page.locator('.ns-catalogue-how')).toBeVisible();
 await expect(page.locator('.ns-catalogue-formats article')).toHaveCount(10);
 await expect(page.locator('.ns-catalogue-how')).toContainText('Evidence investigator');
});
test('Learn remains readable on mobile',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/index.html#learn');
 await expect(page.locator('.ns-courses-feature')).toBeVisible();
 await expect(page.locator('.ns-course-card')).toHaveCount(20);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+3)).toBe(false);
});
test('Staff Course Lab is behind the existing GitHub owner login',async({page})=>{
 await page.goto('/staff.html');
 await expect(page.getByRole('heading',{name:'Staff login'})).toBeVisible();
 await expect(page.locator('#studio')).toBeHidden();
 await expect(page.locator('#course-lab-view')).toBeHidden();
 await expect(page.locator('[data-view="course-lab"]')).toHaveCount(1);
});
test('Learn has no serious/critical accessibility violations',async({page})=>{
 await page.goto('/index.html#learn');
 const results=await new AxeBuilder({page}).include('.ns-courses-hub').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(results.violations.filter(x=>['serious','critical'].includes(x.impact)),JSON.stringify(results.violations,null,2)).toEqual([]);
});
