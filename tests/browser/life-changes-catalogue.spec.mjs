import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {CHANGES_GROUPS,CHANGES_BY_ID} from '../../ns-changes-guide-data.mjs';

const examples={change:'grief',trauma:'trauma-reminders',lifespan:'new-parent-identity',growth:'living-by-values'};
const open=async(page,id,route='problem')=>{
 await page.goto('/index.html#'+route+'/'+id);
 await expect(page.locator('.ns-mood h1')).toBeVisible();
};
test('representative pages across all four Life changes subcatalogues open in the same field-guide layout',async({page})=>{
 for(const [section,id] of Object.entries(examples)){
  await open(page,id,'workbook-topic');
  const g=CHANGES_BY_ID.get(id);
  await expect(page.locator('.ns-mood h1')).toHaveText(g.title);
  await expect(page.locator('.ns-mood-read > p')).toHaveCount(10);
  await expect(page.locator('.ns-mood-route-list button')).toHaveCount(4);
  await expect(page.locator('.ns-judge-back a').first()).toHaveAttribute('href','#navigate/area/changes/'+section);
 }
});
test('all 49 topics remain reachable through their original subsection navigation',async({page})=>{
 for(const [domain,ids] of Object.entries(CHANGES_GROUPS)){
  await page.goto('/index.html#navigate/area/changes/'+domain);
  await expect(page.locator('.ns-needs-panel')).toBeVisible();
  await expect(page.locator('.ns-needs-panel .ns-needs-filter-count')).toContainText(ids.length+' topics');
  const links=page.locator('a[href^="#workbook-topic/"]');
  await expect(links).toHaveCount(ids.length);
 }
});
test('grief journals use the established interactive questions and optional ideas',async({page})=>{
 await open(page,'grief');
 await page.locator('[data-mood-open="path-0"]').click();
 await expect(page.locator('[data-mood-answer]')).toBeVisible();
 await expect(page.locator('[data-mood-screen]')).toContainText('What happened in your own circumstances');
 for(let i=0;i<3;i++)await page.locator('[data-mood-next]').click();
 await page.locator('[data-mood-idea]').click();
 await expect(page.locator('[data-mood-ideas] li')).toHaveCount(24);
});
test('suicide bereavement and perinatal guides show prominent and appropriate safety notes',async({page})=>{
 for(const [id,part] of [['grief-after-suicide','suicidal'],['new-parent-identity','psychosis'],['menopause-life-change','medical']]){
  await open(page,id);
  await expect(page.locator('.ns-mood-safety')).toContainText(new RegExp(part,'i'));
 }
});
test('a non-clinical growth page has no serious or critical automated accessibility violations',async({page})=>{
 await open(page,'living-by-values');
 await page.locator('[data-mood-open="path-0"]').click();
 const audit=await new AxeBuilder({page}).include('.ns-mood').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(audit.violations.filter(v=>['serious','critical'].includes(v.impact)).map(v=>v.id)).toEqual([]);
});
