import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const go=async(page,route)=>{
 await page.goto('/index.html#'+route);
 await expect(page.locator('[data-workbook]')).toBeVisible();
};
const game=async(page,id)=>{
 const open=page.locator('[data-game-open="'+id+'"]');
 await expect(open).toBeVisible();
 await open.click();
 await expect(page.locator('[data-game-active="'+id+'"]')).toBeVisible();
};
test('Emotion Compass remains on Home while the Lifestyle CTA and hypothesis card are removed',async({page})=>{
 await page.goto('/index.html#home');
 const lifestyle=page.locator('.ns-home-lifestyle');
 const compass=page.locator('.ns-home-compass');
 await expect(lifestyle).toHaveCount(0);
 await expect(page.locator('.ns-home-hypothesis')).toHaveCount(0);
 await expect(compass).toBeVisible();
 await expect(compass).toContainText('Emotion Compass');
 const order=await compass.evaluate(el=>({
  here:[...el.parentElement.children].indexOf(el),
  lifestyle:[...el.parentElement.children].indexOf(el.parentElement.querySelector('.ns-home-lifestyle'))
 }));
 expect(order.here).toBe(order.primary+1);
 await expect(page.locator('.ns-home-shortcuts a[href="#tools"]')).toHaveCount(0);
 await compass.click();
 await expect(page).toHaveURL(/#compass$/);
 await expect(page.locator('#compass-mood-before')).toBeVisible();
 await page.locator('#compass-mood-before').fill('6');
 await page.locator('#compass-mood-start').click();
 await expect(page.locator('#compass-plot')).toBeVisible();
});
test('old Browse tools route now enters the choice-led console instead',async({page})=>{
 await page.goto('/index.html#tools');
 await expect(page).toHaveURL(/#navigate$/);
 await expect(page.locator('.ns-needs')).toBeVisible();
});
test('an independent Games scroller sits after the worksheet area on several routes',async({page})=>{
 for(const route of ['workbook/regulate/overwhelmed','workbook/act/begin','workbook/learn/sleep',
  'workbook/process/grief','workbook-topic/procrastination','workbook-topic/insomnia','workbook-topic/anxiety']){
  await go(page,route);
  await expect(page.locator('.ns-pick-chooser')).toBeVisible();
  const worksheet=page.locator('#ns-pick-selected');
  const games=page.locator('.ns-game-carousel');
  await expect(worksheet).toBeVisible();
  await expect(games).toBeVisible();
  expect(await games.locator('[data-game-card]').count(),route).toBeGreaterThanOrEqual(5);
  await expect(games.locator('textarea,input')).toHaveCount(0);
  await expect(worksheet.locator('.ns-pick-empty')).toBeVisible();
  const before=await games.evaluate(el=>el.compareDocumentPosition(document.querySelector('#ns-pick-selected')));
  expect((before&2)!==0,route).toBeTruthy(); // DOM Node.DOCUMENT_POSITION_PRECEDING
 }
});
test('games horizontally scroll, filter independently and open exactly one no-writing interaction',async({page})=>{
 await go(page,'workbook-topic/procrastination');
 const track=page.locator('[data-game-track]');
 const origin=await track.evaluate(x=>x.scrollLeft);
 await page.locator('[data-game-direction="1"]').click();
 await expect.poll(()=>track.evaluate(x=>x.scrollLeft)).toBeGreaterThan(origin);
 await page.locator('[data-game-filter="play"]').click();
 await expect(page.locator('[data-game-filter="play"]')).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('[data-game-open="colour-mosaic"]')).toBeVisible();
 await game(page,'colour-mosaic');
 await expect(page.locator('[data-game-active]')).toHaveCount(1);
 await expect(page.locator('[data-pick-field]')).toHaveCount(0);
 const cell=page.locator('.ns-game-mosaic button').first();
 const before=await cell.evaluate(el=>el.style.background);
 await cell.click();
 const after=await cell.evaluate(el=>el.style.background);
 expect(after).not.toBe(before);
 await page.locator('[data-game-action="reset"]').click();
 await expect(page.locator('.ns-game-mosaic button')).toHaveCount(12);
 await page.locator('[data-game-close]').click();
 await expect(page.locator('[data-game-active]')).toHaveCount(0);
});
test('breathing visual is optional, user-started, pausable and has no breath-holding requirement',async({page})=>{
 await go(page,'workbook-topic/anxiety');
 await game(page,'breath-garden');
 await expect(page.locator('.ns-game-breath')).not.toHaveClass(/is-playing/);
 await expect(page.locator('.ns-game-breath')).toContainText(/breathe naturally/i);
 await page.locator('[data-game-action="toggle"]').click();
 await expect(page.locator('.ns-game-breath')).toHaveClass(/is-playing/);
 await page.locator('[data-game-action="pace"][data-game-choice="slow"]').click();
 await expect(page.locator('[data-game-action="pace"][data-game-choice="slow"]')).toHaveAttribute('aria-pressed','true');
 await page.locator('[data-game-action="toggle"]').click();
 await expect(page.locator('.ns-game-breath')).not.toHaveClass(/is-playing/);
 await expect(page.locator('[data-game-active]')).toHaveCount(1);
});
test('sensory mode offers visual environmental control without forced breathing or flashing',async({page})=>{
 await go(page,'workbook-topic/sensory');
 await expect(page.locator('[data-game-card="star-garden"]')).toHaveCount(0);
 await expect(page.locator('[data-game-card="steady-taps"]')).toHaveCount(0);
 await game(page,'quiet-room');
 const room=page.locator('.ns-game-room-scene');
 await page.locator('[data-game-action="room"][data-game-choice="light"]').click();
 await expect(room).toHaveClass(/dim/);
 await page.locator('[data-game-action="room"][data-game-choice="still"]').click();
 await expect(room).toHaveClass(/still/);
 await page.locator('[data-game-action="room"][data-game-choice="muted"]').click();
 await expect(room).toHaveClass(/muted/);
 await page.locator('[data-game-action="reset"]').click();
 await expect(room).not.toHaveClass(/dim/);
});
test('gentle concentration games have actual playable interactions and no score',async({page})=>{
 await go(page,'workbook-topic/procrastination');
 await game(page,'finger-trail');
 const board=page.locator('.ns-game-trail-board');
 await expect(board).toHaveAttribute('aria-label',/row 1, column 1/);
 await page.locator('[data-game-action="move"][data-game-choice="right"]').click();
 await expect(board).toHaveAttribute('aria-label',/row 1, column 2/);
 await page.locator('[data-game-close]').click();
 await game(page,'pair-garden');
 await expect(page.locator('.ns-game-pair-board button')).toHaveCount(12);
 await page.locator('[data-game-action="pair"][data-game-choice="0"]').click();
 await expect(page.locator('[data-game-action="pair"][data-game-choice="0"]')).toHaveAttribute('aria-pressed','true');
 await page.locator('[data-game-action="pair"][data-game-choice="8"]').click();
 await expect(page.locator('[data-game-action="pair"][data-game-choice="0"]')).toBeDisabled();
 await expect(page.locator('[data-game-action="pair"][data-game-choice="8"]')).toBeDisabled();
});
test('game and worksheet do not destroy each other’s state in the current open page',async({page})=>{
 await go(page,'workbook/act/begin');
 await page.locator('[data-pick-open="source-context-0"]').click();
 await page.locator('[data-pick-choose="source-context-0"]').click();
 await page.locator('[data-pick-field="condition"]').fill('A private existing note');
 await game(page,'choice-path');
 await page.locator('[data-game-action="path"][data-game-choice="1"]').click();
 await expect(page.locator('.ns-game-path-stone.filled')).toHaveCount(1);
 await expect(page.locator('[data-pick-field="condition"]')).toHaveValue('A private existing note');
 await page.reload();
 await expect(page.locator('.ns-pick-empty')).toBeVisible();
 await expect(page.locator('[data-game-active]')).toHaveCount(0);
});
test('compulsive checking and safety-first pages do not offer potentially aggravating games',async({page})=>{
 await go(page,'workbook-topic/checking');
 for(const id of ['steady-taps','pair-garden','focus-finder']){
  await expect(page.locator('[data-game-card="'+id+'"]')).toHaveCount(0);
 }
 for(const route of ['workbook/relate/unsafe','workbook-topic/suicidal-thoughts','workbook-topic/voices']){
  await go(page,route);
  await expect(page.locator('.ns-pick-care-first')).toBeVisible();
  await expect(page.locator('.ns-game-carousel')).toHaveCount(0);
 }
});
test('mobile and desktop games fit their page and avoid serious accessibility failures',async({page})=>{
 for(const route of ['workbook/regulate/overwhelmed','workbook-topic/procrastination']){
  await go(page,route);
  const layout=await page.locator('.ns-game-carousel').evaluate(el=>({
   width:el.clientWidth,scroll:el.scrollWidth,left:el.getBoundingClientRect().left,
   right:el.getBoundingClientRect().right,viewport:innerWidth
  }));
  expect(layout.scroll,route).toBeLessThanOrEqual(layout.width+2);
  expect(layout.left,route).toBeGreaterThanOrEqual(-2);
  expect(layout.right,route).toBeLessThanOrEqual(layout.viewport+2);
  let audit=await new AxeBuilder({page}).include('.ns-game-carousel').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  let serious=audit.violations.filter(v=>['serious','critical'].includes(v.impact));
  expect(serious,JSON.stringify({route,serious:serious.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary})).slice(0,4)}))},null,2)).toEqual([]);
  await game(page,'quiet-room');
  audit=await new AxeBuilder({page}).include('.ns-game-carousel').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  serious=audit.violations.filter(v=>['serious','critical'].includes(v.impact));
  expect(serious,JSON.stringify({route,serious:serious.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary})).slice(0,4)}))},null,2)).toEqual([]);
 }
});
