import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Home is uncluttered and Lifestyle gets a dedicated mobile bottom button',async({page})=>{
 await page.goto('/index.html#home');
 await expect(page.locator('.ns-home-lifestyle')).toHaveCount(0);
 await expect(page.locator('.app-bottom-nav a')).toHaveCount(4);
 await expect(page.locator('.app-bottom-nav a[href="#lifestyle"]')).toHaveCount(1);
 await expect(page.locator('.app-nav-primary a[href="#lifestyle"]')).toHaveCount(1);
});

test('Lifestyle keeps daily essentials on screen without tab switching or hidden forms',async({page})=>{
 await page.goto('/index.html#lifestyle');
 await expect(page.locator('#lifestyle-deed-title')).toBeVisible();
 const flow=page.locator('.life-dashboard-flow');
 await expect(flow).toBeVisible();
 for(const id of ['lifestyle-deed','lifestyle-checkin','lifestyle-tasks','lifestyle-calendar','lifestyle-reminders']){
  await expect(flow.locator('#'+id)).toBeVisible();
  await expect(flow.locator('#'+id)).not.toHaveAttribute('hidden','');
 }
 await expect(page.locator('.lifestyle-tabs,[data-life-panel]')).toHaveCount(0);
 await expect(page.locator('#lifestyle-intensity')).toBeVisible();
 await expect(page.locator('#lifestyle-note')).toBeVisible();
 await expect(page.locator('#lifestyle-task-title')).toBeVisible();
 const audit=await new AxeBuilder({page}).include('.lifestyle-page').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(audit.violations.filter(v=>['serious','critical'].includes(v.impact))).toEqual([]);
});

test('Switching to SimplyFocus uses the same Lifestyle page and stops the independent route',async({page})=>{
 await page.goto('/index.html#lifestyle');
 await page.locator('.life-mode-switch a[href="#lifestyle/focus"]').click();
 await expect(page).toHaveURL(/#lifestyle\/focus$/);
 await expect(page.locator('[data-life-focus-host] .simplyfocus-page')).toBeVisible();
 await expect(page.locator('#focus-tracks .focus-track')).toHaveCount(9);
 await expect(page.locator('#pomodoro-display')).toHaveText('25:00');
 await expect(page.locator('.life-mode-switch a[aria-current="page"]')).toContainText('SimplyFocus');
 await page.locator('#pomodoro-start').click();
 await expect(page.locator('#pomodoro-start')).toContainText('Pause');
 await page.locator('.life-mode-switch a[href="#lifestyle"]').click();
 await expect(page).toHaveURL(/#lifestyle$/);
 await expect(page.locator('.life-dashboard-flow')).toBeVisible();
 await expect(page.locator('#pomodoro-display')).toHaveCount(0);
 await page.goto('/index.html#simplyfocus');
 await expect(page).toHaveURL(/#lifestyle\/focus$/);
 await expect(page.locator('[data-life-focus-host] .simplyfocus-page')).toBeVisible();
});

test('Lifestyle tasks can move into SimplyFocus and return without data loss',async({page})=>{
 await page.goto('/index.html#lifestyle');
 const title='Prepare reading for tomorrow';
 await page.locator('#lifestyle-task-title').fill(title);
 await page.locator('#lifestyle-task-form button[type="submit"]').click();
 const task=page.locator('#lifestyle-task-list .lifestyle-task').filter({hasText:title});
 await expect(task).toBeVisible();
 await task.locator('[data-to-focus]').click();
 await page.locator('.life-mode-switch a[href="#lifestyle/focus"]').click();
 await expect(page.locator('#pomodoro-task-list .pomodoro-task').filter({hasText:title})).toBeVisible();
 await page.locator('.pomodoro-task').filter({hasText:title}).getByRole('button',{name:'Move to Lifestyle'}).click();
 await page.locator('.life-mode-switch a[href="#lifestyle"]').click();
 await expect(page.locator('#lifestyle-task-list .lifestyle-task').filter({hasText:title})).toBeVisible();
});

test('Everyday and SimplyFocus fit narrow and wide screens without horizontal page scrolling',async({page})=>{
 for(const hash of ['lifestyle','lifestyle/focus']){
  await page.goto('/index.html#'+hash);
  await expect(page.locator('.lifestyle-page')).toBeVisible();
  const dimensions=await page.evaluate(()=>({
   viewport:document.documentElement.clientWidth,
   full:document.documentElement.scrollWidth,
   body:document.body.scrollWidth
  }));
  expect(dimensions.full,hash+' document overflow').toBeLessThanOrEqual(dimensions.viewport+3);
  expect(dimensions.body,hash+' body overflow').toBeLessThanOrEqual(dimensions.viewport+3);
 }
});
