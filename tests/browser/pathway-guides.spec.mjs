import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const go=async(page,hash)=>{await page.goto('/index.html#'+hash);await expect(page.locator('#main')).toBeVisible();};
const open=async page=>{
 await expect(page.locator('button[data-path-open]')).toHaveCount(1);
 await page.locator('button[data-path-open]').click();
 const modal=page.locator('dialog[data-path-guide-dialog]');
 await expect(modal).toBeVisible();
 await expect(modal.locator('details.ns-guidebook-lane')).toHaveCount(5);
 await expect(modal.locator('button[data-path-pin]')).toHaveCount(5);
 return modal;
};
test('processing guide stays accessible while moving through private prompts',async({page})=>{
 await go(page,'navigate/process');
 await page.locator('a[href="#route-activity/process/grief/process-grief"]').click();
 await expect(page.getByRole('heading',{name:'Make room for grief or loss'})).toBeVisible();
 const modal=await open(page);
 await expect(modal.locator('h2')).toContainText('I am dealing with grief or loss');
 await modal.locator('[data-path-jump="acceptance"]').click();
 await expect(modal.locator('#pathbook-acceptance')).toHaveAttribute('open','');
 await expect(page).toHaveURL(/#route-activity\/process\/grief\/process-grief$/);
 await modal.locator('[data-path-pin="3"]').click();
 await expect(page.locator('.ns-steady-pinned')).toBeVisible();
 await page.locator('#ns-process-text').fill('A temporary, private sentence.');
 await page.locator('[data-process-next]').click();
 await expect(page.locator('button[data-path-open]')).toHaveCount(1);
 await page.locator('[data-process-prev]').click();
 await expect(page.locator('#ns-process-text')).toHaveValue('A temporary, private sentence.');
 await open(page);
 await page.keyboard.press('Escape');
 await expect(page.locator('dialog[data-path-guide-dialog]')).not.toBeVisible();
 await expect(page.locator('[data-path-open]')).toBeFocused();
});
test('understand and action tools carry the correct contextual guide rather than a generic one',async({page})=>{
 await go(page,'navigate/understand');
 await page.locator('a[href="#route-tool/understand/pattern/pattern-map"]').click();
 let modal=await open(page);
 await expect(modal.locator('h2')).toContainText('A pattern keeps repeating');
 await modal.locator('[data-path-close]').click();
 await go(page,'navigate/act');
 await page.locator('a[href="#route-tool/act/environment/environment-design"]').click();
 modal=await open(page);
 await expect(modal.locator('h2')).toContainText('My circumstances or environment get in the way');
 await expect(modal.locator('.ns-guidebook-sources a').first()).toHaveAttribute('href',/^https:/);
});
test('relationship safety and named topics retain distinct cautions and guides',async({page})=>{
 await go(page,'navigate/relate');
 await page.locator('a[href="#route-activity/relate/unsafe/support-safety"]').click();
 await expect(page.getByRole('heading',{name:'Support and safety come first'})).toBeVisible();
 let modal=await open(page);
 await expect(modal.locator('.ns-guidebook-caution')).toContainText('Do not confront');
 await modal.locator('[data-path-close]').click();
 await go(page,'navigate/learn');
 await page.locator('a[href="#route-topic/learn/checking/checking"]').click();
 modal=await open(page);
 await expect(modal.locator('.ns-guidebook-caution')).toContainText('exposure and response prevention');
});
test('atlas and unsure routes have meaningful contextual guidance',async({page})=>{
 await go(page,'navigate/learn');
 await page.locator('a[href="#route-atlas/learn/browse"]').click();
 let modal=await open(page);
 await expect(modal.locator('h2')).toContainText('Browse all psychological difficulties');
 await modal.locator('[data-path-close]').click();
 await expect(page.locator('#needs-topic-search')).toBeVisible();
 await go(page,'navigate/unsure');
 await page.locator('a[href="#route-tool/unsure/clarity/emotion-check-in"]').click();
 modal=await open(page);
 await expect(modal.locator('h2')).toContainText('I would like more clarity');
});
test('other pathway guides fit a narrow screen and avoid serious automated accessibility violations',async({page})=>{
 for(const route of ['navigate/process','route-activity/process/feel/process-feel','route-tool/act/decision/decision-map']){
  await go(page,route);
  const result=await new AxeBuilder({page}).include('#main').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  expect(result.violations.filter(x=>['serious','critical'].includes(x.impact)),
    JSON.stringify(result.violations.map(v=>({id:v.id,impact:v.impact})),null,2)).toEqual([]);
 }
 await go(page,'route-activity/process/feel/process-feel');
 const modal=await open(page);
 const bounds=await modal.evaluate(el=>({x:el.getBoundingClientRect().x,right:el.getBoundingClientRect().right,width:innerWidth}));
 expect(bounds.x).toBeGreaterThanOrEqual(-2);
 expect(bounds.right).toBeLessThanOrEqual(bounds.width+2);
});
