import {test,expect} from '@playwright/test';

const helloId='c045368d-ce46-416f-8ce7-5245e0e30199';
test('existing Hello! post is the notebook test case, not the legacy article template',async({page})=>{
 await page.goto('/index.html#post/'+encodeURIComponent(helloId));
 const notebook=page.locator('.ns-blog-notebook');
 await expect(notebook).toBeVisible();
 await expect(notebook.locator('#nb-article-title')).toHaveText('Hello!');
 await expect(notebook.locator('.nb-progress-card')).toHaveCount(0);
 await expect(notebook.locator('.nb-contents-card')).toBeVisible();
 await expect(notebook.locator('.nb-read-next-card')).toBeVisible();
 await expect(notebook.locator('.nb-hero-image img')).toHaveAttribute('src','banner.png');
 await expect(notebook.locator('.ns-blog-body .block-image').first()).toBeVisible();
 await expect(notebook.locator('#nb-contents-list')).toContainText('Problems I see in modern psychology content');
 await expect(notebook.locator('#nb-contents-list')).toContainText('Why this matters in the age of AI');
 await expect(notebook.locator('#nb-contents-list')).toContainText('Where I want this to go');
 await expect(notebook.locator('.nb-related-list')).toContainText('Explore Wisbody');
 await expect(notebook.locator('[data-nb-reaction="helpful"]')).toBeVisible();
 const style=await notebook.locator('.ns-blog-paper').evaluate(e=>getComputedStyle(e).boxShadow);
 expect(style).not.toBe('none');
 const cssLoaded=await page.evaluate(()=>[...document.styleSheets].some(s=>s.href?.includes('ns-blog-notebook.css')));
 expect(cssLoaded).toBe(true);
});

test('Hello! new notebook stays usable on mobile with visible article content',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/index.html#post/'+encodeURIComponent(helloId));
 await expect(page.locator('.ns-blog-notebook .ns-blog-body')).toBeVisible();
 await expect(page.locator('#nb-contents-list')).toBeVisible();
 await expect(page.locator('.nb-response-bar')).toBeVisible();
 await expect(page.locator('[data-nb-reaction="helpful"]')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+3)).toBe(false);
});
