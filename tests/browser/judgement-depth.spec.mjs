import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const enter=async page=>{
 await page.goto('/index.html#workbook-topic/social-anxiety');
 await expect(page.locator('.ns-depth')).toBeVisible();
};
test('Understand Why is placed after quick help and hidden until opened',async({page})=>{
 await enter(page);
 const lastQuick=page.locator('#ns-judge-now'),section=page.locator('.ns-depth');
 const quickRect=await lastQuick.boundingBox(),sectionRect=await section.boundingBox();
 expect(sectionRect.y).toBeGreaterThan(quickRect.y);
 await expect(page.locator('[data-depth-body]')).toBeHidden();
 await page.locator('[data-depth-toggle]').click();
 await expect(page.locator('[data-depth-body]')).toBeVisible();
 await expect(page.locator('.ns-depth-chain li')).toHaveCount(11);
 await expect(page.locator('[data-depth-toggle]')).toHaveAttribute('aria-expanded','true');
});
test('84 examples can be searched, filtered and explored as connected paths',async({page})=>{
 await enter(page);
 await page.locator('[data-depth-toggle]').click();
 await page.locator('[data-depth-browse]').click();
 await expect(page.locator('[data-depth-count]')).toContainText('84 matching examples');
 await expect(page.locator('.ns-depth-result')).toHaveCount(12);
 await page.locator('[data-depth-search]').fill('apologised');
 await expect(page.locator('.ns-depth-result').first()).toBeVisible();
 await page.locator('[data-depth-search]').fill('');
 await page.locator('[data-depth-root="safety"]').click();
 await expect(page.locator('[data-depth-root="safety"]')).toHaveAttribute('aria-pressed','true');
 await page.locator('.ns-depth-result').first().click();
 await expect(page.locator('[data-depth-heading]')).not.toBeEmpty();
 await expect(page.locator('.ns-depth-chain li')).toHaveCount(11);
 await expect(page.locator('.ns-depth-related button').first()).toBeVisible();
});
test('the personal dig is free-written and can end early without forced origins',async({page})=>{
 await enter(page);
 await page.locator('[data-depth-toggle]').click();
 await page.locator('[data-depth-start="blank"]').click();
 await expect(page.locator('[data-depth-editor] textarea')).toBeVisible();
 await page.locator('[data-depth-editor] textarea').fill('My colleague looked away while I was talking');
 await page.locator('[data-depth-next]').click();
 await page.locator('[data-depth-editor] textarea').fill('They must think I am boring');
 await page.locator('[data-depth-finish]').click();
 await expect(page.locator('[data-depth-editor]')).toContainText('My colleague looked away while I was talking');
 await expect(page.locator('[data-depth-editor]')).toContainText('They must think I am boring');
 await expect(page.locator('[data-depth-editor]')).toContainText('not automatically saved or sent');
});
test('opened map and browser have no serious or critical WCAG errors',async({page})=>{
 await enter(page);
 await page.locator('[data-depth-toggle]').click();
 await page.locator('[data-depth-browse]').click();
 const audit=await new AxeBuilder({page}).include('.ns-depth').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(audit.violations.filter(v=>['serious','critical'].includes(v.impact)).map(v=>v.id)).toEqual([]);
});
