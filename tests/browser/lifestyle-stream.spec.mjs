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
 const emptyState=page.locator('.lifestyle-empty').first();
 await expect(emptyState).toBeVisible();
 expect(await emptyState.evaluate(el=>getComputedStyle(el).opacity)).toBe('1');
 expect(await page.locator('.calendar-weekdays').evaluate(el=>getComputedStyle(el).opacity)).toBe('1');
 const audit=await new AxeBuilder({page}).include('.lifestyle-page').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(audit.violations.filter(v=>['serious','critical'].includes(v.impact))).toEqual([]);
});

test('SimplyFocus switches inside Lifestyle without a standalone page and cleans up active timers',async({page})=>{
 await page.goto('/index.html#lifestyle');
 const daily=page.locator('[data-life-everyday]'),focus=page.locator('[data-life-focus-panel]');
 await expect(daily).toBeVisible();
 await expect(focus).toBeHidden();
 await page.locator('[data-life-mode="focus"]').click();
 await expect(page).toHaveURL(/#lifestyle$/);
 await expect(focus).toBeVisible();
 await expect(daily).toBeHidden();
 await expect(focus.locator('.simplyfocus-page')).toBeVisible();
 await expect(page.locator('#focus-tracks .focus-track')).toHaveCount(9);
 await expect(page.locator('#pomodoro-display')).toHaveText('25:00');
 await expect(page.locator('[data-life-mode="focus"]')).toHaveAttribute('aria-pressed','true');
 await page.locator('#pomodoro-start').click();
 await expect(page.locator('#pomodoro-start')).toContainText('Pause');
 await page.locator('[data-life-mode="daily"]').click();
 await expect(page).toHaveURL(/#lifestyle$/);
 await expect(daily).toBeVisible();
 await expect(focus).toBeHidden();
 await expect(page.locator('#pomodoro-display')).toHaveCount(0);
 await page.goto('/index.html#simplyfocus');
 await expect(page).toHaveURL(/#lifestyle\/focus$/);
 await expect(page.locator('[data-life-focus-panel] .simplyfocus-page')).toBeVisible();
 await page.locator('[data-life-mode="daily"]').click();
 await expect(page.locator('[data-life-everyday]')).toBeVisible();
});


test('Lifestyle tasks can move into SimplyFocus and return without data loss',async({page})=>{
 await page.goto('/index.html#lifestyle');
 const title='Prepare reading for tomorrow';
 await page.locator('#lifestyle-task-title').fill(title);
 await page.locator('#lifestyle-task-form button[type="submit"]').click();
 const task=page.locator('#lifestyle-task-list .lifestyle-task').filter({hasText:title});
 await expect(task).toBeVisible();
 await task.locator('[data-to-focus]').click();
 await page.locator('[data-life-mode="focus"]').click();
 await expect(page.locator('#pomodoro-task-list .pomodoro-task').filter({hasText:title})).toBeVisible();
 await page.locator('.pomodoro-task').filter({hasText:title}).getByRole('button',{name:'Move to Lifestyle'}).click();
 await page.locator('[data-life-mode="daily"]').click();
 await expect(page.locator('#lifestyle-task-list .lifestyle-task').filter({hasText:title})).toBeVisible();
});

test('Everyday and SimplyFocus fit narrow and wide screens without horizontal page scrolling',async({page})=>{
 for(const mode of ['daily','focus']){
  await page.goto('/index.html#lifestyle');
  if(mode==='focus')await page.locator('[data-life-mode="focus"]').click();
  await expect(page.locator('.lifestyle-page')).toBeVisible();
  const dimensions=await page.evaluate(()=>({
   viewport:document.documentElement.clientWidth,
   full:document.documentElement.scrollWidth,
   body:document.body.scrollWidth
  }));
  expect(dimensions.full,mode+' document overflow').toBeLessThanOrEqual(dimensions.viewport+3);
  expect(dimensions.body,mode+' body overflow').toBeLessThanOrEqual(dimensions.viewport+3);
 }
});

test('Lifestyle essentials remain visible with compact controls, and no duplicate focus empty state',async({page})=>{
 await page.goto('/index.html#lifestyle');
 await expect(page.locator('.life-dashboard-flow > .lifestyle-card')).toHaveCount(5);
 await expect(page.locator('.lifestyle-tool-shelf')).toHaveCount(0);
 await expect(page.locator('[data-life-focus-queue]')).toBeHidden();
 await expect(page.locator('.life-mode-switch button')).toHaveCount(2);
 await expect(page.locator('.life-today-strip')).toBeVisible();
 await expect(page.locator('#lifestyle-reminder-form')).toBeVisible();
 await expect(page.locator('.emotion-choice-grid label')).toHaveCount(12);
});

test('List / four quadrants toggle keeps the same task and its priority on reload',async({page})=>{
 await page.goto('/index.html#lifestyle');
 const name='Send the library book back';
 await page.locator('#lifestyle-task-title').fill(name);
 await page.locator('#lifestyle-task-priority').selectOption('do');
 await page.locator('#lifestyle-task-form button[type="submit"]').click();
 await page.locator('[data-task-view="quadrants"]').click();
 const board=page.locator('#lifestyle-quadrants');
 await expect(board).toBeVisible();
 await expect(board.locator('.life-quadrant')).toHaveCount(4);
 await expect(board.locator('.life-quadrant--do')).toContainText(name);
 await board.locator('.life-quadrant--do [data-task-priority]').selectOption('delegate');
 await expect(board.locator('.life-quadrant--delegate')).toContainText(name);
 await expect(board.locator('.life-quadrant--do')).not.toContainText(name);
 await page.locator('[data-task-view="list"]').click();
 await expect(page.locator('#lifestyle-task-list')).toContainText(name);
 await expect(page.locator('#lifestyle-quadrants')).toBeHidden();
 await page.reload();
 await expect(page.locator('#lifestyle-task-list [data-task-priority]')).toHaveValue('delegate');
 await page.locator('[data-task-view="quadrants"]').click();
 await expect(page.locator('.life-quadrant--delegate')).toContainText(name);
 await expect(page.locator('.life-quadrant--schedule')).toBeVisible();
});

test('existing uncategorised tasks can be sorted in place and stay classified after SimplyFocus transfer',async({page})=>{
 await page.goto('/index.html#lifestyle');
 const name='A task to classify later';
 await page.locator('#lifestyle-task-title').fill(name);
 await page.locator('#lifestyle-task-form button[type="submit"]').click();
 await page.locator('[data-task-view="quadrants"]').click();
 await expect(page.locator('.life-priority-inbox-panel')).toContainText(name);
 await page.locator('.life-priority-inbox-panel [data-task-priority]').selectOption('schedule');
 await expect(page.locator('.life-quadrant--schedule')).toContainText(name);
 await page.locator('.life-quadrant--schedule [data-to-focus]').click();
 await page.locator('[data-life-mode="focus"]').click();
 await expect(page.locator('#pomodoro-task-list')).toContainText(name);
 await page.locator('.pomodoro-task').filter({hasText:name}).getByRole('button',{name:'Move to Lifestyle'}).click();
 await page.locator('[data-life-mode="daily"]').click();
 await expect(page.locator('.life-quadrant--schedule')).toContainText(name);
});

test('Home primary button stays above the Compass and header does not show a second logo in guest profile control',async({page})=>{
 await page.goto('/index.html#home');
 const primary=page.locator('.ns-home-actions > .ns-home-primary');
 const compass=page.locator('.ns-home-actions > .ns-home-compass');
 await expect(primary).toBeVisible();
 await expect(compass).toBeVisible();
 const positions=await page.locator('.ns-home-actions').evaluate(el=>({
  primary:el.querySelector('.ns-home-primary').getBoundingClientRect().top,
  compass:el.querySelector('.ns-home-compass').getBoundingClientRect().top
 }));
 expect(positions.primary).toBeLessThanOrEqual(positions.compass);
 const profile=page.locator('.app-top-actions > .ns-account-trigger');
 await expect(profile).toHaveCount(1);
 await expect(profile).toBeVisible();
 const background=await profile.evaluate(el=>getComputedStyle(el,'::before').backgroundImage);
 expect(background).not.toContain('logo.png');
});

test('Compass graph has no two-axis sliders and selected feeling appears directly beneath it',async({page})=>{
 await page.goto('/index.html#compass');
 await page.locator('#compass-mood-before').fill('6');
 await page.locator('#compass-mood-start').click();
 await expect(page.locator('#pleasantness,#energy,#pleasantness-value,#energy-value')).toHaveCount(0);
 const plot=page.locator('#compass-plot'),detail=page.locator('.compass-card #compass-emotion-detail');
 await expect(plot).toBeVisible();
 await expect(detail).toBeVisible();
 expect(await plot.evaluate(el=>el.compareDocumentPosition(document.querySelector('.compass-card #compass-emotion-detail')) & Node.DOCUMENT_POSITION_FOLLOWING)).toBeTruthy();
 await expect(page.locator('#compass-feedback')).not.toContainText('Your position:');
 const before=await page.locator('#marker').evaluate(el=>el.style.left);
 await plot.focus();
 await page.keyboard.press('ArrowRight');
 await expect.poll(()=>page.locator('#marker').evaluate(el=>el.style.left)).not.toBe(before);
 await expect(detail.locator('.compass-profile-heading')).toBeVisible();
});
