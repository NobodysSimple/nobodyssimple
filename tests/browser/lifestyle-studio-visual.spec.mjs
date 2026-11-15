import {test,expect} from '@playwright/test';

test('Lifestyle Studio uses the new illustrated hero and preserved five actual everyday panels',async({page})=>{
 await page.setViewportSize({width:1720,height:1000});
 await page.goto('/index.html#lifestyle');
 const root=page.locator('.life-unified');
 await expect(root).toBeVisible();
 const header=root.locator('.life-page-header');
 await expect(header).toBeVisible();
 const image=await header.evaluate(el=>getComputedStyle(el).backgroundImage);
 expect(image).toContain('lifestyle-art/studio-window.svg');
 for(const name of ['lifestyle-deed','lifestyle-tasks','lifestyle-checkin','lifestyle-calendar','lifestyle-reminders']){
  await expect(root.locator('#'+name)).toBeVisible();
 }
 await expect(root.locator('.life-mode-switch button')).toHaveCount(2);
 await expect(root.locator('.emotion-choice-grid label')).toHaveCount(12);
 await expect(root.locator('.calendar-grid .calendar-day')).toHaveCount(42);
 await expect(root.locator('#lifestyle-task-form input')).toHaveCount(4);
 await expect(root.locator('#lifestyle-reminder-form button')).toHaveCount(2);
 const practice=await root.locator('#lifestyle-deed').boundingBox();
 const tasks=await root.locator('#lifestyle-tasks').boundingBox();
 expect(practice.x+practice.width).toBeLessThanOrEqual(tasks.x+12);
 expect(Math.abs(practice.y-tasks.y)).toBeLessThanOrEqual(10);
});
test('Actual identity practice, tasks and check-in remain operable inside the new layout',async({page})=>{
 await page.goto('/index.html#lifestyle');
 await page.locator('#lifestyle-task-title').fill('Studio visual regression task');
 await page.locator('#lifestyle-task-form button[type="submit"]').click();
 await expect(page.locator('#lifestyle-task-list')).toContainText('Studio visual regression task');
 await page.locator('[data-task-view="quadrants"]').click();
 await expect(page.locator('#lifestyle-tasks')).toHaveClass(/is-matrix-mode/);
 await expect(page.locator('#lifestyle-quadrants')).toBeVisible();
 await page.locator('[data-task-view="list"]').click();
 await expect(page.locator('#lifestyle-task-form')).toBeVisible();
 await page.locator('[data-check-mode="evening"]').click();
 await expect(page.locator('#lifestyle-checkin-title')).toContainText('Evening');
 await page.locator('[data-check-mode="daytime"]').click();
 await expect(page.locator('#lifestyle-checkin-title')).toContainText('Daytime');
 await expect(page.locator('#lifestyle-reminder-form')).toBeVisible();
});
test('SimplyFocus keeps all live mixer, breathing and Pomodoro controls in a styled workspace',async({page})=>{
 await page.setViewportSize({width:1720,height:1050});
 await page.goto('/index.html#lifestyle');
 await page.locator('[data-life-mode="focus"]').click();
 const root=page.locator('.life-focus-host');
 await expect(root.locator('.simplyfocus-page')).toBeVisible();
 expect(await root.locator('.simplyfocus-page').evaluate(el=>getComputedStyle(el).display)).toBe('grid');
 await expect(root.locator('.focus-track')).toHaveCount(9);
 await expect(root.locator('#focus-master')).toBeVisible();
 await expect(root.locator('#focus-play')).toBeVisible();
 await expect(root.locator('#focus-save')).toBeVisible();
 await expect(root.locator('#focus-breath-start')).toBeVisible();
 await expect(root.locator('#focus-breath-reset')).toBeVisible();
 await expect(root.locator('#pomodoro-start')).toBeVisible();
 await expect(root.locator('#pomodoro-reset')).toBeVisible();
 await expect(root.locator('#pomodoro-task-form')).toBeVisible();
 await expect(root.locator('#pomodoro-project-form')).toBeVisible();
 const breath=await root.locator('.timed-breathing-card').boundingBox();
 const timer=await root.locator('.pomodoro-card').boundingBox();
 expect(breath.x+breath.width).toBeLessThanOrEqual(timer.x+12);
 await page.locator('[data-life-mode="daily"]').click();
 await expect(root.locator('.simplyfocus-page')).toHaveCount(0);
 await expect(page.locator('#lifestyle-deed')).toBeVisible();
});
test('Both modes fit narrow mobile screens without clipping the preserved controls',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/index.html#lifestyle');
 for(const id of ['lifestyle-deed','lifestyle-tasks','lifestyle-checkin','lifestyle-calendar','lifestyle-reminders']){
  await expect(page.locator('#'+id)).toBeVisible();
 }
 const flow=await page.locator('.life-dashboard-flow').evaluate(el=>getComputedStyle(el).gridTemplateColumns);
 expect(flow.split(' ').length).toBeLessThanOrEqual(2);
 let dimensions=await page.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);
 expect(dimensions[1]).toBeLessThanOrEqual(dimensions[0]+3);
 await page.locator('[data-life-mode="focus"]').click();
 await expect(page.locator('.focus-tracks .focus-track')).toHaveCount(9);
 await expect(page.locator('#pomodoro-task-form')).toBeVisible();
 dimensions=await page.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);
 expect(dimensions[1]).toBeLessThanOrEqual(dimensions[0]+3);
});
test('Original assets load and Lifestyle artwork stays exclusive to Lifestyle',async({page})=>{
 for(const path of ['studio-window.svg','studio-meadow.svg']){
  const res=await page.request.get('/lifestyle-art/'+path);
  expect(res.status(),path).toBe(200);
  const svg=await res.text();
  expect(svg).toContain('<svg');
  const valid=await page.evaluate(xml=>{
   const doc=new DOMParser().parseFromString(xml,'image/svg+xml');
   return doc.documentElement.localName==='svg' && !doc.querySelector('parsererror');
  },svg);
  expect(valid,'Valid SVG XML: '+path).toBe(true);
 }
 const css=await page.request.get('/ns-lifestyle-studio.css');
 expect(css.status()).toBe(200);
 await page.goto('/index.html#home');
 await expect(page.locator('.life-unified')).toHaveCount(0);
 await expect(page.locator('.ns-home-refined')).toBeVisible();
 await page.goto('/index.html#learn');
 await expect(page.locator('.life-unified')).toHaveCount(0);
 await page.goto('/index.html#guide');
 await expect(page.locator('.ns-guide6-journal')).toBeVisible();
 await expect(page.locator('.life-unified')).toHaveCount(0);
});
