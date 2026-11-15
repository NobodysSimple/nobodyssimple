import {test,expect} from '@playwright/test';

const hello='c045368d-ce46-416f-8ce7-5245e0e30199';
test('Home renders the illustrated scrapbook without replacing real features',async({page})=>{
 await page.goto('/index.html#home');
 const home=page.locator('#main > .ns-home-refined');
 await expect(home).toBeVisible();
 await expect(home.locator('.ns-home-hero')).toBeVisible();
 await expect(home.locator('.ns-home-primary')).toHaveAttribute('href','#navigate');
 await expect(home.locator('.ns-home-compass')).toHaveAttribute('href','#compass');
 await expect(home.locator('.ns-home-wisbody')).toBeVisible();
 await expect(home.locator('.home-latest-track')).toBeVisible();
 await expect(home.locator('.ns-home-shortcut')).toHaveAttribute('href','#community');
 await expect(home.locator('.ns-culture-atlas')).toBeVisible();
 const layers=await page.locator('#main').evaluate(el=>getComputedStyle(el).backgroundImage);
 expect(layers).toContain('home-meadow.svg');
 const art=await page.request.get('/home-art/home-meadow.svg');
 expect(art.status()).toBe(200);
 expect(await art.text()).toContain('<svg');
 const paper=await home.locator('.ns-home-hero').evaluate(el=>getComputedStyle(el).boxShadow);
 expect(paper).not.toBe('none');
});
test('Home sections remain in order and Culture Atlas stays interactive',async({page})=>{
 await page.goto('/index.html#home');
 const positions=await page.locator('#main > .ns-home-refined').evaluate(root=>{
  const selectors=['.ns-home-hero','.ns-home-wisbody','.ns-home-latest','.ns-home-shortcuts','#ns-home-culture-map'];
  return selectors.map(selector=>Array.from(root.children).indexOf(root.querySelector(selector)));
 });
 expect(positions.every(n=>n>=0)).toBe(true);
 expect(positions).toEqual([...positions].sort((a,b)=>a-b));
 const atlas=page.locator('.ns-home-refined .ns-culture-atlas');
 await expect(atlas.locator('.ns-culture-map')).toBeVisible();
 await expect(atlas.locator('.ns-culture-random').first()).toBeEnabled();
 await expect(atlas.locator('select').first()).toBeVisible();
 await expect(atlas.locator('.ns-culture-reading')).toBeVisible();
 const latest=page.locator('.ns-home-refined .home-latest-card').first();
 if(await latest.count())await expect(latest).toHaveAttribute('href',/#post\//);
});
test('Home remains usable at phone width with all original actions and no horizontal scrolling',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/index.html#home');
 await expect(page.locator('.ns-home-hero')).toBeVisible();
 await expect(page.locator('.ns-home-primary')).toBeVisible();
 await expect(page.locator('.ns-home-compass')).toBeVisible();
 await expect(page.locator('.ns-home-wisbody')).toBeVisible();
 await expect(page.locator('.ns-culture-map')).toBeVisible();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
 expect(overflow).toBeLessThanOrEqual(5);
 const button=await page.locator('.ns-home-primary').boundingBox();
 expect(button.width).toBeGreaterThan(150);
 expect(button.x+button.width).toBeLessThanOrEqual(395);
});
test('Scrapbook styling is applied only to Home; Learn and Blog retain their designs',async({page})=>{
 await page.goto('/index.html#learn');
 await expect(page.locator('.ns-courses-hub')).toBeVisible();
 expect(await page.locator('#main').evaluate(el=>getComputedStyle(el).backgroundImage)).not.toContain('home-meadow.svg');
 await page.goto('/index.html#post/'+hello);
 await expect(page.locator('.ns-blog-notebook')).toBeVisible();
 expect(await page.locator('#main').evaluate(el=>getComputedStyle(el).backgroundImage)).not.toContain('home-meadow.svg');
});
