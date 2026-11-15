import {test,expect} from '@playwright/test';
import {ACCESS_BY_ID,ACCESS_GROUPS} from '../../ns-access-manual-data.mjs';

const open=async(page,id)=>{
 await page.goto('/index.html#problem/'+id);
 await expect(page.locator('.ns-mood h1')).toBeVisible();
};

test('both access subcatalogues use the established modern guide with correct return links',async({page})=>{
 for(const id of [
 'autism-understanding','adhd-understanding','neurodivergent-masking','autistic-shutdown',
 'rejection-sensitivity','tics-and-tourette','ableism','invisible-disability',
 'hearing-access','long-covid-experiences','medical-trauma','accessibility-advocacy'
 ]){
  await open(page,id);
  const g=ACCESS_BY_ID.get(id);
  await expect(page.locator('.ns-mood h1')).toHaveText(g.title);
  await expect(page.locator('.ns-mood-read>p')).toHaveCount(10);
  await expect(page.locator('.ns-mood-route-list button')).toHaveCount(4);
  await expect(page.locator('.ns-mood-cycle')).toHaveCount(0);
  await expect(page.locator('.ns-judge-back a').first()).toHaveAttribute('href','#navigate/area/access/'+g.domain);
  await expect(page.locator('.ns-mood-why')).toBeVisible();
 }
});

test('recognisable situation cards can be browsed and expanded',async({page})=>{
 for(const id of ['autism-understanding','neurodivergent-masking','long-covid-experiences']){
  await open(page,id);
  await page.locator('[data-mood-why-toggle]').click();
  await page.locator('[data-mood-why-browse]').click();
  await expect(page.locator('[data-mood-why-count]')).toContainText('16 matching examples');
  await expect(page.locator('[data-mood-why-results] button')).toHaveCount(10);
  await page.locator('[data-mood-why-more]').click();
  await expect(page.locator('[data-mood-why-results] button')).toHaveCount(16);
  const labels=await page.locator('[data-mood-why-results] button strong').allTextContents();
  expect(new Set(labels).size).toBe(16);
  expect(labels.every(label=>label.length<116)).toBe(true);
 }
});

test('each access popup exposes twenty specific tips, without stock prefixes',async({page})=>{
 for(const id of ['executive-dysfunction','neurodivergent-accommodations','medical-trauma','disability-benefits-pressure']){
  await open(page,id);
  await page.locator('[data-mood-open="path-0"]').click();
  for(let i=0;i<4&&!await page.locator('[data-mood-idea]').count();i++)await page.locator('[data-mood-next]').click();
  await page.locator('[data-mood-idea]').click();
  const items=page.locator('[data-mood-ideas-list] li');
  await expect(items).toHaveCount(20);
  const suggestions=await items.allTextContents();
  for(const item of suggestions){
   expect(item).not.toMatch(/^(Ask a trusted person about the practical concern|Talk this through with someone who listens|Request support for this possible step|Consider whether this is relevant)/i);
   expect(item.length).toBeGreaterThan(19);
  }
 }
});

test('sensitive disability journals do not offer persistent local saving',async({page})=>{
 for(const id of ['medical-trauma','care-dependence-autonomy','disability-benefits-pressure']){
  await open(page,id);
  await page.locator('[data-mood-open="path-0"]').click();
  for(let i=0;i<4;i++)await page.locator('[data-mood-next]').click();
  await expect(page.locator('[data-mood-save]')).toHaveCount(0);
  await expect(page.locator('[data-mood-screen]')).toContainText('not stored');
 }
});

test('the neuro and disability catalogue subsections are navigable',async({page})=>{
 for(const [domain,count] of [['neuro',23],['disability',19]]){
  await page.goto('/index.html#navigate/area/access/'+domain);
  await expect(page.locator('.ns-needs')).toBeVisible();
  await expect(page.locator('a[href^="#problem/"]')).toHaveCount(count);
 }
});
