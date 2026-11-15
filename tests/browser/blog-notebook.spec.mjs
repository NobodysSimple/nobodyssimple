import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function openBlog(page){
 await page.goto('/index.html#library/blog');
 const posts=await page.evaluate(async()=>{
  const data=await fetch('content.json').then(r=>r.json());
  return data.posts.filter(p=>p.type==='blog'&&p.status==='published');
 });
 expect(posts.length).toBeGreaterThan(0);
 await page.goto('/index.html#post/'+encodeURIComponent(posts[0].id));
 await expect(page.locator('.ns-blog-notebook')).toBeVisible();
 return posts;
}
test('published blog article is a unique notebook with contents and reading progress',async({page})=>{
 await openBlog(page);
 await expect(page.locator('.ns-blog-paper #nb-article-title')).toBeVisible();
 await expect(page.locator('.nb-progress-track')).toHaveAttribute('role','progressbar');
 await expect(page.locator('.nb-contents-card')).toBeVisible();
 await expect(page.locator('.nb-read-next-card')).toBeVisible();
 await expect(page.locator('.nb-hero-image,.nb-hero-illustration')).toHaveCount(1);
 const anchors=await page.locator('#nb-contents-list a[data-nb-anchor]').count();
 expect(anchors).toBeGreaterThanOrEqual(2);
 await page.locator('#nb-article-end').scrollIntoViewIfNeeded();
 await expect.poll(async()=>Number(await page.locator('#nb-reading-track').getAttribute('aria-valuenow'))).toBeGreaterThan(0);
 await page.locator('#nb-contents-list a[data-nb-anchor="nb-story-start"]').click();
 await expect(page).toHaveURL(/#post\//);
});
test('blog reactions persist locally with no made-up popularity counts',async({page})=>{
 await openBlog(page);
 const helpful=page.locator('[data-nb-reaction="helpful"]');
 await helpful.click();
 await expect(helpful).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('#nb-interaction-status')).toContainText('on this device');
 await page.reload();
 await expect(page.locator('[data-nb-reaction="helpful"]')).toHaveAttribute('aria-pressed','true');
 await page.locator('[data-nb-reaction="helpful"]').click();
 await expect(page.locator('[data-nb-reaction="helpful"]')).toHaveAttribute('aria-pressed','false');
});
test('mobile notebook is readable without horizontal overflow and retains functional navigation',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await openBlog(page);
 const article=page.locator('.ns-blog-paper');
 await expect(article).toBeVisible();
 await expect(page.locator('#nb-contents-list')).toBeVisible();
 await expect(page.locator('[data-nb-reaction="relatable"]')).toBeVisible();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+3);
 expect(overflow).toBe(false);
});
test('non-blog published content does not adopt the notebook renderer',async({page})=>{
 await page.goto('/index.html#library');
 const other=await page.evaluate(async()=>{
  const data=await fetch('content.json').then(r=>r.json());
  return data.posts.find(p=>p.status==='published'&&p.type!=='blog'&&p.type!=='announcement')?.id;
 });
 test.skip(!other,'No non-blog published article to compare.');
 await page.goto('/index.html#post/'+encodeURIComponent(other));
 await expect(page.locator('.ns-blog-notebook')).toHaveCount(0);
 await expect(page.locator('.article')).toBeVisible();
});
test('notebook controls pass basic accessibility checks',async({page})=>{
 await openBlog(page);
 const audit=await new AxeBuilder({page}).include('.ns-blog-notebook').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(audit.violations.filter(v=>['serious','critical'].includes(v.impact)),JSON.stringify(audit.violations,null,2)).toEqual([]);
});
