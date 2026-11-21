import {test,expect} from '@playwright/test';
test('the complete contingent self-worth unit opens as a playable first course unit',async({page})=>{
 await page.goto('/index.html#learn/course/self-esteem');
 await expect(page.getByText('When your worth feels like it depends on something').first()).toBeVisible({timeout:30000});
 await expect(page.locator('a[href="#learn/lesson/self-esteem/csw-lesson-1"]')).toBeVisible();
 await page.goto('/index.html#learn/lesson/self-esteem/csw-lesson-1');
 await expect(page.locator('.csw-unit')).toBeVisible({timeout:30000});
 await expect(page.locator('.csw-heading h1')).toContainText('The rejection');
 await expect(page.getByText('Subject: Community Arts Funding Application')).toBeVisible();
 await page.locator('[data-reveal]').click();
 await expect(page.locator('.csw-feedback')).toBeVisible();
 await page.locator('[data-next]').click();
 await expect(page.locator('.csw-heading h1')).toContainText('The conversation');
 await expect(page.locator('.csw-message')).toHaveCount(1);
 await page.locator('[data-more-dialogue]').click();
 await expect(page.locator('.csw-message')).toHaveCount(2);
});
test('an authored choice reveals source-specific feedback and can be continued',async({page})=>{
 await page.goto('/index.html#learn/lesson/self-esteem/csw-lesson-8');
 await expect(page.locator('.csw-unit')).toBeVisible({timeout:30000});
 await page.locator('[data-next]').click();
 await expect(page.locator('.csw-choices input')).toHaveCount(3);
 await page.locator('input[name="csw-choice"][value="C"]').check();
 await page.locator('[data-check]').click();
 await expect(page.locator('.csw-feedback')).toContainText('exam');
});
