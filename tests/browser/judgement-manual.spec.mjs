import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const load=async page=>{
 await page.goto('/index.html#workbook-topic/social-anxiety');
 await expect(page.locator('.ns-judge')).toBeVisible();
 await expect(page.locator('.ns-judge h1')).toHaveText('Fear of being judged by others');
};

test('fear of judgement opens one readable manual and keeps in-page navigation inside SPA',async({page})=>{
 await load(page);
 await expect(page.locator('.ns-judge-reading')).toContainText('particular kind of loneliness');
 await expect(page.locator('[data-nj-open]')).toHaveCount(5);
 await expect(page.locator('.ns-pick-filters')).toHaveCount(0);
 const url=page.url();
 await page.locator('[data-nj-jump="ns-judge-start"]').click();
 expect(page.url()).toBe(url);
 await expect(page.locator('#ns-judge-start-title')).toBeFocused();
 await page.locator('[data-nj-open="map"]').click();
 await expect(page.locator('#ns-judge-work')).toBeVisible();
 await expect(page.locator('[data-nj-question]')).toBeVisible();
 await expect(page.locator('.ns-judge-progress')).toContainText('Question 1 of 8');
});

test('a report of real mistreatment recommends safety and deliberate saved notes survive reload',async({page})=>{
 await load(page);
 await page.locator('[data-nj-open="map"]').click();
 await page.locator('[data-nj-question] textarea').fill('Somebody mocked me at work');
 await page.locator('[data-nj-next]').click();
 await page.locator('input[name="answer"][value="stupid"]').check();
 await page.locator('[data-nj-next]').click();
 await page.locator('[data-nj-next]').click(); // optional meaning
 await page.locator('input[name="answer"][value="quiet"]').check();
 await page.locator('[data-nj-next]').click();
 await page.locator('[data-nj-next]').click(); // optional cost
 await page.locator('input[name="answer"][value="yes"]').check();
 await page.locator('[data-nj-next]').click();
 await page.locator('[data-nj-question] textarea').fill('I wanted to participate without being mocked');
 await page.locator('[data-nj-next]').click();
 await page.locator('[data-nj-next]').click(); // optional next step
 await expect(page.locator('.ns-judge-next')).toContainText('When the judgement is real');
 await page.locator('[data-nj-save]').click();
 await expect(page.locator('[data-nj-storage-status]')).toContainText('Saved in this browser');
 await page.reload();
 await expect(page.locator('[data-nj-resume]')).toBeVisible();
 await page.locator('[data-nj-resume]').click();
 await expect(page.locator('.ns-judge-summary')).toContainText('Somebody mocked me at work');
 await page.locator('#ns-judge-start').scrollIntoViewIfNeeded();
 await page.locator('[data-nj-remove]').click();
 await expect(page.locator('[data-nj-resume]')).toHaveCount(0);
});

test('mobile manual and question screen have no serious automated accessibility issues',async({page})=>{
 await load(page);
 let audit=await new AxeBuilder({page}).include('.ns-judge').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 const serious=violations=>violations.filter(x=>['serious','critical'].includes(x.impact)).map(x=>({id:x.id,impact:x.impact,targets:x.nodes.map(n=>n.target).slice(0,5)}));
 expect(serious(audit.violations)).toEqual([]);
 await page.locator('[data-nj-open="map"]').click();
 audit=await new AxeBuilder({page}).include('.ns-judge').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(serious(audit.violations)).toEqual([]);
 const box=await page.locator('.ns-judge').boundingBox();
 expect(box.x).toBeGreaterThanOrEqual(0);
 expect(box.x+box.width).toBeLessThanOrEqual((page.viewportSize()?.width||1366)+1);
});
