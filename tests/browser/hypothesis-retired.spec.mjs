import {test,expect} from '@playwright/test';

test('old hypothesis URLs return to Home instead of opening the retired tool',async({page})=>{
 await page.goto('/index.html#hypothesis');
 await expect.poll(()=>page.evaluate(()=>location.hash)).toBe('#home');
 await expect(page.locator('[data-hypothesis-generator]')).toHaveCount(0);
 await expect(page).toHaveTitle(/Nobody’s Simple/);
});

test('deep links to the retired hypothesis experience also return to Home',async({page})=>{
 await page.goto('/index.html#hypothesis/relationships');
 await expect.poll(()=>page.evaluate(()=>location.hash)).toBe('#home');
 await expect(page.locator('[data-hypothesis-generator]')).toHaveCount(0);
});

test('there are no links or buttons exposing the retired hypothesis route on Home',async({page})=>{
 await page.goto('/index.html#home');
 await expect(page.locator('a[href^="#hypothesis"],button[data-hypo-track],button[data-hypo-domain-start]')).toHaveCount(0);
 await expect(page.locator('[data-hypothesis-generator]')).toHaveCount(0);
});
