import {test,expect} from '@playwright/test';
test('Navigation Console retains all live areas with calming visual background',async({page})=>{
 await page.goto('/index.html#navigate');
 await expect(page.locator('.ns-needs')).toBeVisible();
 await expect(page.locator('.ns-needs .ns-needs-hero')).toBeVisible();
 await expect(page.locator('.ns-needs-theme')).toHaveCount(11);
 const bg=await page.locator('.ns-needs-hero').evaluate(e=>getComputedStyle(e).backgroundImage);
 expect(bg).toContain('gradient');
 await expect(page.locator('#needs-problem-search')).toBeVisible();
});
test('An actual navigation topic workbook keeps all interaction while using quieter paper',async({page})=>{
 await page.goto('/index.html#workbook-topic/overthinking');
 await expect(page.locator('.ns-wb-wrap')).toBeVisible();
 await expect(page.locator('.ns-wb-chapter')).not.toHaveCount(0);
 const radius=await page.locator('.ns-wb-wrap').evaluate(e=>getComputedStyle(e).borderRadius);
 expect(radius).not.toBe('0px');
 await expect(page.locator('.ns-wb-sources')).toBeVisible();
});
test('A specific distress-aware topic guide retains reading, worksheets and safeguards',async({page})=>{
 await page.goto('/index.html#problem/social-anxiety');
 await expect(page.locator('.ns-judge')).toBeVisible();
 await expect(page.locator('.ns-judge-hero')).toBeVisible();
 await expect(page.locator('.ns-judge-start')).toBeVisible();
 await expect(page.locator('.ns-judge-now')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+3)).toBe(false);
});
test('The original Hello blog keeps its notebook and no longer shows reading percentage',async({page})=>{
 await page.goto('/index.html#post/c045368d-ce46-416f-8ce7-5245e0e30199');
 await expect(page.locator('.ns-blog-notebook')).toBeVisible();
 await expect(page.locator('.nb-contents-card')).toBeVisible();
 await expect(page.locator('.nb-read-next-card')).toBeVisible();
 await expect(page.locator('.nb-progress-card')).toHaveCount(0);
 await expect(page.locator('#nb-reading-percentage')).toHaveCount(0);
});
test('Staff publication page has the visual editor stylesheet',async({page})=>{
 await page.goto('/staff.html');
 await expect(page.locator('.creator-login')).toBeVisible();
 expect(await page.evaluate(()=>[...document.styleSheets].some(s=>s.href?.includes('studio-quiet.css')))).toBe(true);
});
