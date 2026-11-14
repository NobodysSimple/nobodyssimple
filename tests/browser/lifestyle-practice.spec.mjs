import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Lifestyle shows identity onboarding then a daily, understandable skill practice',async({page})=>{
 await page.goto('/index.html#lifestyle');
 await expect(page.locator('#lifestyle-deed-title')).toHaveText('Today’s Practice');
 await expect(page.locator('.life-practice-onboarding')).toBeVisible();
 await expect(page.locator('[data-practice-identity]')).toHaveCount(8);
 await page.locator('[data-practice-identity="self-trusting"]').click();
 await expect(page.locator('.life-practice-persona')).toContainText('More self-trusting');
 await expect(page.locator('.life-practice-task')).not.toBeEmpty();
 await expect(page.locator('.life-practice-progress')).toContainText('0 practices recorded');
 await page.locator('[data-practice-done]').click();
 await expect(page.locator('.life-practice-complete')).toContainText('+1 practice recorded');
 await expect(page.locator('.life-practice-progress')).toContainText('1 practice recorded');
 await page.reload();
 await expect(page.locator('.life-practice-complete')).toContainText('practised this skill today');
 await page.locator('[data-practice-undo]').click();
 await expect(page.locator('[data-practice-done]')).toBeVisible();
 await expect(page.locator('.life-practice-progress')).toContainText('0 practices recorded');
});

test('skill selection, difficulty and no-penalty skipping stay usable on narrow screens',async({page})=>{
 await page.goto('/index.html#lifestyle');
 await page.locator('[data-practice-identity="courageous"]').click();
 await page.locator('.life-practice-custom summary').click();
 await expect(page.locator('.life-practice-skills-field')).toBeVisible();
 await page.locator('[data-practice-skill="boundaries"]').uncheck();
 await expect(page.locator('.life-practice-skills-field')).toBeVisible();
 await page.locator('[data-practice-skill="self-trust"]').check();
 await expect(page.locator('.life-practice-focus button')).toHaveCount(3);
 await page.locator('.life-practice-levels summary').click();
 await page.locator('[data-practice-level="1"]').click();
 await expect(page.locator('.life-practice-tags')).toContainText('Practice level 1');
 await page.locator('[data-practice-pause]').click();
 await expect(page.locator('.life-practice-complete')).toContainText('Taking today off');
 await page.reload();
 await expect(page.locator('.life-practice-complete')).toContainText('Taking today off');
 await page.locator('[data-practice-resume]').click();
 await expect(page.locator('[data-practice-done]')).toBeVisible();
 const horizontalOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
 expect(horizontalOverflow).toBe(false);
});

test('a kindness alternative is explicitly tied to communication, gratitude or compassion',async({page})=>{
 await page.goto('/index.html#lifestyle');
 await page.locator('[data-practice-identity="compassionate"]').click();
 await page.locator('[data-practice-focus="compassion"]').click();
 await page.locator('[data-practice-kindness]').click();
 await expect(page.locator('.life-practice-action')).toContainText('AN ACT FOR SOMEONE ELSE');
 await page.locator('[data-practice-done]').click();
 await expect(page.locator('.life-practice-complete')).toContainText('Compassion');
});

test('Today’s Practice has no serious or critical automated accessibility violations',async({page})=>{
 await page.goto('/index.html#lifestyle');
 await page.locator('[data-practice-identity="grounded"]').click();
 const report=await new AxeBuilder({page}).include('#lifestyle-deed').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(report.violations.filter(v=>['serious','critical'].includes(v.impact)),
 JSON.stringify(report.violations,null,2)).toEqual([]);
});
