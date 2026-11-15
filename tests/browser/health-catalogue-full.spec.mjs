import {test,expect} from '@playwright/test';
import {HEALTH_GROUPS,HEALTH_BY_ID} from '../../ns-health-manual-data.mjs';

const open=async(page,id)=>{
 await page.goto('/index.html#problem/'+id);
 await expect(page.locator('.ns-mood h1')).toBeVisible();
};

test('all 50 body and sexuality topics render the completed field-guide experience',async({page})=>{
 for(const id of [...HEALTH_GROUPS.body,...HEALTH_GROUPS.sexuality]){
  await open(page,id);
  await expect(page.locator('.ns-mood h1')).toHaveText(HEALTH_BY_ID.get(id).title);
  await expect(page.locator('.ns-mood-read>p')).toHaveCount(10);
  await expect(page.locator('.ns-mood-route-list button')).toHaveCount(4);
  await expect(page.locator('.ns-mood-cycle')).toHaveCount(0);
  await expect(page.locator('.ns-mood-why')).toBeVisible();
  await expect(page.locator('.ns-judge-back a').first()).toHaveAttribute('href','#navigate/area/health/'+HEALTH_BY_ID.get(id).domain);
 }
});

test('health topic popups show all 20 useful suggestions with no repeated prefixed text',async({page})=>{
 for(const id of ['sleep','pain','sensory','insomnia','purging-urges','sexual-performance-anxiety','pregnancy-loss','menopause-transition','bodily-autonomy']){
  await open(page,id);
  await page.locator('[data-mood-open]').first().click();
  for(let i=0;i<4&&!await page.locator('[data-mood-idea]').count();i++)await page.locator('[data-mood-next]').click();
  await expect(page.locator('[data-mood-idea]')).toBeVisible();
  await page.locator('[data-mood-idea]').click();
  await expect(page.locator('[data-mood-ideas]')).toBeVisible();
  const items=page.locator('[data-mood-ideas-list] li');
  await expect(items).toHaveCount(20);
  const entries=await items.allTextContents();
  for(const entry of entries){
   expect(entry.length).toBeGreaterThan(24);
   expect(entry).not.toMatch(/^(Ask a trusted person about the practical concern|Talk this through with someone who listens|Request support for this possible step|Consider whether this is relevant to your situation)/i);
  }
  await page.locator('[data-mood-ideas-close]').click();
 }
});

test('body and reproductive wellbeing browse pages use short real-world situations',async({page})=>{
 for(const id of ['sleep-onset','physical-panic','low-desire','fertility-uncertainty']){
  await open(page,id);
  await page.locator('[data-mood-why-toggle]').click();
  await page.locator('[data-mood-why-browse]').click();
  await expect(page.locator('[data-mood-why-count]')).toContainText('16 matching examples');
  await expect(page.locator('[data-mood-why-results] button')).toHaveCount(10);
  await page.locator('[data-mood-why-more]').click();
  await expect(page.locator('[data-mood-why-results] button')).toHaveCount(16);
 }
});

test('private reproductive journals do not offer automatic on-device saving',async({page})=>{
 for(const id of ['sexual-boundary-uncertainty','pregnancy-loss','sexual-health-anxiety']){
  await open(page,id);
  await page.locator('[data-mood-open]').first().click();
  for(let i=0;i<4;i++)await page.locator('[data-mood-next]').click();
  await expect(page.locator('[data-mood-save]')).toHaveCount(0);
  await expect(page.locator('[data-mood-screen]')).toContainText('not stored');
 }
});
